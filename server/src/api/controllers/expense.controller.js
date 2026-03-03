const prisma = require('../../../prisma.config');
const {
  parseExpenseWithSarvam,
  transcribeAudioWithSarvam,
} = require('../../services/sarvam.service');

const MAX_AUDIO_SIZE_BYTES = 8 * 1024 * 1024;

const extractAudioPayload = async (req) => {
  const contentType = req.headers['content-type'] || '';
  const isMultipart = contentType.includes('multipart/form-data');

  if (!isMultipart) {
    return {
      audioBuffer: null,
      fileName: null,
      mimeType: null,
      fallbackTranscript: String(req.body?.fallback_transcript || '').trim(),
      languageCode: req.body?.language_code || 'unknown',
    };
  }

  const request = new Request(`http://localhost${req.originalUrl}`, {
    method: req.method,
    headers: req.headers,
    body: req,
    duplex: 'half',
  });

  const formData = await request.formData();
  const audioFile = formData.get('audio');

  if (!audioFile || typeof audioFile.arrayBuffer !== 'function') {
    return {
      audioBuffer: null,
      fileName: null,
      mimeType: null,
      fallbackTranscript: String(formData.get('fallback_transcript') || '').trim(),
      languageCode: String(formData.get('language_code') || 'unknown'),
    };
  }

  const arrayBuffer = await audioFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return {
    audioBuffer: buffer,
    fileName: audioFile.name || 'recording.webm',
    mimeType: audioFile.type || 'audio/webm',
    fallbackTranscript: String(formData.get('fallback_transcript') || '').trim(),
    languageCode: String(formData.get('language_code') || 'unknown'),
  };
};

const addExpenseFromVoice = async (req, res) => {
  const { transcript } = req.body;
  const userId = req.user.userId;

  if (!transcript) {
    console.log('❌ [API] Missing transcript in request body');
    return res.status(400).json({ error: 'Transcript is required.' });
  }

  console.log('🎤 [API] Received transcript:', transcript);

  try {
    const parseResult = await parseExpenseWithSarvam(transcript);
    const parsedData = parseResult?.items || [];
    const parseMeta = parseResult?.meta || {};
    console.log('🤖 [API] Sarvam Parsed Data:', JSON.stringify(parsedData, null, 2));

    const expensesToCreate = Array.isArray(parsedData) ? parsedData : [parsedData];
    const createdExpenses = [];

    for (const expense of expensesToCreate) {
      console.log('📦 [API] Processing expense:', expense);

      if (!expense || typeof expense !== 'object') {
        console.warn('⚠️ [API] Invalid expense object:', expense);
        continue;
      }

      if (expense.is_unclear) {
        console.warn('⚠️ [API] Expense marked unclear, skipping');
        continue;
      }

      if (!expense.amount || expense.amount <= 0 || isNaN(expense.amount)) {
        console.warn('⚠️ [API] Expense rejected: Invalid amount', expense.amount);
        continue;
      }

      const newExpense = await prisma.expense.create({
        data: {
          userId: userId,
          amount: expense.amount,
          category: expense.category || 'Other',
          description: expense.description || transcript.substring(0, 50),
          location: expense.location || null,
          ...(expense.date && { date: new Date(expense.date) }),
          is_unclear: false,
          source: 'voice',
          parsed_by: parseMeta.fallbackUsed ? 'regex-fallback' : (parseMeta.model || 'sarvam-m'),
        }
      });
      console.log('✅ [API] Created expense:', newExpense.id);
      createdExpenses.push(newExpense);
    }

    if (createdExpenses.length === 0) {
      console.log('❌ [API] No valid expenses created from:', transcript);
      return res.status(400).json({
        error: "Could not understand a valid expense from the transcript.",
        is_unclear: true,
        parsed: parsedData,
        meta: {
          provider: parseMeta.provider || 'sarvam',
          model: parseMeta.model || 'sarvam-m',
          fallbackUsed: Boolean(parseMeta.fallbackUsed),
          normalizationApplied: Boolean(parseMeta.normalizationApplied),
          error_code: 'PARSER_UNAVAILABLE',
        },
      });
    }

    res.status(201).json({
      message: 'Expenses added successfully',
      expenses: createdExpenses,
      count: createdExpenses.length,
      meta: {
        provider: parseMeta.provider || 'sarvam',
        model: parseMeta.model || 'sarvam-m',
        fallbackUsed: Boolean(parseMeta.fallbackUsed),
        normalizationApplied: Boolean(parseMeta.normalizationApplied),
      },
    });

  } catch (error) {
    console.error('❌ [API] Error in addExpenseFromVoice:', error.message);
    res.status(503).json({
      error: 'Expense parser unavailable. Please try again.',
      error_code: 'PARSER_UNAVAILABLE',
      meta: {
        provider: 'sarvam',
        fallbackUsed: false,
      },
    });
  }
};

const transcribeVoiceAudio = async (req, res) => {
  let audioPayload;
  try {
    audioPayload = await extractAudioPayload(req);
  } catch (error) {
    return res.status(400).json({
      error: 'Invalid multipart audio payload.',
      error_code: 'INVALID_AUDIO_FORMAT',
    });
  }

  const {
    audioBuffer,
    fileName,
    mimeType,
    fallbackTranscript,
    languageCode,
  } = audioPayload;

  if (!audioBuffer) {
    return res.status(400).json({
      error: 'Audio file is required.',
      error_code: 'INVALID_AUDIO_FORMAT',
    });
  }

  if (!mimeType || !mimeType.startsWith('audio/')) {
    return res.status(415).json({
      error: 'Unsupported audio format.',
      error_code: 'INVALID_AUDIO_FORMAT',
    });
  }

  if (audioBuffer.length > MAX_AUDIO_SIZE_BYTES) {
    return res.status(413).json({
      error: 'Audio exceeds 8MB limit.',
      error_code: 'INVALID_AUDIO_FORMAT',
    });
  }

  try {
    const result = await transcribeAudioWithSarvam({
      fileBuffer: audioBuffer,
      fileName,
      mimeType,
      languageCode,
    });

    if (!result.transcript && fallbackTranscript) {
      return res.status(200).json({
        transcript: fallbackTranscript,
        meta: {
          provider: 'sarvam-stt',
          model: result.model,
          fallbackUsed: true,
          error_code: 'STT_UNAVAILABLE',
        },
      });
    }

    if (!result.transcript) {
      return res.status(503).json({
        error: 'Speech-to-text did not return a transcript.',
        error_code: 'STT_UNAVAILABLE',
      });
    }

    return res.status(200).json({
      transcript: result.transcript,
      meta: {
        provider: 'sarvam-stt',
        model: result.model,
        fallbackUsed: false,
      },
    });
  } catch (error) {
    console.error('❌ [API] STT error:', error.message);
    if (fallbackTranscript) {
      return res.status(200).json({
        transcript: fallbackTranscript,
        meta: {
          provider: 'sarvam-stt',
          model: process.env.SARVAM_STT_MODEL || 'saarika:v2.5',
          fallbackUsed: true,
          error_code: 'STT_UNAVAILABLE',
        },
      });
    }

    return res.status(503).json({
      error: 'Speech-to-text service unavailable. Please retry.',
      error_code: 'STT_UNAVAILABLE',
    });
  }
};

const getAllExpenses = async (req, res) => {
  const userId = req.user.userId;
  try {
    const expenses = await prisma.expense.findMany({
      where: { userId: userId },
      orderBy: { date: 'desc' },
    });
    res.status(200).json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses.' });
  }
};

module.exports = {
  addExpenseFromVoice,
  getAllExpenses,
  transcribeVoiceAudio,
};

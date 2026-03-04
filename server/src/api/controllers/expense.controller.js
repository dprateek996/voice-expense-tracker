const prisma = require('../../../prisma.config');
const {
  parseExpenseWithSarvam,
  transcribeAudioWithSarvam,
} = require('../../services/sarvam.service');

const MAX_AUDIO_SIZE_BYTES = 8 * 1024 * 1024;

const sanitizeText = (value) => String(value || '')
  .replace(/<[^>]*>/g, '')
  .replace(/[<>]/g, '')
  .trim();

const normalizeDraftExpense = (draft, transcriptFallback = '') => {
  if (!draft || typeof draft !== 'object') return null;

  const amount = Number(draft.amount);
  if (!Number.isFinite(amount) || amount <= 0) return null;

  const description = String(draft.description || transcriptFallback || 'Expense').trim().slice(0, 120);
  const category = String(draft.category || 'Other').trim() || 'Other';

  return {
    amount,
    category,
    description,
    location: draft.location ? String(draft.location).slice(0, 100) : null,
    date: draft.date || null,
    subcategory: draft.subcategory ? String(draft.subcategory).slice(0, 80) : 'Misc',
    is_unclear: false,
  };
};

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
  const {
    transcript,
    forceSave = false,
    draft = null,
  } = req.body;
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

    const parsedPrimary = Array.isArray(parsedData) && parsedData.length > 0 ? parsedData[0] : null;
    const resolvedDisplayTranscript = parseMeta.displayTranscript || transcript;
    const reviewedDraft = normalizeDraftExpense(draft, resolvedDisplayTranscript);

    if (parseMeta.reviewRequired && forceSave && !reviewedDraft) {
      return res.status(400).json({
        error: 'Reviewed draft is required to save low-confidence expense.',
        error_code: 'PARSER_LOW_CONFIDENCE',
      });
    }

    if (parseMeta.reviewRequired && !forceSave && !reviewedDraft) {
      return res.status(409).json({
        error: 'Low confidence parse. Review and confirm before saving.',
        error_code: 'PARSER_LOW_CONFIDENCE',
        transcript: resolvedDisplayTranscript,
        draft: normalizeDraftExpense(parsedPrimary, resolvedDisplayTranscript),
        meta: {
          provider: parseMeta.provider || 'sarvam',
          model: parseMeta.model || 'sarvam-m',
          fallbackUsed: Boolean(parseMeta.fallbackUsed),
          normalizationApplied: Boolean(parseMeta.normalizationApplied),
          languageStyle: parseMeta.languageStyle || 'english',
          confidence: Number(parseMeta.confidence || 0),
          reviewRequired: true,
          subcategory: parseMeta.subcategory || parsedPrimary?.subcategory || 'Misc',
        },
      });
    }

    const expensesToCreate = reviewedDraft
      ? [reviewedDraft]
      : (Array.isArray(parsedData) ? parsedData : [parsedData]);
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
          description: expense.description || resolvedDisplayTranscript.substring(0, 50),
          location: expense.location || null,
          ...(expense.date && { date: new Date(expense.date) }),
          is_unclear: false,
          source: 'voice',
          parsed_by: reviewedDraft
            ? 'manual-review'
            : (parseMeta.fallbackUsed ? 'regex-fallback' : (parseMeta.model || 'sarvam-m')),
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
          languageStyle: parseMeta.languageStyle || 'english',
          confidence: Number(parseMeta.confidence || 0),
          reviewRequired: Boolean(parseMeta.reviewRequired),
          subcategory: parseMeta.subcategory || parsedPrimary?.subcategory || 'Misc',
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
        languageStyle: parseMeta.languageStyle || 'english',
        confidence: Number(parseMeta.confidence || 0),
        reviewRequired: Boolean(parseMeta.reviewRequired),
        subcategory: parseMeta.subcategory || parsedPrimary?.subcategory || 'Misc',
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

const previewVoiceExpense = async (req, res) => {
  const { transcript } = req.body;

  if (!transcript) {
    return res.status(400).json({ error: 'Transcript is required.' });
  }

  try {
    const parseResult = await parseExpenseWithSarvam(transcript);
    const parseMeta = parseResult?.meta || {};
    const parsedData = parseResult?.items || [];
    const parsedPrimary = Array.isArray(parsedData) && parsedData.length > 0 ? parsedData[0] : null;
    const draft = normalizeDraftExpense(parsedPrimary, parseMeta.displayTranscript || transcript);

    return res.status(200).json({
      transcript: parseMeta.displayTranscript || transcript,
      draft,
      parsed: parsedData,
      meta: {
        provider: parseMeta.provider || 'sarvam',
        model: parseMeta.model || 'sarvam-m',
        fallbackUsed: Boolean(parseMeta.fallbackUsed),
        normalizationApplied: Boolean(parseMeta.normalizationApplied),
        languageStyle: parseMeta.languageStyle || 'english',
        confidence: Number(parseMeta.confidence || 0),
        reviewRequired: Boolean(parseMeta.reviewRequired),
        subcategory: parseMeta.subcategory || parsedPrimary?.subcategory || 'Misc',
      },
    });
  } catch (error) {
    return res.status(503).json({
      error: 'Expense parser unavailable. Please try again.',
      error_code: 'PARSER_UNAVAILABLE',
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
        languageStyle: result.languageStyle || 'english',
        normalizationApplied: Boolean(result.normalizationApplied),
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

const updateExpense = async (req, res) => {
  const userId = req.user.userId;
  const expenseId = Number(req.params.id);

  if (!expenseId || !Number.isFinite(expenseId)) {
    return res.status(400).json({ error: 'Valid expense ID is required.' });
  }

  try {
    const existing = await prisma.expense.findUnique({ where: { id: expenseId } });
    if (!existing) return res.status(404).json({ error: 'Expense not found.' });
    if (existing.userId !== userId) return res.status(403).json({ error: 'Not authorized to update this expense.' });

    const updates = {};
    if (req.body.amount !== undefined) {
      const amount = Number(req.body.amount);
      if (!Number.isFinite(amount) || amount <= 0) return res.status(400).json({ error: 'Amount must be a positive number.' });
      updates.amount = amount;
    }
    if (req.body.category !== undefined) updates.category = sanitizeText(req.body.category).slice(0, 50) || 'Other';
    if (req.body.description !== undefined) updates.description = sanitizeText(req.body.description).slice(0, 120) || 'Expense';
    if (req.body.location !== undefined) updates.location = req.body.location ? sanitizeText(req.body.location).slice(0, 100) : null;
    if (req.body.date !== undefined) updates.date = new Date(req.body.date);

    const updated = await prisma.expense.update({ where: { id: expenseId }, data: updates });
    res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ error: 'Failed to update expense.' });
  }
};

const deleteExpense = async (req, res) => {
  const userId = req.user.userId;
  const expenseId = Number(req.params.id);

  if (!expenseId || !Number.isFinite(expenseId)) {
    return res.status(400).json({ error: 'Valid expense ID is required.' });
  }

  try {
    const existing = await prisma.expense.findUnique({ where: { id: expenseId } });
    if (!existing) return res.status(404).json({ error: 'Expense not found.' });
    if (existing.userId !== userId) return res.status(403).json({ error: 'Not authorized to delete this expense.' });

    await prisma.expense.delete({ where: { id: expenseId } });
    res.status(200).json({ message: 'Expense deleted.' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Failed to delete expense.' });
  }
};

module.exports = {
  addExpenseFromVoice,
  previewVoiceExpense,
  getAllExpenses,
  transcribeVoiceAudio,
  updateExpense,
  deleteExpense,
};

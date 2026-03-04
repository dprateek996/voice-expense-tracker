const {
  CANONICAL_EXPENSE_CATEGORIES,
} = require('../constants/indian-expense-lexicon');
const {
  normalizeTranscriptStyle,
  sanitizeTranscript,
} = require('./transcript-normalization.service');
const {
  normalizeModelExpenseObject,
  parseDeterministicExpense,
  reconcileExpenseCandidates,
} = require('./expense-parser-india.service');

const SARVAM_API_KEY = process.env.SARVAM_API_KEY;
const SARVAM_BASE_URL = process.env.SARVAM_BASE_URL || 'https://api.sarvam.ai';
const SARVAM_CHAT_MODEL = process.env.SARVAM_CHAT_MODEL || 'sarvam-m';
const SARVAM_STT_MODEL = process.env.SARVAM_STT_MODEL || 'saarika:v2.5';
const SARVAM_STT_LANGUAGE_CODE = process.env.SARVAM_STT_LANGUAGE_CODE || 'unknown';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const safeJsonParse = (text) => {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (_) {
    const match = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (!match) return null;
    try {
      return JSON.parse(match[1]);
    } catch (_) {
      return null;
    }
  }
};

const getChatUrl = () => `${SARVAM_BASE_URL.replace(/\/$/, '')}/v1/chat/completions`;
const getSttUrl = () => `${SARVAM_BASE_URL.replace(/\/$/, '')}/speech-to-text`;

const assertSarvamKey = () => {
  if (!SARVAM_API_KEY) {
    const err = new Error('SARVAM_API_KEY is missing');
    err.code = 'MISSING_SARVAM_API_KEY';
    throw err;
  }
};

const truncateForLog = (text) => String(text || '').slice(0, 100);

const logParserEvent = (payload) => {
  try {
    console.info(
      `[PARSER] ${JSON.stringify({
        provider: 'sarvam',
        ...payload,
      })}`
    );
  } catch (_) {
    // no-op on logging serialization issues
  }
};

const callSarvam = async ({ url, method = 'POST', headers = {}, body, timeoutMs = 20000 }) => {
  assertSarvamKey();
  const start = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'api-subscription-key': SARVAM_API_KEY,
        ...headers,
      },
      body,
      signal: controller.signal,
    });

    const rawText = await response.text();
    const data = safeJsonParse(rawText) || { raw: rawText };
    const latencyMs = Date.now() - start;

    if (!response.ok) {
      const err = new Error(data?.message || rawText || 'Sarvam request failed');
      err.status = response.status;
      err.data = data;
      err.latencyMs = latencyMs;
      throw err;
    }

    return {
      data,
      rawText,
      latencyMs,
    };
  } finally {
    clearTimeout(timeoutId);
  }
};

const extractChatText = (chatResponse) => {
  const choice = chatResponse?.choices?.[0];
  if (!choice) return '';
  const content = choice.message?.content;

  if (typeof content === 'string') return content.trim();

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === 'string') return item;
        if (typeof item?.text === 'string') return item.text;
        return '';
      })
      .join(' ')
      .trim();
  }

  return '';
};

const chatCompletion = async (messages, options = {}) => {
  const body = JSON.stringify({
    model: options.model || SARVAM_CHAT_MODEL,
    messages,
    temperature: options.temperature ?? 0.1,
    max_tokens: options.maxTokens ?? 350,
    response_format: options.responseFormat,
  });

  const { data, latencyMs } = await callSarvam({
    url: getChatUrl(),
    headers: { 'Content-Type': 'application/json' },
    body,
    timeoutMs: options.timeoutMs ?? 20000,
  });

  return {
    data,
    text: extractChatText(data),
    model: options.model || SARVAM_CHAT_MODEL,
    latencyMs,
  };
};

const buildPromptForExpenseParser = (parseTranscript) => [
  {
    role: 'system',
    content:
      'You are an Indian expense parser for Hindi/Hinglish/English user input. Return only strict JSON. Keep description in user phrasing style. Do not output markdown.',
  },
  {
    role: 'user',
    content:
      `Transcript: "${parseTranscript}"\n\n` +
      'Return ONLY JSON in one shape:\n' +
      '{"amount": number, "category": string, "description": string, "location": string|null, "date": string|null, "is_unclear": boolean}\n' +
      'OR array of the same objects.\n' +
      `Allowed categories: ${CANONICAL_EXPENSE_CATEGORIES.join(', ')}\n` +
      'Rules:\n' +
      '- Amount must be rupees numeric.\n' +
      '- If unsure, set is_unclear true.\n' +
      '- Keep description short and useful.',
  },
];

const parseExpenseWithSarvam = async (transcript) => {
  const style = normalizeTranscriptStyle(transcript);
  const parseText = style.parseTranscript;

  if (!parseText) {
    return {
      items: [{ is_unclear: true }],
      meta: {
        provider: 'sarvam',
        model: SARVAM_CHAT_MODEL,
        fallbackUsed: true,
        normalizationApplied: style.normalizationApplied,
        languageStyle: style.languageStyle,
        confidence: 0.1,
        reviewRequired: true,
        subcategory: 'Misc',
        displayTranscript: style.displayTranscript,
      },
    };
  }

  const deterministic = parseDeterministicExpense(parseText);
  const prompt = buildPromptForExpenseParser(parseText);
  const maxRetries = 2;

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      const completion = await chatCompletion(prompt, {
        model: SARVAM_CHAT_MODEL,
        temperature: 0.1,
        maxTokens: 320,
      });

      const parsed = safeJsonParse(completion.text);
      const parsedItems = Array.isArray(parsed) ? parsed : [parsed];
      const modelItem = parsedItems
        .map((item) => normalizeModelExpenseObject(item, style.displayTranscript))
        .find(Boolean) || null;

      const reconciled = reconcileExpenseCandidates({
        deterministic,
        modelItem,
        fallbackDescription: style.displayTranscript,
      });

      const item = {
        ...reconciled.item,
        subcategory: reconciled.subcategory,
      };

      logParserEvent({
        endpoint: 'chat-completions',
        model: completion.model,
        latency_ms: completion.latencyMs,
        fallback_used: reconciled.fallbackUsed,
        review_required: reconciled.reviewRequired,
        confidence: Number(reconciled.confidence.toFixed(3)),
        language_style: style.languageStyle,
        transcript_preview: truncateForLog(style.displayTranscript),
      });

      return {
        items: [item],
        meta: {
          provider: 'sarvam',
          model: completion.model,
          fallbackUsed: reconciled.fallbackUsed,
          normalizationApplied: style.normalizationApplied,
          languageStyle: style.languageStyle,
          confidence: Number(reconciled.confidence.toFixed(3)),
          reviewRequired: reconciled.reviewRequired,
          subcategory: reconciled.subcategory,
          displayTranscript: style.displayTranscript,
        },
      };
    } catch (error) {
      if (attempt < maxRetries) {
        await wait(250 * attempt);
        continue;
      }

      const reconciled = reconcileExpenseCandidates({
        deterministic,
        modelItem: null,
        fallbackDescription: style.displayTranscript,
      });

      logParserEvent({
        endpoint: 'chat-completions',
        model: SARVAM_CHAT_MODEL,
        latency_ms: error?.latencyMs || 0,
        fallback_used: true,
        review_required: reconciled.reviewRequired,
        confidence: Number(reconciled.confidence.toFixed(3)),
        language_style: style.languageStyle,
        error_code: error?.code || error?.status || 'PARSER_UNAVAILABLE',
      });

      return {
        items: [{
          ...reconciled.item,
          subcategory: reconciled.subcategory,
        }],
        meta: {
          provider: 'sarvam',
          model: SARVAM_CHAT_MODEL,
          fallbackUsed: true,
          normalizationApplied: style.normalizationApplied,
          languageStyle: style.languageStyle,
          confidence: Number(reconciled.confidence.toFixed(3)),
          reviewRequired: reconciled.reviewRequired,
          subcategory: reconciled.subcategory,
          displayTranscript: style.displayTranscript,
        },
      };
    }
  }

  return {
    items: [{ is_unclear: true }],
    meta: {
      provider: 'sarvam',
      model: SARVAM_CHAT_MODEL,
      fallbackUsed: true,
      normalizationApplied: style.normalizationApplied,
      languageStyle: style.languageStyle,
      confidence: 0.2,
      reviewRequired: true,
      subcategory: 'Misc',
      displayTranscript: style.displayTranscript,
    },
  };
};

const transcribeAudioWithSarvam = async ({
  fileBuffer,
  fileName = 'recording.webm',
  mimeType = 'audio/webm',
  languageCode = SARVAM_STT_LANGUAGE_CODE,
} = {}) => {
  if (!fileBuffer || !fileBuffer.length) {
    const err = new Error('Audio buffer is required');
    err.code = 'INVALID_AUDIO_INPUT';
    throw err;
  }

  const formData = new FormData();
  const blob = new Blob([fileBuffer], { type: mimeType });
  formData.append('file', blob, fileName);
  formData.append('model', SARVAM_STT_MODEL);
  formData.append('language_code', languageCode || SARVAM_STT_LANGUAGE_CODE);

  const { data, latencyMs } = await callSarvam({
    url: getSttUrl(),
    body: formData,
    timeoutMs: 30000,
  });

  const transcript = data?.transcript
    || data?.text
    || data?.transcription
    || data?.result?.transcript
    || data?.output?.transcript
    || '';

  const style = normalizeTranscriptStyle(transcript);

  logParserEvent({
    endpoint: 'speech-to-text',
    model: SARVAM_STT_MODEL,
    latency_ms: latencyMs,
    fallback_used: false,
    review_required: false,
    confidence: 1,
    language_style: style.languageStyle,
    transcript_preview: truncateForLog(style.displayTranscript),
  });

  return {
    transcript: style.displayTranscript,
    rawTranscript: style.rawTranscript,
    parseTranscript: style.parseTranscript,
    languageStyle: style.languageStyle,
    normalizationApplied: style.normalizationApplied,
    raw: data,
    model: SARVAM_STT_MODEL,
    latencyMs,
  };
};

const refineTranscriptWithSarvam = async (transcript) => {
  const style = normalizeTranscriptStyle(transcript);
  const normalized = style.parseTranscript;

  if (!normalized) {
    return {
      corrected: '',
      confidence: 0,
      alternatives: [],
      ambiguous_words: [],
    };
  }

  try {
    const completion = await chatCompletion([
      {
        role: 'system',
        content: 'You correct noisy Hindi/Hinglish speech transcripts for expense logging. Return only JSON.',
      },
      {
        role: 'user',
        content:
          `Transcript: "${normalized}"\n` +
          'Return JSON with schema:\n' +
          '{"corrected": string, "confidence": number, "alternatives": string[], "ambiguous_words": string[]}',
      },
    ], {
      temperature: 0.15,
      maxTokens: 220,
    });

    const parsed = safeJsonParse(completion.text);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid refine JSON');
    }

    return {
      corrected: String(parsed.corrected || style.displayTranscript),
      confidence: Number.isFinite(Number(parsed.confidence)) ? Number(parsed.confidence) : 0.5,
      alternatives: Array.isArray(parsed.alternatives) ? parsed.alternatives.slice(0, 3).map(String) : [],
      ambiguous_words: Array.isArray(parsed.ambiguous_words) ? parsed.ambiguous_words.slice(0, 5).map(String) : [],
    };
  } catch (error) {
    return {
      corrected: style.displayTranscript,
      confidence: 0.5,
      alternatives: [],
      ambiguous_words: [],
    };
  }
};

const sendMessageToAIWithSarvam = async (userMessage, conversationHistory = []) => {
  try {
    const contextMessages = conversationHistory
      .slice(-10)
      .map((msg) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      }));

    const completion = await chatCompletion([
      {
        role: 'system',
        content:
          'You are a helpful Indian expense assistant. When enough details are available (amount + purpose), add [CREATE_EXPENSE] at the end.',
      },
      ...contextMessages,
      { role: 'user', content: userMessage },
    ], {
      temperature: 0.25,
      maxTokens: 260,
    });

    const shouldCreateExpense = completion.text.includes('[CREATE_EXPENSE]');
    return {
      text: completion.text.replace('[CREATE_EXPENSE]', '').trim(),
      shouldCreateExpense,
      meta: {
        provider: 'sarvam',
        model: completion.model,
        fallbackUsed: false,
      },
    };
  } catch (error) {
    return {
      text: "I'm having trouble processing that right now. Please try again.",
      shouldCreateExpense: false,
      meta: {
        provider: 'sarvam',
        model: SARVAM_CHAT_MODEL,
        fallbackUsed: true,
      },
    };
  }
};

const extractExpenseFromConversationWithSarvam = async (conversationHistory = []) => {
  try {
    const transcript = conversationHistory
      .slice(-8)
      .map((msg) => `${msg.role === 'assistant' ? 'Assistant' : 'User'}: ${msg.content}`)
      .join('\n');

    const completion = await chatCompletion([
      {
        role: 'system',
        content: 'Extract expense JSON from conversation. Return only JSON object.',
      },
      {
        role: 'user',
        content:
          `Conversation:\n${sanitizeTranscript(transcript)}\n\n` +
          'Return JSON schema: {"amount": number, "category": string, "description": string, "location": string|null, "date": string|null, "is_unclear": boolean}',
      },
    ], {
      temperature: 0.1,
      maxTokens: 180,
    });

    const parsed = safeJsonParse(completion.text);
    const normalized = normalizeModelExpenseObject(parsed, transcript);
    return normalized || null;
  } catch (error) {
    return null;
  }
};

module.exports = {
  chatCompletion,
  parseExpenseWithSarvam,
  refineTranscriptWithSarvam,
  transcribeAudioWithSarvam,
  sendMessageToAIWithSarvam,
  extractExpenseFromConversationWithSarvam,
};


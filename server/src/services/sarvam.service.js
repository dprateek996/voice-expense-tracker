const SARVAM_API_KEY = process.env.SARVAM_API_KEY;
const SARVAM_BASE_URL = process.env.SARVAM_BASE_URL || 'https://api.sarvam.ai';
const SARVAM_CHAT_MODEL = process.env.SARVAM_CHAT_MODEL || 'sarvam-m';
const SARVAM_STT_MODEL = process.env.SARVAM_STT_MODEL || 'saarika:v2.5';
const SARVAM_STT_LANGUAGE_CODE = process.env.SARVAM_STT_LANGUAGE_CODE || 'unknown';

const DEVANAGARI_DIGIT_MAP = {
  '०': '0',
  '१': '1',
  '२': '2',
  '३': '3',
  '४': '4',
  '५': '5',
  '६': '6',
  '७': '7',
  '८': '8',
  '९': '9',
};

const DEFAULT_EXPENSE_CATEGORY = 'Other';
const VALID_EXPENSE_CATEGORIES = new Set([
  'Groceries',
  'Dining',
  'Transport',
  'Shopping',
  'Utilities',
  'Health',
  'Entertainment',
  'Travel',
  'Education',
  'Work',
  'Personal Care',
  'Fuel',
  'Other',
]);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeDevanagariDigits = (value) => value
  .split('')
  .map((char) => DEVANAGARI_DIGIT_MAP[char] ?? char)
  .join('');

const normalizeTranscript = (transcript) => {
  const original = String(transcript || '');
  const normalized = normalizeDevanagariDigits(original)
    .replace(/[{}$`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    original,
    normalized,
    normalizationApplied: original !== normalized,
  };
};

const classifyCategory = (text) => {
  const lower = text.toLowerCase();
  if (/(food|lunch|dinner|breakfast|restaurant|burger|pizza|cafe|coffee|chai|meal)/i.test(lower)) return 'Dining';
  if (/(grocer|vegetable|fruit|ration|kiryana)/i.test(lower)) return 'Groceries';
  if (/(uber|cab|taxi|auto|metro|bus|transport|petrol|fuel|diesel|gpay to driver)/i.test(lower)) return 'Transport';
  if (/(shop|mall|amazon|flipkart|clothes|dress|shoe|shopping)/i.test(lower)) return 'Shopping';
  if (/(movie|netflix|spotify|game|entertainment)/i.test(lower)) return 'Entertainment';
  if (/(medicine|hospital|doctor|health|clinic)/i.test(lower)) return 'Health';
  if (/(electricity|water bill|internet|wifi|mobile recharge|gas bill)/i.test(lower)) return 'Utilities';
  if (/(flight|hotel|trip|travel|train)/i.test(lower)) return 'Travel';
  if (/(course|book|tuition|class|exam)/i.test(lower)) return 'Education';
  if (/(office|workspace|software|subscription)/i.test(lower)) return 'Work';
  if (/(salon|grooming|cosmetic|personal care)/i.test(lower)) return 'Personal Care';
  if (/(fuel|petrol|diesel|cng)/i.test(lower)) return 'Fuel';
  return DEFAULT_EXPENSE_CATEGORY;
};

const fallbackExtraction = (transcript) => {
  const { normalized, normalizationApplied } = normalizeTranscript(transcript);
  const amountMatch = normalized.match(/(?:₹|rs\.?|rupees?|rupaye)?\s*(\d+(?:,\d{3})*(?:\.\d{1,2})?)/i);
  const amount = amountMatch ? Number.parseFloat(amountMatch[1].replace(/,/g, '')) : 0;

  if (!amount || Number.isNaN(amount) || amount <= 0) {
    return {
      items: [{ is_unclear: true }],
      meta: {
        provider: 'local-regex',
        model: 'regex-fallback',
        fallbackUsed: true,
        normalizationApplied,
      },
    };
  }

  return {
    items: [{
      amount,
      category: classifyCategory(normalized),
      description: normalized.slice(0, 120),
      location: null,
      date: null,
      is_unclear: false,
    }],
    meta: {
      provider: 'local-regex',
      model: 'regex-fallback',
      fallbackUsed: true,
      normalizationApplied,
    },
  };
};

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

const normalizeExpenseObject = (obj, fallbackDescription) => {
  if (!obj || typeof obj !== 'object') return null;

  const amount = Number(obj.amount);
  if (!Number.isFinite(amount) || amount <= 0) return null;

  const category = VALID_EXPENSE_CATEGORIES.has(obj.category)
    ? obj.category
    : classifyCategory(obj.description || fallbackDescription || '');

  return {
    amount,
    category: category || DEFAULT_EXPENSE_CATEGORY,
    description: String(obj.description || fallbackDescription || 'Expense').slice(0, 120),
    location: obj.location ? String(obj.location).slice(0, 100) : null,
    date: obj.date || null,
    is_unclear: Boolean(obj.is_unclear),
  };
};

const parseExpenseWithSarvam = async (transcript) => {
  const { normalized, normalizationApplied } = normalizeTranscript(transcript);
  if (!normalized) {
    return {
      items: [{ is_unclear: true }],
      meta: {
        provider: 'sarvam',
        model: SARVAM_CHAT_MODEL,
        fallbackUsed: true,
        normalizationApplied,
      },
    };
  }

  const prompt = [
    {
      role: 'system',
      content: 'You are an Indian expense parsing engine. Parse Hindi, Hinglish, and English input. Return ONLY strict JSON.',
    },
    {
      role: 'user',
      content:
        `Extract one or more expenses from this transcript:\n"${normalized}"\n\n` +
        'Return ONLY JSON in one of these shapes:\n' +
        '{"amount": number, "category": string, "description": string, "location": string|null, "date": string|null, "is_unclear": boolean}\n' +
        'OR\n' +
        '[{...}, {...}]\n' +
        'Rules:\n' +
        '- Amount must be numeric rupees.\n' +
        '- Category must be one of: Groceries, Dining, Transport, Shopping, Utilities, Health, Entertainment, Travel, Education, Work, Personal Care, Fuel, Other.\n' +
        '- If unclear, set is_unclear true.',
    },
  ];

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
      const normalizedItems = parsedItems
        .map((item) => normalizeExpenseObject(item, normalized))
        .filter(Boolean);

      if (normalizedItems.length > 0) {
        return {
          items: normalizedItems,
          meta: {
            provider: 'sarvam',
            model: completion.model,
            fallbackUsed: false,
            normalizationApplied,
          },
        };
      }
      throw new Error('No valid expense objects in model output');
    } catch (error) {
      if (attempt < maxRetries) {
        await wait(250 * attempt);
        continue;
      }
      const fallback = fallbackExtraction(normalized);
      return {
        ...fallback,
        meta: {
          ...fallback.meta,
          provider: 'sarvam',
          model: SARVAM_CHAT_MODEL,
        },
      };
    }
  }

  return fallbackExtraction(normalized);
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

  return {
    transcript: String(transcript || '').trim(),
    raw: data,
    model: SARVAM_STT_MODEL,
    latencyMs,
  };
};

const refineTranscriptWithSarvam = async (transcript) => {
  const { normalized } = normalizeTranscript(transcript);
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
      corrected: String(parsed.corrected || normalized),
      confidence: Number.isFinite(Number(parsed.confidence)) ? Number(parsed.confidence) : 0.5,
      alternatives: Array.isArray(parsed.alternatives) ? parsed.alternatives.slice(0, 3).map(String) : [],
      ambiguous_words: Array.isArray(parsed.ambiguous_words) ? parsed.ambiguous_words.slice(0, 5).map(String) : [],
    };
  } catch (error) {
    return {
      corrected: normalized,
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
          `Conversation:\n${transcript}\n\n` +
          'Return JSON schema: {"amount": number, "category": string, "description": string, "location": string|null, "date": string|null, "is_unclear": boolean}',
      },
    ], {
      temperature: 0.1,
      maxTokens: 180,
    });

    const parsed = safeJsonParse(completion.text);
    const normalized = normalizeExpenseObject(parsed, transcript);
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

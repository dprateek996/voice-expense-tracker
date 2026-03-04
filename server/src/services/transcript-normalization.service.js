const { HINGLISH_HINT_TOKENS } = require('../constants/indian-expense-lexicon');

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

const DEVANAGARI_VOWELS = {
  'अ': 'a',
  'आ': 'aa',
  'इ': 'i',
  'ई': 'ee',
  'उ': 'u',
  'ऊ': 'oo',
  'ऋ': 'ri',
  'ए': 'e',
  'ऐ': 'ai',
  'ओ': 'o',
  'औ': 'au',
  'ऑ': 'o',
};

const DEVANAGARI_MATRA = {
  'ा': 'aa',
  'ि': 'i',
  'ी': 'ee',
  'ु': 'u',
  'ू': 'oo',
  'ृ': 'ri',
  'े': 'e',
  'ै': 'ai',
  'ो': 'o',
  'ौ': 'au',
  'ॉ': 'o',
  'ं': 'n',
  'ँ': 'n',
  'ः': 'h',
};

const DEVANAGARI_CONSONANTS = {
  'क': 'k',
  'ख': 'kh',
  'ग': 'g',
  'घ': 'gh',
  'च': 'ch',
  'छ': 'chh',
  'ज': 'j',
  'झ': 'jh',
  'ट': 't',
  'ठ': 'th',
  'ड': 'd',
  'ढ': 'dh',
  'ण': 'n',
  'त': 't',
  'थ': 'th',
  'द': 'd',
  'ध': 'dh',
  'न': 'n',
  'प': 'p',
  'फ': 'ph',
  'ब': 'b',
  'भ': 'bh',
  'म': 'm',
  'य': 'y',
  'र': 'r',
  'ल': 'l',
  'व': 'v',
  'श': 'sh',
  'ष': 'sh',
  'स': 's',
  'ह': 'h',
  'ळ': 'l',
  'क्ष': 'ksh',
  'ज्ञ': 'gya',
};

const CURRENCY_WORD_PATTERN = /\b(rupees?|rupaye?|rupiya|rs\.?|₹)\b/gi;
const HALANT = '्';

const replaceDevanagariDigits = (text) => text
  .split('')
  .map((char) => DEVANAGARI_DIGIT_MAP[char] ?? char)
  .join('');

const sanitizeTranscript = (value) => replaceDevanagariDigits(String(value || ''))
  .replace(/[{}$`]/g, '')
  .replace(/\s+/g, ' ')
  .trim();

const romanizeDevanagari = (text) => {
  let result = '';
  const chars = [...text];

  for (let i = 0; i < chars.length; i += 1) {
    const current = chars[i];
    const next = chars[i + 1];

    if (DEVANAGARI_VOWELS[current]) {
      result += DEVANAGARI_VOWELS[current];
      continue;
    }

    if (DEVANAGARI_CONSONANTS[current]) {
      const consonant = DEVANAGARI_CONSONANTS[current];

      if (next === HALANT) {
        result += consonant;
        i += 1;
        continue;
      }

      if (DEVANAGARI_MATRA[next]) {
        result += consonant + DEVANAGARI_MATRA[next];
        i += 1;
        continue;
      }

      result += `${consonant}a`;
      continue;
    }

    if (DEVANAGARI_MATRA[current]) {
      result += DEVANAGARI_MATRA[current];
      continue;
    }

    result += current;
  }

  return result
    .replace(/\s+/g, ' ')
    .replace(/([kgcjtdnpbmyrlvsh])a\b/g, '$1')
    .replace(/\bautoa\b/g, 'auto')
    .replace(/\boto\b/g, 'auto')
    .replace(/\brupayea\b/g, 'rupaye')
    .replace(/\brupeya\b/g, 'rupaye')
    .trim();
};

const detectLanguageStyle = (text) => {
  const devanagariChars = (text.match(/[\u0900-\u097F]/g) || []).length;
  const latinChars = (text.match(/[A-Za-z]/g) || []).length;

  if (devanagariChars > 0) return 'hinglish-romanized';

  const lower = text.toLowerCase();
  const hasHinglishHints = HINGLISH_HINT_TOKENS.some((token) => new RegExp(`\\b${token}\\b`, 'i').test(lower));
  if (hasHinglishHints) return 'hinglish-romanized';

  if (latinChars > 0) return 'english';
  return 'english';
};

const normalizeForParser = (text) => text
  .toLowerCase()
  .replace(CURRENCY_WORD_PATTERN, 'rs')
  .replace(/[^a-z0-9.\s]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const normalizeTranscriptStyle = (transcript) => {
  const sanitized = sanitizeTranscript(transcript);
  if (!sanitized) {
    return {
      rawTranscript: '',
      displayTranscript: '',
      parseTranscript: '',
      languageStyle: 'english',
      normalizationApplied: false,
    };
  }

  const languageStyle = detectLanguageStyle(sanitized);
  const containsDevanagari = /[\u0900-\u097F]/.test(sanitized);

  const displayTranscript = containsDevanagari
    ? romanizeDevanagari(sanitized)
    : sanitized;

  const parseTranscript = normalizeForParser(displayTranscript);

  return {
    rawTranscript: sanitized,
    displayTranscript,
    parseTranscript,
    languageStyle,
    normalizationApplied: sanitized !== displayTranscript,
  };
};

module.exports = {
  normalizeTranscriptStyle,
  sanitizeTranscript,
  romanizeDevanagari,
};

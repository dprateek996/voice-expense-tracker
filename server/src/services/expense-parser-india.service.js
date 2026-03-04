const {
  CANONICAL_EXPENSE_CATEGORIES,
  INDIAN_EXPENSE_LEXICON,
} = require('../constants/indian-expense-lexicon');

const CANONICAL_CATEGORY_SET = new Set(CANONICAL_EXPENSE_CATEGORIES);

const GENERIC_DESCRIPTION_PATTERNS = [
  /^expense$/i,
  /^spent money$/i,
  /^payment$/i,
  /^transaction$/i,
  /^kharcha$/i,
];

const levenshteinDistance = (a, b) => {
  const source = String(a || '');
  const target = String(b || '');
  if (!source) return target.length;
  if (!target) return source.length;

  const matrix = Array.from({ length: source.length + 1 }, () => Array(target.length + 1).fill(0));
  for (let i = 0; i <= source.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= target.length; j += 1) matrix[0][j] = j;

  for (let i = 1; i <= source.length; i += 1) {
    for (let j = 1; j <= target.length; j += 1) {
      const cost = source[i - 1] === target[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[source.length][target.length];
};

const tokenize = (text) => String(text || '')
  .toLowerCase()
  .replace(/[^a-z0-9.\s]/g, ' ')
  .split(/\s+/)
  .filter(Boolean);

const parseAmount = (text) => {
  const normalized = String(text || '').toLowerCase().replace(/,/g, '');
  const matches = [];

  const amountRegex = /(?:₹|rs|rupees|rupaye)?\s*(\d+(?:\.\d+)?)\s*(k)?\b/g;
  let match = amountRegex.exec(normalized);
  while (match) {
    const rawAmount = Number.parseFloat(match[1]);
    if (Number.isFinite(rawAmount) && rawAmount > 0) {
      const amount = match[2] ? rawAmount * 1000 : rawAmount;
      matches.push(amount);
    }
    match = amountRegex.exec(normalized);
  }

  if (matches.length > 0) return matches[0];
  return 0;
};

const tokenMatchesKeyword = (token, keyword) => {
  if (token === keyword) return true;
  if (Math.abs(token.length - keyword.length) > 2) return false;
  const maxDistance = Math.max(token.length, keyword.length) >= 6 ? 2 : 1;
  return levenshteinDistance(token, keyword) <= maxDistance;
};

const keywordMatchScore = (tokens, keyword) => {
  const phraseTokens = tokenize(keyword);
  if (phraseTokens.length === 0) return 0;

  if (phraseTokens.length === 1) {
    return tokens.some((token) => tokenMatchesKeyword(token, phraseTokens[0])) ? 1 : 0;
  }

  const joined = tokens.join(' ');
  return joined.includes(phraseTokens.join(' ')) ? 1 : 0;
};

const classifyCategoryAndSubcategory = (text) => {
  const tokens = tokenize(text);
  let best = {
    score: 0,
    category: 'Other',
    subcategory: 'Misc',
  };

  for (const entry of INDIAN_EXPENSE_LEXICON) {
    let score = 0;
    for (const keyword of entry.keywords) {
      score += keywordMatchScore(tokens, keyword);
    }

    if (score > best.score) {
      best = {
        score,
        category: entry.category,
        subcategory: entry.subcategory,
      };
    }
  }

  return best;
};

const buildDescription = (text) => {
  const cleaned = String(text || '')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned.slice(0, 120) || 'Expense';
};

const parseDeterministicExpense = (transcript) => {
  const normalized = String(transcript || '').trim();
  const amount = parseAmount(normalized);
  const classification = classifyCategoryAndSubcategory(normalized);
  const description = buildDescription(normalized);
  const hasCategorySignal = classification.score > 0 && classification.category !== 'Other';

  let confidence = 0.15;
  if (amount > 0) confidence += 0.45;
  if (hasCategorySignal) confidence += 0.2;
  if (classification.score >= 2) confidence += 0.1;
  if (description.length > 10) confidence += 0.05;
  confidence = Math.max(0.05, Math.min(0.95, confidence));

  const isUnclear = amount <= 0;

  return {
    item: {
      amount,
      category: classification.category,
      subcategory: classification.subcategory,
      description,
      location: null,
      date: null,
      is_unclear: isUnclear,
    },
    confidence,
    keywordScore: classification.score,
  };
};

const isCanonicalCategory = (category) => CANONICAL_CATEGORY_SET.has(category);

const normalizeModelExpenseObject = (obj, fallbackDescription = '') => {
  if (!obj || typeof obj !== 'object') return null;
  const amount = Number(obj.amount);
  if (!Number.isFinite(amount) || amount <= 0) return null;

  const category = isCanonicalCategory(obj.category) ? obj.category : 'Other';
  const description = String(obj.description || fallbackDescription || 'Expense').slice(0, 120);

  return {
    amount,
    category,
    description,
    location: obj.location ? String(obj.location).slice(0, 100) : null,
    date: obj.date || null,
    is_unclear: Boolean(obj.is_unclear),
  };
};

const isGenericDescription = (description) => {
  const value = String(description || '').trim();
  if (!value) return true;
  return GENERIC_DESCRIPTION_PATTERNS.some((pattern) => pattern.test(value));
};

const reconcileExpenseCandidates = ({ deterministic, modelItem, fallbackDescription }) => {
  const deterministicItem = deterministic?.item || null;
  const deterministicConfidence = Number(deterministic?.confidence || 0);

  if (!modelItem && deterministicItem) {
    const reviewRequired = deterministicItem.is_unclear || deterministicConfidence < 0.72;
    return {
      item: deterministicItem,
      confidence: deterministicConfidence,
      reviewRequired,
      subcategory: deterministicItem.subcategory || 'Misc',
      fallbackUsed: true,
    };
  }

  if (!modelItem && !deterministicItem) {
    return {
      item: { is_unclear: true },
      confidence: 0.2,
      reviewRequired: true,
      subcategory: 'Misc',
      fallbackUsed: true,
    };
  }

  if (!deterministicItem) {
    const modelDescription = isGenericDescription(modelItem.description)
      ? buildDescription(fallbackDescription)
      : modelItem.description;
    const fallback = parseDeterministicExpense(modelDescription);
    const reviewRequired = Boolean(modelItem.is_unclear) || fallback.confidence < 0.7;

    return {
      item: {
        ...modelItem,
        description: modelDescription,
      },
      confidence: Math.max(0.55, fallback.confidence),
      reviewRequired,
      subcategory: fallback.item.subcategory || 'Misc',
      fallbackUsed: false,
    };
  }

  const amountAgreement = Math.abs((modelItem.amount || 0) - (deterministicItem.amount || 0)) <= 1;
  const modelCategory = isCanonicalCategory(modelItem.category) ? modelItem.category : 'Other';

  let category = modelCategory;
  if (modelCategory === 'Other' && deterministicItem.category !== 'Other') {
    category = deterministicItem.category;
  } else if (deterministic.keywordScore >= 2 && deterministicItem.category !== 'Other') {
    category = deterministicItem.category;
  }

  const description = !isGenericDescription(modelItem.description)
    ? modelItem.description
    : deterministicItem.description;

  const confidence = Math.max(
    0.3,
    Math.min(
      0.96,
      (deterministicConfidence * 0.55)
        + (amountAgreement ? 0.25 : 0.05)
        + (category === deterministicItem.category ? 0.15 : 0.05)
    )
  );

  const reviewRequired = Boolean(modelItem.is_unclear)
    || !amountAgreement
    || confidence < 0.72;

  return {
    item: {
      ...modelItem,
      amount: amountAgreement ? deterministicItem.amount : modelItem.amount,
      category,
      description,
      is_unclear: reviewRequired,
    },
    confidence,
    reviewRequired,
    subcategory: deterministicItem.subcategory || 'Misc',
    fallbackUsed: false,
  };
};

module.exports = {
  CANONICAL_CATEGORY_SET,
  classifyCategoryAndSubcategory,
  isCanonicalCategory,
  normalizeModelExpenseObject,
  parseAmount,
  parseDeterministicExpense,
  reconcileExpenseCandidates,
};

const { parseExpenseWithSarvam } = require('./sarvam.service');

// Backward-compatible export for legacy scripts.
const parseExpenseWithGemini = async (transcript) => {
  const result = await parseExpenseWithSarvam(transcript);
  return result.items;
};

module.exports = { parseExpenseWithGemini };

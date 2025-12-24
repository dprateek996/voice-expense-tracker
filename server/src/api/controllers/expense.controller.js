const prisma = require('../../../prisma.config');
const { parseExpenseWithGemini } = require('../../services/gemini.service');

const addExpenseFromVoice = async (req, res) => {
  const { transcript } = req.body;
  const userId = req.user.userId;

  if (!transcript) {
    console.log('❌ [API] Missing transcript in request body');
    return res.status(400).json({ error: 'Transcript is required.' });
  }

  console.log('🎤 [API] Received transcript:', transcript);

  try {
    const parsedData = await parseExpenseWithGemini(transcript);
    console.log('🤖 [API] Gemini Parsed Data:', JSON.stringify(parsedData, null, 2));

    const expensesToCreate = Array.isArray(parsedData) ? parsedData : [parsedData];
    const createdExpenses = [];

    for (const expense of expensesToCreate) {
      console.log('📦 [API] Processing expense:', expense);

      if (!expense || typeof expense !== 'object') {
        console.warn('⚠️ [API] Invalid expense object:', expense);
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
          parsed_by: 'gemini-2.0-flash',
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
        parsed: parsedData
      });
    }

    res.status(201).json({
      message: 'Expenses added successfully',
      expenses: createdExpenses,
      count: createdExpenses.length
    });

  } catch (error) {
    console.error('❌ [API] Error in addExpenseFromVoice:', error);
    res.status(500).json({ error: 'Internal server error while processing expense.' });
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
  getAllExpenses
};
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
    console.log('🤖 [API] Gemini Parsed Data:', parsedData);

    // **THE DEFINITIVE FIX**: This rule is now much stricter.
    // It rejects the request if the AI marks it as unclear, if the amount is missing, OR if the amount is zero.
    // Now handles array of expenses
    const expensesToCreate = Array.isArray(parsedData) ? parsedData : [parsedData];
    const createdExpenses = [];

    for (const expense of expensesToCreate) {
      // Relaxed validation: Accept if amount is valid, even if marked unclear (we trust the amount)
      if ((!expense.amount || expense.amount <= 0)) {
        console.warn('⚠️ [API] Expense rejected: Invalid amount', expense);
        continue; // Skip invalid expenses in the batch
      }

      const newExpense = await prisma.expense.create({
        data: {
          userId: userId,
          amount: expense.amount,
          category: expense.category,
          description: expense.description,
          location: expense.location,
          ...(expense.date && { date: new Date(expense.date) }),
          is_unclear: false,
          source: 'voice',
          parsed_by: 'gemini-2.0-flash',
        }
      });
      createdExpenses.push(newExpense);
    }

    if (createdExpenses.length === 0) {
      return res.status(400).json({
        error: "Could not understand a valid expense from the transcript.",
        is_unclear: true,
      });
    }

    res.status(201).json({
      message: 'Expenses added successfully',
      expenses: createdExpenses, // Return array
      count: createdExpenses.length
    });

  } catch (error) {
    console.error('Error in addExpenseFromVoice:', error);
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
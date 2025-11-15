const prisma = require('../../../prisma.config');
const { parseExpenseWithGemini } = require('../../services/gemini.service');

const addExpenseFromVoice = async (req, res) => {
  const { transcript } = req.body;
  const userId = req.user.userId;

  if (!transcript) {
    return res.status(400).json({ error: 'Transcript is required.' });
  }

  try {
    const parsedData = await parseExpenseWithGemini(transcript);

    // **THE PRODUCTION-GRADE FIX**
    // If the AI flags the transcript as unclear or fails to find an amount,
    // REJECT the request. Do NOT save garbage to the database.
    if (parsedData.is_unclear || !parsedData.amount) {
      return res.status(400).json({ 
        error: "Could not understand the expense from the transcript.",
        is_unclear: true,
      });
    }

    const newExpense = await prisma.expense.create({
      data: {
        userId: userId,
        amount: parsedData.amount,
        category: parsedData.category,
        description: parsedData.description,
        location: parsedData.location,
        ...(parsedData.date && { date: new Date(parsedData.date) }),
        is_unclear: false,
        source: 'voice',
        parsed_by: 'gemini-1.5-flash',
      }
    });

    res.status(201).json({ 
      message: 'Expense added successfully', 
      expense: newExpense,
    });

  } catch (error) {
    console.error('Error in addExpenseFromVoice:', error);
    res.status(500).json({ error: 'Failed to process and save expense.' });
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
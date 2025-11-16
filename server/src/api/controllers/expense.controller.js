const prisma = require('../../../prisma.config');
const { parseExpense } = require('../../services/gemini.service');

const addExpenseFromVoice = async (req, res) => {
  const { transcript } = req.body; // No longer need 'source'
  const userId = req.user.userId;

  if (!transcript) return res.status(400).json({ error: 'Transcript is required.' });

  try {
    const parsedData = await parseExpense(transcript); // Use the single, powerful parser

    if (parsedData.is_unclear || !parsedData.amount || parsedData.amount <= 0) {
      console.error("AI failed to parse. AI Response:", parsedData);
      return res.status(400).json({ error: "Could not understand a valid expense from the transcript." });
    }

    const newExpense = await prisma.expense.create({
      data: {
        userId,
        amount: parsedData.amount,
        category: parsedData.category,
        description: parsedData.description,
        location: parsedData.location,
        ...(parsedData.date && { date: new Date(parsedData.date) }),
      }
    });

    res.status(201).json({ message: 'Expense added successfully', expense: newExpense });
  } catch (error) {
    console.error("Server error in addExpenseFromVoice:", error);
    res.status(500).json({ error: 'Internal server error while processing expense.' });
  }
};

const getAllExpenses = async (req, res) => {
    const userId = req.user.userId;
    try {
        const expenses = await prisma.expense.findMany({ where: { userId: userId }, orderBy: { date: 'desc' } });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch expenses.' });
    }
};

module.exports = { addExpenseFromVoice, getAllExpenses };
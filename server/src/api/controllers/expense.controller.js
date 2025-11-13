const prisma = require('../../../prisma.config');

const getExpenses = async (req, res) => {
  try {
    const userId = req.user.userId;
    const expenses = await prisma.expense.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
    res.status(200).json(expenses);
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};

const addExpense = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { amount, category, description, location, date, source, parsed_by, is_unclear } = req.body;
    
    if (amount == null || !category || !description) {
        return res.status(400).json({ error: 'Amount, category, and description are required' });
    }

    const expense = await prisma.expense.create({
      data: {
        userId,
        amount: parseFloat(amount),
        category,
        description,
        location,
        date: date ? new Date(date) : undefined,
        source,
        parsed_by,
        is_unclear,
      },
    });
    res.status(201).json(expense);
  } catch (error) {
    console.error('Add expense error:', error);
    res.status(500).json({ error: 'Failed to add expense' });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const userId = req.user.userId;
    const expenseId = parseInt(req.params.id, 10);

    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
    });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    if (expense.userId !== userId) {
      return res.status(403).json({ error: 'You do not have permission to delete this expense' });
    }
    
    await prisma.expense.delete({
      where: { id: expenseId },
    });
    
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error)
 {
    console.error('Delete expense error:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
};

module.exports = {
  getExpenses,
  addExpense,
  deleteExpense,
};
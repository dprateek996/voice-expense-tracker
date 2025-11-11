// src/api/controllers/expense.controller.js

const { PrismaClient } = require('@prisma/client');
const { parseExpenseWithGemini } = require('../../services/gemini.service');

const prisma = new PrismaClient();

const createExpense = async (req, res) => {
  const { text } = req.body;
  const userId = req.user.userId; // From auth middleware

  if (!text) {
    return res.status(400).json({ error: 'Text input is required.' });
  }

  try {
    const parsedData = await parseExpenseWithGemini(text);

    const newExpense = await prisma.expense.create({
      data: {
        userId,
        amount: parsedData.amount,
        category: parsedData.category,
        description: parsedData.description,
        location: parsedData.location || null,
        is_unclear: parsedData.is_unclear || false,
        parsed_by: 'gemini-1.5-flash',
      },
    });

    res.status(201).json(newExpense);
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ error: 'Failed to create expense.' });
  }
};

const getAllExpenses = async (req, res) => {
  const userId = req.user.userId; // From auth middleware

  try {
    const expenses = await prisma.expense.findMany({
      where: { userId },
      orderBy: {
        date: 'desc',
      },
    });
    res.status(200).json(expenses);
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ error: 'Failed to retrieve expenses.' });
  }
};

const deleteExpense = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    // Check if expense exists and belongs to user
    const expense = await prisma.expense.findFirst({
      where: {
        id: parseInt(id),
        userId,
      },
    });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await prisma.expense.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
};

module.exports = { createExpense, getAllExpenses, deleteExpense };
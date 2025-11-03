// src/api/controllers/expense.controller.js

const { PrismaClient } = require('@prisma/client');
const { parseExpenseWithGemini } = require('../../services/gemini.service');

const prisma = new PrismaClient();

const createExpense = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text input is required.' });
  }

  try {
    const parsedData = await parseExpenseWithGemini(text);

    const newExpense = await prisma.expense.create({
      data: {
        amount: parsedData.amount,
        category: parsedData.category,
        description: parsedData.description,
        is_unclear: parsedData.is_unclear || false,
        parsed_by: 'gemini-1.5-flash',
      },
    });

    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create expense.' });
  }
};

const getAllExpenses = async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: {
        date: 'desc',
      },
    });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve expenses.' });
  }
};

module.exports = { createExpense, getAllExpenses };
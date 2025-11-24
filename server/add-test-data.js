// add-test-data.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function addTestData() {
  try {
    // Create test user if doesn't exist
    let user = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    if (!user) {
      const hashedPassword = await bcrypt.hash('Test1234', 10);
      user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: hashedPassword,
          name: 'Test User',
        }
      });
      console.log('Created test user');
    }

    // Add some test expenses
    const expenses = [
      { amount: 50, category: 'food', description: 'Coffee at Starbucks', location: 'Downtown' },
      { amount: 120, category: 'travel', description: 'Uber to airport', location: 'City Center' },
      { amount: 200, category: 'shopping', description: 'New headphones', location: 'Mall' },
      { amount: 75, category: 'bills', description: 'Electricity bill', location: 'Home' },
      { amount: 30, category: 'entertainment', description: 'Movie tickets', location: 'Cinema' },
      { amount: 150, category: 'medicine', description: 'Doctor visit', location: 'Clinic' },
      { amount: 25, category: 'other', description: 'Miscellaneous', location: 'Store' },
    ];

    for (const expense of expenses) {
      await prisma.expense.create({
        data: {
          ...expense,
          userId: user.id,
          date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
        }
      });
    }

    console.log('Added test expenses');

    // Check total expenses
    const totalExpenses = await prisma.expense.count({
      where: { userId: user.id }
    });

    console.log(`Total expenses for user: ${totalExpenses}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTestData();

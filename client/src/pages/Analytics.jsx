import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import useExpenseStore from '@/store/expenseStore';
import { toast } from 'sonner';

// ICONS FOR CATEGORIES
const CATEGORY_ICONS = {
  food: "🍔",
  travel: "✈️",
  bills: "💡",
  shopping: "🛍️",
  entertainment: "🎬",
  medicine: "💊",
  other: "📦"
};

const COLORS = [
  "#FBBF24",
  "#F59E0B",
  "#F97316",
  "#EF4444",
  "#10B981",
  "#6366F1"
];

const Analytics = () => {
  const { expenses, fetchExpenses } = useExpenseStore();
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [topExpenses, setTopExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch expenses
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        await fetchExpenses();
      } catch {
        toast.error("Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Compute charts
  useEffect(() => {
    if (expenses.length === 0) return;

    // Monthly chart
    const monthlyTotals = expenses.reduce((acc, exp) => {
      const month = new Date(exp.date).toLocaleString("default", {
        month: "short",
        year: "numeric"
      });
      acc[month] = (acc[month] || 0) + exp.amount;
      return acc;
    }, {});
    setChartData(
      Object.entries(monthlyTotals).map(([month, amount]) => ({
        month,
        amount
      }))
    );

    // Category Pie
    const categoryTotals = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});
    setPieData(
      Object.entries(categoryTotals).map(([name, value]) => ({
        name,
        value
      }))
    );

    // Top expenses
    const sorted = [...expenses]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
    setTopExpenses(sorted);

    setTotalSpent(
      expenses.reduce((sum, e) => sum + e.amount, 0)
    );
  }, [expenses]);

  // LOADING SKELETON
  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-10 w-40 bg-muted rounded-lg"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-24 bg-muted rounded-lg"></div>
          <div className="h-24 bg-muted rounded-lg"></div>
          <div className="h-24 bg-muted rounded-lg"></div>
        </div>
        <div className="grid grid-cols-2 gap-6 mt-4">
          <div className="h-64 bg-muted rounded-lg"></div>
          <div className="h-64 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Title */}
      <motion.h1
        className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Expense Analytics
      </motion.h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl shadow hover:scale-105 hover:shadow-lg hover:border-amber-500 transition-transform duration-200">
          <CardHeader>
            <CardTitle>Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹{totalSpent.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow hover:scale-105 hover:shadow-lg hover:border-amber-500 transition-transform duration-200">
          <CardHeader>
            <CardTitle>Total Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{expenses.length}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow hover:scale-105 hover:shadow-lg hover:border-amber-500 transition-transform duration-200">
          <CardHeader>
            <CardTitle>Average Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              ₹{(totalSpent / expenses.length).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card className="rounded-2xl shadow-lg">
          <CardHeader><CardTitle>Monthly Spending</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="rounded-2xl shadow-lg">
          <CardHeader><CardTitle>Spending by Category</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            {/* LEGEND */}
            <div className="flex flex-wrap gap-3 mt-4">
              {pieData.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-xl">{CATEGORY_ICONS[item.name] || "•"}</span>
                  {item.name} — ₹{item.value}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top 5 Expenses */}
      <Card className="p-6 rounded-2xl shadow-lg">
        <CardTitle className="mb-4">Top 5 Expenses</CardTitle>
        <div className="space-y-3">
          {topExpenses.map((exp, i) => (
            <motion.div
              key={i}
              className="flex justify-between bg-muted p-3 rounded-xl cursor-pointer"
              whileHover={{ scale: 1.02, backgroundColor: "rgba(0,0,0,0.05)" }}
              transition={{ duration: 0.2 }}
            >
              <span className="capitalize text-lg">
                {CATEGORY_ICONS[exp.category] || "•"} {exp.description}
              </span>
              <span className="text-primary font-semibold text-lg">
                ₹{exp.amount}
              </span>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
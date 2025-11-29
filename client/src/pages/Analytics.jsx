<<<<<<< HEAD
import { useEffect, useState } from 'react';
=======
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
>>>>>>> updated-design
import useExpenseStore from '@/store/expenseStore';
import { toast } from 'sonner';
import {
  Download,
  TrendingUp,
  TrendingDown,
  Wallet,
  Receipt,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar as CalendarIcon
} from 'lucide-react';
import DateRangePicker from '@/components/analytics/DateRangePicker';
import TrendIndicator from '@/components/analytics/TrendIndicator';
import InsightCard from '@/components/analytics/InsightCard';

<<<<<<< HEAD
const Analytics = () => {
  const { expenses, fetchExpenses } = useExpenseStore();
=======
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

// Premium color palette with subtle, minimalist tones
const PREMIUM_COLORS = ['#64748b', '#475569', '#94a3b8', '#cbd5e1', '#6b7280', '#9ca3af'];

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-3">
        <p className="font-semibold text-sm mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: ₹{entry.value?.toFixed(2)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const { expenses, fetchExpenses } = useExpenseStore();
  const [dateRange, setDateRange] = useState(30);
>>>>>>> updated-design
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        await fetchExpenses();
      } catch (error) {
        console.error('Failed to load analytics:', error);
        toast.error("Failed to load analytics data. Please try logging in again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fetchExpenses]);

<<<<<<< HEAD
  if (loading) {
    return (
      <div className="p-6">
        <div className="text-xl text-white">Loading analytics...</div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Expense Analytics
        </h1>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-semibold mb-2 text-white">No expenses yet</h2>
          <p className="text-gray-400">Add some expenses to see your analytics!</p>
=======
  // Filter expenses by date range
  const filteredExpenses = useMemo(() => {
    if (dateRange === 'all') return expenses;

    const now = new Date();
    let startDate = new Date();

    if (dateRange === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (dateRange === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1);
    } else {
      startDate.setDate(now.getDate() - dateRange);
    }

    return expenses.filter(exp => new Date(exp.date) >= startDate);
  }, [expenses, dateRange]);

  // Calculate all metrics
  const analytics = useMemo(() => {
    if (filteredExpenses.length === 0) {
      return {
        totalSpent: 0,
        avgExpense: 0,
        totalEntries: 0,
        monthlyData: [],
        categoryData: [],
        topExpenses: [],
        dailyAverage: 0,
        trends: { spending: 0, frequency: 0 },
        insights: []
      };
    }

    const totalSpent = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const avgExpense = totalSpent / filteredExpenses.length;

    // Monthly chart data
    const monthlyTotals = filteredExpenses.reduce((acc, exp) => {
      const month = new Date(exp.date).toLocaleString("default", {
        month: "short",
        year: "numeric"
      });
      acc[month] = (acc[month] || 0) + exp.amount;
      return acc;
    }, {});

    const monthlyData = Object.entries(monthlyTotals)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));

    // Category breakdown
    const categoryTotals = filteredExpenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});

    const categoryData = Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Top 5 expenses
    const topExpenses = [...filteredExpenses]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // Daily average
    const days = dateRange === 'all' ? 365 : (typeof dateRange === 'number' ? dateRange : 30);
    const dailyAverage = totalSpent / days;

    // Calculate trends (compare first half vs second half)
    const midPoint = Math.floor(filteredExpenses.length / 2);
    const firstHalf = filteredExpenses.slice(0, midPoint);
    const secondHalf = filteredExpenses.slice(midPoint);

    const firstHalfTotal = firstHalf.reduce((sum, e) => sum + e.amount, 0);
    const secondHalfTotal = secondHalf.reduce((sum, e) => sum + e.amount, 0);
    const spendingTrend = firstHalfTotal === 0 ? 0 : ((secondHalfTotal - firstHalfTotal) / firstHalfTotal) * 100;

    // Generate insights
    const insights = [];
    const topCategory = categoryData[0];
    const avgPerDay = dailyAverage;

    if (spendingTrend > 10) {
      insights.push({
        type: 'warning',
        title: 'Spending Increasing',
        description: `Your expenses have increased by ${spendingTrend.toFixed(1)}% in the recent period. Consider reviewing your budget.`
      });
    } else if (spendingTrend < -10) {
      insights.push({
        type: 'success',
        title: 'Great Progress!',
        description: `You've reduced spending by ${Math.abs(spendingTrend).toFixed(1)}%. Keep up the good work!`
      });
    }

    if (topCategory) {
      insights.push({
        type: 'tip',
        title: `Top Category: ${topCategory.name}`,
        description: `${((topCategory.value / totalSpent) * 100).toFixed(1)}% of your budget goes to ${topCategory.name}. Consider if this aligns with your priorities.`
      });
    }

    if (avgPerDay > 500) {
      insights.push({
        type: 'warning',
        title: 'High Daily Average',
        description: `You're spending ₹${avgPerDay.toFixed(0)} per day on average. Setting daily limits might help.`
      });
    }

    return {
      totalSpent,
      avgExpense,
      totalEntries: filteredExpenses.length,
      monthlyData,
      categoryData,
      topExpenses,
      dailyAverage,
      trends: { spending: spendingTrend },
      insights
    };
  }, [filteredExpenses, dateRange]);

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Date', 'Category', 'Description', 'Amount'];
    const rows = filteredExpenses.map(exp => [
      new Date(exp.date).toLocaleDateString(),
      exp.category,
      exp.description,
      exp.amount
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `voex-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Analytics exported to CSV');
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-12 w-64 bg-muted rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-muted rounded-xl"></div>
          <div className="h-96 bg-muted rounded-xl"></div>
>>>>>>> updated-design
        </div>
      </div>
    );
  }

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const averageExpense = totalSpent / expenses.length;

  // Category icons mapping
  const CATEGORY_ICONS = {
    groceries: '🛒',
    dining: '🍽️',
    food: '🛒',
    transport: '🚗',
    shopping: '🛍️',
    utilities: '⚡',
    bills: '⚡',
    health: '🏥',
    medicine: '🏥',
    entertainment: '🎭',
    travel: '✈️',
    education: '📚',
    work: '💼',
    'personal care': '💅',
    personalcare: '💅',
    fuel: '⛽',
    other: '📦'
  };

  // Get top 5 expenses
  const topExpenses = [...expenses]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return (
<<<<<<< HEAD
    <div className="p-6">
      <h1 className="text-4xl font-bold text-foreground mb-8">
        Expense Analytics
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-200 hover:border hover:border-amber-400">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">💰</span>
            <span className="text-white font-semibold">Total Spent</span>
          </div>
          <p className="text-3xl font-bold text-amber-400">₹{totalSpent.toFixed(2)}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-200 hover:border hover:border-amber-400">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">📊</span>
            <span className="text-white font-semibold">Total Entries</span>
          </div>
          <p className="text-3xl font-bold text-amber-400">{expenses.length}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-200 hover:border hover:border-amber-400">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">📏</span>
            <span className="text-white font-semibold">Average Expense</span>
          </div>
          <p className="text-3xl font-bold text-amber-400">₹{averageExpense.toFixed(2)}</p>
        </div>
      </div>

      {/* Top 5 Expenses */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Top 5 Expenses</h2>
        <div className="space-y-3">
          {topExpenses.map((exp, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-700 p-4 rounded-xl hover:scale-102 hover:shadow-lg transition-all duration-200 hover:border hover:border-amber-400">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{CATEGORY_ICONS[exp.category] || '📦'}</span>
                <div>
                  <p className="text-white font-medium capitalize">{exp.category}: {exp.description}</p>
                  <p className="text-gray-400 text-sm">{new Date(exp.date).toLocaleDateString()}</p>
                </div>
              </div>
              <span className="text-amber-400 font-bold text-xl">₹{exp.amount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Simple Category Breakdown */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Category Breakdown</h2>
        <div className="space-y-3">
          {Object.entries(
            expenses.reduce((acc, exp) => {
              acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
              return acc;
            }, {})
          ).map(([category, amount]) => (
            <div key={category} className="flex items-center justify-between bg-gray-700 p-4 rounded-xl">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{CATEGORY_ICONS[category] || '📦'}</span>
                <span className="text-white font-medium capitalize">{category}</span>
              </div>
              <span className="text-amber-400 font-bold">₹{amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
=======
    <motion.div
      className="space-y-6 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header with title and date range */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 via-slate-600 to-slate-500 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Insights into your spending patterns</p>
        </div>
        <div className="flex gap-2">
          <DateRangePicker currentRange={dateRange} onRangeChange={setDateRange} />
          <Button onClick={exportToCSV} variant="outline" size="icon" title="Export to CSV">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards with trends */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Spent */}
        <Card className="hover:scale-105 transition-transform duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{analytics.totalSpent.toFixed(2)}</div>
            {analytics.trends.spending !== 0 && (
              <div className="mt-2">
                <TrendIndicator value={analytics.trends.spending} isPositive={analytics.trends.spending > 0} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Total Entries */}
        <Card className="hover:scale-105 transition-transform duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalEntries}</div>
            <p className="text-xs text-muted-foreground mt-2">transactions recorded</p>
          </CardContent>
        </Card>

        {/* Average Expense */}
        <Card className="hover:scale-105 transition-transform duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Expense</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{analytics.avgExpense.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-2">per transaction</p>
          </CardContent>
        </Card>

        {/* Daily Average */}
        <Card className="hover:scale-105 transition-transform duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Avg</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{analytics.dailyAverage.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-2">per day</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Spending - Line/Bar Chart */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg border-slate-200 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-slate-600" />
                Spending Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              {analytics.monthlyData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No data available for the selected period
                </div>
              ) : analytics.monthlyData.length === 1 ? (
                // Show bar chart for single data point
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 14, fill: '#64748b' }}
                      axisLine={{ stroke: '#cbd5e1' }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={{ stroke: '#cbd5e1' }}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="amount"
                      fill="#64748b"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={120}
                      animationDuration={800}
                      label={{
                        position: 'top',
                        formatter: (value) => `₹${value.toFixed(2)}`,
                        fill: '#334155',
                        fontSize: 14,
                        fontWeight: 600
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                // Show line chart for multiple data points
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={{ stroke: '#cbd5e1' }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={{ stroke: '#cbd5e1' }}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="natural"
                      dataKey="amount"
                      stroke="#64748b"
                      strokeWidth={3}
                      dot={{ fill: '#64748b', r: 5, strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 7, strokeWidth: 2, stroke: '#fff' }}
                      animationDuration={800}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Breakdown - Donut Chart */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg border-slate-200 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-slate-600" />
                Category Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    animationDuration={800}
                  >
                    {analytics.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PREMIUM_COLORS[index % PREMIUM_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 mt-4 justify-center">
                {analytics.categoryData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: PREMIUM_COLORS[i % PREMIUM_COLORS.length] }}
                    ></div>
                    <span className="capitalize">{CATEGORY_ICONS[item.name] || "•"} {item.name}</span>
                    <span className="font-semibold">₹{item.value.toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Insights Section */}
      {analytics.insights.length > 0 && (
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            Smart Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.insights.map((insight, index) => (
              <InsightCard
                key={index}
                type={insight.type}
                title={insight.title}
                description={insight.description}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Top Expenses */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-lg backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Top 5 Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topExpenses.map((exp, i) => (
                <motion.div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                  whileHover={{ scale: 1.02, x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{CATEGORY_ICONS[exp.category] || "📦"}</div>
                    <div>
                      <p className="font-medium capitalize">{exp.description}</p>
                      <p className="text-sm text-muted-foreground capitalize">{exp.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-700">₹{exp.amount.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{new Date(exp.date).toLocaleDateString()}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
>>>>>>> updated-design
  );
};

export default Analytics;
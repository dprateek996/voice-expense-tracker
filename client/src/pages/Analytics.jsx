import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip
} from 'recharts';
import { Download, Wallet, Receipt, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useExpenseStore from '@/store/expenseStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const CATEGORY_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6'];

const Analytics = () => {
  const { expenses, fetchExpenses } = useExpenseStore();
  const [dateRange, setDateRange] = useState('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchExpenses();
      setLoading(false);
    };
    load();
  }, [fetchExpenses]);

  const filteredExpenses = useMemo(() => {
    const now = new Date();
    let startDate = new Date();

    if (dateRange === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (dateRange === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (dateRange === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    return expenses.filter(exp => new Date(exp.date) >= startDate);
  }, [expenses, dateRange]);

  const analytics = useMemo(() => {
    if (filteredExpenses.length === 0) {
      return {
        totalSpent: 0,
        avgExpense: 0,
        totalEntries: 0,
        chartData: [],
        categoryData: [],
        dailyAverage: 0,
        trend: 0
      };
    }

    const totalSpent = filteredExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const avgExpense = totalSpent / filteredExpenses.length;

    const chartData = [];
    const now = new Date();

    if (dateRange === 'week') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayExp = filteredExpenses.filter(exp =>
          new Date(exp.date).toDateString() === date.toDateString()
        );
        chartData.push({
          name: date.toLocaleDateString('en-US', { weekday: 'short' }),
          amount: dayExp.reduce((sum, exp) => sum + (exp.amount || 0), 0)
        });
      }
    } else if (dateRange === 'month') {
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      for (let day = 1; day <= Math.min(daysInMonth, now.getDate()); day++) {
        const date = new Date(now.getFullYear(), now.getMonth(), day);
        const dayExp = filteredExpenses.filter(exp =>
          new Date(exp.date).toDateString() === date.toDateString()
        );
        chartData.push({
          name: day.toString(),
          amount: dayExp.reduce((sum, exp) => sum + (exp.amount || 0), 0)
        });
      }
    } else {
      for (let month = 0; month < 12; month++) {
        const date = new Date(now.getFullYear(), month, 1);
        const monthExp = filteredExpenses.filter(exp => {
          const expDate = new Date(exp.date);
          return expDate.getMonth() === month && expDate.getFullYear() === now.getFullYear();
        });
        chartData.push({
          name: date.toLocaleDateString('en-US', { month: 'short' }),
          amount: monthExp.reduce((sum, exp) => sum + (exp.amount || 0), 0)
        });
      }
    }

    const categoryTotals = {};
    filteredExpenses.forEach(exp => {
      const cat = exp.category || 'other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + (exp.amount || 0);
    });
    const categoryData = Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const mid = Math.floor(filteredExpenses.length / 2);
    const firstHalf = filteredExpenses.slice(0, mid).reduce((sum, e) => sum + (e.amount || 0), 0);
    const secondHalf = filteredExpenses.slice(mid).reduce((sum, e) => sum + (e.amount || 0), 0);
    const trend = firstHalf > 0 ? ((secondHalf - firstHalf) / firstHalf) * 100 : 0;

    const days = dateRange === 'week' ? 7 : dateRange === 'month' ? 30 : 365;
    const dailyAverage = totalSpent / days;

    return {
      totalSpent,
      avgExpense,
      totalEntries: filteredExpenses.length,
      chartData,
      categoryData,
      dailyAverage,
      trend
    };
  }, [filteredExpenses, dateRange]);

  const exportToCSV = () => {
    const headers = ['Date', 'Category', 'Description', 'Amount'];
    const rows = filteredExpenses.map(exp => [
      new Date(exp.date).toLocaleDateString(),
      exp.category,
      exp.description,
      exp.amount
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `voex-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('Exported to CSV');
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto w-full py-8 px-6 space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-muted rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-muted rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-80 bg-muted rounded-2xl" />
          <div className="h-80 bg-muted rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full py-8 px-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="text-muted-foreground text-sm mb-1">Insights into your spending</p>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-semibold text-foreground">Analytics</h1>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-full">
              {[
                { key: 'week', label: '7 Days' },
                { key: 'month', label: 'Month' },
                { key: 'year', label: 'Year' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setDateRange(tab.key)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-full transition-all",
                    dateRange === tab.key
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <Button variant="outline" size="icon" onClick={exportToCSV} title="Export CSV">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Wallet className="w-5 h-5 text-muted-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">Total Spent</span>
          </div>
          <div className="text-2xl font-semibold text-foreground">
            ₹{analytics.totalSpent.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Receipt className="w-5 h-5 text-muted-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">Transactions</span>
          </div>
          <div className="text-2xl font-semibold text-foreground">
            {analytics.totalEntries}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Calendar className="w-5 h-5 text-muted-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">Daily Avg</span>
          </div>
          <div className="text-2xl font-semibold text-foreground">
            ₹{analytics.dailyAverage.toFixed(0)}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              {analytics.trend > 0 ? (
                <TrendingUp className="w-5 h-5 text-red-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-emerald-500" />
              )}
            </div>
            <span className="text-sm text-muted-foreground">Trend</span>
          </div>
          <div className={cn(
            "text-2xl font-semibold",
            analytics.trend > 0 ? "text-red-500" : "text-emerald-500"
          )}>
            {analytics.trend > 0 ? '+' : ''}{analytics.trend.toFixed(0)}%
          </div>
        </div>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Spending Over Time</h2>
          <div className="h-64">
            {analytics.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.chartData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--foreground))" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="hsl(var(--foreground))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    tickFormatter={(v) => `₹${v}`}
                    width={60}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px'
                    }}
                    formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Spent']}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="hsl(var(--foreground))"
                    strokeWidth={2}
                    fill="url(#colorAmount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Category Breakdown</h2>
          <div className="h-48">
            {analytics.categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {analytics.categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px'
                    }}
                    formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {analytics.categoryData.slice(0, 5).map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}
                />
                <span className="capitalize text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
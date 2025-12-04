import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { WobbleCard } from '@/components/ui/wobble-card';
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

    const totalSpent = filteredExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const avgExpense = filteredExpenses.length > 0 ? totalSpent / filteredExpenses.length : 0;

    // Generate chart data based on selected date range
    let monthlyData = [];
    const now = new Date();
    
    if (dateRange === 7) {
      // Last 7 days - daily data
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const dayExpenses = filteredExpenses.filter(exp => {
          const expDate = new Date(exp.date);
          expDate.setHours(0, 0, 0, 0);
          return expDate.getTime() === date.getTime();
        });
        
        const amount = dayExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
        monthlyData.push({
          month: date.toLocaleDateString('en-US', { weekday: 'short' }),
          amount,
          date: date.toISOString()
        });
      }
    } else if (dateRange === 'month') {
      // Current month - daily data
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(now.getFullYear(), now.getMonth(), day);
        date.setHours(0, 0, 0, 0);
        
        const dayExpenses = filteredExpenses.filter(exp => {
          const expDate = new Date(exp.date);
          expDate.setHours(0, 0, 0, 0);
          return expDate.getTime() === date.getTime();
        });
        
        const amount = dayExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
        monthlyData.push({
          month: date.getDate().toString(),
          amount,
          date: date.toISOString()
        });
      }
    } else if (dateRange === 'year') {
      // Current year - monthly data
      for (let month = 0; month < 12; month++) {
        const date = new Date(now.getFullYear(), month, 1);
        const nextMonth = new Date(now.getFullYear(), month + 1, 1);
        
        const monthExpenses = filteredExpenses.filter(exp => {
          const expDate = new Date(exp.date);
          return expDate >= date && expDate < nextMonth;
        });
        
        const amount = monthExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
        monthlyData.push({
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          amount,
          date: date.toISOString()
        });
      }
    } else {
      // Custom numeric range (fallback)
      const days = typeof dateRange === 'number' ? dateRange : 30;
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const dayExpenses = filteredExpenses.filter(exp => {
          const expDate = new Date(exp.date);
          expDate.setHours(0, 0, 0, 0);
          return expDate.getTime() === date.getTime();
        });
        
        const amount = dayExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
        monthlyData.push({
          month: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          amount,
          date: date.toISOString()
        });
      }
    }

    // Category breakdown
    const categoryTotals = filteredExpenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + (exp.amount || 0);
      return acc;
    }, {});

    const categoryData = Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Top 5 expenses
    const topExpenses = [...filteredExpenses]
      .sort((a, b) => (b.amount || 0) - (a.amount || 0))
      .slice(0, 5);

    // Daily average
    const days = dateRange === 'all' ? 365 : (typeof dateRange === 'number' ? dateRange : 30);
    const dailyAverage = days > 0 ? totalSpent / days : 0;

    // Calculate trends (compare first half vs second half)
    const midPoint = Math.floor(filteredExpenses.length / 2);
    const firstHalf = filteredExpenses.slice(0, midPoint);
    const secondHalf = filteredExpenses.slice(midPoint);

    const firstHalfTotal = firstHalf.reduce((sum, e) => sum + (e.amount || 0), 0);
    const secondHalfTotal = secondHalf.reduce((sum, e) => sum + (e.amount || 0), 0);
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
        </div>
      </div>
    );
  }

  return (
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
        <WobbleCard containerClassName="min-h-[140px]">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2 -mt-6">
            <div className="text-sm font-medium">Total Spent</div>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">₹{analytics.totalSpent.toFixed(2)}</div>
            {analytics.trends.spending !== 0 && (
              <div className="mt-2">
                <TrendIndicator value={analytics.trends.spending} isPositive={analytics.trends.spending > 0} />
              </div>
            )}
          </div>
        </WobbleCard>

        {/* Total Entries */}
        <WobbleCard containerClassName="min-h-[140px]">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2 -mt-6">
            <div className="text-sm font-medium">Total Entries</div>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">{analytics.totalEntries}</div>
            <p className="text-xs text-muted-foreground mt-2">transactions recorded</p>
          </div>
        </WobbleCard>

        {/* Average Expense */}
        <WobbleCard containerClassName="min-h-[140px]">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2 -mt-6">
            <div className="text-sm font-medium">Avg Expense</div>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">₹{analytics.avgExpense.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-2">per transaction</p>
          </div>
        </WobbleCard>

        {/* Daily Average */}
        <WobbleCard containerClassName="min-h-[140px]">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2 -mt-6">
            <div className="text-sm font-medium">Daily Avg</div>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">₹{analytics.dailyAverage.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-2">per day</p>
          </div>
        </WobbleCard>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Spending - Glassmorphic Design */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-blue-950 border-none shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-3xl overflow-hidden backdrop-blur-xl">
            {/* Glassmorphic overlay with animation */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-blue-900/20 backdrop-blur-sm"
              animate={{ opacity: [0.5, 0.7, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <CardContent className="relative p-8">
              {/* Header Section */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-white text-3xl font-bold mb-2">
                    ₹{analytics.totalSpent.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-white/50">
                    Compared to last month 
                    <span className="text-white/80 ml-1">
                      {analytics.trends.spending > 0 ? '+' : ''}{analytics.trends.spending.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Time Range Tabs */}
              <div className="flex gap-2 mb-6 flex-wrap">
                {[
                  { label: '7d', value: 7 },
                  { label: 'Month', value: 'month' },
                  { label: 'Year', value: 'year' }
                ].map((period) => (
                  <motion.button
                    key={period.label}
                    onClick={() => setDateRange(period.value)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      dateRange === period.value
                        ? 'bg-blue-600/40 text-white backdrop-blur-sm shadow-lg scale-105'
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                  >
                    {period.label}
                  </motion.button>
                ))}
              </div>

              {/* Chart Area */}
              <div className="h-64 w-full relative">
                {analytics.monthlyData.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-white/50">
                    <div className="text-6xl mb-4">📊</div>
                    <div className="text-lg font-medium mb-2">No expense data</div>
                    <div className="text-sm">Add expenses to see your analytics</div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={analytics.monthlyData}
                      margin={{ top: 20, right: 10, left: -20, bottom: 20 }}
                    >
                      <defs>
                        <filter id="analyticsGlow">
                          <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                        <linearGradient id="analyticsLineGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="rgba(96,165,250,0.8)" />
                          <stop offset="50%" stopColor="rgba(96,165,250,1)" />
                          <stop offset="100%" stopColor="rgba(147,197,253,0.8)" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.5)' }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.5)' }}
                        tickFormatter={(value) => `₹${value}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(30, 41, 59, 0.95)',
                          borderRadius: '16px',
                          border: '1px solid rgba(96,165,250,0.3)',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                          backdropFilter: 'blur(10px)',
                          padding: '12px 16px'
                        }}
                        itemStyle={{ color: '#fff', fontWeight: '600' }}
                        labelStyle={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}
                        formatter={(value) => [`₹${value.toFixed(2)}`, '']}
                        cursor={{ stroke: 'rgba(96,165,250,0.3)', strokeWidth: 2 }}
                        animationDuration={300}
                      />
                      <Line
                        type="natural"
                        dataKey="amount"
                        stroke="url(#analyticsLineGradient)"
                        strokeWidth={4}
                        filter="url(#analyticsGlow)"
                        dot={(props) => {
                          const { cx, cy, payload } = props;
                          if (payload.amount === 0) return null;
                          return (
                            <circle
                              cx={cx}
                              cy={cy}
                              r={5}
                              fill="white"
                              stroke="rgba(96,165,250,0.8)"
                              strokeWidth={3}
                              filter="drop-shadow(0 0 6px rgba(96,165,250,0.8))"
                            />
                          );
                        }}
                        activeDot={(props) => {
                          const { cx, cy, payload } = props;
                          if (payload.amount === 0) return null;
                          return (
                            <circle
                              cx={cx}
                              cy={cy}
                              r={8}
                              fill="white"
                              stroke="rgba(96,165,250,1)"
                              strokeWidth={4}
                              filter="drop-shadow(0 0 10px rgba(96,165,250,1))"
                            />
                          );
                        }}
                        animationDuration={2500}
                        animationEasing="ease-in-out"
                        isAnimationActive={true}
                        connectNulls
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Average Info */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Daily average</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-lg">
                      ₹{analytics.dailyAverage.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </span>
                    {analytics.trends.spending > 0 ? (
                      <TrendingUp className="w-4 h-4 text-red-300" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-green-300" />
                    )}
                  </div>
                </div>
              </div>

              {/* How it works button */}
              <motion.button 
                className="absolute bottom-6 right-6 flex items-center gap-2 text-white/70 hover:text-white text-xs transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center">
                  <span className="text-[10px]">?</span>
                </div>
                How it works?
              </motion.button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Breakdown - Donut Chart */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg border-slate-200 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-muted-foreground" />
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
                    <p className="text-xl font-bold text-foreground">₹{exp.amount.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{new Date(exp.date).toLocaleDateString()}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;
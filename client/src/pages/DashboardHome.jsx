import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Target, Zap, ArrowUpRight, ArrowDownRight, Utensils, ShoppingCart, Car, Coffee, Music, Home, Shirt, Landmark, Search, ChevronDown, ShoppingBag, ArrowRight, Sparkles, Receipt } from 'lucide-react';
import CustomMic from '../components/CustomMic';
import CustomCalendar from '../components/CustomCalendar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WobbleCard } from '@/components/ui/wobble-card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import useExpenseStore from '@/store/expenseStore';
import useVoiceStore from '@/store/voiceStore';

const getCategoryIcon = (category) => {
  const cat = category.toLowerCase();
  if (cat.includes('food') || cat.includes('dining') || cat.includes('restaurant')) return <Utensils className="w-5 h-5" />;
  if (cat.includes('shop') || cat.includes('grocer')) return <ShoppingCart className="w-5 h-5" />;
  if (cat.includes('travel') || cat.includes('transport') || cat.includes('cab') || cat.includes('uber')) return <Car className="w-5 h-5" />;
  if (cat.includes('coffee') || cat.includes('cafe')) return <Coffee className="w-5 h-5" />;
  if (cat.includes('entertainment') || cat.includes('movie')) return <Music className="w-5 h-5" />;
  if (cat.includes('home') || cat.includes('rent') || cat.includes('utility')) return <Home className="w-5 h-5" />;
  if (cat.includes('cloth') || cat.includes('fashion')) return <Shirt className="w-5 h-5" />;
  return <Landmark className="w-5 h-5" />;
};

// Calculate today's expenses
const getTodaysExpenses = (expenses) => {
  const today = new Date().toDateString();
  return expenses.filter(exp => new Date(exp.date).toDateString() === today);
};

// Calculate this week's expenses
const getThisWeeksExpenses = (expenses) => {
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  startOfWeek.setHours(0, 0, 0, 0);
  return expenses.filter(exp => new Date(exp.date) >= startOfWeek);
};

// Count-up animation hook
const useCountUp = (end, duration = 1000) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime;
    let animationFrame;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  return count;
};

const DashboardHome = () => {
  const { expenses, fetchExpenses, budget, setBudget } = useExpenseStore();
  const { open } = useVoiceStore();
  const [todaysExpenses, setTodaysExpenses] = useState([]);
  const [thisWeeksExpenses, setThisWeeksExpenses] = useState([]);
  const [budgetProgress, setBudgetProgress] = useState(0);
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [tempBudget, setTempBudget] = useState('');

  useEffect(() => {
    if (expenses.length === 0) {
      fetchExpenses();
    }
  }, [fetchExpenses, expenses.length]);

  useEffect(() => {
    const today = getTodaysExpenses(expenses);
    const week = getThisWeeksExpenses(expenses);
    setTodaysExpenses(today);
    setThisWeeksExpenses(week);

    // Calculate budget progress for current month
    const currentMonthExpenses = expenses.filter(expense => {
      const expDate = new Date(expense.date);
      const now = new Date();
      return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
    });
    const totalSpent = currentMonthExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
    const budgetPercentage = budget > 0 ? (totalSpent / budget) * 100 : 0;
    setBudgetProgress(Math.min(budgetPercentage, 100));
  }, [expenses, budget]);

  const todaysTotal = todaysExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const weeksTotal = thisWeeksExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const avgDailyThisWeek = weeksTotal / 7;

  // Calculate last week's total for comparison
  const getLastWeeksExpenses = (expenses) => {
    const now = new Date();
    const startOfLastWeek = new Date(now);
    startOfLastWeek.setDate(now.getDate() - now.getDay() - 7);
    startOfLastWeek.setHours(0, 0, 0, 0);
    
    const endOfLastWeek = new Date(startOfLastWeek);
    endOfLastWeek.setDate(startOfLastWeek.getDate() + 7);
    
    return expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate >= startOfLastWeek && expDate < endOfLastWeek;
    });
  };

  const lastWeeksExpenses = getLastWeeksExpenses(expenses);
  const lastWeeksTotal = lastWeeksExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const weeklyComparison = lastWeeksTotal > 0 
    ? (((weeksTotal - lastWeeksTotal) / lastWeeksTotal) * 100).toFixed(1)
    : 0;

  // Calculate daily spending for the week
  const getWeeklyChartData = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return weekDays.map((day, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      
      // Calculate expenses for this day
      const dayExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.toDateString() === date.toDateString();
      });
      
      const amount = dayExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
      
      return {
        name: day,
        amount: amount,
        date: date.toISOString()
      };
    });
  };

  const weeklyData = getWeeklyChartData();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 font-sans"
    >
      {/* Enhanced Header Section with Better Hierarchy */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="space-y-4"
      >
        {/* Top Bar - Restructured */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Left Group: Search */}
          <div className="flex-1 max-w-2xl w-full">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-cyan-400 transition-colors" />
              <Input
                placeholder="Search expenses, merchants..."
                className="pl-12 h-12 bg-neutral-900/60 backdrop-blur-xl border-white/10 rounded-[20px] focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 text-base transition-all"
              />
            </div>
          </div>

          {/* Right Group: Month Selector + Add Expense */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="outline" className="hidden md:flex items-center h-12 rounded-2xl font-medium border-white/10 bg-neutral-900/40 backdrop-blur-xl hover:bg-neutral-900/60 hover:border-white/20 transition-all">
              📅 November 2025 <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
            <Button 
              onClick={open} 
              size="lg" 
              className="h-12 rounded-[20px] bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/25 transition-all duration-150 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50 active:scale-95 active:shadow-md font-medium group relative overflow-hidden"
            >
              <CustomMic className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform relative z-10" />
              <span className="relative z-10">Add Expense</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Key Metrics Grid with Animations - Balanced Spacing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
        {/* Today's Spend - Enhanced with animated gradient */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-neutral-900/60 to-neutral-900/40 backdrop-blur-xl border-white/10 rounded-2xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.08)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.12),0_8px_24px_rgba(34,211,238,0.15)] transition-all duration-500 group">
            {/* Subtle background noise texture */}
            <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="3.5" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E")', backgroundRepeat: 'repeat', backgroundSize: '100px 100px' }} />
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-sky-500/5 animate-pulse" style={{ animationDuration: '8s' }} />
            
            <CardContent className="relative p-6 space-y-4 flex flex-col justify-between min-h-[180px]">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-white/60 flex items-center gap-2">
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="h-5 w-5 text-cyan-400" />
                  </div>
                  <span>Today's Spend</span>
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  ₹{useCountUp(todaysTotal, 1200).toLocaleString()}
                </div>
                <div className="space-y-1 mt-2">
                  <p className="text-sm text-white/50 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                    {todaysExpenses.length} transactions
                  </p>
                  <p className="text-xs text-white/30">Updated just now</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* This Week - Enhanced */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-neutral-900/60 to-neutral-900/40 backdrop-blur-xl border-white/10 rounded-2xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.08)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.12),0_8px_24px_rgba(147,51,234,0.15)] transition-all duration-500 group">
            {/* Subtle background noise texture */}
            <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="3.5" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E")', backgroundRepeat: 'repeat', backgroundSize: '100px 100px' }} />
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 animate-pulse" style={{ animationDuration: '10s' }} />
            
            <CardContent className="relative p-6 space-y-4 flex flex-col justify-between min-h-[180px]">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-white/60 flex items-center gap-2">
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                  </div>
                  <span>This Week</span>
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  ₹{useCountUp(weeksTotal, 1200).toLocaleString()}
                </div>
                <div className="space-y-1 mt-2">
                  <p className="text-sm text-white/50 flex items-center gap-2">
                    <span className={`flex items-center gap-1 ${weeklyComparison >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {weeklyComparison >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {Math.abs(weeklyComparison)}% vs last week
                    </span>
                  </p>
                  <p className="text-xs text-white/30">Daily average: ₹{avgDailyThisWeek.toFixed(0)}/day</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Last Expense - Enhanced with category icon and view details */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-neutral-900/60 to-neutral-900/40 backdrop-blur-xl border-white/10 rounded-2xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.08)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.12),0_8px_24px_rgba(249,115,22,0.15)] transition-all duration-500 group">
            {/* Subtle background noise texture */}
            <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="3.5" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E")', backgroundRepeat: 'repeat', backgroundSize: '100px 100px' }} />
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-amber-500/5 animate-pulse" style={{ animationDuration: '12s' }} />
            
            <CardContent className="relative p-6 space-y-4 flex flex-col justify-between min-h-[180px]">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-white/60 flex items-center gap-2">
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Receipt className="h-5 w-5 text-orange-400" />
                  </div>
                  <span>Last Expense</span>
                </div>
              </div>
              {expenses.length > 0 ? (
                <div>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-white/80 shrink-0">
                      {getCategoryIcon(expenses[0].category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-bold text-white truncate">
                        {expenses[0].description === 'Voice Entry' ? 'Expense' : expenses[0].description}
                      </p>
                      <p className="text-sm text-white/50 capitalize">{expenses[0].category}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="text-2xl font-bold text-white">₹{expenses[0].amount.toFixed(2)}</span>
                    <button className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 group/btn">
                      View Details
                      <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-white/40">
                    <span>{new Date(expenses[0].date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>•</span>
                    <span className="capitalize">Category: {expenses[0].category}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-3">
                    <Receipt className="h-8 w-8 text-white/20" />
                  </div>
                  <p className="text-sm text-white/40">No expenses yet</p>
                  <button onClick={open} className="text-xs text-cyan-400 hover:text-cyan-300 mt-2 font-medium">Add your first expense</button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid with Increased Spacing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Left Column: Weekly Trend & Recent Activity */}
        <div className="lg:col-span-2 space-y-8">

          {/* Weekly Spending Trend Chart - Glassmorphic Design */}
          <Card className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-blue-950 border-none shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-xl overflow-hidden backdrop-blur-xl">
            {/* Subtle background noise texture */}
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="3.5" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E")', backgroundRepeat: 'repeat', backgroundSize: '100px 100px' }} />
            {/* Glass top border effect */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            {/* Glassmorphic overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-blue-900/20 backdrop-blur-sm" />
            
            <CardContent className="relative p-8">
              {/* Header Section */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="text-white/70 text-sm font-medium mb-2">₹{weeksTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                  <div className="text-xs text-white/50">
                    Compared to last week 
                    {lastWeeksTotal > 0 ? (
                      <span className={`ml-1 ${weeklyComparison >= 0 ? 'text-red-300' : 'text-green-300'}`}>
                        {weeklyComparison > 0 ? '+' : ''}{weeklyComparison}%
                      </span>
                    ) : (
                      <span className="text-white/80 ml-1">No data</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Time Range Tabs - Enhanced with stronger contrast */}
              <div className="flex gap-3 mb-6">
                {['24h', 'Week', 'Month'].map((period) => (
                  <button
                    key={period}
                    className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                      period === 'Week'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50 scale-105 ring-2 ring-cyan-400/30'
                        : 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white/80 hover:scale-105'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>

              {/* Chart Area */}
              <div className="h-64 w-full relative">
                {weeklyData.every(day => day.amount === 0) ? (
                  <div className="h-full flex flex-col items-center justify-center text-white/50">
                    <div className="text-6xl mb-4">📊</div>
                    <div className="text-lg font-medium mb-2">No expenses this week</div>
                    <div className="text-sm">Add an expense to see your spending chart</div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={weeklyData}
                      margin={{ top: 20, right: 10, left: -20, bottom: 20 }}
                    >
                      <defs>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="rgba(96,165,250,0.8)" />
                          <stop offset="50%" stopColor="rgba(96,165,250,1)" />
                          <stop offset="100%" stopColor="rgba(147,197,253,0.8)" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.5)' }}
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
                        formatter={(value, name, props) => {
                          const date = new Date(props.payload.date);
                          const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                          return [`₹${value.toFixed(2)}`, dateStr];
                        }}
                        cursor={{ stroke: 'rgba(96,165,250,0.3)', strokeWidth: 2 }}
                        animationDuration={300}
                      />
                      <Line
                        type="natural"
                        dataKey="amount"
                        stroke="url(#lineGradient)"
                        strokeWidth={4}
                        filter="url(#glow)"
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

              {/* Monthly Summary Bar - Premium Feature */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="grid grid-cols-3 gap-6">
                  {/* Total Spend */}
                  <div className="space-y-1">
                    <div className="text-xs text-white/40 font-medium">Total Spend</div>
                    <div className="text-lg font-bold text-white">₹{(weeksTotal * 4.33).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                  </div>
                  {/* Top Category */}
                  <div className="space-y-1">
                    <div className="text-xs text-white/40 font-medium">Top Category</div>
                    <div className="text-lg font-bold text-cyan-400 truncate">
                      {expenses.length > 0 ? expenses[0].category : 'N/A'}
                    </div>
                  </div>
                  {/* Highest Day */}
                  <div className="space-y-1">
                    <div className="text-xs text-white/40 font-medium">Highest Day</div>
                    <div className="text-lg font-bold text-white">
                      {weeklyData.reduce((max, day) => day.amount > max.amount ? day : max, weeklyData[0])?.name || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity List with Enhanced Empty State */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-16"
          >
            <Card className="bg-gradient-to-br from-neutral-900/60 to-neutral-900/40 backdrop-blur-xl border-white/10 shadow-md rounded-2xl overflow-hidden">
              {/* Subtle background noise texture */}
              <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="3.5" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E")', backgroundRepeat: 'repeat', backgroundSize: '100px 100px' }} />
              <CardHeader className="border-b border-white/10 pb-4 pt-6 px-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                    Recent Activity
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 font-medium text-xs rounded-xl">View All</Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0 px-0">
                {todaysExpenses.length > 0 ? (
                  <div className="divide-y divide-white/5">
                    {todaysExpenses.map((expense, index) => (
                      <motion.div
                        key={expense.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="group flex items-center justify-between p-6 hover:bg-white/5 transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white/60 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 group-hover:scale-110 transition-all duration-200">
                            {getCategoryIcon(expense.category)}
                          </div>
                          <div>
                            <p className="font-bold text-white text-base group-hover:text-cyan-400 transition-colors">{expense.description}</p>
                            <p className="text-sm text-white/50 capitalize">{expense.category}</p>
                          </div>
                        </div>
                        <p className="font-bold text-white text-base">₹{expense.amount.toFixed(2)}</p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 px-8">
                    {/* Professional Empty State */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <div className="relative w-24 h-24 mx-auto mb-6">
                        {/* Animated background circles */}
                        <div className="absolute inset-0 bg-cyan-500/10 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                        <div className="absolute inset-0 bg-cyan-500/5 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
                        <div className="relative w-full h-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center border border-cyan-500/30">
                          <CustomMic className="h-12 w-12 text-cyan-400" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">No expenses yet today</h3>
                      <p className="text-white/50 text-sm mb-6 max-w-xs mx-auto">
                        Start tracking your expenses with voice commands or manual entry
                      </p>
                      <div className="flex flex-col gap-3">
                        <Button 
                          onClick={open}
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 transition-all"
                        >
                          <CustomMic className="h-4 w-4 mr-2" />
                          Add First Expense
                        </Button>
                        <div className="flex items-center gap-2 text-xs text-white/40">
                          <div className="h-px flex-1 bg-white/10" />
                          <span>Quick Tips</span>
                          <div className="h-px flex-1 bg-white/10" />
                        </div>
                        <div className="space-y-2 text-left">
                          {[
                            { icon: '🎤', text: 'Use voice for quick entry' },
                            { icon: '🏷️', text: 'Auto-categorization powered by AI' },
                            { icon: '📊', text: 'Track spending patterns' }
                          ].map((tip, i) => (
                            <motion.div
                              key={i}
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.8 + i * 0.1 }}
                              className="flex items-center gap-3 text-sm text-white/60 bg-white/5 px-4 py-2 rounded-xl border border-white/10"
                            >
                              <span className="text-lg">{tip.icon}</span>
                              <span>{tip.text}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

        </div>

        {/* Right Column: Quick Add & Insights */}
        <div className="space-y-8">

          {/* Enhanced Quick Add Card with AI Hints and Budget Ring */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-neutral-900/60 to-neutral-900/40 backdrop-blur-xl border-white/10 rounded-[20px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.08)] h-fit">
              {/* Subtle background noise texture */}
              <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="3.5" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E")', backgroundRepeat: 'repeat', backgroundSize: '100px 100px' }} />
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 animate-pulse" style={{ animationDuration: '6s' }} />
              
              <CardHeader className="relative pb-0 pt-6 px-6 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-cyan-400" />
                  Quick Add
                </CardTitle>
                <div className="flex items-center gap-2 text-xs font-medium bg-cyan-500/10 px-3 py-1.5 rounded-full border border-cyan-500/20">
                  <span className="text-white/60">Budget</span>
                  <span className="text-cyan-400 font-bold">{budgetProgress.toFixed(0)}%</span>
                </div>
              </CardHeader>
              
              <CardContent className="relative flex flex-col items-center justify-center py-10 px-6 text-center">
                {/* Microphone with Soft Glow and Slow Pulsing Animation */}
                <div className="relative mb-6 cursor-pointer group" onClick={open}>
                  {/* Soft pulsing glow - premium, not neon */}
                  <div className="absolute inset-0 rounded-full">
                    <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-xl animate-pulse" style={{ animationDuration: '4s', animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }} />
                  </div>
                  
                  {/* Budget progress ring */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90" style={{ width: '120px', height: '120px', top: '-20px', left: '-20px' }}>
                    <circle
                      cx="60"
                      cy="60"
                      r="56"
                      stroke="rgba(34, 211, 238, 0.1)"
                      strokeWidth="3"
                      fill="none"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="56"
                      stroke="url(#budgetGradient)"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - budgetProgress / 100)}`}
                      className="transition-all duration-1000 ease-out"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="budgetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Microphone button with slow 2% growth pulse */}
                  <div className="relative w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-xl group-hover:shadow-cyan-500/30 group-hover:scale-110 transition-all duration-300 animate-[pulse_4s_cubic-bezier(0.4,0,0.2,1)_infinite]">
                    <CustomMic className="w-9 h-9 text-white group-hover:scale-110 transition-transform" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">Add Expense</h3>
                <p className="text-white/50 text-sm mb-6">
                  Powered by AI voice recognition
                </p>

                {/* AI Hints with improved spacing */}
                <div className="w-full space-y-2 bg-white/5 rounded-2xl p-5 border border-white/10">
                  <p className="text-xs text-white/40 font-medium mb-4">💡 Try saying:</p>
                  <div className="space-y-3">
                    {[
                      '"Lunch 150"',
                      '"Uber 200"',
                      '"Groceries 500"'
                    ].map((hint, i) => (
                      <motion.div
                        key={hint}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        className="text-sm text-white/60 bg-white/5 px-3 py-2 rounded-xl hover:bg-white/10 hover:text-white/80 transition-all cursor-pointer border border-white/5 hover:border-cyan-500/30"
                      >
                        {hint}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Budget Input Dialog */}
      <Dialog open={isBudgetDialogOpen} onOpenChange={setIsBudgetDialogOpen}>
        <DialogContent className="bg-card rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">Set Monthly Budget</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="budget" className="text-sm font-medium text-foreground">Monthly Budget (₹)</label>
              <Input
                id="budget"
                type="number"
                placeholder="Enter amount"
                value={tempBudget}
                onChange={(e) => setTempBudget(e.target.value)}
                className="mt-1.5 bg-background focus:ring-primary rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBudgetDialogOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={() => {
              const newBudget = Number(tempBudget);
              if (newBudget > 0) {
                setBudget(newBudget);
              }
              setIsBudgetDialogOpen(false);
            }} className="bg-primary text-white rounded-xl shadow-lg shadow-primary/20">
              Save Budget
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mobile Floating Action Button */}
      <Button
        onClick={open}
        size="icon"
        className="md:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60 hover:scale-110 z-50 flex items-center justify-center transition-all"
      >
        <CustomMic className="h-6 w-6 text-white" />
      </Button>
    </motion.div>
  );
};

export default DashboardHome;
import { useEffect, useState } from 'react';
import { TrendingUp, Calendar, Target, Zap, ArrowUpRight, ArrowDownRight, Utensils, ShoppingCart, Car, Coffee, Music, Home, Shirt, Landmark, Search, ChevronDown, ShoppingBag } from 'lucide-react';
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
    <div className="space-y-8 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-heading">Dashboard</h1>

        {/* Search Bar */}
        <div className="flex-1 max-w-md w-full mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search expenses, merchants..."
              className="pl-10 bg-background border-input rounded-full focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <Button variant="outline" className="hidden md:flex items-center rounded-full font-medium">
            November 2025 <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
          <Button onClick={open} size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 transition-all hover:scale-105">
            <CustomMic className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Spend */}
        <WobbleCard containerClassName="col-span-1 min-h-[160px]">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium text-muted-foreground font-sans">Today's Spend</div>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
              <CustomCalendar className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-foreground">₹{todaysTotal.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {todaysExpenses.length} transactions
            </p>
          </div>
        </WobbleCard>

        {/* This Week */}
        <WobbleCard containerClassName="col-span-1 min-h-[160px]">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium text-muted-foreground flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-purple-500" /> This Week
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-foreground">₹{weeksTotal.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Avg: ₹{avgDailyThisWeek.toFixed(2)}/day
            </p>
          </div>
        </WobbleCard>

        {/* Last Expense */}
        <WobbleCard containerClassName="col-span-1 min-h-[160px]">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium text-muted-foreground flex items-center">
              <ShoppingBag className="w-4 h-4 mr-2 text-orange-500" /> Last Expense
            </div>
          </div>
          <div>
            {expenses.length > 0 ? (
              <>
                <div className="text-xl font-bold text-foreground truncate">
                  {expenses[0].description === 'Voice Entry' ? 'Expense' : expenses[0].description} <span className="text-muted-foreground font-normal">-</span> ₹{expenses[0].amount}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(expenses[0].date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </>
            ) : (
              <div className="text-sm text-muted-foreground mt-2">No expenses yet</div>
            )}
          </div>
        </WobbleCard>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Weekly Trend & Recent Activity */}
        <div className="lg:col-span-2 space-y-8">

          {/* Weekly Spending Trend Chart - Glassmorphic Design */}
          <Card className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-blue-950 border-none shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-3xl overflow-hidden backdrop-blur-xl">
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

              {/* Time Range Tabs */}
              <div className="flex gap-2 mb-6">
                {['24h', 'Week', 'Month'].map((period) => (
                  <button
                    key={period}
                    className={`px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      period === 'Week'
                        ? 'bg-blue-600/40 text-white backdrop-blur-sm shadow-lg scale-105'
                        : 'bg-white/10 text-white/60 hover:bg-white/20 hover:scale-105'
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

              {/* Yearly Average */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Yearly average</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-lg">₹{(weeksTotal * 52).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                    <TrendingUp className="w-4 h-4 text-green-300" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity List */}
          <Card className="bg-card border shadow-md rounded-2xl overflow-hidden">
            <CardHeader className="border-b pb-4 pt-6 px-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-foreground font-heading">Recent Activity</CardTitle>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/5 font-medium text-xs font-sans">View All</Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 px-0">
              {todaysExpenses.length > 0 ? (
                <div className="divide-y divide-border">
                  {todaysExpenses.map((expense) => (
                    <div key={expense.id} className="group flex items-center justify-between p-6 hover:bg-accent/50 transition-colors duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-200">
                          {getCategoryIcon(expense.category)}
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-base">{expense.description}</p>
                          <p className="text-sm text-muted-foreground capitalize">{expense.category}</p>
                        </div>
                      </div>
                      <p className="font-bold text-foreground text-base">₹{expense.amount.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <CustomMic className="h-6 w-6 opacity-40" />
                  </div>
                  <p className="text-muted-foreground font-medium">No activity today</p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Right Column: Quick Add & Insights */}
        <div className="space-y-8">

          {/* Quick Add Card */}
          <Card className="bg-card border shadow-md rounded-2xl overflow-hidden relative h-fit">
            <CardHeader className="pb-0 pt-5 px-5 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold text-foreground font-heading">Quick Add</CardTitle>
              <div className="flex items-center gap-2 text-xs font-medium font-sans bg-accent px-2 py-1 rounded-lg border">
                <span className="text-muted-foreground">Budget</span>
                <span className="text-blue-600">{budgetProgress.toFixed(0)}%</span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6 px-5 text-center">

              {/* Microphone Icon - Central Focus */}
              <div className="relative mb-6 cursor-pointer group" onClick={open}>
                <div className="absolute inset-0 bg-blue-50 rounded-full scale-125 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300">
                  <CustomMic className="w-7 h-7 text-white" />
                </div>
              </div>

              <h3 className="text-lg font-bold text-primary mb-1 font-heading">Add Expense</h3>
              <p className="text-muted-foreground text-xs mb-5 font-sans">
                e.g. <span className="italic">"Lunch 150"</span>
              </p>

            </CardContent>
          </Card>
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
        className="md:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-white shadow-2xl shadow-primary/40 hover:bg-primary/90 z-50 flex items-center justify-center"
      >
        <CustomMic className="h-6 w-6 text-white" />
      </Button>
    </div>
  );
};

export default DashboardHome;
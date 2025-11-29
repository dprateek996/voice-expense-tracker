import { useEffect, useState } from 'react';
import { TrendingUp, Calendar, Target, Zap, ArrowUpRight, ArrowDownRight, Utensils, ShoppingCart, Car, Coffee, Music, Home, Shirt, Landmark, Search, ChevronDown, ShoppingBag } from 'lucide-react';
import CustomMic from '../components/CustomMic';
import CustomCalendar from '../components/CustomCalendar';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import useExpenseStore from '@/store/expenseStore';
import useVoiceStore from '@/store/voiceStore';

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

// Calculate budget progress (assuming a monthly budget of ₹5000 for demo)
const BUDGET_MONTHLY = 5000;

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
    const totalSpent = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    setBudgetProgress(Math.min((totalSpent / budget) * 100, 100));
  }, [expenses, budget]);

  const todaysTotal = todaysExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const weeksTotal = thisWeeksExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const avgDailyThisWeek = weeksTotal / 7;

  // Calculate progress
  const monthlySpent = expenses.filter(exp => new Date(exp.date).getMonth() === new Date().getMonth()).reduce((sum, exp) => sum + exp.amount, 0);
  const progress = Math.min((monthlySpent / budget) * 100, 100);

  return (
    <div className="space-y-8 font-sans text-slate-900">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-heading">Dashboard</h1>

        {/* Search Bar */}
        <div className="flex-1 max-w-md w-full mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search expenses, merchants..."
              className="pl-10 bg-slate-50 border-slate-200 rounded-full focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <Button variant="outline" className="hidden md:flex items-center rounded-full border-slate-200 text-slate-600 font-medium hover:bg-slate-50">
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
        <Card className="bg-white border border-slate-100 shadow-[0_4px_18px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)] transition-all duration-300 rounded-2xl group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 font-sans">Today's Spend</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <CustomCalendar className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">₹{todaysTotal.toFixed(2)}</div>
            <p className="text-sm text-slate-500 mt-1">
              {todaysExpenses.length} transactions
            </p>
          </CardContent>
        </Card>

        {/* This Week */}
        <Card className="bg-white border border-slate-100 shadow-[0_4px_18px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)] transition-all duration-300 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-purple-500" /> This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">₹{weeksTotal.toFixed(2)}</div>
            <p className="text-sm text-slate-500 mt-1">
              Avg: ₹{avgDailyThisWeek.toFixed(2)}/day
            </p>
          </CardContent>
        </Card>

        {/* Last Expense */}
        <Card className="bg-white border border-slate-100 shadow-[0_4px_18px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)] transition-all duration-300 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center">
              <ShoppingBag className="w-4 h-4 mr-2 text-orange-500" /> Last Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expenses.length > 0 ? (
              <>
                <div className="text-xl font-bold text-slate-900 truncate">
                  {expenses[0].description} <span className="text-slate-400 font-normal">-</span> ₹{expenses[0].amount}
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  {new Date(expenses[0].date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </>
            ) : (
              <div className="text-sm text-slate-400 mt-2">No expenses yet</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Weekly Trend & Recent Activity */}
        <div className="lg:col-span-2 space-y-8">

          {/* Weekly Spending Trend Chart */}
          <Card className="bg-white border border-slate-100 shadow-[0_4px_18px_rgba(0,0,0,0.04)] rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold text-slate-900 font-heading">Weekly Spending Trend</CardTitle>
              <div className="text-sm text-slate-500 font-sans">This Week: <span className="font-bold text-slate-900">₹{weeksTotal.toFixed(0)}</span></div>
            </CardHeader>
            <CardContent>
              <div className="h-48 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => ({
                      name: day,
                      amount: index === new Date().getDay() ? todaysTotal : Math.floor(Math.random() * (weeksTotal / 2))
                    }))}
                    margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#94a3b8' }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#94a3b8' }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                      itemStyle={{ color: '#0f172a', fontWeight: '600' }}
                      formatter={(value) => [`₹${value}`, 'Spend']}
                      cursor={{ stroke: '#0ea5e9', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#0ea5e9"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorAmount)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity List */}
          <Card className="bg-white border border-slate-100 shadow-[0_4px_18px_rgba(0,0,0,0.04)] rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-50 pb-4 bg-white pt-6 px-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-slate-900 font-heading">Recent Activity</CardTitle>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/5 font-medium text-xs font-sans">View All</Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 px-0">
              {todaysExpenses.length > 0 ? (
                <div className="divide-y divide-slate-50">
                  {todaysExpenses.map((expense) => (
                    <div key={expense.id} className="group flex items-center justify-between p-6 hover:bg-slate-50/50 transition-colors duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-200">
                          {getCategoryIcon(expense.category)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-base">{expense.description}</p>
                          <p className="text-sm text-slate-500 capitalize">{expense.category}</p>
                        </div>
                      </div>
                      <p className="font-bold text-slate-900 text-base">₹{expense.amount.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CustomMic className="h-6 w-6 opacity-40" />
                  </div>
                  <p className="text-slate-500 font-medium">No activity today</p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Right Column: Voice Quick Add & Insights */}
        <div className="space-y-8">

          {/* Voice Quick Add Card */}
          <Card className="bg-white border border-slate-100 shadow-[0_4px_18px_rgba(0,0,0,0.04)] rounded-2xl overflow-hidden relative h-fit">
            <CardHeader className="pb-0 pt-5 px-5 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold text-slate-900 font-heading">Voice Quick Add</CardTitle>
              <div className="flex items-center gap-2 text-xs font-medium font-sans bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                <span className="text-slate-500">Budget</span>
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

              <h3 className="text-lg font-bold text-primary mb-1 font-heading">Tap to Speak</h3>
              <p className="text-slate-400 text-xs mb-5 font-sans">
                e.g. <span className="italic">"Lunch 150"</span>
              </p>

              {/* Quick Category Chips - Subtle & Compact */}
              <div className="flex flex-wrap justify-center gap-2">
                {['🍔 Food', '🚕 Travel', '🛍️ Shop'].map((chip) => (
                  <span key={chip} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-600 font-medium cursor-pointer hover:bg-white hover:border-blue-200 hover:text-blue-600 transition-all duration-200">
                    {chip}
                  </span>
                ))}
              </div>

            </CardContent>
          </Card>
        </div>
      </div>

      {/* Budget Input Dialog */}
      <Dialog open={isBudgetDialogOpen} onOpenChange={setIsBudgetDialogOpen}>
        <DialogContent className="bg-white rounded-2xl border-slate-100 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">Set Monthly Budget</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="budget" className="text-sm font-medium text-slate-700">Monthly Budget (₹)</label>
              <Input
                id="budget"
                type="number"
                placeholder="Enter amount"
                value={tempBudget}
                onChange={(e) => setTempBudget(e.target.value)}
                className="mt-1.5 bg-slate-50 border-slate-200 focus:ring-primary rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBudgetDialogOpen(false)} className="rounded-xl border-slate-200">
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
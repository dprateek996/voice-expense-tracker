import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  TrendingDown, TrendingUp, Wallet, Calendar, Target, PiggyBank,
  ArrowDownRight, ArrowUpRight, Utensils, ShoppingCart, Car, Coffee,
  Music, Home, Shirt, Landmark, Mic, Plus, MoreHorizontal,
  ArrowRight, ChevronRight
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Button } from '@/components/ui/button';
import useExpenseStore from '@/store/expenseStore';
import useVoiceStore from '@/store/voiceStore';
import useAuthStore from '@/store/authStore';
import { cn } from '@/lib/utils';

const getCategoryIcon = (category) => {
  const cat = category?.toLowerCase() || '';
  if (cat.includes('food') || cat.includes('dining')) return <Utensils className="w-4 h-4" />;
  if (cat.includes('shop') || cat.includes('grocer')) return <ShoppingCart className="w-4 h-4" />;
  if (cat.includes('travel') || cat.includes('transport')) return <Car className="w-4 h-4" />;
  if (cat.includes('coffee') || cat.includes('cafe')) return <Coffee className="w-4 h-4" />;
  if (cat.includes('entertainment') || cat.includes('movie')) return <Music className="w-4 h-4" />;
  if (cat.includes('home') || cat.includes('rent')) return <Home className="w-4 h-4" />;
  if (cat.includes('cloth') || cat.includes('fashion')) return <Shirt className="w-4 h-4" />;
  return <Landmark className="w-4 h-4" />;
};

const DashboardHomeRedesigned = () => {
  const { expenses, fetchExpenses, budget } = useExpenseStore();
  const { open } = useVoiceStore();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('month');

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const monthTotal = useMemo(() => {
    const now = new Date();
    return expenses
      .filter(exp => {
        const d = new Date(exp.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((sum, exp) => sum + (exp.amount || 0), 0);
  }, [expenses]);

  const lastMonthTotal = useMemo(() => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    return expenses
      .filter(exp => {
        const d = new Date(exp.date);
        return d >= lastMonth && d <= lastMonthEnd;
      })
      .reduce((sum, exp) => sum + (exp.amount || 0), 0);
  }, [expenses]);

  const monthChange = lastMonthTotal > 0 ? ((monthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0;

  const budgetLeft = Math.max(0, budget - monthTotal);
  const budgetPercentage = budget > 0 ? Math.min((monthTotal / budget) * 100, 100) : 0;

  const todayTotal = useMemo(() => {
    const today = new Date().toDateString();
    return expenses
      .filter(exp => new Date(exp.date).toDateString() === today)
      .reduce((sum, exp) => sum + (exp.amount || 0), 0);
  }, [expenses]);

  const weekTotal = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    return expenses
      .filter(exp => new Date(exp.date) >= startOfWeek)
      .reduce((sum, exp) => sum + (exp.amount || 0), 0);
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    const now = new Date();
    if (activeTab === 'today') {
      const today = now.toDateString();
      return expenses.filter(exp => new Date(exp.date).toDateString() === today);
    } else if (activeTab === 'week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      return expenses.filter(exp => new Date(exp.date) >= startOfWeek);
    } else {
      return expenses.filter(exp => {
        const d = new Date(exp.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
    }
  }, [expenses, activeTab]);

  const transactionCount = filteredExpenses.length;

  const chartData = useMemo(() => {
    if (activeTab === 'week') {
      const data = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayTotal = expenses
          .filter(exp => new Date(exp.date).toDateString() === d.toDateString())
          .reduce((sum, exp) => sum + exp.amount, 0);
        data.push({
          name: d.toLocaleDateString('en-US', { weekday: 'short' }),
          amount: dayTotal,
          date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        });
      }
      return data;
    } else {
      const data = [];
      for (let i = 11; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthTotal = expenses
          .filter(exp => {
            const expDate = new Date(exp.date);
            return expDate.getMonth() === d.getMonth() && expDate.getFullYear() === d.getFullYear();
          })
          .reduce((sum, exp) => sum + exp.amount, 0);
        data.push({
          name: d.toLocaleDateString('en-US', { month: 'short' }),
          amount: monthTotal
        });
      }
      return data;
    }
  }, [expenses, activeTab]);

  const hasChartData = chartData.some(d => d.amount > 0);

  return (
    <div className="max-w-6xl mx-auto w-full py-8 px-6">

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="text-muted-foreground text-sm mb-1">
          Track and manage your expenses
        </p>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-foreground">
            Expense Dashboard
          </h1>

          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-full">
            {[
              { key: 'today', label: 'Today' },
              { key: 'week', label: 'This Week' },
              { key: 'month', label: 'This Month' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-full transition-all",
                  activeTab === tab.key
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Wallet className="w-5 h-5 text-muted-foreground" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">
              {activeTab === 'today' ? "Today's Spend" : activeTab === 'week' ? "This Week" : "This Month"}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-semibold text-foreground">
              ₹{(activeTab === 'today' ? todayTotal : activeTab === 'week' ? weekTotal : monthTotal).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
            {lastMonthTotal > 0 && activeTab === 'month' && (
              <span className={cn(
                "text-sm font-medium flex items-center gap-0.5",
                monthChange > 0 ? "text-red-500" : "text-emerald-500"
              )}>
                {monthChange > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {Math.abs(monthChange).toFixed(0)}%
              </span>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Target className="w-5 h-5 text-muted-foreground" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">Budget Left</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-semibold text-foreground">
              ₹{budgetLeft.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
            <span className={cn(
              "text-sm font-medium",
              budgetPercentage > 80 ? "text-red-500" : budgetPercentage > 50 ? "text-amber-500" : "text-emerald-500"
            )}>
              {budgetPercentage.toFixed(0)}% used
            </span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Calendar className="w-5 h-5 text-muted-foreground" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">Transactions</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-semibold text-foreground">
              {transactionCount}
            </span>
            <span className="text-sm text-muted-foreground">
              total entries
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-2xl p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Spending Overview</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>12m</span>
            <span className="text-muted-foreground/50">|</span>
            <span>30d</span>
            <span className="text-muted-foreground/50">|</span>
            <span className="text-foreground font-medium">7d</span>
          </div>
        </div>

        <div className="h-64">
          {hasChartData ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={(value) => value >= 1000 ? `₹${(value / 1000).toFixed(0)}k` : `₹${value}`}
                  width={55}
                  domain={[0, 'auto']}
                  allowDataOverflow={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    padding: '12px'
                  }}
                  labelStyle={{ color: 'hsl(var(--muted-foreground))', fontSize: 12, marginBottom: 4 }}
                  formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Spent']}
                />
                <Area
                  type="natural"
                  dataKey="amount"
                  stroke="hsl(var(--foreground))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                  dot={false}
                  activeDot={{ r: 5, fill: 'hsl(var(--foreground))', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <div className="w-full h-px bg-border mb-6" />
              <span className="text-sm">No spending data available</span>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 rounded-full"
                onClick={open}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add your first expense
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
          <Link
            to="/dashboard/history"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {expenses.length > 0 ? (
          <div className="divide-y divide-border">
            <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <div className="col-span-5">Description</div>
              <div className="col-span-3">Category</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>

            {expenses.slice(0, 6).map((exp, i) => (
              <div
                key={exp.id || i}
                className="grid grid-cols-12 gap-4 px-5 py-4 hover:bg-muted/30 transition-colors items-center"
              >
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                    {getCategoryIcon(exp.category)}
                  </div>
                  <span className="font-medium text-foreground truncate">
                    {exp.description || 'Expense'}
                  </span>
                </div>
                <div className="col-span-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground capitalize">
                    {exp.category || 'Other'}
                  </span>
                </div>
                <div className="col-span-2 text-sm text-muted-foreground">
                  {new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="col-span-2 text-right font-semibold text-foreground">
                  ₹{exp.amount?.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Wallet className="w-12 h-12 mb-4 opacity-30" />
            <p className="text-sm mb-4">No transactions yet</p>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={open}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add expense
            </Button>
          </div>
        )}
      </motion.div>

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        onClick={open}
        className="fixed bottom-8 right-8 w-14 h-14 bg-foreground text-background rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
      >
        <Mic className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default DashboardHomeRedesigned;

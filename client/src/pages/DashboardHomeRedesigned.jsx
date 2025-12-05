import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Calendar, Wallet, Target, DollarSign, 
  ArrowUpRight, ArrowDownRight, Utensils, ShoppingCart, Car, Coffee, 
  Music, Home, Shirt, Landmark, Search, ChevronDown, Mic, Plus, 
  ScanLine, Lightbulb, MoreVertical, Edit2, Trash2, Filter, 
  ArrowRight, Sparkles, PieChart
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import useExpenseStore from '@/store/expenseStore';
import useVoiceStore from '@/store/voiceStore';
import useAuthStore from '@/store/authStore';

// Utility: Get category icon
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

// Utility: Get category color
const getCategoryColor = (category) => {
  const cat = category?.toLowerCase() || '';
  if (cat.includes('food')) return '#3EA6FF';
  if (cat.includes('shop')) return '#FF6B9D';
  if (cat.includes('transport')) return '#FFA94D';
  if (cat.includes('entertainment')) return '#9B59B6';
  if (cat.includes('home')) return '#1ABC9C';
  return '#6C757D';
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

const DashboardHomeRedesigned = () => {
  const { expenses, fetchExpenses, budget } = useExpenseStore();
  const { open } = useVoiceStore();
  const { user } = useAuthStore();
  
  const [dateRange, setDateRange] = useState('week');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  useEffect(() => {
    if (expenses.length === 0) {
      fetchExpenses();
    }
  }, [fetchExpenses, expenses.length]);

  // Calculate date-filtered expenses
  useEffect(() => {
    const now = new Date();
    let filtered = [...expenses];

    switch (dateRange) {
      case 'today':
        filtered = expenses.filter(exp => {
          const expDate = new Date(exp.date);
          return expDate.toDateString() === now.toDateString();
        });
        break;
      case 'week':
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        filtered = expenses.filter(exp => new Date(exp.date) >= startOfWeek);
        break;
      case 'month':
        filtered = expenses.filter(exp => {
          const expDate = new Date(exp.date);
          return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
        });
        break;
      case 'year':
        filtered = expenses.filter(exp => {
          const expDate = new Date(exp.date);
          return expDate.getFullYear() === now.getFullYear();
        });
        break;
    }

    if (searchQuery) {
      filtered = filtered.filter(exp =>
        exp.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredExpenses(filtered);
  }, [expenses, dateRange, searchQuery]);

  // Calculate KPIs
  const todaysExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    const today = new Date();
    return expDate.toDateString() === today.toDateString();
  });
  const todaysTotal = todaysExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

  const weekTotal = filteredExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  
  const monthTotal = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    const now = new Date();
    return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
  }).reduce((sum, exp) => sum + (exp.amount || 0), 0);

  const budgetLeft = budget - monthTotal;
  const budgetPercentage = budget > 0 ? (monthTotal / budget) * 100 : 0;

  // Calculate AI insights
  const getFinancialInsight = () => {
    if (budgetPercentage > 90) return { type: 'warning', message: "You're close to your budget limit. Consider reducing spending." };
    if (budgetPercentage < 50) return { type: 'success', message: "You're on track financially! Keep up the good work." };
    if (weekTotal > monthTotal * 0.3) return { type: 'info', message: "Your spending is higher than usual this week." };
    return { type: 'success', message: "Your financial health looks stable this week." };
  };

  const insight = getFinancialInsight();

  // Category breakdown
  const categoryData = {};
  filteredExpenses.forEach(exp => {
    const cat = exp.category || 'Other';
    categoryData[cat] = (categoryData[cat] || 0) + exp.amount;
  });

  const categoryArray = Object.entries(categoryData)
    .map(([name, value]) => ({
      name,
      value,
      percentage: weekTotal > 0 ? (value / weekTotal) * 100 : 0,
      color: getCategoryColor(name)
    }))
    .sort((a, b) => b.value - a.value);

  // Filter categories >= 5%
  const significantCategories = categoryArray.filter(cat => cat.percentage >= 5);
  const otherCategories = categoryArray.filter(cat => cat.percentage < 5);
  if (otherCategories.length > 0) {
    const otherTotal = otherCategories.reduce((sum, cat) => sum + cat.value, 0);
    significantCategories.push({
      name: 'Other',
      value: otherTotal,
      percentage: (otherTotal / weekTotal) * 100,
      color: '#95A5A6'
    });
  }

  // Chart data
  const getChartData = () => {
    const data = [];
    const days = dateRange === 'week' ? 7 : dateRange === 'month' ? 30 : dateRange === 'year' ? 12 : 1;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const dayExpenses = filteredExpenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.toDateString() === date.toDateString();
      });
      
      const total = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: total,
        fullDate: date
      });
    }
    
    return data;
  };

  const chartData = getChartData();
  const highestDay = chartData.reduce((max, day) => day.amount > max.amount ? day : max, chartData[0] || { amount: 0 });
  const lowestDay = chartData.reduce((min, day) => day.amount < min.amount && day.amount > 0 ? day : min, chartData[0] || { amount: 0 });

  return (
    <div className="min-h-screen bg-black">
      {/* Noise texture overlay */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none" style={{ 
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'3.5\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")', 
        backgroundRepeat: 'repeat', 
        backgroundSize: '100px 100px' 
      }} />

      <div className="relative z-10 max-w-[1600px] mx-auto p-6 space-y-6">
        
        {/* 🔷 SECTION 2: PERSONAL OVERVIEW */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative"
        >
          <Card className="bg-gradient-to-br from-neutral-900/60 to-neutral-900/40 backdrop-blur-xl border-white/10 rounded-xl overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                    👋 Welcome back, {user?.name || 'User'}!
                  </h1>
                  <p className={`text-sm ${insight.type === 'warning' ? 'text-orange-400' : insight.type === 'success' ? 'text-green-400' : 'text-cyan-400'}`}>
                    {insight.message}
                  </p>
                </div>
                <Badge variant="outline" className="border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs px-3 py-1">
                  AI Powered
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 🔷 SECTION 3: KPI GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Today's Spend */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <Card className="bg-gradient-to-br from-neutral-900/60 to-neutral-900/40 backdrop-blur-xl border-white/10 rounded-xl hover:border-white/20 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-cyan-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">₹{useCountUp(todaysTotal, 1000).toLocaleString()}</div>
                <div className="text-sm text-white/50">Today's Spend</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* This Week */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <Card className="bg-gradient-to-br from-neutral-900/60 to-neutral-900/40 backdrop-blur-xl border-white/10 rounded-xl hover:border-white/20 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">₹{useCountUp(weekTotal, 1000).toLocaleString()}</div>
                <div className="text-sm text-white/50">This Week</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* This Month */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <Card className="bg-gradient-to-br from-neutral-900/60 to-neutral-900/40 backdrop-blur-xl border-white/10 rounded-xl hover:border-white/20 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-blue-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">₹{useCountUp(monthTotal, 1000).toLocaleString()}</div>
                <div className="text-sm text-white/50">This Month</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Budget Left */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <Card className="bg-gradient-to-br from-neutral-900/60 to-neutral-900/40 backdrop-blur-xl border-white/10 rounded-xl hover:border-white/20 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-green-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">₹{useCountUp(Math.max(0, budgetLeft), 1000).toLocaleString()}</div>
                <div className="text-sm text-white/50">Budget Left</div>
                <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${budgetPercentage > 90 ? 'bg-red-500' : budgetPercentage > 70 ? 'bg-orange-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Grid: Chart + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Main Chart + Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 🔷 SECTION 4: SPENDING TRENDS CHART */}
            <Card className="bg-gradient-to-br from-slate-800/60 via-slate-900/40 to-blue-950/60 backdrop-blur-xl border-white/10 rounded-xl overflow-hidden">
              <CardHeader className="border-b border-white/10 pb-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-cyan-400" />
                    Spending Trends
                  </CardTitle>
                  <div className="flex gap-2">
                    {['24h', 'Week', 'Month', 'Year'].map((period) => (
                      <Button
                        key={period}
                        size="sm"
                        variant={dateRange === period.toLowerCase() ? 'default' : 'outline'}
                        onClick={() => setDateRange(period.toLowerCase())}
                        className={dateRange === period.toLowerCase() 
                          ? 'bg-[#3EA6FF] hover:bg-[#3EA6FF]/90 text-white border-none' 
                          : 'bg-white/5 hover:bg-white/10 text-white/70 border-white/10'}
                      >
                        {period}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3EA6FF" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3EA6FF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} tickFormatter={(value) => `₹${value}`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(20, 20, 30, 0.95)', borderRadius: '12px', border: '1px solid rgba(62,166,255,0.3)', backdropFilter: 'blur(10px)' }}
                        itemStyle={{ color: '#fff' }}
                        labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                      />
                      <Area type="monotone" dataKey="amount" stroke="#3EA6FF" strokeWidth={2} fill="url(#colorAmount)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Chart Summary */}
                <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
                  <div>
                    <div className="text-xs text-white/40 mb-1">Total Spend</div>
                    <div className="text-lg font-bold text-white">₹{weekTotal.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/40 mb-1">Highest Day</div>
                    <div className="text-lg font-bold text-green-400">{highestDay?.date}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/40 mb-1">Top Category</div>
                    <div className="text-lg font-bold text-cyan-400">{significantCategories[0]?.name || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/40 mb-1">Avg/Day</div>
                    <div className="text-lg font-bold text-white">₹{Math.round(weekTotal / 7)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 🔷 SECTION 6: RECENT ACTIVITY TABLE */}
            <Card className="bg-gradient-to-br from-neutral-900/60 to-neutral-900/40 backdrop-blur-xl border-white/10 rounded-xl">
              <CardHeader className="border-b border-white/10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-white">Recent Transactions</CardTitle>
                  <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10">
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-white/50 font-medium">Merchant</TableHead>
                      <TableHead className="text-white/50 font-medium">Category</TableHead>
                      <TableHead className="text-white/50 font-medium">Date</TableHead>
                      <TableHead className="text-white/50 font-medium text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenses.slice(0, 6).map((expense, index) => (
                      <TableRow key={expense.id || index} className="border-white/5 hover:bg-white/5">
                        <TableCell className="font-medium text-white flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60">
                            {getCategoryIcon(expense.category)}
                          </div>
                          {expense.description || 'Expense'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-white/20 bg-white/5 text-white/70">
                            {expense.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white/50">
                          {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </TableCell>
                        <TableCell className="text-right font-bold text-white">₹{expense.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Right: Quick Actions Sidebar */}
          <div className="space-y-6">
            
            {/* 🔷 SECTION 5: QUICK ADD */}
            <Card className="bg-gradient-to-br from-neutral-900/60 to-neutral-900/40 backdrop-blur-xl border-white/10 rounded-xl sticky top-6">
              <CardHeader className="border-b border-white/10">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-cyan-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Voice Add */}
                <Button 
                  onClick={open}
                  className="w-full h-16 bg-[#3EA6FF] hover:bg-[#3EA6FF]/90 text-white text-lg font-medium rounded-xl shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
                >
                  <Mic className="mr-2 h-5 w-5" />
                  Add Expense (Voice)
                </Button>
                
                <Button 
                  variant="outline"
                  disabled
                  className="w-full bg-white/5 text-white/40 border-white/10 rounded-xl cursor-not-allowed"
                >
                  <ScanLine className="mr-2 h-4 w-4" />
                  Scan Receipt (Coming Soon)
                </Button>

                {/* Budget Status */}
                <div className="pt-4 border-t border-white/10">
                  <div className="text-sm text-white/50 mb-3">Budget Status</div>
                  <div className="relative">
                    <div className="flex items-center justify-center">
                      <div className="relative w-32 h-32">
                        <svg className="w-full h-full -rotate-90">
                          <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                          <circle 
                            cx="64" 
                            cy="64" 
                            r="56" 
                            stroke={budgetPercentage > 90 ? '#EF4444' : budgetPercentage > 70 ? '#F59E0B' : '#10B981'}
                            strokeWidth="8" 
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 56}`}
                            strokeDashoffset={`${2 * Math.PI * 56 * (1 - budgetPercentage / 100)}`}
                            strokeLinecap="round"
                            className="transition-all duration-1000"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <div className="text-2xl font-bold text-white">{budgetPercentage.toFixed(0)}%</div>
                          <div className="text-xs text-white/50">Used</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center mt-3">
                      <div className="text-white/70">₹{budgetLeft.toLocaleString()} remaining</div>
                    </div>
                  </div>
                </div>

                {/* AI Insights */}
                <div className="pt-4 border-t border-white/10">
                  <div className="text-sm text-white/50 mb-3 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    AI Insights
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                      <p className="text-sm text-cyan-400">💡 {insight.message}</p>
                    </div>
                    {significantCategories[0] && (
                      <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                        <p className="text-sm text-white/70">
                          📊 {significantCategories[0].name} is your top expense at {significantCategories[0].percentage.toFixed(0)}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHomeRedesigned;

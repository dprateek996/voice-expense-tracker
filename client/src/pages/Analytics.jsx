import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Calendar, Download, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/ui/EmptyState';
import useExpenseStore from '@/store/expenseStore';
import { toast } from 'sonner';

const CATEGORY_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

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
    let startDate = new Date(now.getFullYear(), now.getMonth(), 1);

    if (dateRange === 'week') {
      startDate = new Date();
      startDate.setDate(now.getDate() - 7);
    } else if (dateRange === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    return expenses.filter((expense) => new Date(expense.date) >= startDate);
  }, [expenses, dateRange]);

  const analytics = useMemo(() => {
    if (filteredExpenses.length === 0) {
      return {
        totalSpent: 0,
        totalEntries: 0,
        dailyAverage: 0,
        chartData: [],
        categoryData: [],
      };
    }

    const totalSpent = filteredExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

    const chartData = [];
    const now = new Date();
    if (dateRange === 'week') {
      for (let i = 6; i >= 0; i -= 1) {
        const day = new Date(now);
        day.setDate(day.getDate() - i);
        const amount = filteredExpenses
          .filter((expense) => new Date(expense.date).toDateString() === day.toDateString())
          .reduce((sum, expense) => sum + (expense.amount || 0), 0);
        chartData.push({ name: day.toLocaleDateString('en-US', { weekday: 'short' }), amount });
      }
    } else if (dateRange === 'year') {
      for (let month = 0; month < 12; month += 1) {
        const amount = filteredExpenses
          .filter((expense) => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === month && expenseDate.getFullYear() === now.getFullYear();
          })
          .reduce((sum, expense) => sum + (expense.amount || 0), 0);
        chartData.push({ name: new Date(now.getFullYear(), month, 1).toLocaleDateString('en-US', { month: 'short' }), amount });
      }
    } else {
      const currentDay = now.getDate();
      for (let day = 1; day <= currentDay; day += 1) {
        const amount = filteredExpenses
          .filter((expense) => new Date(expense.date).getDate() === day)
          .reduce((sum, expense) => sum + (expense.amount || 0), 0);
        chartData.push({ name: `${day}`, amount });
      }
    }

    const grouped = {};
    filteredExpenses.forEach((expense) => {
      const key = expense.category || 'other';
      grouped[key] = (grouped[key] || 0) + (expense.amount || 0);
    });

    const categoryData = Object.entries(grouped).map(([name, value]) => ({ name, value }));

    return {
      totalSpent,
      totalEntries: filteredExpenses.length,
      dailyAverage: totalSpent / Math.max(chartData.length, 1),
      chartData,
      categoryData,
    };
  }, [filteredExpenses, dateRange]);

  const exportToCSV = () => {
    const headers = ['Date', 'Category', 'Description', 'Amount'];
    const rows = filteredExpenses.map((expense) => [
      new Date(expense.date).toLocaleDateString(),
      expense.category,
      expense.description,
      expense.amount,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `voex-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('CSV exported');
  };

  if (loading) {
    return <div className="container py-12 text-muted-foreground">Loading analytics...</div>;
  }

  return (
    <div className="container py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-meta text-muted-foreground">Spend intelligence</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-heading text-4xl font-semibold">Analytics</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-md border border-border bg-muted p-1">
              {['week', 'month', 'year'].map((period) => (
                <Button
                  key={period}
                  type="button"
                  size="dense"
                  variant={dateRange === period ? 'primary' : 'ghost'}
                  onClick={() => setDateRange(period)}
                >
                  {period}
                </Button>
              ))}
            </div>
            <Button type="button" variant="secondary" size="compact" onClick={exportToCSV}>
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        </div>
      </motion.div>

      {analytics.totalEntries === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No analytics yet"
          description="Add expenses to unlock monthly trends and category splits."
          ctaLabel="Open dashboard"
          onCtaClick={() => {
            window.location.href = '/dashboard';
          }}
        />
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="surface-2 rounded-lg border border-border card-pad-default shadow-sm lg:col-span-2">
            <h2 className="text-heading text-xl font-semibold">Spend Trend</h2>
            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--line))" />
                  <XAxis dataKey="name" stroke="hsl(var(--text-3))" />
                  <YAxis stroke="hsl(var(--text-3))" />
                  <Tooltip />
                  <Area type="monotone" dataKey="amount" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
            <div className="surface-2 rounded-lg border border-border card-pad-default shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-muted">
                  <Wallet className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">Total spent</p>
                  <p className="text-heading text-2xl font-semibold">₹{analytics.totalSpent.toLocaleString('en-IN')}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{analytics.totalEntries} entries in selected range</p>
            </div>

            <div className="surface-2 rounded-lg border border-border card-pad-default shadow-sm">
              <h2 className="text-heading text-xl font-semibold">Category share</h2>
              <div className="mt-6 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={analytics.categoryData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={84}>
                      {analytics.categoryData.map((entry, index) => (
                        <Cell key={entry.name} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;

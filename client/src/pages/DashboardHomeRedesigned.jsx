import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mic, Wallet, Calendar, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import EmptyState from '@/components/ui/EmptyState';
import useExpenseStore from '@/store/expenseStore';
import useVoiceStore from '@/store/voiceStore';

const DashboardHomeRedesigned = () => {
  const { expenses, fetchExpenses, budget } = useExpenseStore();
  const { open } = useVoiceStore();

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const stats = useMemo(() => {
    const now = new Date();
    const monthTotal = expenses
      .filter((expense) => {
        const date = new Date(expense.date);
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      })
      .reduce((sum, expense) => sum + (expense.amount || 0), 0);

    const todayTotal = expenses
      .filter((expense) => new Date(expense.date).toDateString() === now.toDateString())
      .reduce((sum, expense) => sum + (expense.amount || 0), 0);

    return {
      monthTotal,
      todayTotal,
      totalEntries: expenses.length,
      budgetLeft: Math.max(0, budget - monthTotal),
    };
  }, [expenses, budget]);

  const recentExpenses = useMemo(
    () => [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8),
    [expenses]
  );

  const formatRelativeDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const expenseDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffDays = Math.round((today - expenseDay) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const budgetUsagePercent = stats.monthTotal > 0 && budget > 0 ? Math.round((stats.monthTotal / budget) * 100) : 0;

  return (
    <div className="container py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-meta text-muted-foreground">Overview</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-heading text-4xl font-semibold">Expense Dashboard</h1>
          <Button type="button" size="default" onClick={open}>
            <Mic className="h-4 w-4" /> Add with voice
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-muted"><Wallet className="h-5 w-5" /></span>
              <div>
                <p className="text-sm text-muted-foreground">This month</p>
                <p className="text-heading text-2xl font-semibold">₹{stats.monthTotal.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-muted"><Calendar className="h-5 w-5" /></span>
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-heading text-2xl font-semibold">₹{stats.todayTotal.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-muted"><Target className="h-5 w-5" /></span>
              <div>
                <p className="text-sm text-muted-foreground">Budget left</p>
                <p className="text-heading text-2xl font-semibold">₹{stats.budgetLeft.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-muted"><Wallet className="h-5 w-5" /></span>
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-heading text-2xl font-semibold">{stats.totalEntries}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <section className="mt-8">
        <div className="surface-2 rounded-lg border border-border card-pad-default shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-heading text-xl font-semibold">Monthly Budget</h2>
            <span className="text-sm text-muted-foreground">{budgetUsagePercent}% used</span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all ${budgetUsagePercent > 90 ? 'bg-destructive' : budgetUsagePercent > 70 ? 'bg-yellow-500' : 'bg-primary'}`}
              style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            ₹{stats.monthTotal.toLocaleString('en-IN')} of ₹{budget.toLocaleString('en-IN')}
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-heading text-2xl font-semibold">Recent expenses</h2>
        <div className="mt-6">
          {recentExpenses.length === 0 ? (
            <EmptyState
              icon={Wallet}
              title="No expenses recorded"
              description="Start by adding your first expense with voice or manual input."
              ctaLabel="Open history"
              onCtaClick={() => {
                window.location.href = '/dashboard/history';
              }}
            />
          ) : (
            <div className="surface-2 overflow-hidden rounded-lg border border-border shadow-sm">
              {recentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between border-b border-border px-6 py-3 last:border-none">
                  <div>
                    <p className="text-sm font-medium text-foreground">{expense.description || 'Expense'}</p>
                    <p className="text-xs text-muted-foreground capitalize">{expense.category || 'other'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">₹{(expense.amount || 0).toLocaleString('en-IN')}</p>
                    <p className="text-xs text-muted-foreground">{formatRelativeDate(expense.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mt-8">
        <Button asChild variant="secondary" size="compact">
          <Link to="/dashboard/history">View full history</Link>
        </Button>
      </section>
    </div>
  );
};

export default DashboardHomeRedesigned;

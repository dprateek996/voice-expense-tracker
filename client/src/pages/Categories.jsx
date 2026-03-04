import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Landmark, PieChartIcon } from 'lucide-react';
import useExpenseStore from '@/store/expenseStore';
import EmptyState from '@/components/ui/EmptyState';

const CATEGORY_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

const Categories = () => {
  const { expenses, budget } = useExpenseStore();

  const categoryData = useMemo(() => {
    const grouped = {};
    let total = 0;

    expenses.forEach((expense) => {
      const key = expense.category || 'other';
      const amount = expense.amount || 0;
      grouped[key] = (grouped[key] || 0) + amount;
      total += amount;
    });

    return Object.entries(grouped)
      .map(([name, value], index) => ({
        name,
        value,
        color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
        percentage: total > 0 ? Math.round((value / total) * 100) : 0,
      }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const totalSpent = categoryData.reduce((sum, item) => sum + item.value, 0);
  const budgetUsagePercent = budget > 0 ? Math.round((totalSpent / budget) * 100) : 0;

  if (categoryData.length === 0) {
    return (
      <div className="container py-12">
        <EmptyState
          icon={PieChartIcon}
          title="No category data"
          description="Add expenses to see category distribution and budget usage."
          ctaLabel="Go to dashboard"
          onCtaClick={() => {
            window.location.href = '/dashboard';
          }}
        />
      </div>
    );
  }

  return (
    <div className="container py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-meta text-muted-foreground">Categorized insights</p>
        <h1 className="text-heading mt-4 text-4xl font-semibold">Categories</h1>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="surface-2 rounded-lg border border-border card-pad-default shadow-sm">
          <h2 className="text-heading text-xl font-semibold">Distribution</h2>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={100}>
                  {categoryData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="capitalize">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface-2 rounded-lg border border-border card-pad-default shadow-sm">
            <h2 className="text-heading text-xl font-semibold">Budget usage</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              ₹{totalSpent.toLocaleString('en-IN')} of ₹{budget.toLocaleString('en-IN')} used
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded bg-muted">
              <div className="h-full bg-primary" style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }} />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{budgetUsagePercent}% of monthly budget</p>
          </div>

          <div className="surface-2 overflow-hidden rounded-lg border border-border shadow-sm">
            {categoryData.map((category) => (
              <div key={category.name} className="flex h-12 items-center justify-between border-b border-border px-6 last:border-none">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Landmark className="h-4 w-4" />
                  </span>
                  <span className="capitalize text-foreground">{category.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">₹{category.value.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-muted-foreground">{category.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;

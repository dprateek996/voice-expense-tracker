// src/components/dashboard/ExpenseStats.jsx
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingBag, 
  PieChart 
} from 'lucide-react';

const ExpenseStats = ({ expenses }) => {
  const stats = useMemo(() => {
    if (!expenses || expenses.length === 0) {
      return {
        total: 0,
        count: 0,
        categoryBreakdown: {},
        topCategory: null,
      };
    }

    // Calculate total
    const total = expenses.reduce((sum, expense) => {
      return sum + parseFloat(expense.amount);
    }, 0);

    // Calculate category breakdown
    const categoryBreakdown = expenses.reduce((acc, expense) => {
      const category = expense.category;
      if (!acc[category]) {
        acc[category] = {
          total: 0,
          count: 0,
        };
      }
      acc[category].total += parseFloat(expense.amount);
      acc[category].count += 1;
      return acc;
    }, {});

    // Find top category
    const topCategory = Object.entries(categoryBreakdown).sort(
      ([, a], [, b]) => b.total - a.total
    )[0];

    return {
      total,
      count: expenses.length,
      categoryBreakdown,
      topCategory: topCategory ? { name: topCategory[0], ...topCategory[1] } : null,
    };
  }, [expenses]);

  const formatAmount = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Food: '🍔',
      Transport: '🚗',
      Shopping: '🛍️',
      Bills: '💳',
      Entertainment: '🎮',
      Others: '📦',
    };
    return icons[category] || icons.Others;
  };

  const getCategoryColor = (category) => {
    const colors = {
      Food: 'bg-orange-500',
      Transport: 'bg-blue-500',
      Shopping: 'bg-pink-500',
      Bills: 'bg-red-500',
      Entertainment: 'bg-purple-500',
      Others: 'bg-gray-500',
    };
    return colors[category] || colors.Others;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Spending Card */}
      <Card className="bg-gradient-to-br from-blue-600 to-blue-800 border-blue-700">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-blue-100">
            Total Spending
          </CardTitle>
          <DollarSign className="w-4 h-4 text-blue-200" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">
            {formatAmount(stats.total)}
          </div>
          <p className="text-xs text-blue-200 mt-1">
            {stats.count} {stats.count === 1 ? 'expense' : 'expenses'} recorded
          </p>
        </CardContent>
      </Card>

      {/* Top Category Card */}
      <Card className="bg-gradient-to-br from-purple-600 to-purple-800 border-purple-700">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-purple-100">
            Top Category
          </CardTitle>
          <TrendingUp className="w-4 h-4 text-purple-200" />
        </CardHeader>
        <CardContent>
          {stats.topCategory ? (
            <>
              <div className="text-3xl font-bold text-white flex items-center gap-2">
                <span>{getCategoryIcon(stats.topCategory.name)}</span>
                <span>{stats.topCategory.name}</span>
              </div>
              <p className="text-xs text-purple-200 mt-1">
                {formatAmount(stats.topCategory.total)} • {stats.topCategory.count} {stats.topCategory.count === 1 ? 'item' : 'items'}
              </p>
            </>
          ) : (
            <div className="text-xl text-white">No data</div>
          )}
        </CardContent>
      </Card>

      {/* Average Expense Card */}
      <Card className="bg-gradient-to-br from-green-600 to-green-800 border-green-700">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-green-100">
            Average Expense
          </CardTitle>
          <ShoppingBag className="w-4 h-4 text-green-200" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">
            {stats.count > 0 ? formatAmount(stats.total / stats.count) : '$0.00'}
          </div>
          <p className="text-xs text-green-200 mt-1">
            Per transaction
          </p>
        </CardContent>
      </Card>

      {/* Category Breakdown Card - Full Width */}
      {Object.keys(stats.categoryBreakdown).length > 0 && (
        <Card className="md:col-span-3 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Category Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.categoryBreakdown)
                .sort(([, a], [, b]) => b.total - a.total)
                .map(([category, data]) => {
                  const percentage = (data.total / stats.total) * 100;
                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getCategoryIcon(category)}</span>
                          <span className="text-white font-medium">{category}</span>
                          <span className="text-gray-400 text-sm">
                            ({data.count} {data.count === 1 ? 'item' : 'items'})
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-semibold">
                            {formatAmount(data.total)}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`${getCategoryColor(category)} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExpenseStats;

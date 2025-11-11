// src/components/dashboard/ExpenseList.jsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  RefreshCw, 
  Loader2, 
  AlertCircle, 
  DollarSign,
  Calendar,
  Tag,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { getAllExpenses } from '@/api';

const ExpenseList = ({ refreshTrigger, onExpensesLoaded }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchExpenses = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const data = await getAllExpenses();
      setExpenses(data);
      // Notify parent component
      if (onExpensesLoaded) {
        onExpensesLoaded(data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load expenses');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [refreshTrigger]);

  const handleRefresh = () => {
    fetchExpenses(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      Food: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      Transport: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      Shopping: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      Bills: 'bg-red-500/20 text-red-400 border-red-500/30',
      Entertainment: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      Others: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return colors[category] || colors.Others;
  };

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
            <p className="text-gray-400">Loading expenses...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="py-8">
          <div className="flex items-center gap-3 text-red-400 bg-red-900/20 p-4 rounded-md">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">Error Loading Expenses</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
            <Button 
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="border-red-500/30 hover:bg-red-900/30"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-white">Recent Expenses</CardTitle>
          <CardDescription className="text-gray-400">
            {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'} recorded
          </CardDescription>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          size="sm"
          className="border-gray-600 hover:bg-gray-700"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-lg font-medium mb-1">No expenses yet</p>
            <p className="text-gray-500 text-sm">Start by adding your first expense above!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-gray-700/50">
                  <TableHead className="text-gray-300">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Amount
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-300">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Category
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-300">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Description
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow 
                    key={expense.id} 
                    className="border-gray-700 hover:bg-gray-700/50"
                  >
                    <TableCell className="font-semibold text-green-400">
                      {formatAmount(expense.amount)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${getCategoryColor(expense.category)}`}>
                          {expense.category}
                        </span>
                        {expense.is_unclear && (
                          <AlertTriangle 
                            className="w-4 h-4 text-yellow-500" 
                            title="Category was unclear"
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300 max-w-md truncate">
                      {expense.description}
                    </TableCell>
                    <TableCell className="text-gray-400 text-sm">
                      {formatDate(expense.date)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseList;

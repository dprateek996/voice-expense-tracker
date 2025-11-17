import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useExpenseStore from '@/store/expenseStore';
import { toast } from 'sonner';

// ICONS FOR CATEGORIES
const CATEGORY_ICONS = {
  groceries: '🛒',
  dining: '🍽️',
  food: '🛒',
  transport: '🚗',
  shopping: '🛍️',
  utilities: '⚡',
  bills: '⚡',
  health: '🏥',
  medicine: '🏥',
  entertainment: '🎭',
  travel: '✈️',
  education: '📚',
  work: '💼',
  'personal care': '💅',
  personalcare: '💅',
  fuel: '⛽',
  other: '📦'
};

const ITEMS_PER_PAGE = 10;

const History = () => {
  const { expenses, fetchExpenses } = useExpenseStore();
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [loading, setLoading] = useState(true);

  // Fetch expenses
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        await fetchExpenses();
      } catch {
        toast.error("Failed to load expense history.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Filter and sort expenses
  useEffect(() => {
    let filtered = [...expenses];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(expense =>
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(expense => expense.category === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    setFilteredExpenses(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [expenses, searchTerm, selectedCategory, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedExpenses = filteredExpenses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Get unique categories
  const categories = ['all', ...new Set(expenses.map(exp => exp.category))];

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // LOADING SKELETON
  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-10 w-40 bg-muted rounded-lg"></div>
        <div className="grid grid-cols-4 gap-4">
          <div className="h-10 bg-muted rounded-lg"></div>
          <div className="h-10 bg-muted rounded-lg"></div>
          <div className="h-10 bg-muted rounded-lg"></div>
          <div className="h-10 bg-muted rounded-lg"></div>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Title */}
      <motion.h1
        className="text-4xl font-bold text-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Expense History
      </motion.h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:scale-105 hover:border-yellow-400 transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expenses.length}</div>
          </CardContent>
        </Card>

        <Card className="hover:scale-105 hover:border-yellow-400 transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="hover:scale-105 hover:border-yellow-400 transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{expenses.filter(exp => {
                const expDate = new Date(exp.date);
                const now = new Date();
                return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
              }).reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:scale-105 hover:border-yellow-400 transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{(expenses.reduce((sum, exp) => sum + exp.amount, 0) / expenses.length || 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex h-9 w-full md:w-48 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex h-9 w-full md:w-48 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>
      </Card>

      {/* Expenses List */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Expenses ({filteredExpenses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {paginatedExpenses.length > 0 ? (
            <div className="space-y-3">
              {paginatedExpenses.map((expense) => (
                <motion.div
                  key={expense.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted hover:scale-[1.02] hover:border-yellow-400 transition-all duration-200 border border-transparent"
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {CATEGORY_ICONS[expense.category] || "📦"}
                    </div>
                    <div>
                      <p className="font-medium text-lg">{expense.description}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(expense.date)}</span>
                        <span>•</span>
                        <span className="capitalize">{expense.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">₹{expense.amount.toFixed(2)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">No expenses found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters or add some expenses first.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default History;

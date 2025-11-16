import { useEffect, useState } from 'react';
import { Mic, TrendingUp, Calendar, Target, Zap } from 'lucide-react';
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
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}!
        </h1>
        <p className="text-xl text-muted-foreground">Ready to track your expenses? Just speak or type.</p>
        <Button onClick={open} size="lg" className="text-lg px-8 py-3">
          <Mic className="h-5 w-5 mr-2" />
          Start Voice Expense
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:scale-105 transition-transform duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Spend</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{todaysTotal.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {todaysExpenses.length} transaction{todaysExpenses.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:scale-105 transition-transform duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{weeksTotal.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Avg: ₹{avgDailyThisWeek.toFixed(2)}/day
            </p>
          </CardContent>
        </Card>

        <Card className="hover:scale-105 transition-transform duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Progress</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => {
              setTempBudget(budget.toString());
              setIsBudgetDialogOpen(true);
            }}>
              <Target className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{budgetProgress.toFixed(0)}%</div>
            <div className="w-full bg-secondary rounded-full h-2 mt-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${budgetProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              of ₹{budget} monthly
            </p>
          </CardContent>
        </Card>

        <Card className="hover:scale-105 transition-transform duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 days</div>
            <p className="text-xs text-muted-foreground">
              Keep it up!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {todaysExpenses.length > 0 ? (
            <div className="space-y-3">
              {todaysExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-muted-foreground capitalize">{expense.category}</p>
                    </div>
                  </div>
                  <p className="font-semibold">₹{expense.amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No expenses today. Start tracking!</p>
              <Button onClick={open} variant="outline">
                <Mic className="h-4 w-4 mr-2" />
                Add First Expense
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>💡 Tip of the Day</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {budgetProgress > 80 ? "You're close to your budget! Consider reviewing non-essential spends." : 
               todaysTotal > avgDailyThisWeek * 1.5 ? "Today's spending is higher than usual. Stay mindful!" : 
               "Great job staying on track! Keep up the good work with expense tracking."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🎯 This Month's Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Stay under ₹{budget} total. You're {budgetProgress < 50 ? 'on track' : budgetProgress < 80 ? 'doing well' : 'close to the limit'}!
            </p>
            <div className="w-full bg-secondary rounded-full h-2 mt-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${budgetProgress}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Input Dialog */}
      <Dialog open={isBudgetDialogOpen} onOpenChange={setIsBudgetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Monthly Budget</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="budget" className="text-sm font-medium">Monthly Budget (₹)</label>
              <Input
                id="budget"
                type="number"
                placeholder="Enter amount"
                value={tempBudget}
                onChange={(e) => setTempBudget(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBudgetDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              const newBudget = Number(tempBudget);
              if (newBudget > 0) {
                setBudget(newBudget);
              }
              setIsBudgetDialogOpen(false);
            }}>
              Save Budget
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardHome;
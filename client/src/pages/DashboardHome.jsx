import { useEffect, useState } from 'react';
import { Mic, TrendingUp, Calendar, Target, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-heading">Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of your financial activity</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm text-sm text-slate-600">
            <Calendar className="w-4 h-4 mr-2 text-primary" />
            <span>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
          <Button onClick={open} size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 rounded-xl transition-all hover:scale-105">
            <Mic className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Today's Spend</CardTitle>
            <div className="p-2.5 bg-blue-50 rounded-xl">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">₹{todaysTotal.toFixed(2)}</div>
            <p className="text-xs text-slate-500 mt-1 flex items-center">
              <span className="text-blue-600 font-medium mr-1 bg-blue-50 px-1.5 py-0.5 rounded">{todaysExpenses.length}</span> transactions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">This Week</CardTitle>
            <div className="p-2.5 bg-purple-50 rounded-xl">
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">₹{weeksTotal.toFixed(2)}</div>
            <p className="text-xs text-slate-500 mt-1">
              Avg: ₹{avgDailyThisWeek.toFixed(2)}/day
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Budget</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => {
              setTempBudget(budget.toString());
              setIsBudgetDialogOpen(true);
            }} className="h-8 w-8 p-0 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600">
              <Target className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between mb-2">
              <div className="text-2xl font-bold text-slate-900">{budgetProgress.toFixed(0)}%</div>
              <span className="text-xs text-slate-500 mb-1">of ₹{budget}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${budgetProgress}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Streak</CardTitle>
            <div className="p-2.5 bg-orange-50 rounded-xl">
              <Zap className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">3 days</div>
            <p className="text-xs text-slate-500 mt-1">
              Keep it up!
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Expenses List */}
        <Card className="lg:col-span-2 bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-50 pb-4 bg-slate-50/30">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-slate-900">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/5 font-medium">View All</Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {todaysExpenses.length > 0 ? (
              <div className="space-y-3">
                {todaysExpenses.map((expense) => (
                  <div key={expense.id} className="group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-primary/20 hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-all duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-200">
                        <span className="text-xs font-bold">{expense.category.substring(0, 2).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{expense.description}</p>
                        <p className="text-xs text-slate-500 capitalize">{expense.category}</p>
                      </div>
                    </div>
                    <p className="font-bold text-slate-900">₹{expense.amount.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-100">
                  <Mic className="h-5 w-5 text-slate-400" />
                </div>
                <p className="text-slate-500 mb-4 font-medium">No expenses recorded today</p>
                <Button onClick={open} variant="outline" className="border-slate-200 text-slate-700 hover:bg-white hover:text-primary hover:border-primary/20">
                  Add First Expense
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Insights Column */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100/50 shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center">
                <span className="mr-2 p-1 bg-white rounded-md shadow-sm text-xs">💡</span> Insight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm leading-relaxed">
                {budgetProgress > 80 ? "You're close to your budget! Consider reviewing non-essential spends." :
                  todaysTotal > avgDailyThisWeek * 1.5 ? "Today's spending is higher than usual. Stay mindful!" :
                    "Great job staying on track! Keep up the good work with expense tracking."}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center">
                <span className="mr-2 p-1 bg-slate-50 rounded-md text-xs">🎯</span> Monthly Goal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-500 text-sm mb-4">
                Stay under <span className="font-semibold text-slate-900">₹{budget}</span> total.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-primary">{budgetProgress.toFixed(0)}% Used</span>
                  <span className="text-slate-400">{(100 - budgetProgress).toFixed(0)}% Left</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-primary h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${budgetProgress}%` }}
                  ></div>
                </div>
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
    </div>
  );
};

export default DashboardHome;
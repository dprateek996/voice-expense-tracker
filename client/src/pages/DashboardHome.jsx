import { useEffect } from 'react';
import { Wallet, ReceiptText, Tag, CalendarClock } from 'lucide-react';
import useExpenseStore from '@/store/expenseStore';

// This function is now "bulletproof" and will not crash.
const calculateStats = (expenses) => {
    // THIS IS THE DEFINITIVE FIX:
    // If 'expenses' is not a valid array, return the default stats immediately.
    if (!Array.isArray(expenses)) {
        return [
            { name: "Total Spent (Month)", value: "₹0.00", icon: <Wallet className="h-5 w-5 text-muted-foreground" /> },
            { name: "Avg. Daily Spend", value: "₹0.00", icon: <CalendarClock className="h-5 w-5 text-muted-foreground" /> },
            { name: "Most Spent On", value: "N/A", icon: <Tag className="h-5 w-5 text-muted-foreground" /> },
            { name: "Transactions", value: "0", icon: <ReceiptText className="h-5 w-5 text-muted-foreground" /> }
        ];
    }

    const currentMonthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        const today = new Date();
        return expenseDate.getMonth() === today.getMonth() && expenseDate.getFullYear() === today.getFullYear();
    });

    const baseStats = [
        { name: "Total Spent (Month)", value: "₹0.00", icon: <Wallet className="h-5 w-5 text-muted-foreground" /> },
        { name: "Avg. Daily Spend", value: "₹0.00", icon: <CalendarClock className="h-5 w-5 text-muted-foreground" /> },
        { name: "Most Spent On", value: "N/A", icon: <Tag className="h-5 w-5 text-muted-foreground" /> },
        { name: "Transactions", value: "0", icon: <ReceiptText className="h-5 w-5 text-muted-foreground" /> }
    ];

    if (currentMonthExpenses.length === 0) return baseStats;

    const totalSpend = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const transactionCount = currentMonthExpenses.length;
    const spendingByCategory = currentMonthExpenses.reduce((acc, expense) => { acc[expense.category] = (acc[expense.category] || 0) + expense.amount; return acc; }, {});
    const topCategory = Object.keys(spendingByCategory).reduce((a, b) => spendingByCategory[a] > spendingByCategory[b] ? a : b, 'N/A');
    const uniqueDaysWithExpenses = new Set(currentMonthExpenses.map(e => new Date(e.date).getDate())).size;
    const avgDailySpend = uniqueDaysWithExpenses > 0 ? totalSpend / uniqueDaysWithExpenses : 0;

    return [
        { name: "Total Spent (Month)", value: `₹${totalSpend.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: <Wallet className="h-5 w-5 text-muted-foreground" /> },
        { name: "Avg. Daily Spend", value: `₹${avgDailySpend.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: <CalendarClock className="h-5 w-5 text-muted-foreground" /> },
        { name: "Most Spent On", value: topCategory, icon: <Tag className="h-5 w-5 text-muted-foreground" /> },
        { name: "Transactions", value: transactionCount.toString(), icon: <ReceiptText className="h-5 w-5 text-muted-foreground" /> }
    ];
};

const DashboardHome = () => {
  const { expenses, fetchExpenses } = useExpenseStore();
  const stats = calculateStats(expenses);

  useEffect(() => {
    // Only fetch if expenses haven't been loaded yet to avoid unnecessary calls
    if (expenses.length === 0) {
      fetchExpenses();
    }
  }, [fetchExpenses, expenses.length]);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        {stats.map((stat, index) => (
            <div key={index} className="bg-card p-6 rounded-xl border border-border transition-all duration-200 transform hover:scale-[1.03] hover:shadow-lg hover:border-primary">
                <div className="flex items-start justify-between">
                    <h3 className="text-sm font-medium text-muted-foreground">{stat.name}</h3>
                    {stat.icon}
                </div>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
            </div>
        ))}
      </div>

      <div className="bg-card p-6 rounded-xl border border-border">
        <h3 className="text-lg font-semibold mb-4">Recent Expenses</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-muted-foreground"><tr className="border-b border-border"><th className="p-3 font-normal text-xs tracking-wider uppercase">Description</th><th className="p-3 font-normal text-xs tracking-wider uppercase">Category</th><th className="p-3 font-normal text-xs tracking-wider uppercase">Date</th><th className="p-3 text-right font-normal text-xs tracking-wider uppercase">Amount</th></tr></thead>
            <tbody>{expenses.length > 0 ? expenses.map(e => (<tr key={e.id} className="border-b border-border last:border-0 hover:bg-muted/50"><td className="p-3 font-medium">{e.description}</td><td className="p-3 text-muted-foreground">{e.category}</td><td className="p-3 text-muted-foreground">{new Date(e.date).toLocaleDateString()}</td><td className="p-3 text-right font-mono">₹{e.amount.toFixed(2)}</td></tr>)) : (<tr><td colSpan="4" className="p-8 text-center text-muted-foreground">Click the orb to record your first expense!</td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
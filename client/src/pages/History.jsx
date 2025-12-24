import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Search, ArrowUpDown, Calendar, Trash2, MoreHorizontal } from "lucide-react";
import useExpenseStore from "@/store/expenseStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const History = () => {
  const { expenses, deleteExpense } = useExpenseStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });

  const filteredExpenses = useMemo(() => {
    let data = [...expenses];

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      data = data.filter(
        (expense) =>
          expense.description?.toLowerCase().includes(lowerTerm) ||
          expense.category?.toLowerCase().includes(lowerTerm) ||
          (expense.amount || 0).toString().includes(lowerTerm)
      );
    }

    data.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    return data;
  }, [expenses, searchTerm, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      toast.success("Expense deleted");
    } catch (error) {
      toast.error("Failed to delete expense");
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full py-8 px-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="text-muted-foreground text-sm mb-1">
          View and manage your expenses
        </p>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-semibold text-foreground">
            Transaction History
          </h1>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl overflow-hidden"
      >
        <div className="grid grid-cols-12 gap-4 px-5 py-4 bg-muted/50 border-b border-border">
          <div className="col-span-2">
            <button
              onClick={() => handleSort("date")}
              className="flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
            >
              Date
              <ArrowUpDown className="h-3 w-3" />
            </button>
          </div>
          <div className="col-span-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Description
          </div>
          <div className="col-span-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Category
          </div>
          <div className="col-span-2 text-right">
            <button
              onClick={() => handleSort("amount")}
              className="flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors ml-auto"
            >
              Amount
              <ArrowUpDown className="h-3 w-3" />
            </button>
          </div>
          <div className="col-span-2 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Actions
          </div>
        </div>
        {filteredExpenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Calendar className="w-12 h-12 mb-4 opacity-30" />
            <p className="text-sm">No transactions found</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredExpenses.map((expense, index) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className="grid grid-cols-12 gap-4 px-5 py-4 hover:bg-muted/30 transition-colors items-center"
              >
                <div className="col-span-2 text-sm text-muted-foreground">
                  {format(new Date(expense.date), "MMM d, yyyy")}
                </div>
                <div className="col-span-4">
                  <p className="font-medium text-foreground truncate">
                    {expense.description || "Expense"}
                  </p>
                  {expense.location && (
                    <p className="text-xs text-muted-foreground truncate">
                      {expense.location}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground capitalize">
                    {expense.category || "Other"}
                  </span>
                </div>
                <div className="col-span-2 text-right font-semibold text-foreground">
                  ₹{(expense.amount || 0).toLocaleString("en-IN")}
                </div>
                <div className="col-span-2 flex justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-red-500"
                    onClick={() => handleDelete(expense.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {filteredExpenses.length > 0 && (
          <div className="px-5 py-4 border-t border-border bg-muted/30">
            <p className="text-sm text-muted-foreground">
              Showing {filteredExpenses.length} transaction{filteredExpenses.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default History;

import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Search, Trash2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import useExpenseStore from '@/store/expenseStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import EmptyState from '@/components/ui/EmptyState';
import { toast } from 'sonner';

const History = () => {
  const { expenses, deleteExpense } = useExpenseStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filteredExpenses = useMemo(() => {
    let data = [...expenses];

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      data = data.filter(
        (expense) =>
          expense.description?.toLowerCase().includes(lowerTerm)
          || expense.category?.toLowerCase().includes(lowerTerm)
          || (expense.amount || 0).toString().includes(lowerTerm)
      );
    }

    data.sort((a, b) => new Date(b.date) - new Date(a.date));

    return data;
  }, [expenses, searchTerm]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteExpense(deleteTarget.id);
      toast.success('Expense deleted');
    } catch {
      toast.error('Failed to delete expense');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="container py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-meta text-muted-foreground">Expense records</p>
        <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <h1 className="text-heading text-4xl font-semibold">Transaction History</h1>
          <div className="relative w-full md:w-80">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search transactions"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="pl-11"
            />
          </div>
        </div>
      </motion.div>

      {filteredExpenses.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No transactions yet"
          description="Add your first expense from dashboard voice input to see records here."
          ctaLabel="Go to Dashboard"
          onCtaClick={() => {
            window.location.href = '/dashboard';
          }}
        />
      ) : (
        <div className="surface-2 overflow-hidden rounded-lg border border-border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{format(new Date(expense.date), 'MMM d, yyyy')}</TableCell>
                  <TableCell>{expense.description || 'Expense'}</TableCell>
                  <TableCell className="capitalize">{expense.category || 'other'}</TableCell>
                  <TableCell className="text-right font-medium">₹{(expense.amount || 0).toLocaleString('en-IN')}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      size="dense"
                      variant="ghost"
                      aria-label="Delete expense"
                      onClick={() => setDeleteTarget(expense)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete expense?</DialogTitle>
            <DialogDescription>
              This will permanently remove &quot;{deleteTarget?.description || 'this expense'}&quot; (₹{(deleteTarget?.amount || 0).toLocaleString('en-IN')}).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default History;

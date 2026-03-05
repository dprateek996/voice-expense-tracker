import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Search, Trash2, Pencil, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import useExpenseStore from '@/store/expenseStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { SkeletonTableRow } from '@/components/ui/SkeletonCard';
import { toast } from 'sonner';

const CATEGORIES = [
  'Food & Dining', 'Transport', 'Shopping', 'Entertainment',
  'Groceries', 'Bills & Utilities', 'Health', 'Education',
  'Transfer', 'General', 'Other',
];

const History = () => {
  const { expenses, deleteExpense, updateExpense, loading } = useExpenseStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({ amount: '', description: '', category: '', date: '' });
  const [saving, setSaving] = useState(false);

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

  const openEditDialog = (expense) => {
    setEditTarget(expense);
    setEditForm({
      amount: expense.amount || '',
      description: expense.description || '',
      category: expense.category || 'Other',
      date: format(new Date(expense.date), 'yyyy-MM-dd'),
    });
  };

  const handleEdit = async () => {
    if (!editTarget) return;
    const amount = Number(editForm.amount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    setSaving(true);
    try {
      await updateExpense(editTarget.id, {
        amount,
        description: editForm.description.trim() || 'Expense',
        category: editForm.category || 'Other',
        date: editForm.date,
      });
      toast.success('Expense updated');
      setEditTarget(null);
    } catch {
      toast.error('Failed to update expense');
    } finally {
      setSaving(false);
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

      {loading ? (
        <div className="surface-2 overflow-hidden rounded-lg border border-border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {[...Array(6)].map((_, i) => <SkeletonTableRow key={i} />)}
            </tbody>
          </Table>
        </div>
      ) : filteredExpenses.length === 0 ? (
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{format(new Date(expense.date), 'MMM d, yyyy')}</TableCell>
                  <TableCell>{expense.description || 'Expense'}</TableCell>
                  <TableCell className="capitalize">{expense.category || 'other'}</TableCell>
                  <TableCell className="text-right font-medium font-mono">₹{(expense.amount || 0).toLocaleString('en-IN')}</TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-1">
                      <Button
                        type="button"
                        size="dense"
                        variant="ghost"
                        aria-label="Edit expense"
                        onClick={() => openEditDialog(expense)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="dense"
                        variant="ghost"
                        aria-label="Delete expense"
                        onClick={() => setDeleteTarget(expense)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
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

      {/* Edit Expense Dialog */}
      <Dialog open={!!editTarget} onOpenChange={(open) => { if (!open) setEditTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit expense</DialogTitle>
            <DialogDescription>Update the details of this expense.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Amount (₹)</Label>
              <Input
                id="edit-amount"
                type="number"
                min="1"
                step="1"
                value={editForm.amount}
                onChange={(e) => setEditForm((prev) => ({ ...prev, amount: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <select
                id="edit-category"
                value={editForm.category}
                onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value }))}
                className="focus-ring w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={editForm.date}
                onChange={(e) => setEditForm((prev) => ({ ...prev, date: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setEditTarget(null)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleEdit} disabled={saving} loading={saving}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default History;

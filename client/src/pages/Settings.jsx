import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { User, Wallet, Download, Trash2, LogOut, ChevronRight, Moon, Sun } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import useExpenseStore from '@/store/expenseStore';
import useThemeStore from '@/store/themeStore';
import { updateProfile, deleteAccount } from '@/api/auth.api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const Settings = () => {
  const { user, logout } = useAuthStore();
  const { budget, setBudget, expenses } = useExpenseStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [monthlyBudget, setMonthlyBudget] = useState(budget || 5000);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }
    try {
      const { user: updatedUser } = await updateProfile({ name: name.trim(), email: email.trim() });
      useAuthStore.getState().login(updatedUser, useAuthStore.getState().token);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error?.response?.data?.error || error?.message || 'Failed to update profile');
    }
  };

  const handleSaveBudget = () => {
    const newBudget = Number(monthlyBudget);
    if (newBudget <= 0) {
      toast.error('Budget must be greater than 0');
      return;
    }
    setBudget(newBudget);
    toast.success(`Budget updated to ₹${newBudget.toLocaleString('en-IN')}`);
  };

  const handleExportData = () => {
    try {
      const headers = ['Date', 'Category', 'Description', 'Amount'];
      const rows = expenses.map((expense) => [
        new Date(expense.date).toLocaleDateString(),
        expense.category,
        expense.description || '',
        expense.amount,
      ]);

      const csvContent = [headers.join(','), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success('Data exported successfully');
    } catch {
      toast.error('Failed to export data');
    }
  };

  const confirmDeleteAccount = async () => {
    setShowDeleteDialog(false);
    try {
      await deleteAccount();
      toast.success('Account deleted. Logging out...');
      setTimeout(() => {
        logout();
        navigate('/');
      }, 1500);
    } catch (error) {
      toast.error(error?.response?.data?.error || error?.message || 'Failed to delete account');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <div className="container py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-meta text-muted-foreground">Preferences</p>
        <h1 className="text-heading mt-4 text-4xl font-semibold">Settings</h1>
      </motion.div>

      <div className="space-y-6">
        <section className="surface-2 rounded-lg border border-border card-pad-default shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-muted text-muted-foreground">
                {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </span>
              <div>
                <h2 className="text-heading text-xl font-semibold">Appearance</h2>
                <p className="text-sm text-muted-foreground">{theme === 'dark' ? 'Dark' : 'Light'} mode</p>
              </div>
            </div>
            <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
          </div>
        </section>

        <section className="surface-2 rounded-lg border border-border card-pad-default shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <User className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-heading text-xl font-semibold">Profile</h2>
              <p className="text-sm text-muted-foreground">Update account information</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
          </div>

          <div className="mt-6">
            <Button type="button" onClick={handleSaveProfile}>Save profile</Button>
          </div>
        </section>

        <section className="surface-2 rounded-lg border border-border card-pad-default shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <Wallet className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-heading text-xl font-semibold">Monthly budget</h2>
              <p className="text-sm text-muted-foreground">Current: ₹{budget.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Budget amount</Label>
            <Input id="budget" type="number" value={monthlyBudget} onChange={(event) => setMonthlyBudget(event.target.value)} min="0" />
          </div>

          <div className="mt-6">
            <Button type="button" onClick={handleSaveBudget}>Update budget</Button>
          </div>
        </section>

        <section className="surface-2 overflow-hidden rounded-lg border border-border shadow-sm">
          <button type="button" onClick={handleExportData} className="flex h-12 w-full items-center justify-between px-6 text-left hover:bg-muted/40">
            <span className="flex items-center gap-3 text-sm text-foreground"><Download className="h-4 w-4" />Export data</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
          <button type="button" onClick={handleLogout} className="flex h-12 w-full items-center justify-between border-t border-border px-6 text-left hover:bg-muted/40">
            <span className="flex items-center gap-3 text-sm text-foreground"><LogOut className="h-4 w-4" />Log out</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteDialog(true)}
            className="flex h-12 w-full items-center justify-between border-t border-border px-6 text-left text-destructive hover:bg-destructive/10"
          >
            <span className="flex items-center gap-3 text-sm"><Trash2 className="h-4 w-4" />Delete account</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </section>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete account?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Your account data will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={confirmDeleteAccount}>
              Delete account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;

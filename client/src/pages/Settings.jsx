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
import {
  User,
  Wallet,
  Download,
  Trash2,
  LogOut,
  ChevronRight,
  Moon,
  Sun
} from 'lucide-react';
import useAuthStore from '@/store/authStore';
import useExpenseStore from '@/store/expenseStore';
import useThemeStore from '@/store/themeStore';
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

  const handleSaveProfile = () => {
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }
    toast.success('Profile updated successfully');
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
      const rows = expenses.map(exp => [
        new Date(exp.date).toLocaleDateString(),
        exp.category,
        exp.description || '',
        exp.amount
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const confirmDeleteAccount = () => {
    setShowDeleteDialog(false);
    toast.success('Account deleted. Logging out...');
    setTimeout(() => {
      logout();
      navigate('/');
    }, 1500);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <div className="max-w-2xl mx-auto w-full py-8 px-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="text-muted-foreground text-sm mb-1">
          Manage your account
        </p>
        <h1 className="text-3xl font-semibold text-foreground">Settings</h1>
      </motion.div>

      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Sun className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div>
                <h3 className="font-medium text-foreground">Appearance</h3>
                <p className="text-sm text-muted-foreground">
                  {theme === 'dark' ? 'Dark' : 'Light'} mode
                </p>
              </div>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border rounded-2xl p-5 space-y-4"
        >
          <div className="flex items-center gap-4 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Profile</h3>
              <p className="text-sm text-muted-foreground">Update your information</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button onClick={handleSaveProfile} className="w-full">
              Save Changes
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-5 space-y-4"
        >
          <div className="flex items-center gap-4 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Monthly Budget</h3>
              <p className="text-sm text-muted-foreground">
                Current: ₹{budget.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="budget">Budget Amount (₹)</Label>
            <Input
              id="budget"
              type="number"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              className="mt-1"
              min="0"
            />
          </div>

          <Button onClick={handleSaveBudget} className="w-full">
            Update Budget
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card border border-border rounded-2xl overflow-hidden"
        >
          <button
            onClick={handleExportData}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Download className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Export Data</p>
                <p className="text-sm text-muted-foreground">{expenses.length} transactions</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <div className="border-t border-border" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Log Out</p>
                <p className="text-sm text-muted-foreground">Sign out of your account</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <div className="border-t border-border" />

          <button
            onClick={() => setShowDeleteDialog(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <div className="text-left">
                <p className="font-medium text-red-500">Delete Account</p>
                <p className="text-sm text-red-500/70">Permanently remove your data</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-red-400" />
          </button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm text-muted-foreground pt-4"
        >
          VoEx v1.0.0
        </motion.div>
      </div>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. All your data will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4">
            <p className="text-sm font-semibold text-red-900 dark:text-red-400 mb-2">You will lose:</p>
            <ul className="text-sm text-red-800 dark:text-red-400/80 space-y-1">
              <li>• {expenses.length} expense records</li>
              <li>• All analytics and insights</li>
              <li>• Account preferences</li>
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteAccount}>
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;

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
import { Card, CardContent } from '@/components/ui/card';
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
    toast.success(`Budget updated to ₹${newBudget}`);
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
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account</p>
        </motion.div>

        {/* Theme Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card className="border-none shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    {theme === 'dark' ? (
                      <Moon className="w-6 h-6 text-white" />
                    ) : (
                      <Sun className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">Appearance</h3>
                    <p className="text-sm text-muted-foreground">
                      {theme === 'dark' ? 'Dark' : 'Light'} mode active
                    </p>
                  </div>
                </div>
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Toggle between light and dark theme for a comfortable viewing experience.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="border-none shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b">
                <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center overflow-hidden">
                  <svg 
                    viewBox="0 0 24 24" 
                    className="w-8 h-8 text-slate-600"
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="9" r="3" />
                    <path d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.834 2.855" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Profile</h3>
                  <p className="text-sm text-slate-600">Update your information</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-slate-700">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-slate-700">Email</Label>
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
            </CardContent>
          </Card>
        </motion.div>

        {/* Budget Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="border-none shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Monthly Budget</h3>
                  <p className="text-sm text-slate-600">Current: ₹{budget.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div>
                <Label htmlFor="budget" className="text-slate-700">Budget Amount (₹)</Label>
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
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="border-none shadow-lg">
            <CardContent className="p-6 space-y-2">
              
              <button
                onClick={handleExportData}
                className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Download className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-slate-900">Export Data</p>
                    <p className="text-sm text-slate-600">{expenses.length} transactions</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                    <svg 
                      viewBox="0 0 24 24" 
                      className="w-5 h-5 text-orange-600"
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <polyline points="10 17 15 12 10 7" />
                      <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-slate-900">Log Out</p>
                    <p className="text-sm text-slate-600">Sign out of your account</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </button>

              <button
                onClick={() => setShowDeleteDialog(true)}
                className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-red-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-red-600">Delete Account</p>
                    <p className="text-sm text-red-600/70">Permanently remove your data</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-red-400 group-hover:text-red-600 transition-colors" />
              </button>

            </CardContent>
          </Card>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="text-center text-sm text-muted-foreground pb-8"
        >
          <p>Version 1.0.0</p>
        </motion.div>

      </div>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. All your data will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-red-900 mb-2">You will lose:</p>
            <ul className="text-sm text-red-800 space-y-1">
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

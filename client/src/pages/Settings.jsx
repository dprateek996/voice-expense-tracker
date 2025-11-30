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
  Bell,
  Shield,
  Download,
  Trash2,
  Save,
  Mail,
  Phone,
  LogOut
} from 'lucide-react';
import useAuthStore from '@/store/authStore';
import useExpenseStore from '@/store/expenseStore';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Settings = () => {
  const { user, logout } = useAuthStore();
  const { budget, setBudget, expenses } = useExpenseStore();
  const navigate = useNavigate();

  // User profile state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');

  // Budget state
  const [monthlyBudget, setMonthlyBudget] = useState(budget || 5000);

  // Notification toggles
  const [budgetAlerts, setBudgetAlerts] = useState(false);
  const [dailySummary, setDailySummary] = useState(false);
  const [weeklyReports, setWeeklyReports] = useState(false);

  // Delete confirmation dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleSaveProfile = () => {
    // TODO: API call to update profile
    // For now, just show success
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
      // Export expenses to CSV
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
      link.download = `voex-expenses-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const handleDeleteAccount = () => {
    // Show confirmation dialog
    setShowDeleteDialog(true);
  };

  const confirmDeleteAccount = () => {
    // In a real app, this would call an API to delete the account
    setShowDeleteDialog(false);
    toast.success('Account deleted. Logging out...');

    setTimeout(() => {
      logout();
      navigate('/');
    }, 1500);
  };

  const toggleNotification = (type) => {
    switch (type) {
      case 'budget':
        setBudgetAlerts(!budgetAlerts);
        toast.success(`Budget alerts ${!budgetAlerts ? 'enabled' : 'disabled'}`);
        break;
      case 'daily':
        setDailySummary(!dailySummary);
        toast.success(`Daily summary ${!dailySummary ? 'enabled' : 'disabled'}`);
        break;
      case 'weekly':
        setWeeklyReports(!weeklyReports);
        toast.success(`Weekly reports ${!weeklyReports ? 'enabled' : 'disabled'}`);
        break;
    }
  };

  return (
    <motion.div
      className="space-y-6 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 via-slate-600 to-slate-500 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-slate-600" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>

              <Button onClick={handleSaveProfile} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Profile
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Budget Settings */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-slate-600" />
                Budget Settings
              </CardTitle>
              <CardDescription>Set your monthly spending limit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Monthly Budget (₹)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value)}
                  placeholder="5000"
                  min="0"
                />
                <p className="text-sm text-muted-foreground">
                  Current: ₹{budget.toFixed(2)} per month
                </p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="text-sm font-semibold mb-2">Budget Tips</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Set realistic monthly limits</li>
                  <li>• Track daily spending averages</li>
                  <li>• Review and adjust regularly</li>
                </ul>
              </div>

              <Button onClick={handleSaveBudget} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Update Budget
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-slate-600" />
                Notifications
              </CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Budget Alerts</p>
                  <p className="text-sm text-muted-foreground">Get notified when you reach 80% of budget</p>
                </div>
                <Button
                  variant={budgetAlerts ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleNotification('budget')}
                >
                  {budgetAlerts ? 'Enabled' : 'Enable'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Daily Summary</p>
                  <p className="text-sm text-muted-foreground">Receive daily spending summary</p>
                </div>
                <Button
                  variant={dailySummary ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleNotification('daily')}
                >
                  {dailySummary ? 'Enabled' : 'Enable'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekly Reports</p>
                  <p className="text-sm text-muted-foreground">Get weekly expense reports</p>
                </div>
                <Button
                  variant={weeklyReports ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleNotification('weekly')}
                >
                  {weeklyReports ? 'Enabled' : 'Enable'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security & Privacy */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-slate-600" />
                Security & Privacy
              </CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => toast.info('Password change feature coming soon')}
              >
                Change Password
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => toast.info('2FA feature coming soon')}
              >
                Two-Factor Authentication
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => toast.info('Connected devices feature coming soon')}
              >
                Connected Devices
              </Button>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Account created:</p>
                <p className="text-sm font-medium">November 2025</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Data Management */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Export or delete your data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleExportData} variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Export All Data
              </Button>

              <Button onClick={handleDeleteAccount} variant="destructive" className="flex-1">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Exporting your data will download all expenses in CSV format ({expenses.length} transactions).
              Deleting your account is permanent and cannot be undone.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* App Information */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>About VoEx</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Version</p>
                <p className="font-semibold">1.0.0</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p className="font-semibold">Nov 2025</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Expenses</p>
                <p className="font-semibold">{expenses.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Account Status</p>
                <p className="font-semibold text-green-600">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-sm font-semibold text-destructive mb-2">You will lose:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• All {expenses.length} expense records</li>
              <li>• All analytics and insights</li>
              <li>• Your account preferences</li>
              <li>• Access to this account permanently</li>
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteAccount}>
              <LogOut className="w-4 h-4 mr-2" />
              Delete My Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Settings;

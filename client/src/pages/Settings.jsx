<<<<<<< HEAD
import { useState, useEffect } from 'react';
=======
import { useState } from 'react';
import { motion } from 'framer-motion';
>>>>>>> updated-design
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
<<<<<<< HEAD
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Settings as SettingsIcon, Wallet, Mic, Palette, Bell, Download, User, LogOut, Save, RotateCcw } from 'lucide-react';
import useExpenseStore from '@/store/expenseStore';
import useAuthStore from '@/store/authStore';

const Settings = () => {
  const { budget, setBudget } = useExpenseStore();
  const { user, logout } = useAuthStore();

  // Settings state
  const [tempBudget, setTempBudget] = useState(budget.toString());
  const [currency, setCurrency] = useState('INR');
  const [theme, setTheme] = useState('dark');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [exportFormat, setExportFormat] = useState('csv');
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  // Voice settings
  const [voiceLanguage, setVoiceLanguage] = useState('en-US');
  const [voiceSpeed, setVoiceSpeed] = useState(1);
  const [voiceVolume, setVoiceVolume] = useState(0.8);

  useEffect(() => {
    setTempBudget(budget.toString());
  }, [budget]);

  const handleSaveBudget = () => {
    const newBudget = Number(tempBudget);
    if (newBudget > 0) {
      setBudget(newBudget);
      setIsBudgetDialogOpen(false);
      toast.success('Budget updated successfully!');
    } else {
      toast.error('Please enter a valid budget amount');
    }
  };

  const handleExportData = () => {
    toast.success(`Data exported as ${exportFormat.toUpperCase()} file!`);
    setIsExportDialogOpen(false);
  };

  const handleResetData = () => {
    toast.success('All data has been reset!');
    setIsResetDialogOpen(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-slate-700 rounded-lg">
              <SettingsIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
          </div>
          <p className="text-slate-400">Manage your account preferences and app settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Budget Section */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Wallet className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Budget Management</CardTitle>
                    <CardDescription className="text-slate-400">Set your monthly spending limits</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-300">Monthly Budget</p>
                    <p className="text-2xl font-bold text-green-400">₹{budget.toLocaleString()}</p>
                  </div>
                  <Dialog open={isBudgetDialogOpen} onOpenChange={setIsBudgetDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-slate-600 hover:bg-slate-700">Update Budget</Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-800 border-slate-700">
                      <DialogHeader>
                        <DialogTitle className="text-white">Update Monthly Budget</DialogTitle>
                        <DialogDescription className="text-slate-400">
                          Set your spending limit for the current month
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="budget" className="text-slate-300">Monthly Budget (₹)</Label>
                          <Input
                            id="budget"
                            type="number"
                            placeholder="Enter amount"
                            value={tempBudget}
                            onChange={(e) => setTempBudget(e.target.value)}
                            className="mt-1 bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsBudgetDialogOpen(false)} className="border-slate-600 text-slate-300 hover:bg-slate-700">
                          Cancel
                        </Button>
                        <Button onClick={handleSaveBudget} className="bg-slate-600 hover:bg-slate-700">
                          <Save className="h-4 w-4 mr-2" />
                          Save Budget
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Voice Settings */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-slate-500/20 rounded-lg">
                    <Mic className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Voice Settings</CardTitle>
                    <CardDescription className="text-slate-400">Configure voice recognition and speech</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-slate-300">Voice Recognition</Label>
                    <p className="text-sm text-slate-400">Enable voice input for expenses</p>
                  </div>
                  <Switch
                    checked={voiceEnabled}
                    onCheckedChange={setVoiceEnabled}
                  />
                </div>

                <Separator className="bg-slate-700" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Language</Label>
                    <Select value={voiceLanguage} onValueChange={setVoiceLanguage}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="en-US" className="text-white hover:bg-slate-600">English (US)</SelectItem>
                        <SelectItem value="en-GB" className="text-white hover:bg-slate-600">English (UK)</SelectItem>
                        <SelectItem value="hi-IN" className="text-white hover:bg-slate-600">Hindi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Speech Speed: {voiceSpeed}x</Label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={voiceSpeed}
                      onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Volume: {Math.round(voiceVolume * 100)}%</Label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={voiceVolume}
                    onChange={(e) => setVoiceVolume(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <Bell className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Preferences</CardTitle>
                    <CardDescription className="text-slate-400">App behavior and notifications</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-slate-300">Auto-save</Label>
                    <p className="text-sm text-slate-400">Automatically save expenses</p>
                  </div>
                  <Switch
                    checked={autoSave}
                    onCheckedChange={setAutoSave}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-slate-300">Notifications</Label>
                    <p className="text-sm text-slate-400">Budget alerts and reminders</p>
                  </div>
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Appearance */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-pink-500/20 rounded-lg">
                    <Palette className="h-5 w-5 text-pink-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">Appearance</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Theme</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="dark" className="text-white hover:bg-slate-600">Dark</SelectItem>
                      <SelectItem value="light" className="text-white hover:bg-slate-600">Light</SelectItem>
                      <SelectItem value="system" className="text-white hover:bg-slate-600">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="INR" className="text-white hover:bg-slate-600">Indian Rupee (₹)</SelectItem>
                      <SelectItem value="USD" className="text-white hover:bg-slate-600">US Dollar ($)</SelectItem>
                      <SelectItem value="EUR" className="text-white hover:bg-slate-600">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <Download className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">Data</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-800 border-slate-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">Export Data</DialogTitle>
                      <DialogDescription className="text-slate-400">
                        Choose the format for your exported data
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-slate-300">Export Format</Label>
                        <Select value={exportFormat} onValueChange={setExportFormat}>
                          <SelectTrigger className="mt-1 bg-slate-700 border-slate-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            <SelectItem value="csv" className="text-white hover:bg-slate-600">CSV</SelectItem>
                            <SelectItem value="json" className="text-white hover:bg-slate-600">JSON</SelectItem>
                            <SelectItem value="pdf" className="text-white hover:bg-slate-600">PDF</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsExportDialogOpen(false)} className="border-slate-600 text-slate-300 hover:bg-slate-700">
                        Cancel
                      </Button>
                      <Button onClick={handleExportData} className="bg-slate-600 hover:bg-slate-700">
                        Export
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full justify-start">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset Data
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-800 border-slate-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">Reset All Data</DialogTitle>
                      <DialogDescription className="text-slate-400">
                        This will permanently delete all your expenses and settings. This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsResetDialogOpen(false)} className="border-slate-600 text-slate-300 hover:bg-slate-700">
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleResetData}>
                        Reset Everything
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Account */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <User className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">Account</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">Email</Label>
                  <p className="text-white font-medium">{user?.email || 'user@example.com'}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">Status</Label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                    Active
                  </span>
                </div>

                <Separator className="bg-slate-700" />

                <Button
                  variant="outline"
                  className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
=======
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
>>>>>>> updated-design

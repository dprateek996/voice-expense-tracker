import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
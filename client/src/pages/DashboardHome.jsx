import { TrendingUp, TrendingDown, Wallet, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import GlassCard from '@/components/ui/card';
import ExpenseList from '@/components/dashboard/ExpenseList.jsx';
import useAuthStore from '@/store/authStore';
import { useState } from 'react';

const DashboardHome = () => {
  // TODO: Fetch real data from API
  const stats = [
    {
      title: "Today's Spending",
      value: '₹0',
      change: '+0%',
      trend: 'up',
      icon: Wallet,
    },
    {
      title: 'This Week',
      value: '₹0',
      change: '+0%',
      trend: 'up',
      icon: Calendar,
    },
    {
      title: 'This Month',
      value: '₹0',
      change: '+0%',
      trend: 'down',
      icon: TrendingUp,
    },
    {
      title: 'Budget Left',
      value: '₹0',
      change: '100%',
      trend: 'down',
      icon: TrendingDown,
    },
  ];

  const token = useAuthStore(state => state.token);
  const [refreshExpenses, setRefreshExpenses] = useState(false);
  return (
    <div className="container mx-auto px-6 py-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <GlassCard
              key={index}
              className="relative overflow-hidden group p-0 h-40 flex flex-col justify-between shadow-2xl border-0 bg-gradient-primary"
            >
              {/* Large Icon with Glow */}
              <div className="absolute top-4 right-4 z-10">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-primary-100 to-primary-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                  <Icon className="w-8 h-8 text-[#294C60] drop-shadow-lg" />
                </div>
              </div>
              {/* Stat Value */}
              <div className="pl-6 pt-6">
                <p className="text-lg font-semibold text-[#294C60] mb-1 tracking-tight">{stat.title}</p>
                <p className="text-3xl font-extrabold text-[#294C60] mb-2 drop-shadow-xl">{stat.value}</p>
              </div>
              {/* Trend and Change */}
              <div className="flex items-center gap-2 pl-6 pb-5">
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-5 h-5 text-[#294C60] animate-pulse" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-[#294C60] animate-pulse" />
                )}
                <span className={cn('text-base font-bold', 'text-[#294C60]')}>{stat.change}</span>
                <span className="text-xs text-muted-foreground ml-1">vs last period</span>
              </div>
              {/* Animated Glow Background */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary-100/20 rounded-full blur-2xl animate-pulse-glow" />
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary-500/20 rounded-full blur-2xl animate-pulse-glow" />
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Recent Expenses - Real Data */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gradient">Recent Expenses</h2>
          <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
            View All →
          </button>
        </div>
  <ExpenseList token={token} refresh={refreshExpenses} />
      </div>
    </div>
  );
};

export default DashboardHome;

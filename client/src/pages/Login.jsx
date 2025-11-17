import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { loginUser } from '../api/auth.api';
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';
import {
  Pizza,
  Fuel,
  Shirt,
  Wallet,
  Car,
  Train,
  Music,
  CupSoda,
  UtensilsCrossed,
} from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      toast.error('Email and password are required.');
      setIsLoading(false);
      return;
    }

    try {
      await loginUser(formData);
      toast.success('Login successful! Redirecting...');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-screen overflow-hidden bg-background">
      {/* BACKGROUND ANIMATED CARDS */}
      <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-3 gap-8 p-4 md:p-8 transform-gpu opacity-15 [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)]">
        <div className="flex flex-col gap-8">
          <InfiniteMovingCards items={leftColumnItems} direction="right" speed="slow" />
        </div>
        <div className="hidden md:flex flex-col gap-8">
          <InfiniteMovingCards items={middleColumnItems} direction="left" speed="slow" />
        </div>
        <div className="hidden md:flex flex-col gap-8">
          <InfiniteMovingCards items={rightColumnItems} direction="right" speed="slow" />
        </div>
      </div>

      {/* FOREGROUND CONTENT */}
      <div className="relative z-20 w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg border border-border">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to access your dashboard</p>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-muted-foreground">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 text-foreground bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-muted-foreground">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 text-foreground bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-primary hover:underline">
                Forgot your password?
              </Link>
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 font-semibold text-primary-foreground bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

const leftColumnItems = [
  { title: "Paid via UPI", amount: "₹200", icon: <Wallet className="h-6 w-6 text-primary" /> },
  { title: "Zomato", amount: "₹189", icon: <UtensilsCrossed className="h-6 w-6 text-red-400" /> },
  { title: "Spotify", amount: "₹59", icon: <Music className="h-6 w-6 text-green-400" /> },
];

const middleColumnItems = [
  { title: "Domino’s", amount: "₹445", icon: <Pizza className="h-6 w-6 text-blue-400" /> },
  { title: "Uber", amount: "₹168", icon: <Car className="h-6 w-6 text-white" /> },
  { title: "Canteen", amount: "₹80", icon: <CupSoda className="h-6 w-6 text-orange-400" /> },
];

const rightColumnItems = [
  { title: "Fuel – Cash", amount: "₹200", icon: <Fuel className="h-6 w-6 text-yellow-400" /> },
  { title: "Metro Recharge", amount: "₹300", icon: <Train className="h-6 w-6 text-purple-400" /> },
  { title: "H&M", amount: "₹1200", icon: <Shirt className="h-6 w-6 text-pink-400" /> },
];
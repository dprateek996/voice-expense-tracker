import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { registerUser } from '../api/auth.api';
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

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.name || !formData.email || !formData.password) {
      toast.error('All fields are required.');
      setIsLoading(false);
      return;
    }

    try {
      await registerUser(formData);
      toast.success('Registration successful! Redirecting...');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
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
          <h1 className="text-3xl font-bold text-foreground">Create an Account</h1>
          <p className="text-muted-foreground">Start tracking your expenses with your voice</p>
        </div>
        <form className="space-y-6" onSubmit={handleRegister}>
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-muted-foreground">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 text-foreground bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="John Doe"
            />
          </div>
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
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 text-foreground bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 font-semibold text-primary-foreground bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

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
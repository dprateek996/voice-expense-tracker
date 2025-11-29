import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
<<<<<<< HEAD
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
=======
import { registerUser } from '@/api/auth.api';
import useAuthStore from '@/store/authStore';
import { Loader2, Mic } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
>>>>>>> updated-design

const Register = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await registerUser(data);
      login(response.user, response.token);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
<<<<<<< HEAD
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
=======
    <div className="min-h-screen w-full flex flex-col bg-slate-50 bg-grain relative overflow-hidden font-sans text-slate-900 selection:bg-primary/20">

      {/* Subtle Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl shadow-slate-200/50">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Mic className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight font-heading text-slate-900">Create an account</CardTitle>
            <CardDescription className="text-slate-500">
              Enter your information to get started
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  {...register('name')}
                  className="bg-white/50 border-slate-200 focus:ring-primary focus:border-primary rounded-xl"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register('email')}
                  className="bg-white/50 border-slate-200 focus:ring-primary focus:border-primary rounded-xl"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  className="bg-white/50 border-slate-200 focus:ring-primary focus:border-primary rounded-xl"
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-700">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  className="bg-white/50 border-slate-200 focus:ring-primary focus:border-primary rounded-xl"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-11 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
              <div className="text-center text-sm text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
>>>>>>> updated-design
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
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
=======
import { loginUser } from '@/api/auth.api';
import useAuthStore from '@/store/authStore';
import { Loader2, Mic } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
>>>>>>> updated-design

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await loginUser(data);
      login(response.user, response.token);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.response?.data?.error || error.response?.data?.message || error.message || 'Login failed');
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
=======
    <div className="min-h-screen w-full flex flex-col bg-slate-50 bg-grain relative overflow-hidden font-sans text-slate-900 selection:bg-primary/20">

      {/* Subtle Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl shadow-slate-200/50">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Mic className="w-6 h-6 text-primary" />
>>>>>>> updated-design
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight font-heading text-slate-900">Welcome back</CardTitle>
            <CardDescription className="text-slate-500">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-700">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
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
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-11 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
              <div className="text-center text-sm text-slate-500">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="font-semibold text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
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
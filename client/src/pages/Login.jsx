import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion as Motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { loginUser } from '@/api/auth.api';
import useAuthStore from '@/store/authStore';
import AuthShell from '@/components/layout/AuthShell';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await loginUser(data);
      login(response.user, response.token);
      toast.success('Welcome back');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || error.response?.data?.message || error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue tracking expenses.">
      <Motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: 'easeInOut' }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="email" type="email" placeholder="name@example.com" className="pl-11" autoComplete="email" {...register('email')} />
          </div>
          {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-ring rounded-sm">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="pl-11 pr-11"
              autoComplete="current-password"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="focus-ring absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password ? <p className="text-sm text-destructive">{errors.password.message}</p> : null}
        </div>

        <Button type="submit" loading={isLoading} disabled={isLoading} className="w-full">
          Sign In
        </Button>

        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium text-foreground underline-offset-4 hover:underline focus-ring rounded-sm">
            Sign up
          </Link>
        </p>
      </Motion.form>
    </AuthShell>
  );
};

export default Login;

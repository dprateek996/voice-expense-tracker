import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion as Motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { registerUser } from '@/api/auth.api';
import useAuthStore from '@/store/authStore';
import AuthShell from '@/components/layout/AuthShell';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must include uppercase, lowercase and number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const Register = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const calculatePasswordStrength = (pass) => {
    if (!pass) return 0;
    let strength = 0;
    if (pass.length >= 8) strength += 35;
    if (pass.length >= 12) strength += 15;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength += 25;
    if (/\d/.test(pass)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(pass)) strength += 10;
    return Math.min(strength, 100);
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await registerUser(data);
      login(response.user, response.token);
      toast.success('Account created successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="Set up VoEx to start voice-first expense tracking.">
      <Motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: 'easeInOut' }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="name" placeholder="John Doe" className="pl-11" autoComplete="name" {...register('name')} />
          </div>
          {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="email" type="email" placeholder="name@example.com" className="pl-11" autoComplete="email" {...register('email')} />
          </div>
          {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="pl-11 pr-11"
              autoComplete="new-password"
              {...register('password')}
              onChange={(event) => {
                register('password').onChange(event);
                setPasswordStrength(calculatePasswordStrength(event.target.value));
              }}
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
          <div className="h-2 overflow-hidden rounded-md bg-muted">
            <Motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${passwordStrength}%` }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            />
          </div>
          {errors.password ? <p className="text-sm text-destructive">{errors.password.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="pl-11 pr-11"
              autoComplete="new-password"
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'}
              className="focus-ring absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword ? <p className="text-sm text-destructive">{errors.confirmPassword.message}</p> : null}
        </div>

        <Button type="submit" loading={isLoading} disabled={isLoading} className="w-full">
          Create account
        </Button>

        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline focus-ring rounded-sm">
            Sign in
          </Link>
        </p>
      </Motion.form>
    </AuthShell>
  );
};

export default Register;

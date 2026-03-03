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
import { loginUser } from '@/api/auth.api';
import useAuthStore from '@/store/authStore';
import { Loader2, Mic, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import ThemeToggle from '@/components/ThemeToggle';

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
    <div className="min-h-screen w-full flex flex-col bg-background relative overflow-x-hidden font-sans text-foreground">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative"
        >
          <Card className="relative w-full bg-card border border-border shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="space-y-1 text-center relative z-10 pt-10 pb-6">
              <Motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mx-auto w-16 h-16 flex items-center justify-center mb-6 relative group"
              >
                <div className="relative w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/30 group-hover:border-primary/50 transition-all duration-300">
                  <Mic className="w-8 h-8 text-primary" />
                </div>
              </Motion.div>
              <Motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <CardTitle className="text-3xl font-bold tracking-tight text-foreground mb-2">Welcome back</CardTitle>
                <CardDescription className="text-muted-foreground text-base leading-relaxed">
                  Track expenses effortlessly with your voice<br />
                  <span className="text-sm text-primary">Sign in to continue</span>
                </CardDescription>
              </Motion.div>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-5 px-8 relative z-10">
                <Motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email" className="text-foreground font-medium text-sm">Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors z-10" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      {...register('email')}
                      className="bg-muted/50 border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-xl text-foreground placeholder:text-muted-foreground h-12 pl-12 transition-all duration-300 hover:border-border/80"
                    />
                  </div>
                  {errors.email && (
                    <Motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 flex items-center gap-1"
                    >
                      {errors.email.message}
                    </Motion.p>
                  )}
                </Motion.div>
                <Motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-foreground font-medium text-sm">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors z-10" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register('password')}
                      className="bg-muted/50 border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-xl text-foreground placeholder:text-muted-foreground h-12 pl-12 pr-12 transition-all duration-300 hover:border-border/80"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors z-10"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <Motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 flex items-center gap-1"
                    >
                      {errors.password.message}
                    </Motion.p>
                  )}
                </Motion.div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-5 px-8 pb-10 pt-6 relative z-10">
                <Motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="w-full"
                >
                  <Button
                    type="submit"
                    className="w-full rounded-xl h-12 font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    Sign In
                  </Button>
                </Motion.div>
                <Motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center text-base text-muted-foreground pt-2"
                >
                  Don&apos;t have an account?{' '}
                  <Link to="/register" className="font-semibold text-primary hover:text-primary/80 transition-colors hover:underline underline-offset-4">
                    Sign up
                  </Link>
                </Motion.div>
              </CardFooter>
            </form>
          </Card>
        </Motion.div>
      </div>
    </div>
  );
};

export default Login;

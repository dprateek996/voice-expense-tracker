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
import { motion } from 'framer-motion';

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
    <div className="min-h-screen w-full flex flex-col bg-black relative overflow-hidden font-sans text-foreground">

      {/* Modern Gradient Background - Same as Landing */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/8 via-indigo-500/5 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-sky-400/6 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-indigo-500/8 via-transparent to-transparent pointer-events-none" />
      
      {/* Decorative Blurs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/8 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/8 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />

      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative"
        >
          {/* Card Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-sky-500/20 to-indigo-500/30 rounded-[2.5rem] blur-2xl opacity-40" />
          
          <Card className="relative w-full bg-neutral-900/40 backdrop-blur-3xl border border-white/20 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.08)_inset] rounded-[2rem] overflow-hidden">
            {/* Inner Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-sky-400/10 via-cyan-500/5 to-transparent blur-2xl" />
            
            <CardHeader className="space-y-1 text-center relative z-10 pt-10 pb-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mx-auto w-16 h-16 flex items-center justify-center mb-6 relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-sky-500/30 rounded-2xl blur-xl animate-pulse" style={{ animationDuration: '3s' }} />
                <div className="relative w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-sky-500/20 rounded-2xl flex items-center justify-center border border-cyan-400/30 group-hover:border-cyan-400/50 transition-all duration-300">
                  <Mic className="w-8 h-8 text-cyan-400" />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <CardTitle className="text-3xl font-bold tracking-tight font-heading text-white mb-2">Welcome back</CardTitle>
                <CardDescription className="text-neutral-400 text-base leading-relaxed">
                  Track expenses effortlessly with your voice<br/>
                  <span className="text-sm text-cyan-400/80">Sign in to continue</span>
                </CardDescription>
              </motion.div>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-5 px-8 relative z-10">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email" className="text-neutral-200 font-medium text-sm">Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-hover:text-cyan-400 transition-colors z-10" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      {...register('email')}
                      className="bg-neutral-800/50 border-white/10 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.1)] rounded-xl text-white placeholder:text-neutral-500 h-12 pl-12 transition-all duration-300 hover:border-white/20"
                    />
                  </div>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-400 flex items-center gap-1"
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-neutral-200 font-medium text-sm">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-hover:text-cyan-400 transition-colors z-10" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register('password')}
                      className="bg-neutral-800/50 border-white/10 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.1)] rounded-xl text-white placeholder:text-neutral-500 h-12 pl-12 pr-12 transition-all duration-300 hover:border-white/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-cyan-400 transition-colors z-10"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-400 flex items-center gap-1"
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </motion.div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-5 px-8 pb-10 pt-6 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="w-full"
                >
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#4CAEFF] to-[#007AFF] hover:from-[#3B9EEF] hover:to-[#0066DD] text-white font-semibold rounded-xl h-13 shadow-[inset_0_-1px_2px_rgba(255,255,255,0.3),0_8px_24px_rgba(0,122,255,0.3)] hover:shadow-[inset_0_-1px_2px_rgba(255,255,255,0.3),0_12px_32px_rgba(0,122,255,0.5)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    Sign In
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center text-base text-neutral-400 pt-2"
                >
                  Don&apos;t have an account?{' '}
                  <Link to="/register" className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors hover:underline underline-offset-4">
                    Sign up
                  </Link>
                </motion.div>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

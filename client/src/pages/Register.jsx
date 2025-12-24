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
import { registerUser } from '@/api/auth.api';
import useAuthStore from '@/store/authStore';
import { Loader2, Mic, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from '@/components/ThemeToggle';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
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
    watch,
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password');

  const calculatePasswordStrength = (pass) => {
    if (!pass) return 0;
    let strength = 0;
    if (pass.length >= 6) strength += 25;
    if (pass.length >= 8) strength += 25;
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
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || error.response?.data?.message || 'Registration failed');
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative"
        >
          <Card className="relative w-full bg-card border border-border shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="space-y-1 text-center relative z-10 pt-10 pb-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mx-auto w-16 h-16 flex items-center justify-center mb-6 relative group"
              >
                <div className="relative w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/30 group-hover:border-primary/50 transition-all duration-300">
                  <Mic className="w-8 h-8 text-primary" />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <CardTitle className="text-3xl font-bold tracking-tight text-foreground mb-2">Create an account</CardTitle>
                <CardDescription className="text-muted-foreground text-base leading-relaxed">
                  Smart expense tracking, powered by AI<br />
                  <span className="text-sm text-primary">Sign up in seconds</span>
                </CardDescription>
              </motion.div>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-4 px-8 relative z-10">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <Label htmlFor="name" className="text-foreground font-medium text-sm">Full Name</Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors z-10" />
                    <Input
                      id="name"
                      placeholder="John Doe"
                      {...register('name')}
                      className="bg-muted/50 border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-xl text-foreground placeholder:text-muted-foreground h-12 pl-12 transition-all duration-300 hover:border-border/80"
                    />
                  </div>
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 flex items-center gap-1"
                    >
                      {errors.name.message}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 }}
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
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 flex items-center gap-1"
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2"
                >
                  <Label htmlFor="password" className="text-foreground font-medium text-sm">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors z-10" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register('password')}
                      onChange={(e) => {
                        register('password').onChange(e);
                        setPasswordStrength(calculatePasswordStrength(e.target.value));
                      }}
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
                  {password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-1"
                    >
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${passwordStrength}%` }}
                          className={`h-full transition-all duration-300 ${passwordStrength < 40 ? 'bg-red-500' :
                              passwordStrength < 70 ? 'bg-yellow-500' :
                                'bg-green-500'
                            }`}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {passwordStrength < 40 ? 'Weak password' :
                          passwordStrength < 70 ? 'Good password' :
                            'Strong password'}
                      </p>
                    </motion.div>
                  )}
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 flex items-center gap-1"
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 }}
                  className="space-y-2"
                >
                  <Label htmlFor="confirmPassword" className="text-foreground font-medium text-sm">Confirm Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors z-10" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register('confirmPassword')}
                      className="bg-muted/50 border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-xl text-foreground placeholder:text-muted-foreground h-12 pl-12 pr-12 transition-all duration-300 hover:border-border/80"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors z-10"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 flex items-center gap-1"
                    >
                      {errors.confirmPassword.message}
                    </motion.p>
                  )}
                </motion.div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-5 px-8 pb-10 pt-6 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="w-full"
                >
                  <Button
                    type="submit"
                    className="w-full rounded-xl h-12 font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    Create Account
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-center text-base text-muted-foreground pt-2"
                >
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors hover:underline underline-offset-4">
                    Sign In
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

export default Register;
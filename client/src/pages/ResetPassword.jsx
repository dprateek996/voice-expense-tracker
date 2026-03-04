import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';
import api from '@/api/axios.config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthShell from '@/components/layout/AuthShell';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        newPassword: password,
      });
      setMessage(response.data.message || 'Password reset successful');
      setTimeout(() => navigate('/login'), 1600);
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Reset password" subtitle="Set a strong new password to secure your account.">
      <Motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: 'easeInOut' }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {message ? <p className="rounded-md border border-border bg-muted p-3 text-sm text-foreground">{message}</p> : null}
        {error ? <p className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}

        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="pl-11 pr-11"
              autoComplete="new-password"
              disabled={!token}
              required
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="••••••••"
              className="pl-11 pr-11"
              autoComplete="new-password"
              disabled={!token}
              required
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
        </div>

        <Button type="submit" loading={loading} disabled={loading || !token} className="w-full">
          Reset password
        </Button>

        <p className="text-sm text-muted-foreground">
          Back to{' '}
          <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline focus-ring rounded-sm">
            Login
          </Link>
        </p>
      </Motion.form>
    </AuthShell>
  );
};

export default ResetPassword;

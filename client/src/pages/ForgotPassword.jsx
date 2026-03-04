import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import api from '@/api/axios.config';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AuthShell from '@/components/layout/AuthShell';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setResetLink('');
    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setMessage(response.data.message || 'Password reset link sent to your email.');
      if (response.data.resetUrl) {
        setResetLink(response.data.resetUrl);
      }
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Forgot password" subtitle="Enter your email and we will send you a reset link.">
      <Motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: 'easeInOut' }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {message ? <p className="rounded-md border border-border bg-muted p-3 text-sm text-foreground">{message}</p> : null}
        {error ? <p className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}
        {resetLink ? (
          <p className="rounded-md border border-border bg-muted p-3 text-sm text-foreground">
            Dev mode reset link:{' '}
            <a href={resetLink} className="underline underline-offset-4">Open reset link</a>
          </p>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              className="pl-11"
              autoComplete="email"
              required
            />
          </div>
        </div>

        <Button type="submit" loading={loading} disabled={loading} className="w-full">
          Send reset link
        </Button>

        <p className="text-sm text-muted-foreground">
          Remembered your password?{' '}
          <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline focus-ring rounded-sm">
            Back to login
          </Link>
        </p>
      </Motion.form>
    </AuthShell>
  );
};

export default ForgotPassword;

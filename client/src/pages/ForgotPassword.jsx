import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { Mail, KeyRound } from 'lucide-react';
import api from '@/api/axios.config';
import ThemeToggle from '@/components/ThemeToggle';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset link.');
    } finally {
      setLoading(false);
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
          <div className="relative w-full bg-card border border-border shadow-xl rounded-2xl overflow-hidden p-8">
            <div className="space-y-1 text-center relative z-10 mb-8">
              <Motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mx-auto w-16 h-16 flex items-center justify-center mb-6 relative group"
              >
                <div className="relative w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/30 group-hover:border-primary/50 transition-all duration-300">
                  <KeyRound className="w-8 h-8 text-primary" />
                </div>
              </Motion.div>
              <Motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                  Forgot Password
                </h1>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Enter your email to receive a reset link<br />
                  <span className="text-sm text-primary">We'll help you get back in</span>
                </p>
              </Motion.div>
            </div>

            {message && (
              <Motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 px-4 py-3 rounded-xl mb-6 text-sm text-center font-medium"
              >
                {message}
              </Motion.div>
            )}

            {resetLink && (
              <Motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-primary/10 border border-primary/30 text-primary px-4 py-3 rounded-xl mb-6 text-sm break-all"
              >
                <strong>Dev Mode:</strong> <a href={resetLink} className="underline hover:opacity-80 transition-opacity">Click here to reset</a>
              </Motion.div>
            )}

            {error && (
              <Motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-6 text-sm text-center font-medium"
              >
                {error}
              </Motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground font-semibold rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="text-primary hover:text-primary/80 font-semibold transition-colors inline-flex items-center gap-1"
                >
                  ← Back to Login
                </Link>
              </div>
            </form>
          </div>
        </Motion.div>
      </div>
    </div>
  );
}

export default ForgotPassword;

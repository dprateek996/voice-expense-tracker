import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, KeyRound } from 'lucide-react';
import api from '@/api/axios.config';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setResetLink('');
    setLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setMessage(response.data.message || 'Password reset link sent to your email.');
      // In development, show the reset link
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
    <div className="min-h-screen w-full flex flex-col bg-black relative overflow-x-hidden font-sans text-foreground">
      
      {/* Modern Gradient Background - Same as Login/Register */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-500/8 via-indigo-500/5 to-transparent pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-sky-400/6 via-transparent to-transparent pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-indigo-500/8 via-transparent to-transparent pointer-events-none" />
      
      {/* Decorative Blurs */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/8 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/8 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />

      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative"
        >
          {/* Card Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-sky-500/20 to-indigo-500/30 rounded-[2.5rem] blur-2xl opacity-40" />
          
          <div className="relative w-full bg-neutral-900/40 backdrop-blur-3xl border border-white/20 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.08)_inset] rounded-[2rem] overflow-hidden p-8">
            {/* Inner Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-sky-400/10 via-cyan-500/5 to-transparent blur-2xl" />
            {/* Inner Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-sky-400/10 via-cyan-500/5 to-transparent blur-2xl" />
            
            <div className="space-y-1 text-center relative z-10 mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mx-auto w-16 h-16 flex items-center justify-center mb-6 relative group"
              >
                <div className="relative w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-sky-500/20 rounded-2xl flex items-center justify-center border border-cyan-400/30 group-hover:border-cyan-400/50 transition-all duration-300">
                  <KeyRound className="w-8 h-8 text-cyan-400" />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-3xl font-bold tracking-tight font-heading text-white mb-2">
                  Forgot Password
                </h1>
                <p className="text-neutral-400 text-base leading-relaxed">
                  Enter your email to receive a reset link<br/>
                  <span className="text-sm text-cyan-400/80">We'll help you get back in</span>
                </p>
              </motion.div>
            </div>
            
                {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl mb-6 text-sm text-center font-medium"
              >
                {message}
              </motion.div>
            )}
            
            {resetLink && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-4 py-3 rounded-xl mb-6 text-sm break-all"
              >
                <strong>Dev Mode:</strong> <a href={resetLink} className="underline hover:text-cyan-300 transition-colors">Click here to reset</a>
              </motion.div>
            )}
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm text-center font-medium"
              >
                {error}
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-200">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400/50 focus:bg-white/8 transition-all duration-200"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 disabled:from-neutral-700 disabled:to-neutral-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] disabled:shadow-none disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </button>
              
              <div className="text-center pt-2">
                <Link 
                  to="/login" 
                  className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors inline-flex items-center gap-1"
                >
                  ← Back to Login
                </Link>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ForgotPassword;

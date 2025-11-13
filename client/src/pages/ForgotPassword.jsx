import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '@/api/axios.config';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setMessage(response.data.message || 'Password reset link sent to your email.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(42, 157, 143, 0.1) 0%, transparent 60%)',
        pointerEvents: 'none'
      }}></div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: 'clamp(2rem, 5vw, 3rem)',
        maxWidth: '450px',
        width: '100%',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        animation: 'fadeIn 0.6s ease-out',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: 'clamp(1.75rem, 5vw, 2rem)',
            fontWeight: '700',
            color: 'white',
            marginBottom: '0.5rem',
            letterSpacing: '-0.5px'
          }}>
            Forgot Password
          </h1>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.6)', 
            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
            fontWeight: '300'
          }}>
            Enter your email to receive a password reset link
          </p>
        </div>
        {message && (
          <div style={{
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.3)',
            color: '#4ade80',
            padding: '0.75rem',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            fontSize: '14px',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            {message}
          </div>
        )}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            padding: '0.75rem',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            fontSize: '14px',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '0.5rem'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.875rem',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                fontSize: '16px',
                color: 'white',
                outline: 'none',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#4dd4c1';
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.background = 'rgba(255, 255, 255, 0.08)';
              }}
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.875rem',
              background: loading ? 'rgba(255, 255, 255, 0.1)' : '#2a9d8f',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '1.5rem',
              transition: 'all 0.2s',
              boxShadow: loading ? 'none' : '0 4px 15px rgba(42, 157, 143, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.background = '#239080';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 6px 20px rgba(42, 157, 143, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.background = '#2a9d8f';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(42, 157, 143, 0.3)';
              }
            }}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
          <div style={{ textAlign: 'center' }}>
            <Link 
              to="/login" 
              style={{ 
                color: '#4dd4c1', 
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#5ee5d2'}
              onMouseLeave={(e) => e.target.style.color = '#4dd4c1'}
            >
              ← Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;

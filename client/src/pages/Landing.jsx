import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoadingAnimation from '../components/LoadingAnimation';

function Landing() {
  console.log('🏠 Landing component rendering - Voice Assistant Version');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [waveHeights] = useState([30, 45, 60, 50, 65, 80, 80, 65, 50, 60, 45, 30]);

  useEffect(() => {
    // No animations needed - keep it minimal and stable
  }, []);

  if (isLoading) {
    return <LoadingAnimation onComplete={() => setIsLoading(false)} />;
  }

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden',
      padding: '2rem 1rem'
    }}>
      {/* Animated Background Gradient */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(42, 157, 143, 0.1) 0%, transparent 60%)',
        pointerEvents: 'none'
      }}></div>

      {/* Keyframe animations */}
      <style>{`
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        @keyframes breathe {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        @keyframes rotateRing {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{ 
        textAlign: 'center', 
        maxWidth: '900px', 
        width: '100%', 
        position: 'relative', 
        zIndex: 1,
        animation: 'fadeIn 0.8s ease-out'
      }}>
        {/* AI Voice Orb */}
        <div style={{ marginBottom: '3rem', position: 'relative' }}>
          <div style={{ 
            position: 'relative',
            width: 'clamp(220px, 45vw, 320px)',
            height: 'clamp(220px, 45vw, 320px)',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Base Glow Layer */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(77, 212, 193, 0.25) 0%, transparent 70%)',
              filter: 'blur(40px)',
              animation: 'breathe 4s ease-in-out infinite'
            }}></div>

            {/* Middle Glow Layer */}
            <div style={{
              position: 'absolute',
              width: '85%',
              height: '85%',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(42, 157, 143, 0.3) 0%, transparent 70%)',
              filter: 'blur(25px)',
              animation: 'breathe 3s ease-in-out infinite'
            }}></div>

            {/* Expanding Wave Rings */}
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '2px solid rgba(77, 212, 193, 0.3)',
                  animation: `ripple 4s ease-out infinite ${i * 1.3}s`
                }}
              ></div>
            ))}

            {/* Main Orb */}
            <div 
              style={{
                position: 'relative',
                width: '60%',
                height: '60%',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2a9d8f 0%, #1e6f65 100%)',
                boxShadow: `
                  inset -15px -15px 30px rgba(0, 0, 0, 0.3),
                  inset 10px 10px 20px rgba(255, 255, 255, 0.1),
                  0 0 50px rgba(77, 212, 193, 0.4)
                `,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 2.5s ease-in-out infinite',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                zIndex: 2
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.08)';
                e.currentTarget.style.boxShadow = `
                  inset -15px -15px 30px rgba(0, 0, 0, 0.3),
                  inset 10px 10px 20px rgba(255, 255, 255, 0.1),
                  0 0 70px rgba(77, 212, 193, 0.6)
                `;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = `
                  inset -15px -15px 30px rgba(0, 0, 0, 0.3),
                  inset 10px 10px 20px rgba(255, 255, 255, 0.1),
                  0 0 50px rgba(77, 212, 193, 0.4)
                `;
              }}
            >
              {/* Inner Shine */}
              <div style={{
                position: 'absolute',
                top: '22%',
                left: '28%',
                width: '35%',
                height: '35%',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.35) 0%, transparent 70%)',
                filter: 'blur(12px)'
              }}></div>

              {/* Microphone Icon */}
              <div style={{
                fontSize: 'clamp(2.5rem, 10vw, 4rem)',
                color: 'white',
                filter: 'drop-shadow(0 2px 10px rgba(0, 0, 0, 0.3))'
              }}>🎤</div>
            </div>

            {/* Rotating Accent Ring */}
            <div style={{
              position: 'absolute',
              width: '75%',
              height: '75%',
              borderRadius: '50%',
              border: '2px solid transparent',
              borderTopColor: 'rgba(77, 212, 193, 0.5)',
              borderRightColor: 'rgba(77, 212, 193, 0.2)',
              animation: 'rotateRing 4s linear infinite'
            }}></div>
          </div>
        </div>

        <h1 style={{ 
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', 
            fontWeight: '700', 
            color: 'white',
            margin: '0 0 1rem 0',
            letterSpacing: '-1px',
            lineHeight: '1.2'
          }}>
            ExpenseVoice
          </h1>
          <p style={{ 
            fontSize: 'clamp(1rem, 3vw, 1.25rem)', 
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '2.5rem',
            fontWeight: '300'
          }}>
            Track expenses with your voice — Powered by AI
          </p>

          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            marginBottom: '3rem'
          }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '0.875rem 2rem',
                fontSize: '1rem',
                fontWeight: '500',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              style={{
                padding: '0.875rem 2rem',
                fontSize: '1rem',
                fontWeight: '500',
                borderRadius: '10px',
                border: 'none',
                background: '#2a9d8f',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#239080';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#2a9d8f';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Get Started →
            </button>
          </div>

        {/* Feature Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: 'clamp(1.5rem, 4vw, 2.5rem)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'white'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', 
            marginBottom: '1rem', 
            fontWeight: '600',
            color: 'white'
          }}>
            Track Expenses with Your Voice
          </h2>
          <p style={{ 
            fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)', 
            lineHeight: '1.7', 
            color: 'rgba(255, 255, 255, 0.75)',
            fontWeight: '300'
          }}>
            Just speak naturally: <span style={{ 
              color: '#4dd4c1', 
              fontWeight: '500'
            }}>"I spent 75 rupees on an Uber to the office"</span> 
            {' '}and our AI will automatically categorize and track your expense.
          </p>
        </div>
      </div>
    </main>
  );
}

export default Landing;
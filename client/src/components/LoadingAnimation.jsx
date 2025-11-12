import { useEffect } from 'react';

function LoadingAnimation({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }

        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2); opacity: 0; }
        }

        @keyframes breathe {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }

        @keyframes rotateRing {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* AI Voice Orb Container */}
      <div style={{ 
        position: 'relative',
        width: 'clamp(200px, 40vw, 280px)',
        height: 'clamp(200px, 40vw, 280px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '3rem'
      }}>
        {/* Base Glow Layer */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(77, 212, 193, 0.3) 0%, transparent 70%)',
          filter: 'blur(30px)',
          animation: 'breathe 3s ease-in-out infinite'
        }}></div>

        {/* Middle Glow Layer */}
        <div style={{
          position: 'absolute',
          width: '85%',
          height: '85%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(42, 157, 143, 0.4) 0%, transparent 70%)',
          filter: 'blur(20px)',
          animation: 'breathe 2s ease-in-out infinite'
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
              border: '2px solid rgba(77, 212, 193, 0.4)',
              animation: `ripple 3s ease-out infinite ${i}s`
            }}
          ></div>
        ))}

        {/* Main Orb */}
        <div style={{
          position: 'relative',
          width: '60%',
          height: '60%',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #2a9d8f 0%, #1e6f65 100%)',
          boxShadow: `
            inset -10px -10px 30px rgba(0, 0, 0, 0.3),
            inset 10px 10px 20px rgba(255, 255, 255, 0.1),
            0 0 40px rgba(77, 212, 193, 0.5)
          `,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pulse 2s ease-in-out infinite',
          zIndex: 2
        }}>
          {/* Inner Shine */}
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '25%',
            width: '35%',
            height: '35%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%)',
            filter: 'blur(10px)'
          }}></div>

          {/* Microphone Icon */}
          <div style={{
            fontSize: 'clamp(2rem, 8vw, 3rem)',
            color: 'white',
            filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))'
          }}>🎤</div>
        </div>

        {/* Rotating Accent Ring */}
        <div style={{
          position: 'absolute',
          width: '75%',
          height: '75%',
          borderRadius: '50%',
          border: '2px solid transparent',
          borderTopColor: 'rgba(77, 212, 193, 0.6)',
          borderRightColor: 'rgba(77, 212, 193, 0.3)',
          animation: 'rotateRing 3s linear infinite'
        }}></div>
      </div>

      {/* Text Content */}
      <h1 style={{
        fontSize: 'clamp(2rem, 6vw, 3.5rem)',
        fontWeight: '700',
        color: 'white',
        marginBottom: '0.5rem',
        letterSpacing: '-1px',
        animation: 'fadeIn 0.6s ease-out'
      }}>
        ExpenseVoice
      </h1>

      <p style={{
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
        fontWeight: '300',
        animation: 'fadeIn 0.6s ease-out 0.2s backwards'
      }}>
        Initializing AI Voice Assistant...
      </p>
    </div>
  );
}

export default LoadingAnimation;

import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '2rem',
      color: 'white'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '3rem',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          padding: '1.5rem 2rem',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div>
            <h1 style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: '700',
              margin: '0 0 0.5rem 0',
              letterSpacing: '-0.5px'
            }}>
              Welcome back, {user?.name || 'User'}! 👋
            </h1>
            <p style={{
              color: 'rgba(255, 255, 255, 0.6)',
              margin: 0,
              fontSize: '0.95rem'
            }}>
              {user?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              color: '#fca5a5',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(239, 68, 68, 0.3)';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(239, 68, 68, 0.2)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Logout
          </button>
        </div>

        {/* Dashboard Content */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: 'clamp(2rem, 5vw, 3rem)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '4rem',
            marginBottom: '1.5rem'
          }}>🎉</div>
          
          <h2 style={{
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
            fontWeight: '700',
            marginBottom: '1rem',
            color: '#4dd4c1'
          }}>
            Authentication Complete!
          </h2>
          
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            You're now logged in. The dashboard with voice expense tracking will be built next!
          </p>

          <div style={{
            background: 'rgba(77, 212, 193, 0.1)',
            border: '1px solid rgba(77, 212, 193, 0.3)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginTop: '2rem'
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              marginBottom: '0.75rem',
              color: '#4dd4c1'
            }}>
              🔐 Authentication Working!
            </h3>
            <p style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '0.95rem',
              margin: 0
            }}>
              Your credentials are securely stored. JWT token is being used for API authentication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

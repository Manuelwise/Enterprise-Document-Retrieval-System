import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/enterprise-theme.css';

// Check if dark mode is preferred
const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

// Set theme based on preference
const setTheme = (isDark) => {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
};

// Initial theme setup
setTheme(prefersDarkMode);

const ROLE_OPTIONS = [
  { value: 'approval_officer', label: 'Approval Officer' },
  { value: 'dispatch_officer', label: 'Dispatch Officer' }
];

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ 
    email: '', 
    password: '', 
    role: 'approval_officer' 
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { success, user, error: loginError } = await login(credentials);
      
      if (success && user) {
        // Redirect based on role
        const redirectPath = user.role === 'approval_officer' 
          ? '/admin/dashboard' 
          : '/user/dashboard';
        navigate(redirectPath);
      } else {
        setError(loginError || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add animated background shapes
  useEffect(() => {
    const container = document.querySelector('.login-bg');
    if (!container) return;

    // Clear existing shapes
    container.innerHTML = '';

    // Add animated shapes
    const shapes = [
      { size: 300, color: 'var(--shape-1)', top: '10%', left: '10%', animation: 'float 25s ease-in-out infinite' },
      { size: 400, color: 'var(--shape-2)', bottom: '10%', right: '10%', animation: 'float 30s ease-in-out infinite reverse' },
      { size: 200, color: 'var(--shape-3)', top: '50%', left: '50%', animation: 'float 20s ease-in-out infinite' },
    ];

    shapes.forEach((shape, i) => {
      const el = document.createElement('div');
      el.className = 'shape';
      Object.assign(el.style, {
        width: `${shape.size}px`,
        height: `${shape.size}px`,
        background: shape.color,
        position: 'absolute',
        top: shape.top,
        left: shape.left,
        right: shape.right,
        bottom: shape.bottom,
        transform: shape.transform,
        animation: shape.animation,
        animationDelay: `${i * 2}s`,
        borderRadius: '50%',
        filter: 'blur(60px)',
        opacity: 0.3,
      });
      container.appendChild(el);
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="login-bg absolute inset-0 -z-10"></div>
      
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-teal-400 bg-clip-text text-transparent">
              Enterprise Document Retrieval
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
              Streamline your workflow with our powerful document retrieval system. 
              Designed for enterprise teams to manage requests and approvals efficiently.
            </p>
            <div className="hidden lg:block space-y-4">
              <div className="flex items-center space-x-4 p-4 surface backdrop-blur-sm rounded-lg shadow-sm">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div>
                  <h3 className="font-medium">Secure Access</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-400">Enterprise-grade security</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 surface backdrop-blur-sm rounded-lg shadow-sm">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <div>
                  <h3 className="font-medium">Real-time Updates</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-400">Stay in sync with your team</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="login-card p-8 w-full max-w-md">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">
                  Welcome Back
                </h2>
                <p className="text-gray-500 dark:text-gray-400">Sign in to your account</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
               <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                  <div className="pl-3 pr-2 py-2 text-gray-400">
                    <svg 
                      className="h-5 w-5" 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    className="flex-1 px-3 py-2 border-0 focus:ring-0 focus:outline-none dark:bg-gray-700 dark:text-white"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Role
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {ROLE_OPTIONS.map((option) => (
                      <div 
                        key={option.value}
                        className={`role-card ${credentials.role === option.value ? 'selected' : ''}`}
                        onClick={() => setCredentials({ ...credentials, role: option.value })}
                      >
                        <div className="flex items-center mb-2">
                          <div className={`w-5 h-5 rounded-full border-2 mr-3 flex-shrink-0 flex items-center justify-center ${
                            credentials.role === option.value 
                              ? 'border-blue-500 bg-blue-500' 
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {credentials.role === option.value && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="font-medium text-black dark:text-white">{option.label}</span>
                        </div>
                        <p className="text-sm text-black dark:text-gray-400 ml-8">
                          {option.value === 'approval_officer' 
                            ? 'Review and approve sample requests' 
                            : 'Manage sample dispatching and tracking'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                    <div className="pl-3 pr-2 py-2 text-gray-400">
                      <svg 
                        className="h-5 w-5" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                      className="flex-1 px-3 py-2 border-0 focus:ring-0 focus:outline-none dark:bg-gray-700 dark:text-white"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="error-message">
                    <svg className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      Sign in to your account
                    </>
                  )}
                </button>
                
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 surface text-gray-500 dark:text-gray-400">
                        Need help?
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 text-center text-sm">
                    <Link to="/contact-support" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                      Contact support
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Enterprise Sample Management. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import NotificationBell from '../components/NotificationBell';
import axios from 'axios';

const Navbar = () => {
    const { isAuthenticated, logout, username, token, } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const dropdownRef = useRef(null);
    const bellRef = useRef(null);
    const adminButtonRef = useRef(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [hasShadow, setHasShadow] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);


    useEffect(() => {
        const fetchNotifications = async () => {
            if (!isAuthenticated) return; // Only fetch if authenticated
            setLoading(true); // Start loading
            try {
                const response = await axios.get('http://localhost:5000/api/notifications/unread', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (Array.isArray(response.data.data)) {
                    setNotifications(response.data.data); // Set notifications to the data array
                } else {
                    console.error('Expected an array but received:', response.data.data);
                    setNotifications([]); // Handle unexpected response
                }
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
                setNotifications([]); // Handle error case
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchNotifications();
    }, [isAuthenticated, token]); // Keep this dependency

    // if (loading) return <p>Loading notifications...</p>;
    // if (error) return <p className="text-red-500">{error}</p>;

     // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
        if (
            dropdownRef.current && !dropdownRef.current.contains(event.target) &&
            bellRef.current && !bellRef.current.contains(event.target) &&
            adminButtonRef.current && !adminButtonRef.current.contains(event.target)
        ) {
            setDropdownOpen(false);
            setNotifDropdownOpen(false); // Close notification dropdown as well
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

  // Add shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setHasShadow(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });


    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-shadow duration-300 ${hasShadow ? 'shadow-lg' : ''}`}
            style={{ background: 'var(--nav-bg)', color: 'var(--nav-text)' }}
        >
            <div className="container mx-auto px-2">
                <div className="flex justify-between items-center h-16">
                    {/* Left Side - Logo and Links */}
                    <div className="flex items-center space-x-6">
                        <Link to="/" className="flex items-center space-x-3">
                            {/* Inline modern minimal SVG logo */}
                            <svg width="44" height="44" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                <rect width="48" height="48" rx="10" fill="url(#g)" />
                                <path d="M14 33L24 15L34 33H14Z" fill="white" opacity="0.95" />
                                <defs>
                                    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#6C5CE7" />
                                        <stop offset="100%" stopColor="#00BFA6" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <span className="text-lg font-semibold ml-1" style={{ color: 'var(--nav-text)' }}>Enterprise </span>
                        </Link>
                        <div className="hidden md:flex space-x-4">
                            <Link to="/" className={`px-3 py-2 rounded-md ${location.pathname === '/' ? 'nav-link-active' : 'hover:bg-white/5'}`}>
                                Home
                            </Link>
                            {isAuthenticated && (
                                <Link 
                                    to={username === 'approval_officer' ? '/admin/dashboard' : '/user/dashboard'}
                                    className={`px-3 py-2 rounded-md ${location.pathname.includes('dashboard') ? 'nav-link-active' : 'hover:bg-white/5'}`}
                                >
                                    Dashboard
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Right Side - Time, Notifications, User Dropdown */}
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-semibold" style={{ color: 'var(--nav-text)' }}>{formattedTime}</span>

                        <button 
                            onClick={toggleTheme}
                            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                            className="p-2 rounded-md hover:opacity-90 transition-colors duration-200"
                            style={{ color: 'var(--nav-text)' }}
                            aria-label={`Toggle ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        >
                            {theme === 'dark' ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
                        </button>
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-3 cursor-pointer">     
                                {/* Notification Bell - Show count of pending requests */}
                                <div ref={bellRef}>
                                    <NotificationBell 
                                        notificationCount={notifications.filter(n => !n.isRead).length} 
                                        notifications={notifications} 
                                        setNotifications={setNotifications}
                                        isOpen={notifDropdownOpen}
                                        setIsOpen={setNotifDropdownOpen}
                                    />
                                </div>

                                {/* User Dropdown */}
                                <div className="relative" ref={dropdownRef}>
                                    <div 
                                        className="flex items-center space-x-2 cursor-pointer" 
                                        onClick={() => setDropdownOpen(!dropdownOpen)} 
                                        ref={adminButtonRef}
                                        style={{ color: 'var(--nav-text)' }}
                                    >
                                        <FaUserCircle size={22} />
                                        <span className="capitalize">{username || 'User'}</span>
                                    </div>
                                    {dropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white/5 backdrop-blur-sm text-white rounded-md shadow-lg z-50 surface">
                                            <Link to="/admin/new-user" className="block px-4 py-2 hover:bg-white/5">
                                                Add New User
                                            </Link>
                                            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-white/5">
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <Link to="/admin/login" className="btn btn-ghost">
                                Admin Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
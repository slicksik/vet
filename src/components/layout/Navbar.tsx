import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Stethoscope, User, ChevronDown, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const { bookings } = useData();
    const navigate = useNavigate();
    const location = useLocation();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
        navigate('/');
    };

    // Calculate pending bookings count for vets
    const pendingBookingsCount = user?.role === 'vet'
        ? bookings.filter(b => b.vetId === user?.id && b.status === 'pending').length
        : 0;

    const isHome = location.pathname === '/';

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || !isHome
                ? 'bg-white/90 backdrop-blur-lg shadow-sm border-b border-gray-100 py-2'
                : 'bg-transparent py-4'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-12">
                        {/* Logo */}
                        <Link to="/" className="flex items-center group gap-3">
                            <div className={`
                                p-2.5 rounded-2xl transition-all duration-300
                                ${isScrolled || !isHome
                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                                    : 'bg-white text-primary-600 shadow-md'
                                }
                            `}>
                                <Stethoscope className="h-6 w-6" />
                            </div>
                            <span className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${isScrolled || !isHome ? 'text-gray-900' : 'text-gray-900' // Keeping text dark for readability on hero
                                }`}>
                                Vetify
                            </span>
                        </Link>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-1">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'Find Vets', path: '/search' },
                                { name: 'For Vets', path: '/for-vets' },
                            ].map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`
                                        px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                                        ${location.pathname === link.path
                                            ? 'bg-primary-50 text-primary-700'
                                            : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                                        }
                                    `}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-6">
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full border border-gray-200 bg-white hover:border-primary-200 hover:shadow-md transition-all duration-200 group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{user.name}</span>
                                        {pendingBookingsCount > 0 && (
                                            <span className="flex h-2.5 w-2.5">
                                                <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                                            </span>
                                        )}
                                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-fade-in-up origin-top-right overflow-hidden">
                                            <div className="px-5 py-3 border-b border-gray-50 bg-gray-50/50">
                                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Signed in as</p>
                                                <p className="text-sm font-medium text-gray-900 truncate mt-0.5">{user.email}</p>
                                            </div>

                                            <div className="p-2">
                                                {user.role === 'vet' && (
                                                    <Link
                                                        to="/dashboard"
                                                        className="flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 rounded-xl hover:bg-primary-50 hover:text-primary-700 transition-colors"
                                                        onClick={() => setIsProfileOpen(false)}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <Stethoscope className="w-4 h-4" />
                                                            Dashboard
                                                        </div>
                                                        {pendingBookingsCount > 0 && (
                                                            <span className="bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs font-medium">
                                                                {pendingBookingsCount}
                                                            </span>
                                                        )}
                                                    </Link>
                                                )}

                                                <Link
                                                    to={user.role === 'vet' ? '/dashboard' : '/profile'}
                                                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 rounded-xl hover:bg-primary-50 hover:text-primary-700 transition-colors"
                                                    onClick={() => setIsProfileOpen(false)}
                                                >
                                                    <User className="w-4 h-4" />
                                                    Your Profile
                                                </Link>

                                                {user.role === 'vet' && (
                                                    <Link
                                                        to="/subscription"
                                                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 rounded-xl hover:bg-primary-50 hover:text-primary-700 transition-colors"
                                                        onClick={() => setIsProfileOpen(false)}
                                                    >
                                                        <Shield className="w-4 h-4" />
                                                        Manage Subscription
                                                    </Link>
                                                )}
                                            </div>

                                            <div className="border-t border-gray-50 p-2">
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                                                >
                                                    Sign out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/login"
                                    className="px-5 py-2.5 text-gray-600 hover:text-primary-600 font-medium text-sm transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-primary-600 shadow-lg hover:shadow-primary-500/30 transition-all hover:-translate-y-0.5"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

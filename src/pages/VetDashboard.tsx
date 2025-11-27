import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';

import { Calendar, Clock, User, Shield, CheckCircle, XCircle } from 'lucide-react';
import AvailabilityCalendar from '../components/features/AvailabilityCalendar';
import WorkingHoursSettings from '../components/features/WorkingHoursSettings';
import VetProfileSettings from '../components/features/VetProfileSettings';

const VetDashboard: React.FC = () => {
    const { user, isVet, loading } = useAuth();
    const { bookings, updateBookingStatus } = useData();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'bookings' | 'schedule' | 'hours' | 'profile'>('bookings');
    const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed'>('all');

    React.useEffect(() => {
        if (loading) return;

        if (!user) {
            navigate('/login');
            return;
        }

        if (!isVet) {
            // Don't redirect, let the Access Denied UI show
            return;
        }

    }, [user, isVet, loading, navigate]);

    // Subscription check removed to allow unsubscribed access


    console.log('VetDashboard render state:', { loading, user, isVet });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!user || !isVet) {
        console.warn('VetDashboard access denied:', { user, isVet });
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-200">
                    <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-600 mb-6">You must be logged in as a veterinarian to view this dashboard.</p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Go Home
                        </button>
                    </div>
                    <div className="mt-6 text-left bg-gray-50 p-4 rounded-lg text-xs font-mono text-gray-500 overflow-auto max-w-md">
                        <p>Debug Info:</p>
                        <p>User ID: {user?.id || 'None'}</p>
                        <p>Role: {user?.role || 'None'}</p>
                        <p>Is Vet: {isVet ? 'Yes' : 'No'}</p>
                    </div>
                </div>
            </div>
        );
    }

    const filteredBookings = bookings.filter(b => {
        if (b.vetId !== user.id) return false;
        if (filter === 'all') return true;
        return b.status === filter;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Vet Dashboard</h1>
                        <p className="text-gray-500 mt-2">Welcome back, {user.name}</p>
                    </div>
                    <div className="flex items-center px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-800 rounded-full text-white shadow-lg shadow-primary-500/30">
                        <Shield className="w-5 h-5 mr-2" />
                        <span className="font-medium">Pro Plan Active</span>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Pending Requests</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">
                                    {bookings.filter(b => b.vetId === user.id && b.status === 'pending').length}
                                </p>
                            </div>
                            <div className="p-3 bg-primary-50 rounded-xl">
                                <Clock className="w-6 h-6 text-primary-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Confirmed Bookings</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">
                                    {bookings.filter(b => b.vetId === user.id && b.status === 'confirmed').length}
                                </p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-xl">
                                <Calendar className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Patients</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">
                                    {bookings.filter(b => b.status === 'confirmed').length}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-xl">
                                <User className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-8 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('bookings')}
                            className={`${activeTab === 'bookings'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                        >
                            <Calendar className="w-5 h-5 mr-2" />
                            Appointments
                        </button>
                        <button
                            onClick={() => setActiveTab('schedule')}
                            className={`${activeTab === 'schedule'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                        >
                            <Clock className="w-5 h-5 mr-2" />
                            Schedule View
                        </button>
                        <button
                            onClick={() => setActiveTab('hours')}
                            className={`${activeTab === 'hours'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                        >
                            <Clock className="w-5 h-5 mr-2" />
                            Working Hours
                        </button>
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`${activeTab === 'profile'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                        >
                            <User className="w-5 h-5 mr-2" />
                            Profile
                        </button>
                    </nav>
                </div>

                {activeTab === 'bookings' && (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Appointment Requests
                            </h3>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`px-3 py-1 rounded-md text-sm ${filter === 'all' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setFilter('pending')}
                                    className={`px-3 py-1 rounded-md text-sm ${filter === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    Pending
                                </button>
                                <button
                                    onClick={() => setFilter('confirmed')}
                                    className={`px-3 py-1 rounded-md text-sm ${filter === 'confirmed' ? 'bg-green-100 text-green-800' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    Confirmed
                                </button>
                            </div>
                        </div>
                        <ul className="divide-y divide-gray-200">
                            {filteredBookings.length === 0 ? (
                                <li className="px-4 py-8 text-center text-gray-500">
                                    No bookings found.
                                </li>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <li key={booking.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-sm font-medium text-primary-600 truncate">
                                                        {booking.petName} ({booking.service})
                                                    </p>
                                                    <div className="ml-2 flex-shrink-0 flex">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                            ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                    booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                                        'bg-gray-100 text-gray-800'}`}>
                                                            {booking.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="mt-2 sm:flex sm:justify-between">
                                                    <div className="sm:flex">
                                                        <p className="flex items-center text-sm text-gray-500">
                                                            <UserIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                            {booking.userName}
                                                        </p>
                                                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                                            <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                            {booking.date} at {booking.time}
                                                        </p>
                                                    </div>
                                                </div>
                                                {booking.notes && (
                                                    <p className="mt-2 text-sm text-gray-500 italic">
                                                        "{booking.notes}"
                                                    </p>
                                                )}
                                            </div>
                                            {booking.status === 'pending' && (
                                                <div className="ml-4 flex-shrink-0 flex space-x-2">
                                                    <button
                                                        onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-1" />
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => updateBookingStatus(booking.id, 'rejected')}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                    >
                                                        <XCircle className="w-4 h-4 mr-1" />
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                )}

                {activeTab === 'schedule' && (
                    <div className="space-y-6">
                        <AvailabilityCalendar />
                    </div>
                )}

                {activeTab === 'hours' && (
                    <div className="space-y-6">
                        <WorkingHoursSettings />
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="space-y-6">
                        <VetProfileSettings />
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper component for icon
const UserIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

export default VetDashboard;

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Calendar, Star, Clock, User as UserIcon } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const UserProfile: React.FC = () => {
    const { user, isAuthenticated, isVet, isAdmin } = useAuth();
    const { bookings, reviews, vets } = useData();

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" />;
    }

    // Redirect vets and admins to their respective dashboards
    if (isVet) return <Navigate to="/dashboard" />;
    if (isAdmin) return <Navigate to="/admin" />;

    const userBookings = bookings
        .filter(b => b.userId === user.id)
        .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());

    const userReviews = reviews
        .filter(r => r.userId === user.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const upcomingBookings = userBookings.filter(b => {
        const bookingDate = new Date(`${b.date}T${b.time}`);
        return bookingDate >= new Date();
    });

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-gray-500 mt-2">Manage your appointments and reviews</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: User Info & Stats */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="bg-primary-100 p-3 rounded-full">
                                    <UserIcon className="w-8 h-8 text-primary-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                                    <p className="text-gray-500 text-sm">{user.email}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">{userBookings.length}</p>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Bookings</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">{userReviews.length}</p>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Reviews</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Bookings & Reviews */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Upcoming Bookings */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                                    <Calendar className="w-5 h-5 mr-2 text-primary-600" />
                                    Upcoming Appointments
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {upcomingBookings.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                        No upcoming appointments scheduled.
                                    </div>
                                ) : (
                                    upcomingBookings.map(booking => {
                                        const vet = vets.find(v => v.id === booking.vetId);
                                        return (
                                            <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900">{vet?.name}</h3>
                                                        <p className="text-gray-500 text-sm mb-2">{vet?.clinicName}</p>
                                                        <div className="flex items-center text-sm text-gray-600 space-x-4">
                                                            <span className="flex items-center">
                                                                <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                                                                {booking.date}
                                                            </span>
                                                            <span className="flex items-center">
                                                                <Clock className="w-4 h-4 mr-1 text-gray-400" />
                                                                {booking.time}
                                                            </span>
                                                        </div>
                                                        <div className="mt-2 text-sm text-gray-600">
                                                            <span className="font-medium">Service:</span> {booking.service} • <span className="font-medium">Pet:</span> {booking.petName}
                                                        </div>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                                                        ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'}`}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Past Reviews */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                                    <Star className="w-5 h-5 mr-2 text-yellow-500" />
                                    My Reviews
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {userReviews.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                        You haven't left any reviews yet.
                                    </div>
                                ) : (
                                    userReviews.map(review => {
                                        const vet = vets.find(v => v.id === review.vetId);
                                        return (
                                            <div key={review.id} className="p-6 hover:bg-gray-50 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">Review for {vet?.name}</h3>
                                                        <p className="text-xs text-gray-500">{review.date}</p>
                                                    </div>
                                                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                                                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                                        <span className="font-bold text-yellow-700">{review.rating}</span>
                                                    </div>
                                                </div>
                                                {review.comment && (
                                                    <p className="text-gray-600 text-sm italic">"{review.comment}"</p>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;

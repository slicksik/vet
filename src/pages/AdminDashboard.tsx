import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Users, Stethoscope, Calendar, Trash2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
    const { user, isAdmin } = useAuth();
    const { vets, bookings, deleteVet } = useData();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    React.useEffect(() => {
        if (!user || !isAdmin) {
            navigate('/login');
        }
    }, [user, isAdmin, navigate]);

    if (!user || !isAdmin) {
        return null;
    }

    const handleDeleteVet = (vetId: string) => {
        if (window.confirm('Are you sure you want to delete this vet?')) {
            deleteVet(vetId);
        }
    };

    const filteredVets = vets.filter(vet =>
        vet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vet.clinicName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
                    <p className="text-gray-500 mt-2">Platform Overview & Management</p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Vets</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{vets.length}</p>
                            </div>
                            <div className="p-3 bg-primary-50 rounded-xl">
                                <Stethoscope className="w-6 h-6 text-primary-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{bookings.length}</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-xl">
                                <Calendar className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Users</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">1,234</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-xl">
                                <Users className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Vets Management */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <h2 className="text-lg font-bold text-gray-900">Registered Veterinarians</h2>
                            <div className="relative w-full sm:w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    placeholder="Search vets..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Vet / Clinic
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Location
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Rating
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredVets.map((vet) => (
                                        <tr key={vet.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img className="h-10 w-10 rounded-full object-cover" src={vet.image} alt="" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{vet.name}</div>
                                                        <div className="text-sm text-gray-500">{vet.clinicName}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 max-w-xs truncate">{vet.address}</div>
                                                <div className="text-sm text-gray-500">{vet.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    {vet.rating} ({vet.reviews})
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleDeleteVet(vet.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Latest Bookings Stream */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[600px]">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-bold text-gray-900">Latest Bookings</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {bookings.length === 0 ? (
                                <p className="text-center text-gray-500 py-4">No bookings yet.</p>
                            ) : (
                                [...bookings].reverse().map((booking) => {
                                    const vet = vets.find(v => v.id === booking.vetId);
                                    return (
                                        <div key={booking.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize
                                                    ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                    ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                                                    ${booking.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                                                `}>
                                                    {booking.status}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'Just now'}
                                                </span>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {booking.userName} <span className="text-gray-400">booked</span> {vet?.name || 'Unknown Vet'}
                                                </p>
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {booking.date} at {booking.time}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Service: {booking.service} • Pet: {booking.petName}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

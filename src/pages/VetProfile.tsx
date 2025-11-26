import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Star, MapPin, Phone, Mail, Globe, Clock, ShieldCheck } from 'lucide-react';
import Map from '../components/features/Map';
import BookingModal from '../components/features/BookingModal';

const VetProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { vets } = useData();
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    const vet = vets.find(v => v.id === id);

    if (!vet) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Vet not found</h2>
                    <button
                        onClick={() => navigate('/search')}
                        className="mt-4 text-primary-600 hover:underline"
                    >
                        Back to Search
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header Image */}
            <div className="h-72 md:h-96 w-full relative">
                <img
                    src={vet.image}
                    alt={vet.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">{vet.name}</h1>
                    <p className="text-xl text-primary-100 font-medium">{vet.clinicName}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Overview Card */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <Star className="w-6 h-6 text-yellow-400 fill-current" />
                                    <span className="ml-2 text-2xl font-bold text-gray-900">{vet.rating}</span>
                                    <span className="ml-2 text-gray-500">({vet.reviews} reviews)</span>
                                </div>
                                <div className="flex gap-2">
                                    {vet.services.map((service) => (
                                        <span
                                            key={service}
                                            className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                                        >
                                            {service}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                {vet.description}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                                    <div>
                                        <h3 className="font-medium text-gray-900">Location</h3>
                                        <p className="text-gray-500">{vet.address}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Clock className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                                    <div>
                                        <h3 className="font-medium text-gray-900">Hours</h3>
                                        <p className="text-gray-500">Mon-Fri: 9:00 AM - 6:00 PM</p>
                                        <p className="text-gray-500">Sat: 10:00 AM - 4:00 PM</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <ShieldCheck className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                                    <div>
                                        <h3 className="font-medium text-gray-900">Credentials</h3>
                                        <p className="text-gray-500">Board Certified Veterinarian</p>
                                        <p className="text-gray-500">10+ Years Experience</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map Card */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 h-96 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
                            <div className="h-full rounded-lg overflow-hidden">
                                <Map vets={[vet]} center={[vet.latitude, vet.longitude]} />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Info</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <Phone className="w-5 h-5 text-primary-600 mr-3" />
                                    <span className="text-gray-700 font-medium">{vet.phone}</span>
                                </div>
                                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <Mail className="w-5 h-5 text-primary-600 mr-3" />
                                    <span className="text-gray-700 font-medium">{vet.email}</span>
                                </div>
                                {vet.website && (
                                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                        <Globe className="w-5 h-5 text-primary-600 mr-3" />
                                        <a
                                            href={vet.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary-600 hover:underline font-medium"
                                        >
                                            Visit Website
                                        </a>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setIsBookingModalOpen(true)}
                                className="w-full bg-gradient-to-r from-primary-600 to-primary-800 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-primary-500/30 transition-all transform hover:-translate-y-0.5"
                            >
                                Book Appointment
                            </button>
                            <p className="text-center text-xs text-gray-500 mt-3">
                                No payment required to book
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <BookingModal
                vet={vet}
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
            />
        </div>
    );
};

export default VetProfile;

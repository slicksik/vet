import React from 'react';
import { Star, MapPin, Phone } from 'lucide-react';
import type { Vet } from '../../types';
import { Link } from 'react-router-dom';

interface VetCardProps {
    vet: Vet;
    distance?: number;
}

const VetCard: React.FC<VetCardProps> = ({ vet, distance }) => {
    return (
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1">
            <div className="flex flex-col sm:flex-row">
                <div className="sm:w-48 h-48 sm:h-auto relative overflow-hidden">
                    <img
                        src={vet.image}
                        alt={vet.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{vet.name}</h3>
                                <p className="text-primary-600 font-medium">{vet.clinicName}</p>
                            </div>
                            <div className="flex items-center bg-yellow-50 px-2.5 py-1 rounded-lg border border-yellow-100">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="ml-1.5 font-bold text-gray-900">{vet.rating}</span>
                                <span className="ml-1 text-xs text-gray-500">({vet.reviews})</span>
                            </div>
                        </div>

                        {distance !== undefined && (
                            <p className="text-sm text-primary-600 font-medium mt-1">
                                {distance.toFixed(1)} km away
                            </p>
                        )}

                        <div className="mt-4 space-y-2">
                            <div className="flex items-center text-gray-500 text-sm">
                                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                                {vet.address}
                            </div>
                            <div className="flex items-center text-gray-500 text-sm">
                                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                                {vet.phone}
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {vet.services.slice(0, 3).map((service, index) => (
                                <span
                                    key={index}
                                    className="px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full border border-primary-100"
                                >
                                    {service}
                                </span>
                            ))}
                            {vet.services.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                    +{vet.services.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                        <Link
                            to={`/vet/${vet.id}`}
                            className="flex-1 bg-gray-900 text-white text-center py-2.5 rounded-xl font-medium hover:bg-primary-600 transition-colors shadow-lg shadow-gray-200 hover:shadow-primary-500/30"
                        >
                            Book Appointment
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VetCard;

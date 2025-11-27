import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { calculateDistance, searchLocation } from '../utils/geolocation';
import { Search as SearchIcon, Map as MapIcon, List } from 'lucide-react';
import { useData } from '../context/DataContext';
import VetCard from '../components/features/VetCard';
import Map from '../components/features/Map';

const SearchPage: React.FC = () => {
    const [view, setView] = useState<'list' | 'map'>('list');
    const [searchTerm, setSearchTerm] = useState('');
    const { vets } = useData();
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [isSearchingLocation, setIsSearchingLocation] = useState(false);

    const [searchParams] = useSearchParams();

    useEffect(() => {
        const latParam = searchParams.get('lat');
        const lngParam = searchParams.get('lng');
        const qParam = searchParams.get('q');

        if (latParam && lngParam) {
            const newLat = parseFloat(latParam);
            const newLng = parseFloat(lngParam);

            // Only update if different
            if (!userLocation || userLocation.latitude !== newLat || userLocation.longitude !== newLng) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setUserLocation({ latitude: newLat, longitude: newLng });
            }
        } else if (qParam) {
            // Try to geocode the query
            setIsSearchingLocation(true);
            searchLocation(qParam)
                .then(coords => {
                    setUserLocation(coords);
                    setSearchTerm(''); // Clear text filter if location found
                })
                .catch(() => {
                    // Fallback to text search if location not found
                    setSearchTerm(qParam);
                    setUserLocation(null);
                })
                .finally(() => {
                    setIsSearchingLocation(false);
                });
        }
    }, [searchParams, userLocation]);

    // Filter and sort vets based on search term and user location
    const processedVets = useMemo(() => {
        let filtered = vets;

        // If we have a search term, filter by it
        if (searchTerm) {
            filtered = vets.filter(vet =>
                vet.isSubscribed && (
                    vet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    vet.clinicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    vet.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    vet.services.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
                )
            );
        } else {
            // Even without search term, only show subscribed vets
            filtered = vets.filter(vet => vet.isSubscribed);
        }

        // Calculate distances and sort
        return filtered
            .map(vet => ({
                ...vet,
                distance: userLocation
                    ? calculateDistance(userLocation.latitude, userLocation.longitude, vet.latitude, vet.longitude)
                    : undefined
            }))
            .sort((a, b) => {
                if (a.distance === undefined && b.distance === undefined) return 0;
                if (a.distance === undefined) return 1;
                if (b.distance === undefined) return -1;
                return a.distance - b.distance;
            });
    }, [searchTerm, userLocation, vets]);

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
                        {isSearchingLocation ? 'Searching Location...' : 'Find a Veterinarian'}
                    </h1>

                    <div className="flex w-full md:w-auto gap-4">
                        <div className="relative flex-1 md:w-80 group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 sm:text-sm transition-all shadow-sm"
                                placeholder="Search vets, clinics..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex bg-white rounded-xl shadow-sm p-1 border border-gray-200">
                            <button
                                onClick={() => setView('list')}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${view === 'list'
                                    ? 'bg-primary-50 text-primary-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setView('map')}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${view === 'map'
                                    ? 'bg-primary-50 text-primary-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <MapIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-200px)]">
                    {/* List View */}
                    <div className={`flex-1 overflow-y-auto ${view === 'map' ? 'hidden lg:block lg:w-1/3' : 'w-full'}`}>
                        <div className="space-y-6">
                            {processedVets.map(vet => (
                                <VetCard key={vet.id} vet={vet} distance={vet.distance} />
                            ))}
                            {processedVets.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">No veterinarians found matching your search.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Map View */}
                    <div className={`flex-1 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${view === 'list' ? 'hidden lg:block lg:w-2/3' : 'w-full h-full'}`}>
                        <Map
                            vets={processedVets}
                            center={userLocation ? [userLocation.latitude, userLocation.longitude] : undefined}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;

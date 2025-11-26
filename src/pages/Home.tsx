import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Navigation, Star, ShieldCheck } from 'lucide-react';
import { getCurrentPosition } from '../utils/geolocation';
import Testimonials from '../components/features/Testimonials';

const Home: React.FC = () => {
    const [location, setLocation] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchTerm.trim()) params.append('q', searchTerm);
        if (location.trim()) params.append('location', location);

        if (params.toString()) {
            navigate(`/search?${params.toString()}`);
        } else {
            navigate('/search');
        }
        setIsSearchFocused(false);
    };

    const handlePopularSearch = (term: string) => {
        setSearchTerm(term);
        // Optional: Auto-search or just fill? Let's just fill and keep focus or search.
        // Better UX: Fill and search immediately if location is empty or keep it.
        // Let's just navigate immediately for popular searches as they are usually "intent"
        navigate(`/search?q=${encodeURIComponent(term)}&location=${encodeURIComponent(location)}`);
        setIsSearchFocused(false);
    };

    const handleUseLocation = async () => {
        try {
            const coords = await getCurrentPosition();
            // We could reverse geocode here, but for now let's pass lat/lng
            // And also update the location input visually if possible, or just navigate
            navigate(`/search?lat=${coords.latitude}&lng=${coords.longitude}&q=${encodeURIComponent(searchTerm)}`);
            setIsSearchFocused(false);
        } catch (error) {
            console.error('Error getting location:', error);
            const message = error instanceof Error ? error.message : 'Could not access your location.';
            alert(message);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Dark Overlay when search is focused */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${isSearchFocused ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsSearchFocused(false)}
            />

            {/* Hero Section */}
            <div className="relative bg-white overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-100 opacity-70" />
                    <div className="absolute right-0 top-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-primary-100 rounded-full blur-3xl opacity-30 animate-pulse" />
                    <div className="absolute left-0 bottom-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-primary-200 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <div className="max-w-7xl mx-auto">
                    <div className={`relative pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-20 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isSearchFocused ? 'z-50' : 'z-10'}`}>
                        <main className="mt-10 mx-auto max-w-7xl sm:mt-12 md:mt-16 lg:mt-20 xl:mt-28">
                            <div className="sm:text-center lg:text-left animate-fade-in-up relative z-50">
                                <div className={`transition-opacity duration-300 ${isSearchFocused ? 'opacity-20 blur-sm' : 'opacity-100'}`}>
                                    <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl mb-6">
                                        <span className="block xl:inline">Find the best care</span>{' '}
                                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700 xl:inline">for your best friend</span>
                                    </h1>
                                    <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 leading-relaxed">
                                        Connect with top-rated veterinarians in your area. Book appointments instantly and manage your pet's health with ease.
                                    </p>
                                </div>

                                <div className="mt-8 sm:mt-12 relative">
                                    <form onSubmit={handleSearch} className="relative z-50">
                                        <div className="flex shadow-lg rounded-full overflow-hidden p-1 bg-white border border-gray-100">
                                            <div className="flex-1 relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Search className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    className="block w-full pl-11 pr-4 py-3 border-none focus:ring-0 text-gray-900 placeholder-gray-500 bg-transparent"
                                                    placeholder="What does your pet need?"
                                                    onFocus={() => setIsSearchFocused(true)}
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                            </div>
                                            <div className="w-px bg-gray-200 my-2"></div>
                                            <div className="flex-1 relative hidden sm:block">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <MapPin className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    className="block w-full pl-11 pr-4 py-3 border-none focus:ring-0 text-gray-900 placeholder-gray-500 bg-transparent"
                                                    placeholder="Zip code or City"
                                                    onFocus={() => setIsSearchFocused(true)}
                                                    value={location}
                                                    onChange={(e) => setLocation(e.target.value)}
                                                />
                                            </div>
                                            <button type="submit" className="bg-primary-600 text-white px-8 py-3 rounded-full font-medium hover:bg-primary-700 transition-colors flex items-center gap-2">
                                                <span className="hidden sm:inline">Search</span>
                                                <Navigation className="w-4 h-4 sm:hidden" />
                                            </button>
                                        </div>

                                        {/* Search Suggestions Dropdown */}
                                        <div className={`absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 origin-top ${isSearchFocused ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                                            }`}>
                                            <div className="p-4">
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Popular Searches</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {["Vaccination", "Dental Checkup", "Emergency", "Grooming"].map((term, index) => (
                                                        <button
                                                            key={index}
                                                            type="button"
                                                            onClick={() => handlePopularSearch(term)}
                                                            className="px-3 py-1.5 bg-gray-50 hover:bg-primary-50 text-gray-600 hover:text-primary-700 rounded-lg text-sm transition-colors duration-200 flex items-center gap-2"
                                                        >
                                                            <Search className="w-3 h-3" />
                                                            {term}
                                                        </button>
                                                    ))}
                                                </div>

                                                <div className="mt-4 pt-4 border-t border-gray-100">
                                                    <button
                                                        type="button"
                                                        onClick={handleUseLocation}
                                                        className="flex items-center gap-3 text-primary-600 hover:text-primary-700 text-sm font-medium w-full p-2 hover:bg-primary-50 rounded-lg transition-colors"
                                                    >
                                                        <Navigation className="w-4 h-4" />
                                                        Use my current location
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>

                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 relative">
                    <img
                        className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full clip-path-slant"
                        src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=2850&q=80"
                        alt="Dog and cat together"
                        style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0% 100%)' }}
                    />

                    {/* Floating Trust Cards */}
                    <div className="absolute top-1/4 right-10 md:right-20 animate-float bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 max-w-[200px] transform rotate-3 hover:scale-105 transition-transform duration-300 hidden sm:block">
                        <div className="flex items-center gap-3">
                            <div className="bg-yellow-100 p-2 rounded-full">
                                <Star className="w-5 h-5 text-yellow-600 fill-current" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Trusted by</p>
                                <p className="text-sm font-bold text-gray-900">5,000+ Owners</p>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-1/3 left-20 md:left-32 animate-float bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 max-w-[200px] transform -rotate-2 hover:scale-105 transition-transform duration-300 hidden sm:block" style={{ animationDelay: '2s' }}>
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-full">
                                <ShieldCheck className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Quality Care</p>
                                <p className="text-sm font-bold text-gray-900">Verified Vets</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 bg-gray-50 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-base text-primary-600 font-bold tracking-wide uppercase bg-primary-100 inline-block px-4 py-1.5 rounded-full mb-4">What is Vetify?</h2>
                        <p className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">
                            Fast response. <br />
                            <span className="text-primary-600">Best available veterinarians.</span>
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                            We've reimagined veterinary care to be faster, simpler, and more reliable for you and your pets.
                        </p>
                    </div>

                    <div className="space-y-24">
                        {/* Feature 1: Fast Response */}
                        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                            <div className="w-full lg:w-1/2 relative group">
                                <div className="absolute inset-0 bg-primary-200 rounded-3xl transform rotate-3 transition-transform group-hover:rotate-6 duration-300"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=800"
                                    alt="Veterinarian checking a dog"
                                    className="relative rounded-3xl shadow-2xl w-full object-cover h-[400px] transform transition-transform group-hover:-translate-y-2 duration-300"
                                />
                            </div>
                            <div className="w-full lg:w-1/2">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                                        <Search className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-gray-900">Instant Connections</h3>
                                </div>
                                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                                    When your pet needs help, every minute counts. Our platform instantly connects you with available veterinarians in your area. No more waiting on hold or leaving voicemails.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        'Real-time availability updates',
                                        'Instant booking confirmation',
                                        'Emergency slots priority'
                                    ].map((item) => (
                                        <li key={item} className="flex items-center text-gray-700">
                                            <div className="mr-3 p-1 bg-green-100 rounded-full">
                                                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Feature 2: Best Vets */}
                        <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
                            <div className="w-full lg:w-1/2 relative group">
                                <div className="absolute inset-0 bg-purple-200 rounded-3xl transform -rotate-3 transition-transform group-hover:-rotate-6 duration-300"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800"
                                    alt="Happy vet with cat"
                                    className="relative rounded-3xl shadow-2xl w-full object-cover h-[400px] transform transition-transform group-hover:-translate-y-2 duration-300"
                                />
                            </div>
                            <div className="w-full lg:w-1/2">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-purple-100 rounded-2xl text-purple-600">
                                        <MapPin className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-gray-900">Top-Rated Professionals</h3>
                                </div>
                                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                                    We verify every veterinarian on our platform to ensure your pet receives the highest standard of care. Read reviews from other pet owners and choose with confidence.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        'Strict verification process',
                                        'Verified patient reviews',
                                        'Specialists for every need'
                                    ].map((item) => (
                                        <li key={item} className="flex items-center text-gray-700">
                                            <div className="mr-3 p-1 bg-green-100 rounded-full">
                                                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <Testimonials />
        </div>
    );
};

export default Home;

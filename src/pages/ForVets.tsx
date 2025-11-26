import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, CheckCircle, ArrowRight, Star, Quote } from 'lucide-react';

const ForVets: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative bg-white overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-100 opacity-70" />
                    <div className="absolute right-0 top-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-primary-100 rounded-full blur-3xl opacity-30 animate-pulse" />
                    <div className="absolute left-0 bottom-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-primary-200 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 relative z-10">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
                        <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left animate-fade-in-up">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mb-6">
                                <span className="flex h-2 w-2 rounded-full bg-primary-600 mr-2"></span>
                                #1 Platform for Veterinarians
                            </div>
                            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                                <span className="block">Empower Your</span>
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">Veterinary Practice</span>
                            </h1>
                            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                Join the leading platform connecting vets with pet owners. Streamline bookings, manage digital records, and grow your client base with ease.
                            </p>
                            <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link
                                        to="/register"
                                        className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-800 hover:from-primary-700 hover:to-primary-900 shadow-lg shadow-primary-500/30 transition-all transform hover:-translate-y-0.5 md:py-4 md:text-lg md:px-10"
                                    >
                                        Join Vetify
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="inline-flex items-center justify-center px-8 py-3 border border-gray-200 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:text-primary-600 transition-all md:py-4 md:text-lg md:px-10"
                                    >
                                        Log In
                                    </Link>
                                </div>
                                <p className="mt-3 text-sm text-gray-500">
                                    No credit card required for 30-day trial.
                                </p>
                            </div>
                        </div>
                        <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                            <div className="relative mx-auto w-full rounded-2xl shadow-xl lg:max-w-md overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                <img
                                    className="w-full"
                                    src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80"
                                    alt="Veterinarian using tablet"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                    <div className="text-white">
                                        <p className="font-bold text-lg">Dr. Emily Chen</p>
                                        <p className="text-sm opacity-90">Partner since 2023</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white pt-12 sm:pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Trusted by professionals worldwide
                        </h2>
                        <p className="mt-3 text-xl text-gray-500 sm:mt-4">
                            Our platform is built to handle the needs of modern veterinary clinics.
                        </p>
                    </div>
                </div>
                <div className="mt-10 pb-12 bg-white sm:pb-16">
                    <div className="relative">
                        <div className="absolute inset-0 h-1/2 bg-white" />
                        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="max-w-4xl mx-auto">
                                <dl className="rounded-2xl bg-white shadow-xl border border-gray-100 grid grid-cols-1 gap-5 sm:grid-cols-3 p-6">
                                    <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                                        <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">Active Vets</dt>
                                        <dd className="order-1 text-5xl font-extrabold text-primary-600">500+</dd>
                                    </div>
                                    <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                                        <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">Monthly Bookings</dt>
                                        <dd className="order-1 text-5xl font-extrabold text-primary-600">10k+</dd>
                                    </div>
                                    <div className="flex flex-col p-6 text-center">
                                        <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">Client Satisfaction</dt>
                                        <dd className="order-1 text-5xl font-extrabold text-primary-600">4.9/5</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="py-16 bg-gray-50 overflow-hidden lg:py-24">
                <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
                    <div className="relative">
                        <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Everything you need to run your practice
                        </h2>
                        <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
                            Focus on treating pets while we handle the administration.
                        </p>
                    </div>

                    <div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-2 lg:gap-8 items-center">
                        <div className="relative">
                            <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
                                Smart Scheduling System
                            </h3>
                            <p className="mt-3 text-lg text-gray-500">
                                Say goodbye to phone tag. Our intelligent booking system lets clients book appointments 24/7 based on your real-time availability.
                            </p>

                            <dl className="mt-10 space-y-10">
                                {[
                                    {
                                        id: 1,
                                        title: 'Reduce No-Shows',
                                        description: 'Automated SMS and email reminders keep your schedule full and clients on time.',
                                        icon: CheckCircle,
                                    },
                                    {
                                        id: 2,
                                        title: 'Customizable Hours',
                                        description: 'Set your working hours, breaks, and holidays with our flexible calendar tools.',
                                        icon: Calendar,
                                    },
                                ].map((item) => (
                                    <div key={item.id} className="relative">
                                        <dt>
                                            <div className="absolute flex items-center justify-center h-12 w-12 rounded-xl bg-primary-500 text-white shadow-lg">
                                                <item.icon className="h-6 w-6" aria-hidden="true" />
                                            </div>
                                            <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{item.title}</p>
                                        </dt>
                                        <dd className="mt-2 ml-16 text-base text-gray-500">{item.description}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        <div className="mt-10 -mx-4 relative lg:mt-0" aria-hidden="true">
                            <img
                                className="relative mx-auto rounded-xl shadow-xl ring-1 ring-black ring-opacity-5"
                                width={490}
                                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
                                alt="Vet dashboard screenshot"
                            />
                        </div>
                    </div>

                    <div className="relative mt-12 sm:mt-16 lg:mt-24">
                        <div className="lg:grid lg:grid-flow-row-dense lg:grid-cols-2 lg:gap-8 lg:items-center">
                            <div className="lg:col-start-2">
                                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
                                    Grow Your Visibility
                                </h3>
                                <p className="mt-3 text-lg text-gray-500">
                                    Stand out in your local area. Our platform puts your profile in front of thousands of pet owners actively looking for care.
                                </p>

                                <dl className="mt-10 space-y-10">
                                    {[
                                        {
                                            id: 1,
                                            title: 'Verified Reviews',
                                            description: 'Build trust with authentic reviews from verified appointments.',
                                            icon: Star,
                                        },
                                        {
                                            id: 2,
                                            title: 'Detailed Profile',
                                            description: 'Showcase your expertise, services, and clinic photos to attract the right clients.',
                                            icon: Users,
                                        },
                                    ].map((item) => (
                                        <div key={item.id} className="relative">
                                            <dt>
                                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-xl bg-primary-500 text-white shadow-lg">
                                                    <item.icon className="h-6 w-6" aria-hidden="true" />
                                                </div>
                                                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{item.title}</p>
                                            </dt>
                                            <dd className="mt-2 ml-16 text-base text-gray-500">{item.description}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>

                            <div className="mt-10 -mx-4 relative lg:mt-0 lg:col-start-1">
                                <img
                                    className="relative mx-auto rounded-xl shadow-xl ring-1 ring-black ring-opacity-5"
                                    width={490}
                                    src="https://images.unsplash.com/photo-1581889470536-467bdbe30cd0?auto=format&fit=crop&w=800&q=80"
                                    alt="Vet profile on mobile"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials Section (Vets) */}
            <div className="bg-primary-900 py-16 lg:py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-primary-400 blur-3xl"></div>
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                            Loved by veterinarians
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-primary-800/50 backdrop-blur-lg rounded-2xl p-8 border border-primary-700">
                            <Quote className="h-8 w-8 text-primary-300 mb-4" />
                            <p className="text-xl text-primary-50 italic mb-6">
                                "Vetify has completely transformed our booking process. We spend less time on the phone and more time caring for animals. The no-show rate has dropped significantly."
                            </p>
                            <div className="flex items-center">
                                <img
                                    className="h-12 w-12 rounded-full object-cover border-2 border-primary-400"
                                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80"
                                    alt="Dr. Sarah Wilson"
                                />
                                <div className="ml-4">
                                    <h4 className="text-lg font-bold text-white">Dr. Sarah Wilson</h4>
                                    <p className="text-primary-300">Paws & Claws Clinic</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-primary-800/50 backdrop-blur-lg rounded-2xl p-8 border border-primary-700">
                            <Quote className="h-8 w-8 text-primary-300 mb-4" />
                            <p className="text-xl text-primary-50 italic mb-6">
                                "The interface is incredibly intuitive. I can manage my schedule from anywhere, and my clients love the ease of booking online. It's a game-changer."
                            </p>
                            <div className="flex items-center">
                                <img
                                    className="h-12 w-12 rounded-full object-cover border-2 border-primary-400"
                                    src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=150&q=80"
                                    alt="Dr. James Chen"
                                />
                                <div className="ml-4">
                                    <h4 className="text-lg font-bold text-white">Dr. James Chen</h4>
                                    <p className="text-primary-300">City Vet Hospital</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-white">
                <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl shadow-2xl overflow-hidden relative">
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
                        </div>
                        <div className="relative px-6 py-16 sm:px-12 sm:py-20 text-center">
                            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                                <span className="block">Ready to grow your practice?</span>
                                <span className="block text-primary-100">Start your free trial today.</span>
                            </h2>
                            <p className="mt-4 text-lg leading-6 text-primary-100 max-w-2xl mx-auto">
                                Join hundreds of other veterinarians who trust Vetify to manage their practice and connect with pet owners.
                            </p>
                            <div className="mt-8 flex justify-center gap-4">
                                <Link
                                    to="/register"
                                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-primary-700 bg-white hover:bg-primary-50 shadow-lg transition-all transform hover:-translate-y-0.5"
                                >
                                    Get Started
                                </Link>
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center justify-center px-8 py-3 border border-primary-400 text-base font-medium rounded-xl text-white hover:bg-primary-700 transition-all"
                                >
                                    Contact Sales
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForVets;

import React, { useState } from 'react';
import { Check, CreditCard, Shield, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { addDoc, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useToast } from '../context/ToastContext';

const SubscriptionPage: React.FC = () => {
    const { user, isVet } = useAuth();
    const { vets } = useData();
    const { showToast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);

    // Get fresh vet data to ensure we have the latest subscription status/expiry
    const currentVet = user ? vets.find(v => v.id === user.id) : undefined;
    const isSubscribed = currentVet?.isSubscribed ?? (user as import('../types').Vet)?.isSubscribed;
    const subscriptionExpiry = currentVet?.subscriptionExpiry;

    if (!user || !isVet) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">Please log in as a veterinarian to view this page.</p>
            </div>
        );
    }

    const handleSubscribe = async () => {
        setIsProcessing(true);
        try {
            // Create a checkout session document in Firestore
            const docRef = await addDoc(collection(db, 'customers', user.id, 'checkout_sessions'), {
                price: 'price_1SXsVIRvN8UpGVqzTADMR1RC', // Real Price ID
                success_url: window.location.origin + '/vet-dashboard',
                cancel_url: window.location.origin + '/subscription',
            });

            // Listen for the session to be created and get the URL
            onSnapshot(docRef, (snap) => {
                const { url, error } = snap.data() || {};
                if (error) {
                    console.error('An error occurred:', error.message);
                    setIsProcessing(false);
                    showToast(`An error occurred: ${error.message}`, 'error');
                }
                if (url) {
                    window.location.assign(url);
                }
            });
        } catch (error) {
            console.error("Error creating checkout session:", error);
            setIsProcessing(false);
            showToast("Failed to start checkout. Please try again.", 'error');
        }
    };

    const handleManageSubscription = async () => {
        setIsProcessing(true);
        try {
            // Create a portal session document in Firestore
            // The extension listens to this collection and creates a Stripe Portal Session
            const docRef = await addDoc(collection(db, 'customers', user.id, 'customer_portal_sessions'), {
                return_url: window.location.origin + '/subscription',
            });

            onSnapshot(docRef, (snap) => {
                const { url, error } = snap.data() || {};
                if (error) {
                    console.error('An error occurred:', error.message);
                    setIsProcessing(false);
                    showToast(`An error occurred: ${error.message}`, 'error');
                }
                if (url) {
                    window.location.assign(url);
                }
            });
        } catch (error) {
            console.error("Error creating portal session:", error);
            setIsProcessing(false);
            showToast("Failed to open subscription management. Please try again.", 'error');
        }
    };

    if (isSubscribed) {
        return (
            <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Manage Subscription
                    </h2>
                    <p className="mt-4 text-xl text-gray-500">
                        View and manage your current plan details.
                    </p>
                </div>

                <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="px-6 py-8 sm:p-10">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Current Plan</h3>
                                <p className="text-sm text-gray-500">Professional Plan</p>
                            </div>
                            <span className="inline-flex px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                                Active
                            </span>
                        </div>

                        <div className="border-t border-gray-100 py-6">
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Price</dt>
                                    <dd className="mt-1 text-lg font-semibold text-gray-900">€19/mo</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Next Billing Date</dt>
                                    <dd className="mt-1 text-lg font-semibold text-gray-900">
                                        {subscriptionExpiry ? new Date(subscriptionExpiry).toLocaleDateString() : 'Auto-renewing'}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <div className="mt-8">
                            <button
                                onClick={handleManageSubscription}
                                disabled={isProcessing}
                                className={`w-full flex items-center justify-center px-6 py-3 border border-gray-300 rounded-xl shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all ${isProcessing ? 'opacity-75 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isProcessing ? 'Processing...' : (
                                    <>
                                        Manage Subscription <ExternalLink className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </button>
                            <p className="mt-4 text-xs text-center text-gray-400">
                                You will be redirected to Stripe to manage your billing and cancellation.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    Grow your practice with Vetify
                </h2>
                <p className="mt-4 text-xl text-gray-500">
                    Join thousands of veterinarians connecting with pet owners every day.
                </p>
            </div>

            <div className="mt-16 max-w-lg mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="px-6 py-8 sm:p-10 sm:pb-6">
                    <div className="flex justify-center">
                        <span className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-primary-100 text-primary-600">
                            Professional Plan
                        </span>
                    </div>
                    <div className="mt-4 flex justify-center items-baseline text-6xl font-extrabold text-gray-900">
                        €19
                        <span className="ml-1 text-2xl font-medium text-gray-500">/mo</span>
                    </div>
                    <p className="mt-5 text-lg text-gray-500 text-center">
                        Everything you need to manage appointments and grow your client base.
                    </p>
                </div>
                <div className="px-6 pt-6 pb-8 bg-gray-50 sm:px-10 sm:py-10">
                    <ul className="space-y-4">
                        {[
                            'Unlimited appointment bookings',
                            'Practice profile listing',
                            'Patient management dashboard',
                            'Verified reviews & ratings',
                            '24/7 Support'
                        ].map((feature) => (
                            <li key={feature} className="flex items-start">
                                <div className="flex-shrink-0">
                                    <Check className="h-6 w-6 text-green-500" aria-hidden="true" />
                                </div>
                                <p className="ml-3 text-base text-gray-700">{feature}</p>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-10">
                        <button
                            onClick={handleSubscribe}
                            disabled={isProcessing}
                            className={`w-full flex items-center justify-center px-6 py-4 border border-transparent rounded-xl shadow-lg text-lg font-medium text-white bg-gradient-to-r from-primary-600 to-primary-800 hover:from-primary-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all ${isProcessing ? 'opacity-75 cursor-not-allowed' : 'hover:-translate-y-1'
                                }`}
                        >
                            {isProcessing ? (
                                <>Processing...</>
                            ) : (
                                <>
                                    <CreditCard className="w-5 h-5 mr-2" />
                                    Subscribe Now
                                </>
                            )}
                        </button>
                        <p className="mt-4 text-xs text-center text-gray-400 flex items-center justify-center">
                            <Shield className="w-3 h-3 mr-1" />
                            Secure payment processing via Stripe
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPage;

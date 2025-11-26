import React, { useState } from 'react';
import { X, CreditCard, CheckCircle } from 'lucide-react';
import type { Vet } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import BookingCalendar from './BookingCalendar';

interface BookingModalProps {
    vet: Vet;
    isOpen: boolean;
    onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ vet, isOpen, onClose }) => {
    const { user, isAuthenticated } = useAuth();
    const { bookings, addBooking } = useData();
    const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);
    const [service, setService] = useState(vet.services[0]);
    const [petName, setPetName] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!user || !selectedSlot) return;

        const newBooking = {
            id: `b_${Math.random().toString(36).substr(2, 9)}`,
            vetId: vet.id,
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            petName,
            service,
            date: selectedSlot.date,
            time: selectedSlot.time,
            status: 'pending' as const,
            notes,
            createdAt: new Date().toISOString()
        };

        addBooking(newBooking);

        setIsSubmitted(true);
        setTimeout(() => {
            onClose();
            setIsSubmitted(false);
            // Reset form
            setSelectedSlot(null);
            setPetName('');
            setNotes('');
        }, 2000);
    };

    if (!isAuthenticated) {
        return (
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
                    </div>
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-10">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="text-center">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Login Required</h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        You need to be logged in to book an appointment.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <a
                                href="/login"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Go to Login
                            </a>
                            <button
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full relative z-10">
                    {isSubmitted ? (
                        <div className="p-12 text-center">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Request Sent!</h3>
                            <p className="text-gray-500">
                                Your appointment request has been sent to {vet.name}. You will receive a confirmation shortly.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-900 text-center w-full">
                                    {vet.name}, {vet.specialty}
                                </h3>
                                <button onClick={onClose} className="text-gray-400 hover:text-gray-500 absolute right-6">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="bg-white">
                                <div className="px-6 py-6 space-y-6">

                                    {/* Offices Section (Static for now) */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">Offices</label>
                                        <div className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 bg-white">
                                            {vet.clinicName} ({vet.location})
                                        </div>
                                    </div>

                                    {/* Services Section */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">Services</label>
                                        <select
                                            value={service}
                                            onChange={(e) => setService(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                        >
                                            {vet.services.map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Calendar Section */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-4">Select appointment time</label>
                                        <BookingCalendar
                                            workingHours={vet.workingHours}
                                            bookings={bookings.filter(b => b.vetId === vet.id)}
                                            selectedSlot={selectedSlot}
                                            onSelectSlot={setSelectedSlot}
                                            className="border-none"
                                        />
                                    </div>

                                    {/* Additional Info */}
                                    {selectedSlot && (
                                        <div className="space-y-4 pt-4 border-t border-gray-100 animate-fade-in-up">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Pet Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                                    placeholder="e.g. Max"
                                                    value={petName}
                                                    onChange={(e) => setPetName(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                                                <textarea
                                                    rows={2}
                                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                                    placeholder="Any specific symptoms..."
                                                    value={notes}
                                                    onChange={(e) => setNotes(e.target.value)}
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="w-full py-3 px-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30"
                                            >
                                                Confirm Booking for {selectedSlot.date} at {selectedSlot.time}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Footer Note */}
                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-start gap-3">
                                    <CreditCard className="w-5 h-5 text-primary-600 mt-0.5" />
                                    <p className="text-sm text-gray-600">
                                        <span className="font-bold text-gray-900">Payment at the office:</span> The payment will be made during the visit. You can cancel the appointment up to 3 hours before start.
                                    </p>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingModal;

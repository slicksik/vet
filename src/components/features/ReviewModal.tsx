import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import type { Booking } from '../../types';

interface ReviewModalProps {
    booking: Booking;
    isOpen: boolean;
    onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ booking, isOpen, onClose }) => {
    const { user } = useAuth();
    const { addReview, vets } = useData();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [hoveredRating, setHoveredRating] = useState(0);

    if (!isOpen || !user) return null;

    const vet = vets.find(v => v.id === booking.vetId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        addReview({
            id: `r_${Math.random().toString(36).substr(2, 9)}`,
            vetId: booking.vetId,
            userId: user.id,
            userName: user.name,
            rating,
            comment,
            date: new Date().toISOString().split('T')[0],
            bookingId: booking.id
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-10">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Review your visit with {vet?.name}
                            </h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex justify-center space-x-2 py-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className="focus:outline-none transition-transform hover:scale-110"
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        onClick={() => setRating(star)}
                                    >
                                        <Star
                                            className={`w-8 h-8 ${star <= (hoveredRating || rating)
                                                    ? 'text-yellow-400 fill-current'
                                                    : 'text-gray-300'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Comment (Optional)</label>
                                <textarea
                                    rows={4}
                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                                    placeholder="Share your experience..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </div>

                            <div className="mt-5 sm:mt-6">
                                <button
                                    type="submit"
                                    className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-800 text-base font-medium text-white hover:shadow-lg hover:shadow-primary-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm transition-all transform hover:-translate-y-0.5"
                                >
                                    Submit Review
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;

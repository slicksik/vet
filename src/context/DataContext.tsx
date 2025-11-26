import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { MOCK_VETS, MOCK_BOOKINGS } from '../mocks/data';
import type { Vet, Booking, Review, WorkingHours } from '../types';

interface DataContextType {
    vets: Vet[];
    bookings: Booking[];
    // slots removed
    reviews: Review[];
    // addSlot removed
    // removeSlot removed
    addBooking: (booking: Booking) => void;
    updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
    deleteVet: (vetId: string) => void;
    addReview: (review: Review) => void;
    updateVetSubscription: (vetId: string, isSubscribed: boolean) => void;
    updateVetWorkingHours: (vetId: string, workingHours: WorkingHours) => void;
    addVet: (vet: Vet) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [vets, setVets] = useState<Vet[]>(() => {
        const saved = localStorage.getItem('vets');
        const defaultWorkingHours: WorkingHours = {
            monday: { isOpen: true, start: '09:00', end: '17:00' },
            tuesday: { isOpen: true, start: '09:00', end: '17:00' },
            wednesday: { isOpen: true, start: '09:00', end: '17:00' },
            thursday: { isOpen: true, start: '09:00', end: '17:00' },
            friday: { isOpen: true, start: '09:00', end: '17:00' },
            saturday: { isOpen: false, start: '10:00', end: '14:00' },
            sunday: { isOpen: false, start: '10:00', end: '14:00' }
        };

        if (saved) {
            const parsedVets = JSON.parse(saved);
            // Migration: Ensure all vets have subscription status AND working hours
            const updatedVets = parsedVets.map((v: Vet) => ({
                ...v,
                isSubscribed: v.isSubscribed ?? true,
                workingHours: v.workingHours || defaultWorkingHours
            }));

            // Check if we're missing any new mock vets
            const existingIds = new Set(updatedVets.map((v: Vet) => v.id));
            const missingMocks = MOCK_VETS.filter(mock => !existingIds.has(mock.id)).map(mock => ({
                ...mock,
                workingHours: mock.workingHours || defaultWorkingHours
            }));

            return [...updatedVets, ...missingMocks];
        }
        // Initialize mocks with default hours if not present in mock data
        return MOCK_VETS.map(v => ({ ...v, workingHours: v.workingHours || defaultWorkingHours }));
    });
    const [bookings, setBookings] = useState<Booking[]>(() => {
        const saved = localStorage.getItem('bookings');
        const parsedBookings = saved ? JSON.parse(saved) : MOCK_BOOKINGS;

        // Ensure v_demo bookings are present (for demo purposes)
        const existingIds = new Set(parsedBookings.map((b: Booking) => b.id));
        const missingMocks = MOCK_BOOKINGS.filter(mock => !existingIds.has(mock.id));

        return [...parsedBookings, ...missingMocks];
    });
    // slots state removed as it was unused
    const [reviews, setReviews] = useState<Review[]>(() => {
        const saved = localStorage.getItem('reviews');
        return saved ? JSON.parse(saved) : [];
    });

    React.useEffect(() => {
        localStorage.setItem('vets', JSON.stringify(vets));
    }, [vets]);

    React.useEffect(() => {
        localStorage.setItem('bookings', JSON.stringify(bookings));
    }, [bookings]);

    // slots effect removed

    React.useEffect(() => {
        localStorage.setItem('reviews', JSON.stringify(reviews));
    }, [reviews]);

    // addSlot and removeSlot removed

    const addBooking = (booking: Booking) => {
        setBookings(prev => [...prev, booking]);
        // Slot availability logic removed as slots are dynamic
    };

    const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
        setBookings(prev => prev.map(b =>
            b.id === bookingId ? { ...b, status } : b
        ));
    };

    const deleteVet = (vetId: string) => {
        setVets(prev => prev.filter(v => v.id !== vetId));
    };

    const addReview = (review: Review) => {
        setReviews(prev => [...prev, review]);
        // Update vet rating
        setVets(prev => prev.map(v => {
            if (v.id === review.vetId) {
                const vetReviews = reviews.filter(r => r.vetId === v.id);
                const newReviews = [...vetReviews, review];
                const totalRating = newReviews.reduce((sum, r) => sum + r.rating, 0);
                const newRating = Number((totalRating / newReviews.length).toFixed(1));
                return { ...v, rating: newRating, reviews: newReviews.length };
            }
            return v;
        }));
    };

    const updateVetSubscription = (vetId: string, isSubscribed: boolean) => {
        const now = new Date();
        const expiryDate = isSubscribed
            ? new Date(now.setDate(now.getDate() + 30)).toISOString()
            : undefined;

        setVets(prev => prev.map(v =>
            v.id === vetId ? { ...v, isSubscribed, subscriptionExpiry: expiryDate } : v
        ));

        // Also update local storage user if it matches
        const currentUserStr = localStorage.getItem('vetify_user');
        if (currentUserStr) {
            const currentUser = JSON.parse(currentUserStr);
            if (currentUser.id === vetId) {
                const updatedUser = { ...currentUser, isSubscribed, subscriptionExpiry: expiryDate };
                localStorage.setItem('vetify_user', JSON.stringify(updatedUser));
                // Note: AuthContext might need a refresh, but for now this persists it
            }
        }
    };

    const updateVetWorkingHours = (vetId: string, workingHours: WorkingHours) => {
        setVets(prev => prev.map(v =>
            v.id === vetId ? { ...v, workingHours } : v
        ));
    };

    const addVet = (vet: Vet) => {
        setVets(prev => {
            // Avoid duplicates
            if (prev.some(v => v.id === vet.id)) return prev;
            return [...prev, vet];
        });
    };

    return (
        <DataContext.Provider value={{
            vets,
            bookings,
            reviews,
            addBooking,
            updateBookingStatus,
            deleteVet,
            addReview,
            updateVetSubscription,
            updateVetWorkingHours,
            addVet
        }}>
            {children}
        </DataContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

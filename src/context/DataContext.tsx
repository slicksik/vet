import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
    collection,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    setDoc,
    query,
    where,
    getDocs
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Vet, Booking, Review, WorkingHours } from '../types';

interface DataContextType {
    vets: Vet[];
    bookings: Booking[];
    reviews: Review[];
    addBooking: (booking: Booking) => Promise<void>;
    updateBookingStatus: (bookingId: string, status: Booking['status']) => Promise<void>;
    deleteVet: (vetId: string) => Promise<void>;
    addReview: (review: Review) => Promise<void>;
    updateVetSubscription: (vetId: string, isSubscribed: boolean) => Promise<void>;
    updateVetWorkingHours: (vetId: string, workingHours: WorkingHours) => Promise<void>;
    addVet: (vet: Vet) => Promise<void>;
    updateVetProfile: (vetId: string, data: Partial<Vet>) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [vets, setVets] = useState<Vet[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);

    // Real-time listener for Vets
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'vets'), (snapshot) => {
            const vetsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Vet));
            setVets(vetsData);
        });
        return () => unsubscribe();
    }, []);

    // Real-time listener for Bookings
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'bookings'), (snapshot) => {
            const bookingsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Booking));
            setBookings(bookingsData);
        });
        return () => unsubscribe();
    }, []);

    // Real-time listener for Reviews
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'reviews'), (snapshot) => {
            const reviewsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Review));
            setReviews(reviewsData);
        });
        return () => unsubscribe();
    }, []);

    const addBooking = async (booking: Booking) => {
        // We use setDoc with booking.id if it exists, or addDoc if we want auto-ID.
        // The mock data had IDs, but for new bookings we usually want auto-IDs or generated IDs.
        // If booking.id is provided and unique, we can use setDoc.
        // Let's assume we want to let Firestore generate IDs for new bookings if not provided,
        // or use the provided ID if it's a specific logic.
        // However, the types say Booking has an ID.
        // Let's use setDoc if ID is present, otherwise addDoc (and update local object).
        // Actually, for simplicity and consistency with 'add' semantics:

        const { id, ...bookingData } = booking;
        if (id) {
            await setDoc(doc(db, 'bookings', id), bookingData);
        } else {
            await addDoc(collection(db, 'bookings'), bookingData);
        }
    };

    const updateBookingStatus = async (bookingId: string, status: Booking['status']) => {
        await updateDoc(doc(db, 'bookings', bookingId), { status });
    };

    const deleteVet = async (vetId: string) => {
        await deleteDoc(doc(db, 'vets', vetId));
    };

    const addReview = async (review: Review) => {
        const { id, ...reviewData } = review;
        // 1. Add the new review
        if (id) {
            await setDoc(doc(db, 'reviews', id), reviewData);
        } else {
            await addDoc(collection(db, 'reviews'), reviewData);
        }

        // 2. Calculate new rating
        try {
            const reviewsRef = collection(db, 'reviews');
            const q = query(reviewsRef, where('vetId', '==', review.vetId));
            const querySnapshot = await getDocs(q);

            const reviews = querySnapshot.docs.map(doc => doc.data() as Review);
            const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
            const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

            // Round to 1 decimal place
            const roundedRating = Math.round(averageRating * 10) / 10;

            // 3. Update vet document
            await updateDoc(doc(db, 'vets', review.vetId), {
                rating: roundedRating,
                reviews: reviews.length
            });
        } catch (error) {
            console.error("Error updating vet rating:", error);
        }
    };

    const updateVetSubscription = async (vetId: string, isSubscribed: boolean) => {
        const now = new Date();
        const expiryDate = isSubscribed
            ? new Date(now.setDate(now.getDate() + 30)).toISOString()
            : undefined;

        await updateDoc(doc(db, 'vets', vetId), {
            isSubscribed,
            subscriptionExpiry: expiryDate
        });
    };

    const updateVetWorkingHours = async (vetId: string, workingHours: WorkingHours) => {
        await updateDoc(doc(db, 'vets', vetId), { workingHours });
    };

    const addVet = async (vet: Vet) => {
        const { id, ...vetData } = vet;
        await setDoc(doc(db, 'vets', id), vetData);
    };

    const updateVetProfile = async (vetId: string, data: Partial<Vet>) => {
        await updateDoc(doc(db, 'vets', vetId), data);
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
            addVet,
            updateVetProfile
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

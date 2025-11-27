import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import type { User, Vet } from '../types';

interface AuthContextType {
    user: User | Vet | null;
    loading: boolean;
    login: (email: string, role: 'user' | 'vet' | 'admin', password?: string) => Promise<void>;
    loginWithGoogle: (role?: 'user' | 'vet') => Promise<void>;
    register: (name: string, email: string, role: 'user' | 'vet', password?: string) => Promise<User | Vet>;
    logout: () => void;
    isAuthenticated: boolean;
    isVet: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | Vet | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Try to fetch from vets first, then users
                const vetDoc = await getDoc(doc(db, 'vets', firebaseUser.uid));
                if (vetDoc.exists()) {
                    setUser(vetDoc.data() as Vet);
                } else {
                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                    if (userDoc.exists()) {
                        setUser(userDoc.data() as User);
                    } else {
                        // User authenticated but no profile found (shouldn't happen in normal flow)
                        console.error('User authenticated but no profile found');
                        setUser(null);
                    }
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const register = async (name: string, email: string, role: 'user' | 'vet', password?: string): Promise<User | Vet> => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password || 'password123');
            const firebaseUser = userCredential.user;

            const newUser: User | Vet = role === 'vet'
                ? {
                    id: firebaseUser.uid,
                    name,
                    email,
                    role: 'vet',
                    clinicName: 'New Clinic',
                    address: 'Address Pending',
                    description: 'Description Pending',
                    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
                    latitude: 40.7128,
                    longitude: -74.0060,
                    services: ['General Checkup'],
                    rating: 0,
                    reviews: 0,
                    phone: 'Phone Pending',
                    isSubscribed: false,
                    workingHours: {
                        monday: { isOpen: true, start: "09:00", end: "17:00" },
                        tuesday: { isOpen: true, start: "09:00", end: "17:00" },
                        wednesday: { isOpen: true, start: "09:00", end: "17:00" },
                        thursday: { isOpen: true, start: "09:00", end: "17:00" },
                        friday: { isOpen: true, start: "09:00", end: "17:00" },
                        saturday: { isOpen: false, start: "09:00", end: "17:00" },
                        sunday: { isOpen: false, start: "09:00", end: "17:00" }
                    }
                }
                : {
                    id: firebaseUser.uid,
                    name,
                    email,
                    role: 'user'
                };

            const collectionName = role === 'vet' ? 'vets' : 'users';
            await setDoc(doc(db, collectionName, firebaseUser.uid), newUser);

            // No need to setUser here as onAuthStateChanged will trigger
            return newUser;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const login = async (email: string, _role: 'user' | 'vet' | 'admin', password?: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password || 'password123');
            // onAuthStateChanged will handle the rest
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const loginWithGoogle = async (role: 'user' | 'vet' = 'user') => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const firebaseUser = result.user;

            // Check if user exists in either collection
            const vetDoc = await getDoc(doc(db, 'vets', firebaseUser.uid));
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

            if (!vetDoc.exists() && !userDoc.exists()) {
                // New user, create profile
                const newUser: User | Vet = role === 'vet'
                    ? {
                        id: firebaseUser.uid,
                        name: firebaseUser.displayName || 'Vet',
                        email: firebaseUser.email || '',
                        role: 'vet',
                        clinicName: 'New Clinic',
                        address: 'Address Pending',
                        description: 'Description Pending',
                        image: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
                        latitude: 40.7128,
                        longitude: -74.0060,
                        services: ['General Checkup'],
                        rating: 0,
                        reviews: 0,
                        phone: 'Phone Pending',
                        isSubscribed: false,
                        workingHours: {
                            monday: { isOpen: true, start: "09:00", end: "17:00" },
                            tuesday: { isOpen: true, start: "09:00", end: "17:00" },
                            wednesday: { isOpen: true, start: "09:00", end: "17:00" },
                            thursday: { isOpen: true, start: "09:00", end: "17:00" },
                            friday: { isOpen: true, start: "09:00", end: "17:00" },
                            saturday: { isOpen: false, start: "09:00", end: "17:00" },
                            sunday: { isOpen: false, start: "09:00", end: "17:00" }
                        }
                    }
                    : {
                        id: firebaseUser.uid,
                        name: firebaseUser.displayName || 'User',
                        email: firebaseUser.email || '',
                        role: 'user'
                    };

                const collectionName = role === 'vet' ? 'vets' : 'users';
                await setDoc(doc(db, collectionName, firebaseUser.uid), newUser);

                // Manually set user state to avoid race condition with onAuthStateChanged
                // which might run before the Firestore document is created
                setUser(newUser);
            } else {
                // User exists, ensure state is updated (though onAuthStateChanged handles this too)
                if (vetDoc.exists()) {
                    setUser(vetDoc.data() as Vet);
                } else if (userDoc.exists()) {
                    setUser(userDoc.data() as User);
                }
            }
        } catch (error) {
            console.error('Google login error:', error);
            throw error;
        }
    };

    const logout = () => {
        signOut(auth);
        localStorage.removeItem('vetify_user'); // Clean up legacy
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            loginWithGoogle,
            register,
            logout,
            isAuthenticated: !!user,
            isVet: user?.role === 'vet',
            isAdmin: user?.role === 'admin'
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

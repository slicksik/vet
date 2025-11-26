import React, { createContext, useContext, useState } from 'react';
import type { User, Vet } from '../types';
import { MOCK_VETS } from '../mocks/data';

interface AuthContextType {
    user: User | Vet | null;
    login: (email: string, role: 'user' | 'vet' | 'admin') => Promise<void>;
    register: (name: string, email: string, role: 'user' | 'vet') => Promise<User | Vet>;
    logout: () => void;
    isAuthenticated: boolean;
    isVet: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | Vet | null>(() => {
        const storedUser = localStorage.getItem('vetify_user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const register = async (name: string, email: string, role: 'user' | 'vet'): Promise<User | Vet> => {
        if (role === 'vet') {
            const newVet: Vet = {
                id: 'v_' + Math.random().toString(36).substr(2, 9),
                name,
                email,
                role: 'vet',
                clinicName: 'New Clinic',
                address: 'Address Pending',
                description: 'New veterinarian account.',
                image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800',
                latitude: 37.7749,
                longitude: -122.4194,
                services: ['General Checkup'],
                rating: 0,
                reviews: 0,
                phone: '',
                isSubscribed: true,
                workingHours: {
                    monday: { isOpen: true, start: '09:00', end: '17:00' },
                    tuesday: { isOpen: true, start: '09:00', end: '17:00' },
                    wednesday: { isOpen: true, start: '09:00', end: '17:00' },
                    thursday: { isOpen: true, start: '09:00', end: '17:00' },
                    friday: { isOpen: true, start: '09:00', end: '17:00' },
                    saturday: { isOpen: false, start: '09:00', end: '17:00' },
                    sunday: { isOpen: false, start: '09:00', end: '17:00' }
                }
            };
            setUser(newVet);
            localStorage.setItem('vetify_user', JSON.stringify(newVet));
            return newVet;
        } else {
            const newUser: User = {
                id: 'u_' + Math.random().toString(36).substr(2, 9),
                name,
                email,
                role: 'user'
            };
            setUser(newUser);
            localStorage.setItem('vetify_user', JSON.stringify(newUser));
            return newUser;
        }
    };

    const login = async (email: string, role: 'user' | 'vet' | 'admin') => {
        // Mock login logic
        if (role === 'admin') {
            const adminUser: User = {
                id: 'admin_1',
                name: 'Super Admin',
                email: email,
                role: 'admin'
            };
            setUser(adminUser);
            localStorage.setItem('vetify_user', JSON.stringify(adminUser));
        } else if (role === 'vet') {
            const vet = MOCK_VETS.find(v => v.email === email);
            if (vet) {
                setUser(vet);
                localStorage.setItem('vetify_user', JSON.stringify(vet));
            } else {
                // Create a mock vet if not found in predefined list (for demo purposes)
                const newVet: Vet = {
                    id: 'v_demo',
                    name: 'Demo Vet',
                    email,
                    role: 'vet',
                    clinicName: 'Demo Clinic',
                    address: '123 Demo St',
                    description: 'This is a demo vet account.',
                    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800',
                    latitude: 37.7749,
                    longitude: -122.4194,
                    services: ['General Checkup'],
                    rating: 5.0,
                    reviews: 0,
                    phone: '(555) 000-0000',
                    isSubscribed: true,
                    workingHours: {
                        monday: { isOpen: true, start: '09:00', end: '17:00' },
                        tuesday: { isOpen: true, start: '09:00', end: '17:00' },
                        wednesday: { isOpen: true, start: '09:00', end: '17:00' },
                        thursday: { isOpen: true, start: '09:00', end: '17:00' },
                        friday: { isOpen: true, start: '09:00', end: '17:00' },
                        saturday: { isOpen: false, start: '09:00', end: '17:00' },
                        sunday: { isOpen: false, start: '09:00', end: '17:00' }
                    }
                };
                setUser(newVet);
                localStorage.setItem('vetify_user', JSON.stringify(newVet));
            }
        } else {
            // Check if it's the demo user from mock data
            const isDemoUser = email === 'john@example.com';
            const newUser: User = {
                id: isDemoUser ? 'u1' : 'u_' + Math.random().toString(36).substr(2, 9),
                name: isDemoUser ? 'John Doe' : email.split('@')[0],
                email,
                role: 'user'
            };
            setUser(newUser);
            localStorage.setItem('vetify_user', JSON.stringify(newUser));
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('vetify_user');
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
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

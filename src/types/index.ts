export type UserRole = 'user' | 'vet' | 'admin';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

export interface Vet extends User {
    role: 'vet';
    clinicName: string;
    address: string;
    description: string;
    image: string;
    latitude: number;
    longitude: number;
    services: string[];
    rating: number;
    reviews: number;
    phone: string;
    website?: string;
    isSubscribed: boolean;
    subscriptionExpiry?: string;
    workingHours: WorkingHours;
    specialty?: string;
    location?: string;
}

export interface DaySchedule {
    isOpen: boolean;
    start: string; // "09:00"
    end: string;   // "17:00"
}

export interface WorkingHours {
    monday: DaySchedule;
    tuesday: DaySchedule;
    wednesday: DaySchedule;
    thursday: DaySchedule;
    friday: DaySchedule;
    saturday: DaySchedule;
    sunday: DaySchedule;
}

export interface TimeSlot {
    id: string;
    vetId: string;
    date: string; // ISO Date string (YYYY-MM-DD)
    time: string; // HH:mm
    isAvailable: boolean;
}

export type BookingStatus = 'pending' | 'confirmed' | 'rejected' | 'completed';

export interface Booking {
    id: string;
    userId: string;
    vetId: string;
    userName: string;
    userEmail: string;
    petName: string;
    service: string;
    date: string; // ISO Date string
    time: string;
    status: BookingStatus;
    notes?: string;
    createdAt: string;
}

export interface Review {
    id: string;
    vetId: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
    bookingId: string;
}

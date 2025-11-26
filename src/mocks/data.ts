import type { Vet, Booking } from '../types';

const DEFAULT_WORKING_HOURS = {
    monday: { isOpen: true, start: '09:00', end: '17:00' },
    tuesday: { isOpen: true, start: '09:00', end: '17:00' },
    wednesday: { isOpen: true, start: '09:00', end: '17:00' },
    thursday: { isOpen: true, start: '09:00', end: '17:00' },
    friday: { isOpen: true, start: '09:00', end: '17:00' },
    saturday: { isOpen: false, start: '09:00', end: '17:00' },
    sunday: { isOpen: false, start: '09:00', end: '17:00' }
};

export const MOCK_VETS: Vet[] = [
    {
        id: 'v1',
        name: 'Dr. Sarah Wilson',
        email: 'sarah.wilson@vetify.com',
        role: 'vet',
        clinicName: 'Paws & Claws Veterinary Clinic',
        address: '123 Pet Lane, San Francisco, CA 94110',
        description: 'Experienced veterinarian with a passion for small animal care. Specializing in preventive medicine and surgery.',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
        latitude: 37.7749,
        longitude: -122.4194,
        services: ['General Checkup', 'Vaccination', 'Dental Cleaning', 'Surgery'],
        rating: 4.8,
        reviews: 124,
        phone: '(415) 555-0123',
        website: 'https://pawsandclawsvet.com',
        isSubscribed: true,
        workingHours: DEFAULT_WORKING_HOURS
    },
    {
        id: 'v2',
        name: 'Dr. Michael Chen',
        email: 'michael.chen@vetify.com',
        role: 'vet',
        clinicName: 'Golden Gate Animal Hospital',
        address: '456 Bay Street, San Francisco, CA 94133',
        description: 'Compassionate care for your furry friends. 15 years of experience in emergency and critical care.',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300',
        latitude: 37.8044,
        longitude: -122.4124,
        services: ['Emergency Care', 'Internal Medicine', 'Ultrasound'],
        rating: 4.9,
        reviews: 89,
        phone: '(415) 555-0456',
        isSubscribed: true,
        workingHours: DEFAULT_WORKING_HOURS
    },
    {
        id: 'v3',
        name: 'Dr. Emily Rodriguez',
        email: 'emily.rodriguez@vetify.com',
        role: 'vet',
        clinicName: 'Mission District Vet',
        address: '789 Mission St, San Francisco, CA 94103',
        description: 'Holistic approach to pet health. Integrating traditional medicine with alternative therapies.',
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300',
        latitude: 37.7600,
        longitude: -122.4148,
        services: ['Acupuncture', 'Nutrition Counseling', 'Wellness Exams'],
        rating: 4.7,
        reviews: 56,
        phone: '(415) 555-0789',
        isSubscribed: true,
        workingHours: DEFAULT_WORKING_HOURS
    },
    {
        id: 'v4',
        name: 'Dr. James Thompson',
        email: 'james.thompson@vetify.com',
        role: 'vet',
        clinicName: 'Sunset Veterinary Care',
        address: '321 Sunset Blvd, San Francisco, CA 94122',
        description: 'Dedicated to providing high-quality medical care for pets in the Sunset district.',
        image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300',
        latitude: 37.7562,
        longitude: -122.4756,
        services: ['Dermatology', 'Allergy Testing', 'Microchipping'],
        rating: 4.6,
        reviews: 42,
        phone: '(415) 555-0321',
        isSubscribed: true,
        workingHours: DEFAULT_WORKING_HOURS
    },
    {
        id: 'v5',
        name: 'Dr. Lisa Wang',
        email: 'lisa.wang@vetify.com',
        role: 'vet',
        clinicName: 'Downtown Pet Clinic',
        address: '555 Market St, San Francisco, CA 94105',
        description: 'Conveniently located in downtown for all your pet care needs.',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
        latitude: 37.7897,
        longitude: -122.3996,
        services: ['Vaccination', 'Spay/Neuter', 'Parasite Control'],
        rating: 4.5,
        reviews: 38,
        phone: '(415) 555-0555',
        isSubscribed: true,
        workingHours: DEFAULT_WORKING_HOURS
    }
];

export const MOCK_BOOKINGS: Booking[] = [
    {
        id: 'b1',
        userId: 'u1',
        vetId: 'v1',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        petName: 'Max',
        service: 'General Checkup',
        date: '2025-12-01',
        time: '10:00',
        status: 'confirmed',
        notes: 'Annual vaccination due',
        createdAt: '2025-11-20T10:00:00Z'
    },
    {
        id: 'b2',
        userId: 'u1',
        vetId: 'v2',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        petName: 'Max',
        service: 'X-Ray',
        date: '2025-12-05',
        time: '14:30',
        status: 'pending',
        createdAt: new Date().toISOString()
    },
    {
        id: 'b3',
        userId: 'u2',
        vetId: 'v_demo',
        userName: 'Alice Smith',
        userEmail: 'alice@example.com',
        petName: 'Bella',
        service: 'General Checkup',
        date: '2025-12-10',
        time: '09:00',
        status: 'pending',
        notes: 'First time visit',
        createdAt: new Date().toISOString()
    },
    {
        id: 'b4',
        userId: 'u3',
        vetId: 'v_demo',
        userName: 'Bob Jones',
        userEmail: 'bob@example.com',
        petName: 'Charlie',
        service: 'Vaccination',
        date: '2025-12-11',
        time: '11:00',
        status: 'confirmed',
        createdAt: new Date().toISOString()
    }
];

export const MOCK_SLOTS: import('../types').TimeSlot[] = [
    { id: 's1', vetId: 'v1', date: '2025-11-26', time: '09:00', isAvailable: true },
    { id: 's2', vetId: 'v1', date: '2025-11-26', time: '10:00', isAvailable: true },
    { id: 's3', vetId: 'v1', date: '2025-11-26', time: '11:00', isAvailable: false }, // Booked
    { id: 's4', vetId: 'v1', date: '2025-11-26', time: '14:00', isAvailable: true },
    { id: 's5', vetId: 'v2', date: '2025-11-26', time: '09:30', isAvailable: true },
    { id: 's6', vetId: 'v2', date: '2025-11-26', time: '10:30', isAvailable: true },
];

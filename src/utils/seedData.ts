import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Vet } from '../types';

export const seedDatabase = async () => {
    try {
        // Clear existing vets (optional, be careful in production)
        // const vetsSnapshot = await getDocs(collection(db, 'vets'));
        // vetsSnapshot.forEach(async (doc) => {
        //     await deleteDoc(doc.ref);
        // });

        const mockVets: Vet[] = [
            {
                id: 'vet1',
                name: 'Dr. Sarah Wilson',
                email: 'sarah@pawsome.com',
                role: 'vet',
                clinicName: 'Pawsome Care Clinic',
                address: '123 Pet Street, New York, NY',
                description: 'Experienced veterinarian with a passion for small animals.',
                image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
                latitude: 40.7128,
                longitude: -74.0060,
                services: ['General Checkup', 'Vaccination', 'Surgery'],
                rating: 4.8,
                reviews: 124,
                phone: '+1 555-0123',
                isSubscribed: true,
                workingHours: {
                    monday: { isOpen: true, start: "09:00", end: "17:00" },
                    tuesday: { isOpen: true, start: "09:00", end: "17:00" },
                    wednesday: { isOpen: true, start: "09:00", end: "17:00" },
                    thursday: { isOpen: true, start: "09:00", end: "17:00" },
                    friday: { isOpen: true, start: "09:00", end: "17:00" },
                    saturday: { isOpen: true, start: "10:00", end: "14:00" },
                    sunday: { isOpen: false, start: "09:00", end: "17:00" }
                }
            },
            {
                id: 'vet2',
                name: 'Dr. Michael Chen',
                email: 'michael@cityvet.com',
                role: 'vet',
                clinicName: 'City Vet Hospital',
                address: '456 Park Ave, New York, NY',
                description: 'Specialist in exotic pets and emergency care.',
                image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300',
                latitude: 40.7580,
                longitude: -73.9855,
                services: ['Emergency Care', 'Dental Cleaning', 'Exotic Pets'],
                rating: 4.9,
                reviews: 89,
                phone: '+1 555-0124',
                isSubscribed: false,
                workingHours: {
                    monday: { isOpen: true, start: "08:00", end: "20:00" },
                    tuesday: { isOpen: true, start: "08:00", end: "20:00" },
                    wednesday: { isOpen: true, start: "08:00", end: "20:00" },
                    thursday: { isOpen: true, start: "08:00", end: "20:00" },
                    friday: { isOpen: true, start: "08:00", end: "20:00" },
                    saturday: { isOpen: true, start: "09:00", end: "18:00" },
                    sunday: { isOpen: true, start: "09:00", end: "18:00" }
                }
            }
        ];

        for (const vet of mockVets) {
            await setDoc(doc(db, 'vets', vet.id), vet);
        }

        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
};

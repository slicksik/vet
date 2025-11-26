import React, { useState, useEffect } from 'react';
import { Clock, Save } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import type { WorkingHours, DaySchedule } from '../../types';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

const WorkingHoursSettings: React.FC = () => {
    const { user } = useAuth();
    const { vets, updateVetWorkingHours, addVet } = useData();
    const [hours, setHours] = useState<WorkingHours | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            const vet = vets.find(v => v.id === user.id);
            // Fallback to user's own working hours if not found in vets list
            // This handles cases where local storage might be out of sync
            const sourceOfTruth = vet || (user as import('../../types').Vet);

            if (sourceOfTruth && sourceOfTruth.workingHours) {
                // Only update if we don't have hours yet, or if the source of truth has changed
                // We avoid adding 'hours' to the dependency array to prevent overwriting local changes
                // when the user interacts with the form.
                setHours(prev => {
                    const newHoursStr = JSON.stringify(sourceOfTruth.workingHours);
                    const currentHoursStr = JSON.stringify(prev);

                    if (currentHoursStr !== newHoursStr) {
                        return sourceOfTruth.workingHours;
                    }
                    return prev;
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, vets]);

    const handleDayChange = (day: keyof WorkingHours, field: keyof DaySchedule, value: boolean | string) => {
        if (!hours) return;
        setHours(prev => {
            if (!prev) return null;
            return {
                ...prev,
                [day]: {
                    ...prev[day],
                    [field]: value
                }
            };
        });
    };

    const handleSave = () => {
        if (!user || !hours) return;
        setIsSaving(true);

        // Check if vet exists in DataContext
        const vetExists = vets.some(v => v.id === user.id);

        // Simulate API delay
        setTimeout(() => {
            if (!vetExists) {
                // If vet is missing from DataContext (e.g. cleared storage), add them back
                // We use the current user object combined with the new working hours
                const vetToAdd = { ...(user as import('../../types').Vet), workingHours: hours };
                addVet(vetToAdd);
            } else {
                updateVetWorkingHours(user.id, hours);
            }

            setIsSaving(false);
            alert('Working hours updated successfully!');
        }, 800);
    };

    if (!hours) return <div>Loading...</div>;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary-600" />
                    Working Hours
                </h2>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
            <div className="p-6">
                <div className="space-y-4">
                    {DAYS.map(day => (
                        <div key={day} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                            <div className="w-32">
                                <span className="text-sm font-medium text-gray-900 capitalize">{day}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={hours[day].isOpen}
                                            onChange={(e) => handleDayChange(day, 'isOpen', e.target.checked)}
                                        />
                                        <div className={`block w-10 h-6 rounded-full transition-colors ${hours[day].isOpen ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
                                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${hours[day].isOpen ? 'transform translate-x-4' : ''}`}></div>
                                    </div>
                                    <span className="ml-3 text-sm text-gray-500 w-16">{hours[day].isOpen ? 'Open' : 'Closed'}</span>
                                </label>

                                {hours[day].isOpen && (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="time"
                                            value={hours[day].start}
                                            onChange={(e) => handleDayChange(day, 'start', e.target.value)}
                                            className="block w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                                        />
                                        <span className="text-gray-400">-</span>
                                        <input
                                            type="time"
                                            value={hours[day].end}
                                            onChange={(e) => handleDayChange(day, 'end', e.target.value)}
                                            className="block w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WorkingHoursSettings;

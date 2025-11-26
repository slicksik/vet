import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import type { WorkingHours } from '../../types';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 24 }, (_, i) => i); // 0-23 hours
const START_HOUR = 8; // 8 AM
const END_HOUR = 20; // 8 PM
const DISPLAY_HOURS = HOURS.slice(START_HOUR, END_HOUR + 1);

interface AvailabilityCalendarProps {
    className?: string;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ className = '' }) => {
    const { user } = useAuth();
    const { bookings } = useData();
    const [currentWeekStart, setCurrentWeekStart] = useState(getMonday(new Date()));

    // Helper to get Monday of the current week
    function getMonday(d: Date) {
        d = new Date(d);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        const monday = new Date(d.setDate(diff));
        monday.setHours(0, 0, 0, 0);
        return monday;
    }

    const getDatesOfWeek = (startDate: Date) => {
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const weekDates = getDatesOfWeek(currentWeekStart);

    const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const formatTime = (hour: number, minute: number) => {
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    };

    const isSlotAvailable = (timeStr: string, date: Date) => {
        if (!user || user.role !== 'vet') return false;
        const vet = user as import('../../types').Vet;

        if (!vet.workingHours) return false;

        const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayKey = dayKeys[date.getDay()] as keyof WorkingHours;
        const schedule = vet.workingHours[dayKey];

        if (!schedule.isOpen) return false;
        if (timeStr < schedule.start || timeStr >= schedule.end) return false;

        return true;
    };

    const getConfirmedBooking = (dateStr: string, timeStr: string) => {
        return bookings.find(b =>
            b.vetId === user?.id &&
            b.status === 'confirmed' &&
            b.date === dateStr &&
            b.time === timeStr
        );
    };

    const navigateWeek = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentWeekStart);
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        setCurrentWeekStart(newDate);
    };

    return (
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary-600" />
                    Your Schedule
                </h2>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 bg-primary-50 border border-primary-100 rounded-sm"></div>
                            <span>Working Hours</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 bg-green-100 border border-green-200 rounded-sm"></div>
                            <span>Booked</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 bg-gray-50 border border-gray-100 rounded-sm"></div>
                            <span>Closed</span>
                        </div>
                    </div>
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <button onClick={() => navigateWeek('prev')} className="p-1 hover:bg-white rounded-md transition-all shadow-sm">
                            <ChevronLeft className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="px-3 text-sm font-medium text-gray-700">
                            {weekDates[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {weekDates[6].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                        <button onClick={() => navigateWeek('next')} className="p-1 hover:bg-white rounded-md transition-all shadow-sm">
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                    {/* Days Header */}
                    <div className="grid grid-cols-8 border-b border-gray-200">
                        <div className="p-3 text-xs font-medium text-gray-400 text-center border-r border-gray-100 bg-gray-50">
                            Time
                        </div>
                        {weekDates.map((date, i) => (
                            <div key={i} className={`p-3 text-center border-r border-gray-100 bg-gray-50 ${date.toDateString() === new Date().toDateString() ? 'bg-primary-50/50' : ''
                                }`}>
                                <p className="text-xs font-medium text-gray-500 uppercase">{DAYS[date.getDay() === 0 ? 6 : date.getDay() - 1]}</p>
                                <p className={`text-sm font-bold mt-1 ${date.toDateString() === new Date().toDateString() ? 'text-primary-600' : 'text-gray-900'
                                    }`}>
                                    {date.getDate()}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Time Slots */}
                    <div className="max-h-[600px] overflow-y-auto select-none">
                        {DISPLAY_HOURS.map(hour => (
                            <React.Fragment key={hour}>
                                {/* :00 Slot */}
                                <div className="grid grid-cols-8 border-b border-gray-50 h-10">
                                    <div className="text-xs text-gray-400 text-right pr-3 pt-1 border-r border-gray-100 relative">
                                        <span className="-top-2 relative">{formatTime(hour, 0)}</span>
                                    </div>
                                    {weekDates.map((date, dayIndex) => {
                                        const dateStr = formatDate(date);
                                        const timeStr = formatTime(hour, 0);
                                        const booking = getConfirmedBooking(dateStr, timeStr);
                                        const available = isSlotAvailable(timeStr, date);

                                        return (
                                            <div
                                                key={`${dayIndex}-${hour}-00`}
                                                title={booking ? `Booked: ${booking.petName} (${booking.service})` : available ? 'Available' : 'Closed'}
                                                className={`border-r border-gray-100 transition-colors relative group ${booking
                                                    ? 'bg-green-100 border-green-200'
                                                    : available
                                                        ? 'bg-primary-50 hover:bg-primary-100'
                                                        : 'bg-gray-50/50'
                                                    }`}
                                            >
                                                {booking && (
                                                    <div className="hidden group-hover:flex absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap">
                                                        {booking.petName} - {booking.service}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                {/* :30 Slot */}
                                <div className="grid grid-cols-8 border-b border-gray-100 h-10">
                                    <div className="text-xs text-gray-300 text-right pr-3 pt-1 border-r border-gray-100">
                                    </div>
                                    {weekDates.map((date, dayIndex) => {
                                        const dateStr = formatDate(date);
                                        const timeStr = formatTime(hour, 30);
                                        const booking = getConfirmedBooking(dateStr, timeStr);
                                        const available = isSlotAvailable(timeStr, date);

                                        return (
                                            <div
                                                key={`${dayIndex}-${hour}-30`}
                                                title={booking ? `Booked: ${booking.petName} (${booking.service})` : available ? 'Available' : 'Closed'}
                                                className={`border-r border-gray-100 transition-colors relative group ${booking
                                                    ? 'bg-green-100 border-green-200'
                                                    : available
                                                        ? 'bg-primary-50 hover:bg-primary-100'
                                                        : 'bg-gray-50/50'
                                                    }`}
                                            >
                                                {booking && (
                                                    <div className="hidden group-hover:flex absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap">
                                                        {booking.petName} - {booking.service}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
                <p>This view reflects your configured Working Hours. To change your availability, go to the "Working Hours" tab.</p>
            </div>
        </div>
    );
};

export default AvailabilityCalendar;

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import type { WorkingHours, Booking } from '../../types';

const DAYS_MAP = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface BookingCalendarProps {
    workingHours: WorkingHours;
    bookings: Booking[];
    selectedSlot: { date: string; time: string } | null;
    onSelectSlot: (slot: { date: string; time: string }) => void;
    className?: string;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ workingHours, bookings, selectedSlot, onSelectSlot, className = '' }) => {
    const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
    const [expanded, setExpanded] = useState(false);

    // Generate next 7 days starting from currentWeekStart
    const weekDates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(currentWeekStart);
        date.setDate(currentWeekStart.getDate() + i);
        return date;
    });

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const isSlotAvailable = (dateStr: string, timeStr: string, date: Date) => {
        const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayKey = dayKeys[date.getDay()] as keyof WorkingHours;
        const schedule = workingHours[dayKey];

        if (!schedule.isOpen) return false;
        if (timeStr < schedule.start || timeStr >= schedule.end) return false;

        return !bookings.some(b =>
            b.date === dateStr &&
            b.time === timeStr &&
            b.status === 'confirmed'
        );
    };

    const getSlotsForDate = (date: Date) => {
        const slots = [];
        const dateStr = formatDate(date);

        // Generate slots every 30 minutes from 08:00 to 20:00 (or based on working hours)
        // For simplicity and to match the image style, we'll generate a fixed set and filter
        for (let hour = 8; hour <= 20; hour++) {
            for (let min = 0; min < 60; min += 30) {
                const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
                if (isSlotAvailable(dateStr, timeStr, date)) {
                    slots.push({ time: timeStr, date: dateStr });
                }
            }
        }
        return slots;
    };

    const navigateWeek = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentWeekStart);
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        setCurrentWeekStart(newDate);
    };

    const formatDayHeader = (date: Date) => {
        const dayName = DAYS_MAP[date.getDay()];
        const dayNum = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return {
            name: dayName,
            date: `${dayNum}/${month}/${year}`
        };
    };

    return (
        <div className={`bg-white ${className}`}>
            {/* Navigation Header */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => navigateWeek('prev')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    disabled={currentWeekStart <= new Date()}
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex-1 grid grid-cols-7 gap-2 text-center">
                    {weekDates.map((date, i) => {
                        const { name, date: dateStr } = formatDayHeader(date);
                        return (
                            <div key={i} className="flex flex-col items-center">
                                <span className="text-sm font-medium text-gray-700">{name}</span>
                                <span className="text-xs text-gray-500">{dateStr}</span>
                            </div>
                        );
                    })}
                </div>

                <button
                    onClick={() => navigateWeek('next')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Slots Grid */}
            <div className="grid grid-cols-7 gap-2 mb-4">
                {weekDates.map((date, i) => {
                    const allSlots = getSlotsForDate(date);
                    const visibleSlots = expanded ? allSlots : allSlots.slice(0, 5); // Show 5 initially

                    return (
                        <div key={i} className="flex flex-col gap-2">
                            {visibleSlots.length > 0 ? (
                                visibleSlots.map((slot) => (
                                    <button
                                        key={`${slot.date}-${slot.time}`}
                                        onClick={() => onSelectSlot(slot)}
                                        className={`
                                            py-2 px-1 text-sm font-medium rounded transition-all text-center
                                            ${selectedSlot?.date === slot.date && selectedSlot?.time === slot.time
                                                ? 'bg-primary-600 text-white shadow-md'
                                                : 'text-primary-600 hover:bg-primary-50'
                                            }
                                        `}
                                    >
                                        {slot.time}
                                    </button>
                                ))
                            ) : (
                                <div className="h-8"></div> // Spacer for empty columns
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Expand/Collapse Toggle */}
            <div className="flex justify-center border-t border-gray-100 pt-4">
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-primary-600 transition-colors uppercase tracking-wide"
                >
                    {expanded ? 'LESS HOURS' : 'MORE HOURS'}
                    {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
};

export default BookingCalendar;


// components/modals/FindTimeModal.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { Service, Staff, Appointment } from '../../types';
import Button from '../ui/Button';
import { START_HOUR, END_HOUR, TIME_STEP_MIN } from '../../pages/CalendarPage';

interface FindTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSlotSelect: (startTime: Date, serviceIds: string[]) => void;
  services: Service[];
  staff: Staff;
  appointments: Appointment[];
  currentDate: Date;
}

/**
 * A robust, timeline-based algorithm to find available slots.
 * It creates a minute-by-minute timeline for the day, marks unavailable
 * times, and then finds contiguous blocks of free time.
 * @param date The local date to search for slots.
 * @param totalDuration The required duration in minutes.
 * @param staffId The ID of the staff member.
 * @param allAppointments An array of all existing appointments.
 * @returns An array of Date objects for available start times.
 */
const findAvailableSlots = (
    date: Date,
    totalDuration: number,
    staffId: string,
    allAppointments: Appointment[]
): Date[] => {
    const availableSlots: Date[] = [];
    if (totalDuration <= 0) return availableSlots;

    const totalMinutesInDay = 24 * 60;
    const timeline = new Array(totalMinutesInDay).fill(false);

    // 1. Mark working hours as available
    const workStartMinute = START_HOUR * 60;
    const workEndMinute = END_HOUR * 60;
    for (let i = workStartMinute; i < workEndMinute; i++) {
        timeline[i] = true;
    }

    // 2. Filter appointments for the local day and mark them as unavailable
    const staffAppointments = allAppointments.filter(a => {
        const appDate = new Date(a.start_at);
        // Compare using toDateString to correctly handle timezone differences
        // and match appointments to the local calendar day.
        return a.staff_id === staffId && appDate.toDateString() === date.toDateString();
    });

    staffAppointments.forEach(app => {
        const appStart = new Date(app.start_at);
        const appEnd = new Date(app.end_at);
        
        // Use local hours/minutes to block out time on the local timeline
        const startMinute = appStart.getHours() * 60 + appStart.getMinutes();
        const endMinute = appEnd.getHours() * 60 + appEnd.getMinutes();
        
        for (let i = startMinute; i < endMinute; i++) {
            if (i < timeline.length) {
                timeline[i] = false;
            }
        }
    });

    // 3. Find contiguous blocks of available time
    const requiredMinutes = totalDuration;
    for (let i = workStartMinute; i <= workEndMinute - requiredMinutes; i += TIME_STEP_MIN) {
        let isSlotAvailable = true;
        // Check if the entire duration from the current point is available
        for (let j = 0; j < requiredMinutes; j++) {
            if (!timeline[i + j]) {
                isSlotAvailable = false;
                break;
            }
        }

        if (isSlotAvailable) {
            const slotDate = new Date(date);
            const hour = Math.floor(i / 60);
            const minute = i % 60;
            slotDate.setHours(hour, minute, 0, 0);
            availableSlots.push(slotDate);
        }
    }
    
    return availableSlots;
};


const FindTimeModal: React.FC<FindTimeModalProps> = ({ isOpen, onClose, onSlotSelect, services, staff, appointments, currentDate }) => {
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([currentDate.toISOString().split('T')[0]]);
  const [availableSlots, setAvailableSlots] = useState<{[key: string]: Date[]}>({});
  const [isSearching, setIsSearching] = useState(false);
  
  const next7Days = useMemo(() => {
    return Array.from({length: 7}).map((_, i) => {
        const d = new Date(currentDate);
        d.setHours(0,0,0,0);
        d.setDate(d.getDate() + i);
        return d;
    });
  }, [currentDate]);

  // Reset state on modal open
  useEffect(() => {
    if(isOpen) {
        setSelectedDates([currentDate.toISOString().split('T')[0]]);
        setAvailableSlots({});
        setSelectedServiceIds([]);
    }
  }, [isOpen, currentDate]);

  const totalDuration = useMemo(() => {
    return services
      .filter(s => selectedServiceIds.includes(s.id))
      .reduce((acc, s) => acc + s.base_duration_min + s.buffer_cleanup_min, 0);
  }, [services, selectedServiceIds]);

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServiceIds(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };
  
  const handleDateToggle = (dateStr: string) => {
    setSelectedDates(prev => 
        prev.includes(dateStr)
        ? prev.filter(d => d !== dateStr)
        : [...prev, dateStr]
    );
  };
  
  const handleSearch = () => {
    if (selectedServiceIds.length === 0) {
        alert("Пожалуйста, выберите хотя бы одну услугу.");
        return;
    }
    setIsSearching(true);
    setAvailableSlots({}); 
    // Parse date string as local time by adding T00:00:00 to avoid timezone shifts.
    const datesToSearch = selectedDates.length > 0 ? selectedDates.map(dStr => new Date(dStr + 'T00:00:00')) : next7Days;
    
    setTimeout(() => { 
        const allFoundSlots: {[key: string]: Date[]} = {};
        datesToSearch.forEach(date => {
            const slotsForDate = findAvailableSlots(date, totalDuration, staff.id, appointments);
            if(slotsForDate.length > 0){
                allFoundSlots[date.toISOString().split('T')[0]] = slotsForDate;
            }
        });

        setAvailableSlots(allFoundSlots);
        setIsSearching(false);
    }, 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Подобрать свободное время</h2>
        
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
            {/* Left Panel: Controls */}
            <div className="flex flex-col h-full">
                {/* Scrollable area for controls */}
                <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">1. Выберите услуги</label>
                        <div className="mt-2 space-y-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md">
                            {services.map(service => (
                                <label key={service.id} className="flex items-center space-x-3 p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <input type="checkbox" checked={selectedServiceIds.includes(service.id)} onChange={() => handleServiceToggle(service.id)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                    <span className="text-sm">{service.name}</span>
                                </label>
                            ))}
                        </div>
                        {totalDuration > 0 && <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">Общая длительность: {totalDuration} мин</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">2. Выберите даты</label>
                        <div className="mt-2 grid grid-cols-2 gap-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md">
                            {next7Days.map(day => {
                                const dateStr = day.toISOString().split('T')[0];
                                return (
                                    <label key={dateStr} className="flex items-center space-x-3 p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <input type="checkbox" checked={selectedDates.includes(dateStr)} onChange={() => handleDateToggle(dateStr)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                        <span className="text-sm">{day.toLocaleDateString('ru-RU', {weekday: 'short', day: 'numeric', month: 'short'})}</span>
                                    </label>
                                );
                            })}
                        </div>
                        <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">Если даты не выбраны, поиск будет по ближайшей неделе.</p>
                    </div>
                </div>
                {/* Action button area */}
                <div className="flex-shrink-0 pt-4">
                    <Button onClick={handleSearch} isLoading={isSearching} className="w-full">Найти</Button>
                </div>
            </div>


            {/* Right Panel: Results */}
            <div className="flex flex-col min-h-0">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white flex-shrink-0">Доступные слоты:</h3>
                <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                    {isSearching && <p className="text-center text-gray-500 dark:text-gray-400 py-4">Идет поиск...</p>}
                    {!isSearching && Object.keys(availableSlots).length === 0 && (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-4">Нет доступных слотов для выбранных услуг и дат. Попробуйте изменить параметры поиска.</p>
                    )}
                    {Object.keys(availableSlots).map(dateStr => (
                        <div key={dateStr}>
                           <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">{new Date(dateStr + 'T00:00:00').toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}</h4>
                           <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {availableSlots[dateStr].map(slot => {
                                    const endSlot = new Date(slot);
                                    endSlot.setMinutes(endSlot.getMinutes() + totalDuration);
                                    const startTimeStr = slot.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'});
                                    const endTimeStr = endSlot.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'});
                                    return (
                                    <Button 
                                        key={slot.toISOString()} 
                                        variant="secondary" 
                                        size="sm" 
                                        onClick={() => onSlotSelect(slot, selectedServiceIds)}
                                        className="!justify-center text-center"
                                    >
                                        {`${startTimeStr} - ${endTimeStr}`}
                                    </Button>
                                    );
                                })}
                           </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="mt-6 flex justify-end border-t dark:border-gray-700 pt-4 flex-shrink-0">
          <Button variant="secondary" onClick={onClose}>Закрыть</Button>
        </div>
      </div>
    </div>
  );
};

export default FindTimeModal;
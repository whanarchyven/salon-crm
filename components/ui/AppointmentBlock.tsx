
// components/ui/AppointmentBlock.tsx

import React, { useMemo } from 'react';
import { Appointment, Service } from '../../types';
import { PIXELS_PER_MINUTE, START_HOUR } from '../../pages/CalendarPage';

interface AppointmentBlockProps {
    appointment: Appointment;
    services: Service[];
    onClick: (appointment: Appointment) => void;
}

const AppointmentBlock: React.FC<AppointmentBlockProps> = ({ appointment, services, onClick }) => {
    
    const appointmentServices = useMemo(() => 
        services.filter(s => appointment.service_ids.includes(s.id)),
        [services, appointment.service_ids]
    );
    
    const totalDuration = useMemo(() => {
        if (appointmentServices.length === 0) {
            // Fallback if services data is not available, use end_at
            return (new Date(appointment.end_at).getTime() - new Date(appointment.start_at).getTime()) / (1000 * 60);
        }
        return appointmentServices.reduce((acc, s) => acc + s.base_duration_min + s.buffer_cleanup_min, 0);
    }, [appointmentServices, appointment]);


    if (totalDuration === 0) return null;

    const start = new Date(appointment.start_at);
    // Use local hours for positioning, as the calendar grid is based on local time.
    const top = ((start.getHours() - START_HOUR) * 60 + start.getMinutes()) * PIXELS_PER_MINUTE;
    
    const height = totalDuration * PIXELS_PER_MINUTE;

    return (
        <button
            onClick={() => onClick(appointment)}
            className="absolute left-2 right-2 rounded-lg overflow-hidden shadow-md z-10 group text-left w-[calc(100%-1rem)]"
            style={{ top: `${top}px`, height: `${height}px` }}
        >
            <div className="h-full w-full bg-indigo-500 dark:bg-indigo-600 p-2 text-white text-xs flex flex-col justify-start hover:bg-indigo-600 dark:hover:bg-indigo-700 transition-colors">
                <p className="font-bold truncate">{appointment.client_name}</p>
                <p className="opacity-80 leading-tight">{appointment.service_names.join(', ')}</p>
            </div>
            
            <div className="absolute top-1 right-1 text-xs text-indigo-200 font-mono pointer-events-none">
                {`${start.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})}`}
            </div>
        </button>
    );
};

export default AppointmentBlock;
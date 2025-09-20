
// pages/CalendarPage.tsx

import React, { useState, useEffect } from 'react';
import { Appointment, Staff, Service, Client } from '../types';
import { getAppointments, getStaff, getServices, getClients, addAppointment, updateAppointment, deleteAppointment } from '../services/mockApiService';
import Button from '../components/ui/Button';
import AddAppointmentModal from '../components/modals/AddAppointmentModal';
import EditAppointmentModal from '../components/modals/EditAppointmentModal';
import AppointmentBlock from '../components/ui/AppointmentBlock';
import { PlusCircleIcon } from '@heroicons/react/24/solid';

// Constants for calendar display
export const START_HOUR = 9;
export const END_HOUR = 21;
export const TIME_STEP_MIN = 5;
export const PIXELS_PER_MINUTE = 2;

const TimeRuler: React.FC = () => {
    const hours = [];
    for (let i = START_HOUR; i < END_HOUR; i++) {
        hours.push(i);
    }
    return (
        <div className="relative">
            {hours.map(hour => (
                <div key={hour} className="h-[120px] relative border-t border-gray-200 dark:border-gray-700">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-1">{`${hour}:00`}</span>
                </div>
            ))}
             <div className="h-px relative border-t border-gray-200 dark:border-gray-700">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-1">{`${END_HOUR}:00`}</span>
            </div>
        </div>
    );
};


const CalendarPage: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    
    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    // Data for modals
    const [newAppointmentData, setNewAppointmentData] = useState<{time: Date, services: string[]}>({time: new Date(), services: []});
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    
    const fetchData = async () => {
        setLoading(true);
        const [appointmentData, staffData, serviceData, clientData] = await Promise.all([
            getAppointments(),
            getStaff(),
            getServices(),
            getClients()
        ]);
        setAppointments(appointmentData);
        setStaff(staffData.filter(s => s.role === 'master'));
        setServices(serviceData);
        setClients(clientData);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDateChange = (days: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() + days);
            return newDate;
        });
    };

    const handleSlotClick = (slotTime: Date) => {
        setNewAppointmentData({ time: slotTime, services: [] });
        setIsAddModalOpen(true);
    };
    
    const handleAppointmentClick = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setIsEditModalOpen(true);
    };

    const handleSaveAppointment = async (appointmentData: Omit<Appointment, 'id' | 'client_name' | 'service_names' | 'staff_name' | 'end_at' | 'status'>) => {
        await addAppointment(appointmentData);
        setIsAddModalOpen(false);
        fetchData(); // Refetch all data to show new appointment
    };
    
    const handleUpdateAppointment = async (appointmentId: string, updates: { client_id: string; service_ids: string[] }) => {
        await updateAppointment(appointmentId, updates);
        setIsEditModalOpen(false);
        fetchData();
    };

    const handleDeleteAppointment = async (appointmentId: string) => {
        await deleteAppointment(appointmentId);
        setIsEditModalOpen(false);
        fetchData();
    };

    const master = staff[0];

    if (loading) {
        return <div className="text-center py-10">Загрузка календаря...</div>;
    }

    if (!master) {
        return <div className="text-center py-10">Нет доступных мастеров. Добавьте Елену в систему.</div>;
    }

    return (
        <div className="flex flex-col h-full">
            <AddAppointmentModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleSaveAppointment}
                startTime={newAppointmentData.time}
                clients={clients}
                services={services}
                staff={master}
                preselectedServiceIds={newAppointmentData.services}
            />
            {selectedAppointment && (
                <EditAppointmentModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleUpdateAppointment}
                    onDelete={handleDeleteAppointment}
                    appointment={selectedAppointment}
                    clients={clients}
                    services={services}
                />
            )}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Календарь записей</h1>
                 <div className="flex-grow flex justify-center items-center gap-4">
                    <Button variant="secondary" onClick={() => handleDateChange(-1)}>‹ Пред.</Button>
                    <h2 className="text-xl font-semibold text-center">{currentDate.toLocaleDateString('ru-RU', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
                    <Button variant="secondary" onClick={() => handleDateChange(1)}>След. ›</Button>
                </div>
            </div>
            
            <div className="flex-1 overflow-auto bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                <div className="flex">
                    <div className="w-16"></div>
                    <div className="flex-1 text-center font-bold pb-2 border-b-2 dark:border-gray-600">{master.name}</div>
                </div>
                <div className="flex">
                    <div className="w-16"><TimeRuler /></div>
                    <div className="flex-1 border-l dark:border-gray-700 relative">
                        {Array.from({ length: (END_HOUR - START_HOUR) * (60 / TIME_STEP_MIN) }).map((_, i) => {
                             const slotTime = new Date(currentDate);
                             slotTime.setHours(START_HOUR, i * TIME_STEP_MIN, 0, 0);
                            return (
                                <div
                                    key={i}
                                    onClick={() => handleSlotClick(slotTime)}
                                    className={`absolute w-full border-t cursor-pointer group hover:bg-indigo-500/10 ${ (i * TIME_STEP_MIN % 60 === 0) ? 'border-gray-300 dark:border-gray-600' : 'border-dashed border-gray-100 dark:border-gray-700/50'}`}
                                    style={{ top: `${i * TIME_STEP_MIN * PIXELS_PER_MINUTE}px`, height: `${TIME_STEP_MIN * PIXELS_PER_MINUTE}px` }}
                                >
                                  <span className="absolute z-20 top-1/2 left-2 -translate-y-1/2 text-xs text-indigo-600 opacity-0 group-hover:opacity-100 bg-white dark:bg-gray-800 px-1 rounded">{slotTime.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})}</span>
                                  <PlusCircleIcon className="h-5 w-5 text-indigo-400 opacity-0 group-hover:opacity-100 absolute top-1/2 right-2 -translate-y-1/2" />
                                </div>
                            )
                        })}
                        {appointments
                            .filter(a => a.staff_id === master.id && new Date(a.start_at).toDateString() === currentDate.toDateString())
                            .map(a => <AppointmentBlock key={a.id} appointment={a} services={services} onClick={handleAppointmentClick} />)
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
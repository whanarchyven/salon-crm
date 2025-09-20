
// components/modals/EditAppointmentModal.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { Client, Service, Appointment } from '../../types';
import Button from '../ui/Button';

interface EditAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointmentId: string, updates: { client_id: string; service_ids: string[] }) => void;
  onDelete: (appointmentId: string) => void;
  appointment: Appointment;
  clients: Client[];
  services: Service[];
}

const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({ isOpen, onClose, onSave, onDelete, appointment, clients, services }) => {
  const [selectedClientId, setSelectedClientId] = useState<string>(appointment.client_id);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(appointment.service_ids);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedClientId(appointment.client_id);
      setSelectedServiceIds(appointment.service_ids);
      setIsDeleting(false); // Reset delete confirmation on open
    }
  }, [isOpen, appointment]);

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServiceIds(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const selectedServices = useMemo(() => {
    return services.filter(s => selectedServiceIds.includes(s.id));
  }, [services, selectedServiceIds]);

  const totalDuration = useMemo(() => {
    return selectedServices.reduce((acc, s) => acc + s.base_duration_min + s.buffer_cleanup_min, 0);
  }, [selectedServices]);

  const startTime = useMemo(() => new Date(appointment.start_at), [appointment.start_at]);
  const endTime = useMemo(() => {
    const end = new Date(startTime);
    end.setMinutes(end.getMinutes() + totalDuration);
    return end;
  }, [startTime, totalDuration]);

  const handleSubmit = () => {
    if (!selectedClientId || selectedServiceIds.length === 0) {
      alert('Пожалуйста, выберите клиента и хотя бы одну услугу.');
      return;
    }
    onSave(appointment.id, {
      client_id: selectedClientId,
      service_ids: selectedServiceIds,
    });
  };

  const handleDelete = () => {
    if(isDeleting) {
      onDelete(appointment.id);
    } else {
      setIsDeleting(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Редактировать запись</h2>
        <div className="space-y-4">
          <p className="block text-sm font-medium text-gray-700 dark:text-gray-300">Мастер: <span className="font-semibold">{appointment.staff_name}</span></p>
          <div>
            <label htmlFor="client-edit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Клиент</label>
            <select
              id="client-edit"
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
            >
              {clients.map(client => <option key={client.id} value={client.id}>{client.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Услуги</label>
            <div className="mt-2 max-h-48 overflow-y-auto space-y-2 p-2 border border-gray-300 dark:border-gray-600 rounded-md">
                {services.map(service => (
                    <label key={service.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                        <input
                            type="checkbox"
                            checked={selectedServiceIds.includes(service.id)}
                            onChange={() => handleServiceToggle(service.id)}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-900 dark:text-gray-200">{service.name} <span className="text-gray-500">({service.base_duration_min} мин)</span></span>
                    </label>
                ))}
            </div>
          </div>
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md text-sm">
            <p><strong>Время начала:</strong> {startTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</p>
            <p><strong>Новое время окончания:</strong> {endTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-between items-center gap-4">
          <Button 
            variant="danger" 
            onClick={handleDelete}
            onMouseLeave={() => setIsDeleting(false)}
          >
            {isDeleting ? "Подтвердить?" : "Удалить запись"}
          </Button>
          <div className="flex gap-4">
             <Button variant="secondary" onClick={onClose}>Отмена</Button>
             <Button onClick={handleSubmit}>Сохранить изменения</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAppointmentModal;
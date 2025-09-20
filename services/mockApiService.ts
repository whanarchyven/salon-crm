
// services/mockApiService.ts

import { Client, Service, Staff, Appointment, Reminder, Communication, Channel, ReminderStatus, AppointmentStatus } from '../types';

let MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'Анна Иванова', phone: '+79261234567', email: 'anna@example.com', consents: { marketing_email: true, marketing_sms: true }, preferred_channel: Channel.EMAIL, tags: ['VIP', 'Длинные волосы'], notes: 'Предпочитает кофе без сахара.', cadence_default_days: 30, last_visit_at: '2024-06-15T14:00:00Z', next_contact_at: '2024-07-15T10:00:00Z', status: 'active' },
  { id: '2', name: 'Мария Петрова', phone: '+79167654321', email: 'maria@example.com', consents: { marketing_email: false, marketing_sms: true }, preferred_channel: Channel.SMS, tags: ['Новый клиент'], notes: '', cadence_default_days: 45, last_visit_at: '2024-05-20T11:30:00Z', next_contact_at: '2024-07-04T11:00:00Z', status: 'active' },
  { id: '3', name: 'Ольга Сидорова', phone: '+79031112233', email: 'olga@example.com', consents: { marketing_email: true, marketing_sms: false }, preferred_channel: Channel.CALL, tags: [], notes: 'Сложное окрашивание, требует консультации.', cadence_default_days: 90, last_visit_at: '2024-04-10T16:00:00Z', next_contact_at: '2024-07-09T12:00:00Z', status: 'active' },
  { id: '4', name: 'John Doe', phone: '+14155552671', email: 'john@example.com', consents: { marketing_email: true, marketing_sms: true }, preferred_channel: Channel.EMAIL, tags: ['Frequent Visitor'], notes: 'Likes to chat.', cadence_default_days: 21, last_visit_at: '2024-06-25T10:00:00Z', next_contact_at: '2024-07-16T10:00:00Z', status: 'paused' },
];

let MOCK_SERVICES: Service[] = [
  { id: 's1', name: 'Стрижка и укладка', base_duration_min: 60, buffer_cleanup_min: 5, default_cadence_days: 45 },
  { id: 's2', name: 'Маникюр с покрытием', base_duration_min: 90, buffer_cleanup_min: 10, default_cadence_days: 21 },
  { id: 's3', name: 'Сложное окрашивание', base_duration_min: 180, buffer_cleanup_min: 15, default_cadence_days: 90 },
  { id: 's4', name: 'Коррекция бровей', base_duration_min: 30, buffer_cleanup_min: 5, default_cadence_days: 30 },
];

let MOCK_STAFF: Staff[] = [
  { id: 'st1', name: 'Елена', role: 'master' },
];

const today = new Date();
const todayStr = today.toISOString().split('T')[0];

let MOCK_APPOINTMENTS: Appointment[] = [
  // Existing appointments
  { id: 'a1', client_id: '1', client_name: 'Анна Иванова', service_ids: ['s1'], service_names: ['Стрижка и укладка'], staff_id: 'st1', staff_name: 'Елена', start_at: `${todayStr}T10:00:00Z`, end_at: `${todayStr}T11:05:00Z`, status: AppointmentStatus.PLANNED },
  { id: 'a3', client_id: '3', client_name: 'Ольга Сидорова', service_ids: ['s3'], service_names: ['Сложное окрашивание'], staff_id: 'st1', staff_name: 'Елена', start_at: `${todayStr}T12:00:00Z`, end_at: `${todayStr}T15:15:00Z`, status: AppointmentStatus.PLANNED },
  { id: 'a5', client_id: '4', client_name: 'John Doe', service_ids: ['s1'], service_names: ['Стрижка и укладка'], staff_id: 'st1', staff_name: 'Елена', start_at: `${todayStr}T16:00:00Z`, end_at: `${todayStr}T17:05:00Z`, status: AppointmentStatus.PLANNED },

  // New appointments for better testing
  { id: 'a6', client_id: '2', client_name: 'Мария Петрова', service_ids: ['s4'], service_names: ['Коррекция бровей'], staff_id: 'st1', staff_name: 'Елена', start_at: `${todayStr}T09:00:00Z`, end_at: `${todayStr}T09:35:00Z`, status: AppointmentStatus.PLANNED },
  { id: 'a7', client_id: '1', client_name: 'Анна Иванова', service_ids: ['s4'], service_names: ['Коррекция бровей'], staff_id: 'st1', staff_name: 'Елена', start_at: `${todayStr}T11:10:00Z`, end_at: `${todayStr}T11:45:00Z`, status: AppointmentStatus.PLANNED },
  { id: 'a8', client_id: '2', client_name: 'Мария Петрова', service_ids: ['s2'], service_names: ['Маникюр с покрытием'], staff_id: 'st1', staff_name: 'Елена', start_at: `${todayStr}T17:15:00Z`, end_at: `${todayStr}T18:55:00Z`, status: AppointmentStatus.PLANNED },
];

let MOCK_REMINDERS: Reminder[] = [
  { id: 'r1', client_id: '2', client_name: 'Мария Петрова', due_at: '2024-07-04T11:00:00Z', channel: Channel.SMS, priority: 1, status: ReminderStatus.NEW },
  { id: 'r2', client_id: '3', client_name: 'Ольга Сидорова', due_at: '2024-07-09T12:00:00Z', channel: Channel.CALL, priority: 2, status: ReminderStatus.NEW },
  { id: 'r3', client_id: '1', client_name: 'Анна Иванова', due_at: '2024-07-15T10:00:00Z', channel: Channel.EMAIL, priority: 1, status: ReminderStatus.DEFERRED, outcome: "Клиент попросил перезвонить" },
];

let MOCK_COMMUNICATIONS: Communication[] = [
    {id: 'c1', client_id: '1', channel: Channel.EMAIL, at: '2024-06-10T09:00:00Z', summary: 'Отправлено напоминание о записи.', outcome: 'Прочитано'},
    {id: 'c2', client_id: '1', channel: Channel.CALL, at: '2024-06-12T11:00:00Z', summary: 'Звонок для подтверждения записи. Клиент подтвердил.', outcome: 'Записан'},
];


const simulateDelay = <T,>(data: T): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(data), 300));

export const getClients = () => simulateDelay(MOCK_CLIENTS);
export const getClientById = (id: string) => simulateDelay(MOCK_CLIENTS.find(c => c.id === id));
export const getServices = () => simulateDelay(MOCK_SERVICES);
export const getStaff = () => simulateDelay(MOCK_STAFF);
export const getAppointments = () => simulateDelay(MOCK_APPOINTMENTS);
export const getReminders = () => simulateDelay(MOCK_REMINDERS);
export const getClientHistory = (clientId: string) => {
    const appointments = MOCK_APPOINTMENTS.filter(a => a.client_id === clientId && a.status === AppointmentStatus.DONE);
    const communications = MOCK_COMMUNICATIONS.filter(c => c.client_id === clientId);
    return simulateDelay([...appointments, ...communications].sort((a,b) => new Date('at' in b ? b.at : b.start_at).getTime() - new Date('at' in a ? a.at : a.start_at).getTime()));
};

export const addService = (service: Omit<Service, 'id' | 'default_cadence_days'> & { default_cadence_days?: number }) => {
  const newService: Service = {
    id: `s${Date.now()}`,
    ...service,
    default_cadence_days: service.default_cadence_days || 30,
  };
  MOCK_SERVICES.push(newService);
  return simulateDelay(newService);
};

export const addAppointment = (appointment: Omit<Appointment, 'id' | 'client_name' | 'service_names' | 'staff_name' | 'end_at' | 'status'>): Promise<Appointment> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const client = MOCK_CLIENTS.find(c => c.id === appointment.client_id);
      const services = MOCK_SERVICES.filter(s => appointment.service_ids.includes(s.id));
      const staff = MOCK_STAFF.find(st => st.id === appointment.staff_id);

      if (!client || services.length === 0 || !staff) {
        return reject('Invalid data for appointment');
      }

      const totalDuration = services.reduce((acc, s) => acc + s.base_duration_min + s.buffer_cleanup_min, 0);
      const end_at = new Date(appointment.start_at);
      end_at.setMinutes(end_at.getMinutes() + totalDuration);

      const newAppointment: Appointment = {
        id: `a${Date.now()}`,
        ...appointment,
        client_name: client.name,
        service_names: services.map(s => s.name),
        staff_name: staff.name,
        status: AppointmentStatus.PLANNED,
        end_at: end_at.toISOString(),
      };

      MOCK_APPOINTMENTS.push(newAppointment);
      resolve(newAppointment);
    }, 500);
  });
};

export const updateAppointment = (appointmentId: string, updates: { client_id: string; service_ids: string[] }): Promise<Appointment> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const appointmentIndex = MOCK_APPOINTMENTS.findIndex(a => a.id === appointmentId);
            if (appointmentIndex === -1) {
                return reject('Appointment not found');
            }

            const existingAppointment = MOCK_APPOINTMENTS[appointmentIndex];
            const client = MOCK_CLIENTS.find(c => c.id === updates.client_id);
            const services = MOCK_SERVICES.filter(s => updates.service_ids.includes(s.id));

            if (!client || services.length === 0) {
                return reject('Invalid update data');
            }
            
            const totalDuration = services.reduce((acc, s) => acc + s.base_duration_min + s.buffer_cleanup_min, 0);
            const end_at = new Date(existingAppointment.start_at);
            end_at.setMinutes(end_at.getMinutes() + totalDuration);

            const updatedAppointment: Appointment = {
                ...existingAppointment,
                client_id: updates.client_id,
                client_name: client.name,
                service_ids: updates.service_ids,
                service_names: services.map(s => s.name),
                end_at: end_at.toISOString(),
            };
            
            MOCK_APPOINTMENTS[appointmentIndex] = updatedAppointment;
            resolve(updatedAppointment);
        }, 500);
    });
};

export const deleteAppointment = (appointmentId: string): Promise<{ success: true }> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const initialLength = MOCK_APPOINTMENTS.length;
            MOCK_APPOINTMENTS = MOCK_APPOINTMENTS.filter(a => a.id !== appointmentId);
            if (MOCK_APPOINTMENTS.length < initialLength) {
                resolve({ success: true });
            } else {
                reject('Appointment not found');
            }
        }, 500);
    });
};
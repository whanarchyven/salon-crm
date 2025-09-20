
export enum Channel {
  EMAIL = 'email',
  SMS = 'sms',
  CALL = 'call',
}

export enum ReminderStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  DEFERRED = 'deferred',
}

export enum AppointmentStatus {
  PLANNED = 'planned',
  RESCHEDULED = 'rescheduled',
  CANCELED = 'canceled',
  DONE = 'done',
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  consents: {
    marketing_email: boolean;
    marketing_sms: boolean;
  };
  preferred_channel: Channel;
  tags: string[];
  notes: string;
  cadence_default_days: number;
  last_visit_at: string;
  next_contact_at: string;
  status: 'active' | 'paused' | 'archived';
}

export interface Service {
  id: string;
  name: string;
  base_duration_min: number;
  buffer_cleanup_min: number;
  default_cadence_days: number;
}

export interface Staff {
  id: string;
  name: string;
  role: 'master' | 'assistant';
}

export interface Appointment {
  id: string;
  client_id: string;
  client_name: string;
  service_ids: string[];
  service_names: string[];
  staff_id: string;
  staff_name: string;
  start_at: string;
  end_at: string;
  status: AppointmentStatus;
}

export interface Reminder {
  id: string;
  client_id: string;
  client_name: string;
  due_at: string;
  channel: Channel;
  priority: number;
  status: ReminderStatus;
  outcome?: string;
}

export interface Communication {
    id: string;
    client_id: string;
    channel: Channel;
    at: string;
    summary: string;
    outcome: string;
}
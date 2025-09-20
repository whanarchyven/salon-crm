
import React, { useState, useEffect } from 'react';
import { Reminder, ReminderStatus, Channel } from '../types';
import { getReminders } from '../services/mockApiService';
import Card from '../components/ui/Card';
import { EnvelopeIcon, PhoneIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';

const channelIcons: Record<Channel, React.FC<{className: string}>> = {
  [Channel.EMAIL]: EnvelopeIcon,
  [Channel.SMS]: ChatBubbleBottomCenterTextIcon,
  [Channel.CALL]: PhoneIcon,
};

const ReminderCard: React.FC<{ reminder: Reminder }> = ({ reminder }) => {
  const Icon = channelIcons[reminder.channel];
  return (
    <div className="p-4 mb-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 cursor-pointer hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <p className="font-bold text-gray-800 dark:text-white">{reminder.client_name}</p>
        <Icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Связаться до: {new Date(reminder.due_at).toLocaleDateString('ru-RU')}
      </p>
    </div>
  );
};

const ReminderColumn: React.FC<{ title: string; reminders: Reminder[]; className?: string; }> = ({ title, reminders, className }) => {
  return (
    <div className={`flex-1 p-4 rounded-lg bg-gray-100 dark:bg-gray-800 ${className}`}>
      <h3 className="font-semibold text-lg mb-4 text-gray-700 dark:text-gray-200">{title} ({reminders.length})</h3>
      <div>
        {reminders.map(reminder => <ReminderCard key={reminder.id} reminder={reminder} />)}
      </div>
    </div>
  );
};

const RemindersPage: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReminders = async () => {
      setLoading(true);
      const data = await getReminders();
      setReminders(data);
      setLoading(false);
    };
    fetchReminders();
  }, []);

  const today = new Date();
  today.setHours(0,0,0,0);
  
  const overdueReminders = reminders.filter(r => new Date(r.due_at) < today && r.status === ReminderStatus.NEW);
  const todayReminders = reminders.filter(r => new Date(r.due_at).toDateString() === new Date().toDateString() && r.status === ReminderStatus.NEW);
  const scheduledReminders = reminders.filter(r => new Date(r.due_at) > today && r.status !== ReminderStatus.DONE);
  const doneReminders = reminders.filter(r => r.status === ReminderStatus.DONE);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Очередь напоминаний</h1>
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <ReminderColumn title="Просрочено" reminders={overdueReminders} className="border-t-4 border-red-500" />
          <ReminderColumn title="Сегодня" reminders={todayReminders} className="border-t-4 border-indigo-500" />
          <ReminderColumn title="Запланировано" reminders={scheduledReminders} className="border-t-4 border-blue-500" />
          <ReminderColumn title="Сделано" reminders={doneReminders} className="border-t-4 border-green-500" />
        </div>
      )}
    </div>
  );
};

export default RemindersPage;
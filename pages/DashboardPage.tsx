
import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import { Reminder } from '../types';
import { getReminders } from '../services/mockApiService';
import { ClockIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const DashboardPage: React.FC = () => {
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
  
  const todayReminders = reminders.filter(r => new Date(r.due_at).toDateString() === new Date().toDateString()).length;
  const overdueReminders = reminders.filter(r => new Date(r.due_at) < new Date()).length;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Дашборд</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-500/20 mr-4">
              <ClockIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Напоминаний сегодня</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{todayReminders}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-500/20 mr-4">
               <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Просрочено</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{overdueReminders}</p>
            </div>
          </div>
        </Card>
         <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-500/20 mr-4">
               <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Конверсия в запись</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">34%</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-500/20 mr-4">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-blue-600 dark:text-blue-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Прогноз выручки (неделя)</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">125,000 ₽</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Ближайшие записи</h2>
           <p className="text-gray-600 dark:text-gray-400">Компонент с календарем или списком ближайших записей будет здесь.</p>
        </Card>
      </div>

    </div>
  );
};

export default DashboardPage;
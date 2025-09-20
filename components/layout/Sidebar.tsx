
import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, UsersIcon, BellAlertIcon, CalendarDaysIcon, Cog6ToothIcon, SparklesIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Дашборд', href: '/dashboard', icon: HomeIcon },
  { name: 'Клиенты', href: '/clients', icon: UsersIcon },
  { name: 'Напоминания', href: '/reminders', icon: BellAlertIcon },
  { name: 'Календарь', href: '/calendar', icon: CalendarDaysIcon },
  { name: 'Услуги', href: '/services', icon: SparklesIcon },
  { name: 'Настройки', href: '/settings', icon: Cog6ToothIcon },
];

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
      <div className="flex items-center justify-center h-20 border-b dark:border-gray-700">
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">SalonCRM</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`
            }
          >
            <item.icon className="h-6 w-6 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;

import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const SettingsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Настройки салона</h1>
      <div className="space-y-8">
        <Card>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 dark:border-gray-700">Общие настройки</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="salonName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Название салона</label>
              <input type="text" id="salonName" defaultValue="Мой Салон Красоты" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <div>
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Часовой пояс</label>
              <select id="timezone" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600">
                <option>Europe/Moscow (GMT+3)</option>
                <option>Europe/Kaliningrad (GMT+2)</option>
              </select>
            </div>
          </form>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 dark:border-gray-700">Настройки записи</h2>
          <form className="space-y-4">
             <div>
              <label htmlFor="timeStep" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Шаг времени в календаре</label>
              <select id="timeStep" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600">
                <option value="5">5 минут</option>
                <option value="10">10 минут</option>
                <option value="15">15 минут</option>
              </select>
            </div>
            <div>
              <label htmlFor="defaultBuffer" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Буфер для уборки по умолчанию (минут)</label>
              <input type="number" id="defaultBuffer" defaultValue="10" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600" />
            </div>
          </form>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 dark:border-gray-700">Шаблоны сообщений</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="smsTemplate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Шаблон SMS напоминания</label>
              <textarea id="smsTemplate" rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                defaultValue={"Добрый день, {client_name}! Напоминаем о записи на {service_name} в {salon_name}."}
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">Доступные переменные: {`{client_name}`}, {`{service_name}`}, {`{salon_name}`}</p>
            </div>
          </form>
        </Card>

        <div className="flex justify-end">
            <Button>Сохранить изменения</Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
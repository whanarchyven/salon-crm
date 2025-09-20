
import React, { useState, useEffect } from 'react';
import { Service } from '../types';
import { getServices, addService } from '../services/mockApiService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState(60);
  const [newServiceBuffer, setNewServiceBuffer] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    const data = await getServices();
    setServices(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName || newServiceDuration <= 0) {
      alert('Пожалуйста, заполните все поля корректно.');
      return;
    }
    setIsSubmitting(true);
    await addService({
      name: newServiceName,
      base_duration_min: newServiceDuration,
      buffer_cleanup_min: newServiceBuffer,
    });
    setNewServiceName('');
    setNewServiceDuration(60);
    setNewServiceBuffer(5);
    setIsSubmitting(false);
    fetchServices(); // Refetch to show the new service
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Управление услугами</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Добавить новую услугу</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Название</label>
                <input
                  type="text"
                  id="serviceName"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Длительность (мин)</label>
                <input
                  type="number"
                  id="duration"
                  value={newServiceDuration}
                  onChange={(e) => setNewServiceDuration(parseInt(e.target.value, 10))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                  required
                  min="5"
                  step="5"
                />
              </div>
              <div>
                <label htmlFor="buffer" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Буфер на уборку (мин)</label>
                <input
                  type="number"
                  id="buffer"
                  value={newServiceBuffer}
                  onChange={(e) => setNewServiceBuffer(parseInt(e.target.value, 10))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                  required
                  min="0"
                  step="5"
                />
              </div>
              <Button type="submit" isLoading={isSubmitting} className="w-full">
                Добавить услугу
              </Button>
            </form>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Список услуг</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Название</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Длительность</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Буфер</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {loading ? (
                    <tr><td colSpan={3} className="text-center py-4">Загрузка...</td></tr>
                  ) : (
                    services.map(service => (
                      <tr key={service.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{service.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{service.base_duration_min} мин</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{service.buffer_cleanup_min} мин</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Client } from '../types';
import { getClients } from '../services/mockApiService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { PlusIcon } from '@heroicons/react/24/solid';

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      const data = await getClients();
      setClients(data);
      setLoading(false);
    };
    fetchClients();
  }, []);

  const filteredClients = useMemo(() => {
    return clients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Клиенты</h1>
        <Button>
          <PlusIcon className="h-5 w-5 mr-2" />
          Добавить клиента
        </Button>
      </div>
      <Card>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Поиск по имени, телефону или email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Имя</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Контакты</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Теги</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Следующий контакт</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-4">Загрузка...</td></tr>
              ) : (
                filteredClients.map(client => (
                  <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{client.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{client.phone}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{client.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {client.tags.map(tag => (
                        <span key={tag} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 mr-1">{tag}</span>
                      ))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(client.next_contact_at).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/clients/${client.id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">Подробнее</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ClientsPage;
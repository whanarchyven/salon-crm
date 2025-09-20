
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Client, Communication, Appointment } from '../types';
import { getClientById, getClientHistory, getServices } from '../services/mockApiService';
import { summarizeClientHistory, generateReminderText } from '../services/geminiService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeftIcon, SparklesIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/solid';

const ClientDetailPage: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [history, setHistory] = useState<(Appointment | Communication)[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [reminderText, setReminderText] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isReminderLoading, setIsReminderLoading] = useState(false);

  const fetchClientData = useCallback(async () => {
    if (!clientId) return;
    setLoading(true);
    const clientData = await getClientById(clientId);
    const historyData = await getClientHistory(clientId);
    setClient(clientData || null);
    setHistory(historyData);
    setLoading(false);
  }, [clientId]);

  useEffect(() => {
    fetchClientData();
  }, [fetchClientData]);

  const handleGenerateSummary = async () => {
    if (!client) return;
    setIsSummaryLoading(true);
    const result = await summarizeClientHistory(client, history);
    setSummary(result);
    setIsSummaryLoading(false);
  };

  const handleGenerateReminder = async () => {
    if (!client) return;
    // In a real app, this would come from a selected service
    const services = await getServices();
    const targetService = services[0]; 
    setIsReminderLoading(true);
    const result = await generateReminderText(client, targetService.name, 'RU');
    setReminderText(result);
    setIsReminderLoading(false);
  };

  if (loading) return <div className="text-center py-10">Загрузка данных клиента...</div>;
  if (!client) return <div className="text-center py-10">Клиент не найден.</div>;

  return (
    <div>
      <Link to="/clients" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline mb-6">
        <ArrowLeftIcon className="h-5 w-5" />
        Назад к списку клиентов
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Client Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <h2 className="text-2xl font-bold mb-4">{client.name}</h2>
            <p className="text-gray-600 dark:text-gray-400"><strong>Телефон:</strong> {client.phone}</p>
            <p className="text-gray-600 dark:text-gray-400"><strong>Email:</strong> {client.email}</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2"><strong>Предпочтительный канал:</strong> {client.preferred_channel}</p>
            <div className="mt-4">
              {client.tags.map(tag => (
                <span key={tag} className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 mr-1">{tag}</span>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold mb-3">AI Помощник</h3>
            <div className="space-y-4">
              <div>
                <Button onClick={handleGenerateSummary} isLoading={isSummaryLoading} className="w-full">
                  <SparklesIcon className="h-5 w-5" />
                  Сводка по клиенту
                </Button>
                {summary && <p className="mt-3 text-sm p-3 bg-gray-100 dark:bg-gray-700 rounded-md">{summary}</p>}
              </div>
               <div>
                <Button onClick={handleGenerateReminder} isLoading={isReminderLoading} variant="secondary" className="w-full">
                  <EnvelopeIcon className="h-5 w-5" />
                  Текст напоминания
                </Button>
                {reminderText && <p className="mt-3 text-sm p-3 bg-gray-100 dark:bg-gray-700 rounded-md">{reminderText}</p>}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-xl font-semibold mb-4">История взаимодействий</h3>
            <div className="flow-root">
              <ul className="-mb-8">
                {history.map((item, itemIdx) => (
                  <li key={item.id}>
                    <div className="relative pb-8">
                      {itemIdx !== history.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></span>
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                            {/* FIX: Use 'start_at' as a type guard to correctly identify an Appointment object. */}
                            {'start_at' in item ? <PhoneIcon className="h-5 w-5 text-white" /> : <EnvelopeIcon className="h-5 w-5 text-white" />}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {/* FIX: Use 'start_at' as a type guard to correctly identify an Appointment object and access its properties. */}
                              {/* The property 'service_name' does not exist on Appointment; it is 'service_names'. */}
                              {'start_at' in item 
                                ? `Визит: ${item.service_names.join(', ')} (${item.status})`
                                : `Коммуникация: ${item.channel} (${item.outcome})`}
                            </p>
                            <p className="font-medium text-gray-900 dark:text-white">
                               {'summary' in item ? item.summary : ''}
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                            <time dateTime={'at' in item ? item.at : item.start_at}>
                                {new Date('at' in item ? item.at : item.start_at).toLocaleDateString('ru-RU')}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailPage;
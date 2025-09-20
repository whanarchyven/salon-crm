
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Client, Communication, Appointment } from '../types';

if (!process.env.API_KEY) {
  // A mock response or a clear error is better than a runtime crash.
  // In a real app, this might be handled by a global error boundary.
  console.error("API_KEY environment variable not set. Gemini API will not be available.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateReminderText = async (client: Client, serviceName: string, language: 'RU' | 'EN'): Promise<string> => {
  if (!process.env.API_KEY) {
    return language === 'RU'
      ? `Уважаемый ${client.name}, напоминаем вам о необходимости записи на услугу "${serviceName}". Ждем вас в нашем салоне!`
      : `Dear ${client.name}, this is a friendly reminder to book your next "${serviceName}" appointment. We look forward to seeing you!`;
  }

  const prompt = `
    Generate a concise, friendly, and professional reminder message for a beauty salon client.
    The client's name is ${client.name}.
    The recommended service is "${serviceName}".
    The tone should be welcoming and not pushy.
    The message should be in ${language === 'RU' ? 'Russian' : 'English'}.
    Do not include placeholders for booking links or phone numbers. Just generate the core message text.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating reminder text with Gemini API:", error);
    return "Error generating message. Please try again.";
  }
};

export const summarizeClientHistory = async (client: Client, history: (Appointment | Communication)[]): Promise<string> => {
  if (!process.env.API_KEY) {
    return `Это постоянный клиент по имени ${client.name}. Последний визит был ${new Date(client.last_visit_at).toLocaleDateString('ru-RU')}. Предпочитает общаться через ${client.preferred_channel}.`;
  }

  const historyString = history.map(item => {
      // FIX: Use 'start_at' as a type guard to correctly identify an Appointment object.
      // The property 'service_name' does not exist on Appointment; it is 'service_names'.
      if ('start_at' in item) { // It's an Appointment
          return `- Visit on ${new Date(item.start_at).toLocaleDateString('en-CA')} for ${item.service_names.join(', ')}, status: ${item.status}.`;
      } else { // It's a Communication
          return `- Communication on ${new Date(item.at).toLocaleDateString('en-CA')} via ${item.channel}, outcome: ${item.outcome}.`;
      }
  }).join('\n');

  const prompt = `
    As an expert salon administrator, provide a very brief summary (2-3 sentences) of a client's history for a quick pre-call briefing.
    Client Name: ${client.name}
    Client Tags: ${client.tags.join(', ')}
    Notes: ${client.notes}
    
    Interaction History:
    ${historyString}

    Focus on their loyalty, last visit, any mentioned preferences, and recent communication outcomes. The summary should be in Russian.
  `;
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error summarizing client history with Gemini API:", error);
    return "Не удалось сгенерировать сводку. Проверьте историю вручную.";
  }
};
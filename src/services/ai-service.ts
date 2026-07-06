import { apiClient } from './api-client';

export interface ChatResponse {
  response: string;
}

export interface CoachAdviceResponse {
  response: string;
}

const getLocalDateString = () => {
  const d = new Date()
  const offset = d.getTimezoneOffset()
  const local = new Date(d.getTime() - offset * 60 * 1000)
  return local.toISOString().split('T')[0]
}

export const aiService = {
  async getChatCoach(message: string, history?: string[], chatId?: string): Promise<any> {
    const response = await apiClient.post<any>('/ai/chat', { message, history, chatId });
    return response.data;
  },

  async getMorningCoachAdvice(): Promise<any> {
    const response = await apiClient.post<any>('/ai/morning', { date: getLocalDateString() });
    return response.data;
  },

  async getDailyReviewAdvice(): Promise<any> {
    const response = await apiClient.post<any>('/ai/review', { date: getLocalDateString() });
    return response.data;
  },

  async getStrategicAdvice(customQuestion?: string): Promise<any> {
    const response = await apiClient.post<any>('/ai/strategic', { customQuestion });
    return response.data;
  },

  async getUsage(): Promise<{ count: number; limit: number }> {
    const response = await apiClient.get('/ai/usage');
    return response.data;
  },

  async getUserChats(): Promise<any[]> {
    const response = await apiClient.get<any[]>('/ai/chats');
    return response.data;
  },

  async createUserChat(title?: string): Promise<any> {
    const response = await apiClient.post('/ai/chats', { title });
    return response.data;
  },

  async renameUserChat(chatId: string, title: string): Promise<any> {
    const response = await apiClient.patch(`/ai/chats/${chatId}`, { title });
    return response.data;
  },

  async deleteUserChat(chatId: string): Promise<any> {
    const response = await apiClient.delete(`/ai/chats/${chatId}`);
    return response.data;
  },

  async getChatMessages(chatId: string): Promise<any[]> {
    const response = await apiClient.get<any[]>(`/ai/chats/${chatId}/messages`);
    return response.data;
  },
};

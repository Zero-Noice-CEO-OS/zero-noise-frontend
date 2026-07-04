import { apiClient } from './api-client';

export interface SubscriptionDetails {
  subscription: {
    plan: string;
    billingCycle: string;
    status: string;
    startedAt: string | null;
    expiresAt: string | null;
    nextRenewalAt: string | null;
    autoRenew: boolean;
    razorpaySubId?: string | null;
  };
  invoices: Array<{
    id: string;
    invoiceNumber: string;
    planName: string;
    amountPaid: number;
    taxAmount: number;
    status: string;
    createdAt: string;
  }>;
  usage: {
    aiRequests: number;
    deepWorkHours: number;
    reportsGenerated: number;
  };
}

export const subscriptionService = {
  async getDetails(): Promise<SubscriptionDetails> {
    const response = await apiClient.get<SubscriptionDetails>('/subscriptions/me');
    return response.data;
  },

  async purchase(data: {
    planName: string;
    billingCycle: string;
    name: string;
    email: string;
    mobileNumber: string;
    autoRenew: boolean;
    razorpayPaymentId?: string;
    razorpaySubscriptionId?: string;
    razorpaySignature?: string;
    method?: string;
  }): Promise<any> {
    const response = await apiClient.post('/subscriptions/purchase', data);
    return response.data;
  },

  async calculateUpgrade(data: { planName: string; billingCycle: string }): Promise<any> {
    const response = await apiClient.post('/subscriptions/calculate-upgrade', data);
    return response.data;
  },

  async upgrade(data: { planName: string; billingCycle: string }): Promise<any> {
    const response = await apiClient.post('/subscriptions/upgrade', data);
    return response.data;
  },

  async cancel(): Promise<any> {
    const response = await apiClient.post('/subscriptions/cancel');
    return response.data;
  },

  async toggleAutoRenew(autoRenew: boolean): Promise<any> {
    const response = await apiClient.post('/subscriptions/autorenew', { autoRenew });
    return response.data;
  },
};

import { apiClient } from './api-client';

export type ReviewType = 'Daily' | 'Weekly' | 'Monthly';

export interface Review {
  id: string;
  userId: string;
  type: ReviewType;
  date: string;
  summary: string;
  recommendations: string[]; // JSON array on backend, parses as array/object
  createdAt: string;
}

export interface PaginatedReviews {
  data: Review[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const reviewService = {
  async generateReview(type: ReviewType, date: string): Promise<Review> {
    const response = await apiClient.post<Review>('/reviews/generate', { type, date });
    return response.data;
  },

  async getReviews(params?: {
    page?: number;
    limit?: number;
    type?: ReviewType;
  }): Promise<PaginatedReviews> {
    const response = await apiClient.get<PaginatedReviews>('/reviews', { params });
    return response.data;
  },

  async getReview(id: string): Promise<Review> {
    const response = await apiClient.get<Review>(`/reviews/${id}`);
    return response.data;
  },

  async updateReview(id: string, notes: string): Promise<Review> {
    const response = await apiClient.patch<Review>(`/reviews/${id}`, { notes });
    return response.data;
  },
};

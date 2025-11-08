/**
 * API Status Service
 * Service for checking API provider status and quota
 */

import { api } from './api-client';

export interface APIProviderStatus {
  name: string;
  used: number;
  limit: number;
  remaining: number;
  percentage: number;
}

export interface APIStatus {
  sportMonks?: APIProviderStatus;
  apiFootball?: APIProviderStatus;
  footballData?: APIProviderStatus;
  lastReset: string;
}

export class APIStatusService {
  /**
   * Get API quota status from backend
   */
  static async getAPIStatus(): Promise<APIStatus | null> {
    try {
      const response = await api.get<APIStatus>('/api/status');
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching API status:', error);
      return null;
    }
  }

  /**
   * Check if API is healthy
   */
  static async checkHealth(): Promise<boolean> {
    try {
      const response = await api.get<{ success: boolean, message: string }>('/health');
      return response.success === true;
    } catch (error) {
      console.error('Error checking API health:', error);
      return false;
    }
  }

  /**
   * Get formatted status for display
   */
  static formatStatus(provider: APIProviderStatus): {
    color: string;
    text: string;
  } {
    const percentage = provider.percentage;
    
    if (percentage >= 90) {
      return { color: '#FF3B30', text: 'Critical' };
    } else if (percentage >= 70) {
      return { color: '#FF9500', text: 'High Usage' };
    } else if (percentage >= 50) {
      return { color: '#FFCC00', text: 'Moderate' };
    } else {
      return { color: '#34C759', text: 'Good' };
    }
  }
}

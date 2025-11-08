import axios from 'axios';
import { BASE_URL } from '@/config/api';

export const ApiUsageService = {
  getApiUsage: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/usage`);
      return response.data;
    } catch (error) {
      console.error('Error fetching API usage:', error);
      return null;
    }
  },

  getSportMonksQuota: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/usage/sportmonks`);
      return response.data;
    } catch (error) {
      console.error('Error fetching SportMonks quota:', error);
      return null;
    }
  }
};

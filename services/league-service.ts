import { api } from './api-client';
import { API_ENDPOINTS } from '@/config/api';
import { APILeague } from '@/types/api';
import { League } from '@/types/match';

function transformLeague(apiLeague: any): League {
  // Backend returns { id, name, type, logo, country: { name, code, flag } }
  const countryObj = apiLeague.country || {};
  return {
    id: String(apiLeague.id),
    name: apiLeague.name,
    logo: apiLeague.logo,
    country: countryObj.name || '',
    flag: countryObj.flag || '',
  };
}

export class LeagueService {
  static async getPopularLeagues(): Promise<League[]> {
    const res = await api.get<APILeague[]>(API_ENDPOINTS.LEAGUES.POPULAR);
    if (res.success && res.data) {
      // data may not be APILeague[] exactly; adapt to backend shape
      // Backend controllers return array of transformed leagues (see backend leagueService)
      return (res.data as any[]).map(transformLeague);
    }
    return [];
  }

  static async getAllLeagues(): Promise<League[]> {
    const res = await api.get<APILeague[]>(API_ENDPOINTS.LEAGUES.ALL);
    if (res.success && res.data) {
      return (res.data as any[]).map(transformLeague);
    }
    return [];
  }
}

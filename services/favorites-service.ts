import { api } from './api-client';
import { API_ENDPOINTS } from '@/config/api';

export type FavoriteType = 'team' | 'league' | 'match';

export interface FavoriteItem {
  id: string;
  type: FavoriteType;
  entityId: string;
  entityName: string;
  entityLogo?: string | null;
  entityData?: any;
  created_at?: string;
}

const GUEST_USER_ID = process.env.EXPO_PUBLIC_GUEST_USER_ID || '00000000-0000-0000-0000-000000000001';

export class FavoritesService {
  static getUserId() {
    return GUEST_USER_ID as string;
  }

  static async getFavorites(type?: FavoriteType): Promise<FavoriteItem[]> {
    const userId = this.getUserId();
    const res = await api.get<any[]>(API_ENDPOINTS.FAVORITES.GET(userId), type ? { type } : undefined);
    if (res.success && res.data) {
      return (res.data as any[]).map((row: any) => ({
        id: String(row.id),
        type: row.type,
        entityId: String(row.entity_id),
        entityName: row.entity_name,
        entityLogo: row.entity_logo,
        entityData: row.entity_data,
        created_at: row.created_at,
      }));
    }
    return [];
  }

  static async isFavorited(entityId: string, type: FavoriteType): Promise<boolean> {
    const userId = this.getUserId();
    const res = await api.get<{ isFavorited: boolean }>(API_ENDPOINTS.FAVORITES.CHECK(userId), {
      entityId,
      type,
    });
    return !!res.data?.isFavorited;
  }

  static async addMatchFavorite(matchId: string, matchData: any) {
    const userId = this.getUserId();
    return api.post(API_ENDPOINTS.FAVORITES.ADD_MATCH, {
      userId,
      matchId,
      matchData,
    });
  }

  static async addTeamFavorite(teamId: string, teamName: string, teamLogo?: string) {
    const userId = this.getUserId();
    return api.post(API_ENDPOINTS.FAVORITES.ADD_TEAM, {
      userId,
      teamId,
      teamName,
      teamLogo,
    });
  }

  static async addLeagueFavorite(leagueId: string, leagueName: string, leagueLogo?: string) {
    const userId = this.getUserId();
    return api.post(API_ENDPOINTS.FAVORITES.ADD_LEAGUE, {
      userId,
      leagueId,
      leagueName,
      leagueLogo,
    });
  }

  static async removeFavorite(favoriteId: string) {
    const userId = this.getUserId();
    return api.delete(API_ENDPOINTS.FAVORITES.REMOVE(favoriteId), { userId });
  }

  static async removeFavoriteByEntity(entityId: string, type: FavoriteType) {
    const items = await this.getFavorites(type);
    const item = items.find((i) => i.entityId === entityId && i.type === type);
    if (!item) return null as any;
    return this.removeFavorite(item.id);
  }
}

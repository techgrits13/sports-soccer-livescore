const supabase = require('../config/database');
const logger = require('../config/logger');

class FavoriteService {
  /**
   * Add team to favorites
   */
  async addTeamFavorite(userId, teamId, teamName, teamLogo) {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .insert({
          user_id: userId,
          type: 'team',
          entity_id: teamId,
          entity_name: teamName,
          entity_logo: teamLogo
        })
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      logger.error('Error adding team favorite:', error.message);
      throw error;
    }
  }

  /**
   * Add league to favorites
   */
  async addLeagueFavorite(userId, leagueId, leagueName, leagueLogo) {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .insert({
          user_id: userId,
          type: 'league',
          entity_id: leagueId,
          entity_name: leagueName,
          entity_logo: leagueLogo
        })
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      logger.error('Error adding league favorite:', error.message);
      throw error;
    }
  }

  /**
   * Add match to favorites
   */
  async addMatchFavorite(userId, matchId, matchData) {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .insert({
          user_id: userId,
          type: 'match',
          entity_id: matchId,
          entity_name: `${matchData.homeTeam} vs ${matchData.awayTeam}`,
          entity_data: matchData
        })
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      logger.error('Error adding match favorite:', error.message);
      throw error;
    }
  }

  /**
   * Remove favorite
   */
  async removeFavorite(userId, favoriteId) {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId)
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      logger.error('Error removing favorite:', error.message);
      throw error;
    }
  }

  /**
   * Get all favorites for a user
   */
  async getUserFavorites(userId, type = null) {
    try {
      let query = supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId);

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error fetching user favorites:', error.message);
      throw error;
    }
  }

  /**
   * Check if entity is favorited
   */
  async isFavorited(userId, entityId, type) {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('entity_id', entityId)
        .eq('type', type)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } catch (error) {
      logger.error('Error checking favorite status:', error.message);
      return false;
    }
  }
}

module.exports = new FavoriteService();

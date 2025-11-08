const apiManager = require('./apiManager');
const logger = require('../config/logger');

class LeagueService {
  /**
   * Get all available leagues
   */
  async getAllLeagues() {
    try {
      // SoccersAPI endpoint for leagues
      const result = await apiManager.request(
        'leagues',
        '/leagues/',
        { 
          t: 'list'
        }
      );

      return this.transformSoccersLeagues(result.data);
    } catch (error) {
      logger.error('Error fetching all leagues:', error.message);
      // Return empty array on error
      return [];
    }
  }

  /**
   * Get popular leagues (top competitions)
   */
  async getPopularLeagues() {
    try {
      // Fetch all leagues and return top ones
      const result = await apiManager.request(
        'leagues',
        '/leagues/',
        { 
          t: 'list'
        }
      );

      // Transform and return top 20 leagues
      const allLeagues = this.transformSoccersLeagues(result.data);
      return allLeagues.slice(0, 20); // Return top 20 leagues
    } catch (error) {
      logger.error('Error fetching popular leagues:', error.message);
      // Return empty array on error
      return [];
    }
  }

  /**
   * Get league by ID
   */
  async getLeagueById(leagueId) {
    try {
      const result = await apiManager.request(
        'leagues',
        `/leagues/${leagueId}`,
        { 
          include: 'country;currentSeason'
        }
      );

      const leagues = this.transformSportMonksLeagues(result.data);
      if (!leagues || leagues.length === 0) {
        throw new Error('League not found');
      }

      return leagues[0];
    } catch (error) {
      logger.error('Error fetching league by ID:', error.message);
      throw error;
    }
  }

  /**
   * Get leagues by country
   */
  async getLeaguesByCountry(country) {
    try {
      const result = await apiManager.request(
        'leagues',
        '/leagues',
        { 
          include: 'country;currentSeason'
        }
      );

      // Filter by country name
      const allLeagues = this.transformSportMonksLeagues(result.data);
      return allLeagues.filter(league => 
        league.country.name.toLowerCase().includes(country.toLowerCase())
      );
    } catch (error) {
      logger.error('Error fetching leagues by country:', error.message);
      throw error;
    }
  }

  /**
   * Get league standings
   */
  async getStandings(leagueId, season) {
    try {
      const result = await apiManager.request(
        'standings',
        '/standings',
        { league: leagueId, season: season || new Date().getFullYear() }
      );

      return this.transformStandings(result.data);
    } catch (error) {
      logger.error('Error fetching standings:', error.message);
      throw error;
    }
  }

  /**
   * Get top scorers for a league
   */
  async getTopScorers(leagueId, season) {
    try {
      const result = await apiManager.request(
        'players',
        '/players/topscorers',
        { league: leagueId, season: season || new Date().getFullYear() }
      );

      return this.transformTopScorers(result.data);
    } catch (error) {
      logger.error('Error fetching top scorers:', error.message);
      throw error;
    }
  }

  /**
   * Get top assists for a league
   */
  async getTopAssists(leagueId, season) {
    try {
      const result = await apiManager.request(
        'players',
        '/players/topassists',
        { league: leagueId, season: season || new Date().getFullYear() }
      );

      return this.transformTopScorers(result.data);
    } catch (error) {
      logger.error('Error fetching top assists:', error.message);
      throw error;
    }
  }

  /**
   * Transform SportMonks leagues data
   */
  transformSportMonksLeagues(apiData) {
    if (!apiData.data) {
      return [];
    }

    return apiData.data.map(league => ({
      id: league.id.toString(),
      name: league.name,
      type: league.type || 'league',
      logo: league.image_path || '⚽',
      country: {
        name: league.country?.name || 'International',
        code: league.country?.id?.toString() || '',
        flag: league.country?.image_path || '🌍'
      },
      seasons: league.currentSeason ? [{
        year: league.currentSeason.name,
        start: league.currentSeason.starting_at,
        end: league.currentSeason.ending_at,
        current: true
      }] : []
    }));
  }

  /**
   * Transform leagues data (legacy for API-Football format)
   */
  transformLeagues(apiData) {
    if (!apiData.response) {
      return [];
    }

    return apiData.response.map(league => ({
      id: league.league.id,
      name: league.league.name,
      type: league.league.type,
      logo: league.league.logo,
      country: {
        name: league.country.name,
        code: league.country.code,
        flag: league.country.flag
      },
      seasons: league.seasons?.map(season => ({
        year: season.year,
        start: season.start,
        end: season.end,
        current: season.current
      })) || []
    }));
  }

  /**
   * Transform standings data
   */
  transformStandings(apiData) {
    if (!apiData.response || apiData.response.length === 0) {
      return null;
    }

    const data = apiData.response[0];
    
    return {
      league: {
        id: data.league.id,
        name: data.league.name,
        country: data.league.country,
        logo: data.league.logo,
        flag: data.league.flag,
        season: data.league.season
      },
      standings: data.league.standings.map(group => 
        group.map(team => ({
          rank: team.rank,
          team: {
            id: team.team.id,
            name: team.team.name,
            logo: team.team.logo
          },
          points: team.points,
          goalsDiff: team.goalsDiff,
          group: team.group,
          form: team.form,
          status: team.status,
          description: team.description,
          all: {
            played: team.all.played,
            win: team.all.win,
            draw: team.all.draw,
            lose: team.all.lose,
            goals: {
              for: team.all.goals.for,
              against: team.all.goals.against
            }
          },
          home: {
            played: team.home.played,
            win: team.home.win,
            draw: team.home.draw,
            lose: team.home.lose,
            goals: {
              for: team.home.goals.for,
              against: team.home.goals.against
            }
          },
          away: {
            played: team.away.played,
            win: team.away.win,
            draw: team.away.draw,
            lose: team.away.lose,
            goals: {
              for: team.away.goals.for,
              against: team.away.goals.against
            }
          },
          update: team.update
        }))
      )
    };
  }

  /**
   * Transform SoccersAPI leagues data
   */
  transformSoccersLeagues(apiData) {
    if (!apiData || !apiData.data) {
      return [];
    }

    return apiData.data.map(league => ({
      id: league.id,
      name: league.name,
      country: league.country_name,
      countryCode: league.cc,
      logo: `https://cdn.soccersapi.com/images/soccer/leagues/${league.id}.png`,
      type: league.is_cup === '1' ? 'cup' : 'league',
      currentSeason: league.current_season_id,
      currentRound: league.current_round_id
    }));
  }

  /**
   * Transform top scorers data
   */
  transformTopScorers(apiData) {
    if (!apiData.response) {
      return [];
    }

    return apiData.response.map(item => ({
      player: {
        id: item.player.id,
        name: item.player.name,
        firstname: item.player.firstname,
        lastname: item.player.lastname,
        age: item.player.age,
        nationality: item.player.nationality,
        photo: item.player.photo
      },
      statistics: item.statistics.map(stat => ({
        team: {
          id: stat.team.id,
          name: stat.team.name,
          logo: stat.team.logo
        },
        league: {
          id: stat.league.id,
          name: stat.league.name,
          country: stat.league.country,
          logo: stat.league.logo,
          flag: stat.league.flag,
          season: stat.league.season
        },
        games: stat.games,
        goals: stat.goals,
        assists: stat.passes?.assists || 0,
        rating: stat.games.rating
      }))
    }));
  }
}

module.exports = new LeagueService();

const apiManager = require('./apiManager');
const logger = require('../config/logger');

class TeamService {
  /**
   * Get team by ID
   */
  async getTeamById(teamId) {
    try {
      const result = await apiManager.request(
        'teams',
        '/teams',
        { id: teamId }
      );

      if (!result.data.response || result.data.response.length === 0) {
        throw new Error('Team not found');
      }

      return this.transformTeam(result.data.response[0]);
    } catch (error) {
      logger.error('Error fetching team by ID:', error.message);
      throw error;
    }
  }

  /**
   * Search teams by name
   */
  async searchTeams(name) {
    try {
      const result = await apiManager.request(
        'teams',
        '/teams',
        { search: name }
      );

      return this.transformTeams(result.data);
    } catch (error) {
      logger.error('Error searching teams:', error.message);
      throw error;
    }
  }

  /**
   * Get team statistics for a season
   */
  async getTeamStatistics(teamId, leagueId, season) {
    try {
      const result = await apiManager.request(
        'teams',
        '/teams/statistics',
        { 
          team: teamId, 
          league: leagueId,
          season: season || new Date().getFullYear() 
        }
      );

      return this.transformTeamStatistics(result.data);
    } catch (error) {
      logger.error('Error fetching team statistics:', error.message);
      throw error;
    }
  }

  /**
   * Get team squad
   */
  async getTeamSquad(teamId) {
    try {
      const result = await apiManager.request(
        'players',
        '/players/squads',
        { team: teamId }
      );

      return this.transformSquad(result.data);
    } catch (error) {
      logger.error('Error fetching team squad:', error.message);
      throw error;
    }
  }

  /**
   * Get teams by league
   */
  async getTeamsByLeague(leagueId, season) {
    try {
      const result = await apiManager.request(
        'teams',
        '/teams',
        { 
          league: leagueId,
          season: season || new Date().getFullYear()
        }
      );

      return this.transformTeams(result.data);
    } catch (error) {
      logger.error('Error fetching teams by league:', error.message);
      throw error;
    }
  }

  /**
   * Transform team data
   */
  transformTeam(team) {
    return {
      id: team.team.id,
      name: team.team.name,
      code: team.team.code,
      country: team.team.country,
      founded: team.team.founded,
      national: team.team.national,
      logo: team.team.logo,
      venue: {
        id: team.venue.id,
        name: team.venue.name,
        address: team.venue.address,
        city: team.venue.city,
        capacity: team.venue.capacity,
        surface: team.venue.surface,
        image: team.venue.image
      }
    };
  }

  /**
   * Transform teams array
   */
  transformTeams(apiData) {
    if (!apiData.response) {
      return [];
    }

    return apiData.response.map(team => this.transformTeam(team));
  }

  /**
   * Transform team statistics
   */
  transformTeamStatistics(apiData) {
    if (!apiData.response) {
      return null;
    }

    const data = apiData.response;
    
    return {
      league: {
        id: data.league.id,
        name: data.league.name,
        country: data.league.country,
        logo: data.league.logo,
        flag: data.league.flag,
        season: data.league.season
      },
      team: {
        id: data.team.id,
        name: data.team.name,
        logo: data.team.logo
      },
      form: data.form,
      fixtures: {
        played: {
          home: data.fixtures.played.home,
          away: data.fixtures.played.away,
          total: data.fixtures.played.total
        },
        wins: {
          home: data.fixtures.wins.home,
          away: data.fixtures.wins.away,
          total: data.fixtures.wins.total
        },
        draws: {
          home: data.fixtures.draws.home,
          away: data.fixtures.draws.away,
          total: data.fixtures.draws.total
        },
        loses: {
          home: data.fixtures.loses.home,
          away: data.fixtures.loses.away,
          total: data.fixtures.loses.total
        }
      },
      goals: {
        for: {
          total: data.goals.for.total,
          average: data.goals.for.average,
          minute: data.goals.for.minute
        },
        against: {
          total: data.goals.against.total,
          average: data.goals.against.average,
          minute: data.goals.against.minute
        }
      },
      biggest: data.biggest,
      cleanSheet: data.clean_sheet,
      failedToScore: data.failed_to_score,
      penalty: data.penalty,
      lineups: data.lineups,
      cards: data.cards
    };
  }

  /**
   * Transform squad data
   */
  transformSquad(apiData) {
    if (!apiData.response || apiData.response.length === 0) {
      return null;
    }

    const data = apiData.response[0];
    
    return {
      team: {
        id: data.team.id,
        name: data.team.name,
        logo: data.team.logo
      },
      players: data.players.map(player => ({
        id: player.id,
        name: player.name,
        age: player.age,
        number: player.number,
        position: player.position,
        photo: player.photo
      }))
    };
  }
}

module.exports = new TeamService();

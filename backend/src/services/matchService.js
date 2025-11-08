const apiManager = require('./apiManager');
const logger = require('../config/logger');

class MatchService {
  /**
   * Get live matches
   */
  async getLiveMatches() {
    try {
      const result = await apiManager.request(
        'live',
        '/livescores/inplay',
        {
          include: 'participants;scores;periods;events;league.country;round'
        }
      );

      return this.transformLiveMatches(result.data);
    } catch (error) {
      logger.error('Error fetching live matches:', error.message);
      throw error;
    }
  }

  /**
   * Get matches by date
   */
  async getMatchesByDate(date) {
    try {
      const result = await apiManager.request(
        'fixtures',
        '/fixtures',
        { date: date }
      );

      return this.transformMatches(result.data);
    } catch (error) {
      logger.error('Error fetching matches by date:', error.message);
      throw error;
    }
  }

  /**
   * Get matches by date range
   */
  async getMatchesByDateRange(from, to) {
    try {
      const result = await apiManager.request(
        'fixtures',
        '/fixtures',
        { from: from, to: to }
      );

      return this.transformMatches(result.data);
    } catch (error) {
      logger.error('Error fetching matches by date range:', error.message);
      throw error;
    }
  }

  /**
   * Get match details by ID
   */
  async getMatchDetails(matchId) {
    try {
      const result = await apiManager.request(
        'fixtures',
        '/fixtures',
        { id: matchId }
      );

      if (!result.data.response || result.data.response.length === 0) {
        throw new Error('Match not found');
      }

      return this.transformMatchDetails(result.data.response[0]);
    } catch (error) {
      logger.error('Error fetching match details:', error.message);
      throw error;
    }
  }

  /**
   * Get match statistics
   */
  async getMatchStatistics(matchId) {
    try {
      const result = await apiManager.request(
        'statistics',
        '/fixtures/statistics',
        { fixture: matchId }
      );

      return this.transformStatistics(result.data);
    } catch (error) {
      logger.error('Error fetching match statistics:', error.message);
      throw error;
    }
  }

  /**
   * Get match events (goals, cards, substitutions)
   */
  async getMatchEvents(matchId) {
    try {
      const result = await apiManager.request(
        'fixtures',
        '/fixtures/events',
        { fixture: matchId }
      );

      return this.transformEvents(result.data);
    } catch (error) {
      logger.error('Error fetching match events:', error.message);
      throw error;
    }
  }

  /**
   * Get match lineups
   */
  async getMatchLineups(matchId) {
    try {
      const result = await apiManager.request(
        'lineups',
        '/fixtures/lineups',
        { fixture: matchId }
      );

      return this.transformLineups(result.data);
    } catch (error) {
      logger.error('Error fetching match lineups:', error.message);
      throw error;
    }
  }

  /**
   * Get matches by league
   */
  async getMatchesByLeague(leagueId, season) {
    try {
      const result = await apiManager.request(
        'fixtures',
        '/fixtures',
        { league: leagueId, season: season || new Date().getFullYear() }
      );

      return this.transformMatches(result.data);
    } catch (error) {
      logger.error('Error fetching matches by league:', error.message);
      throw error;
    }
  }

  /**
   * Get matches by team
   */
  async getMatchesByTeam(teamId, season) {
    try {
      const result = await apiManager.request(
        'fixtures',
        '/fixtures',
        { team: teamId, season: season || new Date().getFullYear() }
      );

      return this.transformMatches(result.data);
    } catch (error) {
      logger.error('Error fetching matches by team:', error.message);
      throw error;
    }
  }

  /**
   * Transform matches data to standardized format
   */
  transformMatches(apiData) {
    if (!apiData.response) {
      return [];
    }

    return apiData.response.map(match => ({
      id: match.fixture.id,
      date: match.fixture.date,
      timestamp: match.fixture.timestamp,
      status: {
        short: match.fixture.status.short,
        long: match.fixture.status.long,
        elapsed: match.fixture.status.elapsed
      },
      league: {
        id: match.league.id,
        name: match.league.name,
        country: match.league.country,
        logo: match.league.logo,
        flag: match.league.flag,
        season: match.league.season
      },
      teams: {
        home: {
          id: match.teams.home.id,
          name: match.teams.home.name,
          logo: match.teams.home.logo
        },
        away: {
          id: match.teams.away.id,
          name: match.teams.away.name,
          logo: match.teams.away.logo
        }
      },
      goals: {
        home: match.goals.home,
        away: match.goals.away
      },
      score: {
        halftime: match.score.halftime,
        fulltime: match.score.fulltime,
        extratime: match.score.extratime,
        penalty: match.score.penalty
      }
    }));
  }

  /**
   * Transform match details
   */
  transformMatchDetails(match) {
    return {
      id: match.fixture.id,
      referee: match.fixture.referee,
      timezone: match.fixture.timezone,
      date: match.fixture.date,
      timestamp: match.fixture.timestamp,
      venue: {
        name: match.fixture.venue.name,
        city: match.fixture.venue.city
      },
      status: {
        short: match.fixture.status.short,
        long: match.fixture.status.long,
        elapsed: match.fixture.status.elapsed
      },
      league: {
        id: match.league.id,
        name: match.league.name,
        country: match.league.country,
        logo: match.league.logo,
        flag: match.league.flag,
        season: match.league.season,
        round: match.league.round
      },
      teams: {
        home: {
          id: match.teams.home.id,
          name: match.teams.home.name,
          logo: match.teams.home.logo,
          winner: match.teams.home.winner
        },
        away: {
          id: match.teams.away.id,
          name: match.teams.away.name,
          logo: match.teams.away.logo,
          winner: match.teams.away.winner
        }
      },
      goals: {
        home: match.goals.home,
        away: match.goals.away
      },
      score: {
        halftime: match.score.halftime,
        fulltime: match.score.fulltime,
        extratime: match.score.extratime,
        penalty: match.score.penalty
      }
    };
  }

  /**
   * Transform statistics
   */
  transformStatistics(apiData) {
    if (!apiData.response) {
      return null;
    }

    return apiData.response.map(teamStats => ({
      team: {
        id: teamStats.team.id,
        name: teamStats.team.name,
        logo: teamStats.team.logo
      },
      statistics: teamStats.statistics.reduce((acc, stat) => {
        acc[stat.type.toLowerCase().replace(/ /g, '_')] = stat.value;
        return acc;
      }, {})
    }));
  }

  /**
   * Transform events
   */
  transformEvents(apiData) {
    if (!apiData.response) {
      return [];
    }

    return apiData.response.map(event => ({
      time: {
        elapsed: event.time.elapsed,
        extra: event.time.extra
      },
      team: {
        id: event.team.id,
        name: event.team.name,
        logo: event.team.logo
      },
      player: {
        id: event.player.id,
        name: event.player.name
      },
      assist: event.assist ? {
        id: event.assist.id,
        name: event.assist.name
      } : null,
      type: event.type,
      detail: event.detail,
      comments: event.comments
    }));
  }

  /**
   * Transform lineups
   */
  transformLineups(apiData) {
    if (!apiData.response) {
      return [];
    }

    return apiData.response.map(lineup => ({
      team: {
        id: lineup.team.id,
        name: lineup.team.name,
        logo: lineup.team.logo
      },
      formation: lineup.formation,
      startXI: lineup.startXI.map(player => ({
        player: player.player,
        position: {
          x: player.player.pos,
          y: player.player.grid
        }
      })),
      substitutes: lineup.substitutes.map(player => player.player),
      coach: lineup.coach
    }));
  }

  /**
   * Transform SportMonks live matches data
   */
  transformLiveMatches(apiData) {
    if (!apiData || !apiData.data) {
      return [];
    }

    return apiData.data.map(match => {
      const homeParticipant = match.participants?.find(p => p.meta?.location === 'home') || {};
      const awayParticipant = match.participants?.find(p => p.meta?.location === 'away') || {};
      const currentScore = match.scores?.find(score => score.description === 'CURRENT') || {};

      return {
        id: match.id?.toString(),
        name: match.name || `${homeParticipant.name ?? 'Home'} vs ${awayParticipant.name ?? 'Away'}`,
        status: match.status,
        startTime: match.starting_at,
        league: {
          id: match.league?.id?.toString(),
          name: match.league?.name,
          country: match.league?.country?.name,
          round: match.round?.data?.name
        },
        homeTeam: {
          id: homeParticipant.id?.toString(),
          name: homeParticipant.name,
          logo: homeParticipant.image_path
        },
        awayTeam: {
          id: awayParticipant.id?.toString(),
          name: awayParticipant.name,
          logo: awayParticipant.image_path
        },
        score: {
          home: currentScore?.score?.goals?.home ?? 0,
          away: currentScore?.score?.goals?.away ?? 0
        },
        events: (match.events || []).map(event => ({
          id: event.id?.toString(),
          type: event.type,
          minute: event.minute,
          extraMinute: event.extra,
          relatedTeamId: event.participant_id?.toString(),
          isHomeTeam: event.participant_id === homeParticipant.id,
          playerName: event.player_name
        }))
      };
    });
  }
}

module.exports = new MatchService();

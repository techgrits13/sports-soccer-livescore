const apiManager = require('./apiManager');
const logger = require('../config/logger');

class MatchService {
  /**
   * Get live matches
   */
  async getLiveMatches() {
    try {
      logger.info('Fetching live matches...');
      console.log('📡 Requesting live matches from API...');
      
      // Use 'today' instead of 'inplay' as it's more reliable
      // We'll filter for live matches in the transform
      const result = await apiManager.request(
        'live',
        '/livescores/',
        {
          t: 'today'  // Get today's matches, filter for live in transform
        },
        {
          timeout: 20000  // 20 second timeout for live data
        }
      );

      console.log('✅ Live matches data received');
      return this.transformLiveMatches(result.data);
    } catch (error) {
      logger.error('Error fetching live matches:', error.message);
      console.error('❌ Live matches failed:', error.message);
      return [];
    }
  }

  /**
   * Get matches by date
   */
  async getMatchesByDate(date) {
    try {
      const result = await apiManager.request(
        'fixtures',
        '/livescores/',
        { 
          t: 'today'  // Can be 'today', 'tomorrow', 'yesterday'
        }
      );

      return this.transformMatches(result.data);
    } catch (error) {
      logger.error('Error fetching matches by date:', error.message);
      return [];
    }
  }

  /**
   * Get matches by date range
   */
  async getMatchesByDateRange(from, to) {
    try {
      // Use 'today' for now - SoccersAPI uses livescores for date-based queries
      const result = await apiManager.request(
        'fixtures',
        '/livescores/',
        { 
          t: 'today'
        }
      );

      return this.transformMatches(result.data);
    } catch (error) {
      logger.error('Error fetching matches by date range:', error.message);
      return [];
    }
  }

  /**
   * Get match details by ID
   */
  async getMatchDetails(matchId) {
    // SoccersAPI /matches/ endpoint times out
    logger.info('Match details temporarily disabled - awaiting correct SoccersAPI endpoint');
    return null;
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
        '/fixtures/',
        { 
          t: 'season',
          season_id: season || leagueId  // Use season_id parameter
        }
      );

      return this.transformMatches(result.data);
    } catch (error) {
      logger.error('Error fetching matches by league:', error.message);
      return [];
    }
  }

  /**
   * Get matches by team
   */
  async getMatchesByTeam(teamId, season) {
    // SoccersAPI /matches/ endpoint times out
    logger.info('Matches by team temporarily disabled - awaiting correct SoccersAPI endpoint');
    return [];
  }

  /**
   * Transform matches data to standardized format
   */
  transformMatches(apiData) {
    // Handle SoccersAPI format
    if (apiData && apiData.data) {
      return this.transformSoccersMatches(apiData);
    }
    
    // Handle API-Football format (legacy)
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
   * Transform live matches data (handles both SoccersAPI and SportMonks)
   */
  transformLiveMatches(apiData) {
    // Handle SoccersAPI format
    if (apiData && apiData.data && Array.isArray(apiData.data) && apiData.data[0]?.id) {
      return this.transformSoccersMatches(apiData);
    }
    
    // Handle SportMonks format
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

  /**
   * Transform SoccersAPI matches data to standardized format
   */
  transformSoccersMatches(apiData) {
    if (!apiData || !apiData.data) {
      return [];
    }

    const statusMap = {
      Finished: 'FT',
      Notstarted: 'NS',
      Notstarted: 'NS',
      Notstarted: 'NS',
    };

    return apiData.data.map(match => {
      const statusName = match.status_name || 'Notstarted';
      const timeInfo = match.time || {};
      const leagueInfo = match.league || {};
      const homeTeam = match.teams?.home || {};
      const awayTeam = match.teams?.away || {};
      const scores = match.scores || {};

      const fullTimeScore = (scores.ft_score || scores.score || '').split('-');
      const homeScore = Number(scores.home_score ?? fullTimeScore[0] ?? 0) || 0;
      const awayScore = Number(scores.away_score ?? fullTimeScore[1] ?? 0) || 0;

      let timestamp = undefined;
      if (typeof timeInfo.timestamp === 'number') {
        timestamp = timeInfo.timestamp;
      } else if (timeInfo.datetime) {
        const parsed = Date.parse(timeInfo.datetime.replace(' ', 'T'));
        timestamp = Number.isNaN(parsed) ? undefined : Math.floor(parsed / 1000);
      }

      return {
        id: String(match.id ?? ''),
        date: timeInfo.datetime || timeInfo.date || null,
        timestamp,
        status: {
          short: statusMap[statusName] || (timeInfo.minute ? 'LIVE' : 'NS'),
          long: statusName,
          elapsed: timeInfo.minute ?? null
        },
        league: {
          id: String(leagueInfo.id ?? match.league_id ?? ''),
          name: leagueInfo.name || match.stage_name || match.competition_name || 'Unknown League',
          country: leagueInfo.country_name || leagueInfo.country_code || '',
          logo: leagueInfo.logo || leagueInfo.flag || match.league?.flag || null,
          flag: leagueInfo.country_flag || leagueInfo.flag || null,
          season: match.season_name || match.season_id || null
        },
        teams: {
          home: {
            id: String(homeTeam.id ?? match.home_id ?? ''),
            name: homeTeam.name || match.home_name || 'Home',
            logo: homeTeam.img || (match.home_id ? `https://cdn.soccersapi.com/images/soccer/teams/${match.home_id}.png` : null)
          },
          away: {
            id: String(awayTeam.id ?? match.away_id ?? ''),
            name: awayTeam.name || match.away_name || 'Away',
            logo: awayTeam.img || (match.away_id ? `https://cdn.soccersapi.com/images/soccer/teams/${match.away_id}.png` : null)
          }
        },
        goals: {
          home: homeScore,
          away: awayScore
        },
        score: {
          halftime: scores.ht_score
            ? {
                home: Number(scores.ht_score.split('-')[0] || 0) || 0,
                away: Number(scores.ht_score.split('-')[1] || 0) || 0
              }
            : null,
          fulltime: {
            home: homeScore,
            away: awayScore
          }
        }
      };
    });
  }
}

module.exports = new MatchService();

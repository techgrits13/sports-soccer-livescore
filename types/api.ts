/**
 * API Response Types
 * These types match the backend API responses
 */

// Generic API Response wrapper
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  error?: {
    message: string;
    code?: string;
    details?: any[];
  };
  timestamp?: string;
  filters?: any;
}

// Backend Match Types (from API-Football format)
export interface APIMatch {
  id: number;
  date: string;
  timestamp: number;
  status: {
    short: string;
    long: string;
    elapsed: number | null;
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
    round?: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
      winner?: boolean | null;
    };
    away: {
      id: number;
      name: string;
      logo: string;
      winner?: boolean | null;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: {
      home: number | null;
      away: number | null;
    };
    fulltime: {
      home: number | null;
      away: number | null;
    };
    extratime: {
      home: number | null;
      away: number | null;
    } | null;
    penalty: {
      home: number | null;
      away: number | null;
    } | null;
  };
  venue?: {
    name: string | null;
    city: string | null;
  };
  referee?: string | null;
}

// Backend Match Statistics
export interface APIMatchStatistics {
  team: {
    id: number;
    name: string;
    logo: string;
  };
  statistics: {
    [key: string]: any;
  };
}

// Backend Match Events
export interface APIMatchEvent {
  time: {
    elapsed: number;
    extra: number | null;
  };
  team: {
    id: number;
    name: string;
    logo: string;
  };
  player: {
    id: number;
    name: string;
  };
  assist: {
    id: number | null;
    name: string | null;
  } | null;
  type: string;
  detail: string;
  comments: string | null;
}

// Backend Match Lineups
export interface APIMatchLineup {
  team: {
    id: number;
    name: string;
    logo: string;
  };
  formation: string;
  startXI: Array<{
    player: {
      id: number;
      name: string;
      number: number;
      pos: string;
      grid: string;
    };
  }>;
  substitutes: Array<{
    id: number;
    name: string;
    number: number;
    pos: string;
  }>;
  coach: {
    id: number;
    name: string;
    photo: string;
  };
}

// Backend League Types
export interface APILeague {
  id: number;
  name: string;
  type: string;
  logo: string;
  country: {
    name: string;
    code: string;
    flag: string;
  };
  season: number;
}

// Backend Team Types
export interface APITeam {
  id: number;
  name: string;
  code: string;
  country: string;
  founded: number;
  logo: string;
  venue: {
    id: number;
    name: string;
    address: string;
    city: string;
    capacity: number;
    surface: string;
    image: string;
  };
}

// Backend Standings
export interface APIStanding {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  points: number;
  goalsDiff: number;
  group: string;
  form: string;
  status: string;
  description: string;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
  home: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
  away: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
  update: string;
}

// Backend Player/Scorer Types
export interface APIPlayer {
  player: {
    id: number;
    name: string;
    firstname: string;
    lastname: string;
    age: number;
    birth: {
      date: string;
      place: string;
      country: string;
    };
    nationality: string;
    height: string;
    weight: string;
    photo: string;
  };
  statistics: Array<{
    team: {
      id: number;
      name: string;
      logo: string;
    };
    games: {
      appearances: number;
      lineups: number;
      minutes: number;
      position: string;
      rating: string;
    };
    goals: {
      total: number;
      assists: number;
    };
  }>;
}

// API Quota Status
export interface APIQuotaStatus {
  quota: {
    apiFootball: {
      used: number;
      limit: number;
      remaining: number;
      percentage: number;
    };
    footballData: {
      used: number;
      limit: number;
      remaining: number;
      percentage: number;
    };
    lastReset?: string;
  };
  cache: {
    keys: number;
    hits: number;
    misses: number;
    hitRate?: number;
  };
}

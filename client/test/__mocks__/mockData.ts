import {
  League,
  Page,
  Revisions,
  Player,
  Country,
  Team,
  Comment,
  UserProfile,
  Suggestion,
  PublicUser,
  User,
  Tag,
} from '../../src/types';

// Mock Data for League
export const mockLeagues: League[] = [
  {
    id: 1,
    name: 'Premier League',
    country_id: 1,
    country_name: 'England',
    emblem_image_url: 'https://example.com/emblem1.png',
    page_id: 101,
    content: 'The top football league in England.',
  },
  {
    id: 2,
    name: 'La Liga',
    country_id: 2,
    country_name: 'Spain',
    emblem_image_url: 'https://example.com/emblem2.png',
    page_id: 102,
    content: 'The premier football league in Spain.',
  },
  {
    id: 3,
    name: 'Serie A',
    country_id: 3,
    country_name: 'Italy',
    emblem_image_url: 'https://example.com/emblem3.png',
    page_id: 103,
    content: 'Top-tier football league in Italy.',
  },
];

// Mock Data for League Details (Page)
export const mockPage: Page = {
  created_at: new Date('2020-01-01'),
  view_count: 1000,
};

// Mock Data for Tags
export const mockTags: Tag[] = [
  { tag_id: 1, tag_name: 'Leagues' },
  { tag_id: 2, tag_name: 'Players' },
  { tag_id: 3, tag_name: 'Teams' },
];

// Mock Data for Countries
export const mockCountries: Country[] = [
  {
    country_name: 'England',
    flag_image_url: 'https://example.com/england-flag.png',
    country_id: 1,
  },
  { country_name: 'Spain', flag_image_url: 'https://example.com/spain-flag.png', country_id: 2 },
  { country_name: 'Italy', flag_image_url: 'https://example.com/italy-flag.png', country_id: 3 },
];

// Mock Data for Players
export const mockPlayers: Player[] = [
  {
    id: 1,
    name: 'Harry Kane',
    birth_date: new Date('1993-07-28'),
    height: 188,
    country_id: 1,
    country_name: 'England',
    team_name: 'Tottenham Hotspur',
    team_id: 101,
    picture_url: 'https://example.com/player1.png',
    page_id: 201,
    content: 'A prolific striker from England.',
    league_id: 1,
    league_name: 'Premier League',
  },
  {
    id: 2,
    name: 'Lionel Messi',
    birth_date: new Date('1987-06-24'),
    height: 170,
    country_id: 2,
    country_name: 'Argentina',
    team_name: 'Paris Saint-Germain',
    team_id: 102,
    picture_url: 'https://example.com/player2.png',
    page_id: 202,
    content: 'Argentinian forward and legend of the sport.',
    league_id: 2,
    league_name: 'La Liga',
  },
];

// Mock Data for Teams
export const mockTeams: Team[] = [
  {
    name: 'Tottenham Hotspur',
    id: 101,
    country_id: 1,
    country_name: 'England',
    coach: 'Antonio Conte',
    league_id: 1,
    league_name: 'Premier League',
    emblem_image_url: 'https://example.com/team1.png',
    page_id: 301,
    content: 'London-based football team competing in Premier League.',
  },
  {
    name: 'Paris Saint-Germain',
    id: 102,
    country_id: 2,
    country_name: 'France',
    coach: 'Christophe Galtier',
    league_id: 2,
    league_name: 'Ligue 1',
    emblem_image_url: 'https://example.com/team2.png',
    page_id: 302,
    content: 'Top football club in France playing in Ligue 1.',
  },
];

// Mock Data for Comments
export const mockComments: Comment[] = [
  {
    comment_id: 1,
    user_id: 1,
    content: 'Great performance by the team!',
    created_at: new Date('2024-11-10'),
    updated_at: new Date('2024-11-10'),
    page_id: 101,
    likes: 20,
    username: 'john_doe',
    profile_image_url: 'https://example.com/profile1.png',
  },
  {
    comment_id: 2,
    user_id: 2,
    content: 'Amazing goals scored by Messi.',
    created_at: new Date('2024-11-10'),
    updated_at: new Date('2024-11-10'),
    page_id: 102,
    likes: 15,
    username: 'jane_smith',
    profile_image_url: 'https://example.com/profile2.png',
  },
];

// Mock Data for User Profiles
export const mockUserProfile: UserProfile = {
  username: 'john_doe',
  email: 'johndoe@example.com',
  photo: 'https://example.com/profile1.png',
  firstLogin: '2024-01-01',
  lastLogin: '2024-11-10',
  is_admin: false,
  user_id: 1,
};

// Mock Data for Suggestions (Search Bar)
export const mockSuggestions: Suggestion[] = [
  { type: 'league', id: 1, name: 'Premier League' },
  { type: 'player', id: 2, name: 'Harry Kane' },
];

// Mock Data for Public User
export const mockPublicUser: PublicUser = {
  username: 'john_doe',
  email: 'johndoe@example.com',
  photo: 'https://example.com/profile1.png',
  firstLogin: '2024-01-01',
  lastLogin: '2024-11-10',
  is_admin: false,
  user_id: 1,
};

// Mock Data for User
export const mockUser: User = {
  user_id: 1,
  username: 'john_doe',
  email: 'johndoe@example.com',
  profile_image_url: 'https://example.com/profile1.png',
  first_login: new Date('2024-01-01'),
  last_login: new Date('2024-11-10'),
  is_admin: false,
  google_id: '',
};

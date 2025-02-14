import leagueService from '../../src/services/league-service';
import axios from 'axios';
import { League, User, Team } from '../../src/types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('LeagueService tests', () => {
  test('getLeague returns the correct league data', async () => {
    const leagueId = 1;
    const mockLeague: League = {
      id: leagueId,
      name: 'Premier League',
      country_id: 1,
      country_name: 'England',
      emblem_image_url: '',
      page_id: 101,
      content: 'Top English football league',
    };

    mockedAxios.get.mockResolvedValueOnce({ data: mockLeague });

    const league = await leagueService.getLeague(leagueId);

    expect(mockedAxios.get).toHaveBeenCalledWith(`/league/${leagueId}`);
    expect(league).toEqual(mockLeague);
  });

  test('listAllLeagues returns all leagues', async () => {
    const mockLeagues: League[] = [
      {
        id: 1,
        name: 'Premier League',
        country_id: 1,
        country_name: 'England',
        emblem_image_url: '',
        page_id: 101,
        content: 'Top English football league',
      },
      {
        id: 2,
        name: 'La Liga',
        country_id: 2,
        country_name: 'Spain',
        emblem_image_url: '',
        page_id: 102,
        content: 'Top Spanish football league',
      },
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: mockLeagues });

    const leagues = await leagueService.listAllLeagues();

    expect(mockedAxios.get).toHaveBeenCalledWith('/league');
    expect(leagues).toEqual(mockLeagues);
  });

  test('listSetAmountOfLeagues returns a set amount of leagues', async () => {
    const amount = 2;
    const mockLeagues: League[] = [
      {
        id: 1,
        name: 'Premier League',
        country_id: 1,
        country_name: 'England',
        emblem_image_url: '',
        page_id: 101,
        content: 'Top English football league',
      },
      {
        id: 2,
        name: 'La Liga',
        country_id: 2,
        country_name: 'Spain',
        emblem_image_url: '',
        page_id: 102,
        content: 'Top Spanish football league',
      },
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: mockLeagues });

    const leagues = await leagueService.listSetAmountOfLeagues(amount);

    expect(mockedAxios.get).toHaveBeenCalledWith(`/league?amount=${amount}`);
    expect(leagues).toEqual(mockLeagues);
  });

  test('addLeague adds a league and returns the new league id', async () => {
    const mockLeagueId = 4;
    const leagueData = {
      name: 'Serie A',
      country: 3,
      emblem_image_url: 'url',
      content: 'Italian football league',
    };

    localStorage.setItem('user_id', '123');
    mockedAxios.post.mockResolvedValueOnce({ data: { id: mockLeagueId } });

    const leagueId = await leagueService.addLeague(
      leagueData.name,
      leagueData.country,
      leagueData.emblem_image_url,
      leagueData.content,
    );

    expect(mockedAxios.post).toHaveBeenCalledWith('/league_id/new', {
      ...leagueData,
      user_id: '123',
    });
    expect(leagueId).toEqual(mockLeagueId);
  });

  test('updateLeague updates the league', async () => {
    const leagueId = 1;
    const leagueData = {
      name: 'Updated League',
      country: 1,
      emblem_image_url: 'new_url',
      content: 'Updated Content',
      page_id: 101,
    };

    mockedAxios.put.mockResolvedValueOnce({});

    await leagueService.updateLeague(
      leagueId,
      leagueData.name,
      leagueData.country,
      leagueData.emblem_image_url,
      leagueData.page_id,
      leagueData.content,
    );

    expect(mockedAxios.put).toHaveBeenCalledWith(`/league/${leagueId}`, leagueData);
  });

  test('deleteLeague deletes the league', async () => {
    const pageId = 101;

    mockedAxios.delete.mockResolvedValueOnce({});

    await leagueService.deleteLeague(pageId);

    expect(mockedAxios.delete).toHaveBeenCalledWith(`/league/${pageId}`);
  });

  test('getCreator returns the creator of the league', async () => {
    const pageId = 101;
    const mockUser: User = {
      google_id: 'google123',
      user_id: 1,
      username: 'Creator',
      email: 'creator@example.com',
      first_login: new Date(),
      last_login: new Date(),
      is_admin: false,
    };

    mockedAxios.get.mockResolvedValueOnce({ data: mockUser });

    const user = await leagueService.getCreator(pageId);

    expect(mockedAxios.get).toHaveBeenCalledWith(`/creator/${pageId}`);
    expect(user).toEqual(mockUser);
  });

  test('getTeamsInLeague returns teams in the league', async () => {
    const leagueId = 1;
    const mockTeams: Team[] = [
      {
        id: 1,
        name: 'Team 1',
        country_id: 1,
        country_name: 'Country A',
        coach: 'Coach 1',
        league_id: leagueId,
        league_name: 'League 1',
        emblem_image_url: '',
        page_id: 201,
        content: 'Team content',
      },
      {
        id: 2,
        name: 'Team 2',
        country_id: 2,
        country_name: 'Country B',
        coach: 'Coach 2',
        league_id: leagueId,
        league_name: 'League 1',
        emblem_image_url: '',
        page_id: 202,
        content: 'Team content',
      },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockTeams });

    const teams = await leagueService.getTeamsInLeague(leagueId);

    expect(mockedAxios.get).toHaveBeenCalledWith(`/team/league/${leagueId}`);
    expect(teams).toEqual(mockTeams);
  });
});

describe('LeagueService additional tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('getLeague throws an error when request fails', async () => {
    const leagueId = 1;
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

    await expect(leagueService.getLeague(leagueId)).rejects.toThrow('Network Error');
    expect(mockedAxios.get).toHaveBeenCalledWith(`/league/${leagueId}`);
  });

  test('addLeague returns -1 when user is not logged in', async () => {
    localStorage.removeItem('user_id');
    const leagueData = {
      name: 'Serie A',
      country: 3,
      emblem_image_url: 'url',
      content: 'Italian football league',
    };

    const result = await leagueService.addLeague(
      leagueData.name,
      leagueData.country,
      leagueData.emblem_image_url,
      leagueData.content,
    );

    expect(result).toBe(-1);
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  test('deleteLeague throws an error when request fails', async () => {
    const pageId = 101;
    mockedAxios.delete.mockRejectedValueOnce(new Error('Delete Failed'));

    await expect(leagueService.deleteLeague(pageId)).rejects.toThrow('Delete Failed');
    expect(mockedAxios.delete).toHaveBeenCalledWith(`/league/${pageId}`);
  });

  test('getTeamsInLeague throws an error when request fails', async () => {
    const leagueId = 1;
    mockedAxios.get.mockRejectedValueOnce(new Error('Request Failed'));

    await expect(leagueService.getTeamsInLeague(leagueId)).rejects.toThrow('Request Failed');
    expect(mockedAxios.get).toHaveBeenCalledWith(`/team/league/${leagueId}`);
  });
});

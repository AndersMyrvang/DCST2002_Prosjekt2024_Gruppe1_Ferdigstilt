import teamService from '../../src/services/team-service';
import axios from 'axios';
import { Team, League, Player } from '../../src/types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('TeamService tests', () => {
  test('getTeam returns the correct team data', async () => {
    const teamId = 1;
    const mockTeam: Team = {
      id: teamId,
      name: 'Team A',
      country_id: 1,
      country_name: 'Country A',
      coach: 'Coach A',
      league_id: 2,
      league_name: 'League B',
      emblem_image_url: '',
      page_id: 101,
      content: 'A strong team',
    };

    mockedAxios.get.mockResolvedValueOnce({ data: mockTeam });

    const team = await teamService.getTeam(teamId);

    expect(mockedAxios.get).toHaveBeenCalledWith(`/team/${teamId}`);
    expect(team).toEqual(mockTeam);
  });

  test('getLeagues returns the leagues for teams', async () => {
    const mockLeagues: League[] = [
      {
        id: 1,
        name: 'League 1',
        country_id: 1,
        country_name: 'Country A',
        emblem_image_url: '',
        page_id: 1,
        content: '',
      },
      {
        id: 2,
        name: 'League 2',
        country_id: 2,
        country_name: 'Country B',
        emblem_image_url: '',
        page_id: 2,
        content: '',
      },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockLeagues });

    const leagues = await teamService.getLeagues();

    expect(mockedAxios.get).toHaveBeenCalledWith('/team/:id/leagues');
    expect(leagues).toEqual(mockLeagues);
  });

  test('updateTeam updates the team data', async () => {
    const teamId = 1;
    const teamData = {
      name: 'Updated Team A',
      country: 1,
      coach: 'New Coach',
      league: 3,
      emblem_image_url: 'new_url',
      content: 'Updated content',
      page_id: 101,
    };

    mockedAxios.put.mockResolvedValueOnce({});

    await teamService.updateTeam(
      teamId,
      teamData.name,
      teamData.country,
      teamData.coach,
      teamData.league,
      teamData.emblem_image_url,
      teamData.content,
      teamData.page_id,
    );

    expect(mockedAxios.put).toHaveBeenCalledWith(`/team/${teamId}`, teamData);
  });

  test('addTeam adds a team and returns the new team id', async () => {
    const mockTeamId = 4;
    const teamData = {
      name: 'New Team',
      country: 1,
      coach: 'Coach B',
      league: 1,
      emblem_image_url: 'url',
      content: 'New team content',
    };

    localStorage.setItem('user_id', '123');
    mockedAxios.post.mockResolvedValueOnce({ data: { id: mockTeamId } });

    const teamId = await teamService.addTeam(
      teamData.name,
      teamData.country,
      teamData.coach,
      teamData.league,
      teamData.emblem_image_url,
      teamData.content,
    );

    expect(mockedAxios.post).toHaveBeenCalledWith('/team_id/new', {
      ...teamData,
      user_id: '123',
    });
    expect(teamId).toEqual(mockTeamId);
  });

  test('deleteTeam deletes the team', async () => {
    const pageId = 101;

    mockedAxios.delete.mockResolvedValueOnce({});

    await teamService.deleteTeam(pageId);

    expect(mockedAxios.delete).toHaveBeenCalledWith(`/team/${pageId}`);
  });

  test('listSetAmountOfTeams returns a set amount of teams', async () => {
    const amount = 2;
    const mockTeams: Team[] = [
      {
        id: 1,
        name: 'Team A',
        country_id: 1,
        country_name: 'Country A',
        coach: 'Coach A',
        league_id: 1,
        league_name: 'League A',
        emblem_image_url: '',
        page_id: 101,
        content: 'A strong team',
      },
      {
        id: 2,
        name: 'Team B',
        country_id: 2,
        country_name: 'Country B',
        coach: 'Coach B',
        league_id: 2,
        league_name: 'League B',
        emblem_image_url: '',
        page_id: 102,
        content: 'Another strong team',
      },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockTeams });

    const teams = await teamService.listSetAmountOfTeams(amount);

    expect(mockedAxios.get).toHaveBeenCalledWith(`/team?amount=${amount}`);
    expect(teams).toEqual(mockTeams);
  });

  test('listAllTeams returns all teams', async () => {
    const mockTeams: Team[] = [
      {
        id: 1,
        name: 'Team A',
        country_id: 1,
        country_name: 'Country A',
        coach: 'Coach A',
        league_id: 1,
        league_name: 'League A',
        emblem_image_url: '',
        page_id: 101,
        content: 'A strong team',
      },
      {
        id: 2,
        name: 'Team B',
        country_id: 2,
        country_name: 'Country B',
        coach: 'Coach B',
        league_id: 2,
        league_name: 'League B',
        emblem_image_url: '',
        page_id: 102,
        content: 'Another strong team',
      },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockTeams });

    const teams = await teamService.listAllTeams();

    expect(mockedAxios.get).toHaveBeenCalledWith('/team');
    expect(teams).toEqual(mockTeams);
  });

  test('listAllPlayersOnTeam returns all players on the team', async () => {
    const teamId = 1;
    const mockPlayers: Player[] = [
      {
        id: 1,
        name: 'Player 1',
        birth_date: new Date(),
        height: 180,
        country_id: 1,
        country_name: 'Country A',
        team_name: 'Team A',
        team_id: teamId,
        picture_url: '',
        page_id: 201,
        content: 'Player bio',
        league_id: 1,
        league_name: 'League A',
      },
      {
        id: 2,
        name: 'Player 2',
        birth_date: new Date(),
        height: 185,
        country_id: 2,
        country_name: 'Country B',
        team_name: 'Team A',
        team_id: teamId,
        picture_url: '',
        page_id: 202,
        content: 'Player bio',
        league_id: 1,
        league_name: 'League A',
      },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockPlayers });

    const players = await teamService.listAllPlayersOnTeam(teamId);

    expect(mockedAxios.get).toHaveBeenCalledWith(`/team/${teamId}/players`);
    expect(players).toEqual(mockPlayers);
  });

  test('getTeam handles API errors gracefully', async () => {
    const teamId = 1;
    mockedAxios.get.mockRejectedValueOnce(new Error('Failed to fetch team'));

    await expect(teamService.getTeam(teamId)).rejects.toThrow('Failed to fetch team');
    expect(mockedAxios.get).toHaveBeenCalledWith(`/team/${teamId}`);
  });

  test('getLeagues handles API errors gracefully', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Failed to fetch leagues'));

    await expect(teamService.getLeagues()).rejects.toThrow('Failed to fetch leagues');
    expect(mockedAxios.get).toHaveBeenCalledWith('/team/:id/leagues');
  });

  test('updateTeam handles API errors gracefully', async () => {
    const teamId = 1;
    const teamData = {
      name: 'Updated Team A',
      country: 1,
      coach: 'New Coach',
      league: 3,
      emblem_image_url: 'new_url',
      content: 'Updated content',
      page_id: 101,
    };

    mockedAxios.put.mockRejectedValueOnce(new Error('Update failed'));

    await expect(
      teamService.updateTeam(
        teamId,
        teamData.name,
        teamData.country,
        teamData.coach,
        teamData.league,
        teamData.emblem_image_url,
        teamData.content,
        teamData.page_id,
      ),
    ).rejects.toThrow('Update failed');
  });

  test('deleteTeam handles API errors gracefully', async () => {
    const pageId = 101;
    mockedAxios.delete.mockRejectedValueOnce(new Error('Delete team failed'));

    await expect(teamService.deleteTeam(pageId)).rejects.toThrow('Delete team failed');
    expect(mockedAxios.delete).toHaveBeenCalledWith(`/team/${pageId}`);
  });

  test('listSetAmountOfTeams handles empty response gracefully', async () => {
    const amount = 2;
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    const teams = await teamService.listSetAmountOfTeams(amount);

    expect(teams).toEqual([]);
    expect(mockedAxios.get).toHaveBeenCalledWith(`/team?amount=${amount}`);
  });

  test('listAllTeams handles empty response gracefully', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    const teams = await teamService.listAllTeams();

    expect(teams).toEqual([]);
    expect(mockedAxios.get).toHaveBeenCalledWith('/team');
  });

  test('listAllPlayersOnTeam handles empty response gracefully', async () => {
    const teamId = 1;
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    const players = await teamService.listAllPlayersOnTeam(teamId);

    expect(players).toEqual([]);
    expect(mockedAxios.get).toHaveBeenCalledWith(`/team/${teamId}/players`);
  });

  test('getLeagues handles malformed response gracefully', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: null });

    const leagues = await teamService.getLeagues();

    expect(leagues).toBeNull();
    expect(mockedAxios.get).toHaveBeenCalledWith('/team/:id/leagues');
  });

  test('addTeam returns -1 if no user is logged in', async () => {
    localStorage.removeItem('user_id');

    const result = await teamService.addTeam(
      'New Team',
      1,
      'Coach B',
      1,
      'url',
      'New team content',
    );

    expect(result).toBe(-1);
  });
});

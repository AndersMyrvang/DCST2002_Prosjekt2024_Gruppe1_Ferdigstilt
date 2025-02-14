import playerService from '../../src/services/player-service';
import mockedAxios from 'axios';
import { Player, Country, Team, User, Page, Revisions } from '../../src/types';

jest.mock('axios');

const mockPlayerData: Player = {
  id: 123,
  name: 'Lionel Messi',
  birth_date: new Date('1987-06-24'),
  height: 170,
  country_id: 1,
  country_name: 'Argentina',
  team_name: 'Barcelona',
  team_id: 1,
  picture_url: 'http://example.com/messi.jpg',
  page_id: 101,
  content: 'Professional football player.',
  league_id: 1,
  league_name: 'La Liga',
};

const mockCountryData: Country = {
  country_name: 'Argentina',
  flag_image_url: 'http://example.com/argentina-flag.jpg',
  country_id: 1,
};

const mockTeamData: Team = {
  id: 1,
  name: 'Paris Saint-Germain',
  country_id: 1,
  country_name: 'France',
  coach: 'Christophe Galtier',
  league_id: 1,
  league_name: 'Ligue 1',
  emblem_image_url: 'http://example.com/psg-logo.jpg',
  page_id: 101,
  content: 'Football club in Paris.',
};

const mockUserData: User = {
  google_id: '123',
  user_id: 1,
  username: 'admin',
  email: 'admin@example.com',
  profile_image_url: 'http://example.com/admin-pic.jpg',
  first_login: new Date(),
  last_login: new Date(),
  is_admin: true,
};

const mockPageData: Page = {
  page_id: 101,
  created_at: new Date(),
  view_count: 0,
};

describe('PlayerService', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('user_id', '123');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getPlayer fetches a player by ID', async () => {
    (mockedAxios.get as jest.Mock).mockResolvedValueOnce({ data: mockPlayerData });

    const result = await playerService.getPlayer(mockPlayerData.id);

    expect(result).toEqual(mockPlayerData);
    expect(mockedAxios.get).toHaveBeenCalledWith(`/player_id/${mockPlayerData.id}`);
  });

  test('listAllPlayers fetches all players', async () => {
    (mockedAxios.get as jest.Mock).mockResolvedValueOnce({ data: [mockPlayerData] });

    const result = await playerService.listAllPlayers();

    expect(result).toEqual([mockPlayerData]);
    expect(mockedAxios.get).toHaveBeenCalledWith('/players');
  });

  test('addPlayer adds a new player and returns player ID', async () => {
    (mockedAxios.post as jest.Mock).mockResolvedValueOnce({ data: { id: mockPlayerData.id } });

    const result = await playerService.addPlayer(
      mockPlayerData.name,
      mockPlayerData.birth_date.toISOString(),
      mockPlayerData.height,
      mockPlayerData.country_name,
      mockPlayerData.team_name,
      mockPlayerData.picture_url,
      mockPlayerData.content,
    );

    expect(result).toBe(mockPlayerData.id);
    expect(mockedAxios.post).toHaveBeenCalledWith('/player_id/new', {
      name: mockPlayerData.name,
      birth_date: mockPlayerData.birth_date.toISOString(),
      height: mockPlayerData.height,
      country: mockPlayerData.country_name,
      team: mockPlayerData.team_name,
      picture_url: mockPlayerData.picture_url,
      content: mockPlayerData.content,
      user_id: '123',
    });
  });

  test('addPlayer should throw an error when no user is logged in', async () => {
    localStorage.removeItem('user_id');
    const result = await playerService.addPlayer(
      mockPlayerData.name,
      mockPlayerData.birth_date.toISOString(),
      mockPlayerData.height,
      mockPlayerData.country_name,
      mockPlayerData.team_name,
      mockPlayerData.picture_url,
      mockPlayerData.content,
    );

    expect(result).toBe(-1);
  });

  test('deletePlayer deletes a player by page_id', async () => {
    (mockedAxios.delete as jest.Mock).mockResolvedValueOnce({});

    await playerService.deletePlayer(mockPlayerData.page_id);

    expect(mockedAxios.delete).toHaveBeenCalledWith(`/player/${mockPlayerData.page_id}`);
  });

  test('updatePlayer updates player information', async () => {
    const updatedData: Player = { ...mockPlayerData, content: 'Updated Content' };
    (mockedAxios.put as jest.Mock).mockResolvedValueOnce({});

    await playerService.updatePlayer(
      mockPlayerData.id,
      updatedData.name,
      updatedData.birth_date.toISOString(),
      updatedData.height,
      mockPlayerData.country_id,
      mockPlayerData.team_id,
      updatedData.picture_url,
      mockPlayerData.page_id,
      updatedData.content,
    );

    expect(mockedAxios.put).toHaveBeenCalledWith(`/player/${mockPlayerData.id}`, {
      name: updatedData.name,
      birth_date: updatedData.birth_date.toISOString(),
      height: updatedData.height,
      country: mockPlayerData.country_id,
      team: mockPlayerData.team_id,
      picture_url: updatedData.picture_url,
      content: updatedData.content,
      page_id: mockPlayerData.page_id,
    });
  });

  test('listSetAmountOfPlayers fetches players with a limit', async () => {
    (mockedAxios.get as jest.Mock).mockResolvedValueOnce({ data: [mockPlayerData] });

    const result = await playerService.listSetAmountOfPlayers(5);

    expect(result).toEqual([mockPlayerData]);
    expect(mockedAxios.get).toHaveBeenCalledWith('/player?amount=5');
  });

  test('getCountries fetches a list of countries', async () => {
    (mockedAxios.get as jest.Mock).mockResolvedValueOnce({ data: [mockCountryData] });

    const result = await playerService.getCountries();

    expect(result).toEqual([mockCountryData]);
    expect(mockedAxios.get).toHaveBeenCalledWith('/player/countries');
  });

  test('getTeams fetches a list of teams', async () => {
    (mockedAxios.get as jest.Mock).mockResolvedValueOnce({ data: [mockTeamData] });

    const result = await playerService.getTeams();

    expect(result).toEqual([mockTeamData]);
    expect(mockedAxios.get).toHaveBeenCalledWith('/player/teams');
  });

  test('getCountry fetches country by player ID', async () => {
    (mockedAxios.get as jest.Mock).mockResolvedValueOnce({ data: mockCountryData });

    const result = await playerService.getCountry(mockPlayerData.id);

    expect(result).toEqual(mockCountryData);
    expect(mockedAxios.get).toHaveBeenCalledWith(`/player/${mockPlayerData.id}/country`);
  });

  test('getTeam fetches team by player ID', async () => {
    (mockedAxios.get as jest.Mock).mockResolvedValueOnce({ data: mockTeamData });

    const result = await playerService.getTeam(mockPlayerData.id);

    expect(result).toEqual(mockTeamData);
    expect(mockedAxios.get).toHaveBeenCalledWith(`/player/${mockPlayerData.id}/team`);
  });

  test('getCreator fetches user data by page ID', async () => {
    (mockedAxios.get as jest.Mock).mockResolvedValueOnce({ data: mockUserData });

    const result = await playerService.getCreator(mockPlayerData.page_id);

    expect(result).toEqual(mockUserData);
    expect(mockedAxios.get).toHaveBeenCalledWith(`/creator/${mockPlayerData.page_id}`);
  });

  test('getPlayer handles API errors gracefully', async () => {
    (mockedAxios.get as jest.Mock).mockRejectedValueOnce(new Error('Player fetch failed'));

    await expect(playerService.getPlayer(mockPlayerData.id)).rejects.toThrow('Player fetch failed');
    expect(mockedAxios.get).toHaveBeenCalledWith(`/player_id/${mockPlayerData.id}`);
  });

  test('addPlayer returns -1 when user is not logged in', async () => {
    localStorage.removeItem('user_id');

    const result = await playerService.addPlayer(
      mockPlayerData.name,
      mockPlayerData.birth_date.toISOString(),
      mockPlayerData.height,
      mockPlayerData.country_name,
      mockPlayerData.team_name,
      mockPlayerData.picture_url,
      mockPlayerData.content,
    );

    expect(result).toBe(-1);
  });

  test('updatePlayer handles API errors', async () => {
    (mockedAxios.put as jest.Mock).mockRejectedValueOnce(new Error('Update failed'));

    await expect(
      playerService.updatePlayer(
        mockPlayerData.id,
        mockPlayerData.name,
        mockPlayerData.birth_date.toISOString(),
        mockPlayerData.height,
        mockPlayerData.country_id,
        mockPlayerData.team_id,
        mockPlayerData.picture_url,
        mockPlayerData.page_id,
        mockPlayerData.content,
      ),
    ).rejects.toThrow('Update failed');
  });

  test('deletePlayer handles API errors', async () => {
    (mockedAxios.delete as jest.Mock).mockRejectedValueOnce(new Error('Delete failed'));

    await expect(playerService.deletePlayer(mockPlayerData.page_id)).rejects.toThrow(
      'Delete failed',
    );
    expect(mockedAxios.delete).toHaveBeenCalledWith(`/player/${mockPlayerData.page_id}`);
  });

  test('listSetAmountOfPlayers returns an empty array if no players found', async () => {
    (mockedAxios.get as jest.Mock).mockResolvedValueOnce({ data: [] });

    const result = await playerService.listSetAmountOfPlayers(5);

    expect(result).toEqual([]);
    expect(mockedAxios.get).toHaveBeenCalledWith('/player?amount=5');
  });

  test('getCountries handles empty response', async () => {
    (mockedAxios.get as jest.Mock).mockResolvedValueOnce({ data: [] });

    const result = await playerService.getCountries();

    expect(result).toEqual([]);
    expect(mockedAxios.get).toHaveBeenCalledWith('/player/countries');
  });

  test('getTeam handles empty response', async () => {
    (mockedAxios.get as jest.Mock).mockResolvedValueOnce({ data: {} });

    const result = await playerService.getTeam(mockPlayerData.id);

    expect(result).toEqual({});
    expect(mockedAxios.get).toHaveBeenCalledWith(`/player/${mockPlayerData.id}/team`);
  });

  test('getCountry handles API error gracefully', async () => {
    (mockedAxios.get as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch country'));

    await expect(playerService.getCountry(mockPlayerData.id)).rejects.toThrow(
      'Failed to fetch country',
    );
    expect(mockedAxios.get).toHaveBeenCalledWith(`/player/${mockPlayerData.id}/country`);
  });

  test('getRevisedName fetches revised name by page ID', async () => {
    const mockRevisionData: Revisions = {
      revision_id: 1,
      content: "Updated the team's history section with recent achievements.",
      revised_by: 101,
      revised_at: new Date('2024-11-01T14:30:00'),
      page_id: 201,
      username: 'anders',
    };
    (mockedAxios.get as jest.Mock).mockResolvedValueOnce({ data: mockRevisionData });

    const result = await playerService.getRevisedName(mockPlayerData.page_id);

    expect(result).toEqual(mockRevisionData);
    expect(mockedAxios.get).toHaveBeenCalledWith(`/revision/${mockPlayerData.page_id}`);
  });
});

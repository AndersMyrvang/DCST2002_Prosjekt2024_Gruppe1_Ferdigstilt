import leagueService from '../src/services/league-service';
import { pool } from '../src/mysql-pool';
import request from 'supertest';
import express from 'express';
import router from '../src/routes/league-router';
import userService from '../src/services/user-service';

jest.mock('../src/mysql-pool', () => ({
  pool: {
    query: jest.fn(),
    getConnection: jest.fn(),
  },
}));

jest.mock('../src/services/user-service', () => ({
  getUsernameByPageId: jest.fn(),
}));

jest.mock('../src/services/league-service', () => ({
  ...jest.requireActual('../src/services/league-service'),
  listSetAmountOfLeagues: jest.fn(),
  getLeague: jest.fn(),
  addLeague: jest.fn(),
  deleteLeague: jest.fn(),
  updateLeague: jest.fn(),
  listAllTeamsInLeague: jest.fn(),
  getLeagueByTeamId: jest.fn(),
  listAllLeagues: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use(router);

describe('League Routes Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch leagues with amount', async () => {
    const mockLeague = [
      {
        id: 1,
        name: 'League A',
        country_id: 1,
        country_name: 'Country A',
        emblem_image_url: 'url',
        page_id: 1,
        content: 'Sample content',
      },
    ];
    (leagueService.listSetAmountOfLeagues as jest.Mock).mockResolvedValue(mockLeague);

    const response = await request(app).get('/league?amount=1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body).toStrictEqual(mockLeague);
  });

  it('should handle errors at GET /league?amount', async () => {
    (leagueService.listSetAmountOfLeagues as jest.Mock).mockRejectedValue(new Error());

    const response = await request(app).get('/league?amount=1');
    expect(response.status).toBe(500);
    expect(response.body).toStrictEqual({ error: {}, message: 'Error fetching leagues' });
  });

  it('should return all leagues when amount is not specified', async () => {
    const mockLeague = [
      {
        id: 1,
        name: 'League A',
        country_id: 1,
        country_name: 'Country A',
        emblem_image_url: 'url',
        page_id: 1,
        content: 'Sample content',
      },
    ];
    (leagueService.listAllLeagues as jest.Mock).mockResolvedValue(mockLeague);

    const response = await request(app).get('/league?amount=undefined');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(mockLeague.length);
    expect(response.body).toStrictEqual(mockLeague);
  });

  it('should handle errors in GET /league', async () => {
    (leagueService.listAllLeagues as jest.Mock).mockRejectedValue(new Error());

    const response = await request(app).get('/league');
    expect(response.status).toBe(500);
  });

  it('should fetch league at GET /league/:id', async () => {
    const mockLeague = {
      id: 1,
      name: 'League A',
      country_id: 1,
      country_name: 'Country A',
      emblem_image_url: 'url',
      page_id: 1,
      content: 'Sample content',
    };
    (leagueService.getLeague as jest.Mock).mockResolvedValue(mockLeague);

    const response = await request(app).get('/league/1');
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(mockLeague);
  });

  it('should handle error if id is NaN at GET /league/:id', async () => {
    (leagueService.getLeague as jest.Mock).mockRejectedValue(new Error());

    const response = await request(app).get('/league/aString');
    expect(response.status).toBe(400);
  });

  it('should handle error if league is not found at GET /league/:id', async () => {
    (leagueService.getLeague as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app).get('/league/999');
    expect(response.status).toBe(404);
  });

  it('should handle error at internal server errors at GET /league/:id', async () => {
    (leagueService.getLeague as jest.Mock).mockRejectedValue(new Error());

    const response = await request(app).get('/league/1');
    expect(response.status).toBe(500);
  });

  it('should fetch all teams in a league', async () => {
    const mockTeams = [{ name: 'Team A', id: 1 }];
    (leagueService.listAllTeamsInLeague as jest.Mock).mockResolvedValue(mockTeams);

    const response = await request(app).get('/team/league/1');
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(mockTeams);
  });

  it('should handle server error while fetching all teams in a league', async () => {
    const mockTeams = [{ name: 'Team A', id: 1 }];
    (leagueService.listAllTeamsInLeague as jest.Mock).mockRejectedValue(new Error());

    const response = await request(app).get('/team/league/1');
    expect(response.status).toBe(500);
  });

  it('should fetch the league of a team by id', async () => {
    const mockLeague = {
      id: 1,
      name: 'League A',
      country_id: 1,
      country_name: 'Country A',
      emblem_image_url: 'url',
      page_id: 1,
      content: 'Sample content',
    };
    (leagueService.listAllTeamsInLeague as jest.Mock).mockResolvedValue(mockLeague);

    const response = await request(app).get('/team/league/1');
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(mockLeague);
  });

  it('should create a new league', async () => {
    (leagueService.addLeague as jest.Mock).mockResolvedValue(1);

    const response = await request(app).post('/league_id/new').send({
      name: 'League A',
      country: 1,
      emblem_image_url: 'url',
      content: 'Sample content',
      user_id: 1,
    });

    expect(response.status).toBe(201);
    expect(response.body.leagueId).toBe(1);
  });

  it('should handle wrong input while creating a new league', async () => {
    (leagueService.addLeague as jest.Mock).mockResolvedValue(1);

    const response = await request(app).post('/league_id/new').send({
      name: 'League A',
      country: 1,
      emblem_image_url: 'url',
      content: 'Sample content',
      user_id: undefined,
    });

    expect(response.status).toBe(400);
  });

  it('should handle error while creating a new league', async () => {
    (leagueService.addLeague as jest.Mock).mockRejectedValue(new Error());

    const response = await request(app).post('/league_id/new').send({
      name: 'League A',
      country: 1,
      emblem_image_url: 'url',
      content: 'Sample content',
      user_id: 1,
    });

    expect(response.status).toBe(500);
  });

  it('should update a league at PUT /league/:id', async () => {
    const mockLeague = {
      id: 1,
      name: 'League A',
      country_id: 1,
      country_name: 'Country A',
      emblem_image_url: 'url',
      page_id: 1,
      content: 'Sample content',
    };
    (leagueService.updateLeague as jest.Mock).mockResolvedValue(mockLeague);

    const response = await request(app).put('/league/1');
    expect(response.status).toBe(200);
  });

  it('should handle error at PUT /league/:id', async () => {
    (leagueService.updateLeague as jest.Mock).mockRejectedValue(new Error());

    const response = await request(app).put('/league/1');
    expect(response.status).toBe(500);
  });

  it('should delete a league', async () => {
    (leagueService.deleteLeague as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app).delete('/league/1');
    expect(response.status).toBe(200);
  });

  it('should handle error while deleting a league', async () => {
    (leagueService.deleteLeague as jest.Mock).mockRejectedValue(new Error());

    const response = await request(app).delete('/league/1');
    expect(response.status).toBe(500);
  });

  it('should fetch creator by page_id', async () => {
    const mockUser = { username: 'CreatorUser' };
    (userService.getUsernameByPageId as jest.Mock).mockResolvedValue(mockUser);

    const response = await request(app).get('/creator/1');
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(mockUser);
  });

  it('should handle error if creator by page_id is not found', async () => {
    const mockUser = { username: 'CreatorUser' };
    (userService.getUsernameByPageId as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app).get('/creator/1');
    expect(response.status).toBe(404);
  });

  it('should handle error if creator by page_id ends in server error', async () => {
    const mockUser = { username: 'CreatorUser' };
    (userService.getUsernameByPageId as jest.Mock).mockRejectedValue(new Error());

    const response = await request(app).get('/creator/1');
    expect(response.status).toBe(500);
  });
});

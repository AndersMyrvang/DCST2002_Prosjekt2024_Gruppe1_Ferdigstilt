import leagueService from '../src/services/league-service';
import { pool } from '../src/mysql-pool';
import request from 'supertest';
import express from 'express';
import router from '../src/routes/league-router';
import { ResultSetHeader } from 'mysql2';
import { useCallback } from 'react';

jest.mock('../src/mysql-pool', () => ({
  pool: {
    query: jest.fn(),
    getConnection: jest.fn(),
  },
}));

const app = express();
app.use(express.json());
app.use(router);

describe('LeagueService Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch a league by id', async () => {
    const mockLeague = {
      id: 1,
      name: 'League A',
      country: 1,
      country_name: 'Country A',
      emblem_image_url: 'url',
      page_id: 1,
      content: 'Sample content',
    };

    (pool.query as jest.Mock).mockImplementation((query, params, callback) => {
      callback(null, [mockLeague]);
    });

    const league = await leagueService.getLeague(1);

    const expectedLeague = {
      id: 1,
      name: 'League A',
      country_id: 1,
      country_name: 'Country A',
      emblem_image_url: 'url',
      page_id: 1,
      content: 'Sample content',
    };

    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1], expect.any(Function));
    expect(league).toEqual(expectedLeague);
  });

  it('should return undefined if no league is found', async () => {
    (pool.query as jest.Mock).mockImplementation((query, params, callback) => callback(null, []));

    const league = await leagueService.getLeague(999);
    expect(league).toBeUndefined();
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [999], expect.any(Function));
  });

  it('should list a set amount of leagues', async () => {
    const mockLeagues = [
      {
        id: 1,
        name: 'League A',
        country: 1,
        country_name: 'Country A',
        emblem_image_url: 'url',
        page_id: 1,
        content: 'Sample content',
      },
    ];

    (pool.query as jest.Mock).mockImplementation((query, params, callback) =>
      callback(null, mockLeagues),
    );

    const formatted_leagues = [
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

    const leagues = await leagueService.listSetAmountOfLeagues(2);
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [2], expect.any(Function));
    expect(leagues).toEqual(formatted_leagues);
  });

  it('should list all leagues', async () => {
    const mockLeagues = [
      {
        id: 1,
        name: 'League A',
        country: 1,
        country_name: 'Country A',
        emblem_image_url: 'url',
        page_id: 1,
        content: 'Sample content',
      },
    ];

    (pool.query as jest.Mock).mockImplementation((query, callback) => {
      if (query.includes('LIMIT 100')) {
        callback(null, mockLeagues);
      } else {
        callback(new Error('Unexpected query'));
      }
    });

    const formatted_leagues = [
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

    const leagues = await leagueService.listAllLeagues();

    expect(leagues).toEqual(formatted_leagues);
  });

  it('should list all teams in a league', async () => {
    const mockTeams = [{ name: 'Team A', id: 1 }];
    (pool.query as jest.Mock).mockImplementation((query, params, callback) =>
      callback(null, mockTeams),
    );

    const teams = await leagueService.listAllTeamsInLeague(1);
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT * FROM Leagues l JOIN Teams t ON t.league = l.id WHERE l.id=?',
      [1],
      expect.any(Function),
    );
    expect(teams).toEqual(mockTeams);
  });

  it('should update a league', async () => {
    (pool.query as jest.Mock).mockImplementation((query, params, callback) => callback(null));

    await leagueService.updateLeague(1, 'League Updated', 1, 'updated_url', 1, 'Updated content');
    expect(pool.query).toHaveBeenCalledWith(
      'UPDATE Leagues SET name = ?, country = ?, emblem_image_url = ?, page_id = ?, content = ? WHERE id = ?',
      ['League Updated', 1, 'updated_url', 1, 'Updated content', 1],
      expect.any(Function),
    );
  });

  it('should add a league', async () => {
    const mockInsertResult = { insertId: 1 } as ResultSetHeader;

    (pool.getConnection as jest.Mock).mockImplementation((callback) => {
      const mockConnection = {
        beginTransaction: jest.fn((cb) => cb(null)),
        query: jest.fn((query, params, cb) => cb(null, mockInsertResult)),
        commit: jest.fn((cb) => cb(null)),
        release: jest.fn(),
        rollback: jest.fn(),
      };

      callback(null, mockConnection);
      return mockConnection;
    });

    const newLeagueId = await leagueService.addLeague(
      'League A',
      1, 
      'url', 
      'Sample content',
      1, 
    );

    const connection = (pool.getConnection as jest.Mock).mock.results[0].value;

    expect(connection.beginTransaction).toHaveBeenCalled();
    expect(connection.query).toHaveBeenCalledTimes(2);
    expect(connection.commit).toHaveBeenCalled();
    expect(connection.release).toHaveBeenCalled();

    expect(connection.query).toHaveBeenNthCalledWith(
      1,
      'INSERT INTO Pages (created_by, created_at) VALUES (?, NOW())',
      [1],
      expect.any(Function),
    );

    expect(connection.query).toHaveBeenNthCalledWith(
      2,
      'INSERT INTO Leagues (name, country, emblem_image_url, content, page_id) VALUES (?, ?, ?, ?, ?)',
      ['League A', 1, 'url', 'Sample content', 1],
      expect.any(Function),
    );

    expect(newLeagueId).toBe(1);
  });

  it('should rollback transaction if page creation fails in addLeague', async () => {
    const mockConnection = {
      beginTransaction: jest.fn((cb) => cb(null)),
      query: jest
        .fn()
        .mockImplementationOnce((query, params, cb) => cb(new Error('Page creation error'))),
      commit: jest.fn(),
      rollback: jest.fn((cb) => cb(null)),
      release: jest.fn(),
    };

    (pool.getConnection as jest.Mock).mockImplementation((callback) =>
      callback(null, mockConnection),
    );

    await expect(
      leagueService.addLeague('League A', 1, 'url', 'Sample content', 1),
    ).rejects.toThrow('Page creation error');

    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockConnection.rollback).toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
    expect(mockConnection.query).toHaveBeenCalledTimes(1);
  });

  it('should rollback transaction if league creation fails in addLeague', async () => {
    const mockConnection = {
      beginTransaction: jest.fn((cb) => cb(null)),
      query: jest
        .fn()
        .mockImplementationOnce((query, params, cb) => cb(null, { insertId: 1 }))
        .mockImplementationOnce((query, params, cb) => cb(new Error('League creation error'))),
      commit: jest.fn(),
      rollback: jest.fn((cb) => cb(null)),
      release: jest.fn(),
    };

    (pool.getConnection as jest.Mock).mockImplementation((callback) =>
      callback(null, mockConnection),
    );

    await expect(
      leagueService.addLeague('League A', 1, 'url', 'Sample content', 1),
    ).rejects.toThrow('League creation error');

    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockConnection.rollback).toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
    expect(mockConnection.query).toHaveBeenCalledTimes(2);
  });

  it('should fetch a league by team id', async () => {
    const mockLeague = { name: 'League A', id: 1 };
    (pool.query as jest.Mock).mockImplementation((query, params, callback) =>
      callback(null, [{ name: 'League A', id: 1 }]),
    );

    const league = await leagueService.getLeagueByTeamId(1);
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT Leagues.name, Leagues.id FROM `Leagues` JOIN Teams ON Leagues.id = Teams.league WHERE Teams.id = ?',
      [1],
      expect.any(Function),
    );
    expect(league).toEqual(mockLeague);
  });

  it('should return null when no league is found by team id', async () => {
    (pool.query as jest.Mock).mockImplementation((query, params, callback) =>
      callback(null, undefined),
    );

    const league = await leagueService.getLeagueByTeamId(999);
    expect(league).toBeNull();
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT Leagues.name, Leagues.id FROM `Leagues` JOIN Teams ON Leagues.id = Teams.league WHERE Teams.id = ?',
      [999],
      expect.any(Function),
    );
  });

  it('Should delete a league by id', async () => {
    (pool.query as jest.Mock).mockImplementation((query, params, callback) => callback(null));

    await expect(leagueService.deleteLeague(1)).resolves.not.toThrow();
    expect(pool.query).toHaveBeenCalledWith(
      `DELETE FROM Pages WHERE page_id = ?`,
      [1],
      expect.any(Function),
    );
  });

  it('Should handle errors when failing deletion', async () => {
    (pool.query as jest.Mock).mockImplementation((query, params, callback) =>
      callback(new Error('Error deleting message')),
    );

    await expect(leagueService.deleteLeague(1)).rejects.toThrow('Error deleting message');
    expect(pool.query).toHaveBeenCalledWith(
      `DELETE FROM Pages WHERE page_id = ?`,
      [1],
      expect.any(Function),
    );
  });
});

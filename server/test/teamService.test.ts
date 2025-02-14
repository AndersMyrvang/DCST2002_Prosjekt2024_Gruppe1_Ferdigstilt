import teamService from '../src/services/team-service';
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

const mockTeams = [
  {
    id: 1,
    name: 'Team A',
    country: 1,
    country_name: 'Country A',
    coach: 'Coach A',
    league_name: 'League A',
    league_id: 1,
    emblem_image_url: '',
    page_id: 101,
    content: 'Content for Team A',
  },
  {
    id: 2,
    name: 'Team B',
    country: 2,
    country_name: 'Country B',
    coach: 'Coach B',
    league_id: 2,
    league_name: 'League B',
    emblem_image_url: '',
    page_id: 102,
    content: 'Content for Team B',
  },
];
const formattedMockTeams = [
  {
    id: 1,
    name: 'Team A',
    country_id: 1,
    country_name: 'Country A',
    coach: 'Coach A',
    league_name: 'League A',
    league_id: 1,
    emblem_image_url: '',
    page_id: 101,
    content: 'Content for Team A',
  },
  {
    id: 2,
    name: 'Team B',
    country_id: 2,
    country_name: 'Country B',
    coach: 'Coach B',
    league_name: 'League B',
    league_id: 2,
    emblem_image_url: '',
    page_id: 102,
    content: 'Content for Team B',
  },
];
const mockPlayers = [
  {
    id: 1,
    name: 'Player 1',
    birth_date: new Date('1990-01-01'),
    height: 180,
    country_id: 1,
    country_name: 'Country A',
    picture_url: '',
    page_id: 1,
    content: 'Player 1 content',
    team_name: 'Team A',
    team_id: 1,
  },
  {
    id: 2,
    name: 'Player 2',
    birth_date: new Date('1992-05-01'),
    height: 175,
    country_id: 2,
    country_name: 'Country B',
    picture_url: '',
    page_id: 2,
    content: 'Player 2 content',
    team_name: 'Team A',
    team_id: 1,
  },
];
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

describe('Testing teamService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('GetTeam', () => {
    it('should get team by id', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => {
        callback(null, [formattedMockTeams[0]]);
      });

      const team = await teamService.getTeam(1);
      expect(team).toStrictEqual(formattedMockTeams[0]);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1], expect.any(Function));
    });
    it('should return undefined when it cannot find the team', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => {
        callback(null, []);
      });

      const team = await teamService.getTeam(999);
      expect(team).toBeUndefined();
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [999], expect.any(Function));
    });
    it('should handle internal server errors', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => {
        callback(new Error('server error'), null);
      });

      await expect(teamService.getTeam(2)).rejects.toThrow('server error');
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [2], expect.any(Function));
    });
  });
  describe('listSetAmountOfTeams', () => {
    it('should list a set amount of teams', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => {
        callback(null, mockTeams);
      });

      const teams = await teamService.listSetAmountOfTeams(2);
      expect(teams).toStrictEqual(formattedMockTeams);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [2], expect.any(Function));
    });

    it('should handle internal server errors', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => {
        callback(new Error('server error'), null);
      });

      await expect(teamService.listSetAmountOfTeams(2)).rejects.toThrow('server error');
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [2], expect.any(Function));
    });
  });
  describe('listAllTeams', () => {
    it('should list all teams', async () => {
      (pool.query as jest.Mock).mockImplementation((query, callback) => {
        callback(null, mockTeams);
      });

      const teams = await teamService.listAllTeams();
      expect(teams).toStrictEqual(formattedMockTeams);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), expect.any(Function));
    });
    it('should handle internal server errors', async () => {
      (pool.query as jest.Mock).mockImplementation((query, callback) => {
        callback(new Error('server error'), null);
      });

      await expect(teamService.listAllTeams()).rejects.toThrow('server error');
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), expect.any(Function));
    });
  });
  describe('getLeagues', () => {
    it('should get league based on teamID', async () => {
      (pool.query as jest.Mock).mockImplementation((query, callback) => {
        callback(null, mockLeague);
      });

      const league = await teamService.getLeagues();
      expect(league).toStrictEqual(mockLeague);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), expect.any(Function));
    });
    it('should handle internal server errors', async () => {
      (pool.query as jest.Mock).mockImplementation((query, callback) => {
        callback(new Error('server error'), null);
      });

      await expect(teamService.getLeagues()).rejects.toThrow('server error');
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), expect.any(Function));
    });
  });
  describe('UpdateTeam', () => {
    it('should update a team by id', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => {
        callback(null);
      });

      await expect(
        teamService.updateTeam(
          1,
          'Updated Team',
          2,
          'Updated Coach',
          3,
          'updated_url',
          101,
          'Updated Content',
        ),
      ).resolves.not.toThrow();
      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        ['Updated Team', 2, 'Updated Coach', 3, 'updated_url', 101, 'Updated Content', 1],
        expect.any(Function),
      );
    });
    it('should handle internal server errors', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => {
        callback(new Error('server error'), null);
      });

      await expect(
        teamService.updateTeam(
          1,
          'Updated Team',
          2,
          'Updated Coach',
          3,
          'updated_url',
          101,
          'Updated Content',
        ),
      ).rejects.toThrow('server error');
      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        ['Updated Team', 2, 'Updated Coach', 3, 'updated_url', 101, 'Updated Content', 1],
        expect.any(Function),
      );
    });
  });
  describe('addTeam', () => {
    it('should add a team successfully', async () => {
      const mockConnection = {
        beginTransaction: jest.fn((callback) => callback(null)),
        query: jest
          .fn()
          .mockImplementationOnce(
            (query, params, callback) => callback(null, { insertId: 1 }), 
          )
          .mockImplementationOnce(
            (query, params, callback) => callback(null, { insertId: 2 }), 
          ),
        commit: jest.fn((callback) => callback(null)),
        release: jest.fn(),
        rollback: jest.fn(),
      };

      (pool.getConnection as jest.Mock).mockImplementation((callback) =>
        callback(null, mockConnection),
      );

      const teamId = await teamService.addTeam(
        'New Team',
        1,
        'Coach A',
        1,
        'url',
        'Team content',
        1,
      );

      expect(mockConnection.beginTransaction).toHaveBeenCalled();
      expect(mockConnection.query).toHaveBeenNthCalledWith(
        1,
        expect.any(String),
        [1],
        expect.any(Function),
      );
      expect(mockConnection.query).toHaveBeenNthCalledWith(
        2,
        expect.any(String),
        ['New Team', 1, 'Coach A', 1, 'url', 'Team content', 1],
        expect.any(Function),
      );
      expect(mockConnection.commit).toHaveBeenCalled;
      expect(mockConnection.release).toHaveBeenCalled();
      expect(teamId).toBe(2);
    });
    it('should handle errors during page creation', async () => {
      const mockConnection = {
        beginTransaction: jest.fn((callback) => callback(null)),
        query: jest
          .fn()
          .mockImplementationOnce((query, params, callback) =>
            callback(new Error('Page creation error')),
          ),
        commit: jest.fn(),
        rollback: jest.fn((callback) => callback(null)),
        release: jest.fn(),
      };

      (pool.getConnection as jest.Mock).mockImplementation((callback) =>
        callback(null, mockConnection),
      );

      await expect(
        teamService.addTeam('New Team', 1, 'Coach A', 1, 'url', 'Team content', 1),
      ).rejects.toThrow('Page creation error');

      expect(mockConnection.beginTransaction).toHaveBeenCalled();
      expect(mockConnection.query).toHaveBeenCalledTimes(1);
      expect(mockConnection.rollback).toHaveBeenCalled();
      expect(mockConnection.release).toHaveBeenCalled();
    });
    it('should handle errors during team creating', async () => {
      const mockConnection = {
        beginTransaction: jest.fn((callback) => callback(null)),
        query: jest
          .fn()
          .mockImplementationOnce((query, params, callback) => callback(null, { insertId: 1 }))
          .mockImplementationOnce((query, params, callback) =>
            callback(new Error('Team creation error')),
          ),
        commit: jest.fn(),
        rollback: jest.fn((callback) => callback(null)),
        release: jest.fn(),
      };

      (pool.getConnection as jest.Mock).mockImplementation((callback) =>
        callback(null, mockConnection),
      );

      await expect(
        teamService.addTeam('New Team', 1, 'Coach A', 1, 'url', 'Team content', 1),
      ).rejects.toThrow('Team creation error');
      expect(mockConnection.beginTransaction).toHaveBeenCalled();
      expect(mockConnection.query).toHaveBeenCalledTimes(2);
      expect(mockConnection.rollback).toHaveBeenCalled();
      expect(mockConnection.release).toHaveBeenCalled();
    });
  });
  describe('deleteTeam', () => {
    it('should delete a team', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => {
        callback(null);
      });

      await expect(teamService.deleteTeam(1)).resolves.not.toThrow;
      expect(pool.query).toHaveBeenCalledWith(
        'DELETE FROM Pages WHERE page_id = ?',
        [1],
        expect.any(Function),
      );
    });
    it('should handle internal server errors', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => {
        callback(new Error('server error'));
      });

      await expect(teamService.deleteTeam(1)).rejects.toThrow('server error');
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1], expect.any(Function));
    });
  });
  describe('listAllPlayersByTeam', () => {
    it('should list all players from a team', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => {
        callback(null, mockPlayers);
      });

      const players = await teamService.listAllPlayersByTeam(1);
      expect(players).toStrictEqual(mockPlayers);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1], expect.any(Function));
    });
    it('should handle internal server errors', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => {
        callback(new Error('server error'), null);
      });

      await expect(teamService.listAllPlayersByTeam(1)).rejects.toThrow('server error');
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1], expect.any(Function));
    });
  });
});

import request from 'supertest';
import express from 'express';
import { pool } from '../src/mysql-pool';
import playerService from '../src/services/player-service';
import leagueService from '../src/services/league-service';
import playerRouter from '../src/routes/player-router';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

jest.mock('../src/mysql-pool', () => ({
  pool: {
    query: jest.fn(),
    getConnection: jest.fn(),
  },
}));

jest.mock('../src/services/league-service', () => ({
  getLeagueByTeamId: jest.fn(),
}));


const app = express();
app.use(express.json());
app.use(playerRouter);

describe('PlayerService and Routes', () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  describe('PlayerService', () => {
    it('should fetch a player by id', async () => {
      const mockPlayer = {
        id: 1,
        name: 'Player 1',
        birth_date: new Date('1990-01-01'),
        height: 180.50,
        country_id: 1,
        country_name: 'Country A',
        team_name: 'Team A',
        picture_url: 'player1.png',
        page_id: 9,
        content: 'Player 1 biography',
        league_name: 'League A',
      };
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => callback(null, [mockPlayer]));

      const player = await playerService.getPlayer(1);
      expect(player).toEqual(mockPlayer);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1], expect.any(Function));
    });

    it('should handle error when fetching a player by id', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => callback(new Error('Database error'), null));

      await expect(playerService.getPlayer(1)).rejects.toThrow('Database error');
    });
    
    it('should create a new player', async () => {
      (pool.getConnection as jest.Mock).mockImplementation((callback) => {
        const mockConnection = {
          query: jest.fn((query, params, callback) => {
            callback(null, { insertId: 1 }); 
          }),
          beginTransaction: jest.fn((callback) => callback(null)),
          commit: jest.fn((callback) => callback(null)),
          rollback: jest.fn((callback) => callback(null)),
          release: jest.fn(),
        };
        callback(null, mockConnection);
      });
    
      const playerId = await playerService.addPlayer(
        'New Player',
        '1990-01-01',
        180,
        1,
        1,
        'http://example.com/image.png',
        'Player bio',
        1,
      );
      expect(playerId).toBe(1);
    });
    

    it('should handle error when creating a player', async () => {
      (pool.getConnection as jest.Mock).mockImplementation((callback) => {
        const mockConnection = {
          query: jest.fn((query, params, callback) => {
            callback(new Error('Insert error'), null); 
          }),
          beginTransaction: jest.fn((callback) => callback(null)),
          commit: jest.fn((callback) => callback(null)),
          rollback: jest.fn((callback) => callback(null)),
          release: jest.fn(),
        };
        callback(null, mockConnection);
      });
    
      await expect(
        playerService.addPlayer('New Player', '1990-01-01', 180, 1, 1, '', 'Test content', 1)
      ).rejects.toThrow('Insert error');
    
      expect(pool.getConnection).toHaveBeenCalledTimes(1);
    });

    it('should retrieve a limited number of players', async () => {
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
          league_name: 'League A',
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
          team_name: 'Team B',
          team_id: 2,
          league_name: 'League B',
        },
      ];
  
      (pool.query as jest.Mock).mockImplementation((_query, params, callback) => {
        callback(null, mockPlayers);
      });
  
      const players = await playerService.listSetAmountOfPlayers(2);
  
      expect(players).toEqual(mockPlayers);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT p.*, c.name AS country_name, t.name AS team_name'),
        [2], 
        expect.any(Function),
      );
    });
  
    it('should handle database errors', async () => {
      (pool.query as jest.Mock).mockImplementation((_query, params, callback) => {
        callback(new Error('Database error'), null);
      });
  
      await expect(playerService.listSetAmountOfPlayers(2)).rejects.toThrow('Database error');
  
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT p.*, c.name AS country_name, t.name AS team_name'),
        [2], 
        expect.any(Function),
      );
    });
    
    it('should handle error when fetching teams', async () => {
      (pool.query as jest.Mock).mockImplementation((_query, _params, callback) => {
        callback(new Error('Database error'), null);
      });
    
      await expect(playerService.getTeams()).rejects.toThrow('callback is not a function');
    });

    it('should update a player by id', async () => {
      (pool.query as jest.Mock).mockImplementation((_query, _params, callback) => {
        callback(null); 
      });
    
      await expect(
        playerService.updatePlayer(
          1,
          'Updated Player',
          new Date('1990-01-01'),
          180,
          1,
          1,
          '',
          1,
          'Updated content',
        ),
      ).resolves.not.toThrow();
    
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE Players SET'),
        expect.any(Array), 
        expect.any(Function),
      );
    });

    it('should handle error when updating a player', async () => {
      (pool.query as jest.Mock).mockImplementation((_query, _params, callback) => {
        callback(new Error('Database error'), null);
      });
    
      await expect(
        playerService.updatePlayer(
          1,
          'Updated Player',
          new Date('1990-01-01'),
          180,
          1,
          1,
          '',
          1,
          'Updated content',
        ),
      ).rejects.toThrow('Database error');
    
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE Players SET'),
        expect.any(Array),
        expect.any(Function),
      );
    });

    it('should search for players by query', async () => {
      const mockPlayers = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' },
      ];
    
      (pool.query as jest.Mock).mockImplementation((_query, _params, callback) => {
        callback(null, mockPlayers);
      });
    
      const players = await playerService.searchPlayers('Doe');
      expect(players).toEqual(mockPlayers);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM Players WHERE name LIKE'),
        ['%Doe%'],
        expect.any(Function),
      );
    });    
  });

  describe('Player Routes', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should fetch all players through GET /player', async () => {
      const mockPlayers = [
        {
          id: 1,
          name: 'Player 1',
          birth_date: '1990-01-01',
          height: 180,
          country_id: 1,
          country_name: 'Country A',
          team_name: 'Team A',
          picture_url: '',
          page_id: 1,
          content: 'Test content',
          league_name: 'League A',
        },
      ];
    
      (pool.query as jest.Mock).mockImplementation((_query, _params, callback) => {
        callback(null, mockPlayers); 
      });
    
      const response = await request(app).get('/player');
    
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPlayers);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT p.*, c.name AS country_name'),
        [NaN,],
        expect.any(Function),
      );
    });

    it('should fetch a limited number of players when amount is specified', async () => {
      const mockPlayers = [
        {
          id: 1,
          name: 'Player 1',
          birth_date: '1990-01-01',
          height: 180,
          country_name: 'Country A',
          team_name: 'Team A',
          picture_url: '',
          page_id: 1,
          content: 'Player content',
        },
      ];
      (pool.query as jest.Mock).mockImplementation((_query, params, callback) =>
        callback(null, mockPlayers)
      );

      const response = await request(app).get('/player?amount=1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPlayers);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('LIMIT ?'),
        [1],
        expect.any(Function)
      );
    });
    
    
    it('should handle error in GET /player route', async () => {
      (pool.query as jest.Mock).mockImplementation((_query, _params, callback) => {
        callback(new Error('Database error'), null);
      });
    
      const response = await request(app).get('/player');
      expect(response.status).toBe(500);
    });
  
    it('should fetch all countries through GET /player/countries', async () => {
      const mockCountries = [
        { country_id: 1, country_name: 'Country A', flag_image_url: 'url' },
        { country_id: 2, country_name: 'Country B', flag_image_url: 'url' },
      ];
    
      (pool.query as jest.Mock).mockImplementation((_query, _params, callback) => {
        callback(null, mockCountries); 
      });
    
      const response = await request(app).get('/player/countries');
    
      expect(response.status).toBe(500);
    });

    it('should return 500 if fetching players fails', async () => {
      (pool.query as jest.Mock).mockImplementation((_query, _params, callback) =>
        callback(new Error('Database error'), null)
      );

      const response = await request(app).get('/player');
      expect(response.status).toBe(500);
    });

    describe('GET /player_id/:id', () => {
      it('should fetch a player by ID', async () => {
        const mockPlayer = {
          id: 1,
          name: 'Player 1',
          birth_date: '1990-01-01',
          height: 180,
          country_name: 'Country A',
          team_name: 'Team A',
          picture_url: '',
          page_id: 1,
          content: 'Player content',
        };
        (pool.query as jest.Mock).mockImplementation((_query, params, callback) =>
          callback(null, [mockPlayer])
        );
  
        const response = await request(app).get('/player_id/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockPlayer);
      });
  
      it('should return 400 for invalid ID', async () => {
        const response = await request(app).get('/player_id/abc');
        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid player id');
      });
  
      it('should return 404 if the player is not found', async () => {
        (pool.query as jest.Mock).mockImplementation((_query, params, callback) =>
          callback(null, [])
        );
  
        const response = await request(app).get('/player_id/1');
        expect(response.status).toBe(404);
        expect(response.text).toBe('Player not found');
      });
  
      it('should return 500 if fetching player fails', async () => {
        (pool.query as jest.Mock).mockImplementation((_query, params, callback) =>
          callback(new Error('Database error'), null)
        );
  
        const response = await request(app).get('/player_id/1');
        expect(response.status).toBe(500);
      });
    });
    
    
    it('should handle error in GET /player/countries route', async () => {
      (pool.query as jest.Mock).mockImplementation((_query, _params, callback) => {
        callback(new Error('Database error'), null);
      });
    
      const response = await request(app).get('/player/countries');
      expect(response.status).toBe(500);
    });
    

    it('should fetch a player by id through GET /player_id/:id', async () => {
      const mockPlayer = {
        id: 1,
        name: 'Player 1',
        birth_date: "1990-01-01",
        height: 180,
        country_id: 1,
        country_name: 'Country A',
        team_name: 'Team A',
        picture_url: '',
        page_id: 1,
        content: 'Test content',
        league_name: 'League A',
      };
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => callback(null, [mockPlayer]));

      const response = await request(app).get('/player_id/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPlayer);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1], expect.any(Function));
    });

    it('should handle error in GET /player_id/:id route', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => callback(new Error('Database error'), null));

      const response = await request(app).get('/player_id/1');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({});
    });

    describe('POST /player_id/new', () => {
      it('should create a new player', async () => {
        const mockInsertResult = { insertId: 1 } as ResultSetHeader;
        (pool.getConnection as jest.Mock).mockImplementation((callback) => {
          const mockConnection = {
            query: jest.fn().mockImplementation((_query, _params, callback) => {
              callback(null, mockInsertResult);
            }),
            beginTransaction: jest.fn((callback) => callback(null)),
            commit: jest.fn((callback) => callback(null)),
            rollback: jest.fn((callback) => callback(null)),
            release: jest.fn(),
          };
          callback(null, mockConnection);
        });
  
        const response = await request(app)
          .post('/player_id/new')
          .send({
            name: 'Player 1',
            birth_date: '1990-01-01',
            height: 180,
            country: 1,
            team: 1,
            picture_url: '',
            content: 'Player content',
            user_id: 1,
          });
        expect(response.status).toBe(201);
        expect(response.body).toEqual({ id: 1 });
      });
  
      it('should return 500 if player creation fails', async () => {
        (pool.getConnection as jest.Mock).mockImplementation((callback) =>
          callback(new Error('Database connection error'), null)
        );
  
        const response = await request(app)
          .post('/player_id/new')
          .send({
            name: 'Player 1',
            birth_date: '1990-01-01',
            height: 180,
            country: 1,
            team: 1,
            picture_url: '',
            content: 'Player content',
            user_id: 1,
          });
        expect(response.status).toBe(500);
      });
    });
  
    describe('DELETE /player/:page_id', () => {
      it('should delete a player by page_id', async () => {
        (pool.query as jest.Mock).mockImplementation((_query, _params, callback) =>
          callback(null)
        );
  
        const response = await request(app).delete('/player/1');
        expect(response.status).toBe(200);
      });
  
      it('should return 500 if deletion fails', async () => {
        (pool.query as jest.Mock).mockImplementation((_query, _params, callback) =>
          callback(new Error('Database error'), null)
        );
  
        const response = await request(app).delete('/player/1');
        expect(response.status).toBe(500);
      });
    });
  
    describe('PUT /player/:id', () => {
      it('should update a player', async () => {
        (pool.query as jest.Mock).mockImplementation((_query, _params, callback) =>
          callback(null)
        );
  
        const response = await request(app)
          .put('/player/1')
          .send({
            name: 'Updated Player',
            birth_date: '1990-01-01',
            height: 190,
            country: 1,
            team: 1,
            picture_url: '',
            page_id: 1,
            content: 'Updated content',
          });
        expect(response.status).toBe(200);
      });
  
      it('should return 500 if update fails', async () => {
        (pool.query as jest.Mock).mockImplementation((_query, _params, callback) =>
          callback(new Error('Database error'), null)
        );
  
        const response = await request(app)
          .put('/player/1')
          .send({
            name: 'Updated Player',
            birth_date: '1990-01-01',
            height: 190,
            country: 1,
            team: 1,
            picture_url: '',
            page_id: 1,
            content: 'Updated content',
          });
        expect(response.status).toBe(500);
      });
    });

    it('should create a new player', async () => {
      (pool.getConnection as jest.Mock).mockImplementation((callback) => {
        const mockConnection = {
          query: jest.fn().mockImplementation((query, params, callback) => {
            callback(null, { insertId: 1 }); 
          }),
          beginTransaction: jest.fn().mockImplementation((callback) => callback(null)),
          commit: jest.fn().mockImplementation((callback) => callback(null)),
          rollback: jest.fn().mockImplementation((callback) => callback(null)),
          release: jest.fn(),
        };
        callback(null, mockConnection);
      });
    
      const newPlayer = {
        name: 'Player 1',
        birth_date: '1990-01-01',
        height: 180,
        country: 1,
        team: 1,
        picture_url: 'http://example.com/picture.png',
        content: 'Player bio',
        user_id: 1,
      };
    
      const playerId = await playerService.addPlayer(
        newPlayer.name,
        newPlayer.birth_date,
        newPlayer.height,
        newPlayer.country,
        newPlayer.team,
        newPlayer.picture_url,
        newPlayer.content,
        newPlayer.user_id,
      );
    
      expect(playerId).toBe(1); 
    });
    

    it('should handle error in POST /player_id/new route', async () => {
      (pool.getConnection as jest.Mock).mockImplementation((callback) => {
        callback(new Error('Database connection error'), null); 
      });
    
      const response = await request(app)
        .post('/player_id/new')
        .send({
          name: 'Player 1',
          birth_date: '1990-01-01',
          height: 180,
          country: 1,
          team: 1,
          picture_url: 'http://example.com/picture.png',
          content: 'Player bio',
          user_id: 1,
        });
    
      expect(response.status).toBe(500);
    
      expect(response.body).toEqual({ error: 'Failed to create player' });
    });
    

    it('should delete a player through DELETE /player/:page_id', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => callback(null));

      const response = await request(app).delete('/player/1');
      expect(response.status).toBe(200);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1], expect.any(Function));
    });
  });

  describe('GET /increment-view-count/:page_id', () => {
    it('should increment the view count for a page', async () => {
      (pool.query as jest.Mock).mockImplementation((_query, _params, callback) =>
        callback(null)
      );

      const response = await request(app).get('/increment-view-count/1');
      expect(response.status).toBe(200);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE Pages'),
        [1],
        expect.any(Function)
      );
    });

    it('should return 500 if incrementing view count fails', async () => {
      (pool.query as jest.Mock).mockImplementation((_query, _params, callback) =>
        callback(new Error('Database error'), null)
      );

      const response = await request(app).get('/increment-view-count/1');
      expect(response.status).toBe(500);
    });
  });

  describe('GET /creator/:page_id', () => {
    it('should fetch the creator and page history by page_id', async () => {
      const mockCreatorData = {
        username: 'creator1',
        page_id: 1,
        created_at: '2023-01-01',
        view_count: 10,
      };
      (pool.query as jest.Mock).mockImplementation((_query, _params, callback) =>
        callback(null, [mockCreatorData])
      );

      const response = await request(app).get('/creator/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCreatorData);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [1],
        expect.any(Function)
      );
    });

    it('should return 404 if no creator data is found', async () => {
      (pool.query as jest.Mock).mockImplementation((_query, _params, callback) =>
        callback(null, [])
      );

      const response = await request(app).get('/creator/1');
      expect(response.status).toBe(404);
      expect(response.text).toBe('User or page data not found');
    });

    it('should return 500 if fetching creator data fails', async () => {
      (pool.query as jest.Mock).mockImplementation((_query, _params, callback) =>
        callback(new Error('Database error'), null)
      );

      const response = await request(app).get('/creator/1');
      expect(response.status).toBe(500);
    });
  });

  it('should fetch league by team ID through GET /player/:id/league', async () => {
    const mockLeague = {
      id: 1,
      name: 'Premier League',
      country_id: 44,
      country_name: 'England',
      emblem_image_url: 'http://example.com/emblem.png',
    };

    (leagueService.getLeagueByTeamId as jest.Mock).mockResolvedValue(mockLeague);

    const response = await request(app).get('/player/1/league');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockLeague);

    expect(leagueService.getLeagueByTeamId).toHaveBeenCalledWith(1);
  });

  it('should handle error when fetching league by team ID', async () => {
    (leagueService.getLeagueByTeamId as jest.Mock).mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/player/1/league');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({});

    expect(leagueService.getLeagueByTeamId).toHaveBeenCalledWith(1);
  });

  it('should return 400 for invalid player ID', async () => {
    const response = await request(app).get('/player/invalid/league');

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid player id');
  });
});

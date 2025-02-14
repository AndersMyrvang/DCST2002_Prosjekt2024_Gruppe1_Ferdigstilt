import request from 'supertest';
import express from 'express';
import teamRouter from '../src/routes/team-router';
import teamService from '../src/services/team-service';
import router from '../src/routes/team-router';
import { resolve } from 'tinymce';

jest.mock('../src/services/team-service', () => ({
  listSetAmountOfTeams: jest.fn(),
  listAllTeams: jest.fn(),
  getTeam: jest.fn(),
  getLeagues: jest.fn(),
  updateTeam: jest.fn(),
  addTeam: jest.fn(),
  deleteTeam: jest.fn(),
  listAllPlayersByTeam: jest.fn(),
}));

const mockTeams = [
  {
    id: 1,
    name: 'Team A',
    country_id: 1,
    country_name: 'Country A',
    coach: 'Coach A',
    league: 1,
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
    league: 2,
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
    team_name: 'Team A',
    team_id: 1,
    league_name: 'League B',
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

const app = express();
app.use(express.json());
app.use(router);

describe('Team routes', () => {
  describe('GET /team', () => {
    it('should get set amount of teams', async () => {
      (teamService.listSetAmountOfTeams as jest.Mock).mockResolvedValue(mockTeams);

      const response = await request(app).get('/team?amount=2');
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(mockTeams);
    });

    it('should get all teams if no amount is set', async () => {
      (teamService.listAllTeams as jest.Mock).mockResolvedValue(mockTeams);

      const response = await request(app).get('/team');
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(mockTeams);
    });

    it('should handle internal server errors when getting with amount', async () => {
      (teamService.listSetAmountOfTeams as jest.Mock).mockRejectedValue(new Error());

      const response = await request(app).get('/team?amount=2');
      expect(response.status).toBe(500);
    });

    it('should handle internal server errors when getting without amount', async () => {
      (teamService.listAllTeams as jest.Mock).mockRejectedValue(new Error());

      const response = await request(app).get('/team');
      expect(response.status).toBe(500);
    });
  });
  describe('GET /team/id', () => {
    it('should get team with set ID', async () => {
      (teamService.getTeam as jest.Mock).mockResolvedValue(mockTeams[0]);

      const response = await request(app).get('/team/1');
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(mockTeams[0]);
    });
    it('should return error when id is NaN', async () => {
      (teamService.getTeam as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/team/feil');
      expect(response.status).toBe(400);
    });
    it('should return error when team is not found', async () => {
      (teamService.getTeam as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/team/999');
      expect(response.status).toBe(404);
    });
    it('should handle internal server error', async () => {
      (teamService.getTeam as jest.Mock).mockRejectedValue(new Error());

      const response = await request(app).get('/team/1');
      expect(response.status).toBe(500);
    });
  });

  describe('GET /team/id/leagues', () => {
    it('should get league based on team id', async () => {
      (teamService.getLeagues as jest.Mock).mockResolvedValue(mockLeague);

      const response = await request(app).get('/team/1/leagues');
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(mockLeague);
    });
    it('should handle internal server errors', async () => {
      (teamService.getLeagues as jest.Mock).mockRejectedValue(new Error());

      const response = await request(app).get('/team/1/leagues');
      expect(response.status).toBe(500);
    });
  });

  describe('PUT /team/id', () => {
    it('should update Team', async () => {
      (teamService.updateTeam as jest.Mock).mockResolvedValue(mockTeams[0]);

      const response = await request(app).put('/team/1').send(mockTeams[0]);
      expect(response.status).toBe(200);
    });
    it('should handle internal server errors', async () => {
      (teamService.updateTeam as jest.Mock).mockRejectedValue(new Error());

      const response = await request(app).put('/team/1').send(mockTeams[0]);
      expect(response.status).toBe(500);
    });
  });

  describe('POST /team_id/new', () => {
    it('should create a new team', async () => {
      (teamService.addTeam as jest.Mock).mockResolvedValue(1);

      const response = await request(app).post('/team_id/new').send(mockTeams[0]);
      expect(response.status).toBe(201);
      expect(response.body).toStrictEqual({ id: 1 });
    });

    it('should create a new team', async () => {
      (teamService.addTeam as jest.Mock).mockRejectedValue(500);

      const response = await request(app).post('/team_id/new').send(mockTeams[0]);
      expect(response.status).toBe(500);
    });
  });
  describe('DELETE /team/page_id', () => {
    it('should delete a team', async () => {
      (teamService.deleteTeam as jest.Mock).mockResolvedValue(undefined);

      const response = await request(app).delete('/team/1');
      expect(response.status).toBe(200);
    });

    it('should handle internal error while deleting a team', async () => {
      (teamService.deleteTeam as jest.Mock).mockRejectedValue(new Error());

      const response = await request(app).delete('/team/1');
      expect(response.status).toBe(500);
    });
  });
  describe('GET /team/id/players', () => {
    it('should get players by team-id', async () => {
      (teamService.listAllPlayersByTeam as jest.Mock).mockResolvedValue(mockPlayers);

      const formattedMockPlayers = mockPlayers.map((player) => ({
        ...player,
        birth_date: player.birth_date.toISOString(),
      }));
      const response = await request(app).get('/team/1/players');
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(formattedMockPlayers);
    });
    it('should get players by team-id', async () => {
      (teamService.listAllPlayersByTeam as jest.Mock).mockRejectedValue(new Error());

      const response = await request(app).get('/team/1/players');
      expect(response.status).toBe(500);
    });
  });
});

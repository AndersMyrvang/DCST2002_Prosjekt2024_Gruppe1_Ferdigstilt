import request from 'supertest';
import express, { response } from 'express';
import teamRouter from '../src/routes/user-router';
import teamService from '../src/services/user-service';
import router from '../src/routes/user-router';
import userService from '../src/services/user-service';
import passport from 'passport';

jest.mock('../src/services/user-service', () => ({
  updateLastLogout: jest.fn(),
  updateAdminStatus: jest.fn(),
  getAllUsers: jest.fn(),
  getUserById: jest.fn(),
  findOrCreateUserByGoogleId: jest.fn(),
}));

jest.mock('passport', () => ({
  authenticate: jest.fn(() => (req: any, res: any, next: any) => {
    req.user = {
      id: 'google123',
      username: 'TestUser',
      emails: [{ value: 'test@example.com' }],
      photos: [{ value: 'http://example.com/photo.jpg' }],
    };
    next();
  }),
}));

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  const userHeader = req.get('X-User');
  if (userHeader) {
    req.user = JSON.parse(userHeader);
  }
  next();
});
app.use(router);

const mockUser = {
  user_id: 1,
  google_id: 'google123',
  username: 'testuser',
  email: 'test@example.com',
  profile_image_url: 'http://example.com/photo.jpg',
  first_login: new Date('2023-01-01'),
  last_login: new Date('2023-01-02'),
  last_logout: null,
  is_admin: false,
};
const mockUserS = [
  {
    username: 'testuser',
    email: 'test@example.com',
    photo: 'http://example.com/photo.jpg',
    firstLogin: '2023-01-01T00:00:00.000Z',
    lastLogin: '2023-01-02T00:00:00.000Z',
    is_admin: false,
    user_id: 1,
  },
];
const formattedUser = {
  username: 'testuser',
  email: 'test@example.com',
  photo: 'http://example.com/photo.jpg',
  firstLogin: '2023-01-01T00:00:00.000Z',
  lastLogin: '2023-01-02T00:00:00.000Z',
  is_admin: false,
  user_id: 1,
};

describe('user routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('GET /current_user', () => {
    it('should get user object', async () => {
      (userService.getUserById as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/current_user')
        .set('Authorization', 'Bearer valid_token')
        .set('X-User', JSON.stringify({ user_id: 1 }));
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(formattedUser);
    });
    it('Burde gi 404 hvis brukeren ikke blir funnet', async () => {
      (userService.getUserById as jest.Mock).mockResolvedValue(undefined);

      const response = await request(app)
        .get('/current_user')
        .set('Authorization', 'Bearer valid_token')
        .set('X-User', JSON.stringify({ user_id: 999 }));
      expect(response.status).toBe(404);
      expect(response.body).toStrictEqual({});
    });
    it('Burde gi 401 dersom brukeren ikke er logget inn', async () => {
      (userService.getUserById as jest.Mock).mockResolvedValue(undefined);

      const response = await request(app).get('/current_user');
      expect(response.status).toBe(401);
    });
    it('Burde sende 500 for intern server error', async () => {
      (userService.getUserById as jest.Mock).mockRejectedValue(new Error());

      const response = await request(app)
        .get('/current_user')
        .set('Authorization', 'Bearer valid_token')
        .set('X-User', JSON.stringify({ user_id: 1 }));
      expect(response.status).toBe(500);
    });
  });
  describe('GET /users', () => {
    it('Burde hente alle brukere', async () => {
      (userService.getAllUsers as jest.Mock).mockResolvedValue(mockUserS);

      const response = await request(app).get('/users');
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(mockUserS);
    });
    it('Burde returnere 500 for intern server error', async () => {
      (userService.getAllUsers as jest.Mock).mockRejectedValue(new Error());

      const response = await request(app).get('/users');
      expect(response.status).toBe(500);
    });
  });
  describe('POST /users/userId/set-admin', () => {
    it('BUrde oppdatere admin status til bruker', async () => {
      (userService.updateAdminStatus as jest.Mock).mockResolvedValue(null);

      const response = await request(app).post('/users/1/set-admin').send({ isAdmin: true });
      expect(response.status).toBe(200);
      expect(response.text).toBe('Admin-status oppdatert');
    });
    it('Burde returnere 500 for intern server error', async () => {
      (userService.updateAdminStatus as jest.Mock).mockRejectedValue(new Error());

      const response = await request(app).post('/users/feilBruker/set-admin');
      expect(response.status).toBe(500);
      expect(response.text).toStrictEqual('Serverfeil');
    });
  });
  describe('GET /auth/google/callback', () => {
    it('Callback rute etter påloggingen', async () => {
      (userService.findOrCreateUserByGoogleId as jest.Mock).mockResolvedValue({ user_id: 1 });

      const response = await request(app).get('/auth/google/callback');
      expect(userService.findOrCreateUserByGoogleId).toHaveBeenCalledWith(
        'google123',
        expect.objectContaining({
          google_id: 'google123',
          username: 'TestUser',
          email: 'test@example.com',
          profile_image_url: 'http://example.com/photo.jpg',
        }),
      );
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/');
    });
    it('Callback rute etter påloggingen dersom autentisering feiler', async () => {
      (userService.findOrCreateUserByGoogleId as jest.Mock).mockImplementation(
        (strategy, options) => (req: any, res: any) => {
          res.redirect('/');
        },
      );

      const response = await request(app).get('/auth/google/callback');
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/');
    });
    it('håndtere server error', async () => {
      (userService.findOrCreateUserByGoogleId as jest.Mock).mockRejectedValue(new Error());

      const response = await request(app).get('/auth/google/callback');
      expect(response.status).toBe(500);
    });
  });
  describe('GET /logout', () => {
    it('should return 401 if user is not authenticated in /logout', async () => {
      const response = await request(app).get('/logout');
      expect(response.status).toBe(401);
      expect(response.text).toBe('Ingen bruker funnet ved utlogging.');
    });
  });
});

import { pool } from '../src/mysql-pool';
import userService from '../src/services/user-service';
import express from 'express';
import userRouter from '../src/routes/user-router';

import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { User } from '../../client/src/types'; 

jest.mock('../src/mysql-pool', () => ({
  pool: {
    query: jest.fn(),
  },
}));

const app = express();
app.use(express.json());
app.use(userRouter);

describe('UserService and Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Service Methods', () => {
    describe('findOrCreateUserByGoogleId', () => {
      it('should find an existing user and update last login', async () => {
        const mockUser: User = {
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

        (pool.query as jest.Mock)
          .mockImplementationOnce((query, params, callback) => callback(null, [{ user_id: 1 }]))
          .mockImplementationOnce((query, params, callback) => callback(null));

        const user = await userService.findOrCreateUserByGoogleId('google123', mockUser);
        expect(user.user_id).toBe(1);
        expect(pool.query).toHaveBeenCalledTimes(2);
      });

      it('should create a new user if none exists', async () => {
        const mockUser: User = {
          user_id: 0,
          google_id: 'google456',
          username: 'newuser',
          email: 'new@example.com',
          profile_image_url: null,
          first_login: new Date(),
          last_login: new Date(),
          last_logout: null,
          is_admin: false,
        };

        (pool.query as jest.Mock)
          .mockImplementationOnce((query, params, callback) => callback(null, [])) 
          .mockImplementationOnce((query, params, callback) => callback(null, { insertId: 2 })); 

        const user = await userService.findOrCreateUserByGoogleId('google456', mockUser);
        expect(user.user_id).toBe(2);
        expect(pool.query).toHaveBeenCalledTimes(2);
      });

      it('should handle errors during findOrCreateUserByGoogleId', async () => {
        const mockUser: User = {
          user_id: 0,
          google_id: 'googleError',
          username: 'erroruser',
          email: 'error@example.com',
          profile_image_url: null,
          first_login: new Date(),
          last_login: new Date(),
          last_logout: null,
          is_admin: false,
        };

        (pool.query as jest.Mock).mockImplementation((query, params, callback) =>
          callback(new Error('Database error'), null),
        );

        await expect(
          userService.findOrCreateUserByGoogleId('googleError', mockUser),
        ).rejects.toThrow('Database error');
        expect(pool.query).toHaveBeenCalledTimes(1);
      });
    });

    describe('getUserById', () => {
      it('should fetch user data by user_id', async () => {
        const mockUser = {
          user_id: 1,
          google_id: 'google123',
          username: 'testuser',
          email: 'test@example.com',
          profile_image_url: 'http://example.com/photo.jpg',
          first_login: '2023-01-01T00:00:00.000Z',
          last_login: '2023-01-02T00:00:00.000Z',
          last_logout: null,
          is_admin: 0,
        };

        (pool.query as jest.Mock).mockImplementation((query, params, callback) =>
          callback(null, [mockUser]),
        );

        const user = await userService.getUserById(1);
        expect(user).toEqual({
          ...mockUser,
          is_admin: false,
          first_login: new Date(mockUser.first_login),
          last_login: new Date(mockUser.last_login),
          last_logout: null,
        });
      });

      it('should return null if user does not exist', async () => {
        (pool.query as jest.Mock).mockImplementation((query, params, callback) =>
          callback(null, []),
        );

        const user = await userService.getUserById(999);
        expect(user).toBeNull();
      });

      it('should handle errors when fetching user by ID', async () => {
        (pool.query as jest.Mock).mockImplementation((query, params, callback) =>
          callback(new Error('Database error'), null),
        );

        await expect(userService.getUserById(1)).rejects.toThrow('Database error');
      });
    });

    describe('updateAdminStatus', () => {
      it('should update admin status for a user', async () => {
        (pool.query as jest.Mock).mockImplementation((query, params, callback) => callback(null));

        await expect(userService.updateAdminStatus(1, true)).resolves.not.toThrow();
        expect(pool.query).toHaveBeenCalledWith(
          'UPDATE Users SET is_admin = ? WHERE user_id = ?',
          [1, 1],
          expect.any(Function),
        );
      });

      it('should handle errors when updating admin status', async () => {
        (pool.query as jest.Mock).mockImplementation((query, params, callback) =>
          callback(new Error('Database error'), null),
        );

        await expect(userService.updateAdminStatus(1, true)).rejects.toThrow('Database error');
      });
    });

    describe('getAllUsers', () => {
      it('should fetch all users', async () => {
        const mockUsers = [
          {
            user_id: 1,
            google_id: 'google123',
            username: 'testuser',
            email: 'test@example.com',
            first_login: '2023-01-01T00:00:00.000Z',
            last_login: '2023-01-02T00:00:00.000Z',
            last_logout: null,
            is_admin: 0,
          },
        ];

        (pool.query as jest.Mock).mockImplementation((query, callback) =>
          callback(null, mockUsers),
        );

        const users = await userService.getAllUsers();
        expect(users).toEqual(
          mockUsers.map((user) => ({
            ...user,
            first_login: new Date(user.first_login),
            last_login: new Date(user.last_login),
            is_admin: false,
          })),
        );
      });

      it('should handle errors when fetching all users', async () => {
        (pool.query as jest.Mock).mockImplementation((query, callback) =>
          callback(new Error('Database error'), null),
        );

        await expect(userService.getAllUsers()).rejects.toThrow('Database error');
      });
    });
  });
});

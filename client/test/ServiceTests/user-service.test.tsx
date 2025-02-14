import axios from 'axios';
import userService from '../../src/services/user-service';
import { User } from '../../src/types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('UserService', () => {
  const mockUser: User = {
    user_id: 1,
    google_id: 'google789',
    username: 'test',
    email: 'test@test.no',
    profile_image_url: 'urlbilde.jpg',
    first_login: new Date('2024-11-01T10:00:00Z'),
    last_login: new Date('2024-11-01T10:00:00Z'),
    last_logout: new Date('2024-11-01T10:00:00Z'),
    is_admin: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('getUser', () => {
    test('fetches the current user successfully', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockUser });

      const result = await userService.getUser();

      expect(result).toEqual(mockUser);
      expect(mockedAxios.get).toHaveBeenCalledWith('2/current_user');
    });

    test('handles errors when fetching the current user', async () => {
      const error = new Error('Network Error');
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(userService.getUser()).rejects.toThrow('Network Error');
    });
  });

  describe('getUserId', () => {
    test('retrieves the user ID from localStorage if it exists', () => {
      const userId = '123';
      localStorage.setItem('user_id', userId);

      const result = userService.getUserId();

      expect(result).toBe(userId);
    });

    test('returns null and logs a warning if user_id is not in localStorage', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const result = userService.getUserId();

      expect(result).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalledWith('No user_id found in localStorage');

      consoleWarnSpy.mockRestore();
    });
  });

  describe('getUserById', () => {
    test('fetches a user by ID successfully', async () => {
      const userId = 2;
      mockedAxios.get.mockResolvedValueOnce({ data: mockUser });

      const result = await userService.getUserById(userId);

      expect(result).toEqual(mockUser);
      expect(mockedAxios.get).toHaveBeenCalledWith(`user/${userId}`);
    });

    test('handles errors when fetching a user by ID', async () => {
      const userId = 2;
      const error = new Error('Network Error');
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(userService.getUserById(userId)).rejects.toThrow('Network Error');
    });
  });
});

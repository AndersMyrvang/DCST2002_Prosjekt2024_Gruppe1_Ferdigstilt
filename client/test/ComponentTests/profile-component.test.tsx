import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Profile from '../../src/components/profile-component';

describe('useUser Hook', () => {
  const mockUser = {
    username: 'Test User',
    email: 'test@test.no',
    photo: 'https://example.com/photo.jpg',
    firstLogin: new Date().toLocaleDateString(),
    lastLogin: new Date().toLocaleDateString(),
    is_admin: false,
    user_id: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    (global.fetch as jest.Mock).mockRestore();
  });

  test('returns null while fetching user data', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => null,
    });
    render(<Profile />);
    expect(screen.getByText('Laster...')).toBeInTheDocument();
  });

  test('updates state with user data when fetched', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockUser,
    });

    render(<Profile />);
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('test@test.no')).toBeInTheDocument();
      expect(screen.getByAltText('Profilbilde')).toHaveAttribute(
        'src',
        'https://example.com/photo.jpg',
      );
    });
  });
});

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import Profile from '../../src/components/profile';

describe('Profile Component', () => {
  describe('Using fetchMock', () => {
    beforeEach(() => {
      fetchMock.resetMocks();
    });

    test('fetches and displays user data', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          displayName: 'Test User',
          emails: [{ value: 'testuser@example.com' }],
          photos: [{ value: 'https://example.com/photo.jpg' }],
        }),
      );

      render(<Profile />);

      await waitFor(() => {
        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText('testuser@example.com')).toBeInTheDocument();
        expect(screen.getByAltText('Profilbilde')).toHaveAttribute(
          'src',
          'https://example.com/photo.jpg',
        );
      });
    });
  });
});

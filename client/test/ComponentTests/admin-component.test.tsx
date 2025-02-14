import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminPanel from '../../src/components/admin-component';

global.fetch = jest.fn();

describe('AdminPanel Component', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('fetches and displays user data', async () => {
        const mockUsers = [
            {
                user_id: 1,
                username: 'User1',
                email: 'user1@example.com',
                first_login: '2023-01-01T12:00:00Z',
                last_login: '2023-02-01T12:00:00Z',
                last_logout: '2023-01-15T12:00:00Z',
                is_admin: false,
            },
            {
                user_id: 2,
                username: 'User2',
                email: 'user2@example.com',
                first_login: '2023-01-01T12:00:00Z',
                last_login: '2023-02-01T12:00:00Z',
                last_logout: null,
                is_admin: true,
            },
        ];

        (fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => mockUsers,
        });

        render(<AdminPanel />);

        await waitFor(() => {
            expect(screen.getByText('User1')).toBeInTheDocument();
            expect(screen.getByText('user1@example.com')).toBeInTheDocument();
            expect(screen.getByText('User2')).toBeInTheDocument();
            expect(screen.getByText('user2@example.com')).toBeInTheDocument();
        });
    });

    test('toggles admin status correctly', async () => {
        const mockUsers = [
            {
                user_id: 1,
                username: 'User1',
                email: 'user1@example.com',
                first_login: '2023-01-01T12:00:00Z',
                last_login: '2023-02-01T12:00:00Z',
                last_logout: null,
                is_admin: false,
            },
        ];

        (fetch as jest.Mock)
            .mockResolvedValueOnce({ json: async () => mockUsers }) 
            .mockResolvedValueOnce({ ok: true }); 

        render(<AdminPanel />);

        await waitFor(() => {
            expect(screen.getByText('User1')).toBeInTheDocument();
        });

        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);

        await waitFor(() => {
            expect(checkbox).toBeChecked();
        });
    });

    test('handles toggle admin status failure', async () => {
        const mockUsers = [
          {
            user_id: 1,
            username: 'User1',
            email: 'user1@example.com',
            first_login: '2023-01-01T12:00:00Z',
            last_login: null,
            last_logout: null,
            is_admin: false,
          },
        ];
      
        (fetch as jest.Mock)
          .mockResolvedValueOnce({ json: async () => mockUsers }) 
          .mockRejectedValueOnce(new Error('Failed to toggle admin status')); 
      
        render(<AdminPanel />);
      
        await waitFor(() => {
          expect(screen.getByText('User1')).toBeInTheDocument();
        });
      
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
      
        await waitFor(() => {
          expect(checkbox).not.toBeChecked(); 
        });
      });
      
      
});

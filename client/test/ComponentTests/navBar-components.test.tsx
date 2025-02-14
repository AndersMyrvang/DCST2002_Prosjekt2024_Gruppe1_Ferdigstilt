import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import NavBar from '../../src/components/navBar-components'; 
import { User } from '../../src/types';

const mockUser1: User = {
  user_id: 1,
  google_id: 'mockGoogleId',
  username: 'TestUser',
  email: 'testuser@example.com',
  profile_image_url: 'https://example.com/profile.jpg',
  first_login: new Date(),
  last_login: new Date(),
  last_logout: null,
  is_admin: false,
};
const mockUser2: User = {
  user_id: 1,
  google_id: 'mockGoogleId',
  username: 'TestUser',
  email: 'testuser@example.com',
  profile_image_url: 'https://example.com/profile.jpg',
  first_login: new Date(' 2023-01-01T12:00:00Z'),
  last_login: new Date(' 2023-02-01T12:00:00Z'),
  last_logout: new Date(' 2023-02-01T12:00:01Z'),
  is_admin: false,
};
describe('NavBar Component - Rendering Tests', () => {
  beforeEach(() => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'isLoggedIn') return 'true';
      if (key === 'user') return 'TestUser';
      return null;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders the navigation menu', () => {
    render(<NavBar user={mockUser1} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Players')).toBeInTheDocument();
    expect(screen.getByText('Teams')).toBeInTheDocument();
    expect(screen.getByText('Leagues')).toBeInTheDocument();
    expect(screen.getByText('Tags')).toBeInTheDocument();
  });

  test('renders login links when user is not logged in', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => null);
    render(<NavBar user={null} />);
    expect(screen.getByText(/register/i)).toBeInTheDocument();
    expect(screen.getByText(/log in with google/i)).toBeInTheDocument();
  });

  test('renders logout link when user is logged in', () => {
    render(<NavBar user={mockUser1} />);
    expect(screen.getByText(/log out/i)).toBeInTheDocument();
  });
});

describe('NavBar Component - Integration Tests', () => {
  beforeEach(() => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'isLoggedIn') return 'true';
      if (key === 'user') return 'TestUser';
      return null;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('toggles dark mode on button click', () => {
    jest.spyOn(Storage.prototype, 'setItem');
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'darkMode') return 'false';
      return null;
    });

    render(<NavBar user={mockUser1} />);

    const darkModeButton = screen.getByRole('button', { name: /toggle dark mode/i });

    fireEvent.click(darkModeButton);

    expect(document.body.classList.contains('dark-mode')).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith('darkMode', 'true');

    fireEvent.click(darkModeButton);

    expect(document.body.classList.contains('dark-mode')).toBe(false);
    expect(localStorage.setItem).toHaveBeenCalledWith('darkMode', 'false');
  });

  test('persists dark mode state across re-renders', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'darkMode') return 'true';
      return null;
    });

    render(<NavBar user={mockUser1} />);

    expect(document.body.classList.contains('dark-mode')).toBe(true);
  });

  test('initializes login state based on localStorage', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'isLoggedIn') return 'true';
      if (key === 'user') return 'TestUser';
      return null;
    });

    render(<NavBar user={mockUser1} />);

    expect(screen.getByText(/log out/i)).toBeInTheDocument();
  });

  test('removes event listeners on unmount', () => {
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

    const { unmount } = render(<NavBar user={mockUser1} />);
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});

describe('NavBar Component - User Interaction Tests', () => {
  beforeEach(() => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'isLoggedIn') return 'true';
      if (key === 'user') return 'TestUser';
      return null;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('clicking the logout button logs out the user', async () => {
    jest.spyOn(Storage.prototype, 'removeItem');
    render(<NavBar user={mockUser1} />);

    const logoutButton = screen.getByText(/log out/i);

    await act(async () => {
      fireEvent.click(logoutButton);
    });

    expect(localStorage.removeItem).toHaveBeenCalledWith('isLoggedIn');
    expect(localStorage.removeItem).toHaveBeenCalledWith('user');
  });
});

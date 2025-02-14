import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import SearchBar from '../../src/components/searchBar';

global.fetch = jest.fn();

const mockFetch = fetch as jest.Mock;

describe('SearchBar Component', () => {
  const onSearchMock = jest.fn();

  const setup = () => {
    const history = createMemoryHistory();
    return {
      history,
      ...render(
        <Router history={history}>
          <SearchBar onSearch={onSearchMock} />
        </Router>,
      ),
    };
  };

  beforeEach(() => {
    mockFetch.mockClear();
    onSearchMock.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the search bar input and search icon', () => {
    const { asFragment } = setup();

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(screen.getByText('🔍')).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  test('does not fetch suggestions for queries shorter than 3 characters', async () => {
    setup();

    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'te' } });

    await waitFor(() => expect(mockFetch).not.toHaveBeenCalled());

    expect(screen.queryByText('Player:')).not.toBeInTheDocument();
  });

  test('fetches and displays suggestions when typing in the search bar', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({
        suggestions: [
          { type: 'Player', id: 1, name: 'Player One' },
          { type: 'Team', id: 2, name: 'Team Two' },
        ],
      }),
    });

    const { asFragment } = setup();

    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'pla' } });

    await waitFor(() => expect(mockFetch).toHaveBeenCalledWith('/api/search/suggestions?q=pla'));

    expect(await screen.findByText('Player: Player One')).toBeInTheDocument();
    expect(await screen.findByText('Team: Team Two')).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  test('navigates to the correct path when a suggestion is clicked', async () => {
    const { history } = setup();

    mockFetch.mockResolvedValueOnce({
      json: async () => ({
        suggestions: [
          { type: 'Player', id: 1, name: 'Player One' },
          { type: 'Team', id: 2, name: 'Team Two' },
        ],
      }),
    });

    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'pla' } });

    await waitFor(() => screen.findByText('Player: Player One'));

    const suggestion = screen.getByText('Player: Player One');
    fireEvent.click(suggestion);

    expect(history.location.pathname).toBe('/player/1');
  });

  test('clears suggestions when search is triggered', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({
        suggestions: [{ type: 'Player', id: 1, name: 'Player One' }],
      }),
    });

    const { asFragment } = setup();

    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'pla' } });

    await waitFor(() => screen.findByText('Player: Player One'));

    const searchIcon = screen.getByText('🔍');
    fireEvent.click(searchIcon);

    await waitFor(() => expect(screen.queryByText('Player: Player One')).not.toBeInTheDocument());

    expect(asFragment()).toMatchSnapshot();
  });

  test('handles API errors gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('API error'));

    setup();

    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'pla' } });

    await waitFor(() => expect(mockFetch).toHaveBeenCalledWith('/api/search/suggestions?q=pla'));

    expect(screen.queryByText('Player: Player One')).not.toBeInTheDocument();
    expect(screen.queryByText('Team: Team Two')).not.toBeInTheDocument();
  });
});

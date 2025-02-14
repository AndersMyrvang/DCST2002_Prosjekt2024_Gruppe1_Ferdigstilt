import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import SearchBar from '../../src/components/searchBar-component';

describe('SearchBar Component', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    (global.fetch as jest.Mock).mockRestore();
  });

  test('renders input and search icon', () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    expect(screen.getByPlaceholderText('Søk...')).toBeInTheDocument();
    expect(screen.getByText('🔍')).toBeInTheDocument();
  });

  test('calls onSearch when search icon is clicked', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Søk...');
    const searchIcon = screen.getByText('🔍');

    fireEvent.change(input, { target: { value: 'Test Query' } });
    fireEvent.click(searchIcon);

    expect(mockOnSearch).toHaveBeenCalledWith('Test Query');
  });

  test('calls onSearch when Enter key is pressed', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Søk...');

    fireEvent.change(input, { target: { value: 'Test Query' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(mockOnSearch).toHaveBeenCalledWith('Test Query');
  });

  test('fetches suggestions when input changes', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        suggestions: [
          { type: 'Player', id: 1, name: 'Player A' },
          { type: 'Team', id: 2, name: 'Team B' },
        ],
      }),
    });

    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Søk...');

    fireEvent.change(input, { target: { value: 'Pla' } });

    await waitFor(() => {
      expect(screen.getByText('Player: Player A')).toBeInTheDocument();
      expect(screen.getByText('Team: Team B')).toBeInTheDocument();
    });
  });

  test('does not fetch suggestions for inputs shorter than 3 characters', async () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Søk...');

    fireEvent.change(input, { target: { value: 'Pl' } });

    await waitFor(() => {
      expect(screen.queryByText('Player: Player A')).not.toBeInTheDocument();
    });

    expect(fetch).not.toHaveBeenCalled();
  });

  test('navigates to the correct URL when a suggestion is clicked', async () => {
    const history = createMemoryHistory();
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        suggestions: [{ type: 'Player', id: 1, name: 'Player A' }],
      }),
    });

    render(
      <Router history={history}>
        <SearchBar onSearch={mockOnSearch} />
      </Router>,
    );

    const input = screen.getByPlaceholderText('Søk...');
    fireEvent.change(input, { target: { value: 'Pla' } });

    await waitFor(() => {
      expect(screen.getByText('Player: Player A')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Player: Player A'));

    expect(history.location.pathname).toBe('/player/1');
  });

  test('handles fetch errors gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Søk...');
    fireEvent.change(input, { target: { value: 'Pla' } });

    await waitFor(() => {
      expect(screen.queryByText('Player: Player A')).not.toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith('/api/search/suggestions?q=Pla');
  });

  test('clears suggestions when input is empty', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        suggestions: [{ type: 'Player', id: 1, name: 'Player A' }],
      }),
    });

    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Søk...');
    fireEvent.change(input, { target: { value: 'Pla' } });

    await waitFor(() => {
      expect(screen.getByText('Player: Player A')).toBeInTheDocument();
    });

    fireEvent.change(input, { target: { value: '' } });

    await waitFor(() => {
      expect(screen.queryByText('Player: Player A')).not.toBeInTheDocument();
    });
  });

  test('logs an error for unknown suggestion type', async () => {
    console.error = jest.fn();

    const mockFetch = jest.fn().mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          suggestions: [{ type: 'UnknownType', id: 1, name: 'Unknown' }],
        }),
    });
    global.fetch = mockFetch;

    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Søk...');
    fireEvent.change(input, { target: { value: 'Unknown' } });

    await screen.findByText('UnknownType: Unknown');

    fireEvent.click(screen.getByText('UnknownType: Unknown'));

    expect(console.error).toHaveBeenCalledWith('Ukjent type: UnknownType');
  });
});

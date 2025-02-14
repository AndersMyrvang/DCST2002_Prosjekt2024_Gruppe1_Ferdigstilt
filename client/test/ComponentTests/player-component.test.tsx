import React from 'react';
import { render, screen, fireEvent, waitFor, act, logRoles } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { PlayerListAll, PlayerList, PlayerDetails, PlayerEdit, PlayerNew } from '../../src/components/player-components';
import playerService from '../../src/services/player-service';
import userService from '../../src/services/user-service';
import tagService from '../../src/services/tag-service';
import { Alert } from '../../src/widgets';
import CommentSection from '../../src/components/comment-components';
import commentService from '../../src/services/comment-service';

jest.mock('../../src/services/player-service', () => ({
  listAllPlayers: jest.fn(),
  listSetAmountOfPlayers: jest.fn(),
  getPlayer: jest.fn(),
  updatePlayer: jest.fn(),
  deletePlayer: jest.fn(),
  addPlayer: jest.fn(),
  getCountries: jest.fn(),
  getTeams: jest.fn(),
  incrementViewCount: jest.fn().mockResolvedValue(undefined),
  getCreator: jest.fn().mockResolvedValue({ username: "Creator", page_id: 1, created_at: '2021-05-01', view_count: 1 }),
  getPageHistory: jest.fn().mockResolvedValue({ username: "Creator", page_id: 1, created_at: '2021-05-01', view_count: 1 }),
  getLeague: jest.fn(),
  getRevisedName: jest.fn().mockResolvedValue({ name: 'Player 1' }),
}));

jest.mock('../../src/services/user-service', () => ({
  getUserById: jest.fn(),
}));

jest.mock('../../src/services/tag-service', () => ({
  getTagsForPage: jest.fn(),
  addTagToPage: jest.fn(),
  removeTagFromPage: jest.fn(),
  getTags: jest.fn().mockResolvedValue([]),
}));

jest.mock('../../src/services/comment-service', () => ({
  listComments: jest.fn().mockResolvedValue([]),
  addComment: jest.fn().mockResolvedValue(1),
}));

jest.mock('../../src/services/league-service');
jest.mock('../../src/services/team-service');
jest.mock('../../src/services/revision-service', () => ({
  getRevisions: jest.fn().mockResolvedValue([]),
}));

jest.mock('../../src/widgets', () => ({
  ...jest.requireActual('../../src/widgets'),
  Alert: {
    danger: jest.fn((message) => {
      console.error(message); 
    }),
  },
}));


beforeEach(() => {
  jest.clearAllMocks();
  (playerService.listAllPlayers as jest.Mock).mockResolvedValue([
    {
      id: 1,
      name: 'Player 1',
      birth_date: '2000-01-01',
      height: 180,
      country_name: 'Country 1',
      team_name: 'Team 1',
    },
    {
      id: 2,
      name: 'Player 1', 
      birth_date: '1995-05-05',
      height: 175,
      country_name: 'Country 2',
      team_name: 'Team 2',
    },
  ]);
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
    if (key === 'isLoggedIn') return 'true';
    if (key === 'user') return JSON.stringify({ user_id: 1, username: 'TestUser' });
    return null;
  });
});

const renderWithRouter = (component: JSX.Element) => render(<Router>{component}</Router>);

describe('PlayerListAll Component', () => {
  test('renders all players', async () => {
    renderWithRouter(<PlayerListAll />);

    const heading = await screen.findByText('All Players');
    expect(heading).toBeInTheDocument();

    const players = await screen.findAllByText(/Player 1/);
    expect(players).toHaveLength(2);
  });


  test('does not show "New Player" button if user is not logged in', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => null);
    renderWithRouter(<PlayerListAll />);
    const button = screen.queryByText('New player');
    expect(button).toBeNull();
  });




});

describe('PlayerDetails Component', () => {
  const mockPlayer = {
    id: 1,
    name: 'Player 1',
    birth_date: '2000-01-01',
    height: 180,
    country_name: 'Country 1',
    team_name: 'Team 1',
    page_id: 1,
    content: 'Player bio content',
  };
  const mockTags = [{ tag_id: 1, tag_name: 'Tag 1' }];

  const renderWithRouter = (component: JSX.Element) => render(<Router>{component}</Router>);

  beforeEach(() => {
    jest.clearAllMocks();
    (playerService.getPlayer as jest.Mock).mockResolvedValue(mockPlayer);
    (tagService.getTagsForPage as jest.Mock).mockResolvedValue(mockTags);
  });


  test('renders player details', async () => {
    renderWithRouter(<PlayerDetails match={{ params: { id: 1 } }} />);

    const playerHeadings = await screen.findAllByText(/Player 1/);
    expect(playerHeadings).toHaveLength(3);

    const mainHeading = await screen.findByRole('heading', { level: 2 });
    expect(mainHeading).toHaveTextContent('Player 1');

    const cardTitle = await screen.findByText((content, element) => {
      return element?.tagName === 'H5' && content === 'Player 1';
    });
    expect(cardTitle).toBeInTheDocument();

    const tagsHeading = await screen.findByText(/Tags for Player 1/);
    expect(tagsHeading).toBeInTheDocument();
  });

  test('renders associated tags correctly', async () => {
    mockPlayer.page_id = 1;

    const mockTags = [
      { tag_id: 1, tag_name: 'Tag A' },
      { tag_id: 2, tag_name: 'Tag B' },
    ];

    (playerService.getPlayer as jest.Mock).mockResolvedValue(mockPlayer);
    (tagService.getTagsForPage as jest.Mock).mockResolvedValue(mockTags);

    await act(async () => {
      render(
        <PlayerDetails match={{ params: { id: 1 } }} />
      );
    });

    const tagElements = await screen.findAllByRole('listitem');
    expect(tagElements).toHaveLength(2);
    expect(tagElements[0]).toHaveTextContent('Tag A');
    expect(tagElements[1]).toHaveTextContent('Tag B');
  });
});


test('displays fallback message when no tags are available', async () => {
  (playerService.getPlayer as jest.Mock).mockResolvedValue({
    id: 1,
    name: 'Player 1',
    page_id: 1,
    birth_date: '2000-01-01',
    height: 180,
    country_name: 'Country 1',
    team_name: 'Team 1',
    content: 'Player bio content',
  });

  (tagService.getTagsForPage as jest.Mock).mockResolvedValue([]); 

  renderWithRouter(<PlayerDetails match={{ params: { id: 1 } }} />);

  
  const fallbackMessage = await screen.findByText('No tags available for this player.');
  expect(fallbackMessage).toBeInTheDocument();
});

describe('PlayerEdit Component', () => {
  const mockPlayer = {
    id: 1,
    name: 'Player 1',
    birth_date: '2000-01-01',
    height: 180,
    country_id: 1,
    team_id: 1,
    picture_url: '',
    page_id: 1,
    content: 'Player content',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (playerService.getPlayer as jest.Mock).mockResolvedValue(mockPlayer);
    (playerService.getCountries as jest.Mock).mockResolvedValue([
      { country_id: 1, country_name: 'Country 1' },
    ]);
    (playerService.getTeams as jest.Mock).mockResolvedValue([{ id: 1, name: 'Team 1' }]);
    (tagService.getTagsForPage as jest.Mock).mockResolvedValue([{ tag_id: 1, tag_name: 'Tag 1' }]);
  });

  const renderWithRouter = (component: JSX.Element) => render(<Router>{component}</Router>);

  test('prefills form fields with current player data', async () => {
    renderWithRouter(<PlayerEdit match={{ params: { id: 1 } }} />);
    const nameInput = await screen.findByDisplayValue('Player 1');
    expect(nameInput).toBeInTheDocument();
  });

  test('navigates to the player with id', async () => {
    renderWithRouter(<PlayerEdit match={{ params: { id: 1 } }} />);

  
    const button = await screen.findByTestId('playerBackID');
    fireEvent.click(button);

    expect(window.location.href).toContain('/player/1');
  });

  test('adds a tag to a player', async () => {
    const mockPlayerTags = [{ tag_id: 2, tag_name: 'Tag B' }];
    const Harry = [{
      id: 1,
      name: 'Harry Kane',
      birth_date: new Date('1993-07-28'),
      height: 188,
      country_id: 1,
      country_name: 'England',
      team_name: 'Tottenham Hotspur',
      team_id: 101,
      picture_url: 'https://example.com/player1.png',
      page_id: 201,
      content: 'A prolific striker from England.',
      league_id: 1,
      league_name: 'Premier League',
    }];
    const mockTeam = {
      id: 1,
      name: 'Team A',
      country_id: 1,
      country_name: 'Country A',
      coach: 'Coach A',
      league_id: 1,
      league_name: 'League A',
      emblem_image_url: '',
      content: '',
      page_id: 1,
    };

    const mockTags = [
      { tag_id: 1, tag_name: 'Tag A' },
      { tag_id: 2, tag_name: 'Tag B' },
    ];

    (playerService.getPlayer as jest.Mock).mockResolvedValue(mockPlayer);
    (tagService.getTags as jest.Mock).mockResolvedValue(mockTags);
    (tagService.addTagToPage as jest.Mock).mockResolvedValue(undefined);
    (tagService.getTagsForPage as jest.Mock).mockResolvedValue(mockTags);

    await act(async () => {
      render(
        <PlayerEdit match={{ params: { id: 1 } }} />
      );
    });

    fireEvent.change(screen.getByDisplayValue('Select tag to add'), { target: { value: '1' } });
    fireEvent.click(screen.getByText(/Add Tag/i));

    await waitFor(() => {
      expect(tagService.addTagToPage).toHaveBeenCalledWith(mockPlayer.page_id, 1);
    });

    expect(screen.getAllByText('Tag A').length).toBe(2);
  });

  test('removes a tag from a team', async () => {
    const mockTags = [
      { tag_id: 1, tag_name: 'Tag A' },
      { tag_id: 2, tag_name: 'Tag B' },
    ];

    const mockPlayer = {
      id: 1,
      name: 'Player 1',
      birth_date: new Date('1993-07-28'),
      height: 188,
      country_id: 1,
      country_name: 'England',
      team_name: 'Tottenham Hotspur',
      team_id: 101,
      picture_url: 'https://example.com/player1.png',
      page_id: 201,
      content: 'A prolific striker from England.',
      league_id: 1,
      league_name: 'Premier League',
    };

    (playerService.getPlayer as jest.Mock).mockResolvedValueOnce(mockPlayer);
    (tagService.getTagsForPage as jest.Mock).mockResolvedValueOnce(mockTags);
    (tagService.removeTagFromPage as jest.Mock).mockResolvedValueOnce(undefined);

    await act(async () => {
      render(
        <PlayerEdit match={{ params: { id: 1 } }} />
      );
    });

    expect(screen.getAllByText('Tag A')).toHaveLength(2);
    expect(screen.getAllByText('Tag B')).toHaveLength(2);

    const removeButton = screen.getByLabelText('Remove Tag A');
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(tagService.removeTagFromPage).toHaveBeenCalledWith(201, 1);
    });
  });

  describe('PlayerNew Component', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      (playerService.getCountries as jest.Mock).mockResolvedValue([
        { country_id: 1, country_name: 'Country 1' },
      ]);
      (playerService.getTeams as jest.Mock).mockResolvedValue([{ id: 1, name: 'Team 1' }]);
    });

    const renderWithRouter = (component: JSX.Element) => render(<Router>{component}</Router>);

    test('renders new player form', () => {
      renderWithRouter(<PlayerNew />);
      expect(screen.getByText('New Player')).toBeInTheDocument();
    });

    test('submits new player form successfully', async () => {
      (playerService.addPlayer as jest.Mock).mockResolvedValue(123);

      renderWithRouter(<PlayerNew />);

      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'New Player' } });
      fireEvent.change(screen.getByLabelText(/height/i), { target: { value: '190' } });
      fireEvent.change(screen.getByLabelText(/birth date/i), { target: { value: '2000-01-01' } });
      fireEvent.click(screen.getByText(/save/i));

      await waitFor(() => expect(playerService.addPlayer).toHaveBeenCalled());
      expect(playerService.addPlayer).toHaveBeenCalledWith(
        'New Player',
        '2000-01-01',
        190,
        expect.anything(),
        expect.anything(), 
        expect.anything(), 
        expect.anything() 
      );
    });

    test('navigates to all players on button click', async () => {
      renderWithRouter(<PlayerNew />);

      const button = await screen.findByTestId('playerAllBack');
      fireEvent.click(button);

      expect(window.location.href).toContain('/players');
    });

  });

  describe('PlayerList Component', () => {
    beforeEach(() => {
      (playerService.listSetAmountOfPlayers as jest.Mock).mockResolvedValue([
        { id: 1, name: 'Player 1', height: 180, country_name: 'Country 1', team_name: 'Team 1' },
        { id: 2, name: 'Player 2', height: 175, country_name: 'Country 2', team_name: 'Team 2' },
      ]);
      document.body.innerHTML = '<div id="alerts"></div>';

    });

    const renderWithRouter = (component: JSX.Element) => render(<Router>{component}</Router>);

    test('renders a list of players', async () => {
      renderWithRouter(<PlayerList />);
      const players = await screen.findAllByText(/Player/i);
      expect(players).toHaveLength(2);
    });

    test('renders limited number of players', async () => {
      (playerService.listSetAmountOfPlayers as jest.Mock).mockResolvedValue([
        { id: 1, name: 'Player 1', height: 180, country_name: 'Country 1', team_name: 'Team 1' },
      ]);

      renderWithRouter(<PlayerList />);

      const playerLinks = await screen.findAllByRole('link', { name: /Player/i });
      expect(playerLinks).toHaveLength(1);
    });

    test('navigates to all players on button click', async () => {
      renderWithRouter(<PlayerList />);

      const button = await screen.findByTestId('playerAllButton');
      fireEvent.click(button);

      expect(window.location.href).toContain('/players');
    });

    test('displays an error message when fetching teams fails', async () => {
      (playerService.listAllPlayers as jest.Mock).mockRejectedValue(new Error('Network Error'));

      render(
        <PlayerListAll />
      );

      expect(playerService.listAllPlayers).toHaveBeenCalled();
    });


  });

  describe('Comments Component', () => {
    test('renders comments', async () => {
      const mockPlayer = {
        id: 1,
        name: 'Player 1',
        birth_date: new Date('1993-07-28'),
        height: 188,
        country_id: 1,
        country_name: 'England',
        team_name: 'Tottenham Hotspur',
        team_id: 101,
        picture_url: 'https://example.com/player1.png',
        page_id: 201,
        content: 'A prolific striker from England.',
        league_id: 1,
        league_name: 'Premier League',
      };

      const mockComments = [
        { comment_id: 1, user_id: 1, content: 'Great team!', username: 'User A' },
        { comment_id: 2, user_id: 2, content: 'Amazing players!', username: 'User B' },
      ];

      (playerService.getPlayer as jest.Mock).mockResolvedValue(mockPlayer);
      (commentService.listComments as jest.Mock).mockResolvedValue(mockComments);

      await act(() => {
        render(
          <PlayerDetails match={{ params: { id: 1 } }} />
        );
      });

      await waitFor(() => {
        expect(screen.getByText('Great team!')).toBeInTheDocument();
        expect(screen.getByText('Amazing players!')).toBeInTheDocument();
      });
    });

    test('increments view count on mount', async () => {
      const mockPlayer = {
        id: 1,
        name: 'Player 1',
        birth_date: new Date('1993-07-28'),
        height: 188,
        country_id: 1,
        country_name: 'England',
        team_name: 'Tottenham Hotspur',
        team_id: 101,
        picture_url: 'https://example.com/player1.png',
        page_id: 201,
        content: 'A prolific striker from England.',
        league_id: 1,
        league_name: 'Premier League',
      };

      (playerService.getPlayer as jest.Mock).mockResolvedValue(mockPlayer);
      (playerService.getPageHistory as jest.Mock).mockResolvedValue([]);
      (playerService.getLeague as jest.Mock).mockResolvedValue({ league_id: 1, league_name: 'Premier League' });
      (playerService.getCreator as jest.Mock).mockResolvedValue({ user_id: 1, username: 'Creator' });
      (tagService.getTags as jest.Mock).mockResolvedValue([]);
      (playerService.getRevisedName as jest.Mock).mockResolvedValue({ name: 'Player 1' });

      (tagService.getTags as jest.Mock).mockResolvedValue([
        { tag_id: 1, tag_name: 'Tag A' },
        { tag_id: 2, tag_name: 'Tag B' },
        { tag_id: 3, tag_name: 'Tag C' },
      ]);

      (tagService.getTagsForPage as jest.Mock).mockResolvedValue([
        { tag_id: 1, tag_name: 'Tag A' },
        { tag_id: 2, tag_name: 'Tag B' },
        { tag_id: 3, tag_name: 'Tag C' },
      ]);

      (tagService.getTagsForPage as jest.Mock).mockResolvedValue([
        { tag_id: 2, tag_name: 'Tag B' },
      ]);

      await act(async () => {
        render(
          <PlayerDetails match={{ params: { id: 1 } }} />
        );
      });

      await waitFor(() => {
        expect(playerService.incrementViewCount).toHaveBeenCalledWith(mockPlayer.page_id);
      });
    });

    test('Displays page history', async () => {
      const mockPlayer = {
        id: 1,
        name: 'Player 1',
        birth_date: new Date('1993-07-28'),
        height: 188,
        country_id: 1,
        country_name: 'England',
        team_name: 'Tottenham Hotspur',
        team_id: 101,
        picture_url: 'https://example.com/player1.png',
        page_id: 201,
        content: 'A prolific striker from England.',
        league_id: 1,
        league_name: 'Premier League',
      };

      const mockRevision = [
        { revision_id: 1, user_id: 1, username: 'User A', revised_at: '2021-05-01', revised_name: 'Player 1' },
      ];


      (playerService.getPlayer as jest.Mock).mockResolvedValue(mockPlayer);
      (playerService.getPageHistory as jest.Mock).mockResolvedValue(({ username: "Creator", page_id: 1, created_at: '2021-05-01', view_count: 1 }));

      await act(async () => {
        render(
          <PlayerDetails match={{ params: { id: 1 } }} />
        );
      });

      await waitFor(() => {
        expect(screen.getByText('User A')).toBeInTheDocument();
        expect(screen.getAllByText('Player 1').length).toBeGreaterThan(1);
      });
    });

    test('handles invalid page history gracefully', async () => {
      jest.clearAllMocks();
      (playerService.getPageHistory as jest.Mock).mockResolvedValue({ username: null, created_at: null, created_by: null, view_count: 1 });
      (playerService.getCreator as jest.Mock).mockResolvedValue({ username: null, created_at: null });
      renderWithRouter(<PlayerDetails match={{ params: { id: 1 } }} />);
      await waitFor(() => {
        expect(screen.getByText(/Unknown/i)).toBeInTheDocument();
        expect(screen.getByText(/1.1.1970/i)).toBeInTheDocument();
      });
    });

    /* test('adds a new comment', async () => {
      jest.clearAllMocks();
      (playerService.getPageHistory as jest.Mock).mockResolvedValue({ username: null, created_at: null });
    
  
      renderWithRouter(<PlayerDetails match={{ params: { id: 1 } }} />);
  
      await waitFor( () => {
        fireEvent.change(screen.getByLabelText(/Comment input/i), { target: { value: 'Nice player!' } });
        fireEvent.click(screen.getByText(/Send/i));
        expect(screen.getByText(/Nice player!/i)).toBeInTheDocument();
      }) 
    });
   */
    test('displays error if fetching players fails', async () => {
      (playerService.listAllPlayers as jest.Mock).mockRejectedValue(new Error('Network error'));
      renderWithRouter(<PlayerListAll />);
      await waitFor(() => expect(screen.getByText('Error fetching players')));
    });
  });

  describe('PlayerComponent snapshots', () => {

    test('matches PlayerDetails snapshot', () => {
      const { asFragment } = renderWithRouter(<PlayerDetails match={{ params: { id: 1 } }} />);
      expect(asFragment()).toMatchSnapshot();
    });

  });
});

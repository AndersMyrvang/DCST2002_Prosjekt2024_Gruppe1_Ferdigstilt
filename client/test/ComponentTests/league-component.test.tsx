import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  LeagueListAll,
  LeagueDetails,
  LeagueEdit,
  LeagueList,
  LeagueNew,
} from '../../src/components/league-components';
import leagueService from '../../src/services/league-service';
import userService from '../../src/services/user-service';
import playerService from '../../src/services/player-service';
import tagService from '../../src/services/tag-service';
import revisionService from '../../src/services/revision-service';

jest.mock('../../src/services/revision-service', () => ({
  getRevisions: jest.fn(),
  addRevision: jest.fn(),
}));

jest.mock('../../src/services/league-service', () => ({
  listAllLeagues: jest.fn(),
  listSetAmountOfLeagues: jest.fn(),
  getLeague: jest.fn(),
  getTeamsInLeague: jest.fn(),
  updateLeague: jest.fn(),
  addLeague: jest.fn(),
}));
jest.mock('../../src/services/user-service');
jest.mock('../../src/widgets', () => ({
  ...jest.requireActual('../../src/widgets'),
  Alert: {
    danger: jest.fn((message) => {
      console.error(message);
    }),
  },
}));
jest.mock('../../src/services/player-service', () => ({
  getCountries: jest.fn(),
  getCreator: jest.fn(),
  getPageHistory: jest.fn(),
  getRevisedName: jest.fn(),
  incrementViewCount: jest.fn(),
}));
jest.mock('../../src/services/tag-service', () => ({
  getTagsForPage: jest.fn(),
  getTags: jest.fn(),
}));

describe('LeagueListAll Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (leagueService.listAllLeagues as jest.Mock).mockResolvedValue([
      { id: 1, name: 'League 1', country_name: 'Country 1', emblem_image_url: 'url1' },
    ]);

    (userService.getUserById as jest.Mock).mockResolvedValue({
      user_id: 1,
      username: 'TestUser',
    });

    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'isLoggedIn') return 'true';
      if (key === 'user') return JSON.stringify({ user_id: 1, username: 'TestUser' });
      return null;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderWithRouter = (component: JSX.Element) => {
    return render(<Router>{component}</Router>);
  };

  test('renders all leagues', async () => {
    renderWithRouter(<LeagueListAll />);

    const heading = await screen.findByText('All Leagues');
    expect(heading).toBeInTheDocument();

    const league = await screen.findByText((content) => content.includes('League: League 1'));
    expect(league).toBeInTheDocument();
  });

  test('does not show "New League" button if user is not logged in', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => null);

    renderWithRouter(<LeagueListAll />);
    const button = screen.queryByText('New league');
    expect(button).toBeNull();
  });

  test('displays loading state initially', () => {
    renderWithRouter(<LeagueListAll />);
    const loadingIndicator = screen.getByText(/loading/i);
    expect(loadingIndicator).toBeInTheDocument();
  });

  test('renders a message when no leagues are found', async () => {
    (leagueService.listAllLeagues as jest.Mock).mockResolvedValue([]);
    renderWithRouter(<LeagueListAll />);
    const message = await screen.findByText(/no leagues found/i);
    expect(message).toBeInTheDocument();
  });

  test('navigates to league details on click', async () => {
    renderWithRouter(<LeagueListAll />);
    const leagueLink = await screen.findByText('League 1');
    fireEvent.click(leagueLink);
    expect(window.location.href).toContain('/league/1');
  });
});

describe('LeagueList Component', () => {
  beforeEach(() => {
    (leagueService.listSetAmountOfLeagues as jest.Mock).mockResolvedValue([
      { id: 1, name: 'League 1', country_name: 'Country 1', emblem_image_url: 'url1' },
    ]);
    document.body.innerHTML = '<div id="alerts"></div>';
  });

  test('navigates to all leagues on button click', () => {
    render(<LeagueList />);
    const button = screen.getByText('Get all league');
    fireEvent.click(button);
    expect(window.location.href).toContain('/leagues/');
  });

  test('renders multiple leagues', async () => {
    (leagueService.listSetAmountOfLeagues as jest.Mock).mockResolvedValue([
      { id: 1, name: 'League 1', country_name: 'Country 1', emblem_image_url: 'url1' },
      { id: 2, name: 'League 2', country_name: 'Country 2', emblem_image_url: 'url2' },
    ]);
    render(
      <Router>
        <LeagueList />
      </Router>,
    );
    const leagues = await screen.findAllByText(/league/i);
    expect(leagues).toHaveLength(2);
  });

  test('displays no data message when no leagues are found', async () => {
    (leagueService.listAllLeagues as jest.Mock).mockResolvedValue([]);
    const renderWithRouter = (component: JSX.Element) => render(<Router>{component}</Router>);
    renderWithRouter(<LeagueListAll />);
    const noDataMessage = await screen.findByText(/no leagues found/i);
    expect(noDataMessage).toBeInTheDocument();
  });
});

describe('LeagueDetails Component', () => {
  const mockLeague = {
    id: 1,
    name: 'League 1',
    country_name: 'Country 1',
    page_id: 1,
    content: 'Content',
  };

  const mockPageHistory = {
    created_at: '2023-01-01T00:00:00Z',
    view_count: 100,
  };

  const mockRevision = {
    revised_at: '2023-01-02T00:00:00Z',
    revised_by: 42,
  };

  const mockTags = [{ tag_id: 1, tag_name: 'Tag 1' }];
  const mockTeams = [{ id: 1, name: 'Team 1' }];

  const renderWithRouter = (component: JSX.Element) => render(<Router>{component}</Router>);

  beforeEach(() => {
    jest.clearAllMocks();

    (leagueService.getLeague as jest.Mock).mockResolvedValue(mockLeague);
    (playerService.getCreator as jest.Mock).mockResolvedValue({ username: 'TestUser' });
    (playerService.getPageHistory as jest.Mock).mockResolvedValue(mockPageHistory);
    (playerService.getRevisedName as jest.Mock).mockResolvedValue(mockRevision);
    (tagService.getTagsForPage as jest.Mock).mockResolvedValue(mockTags);
    (leagueService.getTeamsInLeague as jest.Mock).mockResolvedValue(mockTeams);
  });

  test('displays associated tags', async () => {
    renderWithRouter(<LeagueDetails match={{ params: { id: 1 } }} />);

    const tag = await screen.findByText('Tag 1');
    expect(tag).toBeInTheDocument();
  });

  test('renders teams in the league', async () => {
    renderWithRouter(<LeagueDetails match={{ params: { id: 1 } }} />);

    const team = await screen.findByText('Team 1');
    expect(team).toBeInTheDocument();
  });

  test('displays associated tags correctly', async () => {
    (tagService.getTagsForPage as jest.Mock).mockResolvedValue([
      { tag_id: 1, tag_name: 'Tag 1' },
      { tag_id: 2, tag_name: 'Tag 2' },
    ]);

    renderWithRouter(<LeagueDetails match={{ params: { id: 1 } }} />);

    const tag1 = await screen.findByText('Tag 1');
    const tag2 = await screen.findByText('Tag 2');

    expect(tag1).toBeInTheDocument();
    expect(tag2).toBeInTheDocument();
  });
});

describe('LeagueEdit Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'isLoggedIn') return 'true';
      if (key === 'user') return JSON.stringify({ user_id: 1, username: 'TestUser' });
      return null;
    });

    (leagueService.getLeague as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'League 1',
      country_id: 1,
      content: 'Content',
      page_id: 1,
    });

    (playerService.getCountries as jest.Mock).mockResolvedValue([
      { country_id: 1, country_name: 'Country 1' },
    ]);

    (tagService.getTags as jest.Mock).mockResolvedValue([{ tag_id: 1, tag_name: 'Tag 1' }]);

    (revisionService.getRevisions as jest.Mock).mockResolvedValue([]);
    (revisionService.addRevision as jest.Mock).mockResolvedValue({});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderWithRouter = (component: JSX.Element) => render(<Router>{component}</Router>);

  test('prefills form fields with current league data', async () => {
    renderWithRouter(<LeagueEdit match={{ params: { id: 1 } }} />);

    const nameInput = await waitFor(() => screen.getByDisplayValue('League 1'));
    expect(nameInput).toBeInTheDocument();

    const countryInput = screen.getByDisplayValue('Country 1');
    expect(countryInput).toBeInTheDocument();
  });

  test('shows validation errors for missing required fields', async () => {
    renderWithRouter(<LeagueEdit match={{ params: { id: 1 } } as any} />);
    fireEvent.click(screen.getByText('Save Changes'));
    const errorMessage = await screen.findByText(/name is required/i);
    expect(errorMessage).toBeInTheDocument();
  });
});

describe('LeagueNew Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'isLoggedIn') return 'true';
      if (key === 'user') return JSON.stringify({ user_id: 1, username: 'TestUser' });
      return null;
    });

    (playerService.getCountries as jest.Mock).mockResolvedValue([
      { country_id: 1, country_name: 'Country 1' },
    ]);

    (leagueService.addLeague as jest.Mock).mockResolvedValue(1);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderWithRouter = (component: JSX.Element) => render(<Router>{component}</Router>);

  test('renders new league form', () => {
    renderWithRouter(<LeagueNew />);

    expect(screen.getByText('New League')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });
});

describe('LeagueComponent snapshot', () => {
  const renderWithRouter = (component: JSX.Element) => render(<Router>{component}</Router>);
  test('LeagueListAll snapshot', () => {
    const { asFragment } = renderWithRouter(<LeagueListAll />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('LeagueList snapshot', () => {
    const { asFragment } = render(<LeagueList />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('LeagueDetails snapshot', () => {
    const { asFragment } = renderWithRouter(<LeagueDetails match={{ params: { id: 1 } }} />);
    expect(asFragment()).toMatchSnapshot();
  });
});

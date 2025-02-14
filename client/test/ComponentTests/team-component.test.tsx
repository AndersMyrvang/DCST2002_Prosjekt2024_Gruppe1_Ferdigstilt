import axios from 'axios';
import React from 'react';
import { render, screen, fireEvent, waitFor, act, cleanup } from '@testing-library/react';
import {
  TeamList,
  TeamNew,
  TeamEdit,
  TeamDetails,
  TeamListAll,
} from '../../src/components/team-components';
import teamService from '../../src/services/team-service';
import userService from '../../src/services/user-service';
import playerService from '../../src/services/player-service';
import { BrowserRouter, Router } from 'react-router-dom';
import tagService from '../../src/services/tag-service';
import commentService from '../../src/services/comment-service';
import leagueService from '../../src/services/league-service';

beforeEach(() => {
  jest.spyOn(window, 'XMLHttpRequest').mockImplementation(() => ({
    open: jest.fn(),
    send: jest.fn(),
    setRequestHeader: jest.fn(),
    onreadystatechange: jest.fn(),
    readyState: 4,
    status: 200,
    responseText: JSON.stringify([{ id: 1, name: 'Team A' }]),
  }));
});

jest.mock('../../src/services/tag-service');
jest.mock('../../src/services/team-service');
jest.mock('../../src/services/user-service');
jest.mock('../../src/services/player-service');
jest.mock('../../src/services/comment-service');
jest.mock('../../src/services/league-service');

const mockTeams = [
  {
    id: 1,
    name: 'Team A',
    country_id: 1,
    country_name: 'Country A',
    coach: 'Coach A',
    league: 1,
    emblem_image_url: 'https://example.com/emblem1.png',
    content: 'Team A Content',
  },
  {
    id: 2,
    name: 'Team B',
    country_id: 2,
    country_name: 'Country B',
    coach: 'Coach B',
    league: 2,
    emblem_image_url: 'https://example.com/emblem2.png',
    content: 'Team B Content',
  },
];
const mockLeagues = [
  { id: 1, name: 'League A', country_id: 1, country_name: 'Country A' },
  { id: 2, name: 'League B', country_id: 2, country_name: 'Country B' },
];
const mockUserAdmin = { user_id: 1, username: 'Admin', is_admin: true };
const mockUserRegular = { user_id: 2, username: 'User', is_admin: false };
const mockPlayers = [
  { id: 1, name: 'Player A', team_id: 1 },
  { id: 2, name: 'Player B', team_id: 1 },
];
const mockCountries = [
  { country_id: 1, country_name: 'Country A' },
  { country_id: 2, country_name: 'Country B' },
];

const mockTags = [{ tag_id: 1, tag_name: 'Tag A' }];

const mockComments = [
  { id: 1, content: 'Great team!', user: 'User A' },
  { id: 2, content: 'Amazing players!', user: 'User B' },
];

const mockTeam = {
  id: 1,
  name: 'Team A',
  country_name: 'Country A',
  league: 1,
  coach: 'Coach A',
  page_id: 1,
  content: '',
};

beforeAll(() => {
  const mockTeam = {
    id: 1,
    name: 'Team A',
    country_name: 'Country A',
    league: 1,
    coach: 'Coach A',
    page_id: 1,
    content: '',
  };
  const mockTeams = [
    {
      id: 1,
      name: 'Team A',
      country_id: 1,
      country_name: 'Country A',
      coach: 'Coach A',
      league: 1,
      emblem_image_url: 'https://example.com/emblem1.png',
      content: 'Team A Content',
    },
    {
      id: 2,
      name: 'Team B',
      country_id: 2,
      country_name: 'Country B',
      coach: 'Coach B',
      league: 2,
      emblem_image_url: 'https://example.com/emblem2.png',
      content: 'Team B Content',
    },
  ];
  const mockLeagues = [
    { id: 1, name: 'League A', country_id: 1, country_name: 'Country A' },
    { id: 2, name: 'League B', country_id: 2, country_name: 'Country B' },
  ];
  const mockUserAdmin = { user_id: 1, username: 'Admin', is_admin: true };
  const mockUserRegular = { user_id: 2, username: 'User', is_admin: false };
  const mockPlayers = [
    { id: 1, name: 'Player A', team_id: 1 },
    { id: 2, name: 'Player B', team_id: 1 },
  ];
  const mockCountries = [
    { country_id: 1, country_name: 'Country A' },
    { country_id: 2, country_name: 'Country B' },
  ];

  const mockTags = [{ tag_id: 1, tag_name: 'Tag A' }];

  const mockComments = [
    { id: 1, content: 'Great team!', user: 'User A' },
    { id: 2, content: 'Amazing players!', user: 'User B' },
  ];

  (playerService.getCreator as jest.Mock).mockResolvedValue({ username: 'AdminUser' });
  (playerService.getPageHistory as jest.Mock).mockResolvedValue({
    created_at: new Date(),
    view_count: 42,
  });
  (tagService.getTagsForPage as jest.Mock).mockResolvedValue([
    { tag_id: 1, tag_name: 'Tag A' },
    { tag_id: 2, tag_name: 'Tag B' },
  ]);
  (playerService.getRevisedName as jest.Mock).mockResolvedValue({
    revised_by: 'EditorUser',
    revised_at: new Date(),
  });
  (leagueService.getLeague as jest.Mock).mockResolvedValue({
    id: 1,
    name: 'League A',
    country_id: 1,
    country_name: 'Country A',
    emblem_image_url: '',
    page_id: 1,
    content: '',
  });
  (teamService.getLeagues as jest.Mock).mockResolvedValue(mockLeagues);
  (teamService.getTeam as jest.Mock).mockResolvedValue(mockTeam);
  (teamService.listAllPlayersOnTeam as jest.Mock).mockResolvedValue(mockPlayers);
  (tagService.getTagsForPage as jest.Mock).mockResolvedValue(mockTags);
  (commentService.listComments as jest.Mock).mockResolvedValue(mockComments);
});

(leagueService.getLeague as jest.Mock).mockResolvedValue({
  id: 1,
  name: 'League A',
  country_id: 1,
  country_name: 'Country A',
  emblem_image_url: '',
  page_id: 1,
  content: '',
});
(tagService.getTags as jest.Mock).mockResolvedValue([
  { tag_id: 1, tag_name: 'Tag A' },
  { tag_id: 2, tag_name: 'Tag B' },
]);

(playerService.getCreator as jest.Mock).mockResolvedValue({ username: 'AdminUser' });
(playerService.getPageHistory as jest.Mock).mockResolvedValue({
  created_at: new Date(),
  view_count: 42,
});
(tagService.getTagsForPage as jest.Mock).mockResolvedValue([
  { tag_id: 1, tag_name: 'Tag A' },
  { tag_id: 2, tag_name: 'Tag B' },
]);
(playerService.getRevisedName as jest.Mock).mockResolvedValue({
  revised_by: 'EditorUser',
  revised_at: new Date(),
});
(teamService.listAllPlayersOnTeam as jest.Mock).mockResolvedValue([
  { id: 1, name: 'Player A', team_id: 1 },
  { id: 2, name: 'Player B', team_id: 1 },
]);

describe('Team Components', () => {
  describe('TeamListAll Component', () => {
    test('renders the team list correctly for logged-in admin', async () => {
      (teamService.listAllTeams as jest.Mock).mockResolvedValue(mockTeams);
      (userService.getUserById as jest.Mock).mockResolvedValue(mockUserAdmin);

      await act(async () => {
        render(
          <BrowserRouter>
            <TeamListAll />
          </BrowserRouter>,
        );
      });

      expect(screen.getByText(/All Teams/i)).toBeInTheDocument();
      await waitFor(() => expect(screen.getByText('Team A')).toBeInTheDocument());
      expect(screen.getByText('Country: Country A')).toBeInTheDocument();
      expect(screen.getByText('Coach: Coach A')).toBeInTheDocument();
    });

    test('does not show "New Team" button for regular users', async () => {
      (teamService.listAllTeams as jest.Mock).mockResolvedValue(mockTeams);
      (userService.getUserById as jest.Mock).mockResolvedValue(mockUserRegular);

      await act(async () => {
        render(
          <BrowserRouter>
            <TeamListAll />
          </BrowserRouter>,
        );
      });

      expect(screen.queryByText(/New team/i)).not.toBeInTheDocument();
    });
  });
});

describe('Team Components', () => {
  test('renders the edit form and updates the team', async () => {
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

    (teamService.getTeam as jest.Mock).mockResolvedValue(mockTeam);
    (teamService.getLeagues as jest.Mock).mockResolvedValue(mockLeagues);
    (playerService.getCountries as jest.Mock).mockResolvedValue(mockCountries);
    (teamService.updateTeam as jest.Mock).mockResolvedValue(undefined);

    await act(async () => {
      render(
        <BrowserRouter>
          <TeamEdit match={{ params: { id: 1 } }} />
        </BrowserRouter>,
      );
    });

    expect(screen.getByDisplayValue('Team A')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Coach A')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Country A')).toBeInTheDocument();
    expect(screen.getByDisplayValue('League A')).toBeInTheDocument();

    fireEvent.change(screen.getByDisplayValue('Team A'), { target: { value: 'Updated Team A' } });
    fireEvent.change(screen.getByDisplayValue('Coach A'), { target: { value: 'Updated Coach A' } });
    fireEvent.change(screen.getByDisplayValue('League A'), { target: { value: '2' } });
    fireEvent.change(screen.getByDisplayValue('Country A'), { target: { value: '2' } });
    fireEvent.click(screen.getByText(/Save Changes/i));

    await waitFor(() => {
      expect(teamService.updateTeam).toHaveBeenCalledWith(
        1,
        'Updated Team A',
        2,
        'Updated Coach A',
        2,
        '',
        '',
        1,
      );
    });
  });
});

describe('TeamList Component', () => {
  test('renders team details and associated players', async () => {
    const mockTeam = {
      id: 1,
      name: 'Team A',
      country_name: 'Country A',
      league: 1,
      coach: 'Coach A',
      page_id: 1,
      content: '',
    };

    (teamService.getTeam as jest.Mock).mockResolvedValue(mockTeam);
    (teamService.listAllPlayersOnTeam as jest.Mock).mockResolvedValue(mockPlayers);

    await act(async () => {
      render(
        <BrowserRouter>
          <TeamDetails match={{ params: { id: 1 } }} />
        </BrowserRouter>,
      );
    });

    expect((await screen.findAllByText('Team A')).length).toBeGreaterThan(0);
    expect((await screen.findAllByText('Country A')).length).toBeGreaterThan(0);

    await waitFor(() => {
      expect(screen.getByText('Player A')).toBeInTheDocument();
      expect(screen.getByText('Player B')).toBeInTheDocument();
    });
  });
});

describe('TeamDetails Component', () => {
  test('renders associated tags correctly', async () => {
    const mockTeam = {
      id: 1,
      name: 'Team A',
      country_name: 'Country A',
      league: 1,
      coach: 'Coach A',
      page_id: 1,
      content: '',
    };

    const mockTags = [
      { tag_id: 1, tag_name: 'Tag A' },
      { tag_id: 2, tag_name: 'Tag B' },
    ];

    (teamService.getTeam as jest.Mock).mockResolvedValue(mockTeam);
    (tagService.getTagsForPage as jest.Mock).mockResolvedValue(mockTags);

    await act(async () => {
      render(
        <BrowserRouter>
          <TeamDetails match={{ params: { id: 1 } }} />
        </BrowserRouter>,
      );
    });

    const tagElements = await screen.findAllByRole('listitem');
    expect(tagElements).toHaveLength(2);
    expect(tagElements[0]).toHaveTextContent('Tag A');
    expect(tagElements[1]).toHaveTextContent('Tag B');
  });

  describe('TeamList Component', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('renders the team list correctly', async () => {
      (teamService.listSetAmountOfTeams as jest.Mock).mockResolvedValue(mockTeams);

      await act(async () => {
        render(
          <BrowserRouter>
            <TeamList />
          </BrowserRouter>,
        );
      });

      await waitFor(() =>
        expect(screen.getByText('Check out some of our teams!')).toBeInTheDocument(),
      );

      expect(screen.getByText('Team A')).toBeInTheDocument();
      expect(screen.getByText('Country: Country A')).toBeInTheDocument();
      expect(screen.getByText('Coach: Coach A')).toBeInTheDocument();

      expect(screen.getByText('Team B')).toBeInTheDocument();
      expect(screen.getByText('Country: Country B')).toBeInTheDocument();
      expect(screen.getByText('Coach: Coach B')).toBeInTheDocument();

      expect(screen.getByAltText('Bilde fra https://example.com/emblem1.png')).toHaveAttribute(
        'src',
        'https://example.com/emblem1.png',
      );
      expect(screen.getByAltText('Bilde fra https://example.com/emblem2.png')).toHaveAttribute(
        'src',
        'https://example.com/emblem2.png',
      );
    });

    test('displays an error message if fetching teams fails', async () => {
      (teamService.listSetAmountOfTeams as jest.Mock).mockRejectedValue(
        new Error('Failed to fetch teams'),
      );

      await act(async () => {
        render(
          <BrowserRouter>
            <TeamList />
          </BrowserRouter>,
        );
      });

      await waitFor(() =>
        expect(screen.getByText(/Error getting teams: Failed to fetch teams/i)).toBeInTheDocument(),
      );
    });
  });

  describe('TeamNew Component', () => {
    test('renders and adds a new team', async () => {
      (teamService.addTeam as jest.Mock).mockResolvedValue(2);
      (userService.getUserById as jest.Mock).mockResolvedValue(mockUserAdmin);
      (teamService.getLeagues as jest.Mock).mockResolvedValue(mockLeagues);
      (playerService.getCountries as jest.Mock).mockResolvedValue([
        { country_id: 1, country_name: 'Country A' },
        { country_id: 2, country_name: 'Country B' },
      ]);

      await act(async () => {
        render(
          <BrowserRouter>
            <TeamNew />
          </BrowserRouter>,
        );
      });

      fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'New Team' } });
      fireEvent.change(screen.getByLabelText(/Coach/i), { target: { value: 'New Coach' } });
      fireEvent.click(screen.getByText(/Save/i));

      await waitFor(() => expect(teamService.addTeam).toHaveBeenCalled());
    });

    test('deletes a team', async () => {
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
      (teamService.addTeam as jest.Mock).mockResolvedValue(3);

      (tagService.getTagsForPage as jest.Mock).mockResolvedValue([
        { tag_id: 1, tag_name: 'Tag A' },
        { tag_id: 2, tag_name: 'Tag B' },
      ]);

      (teamService.getLeagues as jest.Mock).mockResolvedValue([
        { id: 1, name: 'League A', country_id: 1, country_name: 'Country A' },
        { id: 2, name: 'League B', country_id: 2, country_name: 'Country B' },
      ]);

      (playerService.getCountries as jest.Mock).mockResolvedValue([
        { country_id: 1, country_name: 'Country A' },
        { country_id: 2, country_name: 'Country B' },
      ]);

      (tagService.getTags as jest.Mock).mockResolvedValue([
        { tag_id: 1, tag_name: 'Tag A' },
        { tag_id: 2, tag_name: 'Tag B' },
        { tag_id: 3, tag_name: 'Tag C' },
      ]);

      (tagService.addTagToPage as jest.Mock).mockResolvedValue(undefined);

      (tagService.addTagToPage as jest.Mock).mockResolvedValue(undefined);
      (tagService.getTagsForPage as jest.Mock).mockResolvedValue([
        { tag_id: 1, tag_name: 'Tag A' },
        { tag_id: 2, tag_name: 'Tag B' },
        { tag_id: 3, tag_name: 'Tag C' },
      ]);

      (tagService.removeTagFromPage as jest.Mock).mockResolvedValue(undefined);
      (tagService.getTagsForPage as jest.Mock).mockResolvedValue([
        { tag_id: 2, tag_name: 'Tag B' },
      ]);

      (teamService.updateTeam as jest.Mock).mockResolvedValue(undefined);
      (teamService.deleteTeam as jest.Mock).mockResolvedValue(undefined);

      await act(async () => {
        render(
          <BrowserRouter>
            <TeamEdit match={{ params: { id: 1 } }} />
          </BrowserRouter>,
        );
      });

      fireEvent.click(screen.getByText(/Delete Team/i));

      await waitFor(() => {
        expect(teamService.deleteTeam).toHaveBeenCalledWith(mockTeam.page_id);
      });
    });

    test('increments view count on mount', async () => {
      const mockTeam = {
        id: 1,
        name: 'Team A',
        country_name: 'Country A',
        league: 1,
        coach: 'Coach A',
        page_id: 1,
        content: '',
      };

      (teamService.addTeam as jest.Mock).mockResolvedValue(3);
      (tagService.getTagsForPage as jest.Mock).mockResolvedValue([
        { tag_id: 1, tag_name: 'Tag A' },
        { tag_id: 2, tag_name: 'Tag B' },
      ]);

      (teamService.getLeagues as jest.Mock).mockResolvedValue([
        { id: 1, name: 'League A', country_id: 1, country_name: 'Country A' },
        { id: 2, name: 'League B', country_id: 2, country_name: 'Country B' },
      ]);

      (playerService.getCountries as jest.Mock).mockResolvedValue([
        { country_id: 1, country_name: 'Country A' },
        { country_id: 2, country_name: 'Country B' },
      ]);

      (tagService.getTags as jest.Mock).mockResolvedValue([
        { tag_id: 1, tag_name: 'Tag A' },
        { tag_id: 2, tag_name: 'Tag B' },
        { tag_id: 3, tag_name: 'Tag C' },
      ]);

      (tagService.addTagToPage as jest.Mock).mockResolvedValue(undefined);

      (tagService.addTagToPage as jest.Mock).mockResolvedValue(undefined);
      (tagService.getTagsForPage as jest.Mock).mockResolvedValue([
        { tag_id: 1, tag_name: 'Tag A' },
        { tag_id: 2, tag_name: 'Tag B' },
        { tag_id: 3, tag_name: 'Tag C' },
      ]);

      (tagService.removeTagFromPage as jest.Mock).mockResolvedValue(undefined);
      (tagService.getTagsForPage as jest.Mock).mockResolvedValue([
        { tag_id: 2, tag_name: 'Tag B' },
      ]);

      (teamService.updateTeam as jest.Mock).mockResolvedValue(undefined);
      (teamService.deleteTeam as jest.Mock).mockResolvedValue(undefined);

      await act(async () => {
        render(
          <BrowserRouter>
            <TeamDetails match={{ params: { id: 1 } }} />
          </BrowserRouter>,
        );
      });

      await waitFor(() => {
        expect(playerService.incrementViewCount).toHaveBeenCalledWith(mockTeam.page_id);
      });
    });

    test('adds a tag to a team', async () => {
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

      (teamService.getTeam as jest.Mock).mockResolvedValue(mockTeam);
      (tagService.getTags as jest.Mock).mockResolvedValue(mockTags);
      (tagService.addTagToPage as jest.Mock).mockResolvedValue(undefined);
      (tagService.getTagsForPage as jest.Mock).mockResolvedValue(mockTags);

      await act(async () => {
        render(
          <BrowserRouter>
            <TeamEdit match={{ params: { id: 1 } }} />
          </BrowserRouter>,
        );
      });

      fireEvent.change(screen.getByDisplayValue('Select tag to add'), { target: { value: '1' } });
      fireEvent.click(screen.getByText(/Add Tag/i));

      await waitFor(() => {
        expect(tagService.addTagToPage).toHaveBeenCalledWith(mockTeam.page_id, 1);
      });

      expect(screen.getAllByText('Tag A').length).toBe(2);
    });

    test('displays comments in CommentSection', async () => {
      const mockTeam = {
        id: 1,
        name: 'Team A',
        country_name: 'Country A',
        league: 1,
        coach: 'Coach A',
        page_id: 1,
        content: '',
      };

      const mockComments = [
        { comment_id: 1, user_id: 1, content: 'Great team!', username: 'User A' },
        { comment_id: 2, user_id: 2, content: 'Amazing players!', username: 'User B' },
      ];

      (teamService.getTeam as jest.Mock).mockResolvedValue(mockTeam);
      (commentService.listComments as jest.Mock).mockResolvedValue(mockComments);

      await act(async () => {
        render(
          <BrowserRouter>
            <TeamDetails match={{ params: { id: 1 } }} />
          </BrowserRouter>,
        );
      });

      await waitFor(() => {
        expect(screen.getByText('Great team!')).toBeInTheDocument();
        expect(screen.getByText('Amazing players!')).toBeInTheDocument();
      });
    });

    test('removes a tag from a team', async () => {
      const mockTags = [
        { tag_id: 1, tag_name: 'Tag A' },
        { tag_id: 2, tag_name: 'Tag B' },
      ];

      const mockTeam = {
        id: 1,
        name: 'Team A',
        page_id: 1,
      };

      (teamService.getTeam as jest.Mock).mockResolvedValueOnce(mockTeam);
      (tagService.getTagsForPage as jest.Mock).mockResolvedValueOnce(mockTags);
      (tagService.removeTagFromPage as jest.Mock).mockResolvedValueOnce(undefined);

      await act(async () => {
        render(
          <BrowserRouter>
            <TeamEdit match={{ params: { id: 1 } }} />
          </BrowserRouter>,
        );
      });

      expect(screen.getAllByText('Tag A')).toHaveLength(2);
      expect(screen.getAllByText('Tag B')).toHaveLength(2);

      const removeButton = screen.getByLabelText('Remove Tag A');
      fireEvent.click(removeButton);

      await waitFor(() => {
        expect(tagService.removeTagFromPage).toHaveBeenCalledWith(1, 1);
      });
    });

    test('displays an error message when fetching teams fails', async () => {
      (teamService.listAllTeams as jest.Mock).mockRejectedValue(new Error('Network Error'));

      render(
        <BrowserRouter>
          <TeamListAll />
        </BrowserRouter>,
      );

      expect(teamService.listAllTeams).toHaveBeenCalled();
    });
  });
});

describe('Snapshot tests', () => {
  test('LeagueList snapshot', () => {
    const { asFragment } = render(<TeamList />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('LeagueList snapshot', () => {
    const { asFragment } = render(<TeamDetails match={{ params: { id: 1 } }} />);
    expect(asFragment()).toMatchSnapshot();
  });
});

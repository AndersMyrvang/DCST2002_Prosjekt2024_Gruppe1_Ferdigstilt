import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { TagList, TagAdd } from '../../src/components/tag-component';
import tagService from '../../src/services/tag-service';
import userService from '../../src/services/user-service';
import { createHashHistory } from 'history';

jest.mock('../../src/services/tag-service');
jest.mock('../../src/services/user-service');
jest.mock('react-icons/fa', () => ({
  FaTrashAlt: () => <span data-testid="trash-icon">TrashIcon</span>,
}));
jest.mock('history', () => ({
  createHashHistory: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

const history = createHashHistory();

describe('TagList Component', () => {
  const mockTags = [
    { tag_id: 1, tag_name: 'Tag1' },
    { tag_id: 2, tag_name: 'Tag2' },
  ];

  const mockUser = {
    user_id: 1,
    google_id: '123',
    username: 'testuser',
    email: 'test@test.com',
    profile_image_url: '',
    first_login: new Date(),
    last_login: new Date(),
    is_admin: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (tagService.getTags as jest.Mock).mockResolvedValue(mockTags);
    (tagService.getTagPageCount as jest.Mock).mockResolvedValue(0);
    (userService.getUserById as jest.Mock).mockResolvedValue(mockUser);

    localStorage.setItem('user_id', '1');
  });

  afterEach(() => {
    localStorage.removeItem('user_id');
  });

  test('renders tags and page counts', async () => {
    (tagService.getTagPageCount as jest.Mock).mockResolvedValueOnce(3).mockResolvedValueOnce(5);

    await act(async () => {
      render(<TagList />);
    });

    await waitFor(() => {
      expect(screen.getByText('Tag1')).toBeInTheDocument();
      expect(screen.getByText('Tag2')).toBeInTheDocument();
      expect(screen.getByText('Pages: 3')).toBeInTheDocument();
      expect(screen.getByText('Pages: 5')).toBeInTheDocument();
    });
  });

  test('allows admin to delete a tag', async () => {
    (tagService.deleteTag as jest.Mock).mockResolvedValue({});

    await act(async () => {
      render(<TagList />);
    });

    await waitFor(() => {
      expect(screen.getByText('Tag1')).toBeInTheDocument();
    });

    const deleteButton = screen.getAllByTestId('trash-icon')[0];
    window.confirm = jest.fn().mockReturnValueOnce(true);

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(tagService.deleteTag).toHaveBeenCalledWith(1);
    });
  });

  test('hides delete button for non-admin users', async () => {
    const nonAdminUser = { ...mockUser, is_admin: false };
    (userService.getUserById as jest.Mock).mockResolvedValue(nonAdminUser);

    await act(async () => {
      render(<TagList />);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('trash-icon')).not.toBeInTheDocument();
    });
  });

  test('renders "New tag" button for logged-in users', async () => {
    await act(async () => {
      render(<TagList />);
    });

    await waitFor(() => {
      expect(screen.getByText('New tag')).toBeInTheDocument();
    });
  });
});

describe('TagAdd Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    localStorage.removeItem('user_id');
  });

  test('matches snapshot for initial render', async () => {
    let container: DocumentFragment = document.createDocumentFragment();

    await act(async () => {
      const { asFragment } = render(<TagAdd />);
      container = asFragment();
    });

    expect(container).toMatchSnapshot();
  });

  test('adds a new tag', async () => {
    const mockUser = {
      user_id: 1,
      google_id: '123',
      username: 'testuser',
      email: 'test@test.no',
      profile_image_url: '',
      first_login: new Date(),
      last_login: new Date(),
      is_admin: true,
    };

    (userService.getUserById as jest.Mock).mockResolvedValue(mockUser);
    (tagService.addTag as jest.Mock).mockResolvedValue({ tag_id: 3, tag_name: 'New Tag' });

    await act(async () => {
      render(<TagAdd />);
    });

    const input = screen.getByPlaceholderText('Tag name');

    const button = screen.getByRole('button', { name: 'Add tag' });

    fireEvent.change(input, { target: { value: 'New Tag' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(tagService.addTag).toHaveBeenCalledWith({ tag_id: 0, tag_name: 'New Tag' });
    });
  });

  test('hides delete button for non-admin users', async () => {
    const nonAdminUser = {
      user_id: 10,
      google_id: '1234',
      username: 'testuser1',
      email: 'test1@test.no',
      profile_image_url: '',
      first_login: new Date(),
      last_login: new Date(),
      is_admin: false,
    };
    (userService.getUserById as jest.Mock).mockResolvedValue(nonAdminUser);

    await act(async () => {
      render(<TagAdd />);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('trash-icon')).not.toBeInTheDocument();
    });
  });

  test('matches snapshot for initial render', async () => {
    let container: DocumentFragment = document.createDocumentFragment();

    await act(async () => {
      const { asFragment } = render(<TagAdd />);
      container = asFragment();
    });

    expect(container).toMatchSnapshot();
  });
});

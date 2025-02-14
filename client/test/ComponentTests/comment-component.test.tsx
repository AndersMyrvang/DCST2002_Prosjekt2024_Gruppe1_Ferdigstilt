import * as React from 'react';
import { shallow } from 'enzyme';
import { CommentSection, NewComment } from '../../src/components/comment-components';
import { Form, Button, Column } from '../../src/widgets';
import { NavLink } from 'react-router-dom';
import commentService from '../../src/services/comment-service';
import userService from '../../src/services/user-service';
import { Comment, User } from '../../src/types';
import { FaTrashAlt } from 'react-icons/fa';
import { BiSolidPencil } from 'react-icons/bi';

jest.mock('../../src/services/comment-service', () => ({
  create: jest.fn(() => Promise.resolve({ comment_id: 4 })),
  listComments: jest.fn(() =>
    Promise.resolve([
      { comment_id: 1, user_id: 1, content: 'Great post!', likes: 5 },
      { comment_id: 2, user_id: 2, content: 'Nice article!', likes: 3 },
    ]),
  ),
  deleteComment: jest.fn(() => Promise.resolve()),
  update: jest.fn(() =>
    Promise.resolve({
      comment: { comment_id: 1, user_id: 1, content: 'Updated comment text', likes: 5 },
    }),
  ),
}));

jest.mock('../../src/services/user-service', () => ({
  getUserById: jest.fn((user_id) =>
    Promise.resolve({
      user_id,
      username: 'testuser',
      is_admin: false,
    }),
  ),
}));

describe('Comment component tests', () => {
  const mockOnNewComment = jest.fn();
  const page_id = 1;

  beforeEach(() => {
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((key) => {
      if (key === 'user_id') return '1'; 
      return null;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('NewComment component renders and posts comment', async () => {
    const wrapper = shallow(<NewComment page_id={page_id} onNewComment={mockOnNewComment} />);

    wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'New comment text' } });
    wrapper.find(Button.Success).simulate('click');

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(commentService.create).toHaveBeenCalledWith(1, 'New comment text', page_id);
    expect(mockOnNewComment).toHaveBeenCalled();
  });

  test('CommentSection loads and displays comments', async () => {
    const wrapper = shallow(<CommentSection page_id={page_id} onNewComment={mockOnNewComment} />);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(commentService.listComments).toHaveBeenCalledWith(page_id);
    expect(wrapper.containsMatchingElement(<Column>Great post!</Column>)).toEqual(true);
    expect(wrapper.containsMatchingElement(<Column>Nice article!</Column>)).toEqual(true);
  });

  test('CommentSection deletes a comment and reloads', async () => {
    const wrapper = shallow(<CommentSection page_id={page_id} onNewComment={mockOnNewComment} />);

    await new Promise((resolve) => setTimeout(resolve, 0));

    wrapper.setState({ user: { user_id: 1, username: 'testuser', is_admin: true } });

    wrapper.find(Button.Danger).at(0).simulate('click');
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(commentService.deleteComment).toHaveBeenCalledWith(1);
    expect(commentService.listComments).toHaveBeenCalledWith(page_id);
  });

  test('NewComment snapshot matches', () => {
    const wrapper = shallow(<NewComment page_id={page_id} onNewComment={mockOnNewComment} />);
    expect(wrapper).toMatchSnapshot();
  });

  test('CommentSection snapshot matches', async () => {
    const wrapper = shallow(<CommentSection page_id={page_id} onNewComment={mockOnNewComment} />);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(wrapper).toMatchSnapshot();
  });

  test('NewComment renders correctly initially', () => {
    const wrapper = shallow(<NewComment page_id={page_id} onNewComment={mockOnNewComment} />);
    expect(wrapper).toMatchSnapshot();
  });

  test('CommentSection renders correctly with loaded comments', async () => {
    const wrapper = shallow(<CommentSection page_id={page_id} onNewComment={mockOnNewComment} />);

    await new Promise((resolve) => setTimeout(resolve, 0));
    wrapper.update();

    expect(wrapper).toMatchSnapshot();
  });

  test('CommentSection renders correctly when editing a comment', async () => {
    const wrapper = shallow(<CommentSection page_id={page_id} onNewComment={mockOnNewComment} />);

    await new Promise((resolve) => setTimeout(resolve, 0));
    wrapper.setState({ updatingComment: 1, updatedContent: 'Test edit content' });
    wrapper.update();

    expect(wrapper).toMatchSnapshot();
  });

  test("CommentSection renders correctly with delete and edit buttons for user's own comment", async () => {
    const wrapper = shallow(<CommentSection page_id={page_id} onNewComment={mockOnNewComment} />);

    wrapper.setState({
      user: { user_id: 1, is_admin: false },
      comment: [{ comment_id: 1, user_id: 1, content: "User's own comment", likes: 0 }],
    });

    await new Promise((resolve) => setTimeout(resolve, 0));
    wrapper.update();

    expect(wrapper).toMatchSnapshot();
  });

  test('CommentSection renders error alert when comments fail to load', async () => {
    jest
      .spyOn(commentService, 'listComments')
      .mockRejectedValue(new Error('Error loading comments'));

    const wrapper = shallow(<CommentSection page_id={page_id} onNewComment={mockOnNewComment} />);

    await new Promise((resolve) => setTimeout(resolve, 0));
    wrapper.update();

    expect(wrapper).toMatchSnapshot();
  });
});

import commentService from '../../src/services/comment-service';
import axios from 'axios';
import { Comment } from '../../src/types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CommentService', () => {
  const mockCommentData: Comment = {
    comment_id: 1,
    user_id: 1,
    page_id: 101,
    content: 'This is a comment',
    created_at: new Date(),
    updated_at: new Date(),
    likes: 2,
    profile_image_url: 'http://example.com/profile.jpg',
    username: 'user',
  };

  const mockCommentResponse = { comment: mockCommentData };

  test('listComments fetches comments for a page', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [mockCommentData] });

    const result = await commentService.listComments(mockCommentData.page_id);

    expect(result).toEqual([mockCommentData]);
    expect(mockedAxios.get).toHaveBeenCalledWith(`/comment/${mockCommentData.page_id}`);
  });

  test('create adds a new comment', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: mockCommentResponse });

    const result = await commentService.create(
      mockCommentData.user_id,
      mockCommentData.content,
      mockCommentData.page_id,
    );

    expect(result).toEqual(mockCommentResponse);
    expect(mockedAxios.post).toHaveBeenCalledWith(`/comment/${mockCommentData.page_id}/new`, {
      user_id: mockCommentData.user_id,
      content: mockCommentData.content,
      page_id: mockCommentData.page_id,
    });
  });

  test('update modifies a comment by ID', async () => {
    mockedAxios.put.mockResolvedValueOnce({ data: mockCommentResponse });

    const result = await commentService.update(mockCommentData.comment_id, 'Updated comment');

    expect(result).toEqual(mockCommentResponse);
    expect(mockedAxios.put).toHaveBeenCalledWith(`/comment/${mockCommentData.comment_id}/update`, {
      comment_id: mockCommentData.comment_id,
      content: 'Updated comment',
    });
  });

  test('deleteComment deletes a comment by ID', async () => {
    mockedAxios.delete.mockResolvedValueOnce({});

    await commentService.deleteComment(mockCommentData.comment_id);

    expect(mockedAxios.delete).toHaveBeenCalledWith(`/comment/${mockCommentData.comment_id}`);
  });

  test('listComments handles API errors', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

    await expect(commentService.listComments(mockCommentData.page_id)).rejects.toThrow(
      'Network Error',
    );
    expect(mockedAxios.get).toHaveBeenCalledWith(`/comment/${mockCommentData.page_id}`);
  });

  test('create handles errors gracefully', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Create Failed'));

    const result = await commentService.create(
      mockCommentData.user_id,
      mockCommentData.content,
      mockCommentData.page_id,
    );

    expect(result).toBeUndefined();
    expect(mockedAxios.post).toHaveBeenCalledWith(`/comment/${mockCommentData.page_id}/new`, {
      user_id: mockCommentData.user_id,
      content: mockCommentData.content,
      page_id: mockCommentData.page_id,
    });
  });

  test('update handles API errors', async () => {
    mockedAxios.put.mockRejectedValueOnce(new Error('Update Failed'));

    await expect(
      commentService.update(mockCommentData.comment_id, 'Updated comment'),
    ).rejects.toThrow('Update Failed');
    expect(mockedAxios.put).toHaveBeenCalledWith(`/comment/${mockCommentData.comment_id}/update`, {
      comment_id: mockCommentData.comment_id,
      content: 'Updated comment',
    });
  });
});

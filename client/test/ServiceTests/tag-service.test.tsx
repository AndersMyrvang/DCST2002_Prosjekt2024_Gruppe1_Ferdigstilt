import axios from 'axios';
import tagService from '../../src/services/tag-service';
import { Tag } from '../../src/types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('TagService', () => {
  const mockTag: Tag = {
    tag_id: 1,
    tag_name: 'Fotballspiller',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getTags fetches all tags', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [mockTag] });

    const result = await tagService.getTags();

    expect(result).toEqual([mockTag]);
    expect(mockedAxios.get).toHaveBeenCalledWith('/tags');
  });

  test('getTagsForPage fetches tags for a specific page', async () => {
    const pageId = 101;
    mockedAxios.get.mockResolvedValueOnce({ data: [mockTag] });

    const result = await tagService.getTagsForPage(pageId);

    expect(result).toEqual([mockTag]);
    expect(mockedAxios.get).toHaveBeenCalledWith(`/tags/${pageId}`);
  });

  test('getTagsForPage handles errors correctly', async () => {
    const pageId = 101;
    const error = new Error('Network Error');
    mockedAxios.get.mockRejectedValueOnce(error);

    await expect(tagService.getTagsForPage(pageId)).rejects.toThrow('Network Error');
  });

  test('addTagToPage adds a tag to a page', async () => {
    const pageId = 101;
    const tagId = 1;
    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });

    const result = await tagService.addTagToPage(pageId, tagId);

    expect(result).toEqual({ success: true });
    expect(mockedAxios.post).toHaveBeenCalledWith(`/tags/${pageId}/${tagId}`);
  });

  test('addTagToPage handles errors correctly', async () => {
    const pageId = 101;
    const tagId = 1;
    const error = new Error('Network Error');
    mockedAxios.post.mockRejectedValueOnce(error);

    await expect(tagService.addTagToPage(pageId, tagId)).rejects.toThrow('Network Error');
  });

  test('removeTagFromPage removes a tag from a page', async () => {
    const pageId = 101;
    const tagId = 1;
    mockedAxios.delete.mockResolvedValueOnce({ data: { success: true } });

    const result = await tagService.removeTagFromPage(pageId, tagId);

    expect(result).toEqual({ success: true });
    expect(mockedAxios.delete).toHaveBeenCalledWith(`/tags/${pageId}/${tagId}`);
  });

  test('removeTagFromPage handles errors correctly', async () => {
    const pageId = 101;
    const tagId = 1;
    const error = new Error('Network Error');
    mockedAxios.delete.mockRejectedValueOnce(error);

    await expect(tagService.removeTagFromPage(pageId, tagId)).rejects.toThrow('Network Error');
  });

  test('addTag adds a new tag', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: mockTag });

    const result = await tagService.addTag(mockTag);

    expect(result).toEqual(mockTag);
    expect(mockedAxios.post).toHaveBeenCalledWith('/tags', mockTag);
  });

  test('addTag handles errors correctly', async () => {
    const error = new Error('Network Error');
    mockedAxios.post.mockRejectedValueOnce(error);

    await expect(tagService.addTag(mockTag)).rejects.toThrow('Network Error');
  });

  test('deleteTag deletes a tag by ID', async () => {
    const tagId = 1;
    mockedAxios.delete.mockResolvedValueOnce({ data: { success: true } });

    const result = await tagService.deleteTag(tagId);

    expect(result).toEqual({ success: true });
    expect(mockedAxios.delete).toHaveBeenCalledWith(`/tags/${tagId}`);
  });

  test('deleteTag handles errors correctly', async () => {
    const tagId = 1;
    const error = new Error('Network Error');
    mockedAxios.delete.mockRejectedValueOnce(error);

    await expect(tagService.deleteTag(tagId)).rejects.toThrow('Network Error');
  });

  test('getTagPageCount fetches the page count for a tag', async () => {
    const tagId = 1;
    const pageCount = 3;
    mockedAxios.get.mockResolvedValueOnce({ data: { pages: pageCount } });

    const result = await tagService.getTagPageCount(tagId);

    expect(result).toBe(pageCount);
    expect(mockedAxios.get).toHaveBeenCalledWith(`/tags/${tagId}/pages`);
  });

  test('getTagPageCount handles errors correctly', async () => {
    const tagId = 1;
    const error = new Error('Network Error');
    mockedAxios.get.mockRejectedValueOnce(error);

    await expect(tagService.getTagPageCount(tagId)).rejects.toThrow('Network Error');
  });
});

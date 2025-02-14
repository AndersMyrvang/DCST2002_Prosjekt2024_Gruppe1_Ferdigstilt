import axios from 'axios';
import revisionService from '../../src/services/revision-service';
import { Revisions } from '../../src/types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('RevisionService', () => {
  const mockRevisions: Revisions[] = [
    {
      revision_id: 1,
      page_id: 101,
      content: 'Initial content',
      revised_by: 1,
      revised_at: new Date('2024-11-01T10:00:00Z'),
    },
    {
      revision_id: 2,
      page_id: 101,
      content: 'Updated content',
      revised_by: 2,
      revised_at: new Date('2024-12-01T10:00:00Z'),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getRevisions fetches revisions for a specific page', async () => {
    const pageId = 101;
    mockedAxios.get.mockResolvedValueOnce({ data: mockRevisions });

    const result = await revisionService.getRevisions(pageId);

    expect(result).toEqual(mockRevisions);
    expect(mockedAxios.get).toHaveBeenCalledWith(`/revisions/${pageId}`);
  });

  test('getRevisions handles errors correctly', async () => {
    const pageId = 101;
    const error = new Error('Network Error');
    mockedAxios.get.mockRejectedValueOnce(error);

    await expect(revisionService.getRevisions(pageId)).rejects.toThrow('Network Error');
  });

  test('addRevision successfully adds a revision', async () => {
    const pageId = 101;
    const content = 'New revision content';
    const revisedBy = 3;
    const mockResponse = {
      id: 3,
      page_id: pageId,
      content,
      revised_by: revisedBy,
      revised_at: '2024-11-03T10:00:00Z',
    };

    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

    const result = await revisionService.addRevision(pageId, content, revisedBy);

    expect(result).toEqual(mockResponse);
    expect(mockedAxios.post).toHaveBeenCalledWith('/revisions/create', {
      page_id: pageId,
      content,
      revised_by: revisedBy,
    });
  });

  test('addRevision handles errors correctly', async () => {
    const pageId = 101;
    const content = 'New revision content';
    const revisedBy = 3;
    const error = new Error('Network Error');
    mockedAxios.post.mockRejectedValueOnce(error);

    await expect(revisionService.addRevision(pageId, content, revisedBy)).rejects.toThrow(
      'Network Error',
    );
  });
});

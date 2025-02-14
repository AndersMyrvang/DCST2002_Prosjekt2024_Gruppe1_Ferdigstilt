import request from 'supertest';
import express from 'express';
import teamRouter from '../src/routes/team-router';
import tagService from '../src/services/tag-service';
import router from '../src/routes/tag-router';
import { resolve } from 'tinymce';

jest.mock('../src/services/tag-service', () => ({
  getTags: jest.fn(),
  getTagsForPage: jest.fn(),
  addTagToPage: jest.fn(),
  removeTagFromPage: jest.fn(),
  addTag: jest.fn(),
  removeTag: jest.fn(),
  checkTag: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use(router);

const mockTags = [
  { tag_id: 1, tag_name: 'TagOne' },
  { tag_id: 2, tag_name: 'TagTwo' },
  { tag_id: 3, tag_name: 'TagThree' },
];

describe('Tag routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('GET /tags', () => {
    it('should get all tags', async () => {
      (tagService.getTags as jest.Mock).mockResolvedValue(mockTags);

      const response = await request(app).get('/tags');
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(mockTags);
    });
    it('should handle errors from the server', async () => {
      (tagService.getTags as jest.Mock).mockRejectedValue(new Error());

      const response = await request(app).get('/tags');
      expect(response.status).toBe(500);
    });
  });
  describe('GET /tags/pageId', () => {
    it('should get all tags by pageId', async () => {
      (tagService.getTagsForPage as jest.Mock).mockResolvedValue(mockTags[1]);

      const response = await request(app).get('/tags/1');
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(mockTags[1]);
    });
    it('should handle a NaN input as pageId', async () => {
      (tagService.getTagsForPage as jest.Mock).mockResolvedValue(new Error('invalid page_id'));

      const response = await request(app).get('/tags/udefinert');
      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({ error: 'Invalid page ID' });
    });
    it('should handle errors from the server', async () => {
      (tagService.getTagsForPage as jest.Mock).mockRejectedValue(new Error());

      const response = await request(app).get('/tags/1');
      expect(response.status).toBe(500);
    });
  });
  describe('POST /tags/pageId/tagId', () => {
    it('should add a tag to a page', async () => {
      (tagService.addTagToPage as jest.Mock).mockResolvedValue({ message: 'Tag added to page' });

      const response = await request(app).post('/tags/1/1').send({ pageId: 1, tagId: 1 });
      expect(response.status).toBe(201);
      expect(response.body).toStrictEqual({ message: 'Tag added to page' });
    });
    it('should send error if pageid is NaN', async () => {
      (tagService.addTagToPage as jest.Mock).mockResolvedValue(
        new Error('Invalid page ID or tag ID'),
      );

      const response = await request(app)
        .post('/tags/undefined/1')
        .send({ pageId: 'undefined', tagId: 1 });
      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({ error: 'Invalid page ID or tag ID' });
    });
    it('should send error if pageid is NaN', async () => {
      (tagService.addTagToPage as jest.Mock).mockResolvedValue(
        new Error('Invalid page ID or tag ID'),
      );

      const response = await request(app)
        .post('/tags/1/undefined')
        .send({ pageId: 1, tagId: 'undefined' });
      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({ error: 'Invalid page ID or tag ID' });
    });
    it('should handle errors from the server', async () => {
      (tagService.addTagToPage as jest.Mock).mockRejectedValue(new Error());

      const response = await request(app).post('/tags/1/1').send({ pageId: 1, tagId: 1 });
      expect(response.status).toBe(500);
    });
  });
  describe('DELETE /tag/pageId/tagId', () => {
    it('should remove a tag from a page', async () => {
      (tagService.removeTagFromPage as jest.Mock).mockResolvedValue({
        message: 'Tag removed from page',
      });

      const response = await request(app).delete('/tags/1/1');
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({
        message: 'Tag removed from page',
      });
    });
    it('should return 400 if page id is NaN', async () => {
      (tagService.removeTagFromPage as jest.Mock).mockResolvedValue(
        new Error('Invalid page ID or tag ID'),
      );

      const response = await request(app).delete('/tags/undefined/1');
      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({ error: 'Invalid page ID or tag ID' });
    });
    it('should return 400 if tag id is NaN', async () => {
      (tagService.removeTagFromPage as jest.Mock).mockResolvedValue(
        new Error('Invalid page ID or tag ID'),
      );

      const response = await request(app).delete('/tags/1/undefined');
      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({ error: 'Invalid page ID or tag ID' });
    });
    it('should handle errors from the server', async () => {
      (tagService.removeTagFromPage as jest.Mock).mockRejectedValue(new Error());

      const response = await request(app).delete('/tags/1/1').send({ pageId: 1, tagId: 1 });
      expect(response.status).toBe(500);
    });
  });
  describe('POST /tags', () => {
    it('should add a new tag', async () => {
      (tagService.addTag as jest.Mock).mockResolvedValue(mockTags[0]);

      const response = await request(app).post('/tags').send(mockTags[0]);
      expect(response.status).toBe(201);
      expect(response.body).toStrictEqual({
        tag_id: { tag_id: 1, tag_name: 'TagOne' },
        tag_name: 'TagOne',
      });
    });
    it('should handle errors from the server', async () => {
      (tagService.addTag as jest.Mock).mockRejectedValue(new Error());

      const response = await request(app).post('/tags').send(mockTags[0]);
      expect(response.status).toBe(500);
    });
  });
  describe('DELETE /tags/tagId', () => {
    it('should delete a tag by tagId', async () => {
      (tagService.removeTag as jest.Mock).mockResolvedValue({ message: 'Tag removed' });

      const response = await request(app).delete('/tags/1');
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({ message: 'Tag removed' });
    });
    it('should return 400 when tag id is NaN', async () => {
      (tagService.removeTag as jest.Mock).mockResolvedValue(new Error('Invalid tag ID'));

      const response = await request(app).delete('/tags/undefined');
      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({ error: 'Invalid tag ID' });
    });
    it('should handle errors from the server', async () => {
      (tagService.removeTag as jest.Mock).mockRejectedValue(new Error());

      const response = await request(app).delete('/tags/1');
      expect(response.status).toBe(500);
    });
  });
  describe('GET /tags/tagId/pages', () => {
    it('should return the amount of pages with this tag', async () => {
      (tagService.checkTag as jest.Mock).mockResolvedValue(1);

      const response = await request(app).get('/tags/1/pages');
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({ pages: 1 });
    });
    it('should return 400 if tag Id is Nan', async () => {
      (tagService.checkTag as jest.Mock).mockResolvedValue(new Error('Invalid tag ID'));

      const response = await request(app).get('/tags/enrandomString/pages');
      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({ error: 'Invalid tag ID' });
    });
    it('should handle errors from the server', async () => {
      (tagService.checkTag as jest.Mock).mockRejectedValue(new Error());

      const response = await request(app).get('/tags/1/pages');
      expect(response.status).toBe(500);
    });
  });
});

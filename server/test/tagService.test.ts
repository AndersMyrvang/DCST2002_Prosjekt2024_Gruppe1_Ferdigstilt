import tagService from '../src/services/tag-service';
import { pool } from '../src/mysql-pool';
import request from 'supertest';
import express from 'express';
import router from '../src/routes/tag-router';
import { ResultSetHeader } from 'mysql2';
import { useCallback } from 'react';

jest.mock('../src/mysql-pool', () => ({
  pool: {
    query: jest.fn(),
    getConnection: jest.fn(),
  },
}));

const app = express();
app.use(express.json());
app.use(router);

const mockTags = [
  { tag_id: 1, tag_name: 'TagOne' },
  { tag_id: 2, tag_name: 'TagTwo' },
  { tag_id: 3, tag_name: 'TagThree' },
];

describe('Testing tagService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('getTags', () => {
    it('should list all tags', async () => {
      (pool.query as jest.Mock).mockImplementation((query, callback) => {
        callback(null, mockTags);
      });

      const tags = await tagService.getTags();
      expect(tags).toStrictEqual(mockTags);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), expect.any(Function));
    });
    it('should handle internal server errors', async () => {
      (pool.query as jest.Mock).mockImplementation((query, callback) => {
        callback(new Error('server error'), null);
      });

      await expect(tagService.getTags()).rejects.toThrow('server error');
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), expect.any(Function));
    });
  });
  describe('getTagsForPage', () => {
    it('should get tag by page_id', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => {
        callback(null, [mockTags[0]]);
      });

      const tag = await tagService.getTagsForPage(1);
      expect(tag).toStrictEqual([mockTags[0]]);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1], expect.any(Function));
    });
    it('should handle internal server errors', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => {
        callback(new Error('server error'), null);
      });
      await expect(tagService.getTagsForPage(2)).rejects.toThrow('server error');
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [2], expect.any(Function));
    });
  });

  describe('addTagToPage', () => {
    it('should add a tag to a page successfully', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => {
        callback(null);
      });

      await expect(tagService.addTagToPage(1, 2)).resolves.not.toThrow();
      expect(pool.query).toHaveBeenCalledWith(
        `INSERT INTO PageTags (page_id, tag_id) VALUES (?, ?)`,
        [1, 2],
        expect.any(Function),
      );
    });

    it('should handle internal server errors', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => {
        callback(new Error('server error'), null);
      });

      await expect(tagService.addTagToPage(2, 3)).rejects.toThrow('server error');
      expect(pool.query).toHaveBeenCalledWith(
        `INSERT INTO PageTags (page_id, tag_id) VALUES (?, ?)`,
        [2, 3],
        expect.any(Function),
      );
    });
  });
  describe('removeTagFromPage', () => {
    it('should remove a tag from a page successfully', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => {
        callback(null);
      });

      await expect(tagService.removeTagFromPage(1, 2)).resolves.not.toThrow();

      expect(pool.query).toHaveBeenCalledWith(
        `DELETE FROM PageTags WHERE page_id = ? AND tag_id = ?`,
        [1, 2],
        expect.any(Function),
      );
    });

    it('should handle internal server errors', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => {
        callback(new Error('server error'), null);
      });

      await expect(tagService.removeTagFromPage(3, 4)).rejects.toThrow('server error');

      expect(pool.query).toHaveBeenCalledWith(
        `DELETE FROM PageTags WHERE page_id = ? AND tag_id = ?`,
        [3, 4],
        expect.any(Function),
      );
    });
  });
  describe('addTag', () => {
    it('should add a new tag and return the tag ID', async () => {
      const mockInsertId = { insertId: 1 };
      (pool.query as jest.Mock).mockImplementationOnce((query, params, callback) =>
        callback(null, mockInsertId),
      );

      const addTag = await tagService.addTag(mockTags[0]);
      expect(addTag).toStrictEqual(mockInsertId.insertId);

      expect(pool.query).toHaveBeenCalledWith(
        `INSERT INTO Tags (tag_name) VALUES (?)`,
        ['TagOne'],
        expect.any(Function),
      );
    });

    it('should handle internal server errors', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => {
        callback(new Error('server error'), null);
      });
      await expect(tagService.addTag(mockTags[0])).rejects.toThrow('server error');
    });
  });



  describe('removeTag', () => {
    it('should remove a tag successfully', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => {
        callback(null);
      });

      await expect(tagService.removeTag(1)).resolves.not.toThrow();

      expect(pool.query).toHaveBeenCalledWith(
        `DELETE FROM Tags WHERE tag_id = ?`,
        [1],
        expect.any(Function),
      );
    });

    it('should handle internal server errors', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => {
        callback(new Error('server error'), null);
      });

      await expect(tagService.removeTag(2)).rejects.toThrow('server error');

      expect(pool.query).toHaveBeenCalledWith(
        `DELETE FROM Tags WHERE tag_id = ?`,
        [2],
        expect.any(Function),
      );
    });
  });
  describe('checkTag', () => {
    it('should return the correct count of pages linked to a tag', async () => {
      const mockResults = [{ Pages: 5 }];
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => {
        callback(null, mockResults);
      });

      const pageCount = await tagService.checkTag(1);
      expect(pageCount).toBe(5);

      expect(pool.query).toHaveBeenCalledWith(
        `SELECT COUNT(*) AS Pages
         FROM PageTags
         WHERE tag_id = ?`,
        [1],
        expect.any(Function),
      );
    });

    it('should handle internal server errors', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => {
        callback(new Error('server error'), null);
      });

      await expect(tagService.checkTag(2)).rejects.toThrow('server error');

      expect(pool.query).toHaveBeenCalledWith(
        `SELECT COUNT(*) AS Pages
         FROM PageTags
         WHERE tag_id = ?`,
        [2],
        expect.any(Function),
      );
    });
  });
});

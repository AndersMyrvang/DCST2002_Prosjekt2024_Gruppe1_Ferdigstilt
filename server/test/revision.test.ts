import request from 'supertest';
import express from 'express';
import revisionService from '../src/services/revision-service';
import revisionRouter from '../src/routes/revision-router';
import { pool } from '../src/mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

jest.mock('../src/mysql-pool', () => ({
  pool: {
    query: jest.fn(),
  },
}));

const app = express();
app.use(express.json());
app.use(revisionRouter);

describe('RevisionService and Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('RevisionService', () => {
    it('should fetch revisions by page_id', async () => {
      const mockRevisions = [
        { id: 1, page_id: 1, content: 'Revision content', revised_by: 1, revised_at: '2024-11-01', username: 'user1' },
      ];
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => callback(null, mockRevisions));

      const revisions = await revisionService.getRevisions(1);
      expect(revisions).toEqual(mockRevisions);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1], expect.any(Function));
    });

    it('should handle error when fetching revisions by page_id', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => callback(new Error('Database error'), null));

      await expect(revisionService.getRevisions(1)).rejects.toThrow('Database error');
    });

    it('should create a new revision', async () => {
      const mockInsertResult = { insertId: 1 } as ResultSetHeader;
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => callback(null, mockInsertResult));

      const revisionId = await revisionService.createRevision(1, 'New revision content', 1);
      expect(revisionId).toBe(1);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1, 'New revision content', 1], expect.any(Function));
    });

    it('should handle error when creating a revision', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => callback(new Error('Insert error'), null));

      await expect(revisionService.createRevision(1, 'New revision content', 1)).rejects.toThrow('Insert error');
    });
  });

  describe('Revision Routes', () => {
    it('should fetch revisions by page_id through GET /revisions/:page_id', async () => {
      const mockRevisions = [
        { id: 1, page_id: 1, content: 'Revision content', revised_by: 1, revised_at: '2024-11-01', username: 'user1' },
      ];
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => callback(null, mockRevisions));

      const response = await request(app).get('/revisions/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRevisions);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1], expect.any(Function));
    });

    it('should handle error in GET /revisions/:page_id route', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => callback(new Error('Database error'), null));

      const response = await request(app).get('/revisions/1');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({});
    });

    it('should create a revision through POST /revisions/create', async () => {
      const mockInsertResult = { insertId: 1 } as ResultSetHeader;
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => callback(null, mockInsertResult));

      const response = await request(app)
        .post('/revisions/create')
        .send({ page_id: 1, content: 'New revision content', revised_by: 1 });
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ revision_id: 1 });
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1, 'New revision content', 1], expect.any(Function));
    });

    it('should handle error in POST /revisions/create route', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => callback(new Error('Insert error'), null));

      const response = await request(app)
        .post('/revisions/create')
        .send({ page_id: 1, content: 'New revision content', revised_by: 1 });
      expect(response.status).toBe(500);
      expect(response.body).toEqual({});
    });
  });
});

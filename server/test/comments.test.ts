import request from 'supertest';
import express from 'express';
import { pool } from '../src/mysql-pool'; 
import commentService from '../src/services/comment-service';
import userService from '../src/services/user-service';
import commentRouter from '../src/routes/comment-router';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

jest.mock('../src/mysql-pool', () => ({
  pool: {
    query: jest.fn(),
  },
}));

jest.mock('../src/services/user-service', () => ({
  ...jest.requireActual('../src/services/user-service'),
  getUserById: jest.fn(),
}));

let server: any;

beforeAll((done) => {
  server = app.listen(done);
});

afterAll((done) => {
  server.close(done);
});

const app = express();
app.use(express.json());
app.use(commentRouter);

describe('CommentService and Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('CommentService', () => {
    it('should fetch comments by page_id', async () => {
      const mockComments = [
        {
          comment_id: 1,
          user_id: 1,
          content: 'Comment 1',
          created_at: new Date(''),
          updated_at: new Date(''),
          page_id: 1,
          likes: 0,
          username: 'user1',
          profile_image_url: '',
        },
      ];
      (pool.query as jest.Mock).mockImplementation((query, params, callback) =>
        callback(null, mockComments),
      );

      const comments = await commentService.listComments(1);
      expect(comments).toEqual(mockComments);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1], expect.any(Function));
    });

    it('should handle error when fetching comments by page_id', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) =>
        callback(new Error('Database error'), null),
      );

      await expect(commentService.listComments(1)).rejects.toThrow('Database error');
    });

    it('should create a new comment', async () => {
      const mockInsertResult = { insertId: 1 } as ResultSetHeader;
      (pool.query as jest.Mock)
        .mockImplementationOnce((query, params, callback) => callback(null, mockInsertResult)) 
        .mockImplementationOnce((query, params, callback) =>
          callback(null, [{ username: 'user1', profile_image_url: '' }]),
        ); 

      const newComment = await commentService.newComment(1, 'New comment content', 1);
      expect(newComment).toMatchObject({
        comment_id: 1,
        content: 'New comment content',
        user_id: 1,
      });
      expect(pool.query).toHaveBeenCalledTimes(2); 
    });

    it('should handle error when creating a comment', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) =>
        callback(new Error('Insert error'), null),
      );

      await expect(commentService.newComment(1, 'New comment content', 1)).rejects.toThrow(
        'Insert error',
      );
    });

    it('should delete a comment', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => callback(null));

      await expect(commentService.deleteComment(1)).resolves.not.toThrow();
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1], expect.any(Function));
    });

    it('should update a comment', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => callback(null));

      await expect(commentService.updateComment(1, 'Updated content')).resolves.not.toThrow();
      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        ['Updated content', 1],
        expect.any(Function),
      );
    });
  });

  describe('Comment Routes', () => {
    it('should fetch comments by page_id through GET /comment/:page_id', async () => {
      const mockComments = [
        {
          comment_id: 1,
          user_id: 1,
          content: 'Test comment',
          created_at: new Date(),
          updated_at: new Date(),
          page_id: 1,
          likes: 0,
          username: 'user1',
          profile_image_url: '',
        },
      ];
      (pool.query as jest.Mock).mockImplementation((query, params, callback) =>
        callback(null, mockComments),
      );

      const response = await request(app).get('/comment/1');
      expect(response.status).toBe(200);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1], expect.any(Function));
    });

    it('should handle error in GET /comment/:page_id route', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) =>
        callback(new Error('Database error'), null),
      );

      const response = await request(app).get('/comment/1');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({});
    });

    it('should create a comment through POST /comment/:page_id/new', async () => {
      const mockInsertResult = { insertId: 1 } as ResultSetHeader;
      (pool.query as jest.Mock)
        .mockImplementationOnce((query, params, callback) => callback(null, mockInsertResult))
        .mockImplementationOnce((query, params, callback) =>
          callback(null, [{ username: 'user1', profile_image_url: '' }]),
        ); 

      const response = await request(app)
        .post('/comment/1/new')
        .send({ user_id: 1, content: 'New comment content', page_id: 1 });
      expect(response.status).toBe(200);
      expect(response.body.comment).toMatchObject({
        comment_id: 1,
        content: 'New comment content',
      });
      expect(pool.query).toHaveBeenCalledTimes(2); 
    });

    it('should handle error in POST /comment/:page_id/new route', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) =>
        callback(new Error('Insert error'), null),
      );

      const response = await request(app)
        .post('/comment/1/new')
        .send({ user_id: 1, content: 'New comment content', page_id: 1 });
      expect(response.status).toBe(500);
      expect(response.body).toEqual({});
    });

    it('should find user from user_id GET /user/:user_id', async () => {
      const MockedUser = { username: 'User1', id: 1 };
      (userService.getUserById as jest.Mock).mockResolvedValue(MockedUser);

      const response = await request(app).get('/user/1');

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(MockedUser);
    });

    it('should delete a comment through DELETE /comment/:comment_id', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => callback(null));

      const response = await request(app).delete('/comment/1');
      expect(response.status).toBe(200);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1], expect.any(Function));
    });

    it('should update a comment through PUT /comment/:comment_id/update', async () => {
      (pool.query as jest.Mock).mockImplementation((query, params, callback) => callback(null));

      const response = await request(app)
        .put('/comment/1/update')
        .send({ content: 'Updated comment content' });
      expect(response.status).toBe(201);
      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        ['Updated comment content', 1],
        expect.any(Function),
      );
    });
  });
});

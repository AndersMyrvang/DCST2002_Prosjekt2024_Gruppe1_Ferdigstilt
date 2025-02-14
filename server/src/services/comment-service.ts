import { pool } from '../mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { Comment, User } from '../../../client/src/types';

export class CommentService {
  //Lister kommentarer per side
  listComments(page_id: number) {
    return new Promise<Comment[]>((resolve, reject) => {
      pool.query(
        'SELECT c.* ,u.username, u.profile_image_url FROM Pages p JOIN Comments c ON p.page_id = c.page_id JOIN Users u ON c.user_id = u.user_id WHERE c.page_id=? ORDER BY c.created_at ASC LIMIT 100',
        [page_id],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          const comments = results.map((comment) => ({
            comment_id: comment.comment_id,
            user_id: comment.user_id,
            content: comment.content,
            created_at: comment.created_at,
            updated_at: comment.updated_at,
            page_id: comment.page_id,
            likes: comment.likes,
            username: comment.username,
            profile_image_url: comment.profile_image_url,
          }));

          resolve(comments);
        },
      );
    });
  }

  //Lag ny kommentar
  newComment(user_id: number, content: string, page_id: number) {
    return new Promise<Comment>((resolve, reject) => {
      pool.query(
        'INSERT INTO Comments (user_id, content, page_id) VALUES (?,?,?)',
        [user_id, content, page_id],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);

          pool.query(
            'SELECT username, profile_image_url FROM Users WHERE user_id = ?',
            [user_id],
            (error, userResults: RowDataPacket[]) => {
              if (error) return reject(error);

              if (userResults.length > 0) {
                const user = userResults[0];

                const newComment: Comment = {
                  comment_id: results.insertId,
                  user_id: user_id,
                  content: content,
                  created_at: new Date(),
                  updated_at: new Date(),
                  page_id: page_id,
                  likes: 0,
                  username: user.username,
                  profile_image_url: user.profile_image_url,
                };

                resolve(newComment);
              }
            },
          );
        },
      );
    });
  }

  //Slett kommentar
  deleteComment(comment_id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query('DELETE FROM Comments WHERE comment_id=?', [comment_id], (error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }

  //Oppdater kommentar
  updateComment(comment_id: number, content: string) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'UPDATE Comments SET content=? WHERE comment_id=?',
        [content, comment_id],
        (error) => {
          if (error) return reject(error);
          resolve();
        },
      );
    });
  }
}

const commentService = new CommentService();
export default commentService;

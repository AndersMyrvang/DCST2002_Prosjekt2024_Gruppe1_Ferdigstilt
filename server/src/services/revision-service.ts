import { pool } from '../mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { Revisions } from '../../../client/src/types';

class RevisionService {
  //Hent alle revisjoner for gitt side
  getRevisions(page_id: number) {
    return new Promise<Revisions[]>((resolve, reject) => {
      pool.query(
        'SELECT r.*,u.username FROM Revisions r JOIN Users u ON r.revised_by = u.user_id WHERE r.page_id=? ORDER BY r.revised_at DESC LIMIT 10',
        [page_id],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results as Revisions[]);
        },
      );
    });
  }

  //Lage ny revisjon
  createRevision(page_id: number, content: string, revised_by: number) {
    return new Promise<number>((resolve, reject) => {
      pool.query(
        'INSERT INTO Revisions (page_id, content, revised_by) VALUES (?, ?, ?)',
        [page_id, content, revised_by],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);

          resolve(results.insertId);
        },
      );
    });
  }
}

const revisionService = new RevisionService();
export default revisionService;

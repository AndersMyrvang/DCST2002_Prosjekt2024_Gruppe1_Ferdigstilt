// server/src/services/search-service.ts

import { pool } from '../mysql-pool';
import type { RowDataPacket } from 'mysql2';
import { Suggestion } from '../../../client/src/types';


class SearchService {
  searchMultipleTables(query: string): Promise<Suggestion[]> {
    return new Promise<Suggestion[]>((resolve, reject) => {
      const searchQuery = `
        SELECT 'Player' AS type, id, name FROM Players WHERE name LIKE ?
        UNION
        SELECT 'Team' AS type, id, name FROM Teams WHERE name LIKE ?
        UNION
        SELECT 'League' AS type, id, name FROM Leagues WHERE name LIKE ?
        LIMIT 20;
      `;

      const wildcardQuery = `%${query}%`;

      pool.query(
        searchQuery,
        [wildcardQuery, wildcardQuery, wildcardQuery],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results as Suggestion[]);
        },
      );
    });
  }
}

const searchService = new SearchService();
export default searchService;

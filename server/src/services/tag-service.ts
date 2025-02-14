import { pool } from '../mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { Tag } from '../../../client/src/types';

class TagService {
  //Henter alle tags
  getTags() {
    return new Promise<Tag[]>((resolve, reject) => {
      pool.query('SELECT * FROM Tags', (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        const tags = results.map((tag) => ({
          tag_id: tag.tag_id,
          tag_name: tag.tag_name,
        }));

        resolve(tags);
      });
    });
  }

  // Hent tagger for en spesifikk side
  getTagsForPage(pageId: number) {
    return new Promise<Tag[]>((resolve, reject) => {
      pool.query(
        `SELECT t.tag_id, t.tag_name
         FROM Tags t
         JOIN PageTags pt ON t.tag_id = pt.tag_id
         WHERE pt.page_id = ?`,
        [pageId],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          const tags = results.map((tag) => ({
            tag_id: tag.tag_id,
            tag_name: tag.tag_name,
          }));

          resolve(tags);
        },
      );
    });
  }

  // Legg til en tagg på en side
  addTagToPage(pageId: number, tagId: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        `INSERT INTO PageTags (page_id, tag_id) VALUES (?, ?)`,
        [pageId, tagId],
        (error) => {
          if (error) return reject(error);
          resolve();
        },
      );
    });
  }

  // Fjern en tagg fra en side
  removeTagFromPage(pageId: number, tagId: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        `DELETE FROM PageTags WHERE page_id = ? AND tag_id = ?`,
        [pageId, tagId],
        (error) => {
          if (error) return reject(error);
          resolve();
        },
      );
    });
  }

  // Legg til en ny tagg
  addTag(tag: Tag) {
    return new Promise<number>((resolve, reject) => {
      pool.query(
        `INSERT INTO Tags (tag_name) VALUES (?)`,
        [tag.tag_name],
        (error, result: ResultSetHeader) => {
          if (error) return reject(error);
          resolve(result.insertId);
        },
      );
    });
  }

  // Fjern en tagg
  removeTag(tagId: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(`DELETE FROM Tags WHERE tag_id = ?`, [tagId], (error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }

  // Sjekk hvor mange pages en tag er knyttet til
  checkTag(tagId: number) {
    return new Promise<number>((resolve, reject) => {
      pool.query(
        `SELECT COUNT(*) AS Pages
         FROM PageTags
         WHERE tag_id = ?`,
        [tagId],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results[0].Pages);
        },
      );
    });
  }
}

const tagService = new TagService();
export default tagService;

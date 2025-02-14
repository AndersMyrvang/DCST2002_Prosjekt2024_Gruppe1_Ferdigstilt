import { pool } from '../mysql-pool';
import { RowDataPacket } from 'mysql2';
import { User } from '../../../client/src/types';

class UserService {
  // Funksjon for å finne eller opprette en bruker basert på google_id første gang
  findOrCreateUserByGoogleId(googleId: string, user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT user_id FROM Users WHERE google_id = ?',
        [googleId],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          if (results.length > 0) {
            const userId = results[0].user_id;
            pool.query(
              'UPDATE Users SET last_login = ? WHERE user_id = ?',
              [new Date(), userId],
              (updateError) => {
                if (updateError) return reject(updateError);
                resolve({ ...user, user_id: userId });
              },
            );
          } else {
            pool.query(
              'INSERT INTO Users (google_id, username, email, profile_image_url, created_at, first_login, last_login, is_admin) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
              [
                googleId,
                user.username,
                user.email,
                user.profile_image_url,
                new Date(),
                new Date(),
                new Date(),
                user.is_admin,
              ],
              (insertError, insertResults) => {
                if (insertError) return reject(insertError);
                const userId = (insertResults as any).insertId;
                resolve({ ...user, user_id: userId });
              },
            );
          }
        },
      );
    });
  }

  // Funksjon for å hente brukerdata basert på user_id
  getUserById(userId: number): Promise<User | null> {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT * FROM Users WHERE user_id = ?',
        [userId],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          if (results.length > 0) {
            const user = results[0] as any;
            resolve({
              user_id: user.user_id,
              google_id: user.google_id,
              username: user.username,
              email: user.email,
              profile_image_url: user.profile_image_url,
              first_login: new Date(user.first_login),
              last_login: new Date(user.last_login),
              last_logout: user.last_logout ? new Date(user.last_logout) : null,
              is_admin: Boolean(user.is_admin),
            });
          } else {
            resolve(null);
          }
        },
      );
    });
  }

  // Funksjon for å hente alle brukere med admin-status som boolean
  getAllUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT user_id, username, email, first_login, last_login, last_logout, is_admin FROM Users',
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          const users = results.map((user: any) => ({
            user_id: user.user_id,
            google_id: user.google_id,
            username: user.username,
            email: user.email,
            first_login: new Date(user.first_login),
            last_login: new Date(user.last_login),
            last_logout: user.last_logout ? new Date(user.last_logout) : null,
            is_admin: Boolean(user.is_admin),
          }));

          resolve(users);
        },
      );
    });
  }

  // Funksjon for å oppdatere admin-status for en spesifikk bruker
  updateAdminStatus(userId: number, isAdmin: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE Users SET is_admin = ? WHERE user_id = ?',
        [isAdmin ? 1 : 0, userId],
        (error) => {
          if (error) return reject(error);
          resolve();
        },
      );
    });
  }

  // Funksjon for å oppdatere last_logout for en bruker
  updateLastLogout(userId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const logoutTime = new Date();
      pool.query(
        'UPDATE Users SET last_logout = ? WHERE user_id = ?',
        [logoutTime, userId],
        (error) => {
          if (error) {
            console.error('Database oppdatering feilet:', error);
            return reject(error);
          }
          resolve();
        },
      );
    });
  }

  //Øker viewCount basert på besøk på siden
  incrementViewCount(page_id: number) {
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE Pages SET view_count = view_count + 1 WHERE page_id = ?',
        [page_id],
        (error) => {
          if (error) return reject(error);
          resolve(null);
        },
      );
    });
  }

  // Henter sidehistorikk basert på pageId
  getUsernameByPageId(page_id: number) {
    return new Promise<{
      username: string;
      page_id: number;
      created_at: Date;
      view_count: number;
    } | null>((resolve, reject) => {
      pool.query(
        'SELECT u.username, pa.page_id, pa.created_at, pa.view_count FROM Pages pa JOIN Users u ON pa.created_by = u.user_id WHERE pa.page_id = ?',
        [page_id],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          if (results.length > 0) {
            resolve({
              username: results[0].username,
              page_id: results[0].page_id,
              created_at: results[0].created_at,
              view_count: results[0].view_count,
            });
          } else {
            resolve(null);
          }
        },
      );
    });
  }

  //Henter brukernavn og dato for siste revisjon
  getRevisedName(page_id: number) {
    return new Promise<{ revised_by: string; revised_at: Date; page_id: number } | null>(
      (resolve, reject) => {
        pool.query(
          'SELECT r.revised_at, u.username FROM Revisions r JOIN Users u ON r.revised_by = u.user_id WHERE r.page_id=? ORDER BY revised_at DESC LIMIT 1',
          [page_id],
          (error, results: RowDataPacket[]) => {
            if (error) return reject(error);

            if (results.length > 0) {
              resolve({
                revised_by: results[0].username,
                revised_at: results[0].revised_at,
                page_id: results[0].page_id,
              });
            } else {
              resolve(null);
            }
          },
        );
      },
    );
  }
}

const userService = new UserService();
export default userService;

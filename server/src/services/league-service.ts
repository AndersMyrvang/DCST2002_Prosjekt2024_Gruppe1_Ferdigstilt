import { pool } from '../mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { League } from '../../../client/src/types';

class LeagueService {
  //Hent league baser på ID
  getLeague(id: number) {
    return new Promise<League | undefined>((resolve, reject) => {
      pool.query(
        `SELECT l.*, c.name AS country_name 
       FROM Leagues l 
       JOIN Countries c ON l.country = c.country_id 
       WHERE l.id = ?`,
        [id],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          if (results.length > 0) {
            const league: League = {
              id: results[0].id,
              name: results[0].name,
              country_id: results[0].country,
              country_name: results[0].country_name,
              emblem_image_url: results[0].emblem_image_url,
              page_id: results[0].page_id,
              content: results[0].content,
            };
            resolve(league);
          } else {
            resolve(undefined);
          }
        },
      );
    });
  }

  //Hent et utvalg av leagues(brukes på forsiden)
  listSetAmountOfLeagues(amount: number) {
    return new Promise<League[]>((resolve, reject) => {
      pool.query(
        `SELECT l.*, c.name AS country_name 
         FROM Leagues l 
         JOIN Countries c ON l.country = c.country_id
         ORDER BY l.name ASC 
         LIMIT ?`,
        [amount],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          const leagues = results.map((league) => ({
            id: league.id,
            name: league.name,
            country_id: league.country,
            country_name: league.country_name,
            emblem_image_url: league.emblem_image_url,
            page_id: league.page_id,
            content: league.content,
          }));

          resolve(leagues);
        },
      );
    });
  }

  //Hent alle leagues
  listAllLeagues() {
    return new Promise<League[]>((resolve, reject) => {
      pool.query(
        `SELECT l.*, c.name AS country_name 
         FROM Leagues l 
         JOIN Countries c ON l.country = c.country_id
         ORDER BY l.name ASC 
         LIMIT 100`,
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          const leagues = results.map((league) => ({
            id: league.id,
            name: league.name,
            country_id: league.country,
            country_name: league.country_name,
            emblem_image_url: league.emblem_image_url,
            page_id: league.page_id,
            content: league.content,
          }));

          resolve(leagues);
        },
      );
    });
  }

  //Oppdater league
  updateLeague(
    id: number,
    name: string,
    country: number,
    emblem_image_url: string,
    page_id: number,
    content: string,
  ) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'UPDATE Leagues SET name = ?, country = ?, emblem_image_url = ?, page_id = ?, content = ? WHERE id = ?',
        [name, country, emblem_image_url, page_id, content, id],
        (error) => {
          if (error) return reject(error);
          resolve();
        },
      );
    });
  }

  //Legg til league
  addLeague(
    name: string,
    country: number,
    emblem_image_url: string,
    content: string,
    user_id: number,
  ) {
    return new Promise<number>((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) return reject(new Error('Database connection error'));

        connection.beginTransaction((err) => {
          if (err) {
            connection.release();
            return reject(new Error('Transaction start error'));
          }

          connection.query(
            'INSERT INTO Pages (created_by, created_at) VALUES (?, NOW())',
            [user_id],
            (error, results) => {
              if (error) {
                return connection.rollback(() => {
                  connection.release();
                  reject(new Error('Page creation error. Database is probably bad'));
                });
              }

              const page_id = (results as any).insertId;

              connection.query(
                'INSERT INTO Leagues (name, country, emblem_image_url, content, page_id) VALUES (?, ?, ?, ?, ?)',
                [name, country, emblem_image_url, content, page_id],
                (error, results) => {
                  if (error) {
                    return connection.rollback(() => {
                      connection.release();
                      reject(new Error('League creation error'));
                    });
                  }

                  connection.commit((err) => {
                    connection.release();
                    if (err) {
                      return connection.rollback(() =>
                        reject(new Error('Transaction commit error')),
                      );
                    }
                    resolve((results as ResultSetHeader).insertId);
                  });
                },
              );
            },
          );
        });
      });
    });
  }

  //Slett league
  deleteLeague(page_id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query('DELETE FROM Pages WHERE page_id = ?', [page_id], (error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }

  //Hent league basert på team
  getLeagueByTeamId(id: number) {
    return new Promise<{ name: string; id: number } | null>((resolve, reject) => {
      pool.query(
        'SELECT Leagues.name, Leagues.id FROM `Leagues` JOIN Teams ON Leagues.id = Teams.league WHERE Teams.id = ?',
        [id],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);
          if (results && results.length > 0) {
            resolve({ name: results[0].name, id: results[0].id });
          } else {
            resolve(null);
          }
        },
      );
    });
  }

  //Hent alle lag i en league
  listAllTeamsInLeague(league_id: number) {
    return new Promise<{ name: string; id: number }[]>((resolve, reject) => {
      pool.query(
        'SELECT * FROM Leagues l JOIN Teams t ON t.league = l.id WHERE l.id=?',
        [league_id],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);
          const teams = results.map((team) => ({
            name: team.name,
            id: team.id,
          }));
          resolve(teams);
        },
      );
    });
  }
}

const leagueService = new LeagueService();
export default leagueService;

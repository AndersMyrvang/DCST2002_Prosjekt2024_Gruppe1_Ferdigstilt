import { pool } from '../mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { Player, Country, Team } from '../../../client/src/types';

class PlayerService {
  //Hent spiller basert på id
  getPlayer(id: number) {
    return new Promise<Player | undefined>((resolve, reject) => {
      pool.query(
        `SELECT p.*, c.name AS country_name, t.name AS team_name, l.id AS league_id, l.name AS  league_name 
         FROM Players p 
         LEFT JOIN Countries c ON p.country = c.country_id 
         LEFT JOIN Teams t ON p.team = t.id
         LEFT JOIN Leagues l ON t.league = l.id
         WHERE p.id = ?`,
        [id],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);
          if (results.length > 0) {
            const player = results[0];
            resolve({
              id: player.id,
              name: player.name,
              birth_date: player.birth_date,
              height: player.height,
              picture_url: player.picture_url,
              country_name: player.country_name,
              country_id: player.country_id,
              team_id: player.team,
              team_name: player.team_name,
              page_id: player.page_id,
              content: player.content,
              league_id: player.league_id,
              league_name: player.league_name,
            });
          } else {
            resolve(undefined);
          }
        },
      );
    });
  }

  //Hent et utvalg av spillere (brukes på forsiden)
  listSetAmountOfPlayers(limit: number) {
    return new Promise<Player[]>((resolve, reject) => {
      pool.query(
        `SELECT p.*, c.name AS country_name, t.name AS team_name, l.id AS league_id, l.name AS league_name 
         FROM Players p 
         LEFT JOIN Countries c ON p.country = c.country_id 
         LEFT JOIN Teams t ON p.team = t.id
         LEFT JOIN Leagues l ON t.league = l.id
         ORDER BY p.name ASC
         LIMIT ?
         `,
        [limit],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          const players = results.map((result) => ({
            id: result.id,
            name: result.name,
            birth_date: result.birth_date,
            height: result.height,
            country_id: result.country_id,
            country_name: result.country_name,
            picture_url: result.picture_url,
            page_id: result.page_id,
            content: result.content,
            team_name: result.team_name,
            team_id: result.team_id,
            league_id: result.league_id,
            league_name: result.league_name,
          }));

          resolve(players);
        },
      );
    });
  }

  //Hent alle spillere
  listAllPlayers() {
    return new Promise<Player[]>((resolve, reject) => {
      pool.query(
        `SELECT p.*, c.name AS country_name, t.name AS team_name, l.id AS league_id, l.name AS league_name 
         FROM Players p 
         LEFT JOIN Countries c ON p.country = c.country_id 
         LEFT JOIN Teams t ON p.team = t.id
         LEFT JOIN Leagues l ON t.league = l.id
         ORDER BY p.name ASC`,
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          const players = results.map((result) => ({
            id: result.id,
            name: result.name,
            birth_date: result.birth_date,
            height: result.height,
            country_name: result.country_name,
            country_id: result.country,
            picture_url: result.picture_url,
            page_id: result.page_id,
            content: result.content,
            team_name: result.team_name,
            team_id: result.team_id,
            league_id: result.league_id,
            league_name: result.league_name,
          }));
          resolve(players);
        },
      );
    });
  }

  // Søkefunksjon kode
  searchPlayers(query: string) {
    return new Promise<Player[]>((resolve, reject) => {
      const searchQuery = `SELECT * FROM Players WHERE name LIKE ?`;
      pool.query(searchQuery, [`%${query}%`], (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results as Player[]);
      });
    });
  }

  //Hent alle land
  getCountries() {
    return new Promise<Country[]>((resolve, reject) => {
      pool.query(
        'SELECT name AS country_name, country_id FROM Countries ORDER BY name ASC',
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);
          resolve(results as Country[]);
        },
      );
    });
  }

  //Hent alle lag
  getTeams() {
    return new Promise<Team[]>((resolve, reject) => {
      pool.query('SELECT * FROM Teams', (error, results: RowDataPacket[]) => {
        if (error) return reject(error);
        resolve(results as Team[]);
      });
    });
  }

  //Oppdater spiller
  updatePlayer(
    id: number,
    name: string,
    birth_date: Date,
    height: number,
    country: number,
    team: number,
    picture_url: string,
    page_id: number,
    content: string,
  ) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'UPDATE Players SET name = ?, birth_date = ?, height = ?, country = ?, team = ?, picture_url = ?, page_id = ?, content = ? WHERE id = ?',
        [name, birth_date, height, country, team, picture_url, page_id, content, id],
        (error) => {
          if (error) return reject(error);
          resolve();
        },
      );
    });
  }

  // Legg til spiller
  addPlayer(
    name: string,
    birth_date: string,
    height: number,
    country: number,
    team: number,
    picture_url: string,
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
                  reject(new Error('Insert error'));
                });
              }

              const page_id = (results as any).insertId;

              connection.query(
                'INSERT INTO Players (name, birth_date, height, country, content, team, picture_url, page_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [name, birth_date, height, country, content, team, picture_url, page_id],
                (error, results) => {
                  if (error) {
                    return connection.rollback(() => {
                      connection.release();
                      reject(new Error('Player creation error'));
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

  //Slett spiller
  deletePlayer(page_id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query('DELETE FROM Pages WHERE page_id = ?', [page_id], (error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }
}

const playerService = new PlayerService();
export default playerService;

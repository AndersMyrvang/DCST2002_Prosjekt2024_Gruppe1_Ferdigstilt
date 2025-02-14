import { pool } from '../mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { Team, League, Player } from '../../../client/src/types';

class TeamService {
  //Hent team basert på id
  getTeam(id: number) {
    return new Promise<Team | undefined>((resolve, reject) => {
      pool.query(
        `SELECT t.*, t.league as league_id, c.name AS country_name, l.name AS league_name 
         FROM Teams t 
         JOIN Countries c ON t.country = c.country_id 
         JOIN Leagues l ON t.league = l.id 
         WHERE t.id = ?`,
        [id],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          if (results.length > 0) {
            const team = results[0];
            resolve({
              id: team.id,
              name: team.name,
              country_id: team.country_id,
              country_name: team.country_name,
              coach: team.coach,
              league_name: team.league_name,
              league_id: team.league_id,
              emblem_image_url: team.emblem_image_url,
              page_id: team.page_id,
              content: team.content,
            });
          } else {
            resolve(undefined);
          }
        },
      );
    });
  }

  //Hent et utvalg av teams (brukes på forsiden)
  listSetAmountOfTeams(amount: number) {
    return new Promise<Team[]>((resolve, reject) => {
      pool.query(
        `SELECT t.*, c.name AS country_name, l.name AS league_name 
         FROM Teams t 
         JOIN Countries c ON t.country = c.country_id 
         JOIN Leagues l ON t.league = l.id
         ORDER BY t.name ASC 
         LIMIT ?`,
        [amount],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          const teams = results.map((team) => ({
            id: team.id,
            name: team.name,
            country_id: team.country,
            country_name: team.country_name,
            coach: team.coach,
            league_name: team.league_name,
            league_id: team.league_id,
            emblem_image_url: team.emblem_image_url,
            page_id: team.page_id,
            content: team.content,
          }));

          resolve(teams);
        },
      );
    });
  }

  //Hent alle teams
  listAllTeams() {
    return new Promise<Team[]>((resolve, reject) => {
      pool.query(
        `SELECT t.*, c.name AS country_name, l.name AS league_name 
         FROM Teams t 
         JOIN Countries c ON t.country = c.country_id 
         JOIN Leagues l ON t.league = l.id
         ORDER BY t.name ASC 
         LIMIT 100`,
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          const teams = results.map((team) => ({
            id: team.id,
            name: team.name,
            country_id: team.country,
            country_name: team.country_name,
            coach: team.coach,
            league_name: team.league_name,
            league_id: team.league_id,
            emblem_image_url: team.emblem_image_url,
            page_id: team.page_id,
            content: team.content,
          }));

          resolve(teams);
        },
      );
    });
  }

  //Hent alle leagues
  getLeagues() {
    return new Promise<League[]>((resolve, reject) => {
      pool.query('SELECT * FROM Leagues ORDER BY name ASC', (error, results: RowDataPacket[]) => {
        if (error) return reject(error);
        resolve(results as League[]);
      });
    });
  }

  //Oppdater lag
  updateTeam(
    id: number,
    name: string,
    country: number,
    coach: string,
    league: number,
    emblem_image_url: string,
    page_id: number,
    content: string,
  ) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'UPDATE Teams SET name = ?, country = ?, coach = ?, league = ?, emblem_image_url = ?, page_id = ?, content = ? WHERE id = ?',
        [name, country, coach, league, emblem_image_url, page_id, content, id],
        (error) => {
          if (error) {
            console.error('Error executing query:', error); 
            return reject(error);
          }
          resolve();
        },
      );
    });
  }

  //Legg til nytt lag
  addTeam(
    name: string,
    country: number,
    coach: string,
    league: number,
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
                'INSERT INTO Teams (name, country, coach, league, emblem_image_url, content, page_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [name, country, coach, league, emblem_image_url, content, page_id],
                (error, results) => {
                  if (error) {
                    return connection.rollback(() => {
                      connection.release();
                      reject(new Error('Team creation error'));
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

  //Slett lag
  deleteTeam(page_id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query('DELETE FROM Pages WHERE page_id = ?', [page_id], (error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }

  //Hent alle spillere basert på teamId
  listAllPlayersByTeam(team_id: number) {
    return new Promise<Player[]>((resolve, reject) => {
      pool.query(
        `SELECT * FROM Players WHERE team=?`,
        [team_id],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          const players = results.map((player) => ({
            id: player.id,
            name: player.name,
            birth_date: player.birth_date,
            height: player.height,
            country_id: player.country_id,
            country_name: player.country_name,
            team_name: player.team_name,
            team_id: player.team_id,
            picture_url: player.picture_url,
            page_id: player.page_id,
            content: player.content,
          }));

          resolve(players);
        },
      );
    });
  }
}

const teamService = new TeamService();
export default teamService;

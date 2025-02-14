import axios from 'axios';
import { League, User, Team } from '../types';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

class LeagueService {
  //Henter spesifik league
  async getLeague(league_id: number): Promise<League> {
    try {
      const response = await axios.get<League>('/league/' + league_id);
      return response.data as League;
    } catch (error) {
      console.error('Error getting league:', error);
      throw error;
    }
  }

  //Henter alle leagues
  async listAllLeagues() {
    try {
      const response = await axios.get<League[]>('/league');
      return response.data;
    } catch (error) {
      console.error('Error listing all leagues:', error);
      throw error;
    }
  }

  //Henter et utvalg av leauges(forside)
  async listSetAmountOfLeagues(amount: number) {
    try {
      const response = await axios.get<League[]>(`/league?amount=${amount}`);
      return response.data;
    } catch (error) {
      console.error('Error listing a set amount of leagues:', error);
      throw error;
    }
  }

  //Lag ny league
  async addLeague(name: string, country: number, emblem_image_url: string, content: string) {
    try {
      const user_id = localStorage.getItem('user_id');

      if (!user_id) {
        throw new Error('User is not logged in');
      }
      if (name == '' || country == 0 || emblem_image_url == '' || content == '') {
        throw new Error('Missing fields');
      }

      const response = await axios.post<{ id: number }>('/league_id/new', {
        name,
        country,
        emblem_image_url,
        content,
        user_id,
      });

      return response.data.id;
    } catch (error) {
      console.error('Error adding league:', error);
      return -1;
    }
  }

  //Oppdater league
  async updateLeague(
    id: number,
    name: string,
    country: number,
    emblem_image_url: string,
    page_id: number,
    content: string,
  ) {
    try {
      await axios.put('/league/' + id, {
        name,
        country,
        emblem_image_url,
        page_id,
        content,
      });
    } catch (error) {
      console.error('Error updating league:', error);
      throw error;
    }
  }

  //slett league
  async deleteLeague(page_id: number) {
    try {
      await axios.delete('/league/' + page_id);
    } catch (error) {
      console.error('Error deleting league:', error);
      throw error;
    }
  }

  //Hent brukernavn på den som opprettet siden
  getCreator(page_id: number) {
    return axios.get<User>('/creator/' + page_id).then((response) => response.data);
  }

  //Hent lagene som er i leagueen
  async getTeamsInLeague(league_id: number) {
    try {
      const response = await axios.get<Team[]>('/team/league/' + league_id);
      return response.data;
    } catch (error) {
      console.error('Error getting teams in league:', error);
      throw error;
    }
  }
}

const leagueService = new LeagueService();
export default leagueService;

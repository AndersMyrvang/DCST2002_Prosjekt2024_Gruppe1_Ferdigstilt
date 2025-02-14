import axios from 'axios';
import { Team, League, Player } from '../types';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

class TeamService {
  //Hent team
  getTeam(id: number) {
    return axios.get<Team>('/team/' + id).then((response) => response.data);
  }

  //Hent leagues
  getLeagues() {
    return axios.get<League[]>('/team/:id/leagues').then((response) => response.data);
  }

  //Opptader team
  async updateTeam(
    id: number,
    name: string,
    country: number,
    coach: string,
    league: number,
    emblem_image_url: string,
    content: string,
    page_id: number,
  ) {
    try {
      await axios.put('/team/' + id, {
        name,
        country,
        coach,
        league,
        emblem_image_url,
        content,
        page_id,
      });
    } catch (error) {
      console.error('Error updating team:', error);
      throw error;
    }
  }

  //Legg til team
  async addTeam(
    name: string,
    country: number,
    coach: string,
    league: number,
    emblem_image_url: string,
    content: string,
  ) {
    try {
      const user_id = localStorage.getItem('user_id');

      if (!user_id) {
        throw new Error('User is not logged in');
      }
      if (
        name == '' ||
        country == 0 ||
        coach == '' ||
        league == 0 ||
        emblem_image_url == '' ||
        content == ''
      ) {
        throw new Error('Missing fields');
      }

      const response = await axios.post<{ id: number }>('/team_id/new', {
        name,
        country,
        coach,
        league,
        emblem_image_url,
        content,
        user_id,
      });

      return response.data.id;
    } catch (error) {
      console.error('Error adding team:', error);
      return -1;
    }
  }

  //Slett team
  async deleteTeam(page_id: number) {
    try {
      await axios.delete('/team/' + page_id);
    } catch (error) {
      console.error('Error deleting team:', error);
      throw error;
    }
  }

  //Vis et utvalg av teams (forsiden)
  listSetAmountOfTeams(amount: number) {
    return axios.get<Team[]>(`/team?amount=${amount}`).then((response) => response.data);
  }

  //Hent alle teams
  listAllTeams() {
    return axios.get<Team[]>('/team').then((response) => response.data);
  }

  //Hent alle spillere på et spesifikt lag
  listAllPlayersOnTeam(team_id: number) {
    return axios.get<Player[]>('/team/' + team_id + '/players').then((response) => response.data);
  }
}

const teamService = new TeamService();
export default teamService;

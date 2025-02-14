import axios from 'axios';
import { Player, Country, Team, User, Page, Revisions } from '../types';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

class PlayerService {
  //Hent spiller
  getPlayer(id: number) {
    return axios.get<Player>('/player_id/' + id).then((response) => response.data);
  }

  //Hent alle spillere
  listAllPlayers() {
    return axios.get<Player[]>('/players').then((response) => response.data);
  }

  //Legg til spiller
  async addPlayer(
    name: string,
    birth_date: string,
    height: number,
    country: string,
    team: string,
    picture_url: string,
    content: string,
  ) {
    try {
      const user_id = localStorage.getItem('user_id');

      if (!user_id) {
        throw new Error('User is not logged in');
      }
      if (
        name == '' ||
        height == 0 ||
        country == '' ||
        team == '' ||
        picture_url == '' ||
        content == ''
      ) {
        throw new Error('Please provide all fields');
      }

      const response = await axios.post<{ id: number }>('/player_id/new', {
        name,
        birth_date,
        height,
        country,
        team,
        picture_url,
        content,
        user_id,
      });

      return response.data.id;
    } catch (error) {
      console.error('Error adding player:', error);
      return -1;
    }
  }

  //Slett spiller
  deletePlayer(page_id: number) {
    return axios.delete('/player/' + page_id);
  }

  //Oppdater spiller
  updatePlayer(
    id: number,
    name: string,
    birth_date: string,
    height: number,
    country: number,
    team: number,
    picture_url: string,
    page_id: number,
    content: string,
  ) {
    return axios.put('/player/' + id, {
      name,
      birth_date,
      height,
      country,
      team,
      picture_url,
      page_id,
      content,
    });
  }

  //Hent et utvalg av spillere (bruk på forsiden)
  listSetAmountOfPlayers(amount: number) {
    return axios.get<Player[]>(`/player?amount=${amount}`).then((response) => response.data);
  }

  //Hent flere land
  getCountries() {
    return axios.get<Country[]>('/player/countries').then((response) => response.data);
  }

  //Hent flere lag
  getTeams() {
    return axios.get<Team[]>('/player/teams').then((response) => response.data);
  }

  //Hent land
  getCountry(id: number) {
    return axios.get<Country>('/player/' + id + '/country').then((response) => response.data);
  }

  //Hent lag
  getTeam(id: number) {
    return axios.get<Team>('/player/' + id + '/team').then((response) => response.data);
  }

  //Hent brukernavn på oppretter av siden
  getCreator(page_id: number) {
    return axios.get<User>('/creator/' + page_id).then((response) => response.data);
  }

  //Hent sidehistorikk
  getPageHistory(page_id: number) {
    return axios.get<Page>('/creator/' + page_id).then((response) => response.data);
  }

  //Hent navn og dato på siste revisjon
  getRevisedName(page_id: number) {
    return axios.get<Revisions>('/revision/' + page_id).then((response) => response.data);
  }

  //Øk viewCount ved besøk på siden
  incrementViewCount(page_id: number) {
    return axios.get<Page>('/increment-view-count/' + page_id);
  }

  //Hent league
  getLeague(team_id: number) {
    return axios.get<Team>('/player/' + team_id + '/league').then((response) => response.data);
  }

  //Hent nårværende påloggede bruker
  getUser() {
    return axios.get<User>('/current_user').then((response) => response.data);
  }
}

const playerService = new PlayerService();
export default playerService;

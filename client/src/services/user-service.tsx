import axios from 'axios';
import { Player, Country, Team, User, Tag } from '../types';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

class UserService {
  //Hent bruker
  getUser() {
    return axios.get<User>('2/current_user').then((response) => response.data);
  }

  //Hent brukerID
  getUserId() {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      console.warn('No user_id found in localStorage');
    }
    return userId;
  }

  //Hent brukernavn basert på ID
  getUserById(user_id: number) {
    return axios.get<User>(`user/${user_id}`).then((response) => response.data);
  }
}

const userService = new UserService();
export default userService;

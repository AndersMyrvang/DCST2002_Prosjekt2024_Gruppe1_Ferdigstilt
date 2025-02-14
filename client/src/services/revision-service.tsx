import axios from 'axios';
import { Player, Country, Team, User, Revisions } from '../types';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

class RevisionService {
  //Hent tidligere revisjoner
  getRevisions(page_id: number) {
    return axios.get<Revisions[]>('/revisions/' + page_id).then((response) => response.data);
  }

  //Legg til revisjon
  addRevision(page_id: number, content: string, revised_by: number) {
    return axios
      .post('/revisions/create', { page_id, content, revised_by })
      .then((response) => response.data);
  }
}

const revisionService = new RevisionService();
export default revisionService;

import axios from 'axios';
import { Tag } from '../types';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

class TagService {
  // Hent alle tagger
  getTags() {
    return axios.get<Tag[]>('/tags').then((response) => response.data);
  }

  // Hent tagger for en spesifikk side
  getTagsForPage(pageId: number) {
    return axios
      .get<Tag[]>(`/tags/${pageId}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error('Error fetching tags for page:', error);
        throw error;
      });
  }

  // Legg til en tagg på en side
  addTagToPage(pageId: number, tagId: number) {
    return axios
      .post(`/tags/${pageId}/${tagId}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error('Error adding tag to page:', error);
        throw error;
      });
  }

  // Fjern en tagg fra en side
  removeTagFromPage(pageId: number, tagId: number) {
    return axios
      .delete(`/tags/${pageId}/${tagId}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error('Error removing tag from page:', error);
        throw error;
      });
  }

  // Legg til en tag
  addTag(tag: Tag) {
    return axios
      .post('/tags', tag)
      .then((response) => {
        return response.data; 
      })
      .catch((error) => {
        console.error('Error adding tag:', error);
        throw error; 
      });
  }

  // Slett en tag
  deleteTag(tagId: number) {
    return axios
      .delete(`/tags/${tagId}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error('Error deleting tag:', error);
        throw error;
      });
  }

  // Sjekk hvor mange pages en tag er knyttet til
  getTagPageCount(tagId: number) {
    return axios
      .get(`/tags/${tagId}/pages`)
      .then((response) => response.data.pages)
      .catch((error) => {
        console.error('Error fetching tag page count:', error);
        throw error;
      });
  }
}

const tagService = new TagService();
export default tagService;

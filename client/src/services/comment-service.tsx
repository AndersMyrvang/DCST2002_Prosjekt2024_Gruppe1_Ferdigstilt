import axios from 'axios';
import { Comment, User } from '../types';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

class CommentService {
  //Lister alle kommentarer tilhørende siden
  listComments(page_id: number) {
    return axios.get<Comment[]>('/comment/' + page_id).then((response) => response.data);
  }
  async create(user_id: number, content: string, page_id: number) {
    try {
      const response = await axios.post<{ comment: Comment }>(`/comment/${page_id}/new`, {
        user_id,
        content,
        page_id,
      });
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      return;
    }
  }
  //Redigering av kommentar
  update(comment_id: number, content: string) {
    return axios
      .put<{ comment: Comment }>(`/comment/${comment_id}/update`, {
        comment_id,
        content,
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error('Error updating comment' + error);
        throw error;
      });
  }
  //Sletter kommentar
  deleteComment(comment_id: number) {
    try {
      axios.delete('/comment/' + comment_id);
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
}

const commentService = new CommentService();
export default commentService;

import express, { request } from 'express';
import commentService from '../services/comment-service';
import userService from '../services/user-service';

const router = express.Router();

//Henter kommentarer til gitt side(pageId)
router.get('/comment/:page_id', (request, response) => {
  const id = parseInt(request.params.page_id, 10);

  if (isNaN(id)) {
    return response.status(401).send('Invalid page id');
  }
  commentService
    .listComments(id)
    .then((comment) => {
      if (!comment) {
        return response.status(404).send('comment not found');
      }
      response.send(comment);
    })
    .catch((error) => response.status(500).send(error));
});

//Legger til ny kommentar
router.post('/comment/:page_id/new', (request, response) => {
  const { user_id, content, page_id } = request.body;

  if (!content || !user_id) {
    return response.status(400).send('Missing content or user_id');
  }

  commentService
    .newComment(user_id, content, page_id)
    .then((comment) => {
      response.status(200).send({ comment });
    })
    .catch((error) => {
      response.status(500).send('Error creating comment');
    });
});

//Hent brukernavn
router.get('/user/:user_id', (req, res) => {
  const id = parseInt(req.params.user_id, 10);

  if (isNaN(id)) {
    return res.status(400).send('Invalid user id');
  }

  userService
    .getUserById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send('User not found');
      }
      res.send(user);
    })
    .catch((Error) => res.status(500).send('Error getting user'));
});

//Sletter kommentar
router.delete('/comment/:comment_id', (request, response) => {
  const id = parseInt(request.params.comment_id, 10);

  commentService
    .deleteComment(id)
    .then(() => response.send())
    .catch((error) => response.status(500).send('Error deleting comment'));
});

//Oppdater kommentar
router.put('/comment/:comment_id/update', (request, response) => {
  const id = parseInt(request.params.comment_id, 10);
  const { content } = request.body;

  if (isNaN(id)) {
    return response.status(400).send('Invalid comment id');
  }

  if (!content || content === '') {
    return response.status(404).send('Comment not found');
  }

  commentService
    .updateComment(id, content)
    .then((comment) => response.status(201).send({ comment }))
    .catch((error) => response.status(500).send('Error updating comment'));
});

export default router;

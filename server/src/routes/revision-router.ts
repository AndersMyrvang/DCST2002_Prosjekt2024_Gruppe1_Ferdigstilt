import express from 'express';
import revisionService from '../services/revision-service';

/**
 * Express router containing tag methods.
 */
const router = express.Router();

//Hent revisjoner basert på pageId
router.get('/revisions/:page_id', (request, response) => {
  const page_id = parseInt(request.params.page_id, 10);
  revisionService
    .getRevisions(page_id)
    .then((revisions) => response.send(revisions))
    .catch((error) => response.status(500).send(error));
});

//Legg til ny revisjon
router.post('/revisions/create', (request, response) => {
  const { page_id, content, revised_by } = request.body;

  revisionService
    .createRevision(page_id, content, revised_by)
    .then((revision_id) => response.status(201).send({ revision_id }))
    .catch((error) => {
      console.error('Error in saving revision', error.message);
      response.status(500).send(error);
    });
});

export default router;

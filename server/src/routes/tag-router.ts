import express from 'express';
import tagService from '../services/tag-service';

/**
 * Express router containing tag methods.
 */
const router = express.Router();

// Hent alle tags
router.get('/tags', (_request, response) => {
  tagService
    .getTags()
    .then((tags) => response.send(tags))
    .catch((error) => response.status(500).send(error));
});

// Hent alle tagger for en spesifikk side
router.get('/tags/:pageId', (request, response) => {
  const pageId = parseInt(request.params.pageId, 10);

  if (isNaN(pageId)) {
    return response.status(400).send({ error: 'Invalid page ID' });
  }

  tagService
    .getTagsForPage(pageId)
    .then((tags) => response.send(tags))
    .catch((error) => response.status(500).send(error));
});

// Legg til en tagg på en spesifikk side
router.post('/tags/:pageId/:tagId', (request, response) => {
  const pageId = parseInt(request.params.pageId, 10);
  const tagId = parseInt(request.params.tagId, 10);

  if (isNaN(pageId) || isNaN(tagId)) {
    return response.status(400).send({ error: 'Invalid page ID or tag ID' });
  }

  tagService
    .addTagToPage(pageId, tagId)
    .then(() => response.status(201).send({ message: 'Tag added to page' }))
    .catch((error) => response.status(500).send(error));
});

// Fjern en tagg fra en spesifikk side
router.delete('/tags/:pageId/:tagId', (request, response) => {
  const pageId = parseInt(request.params.pageId, 10);
  const tagId = parseInt(request.params.tagId, 10);

  if (isNaN(pageId) || isNaN(tagId)) {
    return response.status(400).send({ error: 'Invalid page ID or tag ID' });
  }

  tagService
    .removeTagFromPage(pageId, tagId)
    .then(() => response.status(200).send({ message: 'Tag removed from page' }))
    .catch((error) => response.status(500).send(error));
});

//Legg til en tag
router.post('/tags', (request, response) => {
  tagService
    .addTag(request.body)
    .then((tagId) => {
      response.status(201).send({ tag_id: tagId, tag_name: request.body.tag_name });
    })
    .catch((error) => {
      console.error('Error adding tag:', error);
      response.sendStatus(500);
    });
});

//Fjern en tag
router.delete('/tags/:tagId', (request, response) => {
  const tagId = parseInt(request.params.tagId, 10);

  if (isNaN(tagId)) {
    return response.status(400).send({ error: 'Invalid tag ID' });
  }

  tagService
    .removeTag(tagId)
    .then(() => response.status(200).send({ message: 'Tag removed' }))
    .catch((error) => response.status(500).send(error));
});

// Sjekk hvor mange pages en tag er knyttet til
router.get('/tags/:tagId/pages', (request, response) => {
  const tagId = parseInt(request.params.tagId, 10);

  if (isNaN(tagId)) {
    return response.status(400).send({ error: 'Invalid tag ID' });
  }

  tagService
    .checkTag(tagId)
    .then((pages) => response.send({ pages }))
    .catch((error) => response.status(500).send(error));
});

export default router;

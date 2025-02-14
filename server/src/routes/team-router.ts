import express from 'express';
import teamService from '../services/team-service';

/**
 * Express router containing page methods.
 */
const router = express.Router();

//Hent alle eller et utvalg av lag
router.get('/team', (request, response) => {
  const amount = parseInt(request.query.amount as string);

  if (!isNaN(amount)) {
    teamService
      .listSetAmountOfTeams(amount)
      .then((rows) => response.send(rows))
      .catch((error) => response.status(500).send(error));
  } else {
    teamService
      .listAllTeams()
      .then((rows) => response.send(rows))
      .catch((error) => response.status(500).send(error));
  }
});

//Hent lag basert på teamId
router.get('/team/:id', (request, response) => {
  const id = parseInt(request.params.id, 10);

  if (isNaN(id)) {
    return response.status(400).send('Invalid team id');
  }

  teamService
    .getTeam(id)
    .then((team) => {
      if (!team) {
        return response.status(404).send('Team not found');
      }
      response.send(team);
    })
    .catch((error) => response.status(500).send(error));
});

//Hent lag i en league
router.get('/team/:id/leagues', (_request, response) => {
  teamService
    .getLeagues()
    .then((rows) => {
      response.send(rows);
    })
    .catch((error) => response.status(500).send(error));
});

//Oppdater lag
router.put('/team/:id', (request, response) => {
  const id = parseInt(request.params.id, 10);
  const { name, country, coach, league, emblem_image_url, page_id, content } = request.body;

  teamService
    .updateTeam(id, name, country, coach, league, emblem_image_url, page_id, content)
    .then(() => response.send())
    .catch((error) => response.status(500).send(error));
});

//Legg til nytt lag
router.post('/team_id/new', (request, response) => {
  const { name, country, coach, league, emblem_image_url, content, user_id } = request.body;

  teamService
    .addTeam(name, country, coach, league, emblem_image_url, content, user_id)
    .then((id) => response.status(201).send({ id }))
    .catch((error) => response.status(500).send(error));
});

//Slett lag
router.delete('/team/:page_id', (request, response) => {
  const page_id = parseInt(request.params.page_id, 10);

  teamService
    .deleteTeam(page_id)
    .then(() => response.send())
    .catch((error) => response.status(500).send(error));
});

//Hent spillere på gitt lag
router.get('/team/:id/players', (request, response) => {
  const team_id = parseInt(request.params.id, 10);

  teamService
    .listAllPlayersByTeam(team_id)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

export default router;

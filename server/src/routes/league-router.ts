import express from 'express';
import leagueService from '../services/league-service';
import userService from '../services/user-service';

/**
 * Express router containing page methods.
 */
const router = express.Router();

//Henter leages
router.get('/league', (request, response) => {
  const amount = parseInt(request.query.amount as string);

  if (!isNaN(amount)) {
    leagueService
      .listSetAmountOfLeagues(amount)
      .then((rows) => response.send(rows))
      .catch((error) => {
        console.error('Error fetching leagues with amount:', error);
        response.status(500).send({ message: 'Error fetching leagues', error });
      });
  } else {
    leagueService
      .listAllLeagues()
      .then((rows) => response.send(rows))
      .catch((error) => {
        console.error('Error fetching all leagues:', error);
        response.status(500).send({ message: 'Error fetching leagues', error });
      });
  }
});

//Hent league, basert på id
router.get('/league/:id', (request, response) => {
  const id = parseInt(request.params.id, 10);
  if (isNaN(id)) {
    return response.status(400).send('Invalid league id');
  }
  leagueService
    .getLeague(id)
    .then((league) => {
      if (!league) {
        return response.status(404).send('League not found');
      }
      response.send(league);
    })
    .catch((error) => response.status(500).send(error));
});

//Oppdater league
router.put('/league/:id', (request, response) => {
  const id = parseInt(request.params.id, 10);
  const { name, country, emblem_image_url, page_id, content } = request.body;

  leagueService
    .updateLeague(id, name, country, emblem_image_url, page_id, content)
    .then(() => response.send())
    .catch((error) => response.status(500).send(error));
});

//Legg til ny league
router.post('/league_id/new', (request, response) => {
  const { name, country, emblem_image_url, content, user_id } = request.body;

  if (!name || !country || !emblem_image_url || !content || !user_id) {
    return response.status(400).send('Missing required fields');
  }

  leagueService
    .addLeague(name, country, emblem_image_url, content, user_id)
    .then((leagueId) => {
      response.status(201).send({ leagueId });
    })
    .catch((error) => {
      console.error('Error creating league:', error);
      response.status(500).send({ message: 'Error creating league', error });
    });
});

//Slett league
router.delete('/league/:page_id', (request, response) => {
  const page_id = parseInt(request.params.page_id, 10);

  leagueService
    .deleteLeague(page_id)
    .then(() => response.send())
    .catch((error) => response.status(500).send(error));
});

// Hent brukernavn basert på page_id
router.get('/creator/:page_id', (request, response) => {
  const page_id = parseInt(request.params.page_id, 10);

  userService
    .getUsernameByPageId(page_id)
    .then((user) => {
      if (!user) {
        return response.status(404).send('User not found');
      }
      response.send(user);
    })
    .catch((error) => response.status(500).send(error));
});

// Hent alle lagene i en liga
router.get('/team/league/:id', (request, response) => {
  const league_id = parseInt(request.params.id, 10);

  leagueService
    .listAllTeamsInLeague(league_id)
    .then((teams) => response.send(teams))
    .catch((error) => response.status(500).send(error));
});

export default router;

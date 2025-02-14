import express from 'express';
import playerService from '../services/player-service';
import leagueService from '../services/league-service';
import userService from '../services/user-service';

/**
 * Express router containing page methods.
 */
const router = express.Router();

// Hent alle spillere
router.get('/player', (request, response) => {
  const amount = parseInt(request.query.amount as string);
  playerService
    .listSetAmountOfPlayers(amount)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

//Hent alle spillere
router.get('/players', (request, response) => {
  playerService
    .listAllPlayers()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

// Hent spiller basert på id
router.get('/player_id/:id', (request, response) => {
  const id = parseInt(request.params.id, 10);

  if (isNaN(id)) {
    return response.status(400).send('Invalid player id');
  }

  playerService
    .getPlayer(id)
    .then((player) => {
      if (!player) {
        return response.status(404).send('Player not found');
      }
      response.send(player);
    })
    .catch((error) => response.status(500).send(error));
});

// Hent land
router.get('/player/countries', (_request, response) => {
  playerService
    .getCountries()
    .then((rows) => {
      response.send(rows);
    })
    .catch((error) => response.status(500).send(error));
});

// Hent lag
router.get('/player/teams', (_request, response) => {
  playerService
    .getTeams()
    .then((rows) => {
      response.send(rows);
    })
    .catch((error) => response.status(500).send(error));
});

// Hent spiller basert på id
router.get('/player/:id', (request, response) => {
  const id = parseInt(request.params.id, 10);

  if (isNaN(id)) {
    return response.status(400).send('Invalid player id');
  }

  playerService
    .getPlayer(id)
    .then((player) => {
      if (!player) {
        return response.status(404).send('Player not found');
      }
      response.send(player);
    })
    .catch((error) => response.status(500).send(error));
});

// Oppdater spiller
router.put('/player/:id', (request, response) => {
  const id = parseInt(request.params.id, 10);
  const { name, birth_date, height, country, team, picture_url, page_id, content } = request.body;
  playerService
    .updatePlayer(
      id,
      name,
      new Date(birth_date),
      height,
      country,
      team,
      picture_url,
      page_id,
      content,
    )
    .then(() => response.send())
    .catch((error) => response.status(500).send(error));
});

// Slett spiller basert på page_id
router.delete('/player/:page_id', (request, response) => {
  const page_id = parseInt(request.params.page_id, 10);

  playerService
    .deletePlayer(page_id)
    .then(() => response.send())
    .catch((error) => response.status(500).send(error));
});

// Hent brukernavn og sidehistorikk basert på page_id
router.get('/creator/:page_id', (request, response) => {
  const page_id = parseInt(request.params.page_id, 10);

  userService
    .getUsernameByPageId(page_id)
    .then((userData) => {
      if (!userData) {
        return response.status(404).send('User or page data not found');
      }
      response.json(userData);
    })
    .catch((error) => response.status(500).send(error));
});

router.get('/revision/:page_id', (request, response) => {
  const page_id = parseInt(request.params.page_id, 10);

  userService
    .getRevisedName(page_id)
    .then((userData) => {
      if (!userData) {
        return response.json({
          message: 'Denne siden har ikke blitt revidert enda',
          revised_by: null,
          revised_at: null,
        });
      }
      response.json(userData);
    })
    .catch((error) => response.status(500).send(error));
});

// Hent view count
router.get('/increment-view-count/:page_id', (request, response) => {
  const page_id = parseInt(request.params.page_id, 10);

  userService
    .incrementViewCount(page_id)
    .then(() => {
      response.sendStatus(200);
    })
    .catch((error) => response.status(500).send(error));
});

//Legg til ny spiller
router.post('/player_id/new', (request, response) => {
  const { name, birth_date, height, country, team, picture_url, content, user_id } = request.body;

  playerService
    .addPlayer(name, birth_date, height, country, team, picture_url, content, user_id)
    .then((id) => response.status(201).send({ id }))
    .catch((error) => {
      console.error('Error in player creation:', error.message);
      response.status(500).send({ error: 'Failed to create player' });
    });
});

// Hent liga
router.get('/player/:id/league', (request, response) => {
  const id = parseInt(request.params.id, 10);

  if (isNaN(id)) {
    return response.status(400).send('Invalid player id');
  }

  leagueService
    .getLeagueByTeamId(id)
    .then((league) => {
      response.send(league);
    })
    .catch((error) => response.status(500).send(error));
});

export default router;

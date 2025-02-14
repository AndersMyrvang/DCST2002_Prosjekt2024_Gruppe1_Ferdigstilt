import { response, Router } from 'express';
import userService from '../services/user-service';
import passport from 'passport';
import { User } from '../../../client/src/types';

const router = Router();

// Rute for å hente brukerens profilinformasjon basert på user_id
router.get('/current_user', async (req, res) => {
  if (req.user) {
    try {
      const userId = (req.user as any).user_id;
      const userData = await userService.getUserById(userId);

      if (userData) {
        res.send({
          username: userData.username,
          email: userData.email,
          photo: userData.profile_image_url,
          firstLogin: userData.first_login,
          lastLogin: userData.last_login,
          is_admin: userData.is_admin,
          user_id: userData.user_id,
        });
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.error('Feil ved henting av brukerdata:', error);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(401);
  }
});

// Endepunkt for å hente alle brukere
router.get('/users', async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Feil ved henting av brukere:', error);
    res.status(500).send('Feil ved henting av brukere');
  }
});

// Endepunkt for å oppdatere admin-status for en bruker
router.post('/users/:userId/set-admin', async (req, res) => {
  const userId = parseInt(req.params.userId);
  const { isAdmin } = req.body;
  try {
    await userService.updateAdminStatus(userId, isAdmin);
    res.status(200).send('Admin-status oppdatert');
  } catch (error) {
    console.error('Feil ved oppdatering av admin-status:', error);
    res.status(500).send('Serverfeil');
  }
});

// Rute for å starte Google-pålogging
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback-rute etter Google-pålogging
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  async (req, res) => {
    try {
      const googleId = (req.user as any).id;
      const user = {
        google_id: googleId,
        username: (req.user as any).username,
        email: (req.user as any).emails[0].value,
        profile_image_url: (req.user as any).photos[0].value,
        first_login: new Date(),
        last_login: new Date(),
        last_logout: null,
        is_admin: false,
        user_id: 0,
      };

      const userData = await userService.findOrCreateUserByGoogleId(googleId, user);

      if (userData && userData.user_id && req.user) {
        (req.user as Partial<User>).user_id = userData.user_id;
      }

      res.redirect('/');
    } catch (error) {
      console.error('Feil ved behandling av Google callback:', error);
      res.status(500).send('Feil ved innlogging');
    }
  },
);

// Rute for å logge ut og oppdatere last_logout i databasen
router.get('/logout', async (req, res) => {
  if (req.user) {
    const userId = (req.user as any).user_id;

    try {
      await userService.updateLastLogout(userId);

      req.logout((err) => {
        if (err) {
          console.error('Feil ved utlogging:', err);
          return res.status(500).send('Utlogging mislyktes');
        }
        res.redirect('/');
      });
    } catch (error) {
      console.error('Feil ved oppdatering av last_logout:', error);
      res.status(500).send('Feil ved oppdatering av last_logout');
    }
  } else {
    res.status(401).send('Ingen bruker funnet ved utlogging.');
  }
});

export default router;

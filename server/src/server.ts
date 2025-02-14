import express from 'express';
import path from 'path';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import app from './app';
import userRouter from './routes/user-router';
import userService from './services/user-service';
import searchService from './services/search-service';
import playerService from './services/player-service';
import { User } from '../../client/src/types';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Konfigurerer session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'hemmelignokkel',
    resave: false,
    saveUninitialized: true,
  }),
);


// Initialiserer Passport
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth-strategi
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const displayName = profile.displayName;
        const email = profile.emails ? profile.emails[0].value : '';
        const photo = profile.photos ? profile.photos[0].value : '';

        const user: User = {
          user_id: 0, 
          google_id: googleId,
          username: displayName,
          email: email,
          profile_image_url: photo,
          first_login: new Date(),
          last_login: new Date(),
          last_logout: null,
          is_admin: false,
        };

        const savedUser = await userService.findOrCreateUserByGoogleId(googleId, user);
        return done(null, { user_id: savedUser.user_id }); 
      } catch (error) {
        console.error('Feil under lagring av brukerdata:', error);
        return done(error, false);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, (user as any).user_id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userService.getUserById(id as number);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google autentiseringsruter
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  },
);

// Rute for å logge ut og oppdatere `last_logout`
app.get('/logout', async (req, res) => {
  if (req.user) {
    const userId = (req.user as any).user_id;

    try {
      await userService.updateLastLogout(userId);
    } catch (error) {
      console.error('Feil ved oppdatering av last_logout:', error);
    }
  }

  req.logout((err) => {
    if (err) {
      console.error('Feil ved utlogging:', err);
      return res.status(500).send('Utlogging mislyktes');
    }
    res.redirect('/');
  });
});

app.use('/api', userRouter);

app.get('/api/search', async (req, res) => {
  const query = req.query.q as string;

  if (!query) {
    return res.status(400).json({ error: 'Søkespørsmål er påkrevd' });
  }

  try {
    const players = await playerService.searchPlayers(query);
    res.json({ players });
  } catch (error) {
    console.error('Feil under søket:', error);
    res.status(500).json({ error: 'Noe gikk galt under søket' });
  }
});

app.get('/api/search/suggestions', async (req, res) => {
  const query = req.query.q as string;

  if (!query || query.length < 3) {
    return res.status(400).json({ error: 'Søkespørsmål må inneholde minst tre tegn' });
  }

  try {
    const suggestions = await searchService.searchMultipleTables(query);
    res.json({ suggestions });
  } catch (error) {
    console.error('Feil under henting av søkeforslag:', error);
    res.status(500).json({ error: 'Noe gikk galt under henting av søkeforslag' });
  }
});

app.use(express.static(path.join(__dirname, '/../../client/public')));

app.listen(PORT, () => {
  console.info(`Server kjører på port ${PORT}`);
});
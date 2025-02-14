import express from 'express';
import playerRouter from './routes/player-router';
import teamRouter from './routes/team-router';
import leagueRouter from './routes/league-router';
import tagRouter from './routes/tag-router';
import commentRouter from './routes/comment-router';
import revisionRouter from './routes/revision-router';
/**
 * Express application.
 */
const app = express();

app.use(express.json());

app.use('/api/v2', playerRouter);
app.use('/api/v2', teamRouter);
app.use('/api/v2', leagueRouter);
app.use('/api/v2', tagRouter);
app.use('/api/v2', commentRouter);
app.use('/api/v2', revisionRouter);

export default app;

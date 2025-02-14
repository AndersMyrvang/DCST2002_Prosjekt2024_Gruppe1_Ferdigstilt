import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Component } from 'react-simplified';
import { HashRouter, Route } from 'react-router-dom';
import { NavBar, Card, Alert } from './widgets';
import {
  PlayerList,
  PlayerDetails,
  PlayerEdit,
  PlayerListAll,
  PlayerNew,
} from './components/player-components';
import {
  TeamList,
  TeamDetails,
  TeamEdit,
  TeamListAll,
  TeamNew,
} from './components/team-components';
import { TagList, TagAdd } from './components/tag-component';
import {
  LeagueList,
  LeagueDetails,
  LeagueEdit,
  LeagueListAll,
  LeagueNew,
} from './components/league-components';
import Hamburger from './components/navBar-components';
import Profile from './components/profile-component';

class Menu extends Component {
  render() {
    return <Hamburger user={null} />;
  }
}

class Home extends Component {
  render() {
    return (
      <Card title="Welcome">
        <PlayerList />
        <TeamList />
        <LeagueList />
      </Card>
    );
  }
}

let root = document.getElementById('root');
if (root)
  createRoot(root).render(
    <HashRouter>
      <div>
        <Alert />
        <Menu />
        <Route exact path="/" component={Home} />
        <Route exact path="/menu" component={Hamburger} />

        <Route exact path="/page" component={PlayerList} />
        <Route exact path="/players" component={PlayerListAll} />
        <Route exact path="/player/:id" component={PlayerDetails} />
        <Route exact path="/player/:id/edit" component={PlayerEdit} />
        <Route exact path="/player_id/new" component={PlayerNew} />

        <Route exact path="/page" component={TeamList} />
        <Route exact path="/teams" component={TeamListAll} />
        <Route exact path="/team/:id/" component={TeamDetails} />
        <Route exact path="/team/edit/:id/" component={TeamEdit} />
        <Route exact path="/team_id/new" component={TeamNew} />

        <Route exact path="/page" component={LeagueList} />
        <Route exact path="/leagues" component={LeagueListAll} />
        <Route exact path="/league/:id" component={LeagueDetails} />
        <Route exact path="/league/:id/edit" component={LeagueEdit} />
        <Route exact path="/league_id/new" component={LeagueNew} />

        <Route exact path="/tags" component={TagList} />
        <Route exact path="/tags/new" component={TagAdd} />
        <Route exact path="/profile" component={Profile} />
      </div>
    </HashRouter>,
  );

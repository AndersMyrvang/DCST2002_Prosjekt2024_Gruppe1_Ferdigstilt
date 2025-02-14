import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import NavBar from './components/navBar-components';
import { PlayerDetails } from './components/player-components';
import { TeamDetails } from './components/team-components';
import { LeagueDetails } from './components/league-components';

// Dummy Home component as placeholder
function Home() {
  return <div>Welcome Home</div>;
}

function App() {
  interface User {
    displayName: string;
  }

  const [user, setUser] = useState<User | null>(null);

  // Fetching user info from /api/current_user when the app loads
  useEffect(() => {
    fetch('/api/current_user')
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      });
  }, []);

  return (
    <Router>
      {/* Define routes for the page */}
      <Route exact path="/" component={Home} />
      <Route path="/players/:name" component={PlayerDetails} />
      <Route path="/teams/:name" component={TeamDetails} />
      <Route path="/leagues/:name" component={LeagueDetails} />
    </Router>
  );
}

export default App;

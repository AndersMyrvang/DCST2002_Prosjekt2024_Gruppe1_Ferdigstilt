import * as React from 'react';
import { Component } from 'react-simplified';
import {
  Alert,
  Row,
  Column,
  Button,
  Card,
  Card2,
  Card3,
  Details,
  Form,
  RevisionComponent,
} from '../widgets';
import { NavLink } from 'react-router-dom';
import teamService from '../services/team-service';
import playerService from '../services/player-service';
import tagService from '../services/tag-service';
import { FaTrashAlt, FaArrowLeft } from 'react-icons/fa';
import { createHashHistory } from 'history';
import { Team, League, Country, User, Tag, Page, Player, Revisions } from '../types';
import { Editor } from '@tinymce/tinymce-react';
import { TextEditor } from './textEditor-component';
import CommentSection from './comment-components';
import revisionService from '../services/revision-service';
import userService from '../services/user-service';
import leagueService from '../services/league-service';

const history = createHashHistory();

//Komponent for å vise alle teams
export class TeamListAll extends Component {
  team: Team[] = [];
  user: User = {
    user_id: 0,
    google_id: '',
    username: '',
    email: '',
    profile_image_url: '',
    first_login: new Date(),
    last_login: new Date(),
    last_logout: new Date(),
    is_admin: false,
  };

  render() {
    return (
      <>
        {this.user.user_id != 0 ? (
          <Button.Light onClick={() => history.push('/team_id/new')}>New team</Button.Light>
        ) : null}
        <Card2 title="All Teams">
          {this.team.map((team) => (
            <Row key={team.name}>
              <Column width={11}>
                <Card3 title={<NavLink to={'/team/' + team.id}>{team.name}</NavLink>}>
                  <p>Country: {team.country_name}</p>
                  <p>Coach: {team.coach}</p>
                  <p>League: {team.league_name}</p>
                  <img
                    src={`${team.emblem_image_url}`}
                    alt={`Bilde fra ${team.emblem_image_url}`}
                    width={'30px'}
                  />
                </Card3>
              </Column>
            </Row>
          ))}
        </Card2>
      </>
    );
  }

  mounted() {
    teamService
      .listAllTeams()
      .then((team: Team[]) => {
        this.team = team;
      })
      .catch((error: any) => {
        console.error('Error fetching teams:', error);
        Alert.danger('Error getting teams: ' + error.message);
      });

    const current_userId = localStorage.getItem('user_id');
    if (current_userId != null) {
      userService
        .getUserById(parseInt(current_userId, 10))
        .then((user: User) => {
          this.user = user;
        })
        .catch((error) => {
          console.error('Error getting user: ', error);
          Alert.danger('Error getting user: ' + error.message);
        });
    }
  }
}

//Komponent for å vise et utvalg av teams(til forsiden)
export class TeamList extends Component {
  team: Team[] = [];
  error: string | null = null;

  render() {
    return (
      <>
        <Card2 title="Check out some of our teams!">
          {this.team.map((team) => (
            <Row key={team.name}>
              <Column width={11}>
                <Card3 title={<NavLink to={'/team/' + team.id}>{team.name}</NavLink>}>
                  <p>Country: {team.country_name}</p>
                  <p>Coach: {team.coach}</p>
                  <p>League: {team.league_name}</p>
                  <img
                    src={`${team.emblem_image_url}`}
                    alt={`Bilde fra ${team.emblem_image_url}`}
                    width={'30px'}
                  />
                </Card3>
              </Column>
            </Row>
          ))}
        </Card2>
        {this.error && <div style={{ marginTop: '20px' }}>{this.error}</div>}
        <Button.Light onClick={() => history.push('/teams/')}>Get all teams</Button.Light>
      </>
    );
  }

  mounted() {
    teamService
      .listSetAmountOfTeams(5)
      .then((team: Team[]) => {
        this.team = team;
        this.error = null;
      })
      .catch((error: any) => {
        console.error('Error fetching teams:', error);
        this.error = `Error getting teams: ${error.message}`;
      });
  }
}

//Komponent for detaljer om et spesifikt valgt team
export class TeamDetails extends Component<{ match: { params: { id: number } } }> {
  team: Team = {
    name: '',
    country_id: 0,
    country_name: '',
    coach: '',
    league_id: 0,
    league_name: '',
    emblem_image_url: '',
    id: 0,
    page_id: 0,
    content: '',
  };

  league: League = {
    id: 0,
    name: '',
    country_id: 0,
    country_name: '',
    emblem_image_url: '',
    page_id: 0,
    content: '',
  };

  players: Player[] = [];
  user: User | null = null;
  tags: Tag[] = [];
  page: Page = {
    created_at: new Date(),
    view_count: 0,
  };

  revision: Revisions = {
    revised_by: 0,
    revised_at: new Date(),
    revision_id: 0,
    content: '',
    page_id: 0,
    username: '',
  };

  render() {
    const formattedCreated_at =
      this.page?.created_at instanceof Date
        ? this.page?.created_at.toLocaleDateString()
        : new Date(this.page.created_at).toLocaleDateString();

    const formattedRevised_at = this.revision?.revised_at
      ? this.revision.revised_at instanceof Date
        ? this.revision.revised_at.toLocaleDateString()
        : new Date(this.revision.revised_at).toLocaleDateString()
      : '';

    return (
      <>
        <Button.Light onClick={() => history.push('/teams/')}>
          <FaArrowLeft /> Back to all teams
        </Button.Light>
        <Details
          onNavigate={(path) => history.push(path)}
          title
          value={{
            id: this.team.id,
            name: this.team.name,
            country_id: this.team.country_id,
            country_name: this.team.country_name,
            emblem_image_url: this.team.emblem_image_url,
            page_id: this.team.page_id,
            content: this.team.content,
            created_by: this.user ? this.user.username : 'Unknown',
            created_at: formattedCreated_at,
            view_count: this.page.view_count,
            revised_by: this.revision.revised_by,
            revised_at: formattedRevised_at,
            players: this.players.map((player) => ({ id: player.id, name: player.name })),
            league_name: this.league.name,
            league_id: this.league.id,
          }}
          history={history}
          buttonText="Edit"
          onEdit={() => {
            history.push('/team/edit/' + this.team.id);
          }}
        />

        <div style={{ marginTop: '20px' }}>
          <h3>Tags for {this.team.name}</h3>
          {this.tags.length > 0 ? (
            <ul>
              {this.tags.map((tag, index) => (
                <li key={tag.tag_id || index}>{tag.tag_name}</li>
              ))}
            </ul>
          ) : (
            <p>No tags available for this team.</p>
          )}
        </div>
        <CommentSection page_id={this.team.page_id} onNewComment={() => {}} />
      </>
    );
  }

  mounted() {
    teamService
      .getTeam(this.props.match.params.id)
      .then((team: Team) => {
        this.team = team;
        return Promise.all([
          playerService.getCreator(team.page_id),
          playerService.getPageHistory(team.page_id),
          tagService.getTagsForPage(team.page_id),
          playerService.getRevisedName(team.page_id),
          leagueService.getLeague(team.league_id),
        ]);
      })
      .then(([user, page, tags, revision, league]) => {
        if (page) {
          page.created_at = new Date(page.created_at);
        }
        this.user = user;
        this.page = page;
        this.tags = tags;
        this.league = league;
        this.revision = revision;
        this.forceUpdate();
        return playerService.incrementViewCount(this.team.page_id);
      })
      .catch((error: Error) => Alert.danger(error.message));

    teamService
      .listAllPlayersOnTeam(this.props.match.params.id)
      .then((players: Player[]) => {
        this.players = players;
      })
      .catch((error: any) => {
        console.error('Error fetching team:', error);
        Alert.danger('Error getting team: ' + error.message);
      });
  }
}

//Komponent for å redigere valgt team
export class TeamEdit extends Component<{ match: { params: { id: number } } }> {
  team: Team = {
    id: 0,
    name: '',
    country_id: 0,
    country_name: '',
    coach: '',
    league_id: 0,
    league_name: '',
    emblem_image_url: '',
    page_id: 0,
    content: '',
  };

  leagues: League[] = [];
  countries: Country[] = [];
  tags: Tag[] = [];
  teamTags: Tag[] = [];
  selectedTagId: number = 0;

  constructor(props: any) {
    super(props);
    this.updateTeam = this.updateTeam.bind(this);
    this.deleteTeam = this.deleteTeam.bind(this);
    this.addTagToTeam = this.addTagToTeam.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
  }

  handleContentChange(content: string) {
    this.team.content = content;
  }

  render() {
    return (
      <>
        <Button.Light onClick={() => history.push(`/team/${this.team.id}`)}>
          <FaArrowLeft /> Back to {this.team.name}
        </Button.Light>
        <Card title="Edit Team">
          <Row>
            <Column width={9}>
              <Card2 title="Edit team content">
                <TextEditor
                  initialContent={this.team.content}
                  onContentChange={this.handleContentChange}
                />
              </Card2>
            </Column>
            <Column width={3}>
              <RevisionComponent
                page_id={this.team.page_id}
                onContentChange={(content) => (this.team.content = content)}
              ></RevisionComponent>
              <Column>
                <Card2 title="Edit Team Details">
                  <form style={{ display: 'flex', flexDirection: 'column' }}>
                    <label>
                      Club:
                      <input
                        type="text"
                        value={this.team.name}
                        onChange={(event) => (this.team.name = event.target.value)}
                        style={{ marginBottom: '10px' }}
                      />
                    </label>

                    <label>
                      League:
                      <Form.Select
                        value={this.team.league_id}
                        onChange={(event) => {
                          this.team.league_id = Number(event.target.value);
                        }}
                        style={{ marginBottom: '10px' }}
                      >
                        <option value="">Select league</option>
                        {this.leagues.map((league) => (
                          <option key={league.id} value={league.id}>
                            {league.name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Select
                        value={this.team.country_id}
                        onChange={(event) => {
                          this.team.country_id = Number(event.target.value);
                        }}
                        style={{ marginBottom: '10px' }}
                      >
                        <option value="">Select country</option>
                        {this.countries.map((country) => (
                          <option key={country.country_id} value={country.country_id}>
                            {country.country_name}
                          </option>
                        ))}
                      </Form.Select>
                    </label>

                    <label>
                      Coach:
                      <input
                        type="text"
                        value={this.team.coach}
                        onChange={(event) => (this.team.coach = event.target.value)}
                        style={{ marginBottom: '10px' }}
                      />
                    </label>

                    <label>
                      Emblem Image URL:
                      <input
                        type="text"
                        value={this.team.emblem_image_url}
                        onChange={(event) => (this.team.emblem_image_url = event.target.value)}
                        style={{ marginBottom: '10px' }}
                      />
                    </label>

                    <label style={{ marginBottom: '10px' }}>Tags:</label>
                    <ul style={{ marginBottom: '10px' }}>
                      {this.teamTags.map((tag) => (
                        <li
                          key={tag.tag_id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '5px',
                          }}
                        >
                          {tag.tag_name}
                          <Button.Danger small onClick={() => this.removeTagFromTeam(tag.tag_id)}>
                            <FaTrashAlt aria-label={`Remove ${tag.tag_name}`} />
                          </Button.Danger>
                        </li>
                      ))}
                    </ul>

                    <Form.Select
                      value={this.selectedTagId}
                      onChange={(e) => (this.selectedTagId = parseInt(e.target.value))}
                      style={{ marginBottom: '10px' }}
                    >
                      <option value="">Select tag to add</option>
                      {this.tags.map((tag) => (
                        <option key={tag.tag_id} value={tag.tag_id}>
                          {tag.tag_name}
                        </option>
                      ))}
                    </Form.Select>
                    <div style={{ marginBottom: '10px' }}>
                      <Button.Success onClick={this.addTagToTeam}>Add Tag</Button.Success>
                    </div>

                    <Row>
                      <Column>
                        <Button.Success
                          onClick={() => {
                            this.updateTeam();
                            this.addRevision();
                          }}
                        >
                          Save Changes
                        </Button.Success>
                      </Column>
                      <Column>
                        <Button.Danger onClick={this.deleteTeam}>Delete Team</Button.Danger>
                      </Column>
                    </Row>
                  </form>
                </Card2>
              </Column>
            </Column>
          </Row>
        </Card>
      </>
    );
  }

  async mounted() {
    teamService
      .getTeam(this.props.match.params.id)
      .then((team: Team) => {
        this.team = team;
        return tagService.getTagsForPage(this.team.page_id);
      })
      .then((tags) => {
        this.teamTags = tags;
        this.forceUpdate();
      })
      .catch((error) => Alert.danger('Error fetching team data or tags: ' + error.message));

    teamService
      .getLeagues()
      .then((leagues: League[]) => {
        this.leagues = leagues;
        this.forceUpdate();
      })
      .catch((error: Error) => Alert.danger(error.message));

    playerService
      .getCountries()
      .then((countries: Country[]) => {
        this.countries = countries;
        this.forceUpdate();
      })
      .catch((error: Error) => Alert.danger(error.message));

    tagService
      .getTags()
      .then((tags) => {
        this.tags = tags;
      })
      .catch((error) => Alert.danger('Error fetching tags: ' + error.message));
  }

  addTagToTeam() {
    if (!this.selectedTagId) {
      Alert.danger('Please select a tag to add');
      return;
    }
    tagService
      .addTagToPage(this.team.page_id, this.selectedTagId)
      .then(() => {
        Alert.success('Tag added to team');
        return tagService.getTagsForPage(this.team.page_id);
      })
      .then((tags) => {
        this.teamTags = tags;
        this.forceUpdate();
      })
      .catch((error) => Alert.danger('Error adding tag to team: ' + error.message));
  }

  removeTagFromTeam(tagId: number) {
    tagService
      .removeTagFromPage(this.team.page_id, tagId)
      .then(() => {
        Alert.success('Tag removed from team');
        return tagService.getTagsForPage(this.team.page_id);
      })
      .then((tags) => {
        this.teamTags = tags;
        this.forceUpdate();
      })
      .catch((error) => Alert.danger('Error removing tag from team: ' + error.message));
  }

  updateTeam() {
    teamService
      .updateTeam(
        this.team.id,
        this.team.name,
        this.team.country_id,
        this.team.coach,
        this.team.league_id,
        this.team.emblem_image_url,
        this.team.content,
        this.team.page_id,
      )
      .then(() => {
        {
          Alert.success('Team successfully updated');
          history.push('/teams/');
        }
      })
      .catch((error) => Alert.danger(error.message));
  }

  addRevision() {
    const current_userId = localStorage.getItem('user_id');
    if (current_userId != null) {
      revisionService
        .addRevision(this.team.page_id, this.team.content, parseInt(current_userId, 10))
        .then(() => Alert.success('Revision saved successfully'))
        .catch((error) => {
          Alert.danger('Failed to save Revision');
        });
    }
  }

  deleteTeam() {
    teamService
      .deleteTeam(this.team.page_id)
      .then(() => {
        Alert.success('Team deleted');
        history.push('/teams/');
      })
      .catch((error: Error) => Alert.danger('Failed to delete team: ' + error.message));
  }
}

//Komponent for å legge til nytt team
export class TeamNew extends Component {
  team = {
    name: '',
    country_id: 0,
    coach: '',
    league: 0,
    emblem_image_url: '',
    content: '',
  };

  leagues: League[] = [];
  countries: Country[] = [];

  constructor(props: any) {
    super(props);
    this.saveTeam = this.saveTeam.bind(this);
  }

  handleContentChange = (content: string) => {
    this.team.content = content;
  };

  render() {
    return (
      <>
        <Button.Light onClick={() => history.push('/teams/')}>
          <FaArrowLeft /> Back to all teams
        </Button.Light>
        <Card title="New Team">
          <Row>
            <Column width={9}>
              <Card title="Team Content">
                <TextEditor
                  initialContent={this.team.content}
                  onContentChange={this.handleContentChange}
                />
              </Card>
            </Column>
            <Column width={3}>
              <Card title="Team Credentials">
                <form style={{ display: 'flex', flexDirection: 'column' }}>
                  <label>
                    Name:
                    <input
                      type="text"
                      value={this.team.name}
                      onChange={(event) => (this.team.name = event.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Coach:
                    <input
                      type="text"
                      value={this.team.coach}
                      onChange={(event) => (this.team.coach = event.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Emblem Image URL:
                    <input
                      type="text"
                      value={this.team.emblem_image_url}
                      onChange={(event) => (this.team.emblem_image_url = event.target.value)}
                      required
                    />
                  </label>
                  <label>
                    League:
                    <Form.Select
                      value={this.team.league}
                      onChange={({ target }) => (this.team.league = parseInt(target.value))}
                    >
                      <option value="">Select league</option>
                      {this.leagues.map((league) => (
                        <option key={league.id} value={league.id}>
                          {league.name}
                        </option>
                      ))}
                    </Form.Select>
                  </label>
                  <label>
                    Country:
                    <Form.Select
                      value={this.team.country_id}
                      onChange={({ target }) => (this.team.country_id = parseInt(target.value))}
                    >
                      <option value="">Select country</option>
                      {this.countries.map((country) => (
                        <option key={country.country_id} value={country.country_id}>
                          {country.country_name}
                        </option>
                      ))}
                    </Form.Select>
                  </label>
                  <Button.Success onClick={this.saveTeam}>Save</Button.Success>
                </form>
              </Card>
            </Column>
          </Row>
        </Card>
      </>
    );
  }

  async saveTeam() {
    console.log('Saving team: ' + this.team);
    await teamService
      .addTeam(
        this.team.name,
        this.team.country_id,
        this.team.coach,
        this.team.league,
        this.team.emblem_image_url,
        this.team.content,
      )
      .then((id) => {
        if (id !== -1) {
          Alert.success('Team successfully added');
          history.push('/team/' + id);
        } else {
          throw new Error('Invalid team Id');
        }
      })
      .catch((error: Error) => {
        console.error('Error adding team:', error.message);
        Alert.danger('Failed to add team. Please try again.');
      });
  }

  mounted() {
    teamService
      .getLeagues()
      .then((leagues: League[]) => {
        this.leagues = leagues;
        this.forceUpdate();
      })
      .catch((error: Error) => Alert.danger(error.message));

    playerService
      .getCountries()
      .then((countries: Country[]) => {
        this.countries = countries;
        this.forceUpdate();
      })
      .catch((error: Error) => Alert.danger(error.message));
  }
}

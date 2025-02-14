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
  Form,
  Details,
  RevisionComponent,
} from '../widgets';
import { NavLink } from 'react-router-dom';
import playerService from '../services/player-service';
import tagService from '../services/tag-service';
import { FaTrashAlt, FaArrowLeft } from 'react-icons/fa';
import { createHashHistory } from 'history';
import { Player, Country, Team, User, League, Tag, Page, Revisions } from '../types';
import { Editor } from '@tinymce/tinymce-react';
import get from 'tinymce';
import userService from '../services/user-service';
import { TextEditor } from './textEditor-component';
import CommentSection from './comment-components';
import revisionService from '../services/revision-service';

const history = createHashHistory();

//Komponent for å vise alle spillere
export class PlayerListAll extends Component {
  players: Player[] = [];
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
  error: string | null = null;

  render() {
    return (
      <>
        {this.user.user_id != 0 ? (
          <Button.Light onClick={() => history.push('/player_id/new')}>New player</Button.Light>
        ) : null}
        <Card2 title="All Players">
          {this.players.map((player) => (
            <Row key={player.id}>
              <Column width={11}>
                <Card3 title={<NavLink to={'/player/' + player.id}>{player.name}</NavLink>}>
                  <p>
                    Birth date:{' '}
                    {new Date(player.birth_date).toLocaleDateString('en-US', {
                      month: 'numeric',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  <p>
                    Height:{' '}
                    {parseFloat(String(player.height)).toFixed(2).replace(/\.00$/, '') + ' cm'}
                  </p>
                  <p>Country: {player.country_name}</p>
                  <p>Team: {player.team_name}</p>
                </Card3>
              </Column>
            </Row>
          ))}
        </Card2>
        {this.error && <div style={{ marginTop: '20px' }}>{'Error fetching players'}</div>}
      </>
    );
  }

  mounted() {
    playerService
      .listAllPlayers()
      .then((players: Player[]) => {
        this.players = players;
        this.error = null;
        this.forceUpdate();
      })
      .catch((error: any) => {
        console.error('Error fetching players:', error);
        this.error = `Error getting players: ${error.message}`;
      });

    const current_userId = localStorage.getItem('user_id');
    if (current_userId != null) {
      userService
        .getUserById(parseInt(current_userId, 10))
        .then((user: User) => {
          this.user = user;
        })
        .catch((error: any) => {
          console.error('Error fetching user:', error);
          this.error = `Error getting user: ${error.message}`;
        });
    }
  }
}

//Komponent for å vise et utvalg av spillere (til forsiden)
export class PlayerList extends Component {
  players: Player[] = [];
  error: string | null = null;

  render() {
    return (
      <>
        <Card2 title="Check out some of our players!">
          {this.players.map((player) => (
            <Row key={player.id}>
              <Column width={11}>
                <Card3 title={<NavLink to={'/player/' + player.id}>{player.name}</NavLink>}>
                  <p>
                    Birth date:{' '}
                    {new Date(player.birth_date).toLocaleDateString('en-US', {
                      month: 'numeric',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  <p>
                    Height:{' '}
                    {parseFloat(String(player.height)).toFixed(2).replace(/\.00$/, '') + ' cm'}
                  </p>
                  <p>Country: {player.country_name}</p>
                  <p>Team: {player.team_name}</p>
                </Card3>
              </Column>
            </Row>
          ))}
        </Card2>
        {this.error && <div style={{ marginTop: '20px' }}>{this.error}</div>}
        <Button.Light data-testid="playerAllButton" onClick={() => history.push('/players/')}>
          Get all players
        </Button.Light>
      </>
    );
  }

  mounted() {
    playerService
      .listSetAmountOfPlayers(10)
      .then((players: Player[]) => {
        this.players = players;
      })
      .then(() => {
        const user_id = localStorage.getItem('user_id');
        this.error = null;
      })
      .catch((error: any) => {
        console.error('Error fetching players:', error);
        this.error = `Error getting players: ${error.message}`;
      });
  }
}

//Side for å vise detaljer om en spesifikk valgt spiller
export class PlayerDetails extends Component<{ match: { params: { id: number } } }> {
  player: Player = {
    id: 0,
    name: '',
    birth_date: new Date(),
    height: 0,
    country_id: 0,
    country_name: '',
    team_id: 0,
    picture_url: '',
    page_id: 0,
    content: '',
    team_name: '',
    league_id: 0,
    league_name: '',
  };

  league: League | null = null;
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
    const formattedBirthDate =
      this.player.birth_date instanceof Date
        ? this.player.birth_date.toLocaleDateString()
        : new Date(this.player.birth_date).toLocaleDateString();

    const formattedCreated_at =
      this.page?.created_at instanceof Date
        ? this.page?.created_at.toLocaleDateString()
        : new Date(this.page.created_at).toLocaleDateString();

    const formattedRevised_at = this.revision?.revised_at
      ? this.revision.revised_at instanceof Date
        ? this.revision.revised_at.toLocaleDateString()
        : new Date(this.revision.revised_at).toLocaleDateString()
      : '';

    const formattedHeight = parseFloat(String(this.player.height)).toFixed(2).replace(/\.00$/, '');

    return (
      <>
        <Button.Light onClick={() => history.push('/players/')}>
          <FaArrowLeft /> Back to all players
        </Button.Light>
        <Details
          onNavigate={(path) => history.push(path)}
          title
          value={{
            id: this.player.id,
            name: this.player.name,
            content: this.player.content,
            birthDate: formattedBirthDate,
            height: formattedHeight,
            country_id: this.player.country_id,
            country_name: this.player.country_name,
            team_id: this.player.team_id,
            pictureUrl: this.player.picture_url,
            created_by: this.user?.username,
            created_at: formattedCreated_at,
            view_count: this.page?.view_count,
            revised_by: this.revision?.revised_by,
            revised_at: formattedRevised_at,
            page_id: this.player.page_id,
            team_name: this.player.team_name,
            league_name: this.league?.name,
            league_id: this.league?.id,
          }}
          buttonText="Edit Player"
          onEdit={() => {
            history.push('/player/' + this.player.id + '/edit');
          }}
          history={history}
        />

        <div style={{ marginTop: '20px' }}>
          <h3>Tags for {this.player.name}</h3>
          {this.tags.length > 0 ? (
            <ul>
              {this.tags.map((tag) => (
                <li key={tag.tag_id}>{tag.tag_name}</li>
              ))}
            </ul>
          ) : (
            <p>No tags available for this player.</p>
          )}
        </div>

        <CommentSection page_id={this.player.page_id} onNewComment={() => {}} />
      </>
    );
  }
  mounted() {
    playerService
      .getPlayer(this.props.match.params.id)
      .then((player) => {
        if (typeof player.birth_date === 'string') {
          player.birth_date = new Date(player.birth_date);
        }
        this.player = player;
        return Promise.all([
          playerService.getCreator(player.page_id),
          playerService.getPageHistory(player.page_id),
          playerService.getLeague(player.team_id),
          tagService.getTagsForPage(player.page_id),
          playerService.getRevisedName(player.page_id),
        ]);
      })
      .then(([user, page, league, tags, revision]) => {
        if (page) {
          page.created_at = new Date(page.created_at);
        }
        this.league = league;
        this.user = user;
        this.page = page;
        this.tags = tags;
        this.revision = revision;
        this.forceUpdate();
        return playerService.incrementViewCount(this.player.page_id);
      })
      .catch((error: Error) => Alert.danger(error.message));
  }
}

//Side for redigering av spiller
export class PlayerEdit extends Component<{ match: { params: { id: number } } }> {
  player: Player = {
    id: 0,
    name: '',
    birth_date: new Date(),
    height: 0,
    country_name: '',
    country_id: 0,
    team_id: 0,
    team_name: '',
    picture_url: '',
    page_id: 0,
    content: '',
    league_id: 0,
    league_name: '',
  };

  countries: Country[] = [];
  teams: Team[] = [];
  tags: Tag[] = [];
  playerTags: Tag[] = [];
  selectedTagId: number = 0;

  constructor(props: any) {
    super(props);
    this.updatePlayer = this.updatePlayer.bind(this);
    this.deletePlayer = this.deletePlayer.bind(this);
    this.addTagToPlayer = this.addTagToPlayer.bind(this);
    this.removeTagFromPlayer = this.removeTagFromPlayer.bind(this);
  }

  handleContentChange = (content: string) => {
    this.player.content = content;
  };

  render() {
    return (
      <>
        <Button.Light
          data-testid="playerBackID"
          onClick={() => history.push(`/player/${this.player.id}`)}
        >
          <FaArrowLeft /> Back to {this.player.name}
        </Button.Light>
        <Card title="Edit Player">
          <Row>
            <Column width={9}>
              <Card2 title="Edit player content">
                <TextEditor
                  initialContent={this.player.content}
                  onContentChange={this.handleContentChange}
                />
              </Card2>
            </Column>
            <Column width={3}>
              <RevisionComponent
                page_id={this.player.page_id}
                onContentChange={(content) => (this.player.content = content)}
              ></RevisionComponent>
              <Column>
                <Card title="Edit player credentials">
                  <form style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
                    <label style={{ marginBottom: '10px' }}>
                      Name:
                      <input
                        type="text"
                        value={this.player.name}
                        onChange={(event) => (this.player.name = event.target.value)}
                      />
                    </label>
                    <label style={{ marginBottom: '10px' }}>
                      Height:
                      <input
                        type="number"
                        value={this.player.height}
                        onChange={(event) => (this.player.height = Number(event.target.value))}
                      />
                    </label>
                    <label style={{ marginBottom: '10px' }}>
                      Birth date:
                      <input
                        type="date"
                        value={
                          this.player.birth_date instanceof Date
                            ? this.player.birth_date.toISOString().split('T')[0]
                            : ''
                        }
                        onChange={(event) =>
                          (this.player.birth_date = new Date(event.target.value))
                        }
                      />
                    </label>
                    <label>
                      Country:
                      <Form.Select
                        value={this.player.country_id}
                        onChange={(event) => {
                          this.player.country_id = Number(event.target.value);
                        }}
                        style={{ marginBottom: '10px' }}
                      >
                        <option value="">Select country</option>
                        {this.countries.map((country) => {
                          return (
                            <option key={country.country_id} value={country.country_id}>
                              {country.country_name}
                            </option>
                          );
                        })}
                      </Form.Select>
                    </label>
                    <label>
                      Team:
                      <Form.Select
                        value={this.player.team_id}
                        onChange={(event) => {
                          this.player.team_id = Number(event.target.value);
                        }}
                      >
                        <option value="">Select team</option>
                        {this.teams.map((team) => (
                          <option key={team.id} value={team.id}>
                            {team.name}
                          </option>
                        ))}
                      </Form.Select>
                    </label>
                    <label>
                      Picture URL:
                      <input
                        type="text"
                        value={this.player.picture_url}
                        onChange={(event) => (this.player.picture_url = event.target.value)}
                      />
                    </label>
                    <label>Tags:</label>
                    <ul>
                      {this.playerTags.map((tag) => (
                        <li
                          key={tag.tag_id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '5px',
                          }}
                        >
                          {tag.tag_name}
                          <Button.Danger
                            data-testid="removeTagButton"
                            small
                            onClick={() => this.removeTagFromPlayer(tag.tag_id)}
                          >
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
                      <Button.Success onClick={this.addTagToPlayer}>Add Tag</Button.Success>
                    </div>
                    <Row>
                      <Column>
                        <Button.Success
                          onClick={() => {
                            this.updatePlayer();
                            this.addRevision();
                          }}
                        >
                          Save Changes
                        </Button.Success>
                      </Column>
                      <Column>
                        <Button.Danger onClick={this.deletePlayer}>Delete Player</Button.Danger>
                      </Column>
                    </Row>
                  </form>
                </Card>
              </Column>
            </Column>
          </Row>
        </Card>
      </>
    );
  }

  updatePlayer() {
    const formattedBirthDate =
      this.player.birth_date instanceof Date
        ? this.player.birth_date.toISOString().split('T')[0]
        : this.player.birth_date;

    playerService
      .updatePlayer(
        this.player.id,
        this.player.name,
        formattedBirthDate,
        this.player.height,
        this.player.country_id,
        this.player.team_id,
        this.player.picture_url,
        this.player.page_id,
        this.player.content,
      )
      .then(() => {
        Alert.success('Player successfully updated');
        history.push('/player/' + this.player.id);
      })
      .catch((error: Error) => Alert.danger(error.message));
  }
  addRevision() {
    const current_userId = localStorage.getItem('user_id');
    if (current_userId != null) {
      revisionService
        .addRevision(this.player.page_id, this.player.content, parseInt(current_userId, 10))
        .then(() => Alert.success('Revision saved successfully'))
        .catch((error) => {
          Alert.danger('Failed to save Revision');
        });
    }
  }

  deletePlayer() {
    playerService
      .deletePlayer(this.player.page_id)
      .then(() => {
        Alert.success('Player deleted successfully');
        history.push('/players');
      })
      .catch((error: Error) => Alert.danger('Failed to delete player: ' + error.message));
  }

  addTagToPlayer() {
    if (!this.selectedTagId) {
      Alert.danger('Please select a tag to add');
      return;
    }
    tagService
      .addTagToPage(this.player.page_id, this.selectedTagId)
      .then(() => {
        Alert.success('Tag added to player');
        return tagService.getTagsForPage(this.player.page_id);
      })
      .then((tags) => {
        this.playerTags = tags;
        this.selectedTagId = 0;
      })
      .catch((error) => Alert.danger('Error adding tag to player: ' + error.message));
  }

  removeTagFromPlayer(tagId: number) {
    tagService
      .removeTagFromPage(this.player.page_id, tagId)
      .then(() => {
        Alert.success('Tag removed from league');
        this.playerTags = this.playerTags.filter((tag) => tag.tag_id !== tagId);
        this.forceUpdate();
      })
      .catch((error: Error) => {
        Alert.danger('Error removing tag from league: ' + error.message);
      });
  }

  async mounted() {
    playerService
      .getPlayer(this.props.match.params.id)
      .then((player: Player) => {
        if (typeof player.birth_date === 'string') {
          player.birth_date = new Date(player.birth_date);
        }
        this.player = player;
        this.forceUpdate();
        return tagService.getTagsForPage(this.player.page_id);
      })
      .then((tags) => {
        this.playerTags = tags;
      })
      .catch((error: Error) => Alert.danger(error.message));

    playerService
      .getCountries()
      .then((countries: Country[]) => {
        this.countries = countries;
        this.forceUpdate();
      })
      .catch((error: Error) => Alert.danger(error.message));

    playerService
      .getTeams()
      .then((teams: Team[]) => {
        this.teams = teams;
        this.forceUpdate();
      })
      .catch((error: Error) => Alert.danger(error.message));

    tagService
      .getTags()
      .then((tags) => {
        this.tags = tags;
      })
      .catch((error: Error) => {
        Alert.danger('Error fetching tags: ' + error.message);
      });
  }
}

//Side for å opprette ny spiller
export class PlayerNew extends Component {
  player: Player = {
    id: 0,
    page_id: 0,
    name: '',
    birth_date: new Date(),
    height: 0,
    country_id: 0,
    country_name: '',
    team_id: 0,
    picture_url: '',
    content: '',
    team_name: '',
    league_id: 0,
    league_name: '',
  };

  countries: Country[] = [];
  teams: Team[] = [];

  constructor(props: any) {
    super(props);
    this.savePlayer = this.savePlayer.bind(this);
  }

  handleContentChange = (content: string) => {
    this.player.content = content;
  };

  render() {
    return (
      <>
        <Button.Light data-testid="playerAllBack" onClick={() => history.push('/players/')}>
          <FaArrowLeft /> Back to all players
        </Button.Light>
        <Card title="New Player">
          <Row>
            <Column width={9}>
              <Card2 title="Player content">
                <TextEditor
                  initialContent={this.player.content}
                  onContentChange={this.handleContentChange}
                />
              </Card2>
            </Column>
            <Column width={3}>
              <Card2 title="Player credentials">
                <form style={{ display: 'flex', flexDirection: 'column' }}>
                  <label>
                    Name:
                    <input
                      type="text"
                      value={this.player.name}
                      onChange={(event) => (this.player.name = event.target.value)}
                    />
                  </label>
                  <label>
                    Height:
                    <input
                      type="number"
                      value={this.player.height}
                      onChange={(event) => (this.player.height = Number(event.target.value))}
                    />
                  </label>
                  <label>
                    Birth date:
                    <input
                      type="date"
                      value={
                        this.player.birth_date instanceof Date
                          ? this.player.birth_date.toISOString().split('T')[0]
                          : ''
                      }
                      onChange={(event) => (this.player.birth_date = new Date(event.target.value))}
                    />
                  </label>
                  <label>
                    Country:
                    <Form.Select
                      value={this.player.country_id}
                      onChange={({ target }) => (this.player.country_id = parseInt(target.value))}
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
                    Team:
                    <Form.Select
                      value={this.player.team_id}
                      onChange={({ target }) => (this.player.team_id = parseInt(target.value))}
                    >
                      <option value="">Select team</option>
                      {this.teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </Form.Select>
                  </label>
                  <label>
                    Picture URL:
                    <input
                      type="text"
                      value={this.player.picture_url}
                      onChange={(event) => (this.player.picture_url = event.target.value)}
                    />
                  </label>
                  <Button.Success onClick={this.savePlayer}>Save</Button.Success>
                </form>
              </Card2>
            </Column>
          </Row>
        </Card>
      </>
    );
  }

  async savePlayer() {
    const formattedBirthDate =
      this.player.birth_date instanceof Date
        ? this.player.birth_date.toISOString().split('T')[0]
        : this.player.birth_date;
    await playerService
      .addPlayer(
        this.player.name,
        formattedBirthDate,
        this.player.height,
        this.player.country_id.toString(),
        this.player.team_id.toString(),
        this.player.picture_url,
        this.player.content,
      )
      .then((id) => {
        if (id !== -1) {
          Alert.success('Player successfully added');
          history.push('/player/' + id);
        } else {
          throw new Error('Invalid player ID');
        }
      })
      .catch((error: Error) => {
        console.error('Error adding player:', error.message);
        Alert.danger('Failed to add player. Please try again.');
      });
  }

  mounted() {
    playerService
      .getCountries()
      .then((countries: Country[]) => {
        this.countries = countries;
      })
      .catch((error: Error) => Alert.danger(error.message));

    playerService
      .getTeams()
      .then((teams: Team[]) => {
        this.teams = teams;
      })
      .catch((error: Error) => Alert.danger(error.message));
  }
}

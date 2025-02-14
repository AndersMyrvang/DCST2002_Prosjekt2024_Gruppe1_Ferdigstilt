import * as React from 'react';
import { Component } from 'react-simplified';
import {
  Alert,
  Card,
  Row,
  Column,
  Form,
  Button,
  Card2,
  Card3,
  Details,
  RevisionComponent,
} from '../widgets';
import { NavLink } from 'react-router-dom';
import leagueService from '../services/league-service';
import playerService from '../services/player-service';
import tagService from '../services/tag-service';
import { createHashHistory } from 'history';
import { League, Country, User, Tag, Page, Revisions } from '../types';
import { FaArrowLeft, FaTrashAlt } from 'react-icons/fa';
import { Editor } from '@tinymce/tinymce-react';
import { TextEditor } from './textEditor-component';
import { CommentSection, NewComment } from './comment-components';
import { Team } from '../types';
import revisionService from '../services/revision-service';
import userService from '../services/user-service';

const history = createHashHistory();

//Komponent for å vise alle leagues
export class LeagueListAll extends Component {
  leagues: League[] = [];
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
  isLoading: boolean = true;

  render() {
    if (this.isLoading) {
      return <div>Loading...</div>;
    }

    if (this.leagues.length === 0) {
      return <div>No leagues found</div>;
    }

    return (
      <>
        {this.user.user_id != 0 ? (
          <Button.Light onClick={() => history.push('/league_id/new')}>New league</Button.Light>
        ) : null}
        <Card2 title="All Leagues">
          {this.leagues.map((league) => (
            <Row key={league.name}>
              <Column width={11}>
                <Card3 title={<NavLink to={'/league/' + league.id}>{league.name}</NavLink>}>
                  <p>League: {league.name}</p>
                  <p>Country: {league.country_name}</p>
                  <img
                    src={league.emblem_image_url}
                    alt={`Emblem of ${league.name}`}
                    width="30px"
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
    leagueService
      .listAllLeagues()
      .then((leagues: League[]) => {
        this.leagues = leagues;
        this.isLoading = false;
        this.forceUpdate();
      })
      .catch((error: any) => {
        console.error('Error fetching leagues:', error);
        Alert.danger('Error getting leagues: ' + error.message);
      });

    const current_userId = localStorage.getItem('user_id');
    if (current_userId != null) {
      userService
        .getUserById(parseInt(current_userId, 10))
        .then((user: User) => {
          this.user = user;
          this.forceUpdate();
        })
        .catch((error) => {
          console.error('Error getting user: ', error);
          Alert.danger('Error getting user: ' + error.message);
        });
    }
  }
}

//Komponent for å vise et utvalg av leagues (til forsiden)
export class LeagueList extends Component {
  league: League[] = [];

  render() {
    return (
      <>
        <Card2 title="Check out some of our leagues!">
          {this.league.map((league) => (
            <Row key={league.id}>
              <Column width={11}>
                <Card3 title={<NavLink to={'/league/' + league.id}>{league.name}</NavLink>}>
                  <p>League: {league.name}</p>
                  <p>Country: {league.country_name}</p>
                  <img
                    src={`${league.emblem_image_url}`}
                    alt={`Bilde fra ${league.emblem_image_url}`}
                    width={'30px'}
                  />
                </Card3>
              </Column>
            </Row>
          ))}
        </Card2>
        <Button.Light onClick={() => history.push('/leagues/')}>Get all league</Button.Light>
      </>
    );
  }

  mounted() {
    // Fetch a set amount of leagues (5 in this case)
    leagueService
      .listSetAmountOfLeagues(5)
      .then((leagues: League[]) => {
        this.league = leagues;
      })
      .catch((error: any) => {
        console.error('Error fetching leagues:', error);
        Alert.danger('Error getting leagues: ' + error.message);
      });
  }
}

//Side for detaljer om en spesifikk league
export class LeagueDetails extends Component<{ match: { params: { id: number } } }> {
  league: League = {
    id: 0,
    name: '',
    country_id: 0,
    country_name: '',
    emblem_image_url: '',
    page_id: 0,
    content: '',
  };

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
  tags: Tag[] = [];
  page: Page = {
    created_at: new Date(),
    view_count: 0,
  };
  teams: Team[] = [];

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
        <Button.Light onClick={() => history.push('/leagues/')}>
          <FaArrowLeft /> Back to all leagues
        </Button.Light>
        <Details
          onNavigate={(path) => history.push(path)}
          title
          value={{
            id: this.league.id,
            name: this.league.name,
            country_id: this.league.country_id,
            country_name: this.league.country_name,
            emblem_image_url: this.league.emblem_image_url,
            page_id: this.league.page_id,
            content: this.league.content,
            created_by: this.user ? this.user.username : 'Unknown',
            created_at: formattedCreated_at,
            revised_by: this.revision.revised_by,
            revised_at: formattedRevised_at,
            view_count: this.page.view_count,
            teams: this.teams.map((team) => ({ team_id: team.id, team_name: team.name })),
          }}
          buttonText="Edit League"
          onEdit={() => {
            history.push('/league/' + this.league.id + '/edit');
          }}
          history={history}
        />

        <div style={{ marginTop: '20px' }}>
          <h3>Tags for {this.league.name}</h3>
          {this.tags.length > 0 ? (
            <ul>
              {this.tags.map((tag) => (
                <li key={tag.tag_id}>{tag.tag_name}</li>
              ))}
            </ul>
          ) : (
            <p>No tags available for this league.</p>
          )}
        </div>

        <CommentSection page_id={this.league.page_id} onNewComment={() => {}} />
      </>
    );
  }

  mounted() {
    leagueService
      .getLeague(this.props.match.params.id)
      .then((league: League) => {
        this.league = league;
        return Promise.all([
          playerService.getCreator(league.page_id) as Promise<User>,
          playerService.getPageHistory(league.page_id),
          playerService.getRevisedName(league.page_id),
          tagService.getTagsForPage(league.page_id),
        ]);
      })
      .then(([user, page, revision, tags]) => {
        if (page) {
          page.created_at = new Date(page.created_at);
        }
        this.user = user;
        this.page = page;
        this.tags = tags;
        this.revision = revision;
        this.forceUpdate();
        return playerService.incrementViewCount(this.league.page_id);
      })
      .catch((error: Error) => Alert.danger(error.message));

    leagueService
      .getTeamsInLeague(this.props.match.params.id)
      .then((teams) => {
        this.teams = teams;
        this.forceUpdate();
      })
      .catch((error: Error) => Alert.danger(error.message));
  }
}

//Side for redigering av en spesifikk league
export class LeagueEdit extends Component<{ match: { params: { id: number } } }> {
  league: League = {
    id: 0,
    name: '',
    country_id: 0,
    country_name: '',
    emblem_image_url: '',
    page_id: 0,
    content: '',
  };

  countries: Country[] = [];
  tags: Tag[] = [];
  leagueTags: Tag[] = [];
  selectedTagId: number = 0;
  error: string = '';

  constructor(props: any) {
    super(props);
    this.updateLeague = this.updateLeague.bind(this);
    this.deleteLeague = this.deleteLeague.bind(this);
    this.addTagToLeague = this.addTagToLeague.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
  }

  handleContentChange(content: string) {
    this.league.content = content;
    this.forceUpdate();
  }

  render() {
    return (
      <>
        <Button.Light onClick={() => history.push(`/league/${this.league.id}`)}>
          <FaArrowLeft /> Back to {this.league.name}
        </Button.Light>
        <Card title="Edit League">
          <Row>
            <Column width={9}>
              <Card2 title="Edit league content">
                <TextEditor
                  initialContent={this.league.content}
                  onContentChange={this.handleContentChange}
                />
              </Card2>
            </Column>
            <Column width={3}>
              <RevisionComponent
                page_id={this.league.page_id}
                onContentChange={(content) => (this.league.content = content)}
              ></RevisionComponent>
              <Column>
                <Card2 title="League Details">
                  <form style={{ display: 'flex', flexDirection: 'column' }}>
                    <label>
                      Name:
                      <input
                        type="text"
                        value={this.league.name}
                        onChange={(event) => (this.league.name = event.target.value)}
                        style={{ marginBottom: '10px' }}
                      />
                    </label>
                    <label>
                      Country:
                      <Form.Select
                        value={this.league.country_id}
                        onChange={({ target }) => (this.league.country_id = parseInt(target.value))}
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
                      Emblem Image URL:
                      <input
                        type="text"
                        value={this.league.emblem_image_url}
                        onChange={(event) => (this.league.emblem_image_url = event.target.value)}
                        style={{ marginBottom: '10px' }}
                      />
                    </label>
                    <label style={{ marginBottom: '10px' }}>Tags:</label>
                    <ul style={{ marginBottom: '10px' }}>
                      {this.leagueTags.map((tag) => (
                        <li
                          key={tag.tag_id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '5px',
                          }}
                        >
                          {tag.tag_name}
                          <Button.Danger small onClick={() => this.removeTagFromLeague(tag.tag_id)}>
                            <FaTrashAlt />
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
                      <Button.Success onClick={this.addTagToLeague}>Add Tag</Button.Success>
                    </div>
                    {this.error && <p style={{ color: 'red' }}>{this.error}</p>}{' '}
                    <Row>
                      <Column>
                        <Button.Success
                          onClick={() => {
                            this.updateLeague();
                            this.addRevision();
                          }}
                        >
                          Save Changes
                        </Button.Success>
                      </Column>
                      <Column>
                        <Button.Danger onClick={this.deleteLeague}>Delete League</Button.Danger>
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

  mounted() {
    leagueService
      .getLeague(this.props.match.params.id)
      .then((league: League) => {
        this.league = league;
        this.forceUpdate();
        return tagService.getTagsForPage(this.league.page_id);
      })
      .then((tags) => {
        this.leagueTags = tags;
      })
      .catch((error: any) => {
        Alert.danger('Error fetching league data or tags: ' + error.message);
      });

    playerService
      .getCountries()
      .then((countries: Country[]) => {
        this.countries = countries;
      })
      .catch((error: Error) => {
        Alert.danger('Error fetching countries: ' + error.message);
      });

    tagService
      .getTags()
      .then((tags) => {
        this.tags = tags;
      })
      .catch((error: Error) => {
        Alert.danger('Error fetching tags: ' + error.message);
      });
  }

  updateLeague() {
    if (!this.league.name) {
      this.error = 'Name is required';
      this.forceUpdate();
      return;
    }

    leagueService
      .updateLeague(
        this.league.id,
        this.league.name,
        this.league.country_id,
        this.league.emblem_image_url,
        this.league.page_id,
        this.league.content,
      )
      .then(() => {
        Alert.success('League updated successfully');
        history.push('/league/' + this.league.id);
      })
      .catch((error: Error) => {
        Alert.danger('Failed to update league: ' + error.message);
      });
  }

  addRevision() {
    const current_userId = localStorage.getItem('user_id');
    if (current_userId != null) {
      revisionService
        .addRevision(this.league.page_id, this.league.content, parseInt(current_userId, 10))
        .then(() => Alert.success('Revision saved successfully'))
        .catch((error) => {
          Alert.danger('Failed to save Revision');
        });
    }
  }

  deleteLeague() {
    leagueService
      .deleteLeague(this.league.page_id)
      .then(() => {
        Alert.success('League deleted successfully');
        history.push('/leagues');
      })
      .catch((error: Error) => {
        Alert.danger('Failed to delete league: ' + error.message);
      });
  }

  addTagToLeague() {
    if (!this.selectedTagId) {
      Alert.danger('Please select a tag to add');
      return;
    }
    tagService
      .addTagToPage(this.league.page_id, this.selectedTagId)
      .then(() => {
        Alert.success('Tag added to league');
        return tagService.getTagsForPage(this.league.page_id);
      })
      .then((tags) => {
        this.leagueTags = tags;
        this.forceUpdate();
      })
      .catch((error: Error) => {
        Alert.danger('Error adding tag to league: ' + error.message);
      });
  }

  removeTagFromLeague(tagId: number) {
    tagService
      .removeTagFromPage(this.league.page_id, tagId)
      .then(() => {
        Alert.success('Tag removed from league');
        this.leagueTags = this.leagueTags.filter((tag) => tag.tag_id !== tagId);
        this.forceUpdate();
      })
      .catch((error: Error) => {
        Alert.danger('Error removing tag from league: ' + error.message);
      });
  }
}

//Side for oppretting av ny league
export class LeagueNew extends Component {
  league = {
    name: '',
    country: 0,
    emblem_image_url: '',
    content: '',
  };

  countries: Country[] = [];

  constructor(props: any) {
    super(props);
    this.saveLeague = this.saveLeague.bind(this);
  }

  handleContentChange = (content: string) => {
    this.league.content = content;
  };

  render() {
    return (
      <>
        <Button.Light onClick={() => history.push('/leagues/')}>
          <FaArrowLeft /> Back to all leagues
        </Button.Light>
        <Card title="New League">
          <Row>
            <Column width={9}>
              <Card title="League Content">
                <TextEditor
                  initialContent={this.league.content}
                  onContentChange={this.handleContentChange}
                />
              </Card>
            </Column>
            <Column width={3}>
              <Card title="League Credentials">
                <form style={{ display: 'flex', flexDirection: 'column' }}>
                  <label>
                    Name:
                    <input
                      type="text"
                      value={this.league.name}
                      onChange={(event) => (this.league.name = event.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Emblem Image URL:
                    <input
                      type="text"
                      value={this.league.emblem_image_url}
                      onChange={(event) => (this.league.emblem_image_url = event.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Country:
                    <Form.Select
                      value={this.league.country}
                      onChange={({ target }) => (this.league.country = parseInt(target.value))}
                    >
                      <option value="">Select country</option>
                      {this.countries.map((country) => (
                        <option key={country.country_id} value={country.country_id}>
                          {country.country_name}
                        </option>
                      ))}
                    </Form.Select>
                  </label>
                  <Button.Success onClick={this.saveLeague}>Save</Button.Success>
                </form>
              </Card>
            </Column>
          </Row>
        </Card>
      </>
    );
  }

  async saveLeague() {
    await leagueService
      .addLeague(
        this.league.name,
        this.league.country,
        this.league.emblem_image_url,
        this.league.content,
      )
      .then((id) => {
        if (id !== -1) {
          Alert.success('League successfully added');
          history.push('/leagues');
        } else {
          throw new Error('Invalid League id');
        }
      })
      .catch((error: Error) => {
        console.error('Error adding league:', error.message);
        Alert.danger('Failed to add league. Please try again.');
      });
  }

  mounted() {
    playerService
      .getCountries()
      .then((countries) => {
        this.countries = countries;
      })
      .catch((error: Error) => Alert.danger(error.message));
  }
}

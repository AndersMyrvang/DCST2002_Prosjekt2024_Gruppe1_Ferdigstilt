import * as React from 'react';
import { ReactNode, ChangeEvent } from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';
import { History } from 'history';
import revisionService from './services/revision-service';
import { Revisions, User } from '../../client/src/types';
import userService from './services/user-service';

/**
 * Renders an information card using Bootstrap classes.
 *
 * Properties: title
 */
export class Card extends Component<{ title: ReactNode }> {
  render() {
    return (
      <div className="card card1">
        <div className="card-body card-body1">
          <h5 className="card-title card-title1">{this.props.title}</h5>
          <div className="card-text card-text1">{this.props.children}</div>
        </div>
      </div>
    );
  }
}

export class Card2 extends Component<{ title: ReactNode }> {
  render() {
    return (
      <div className="card card2 ">
        <div className="card-body card-body2 ">
          <h5 className="card-title card-title2">{this.props.title}</h5>
          <div className="card-content card-content2">{this.props.children}</div>
        </div>
      </div>
    );
  }
}

export class Card3 extends Component<{ title: ReactNode }> {
  render() {
    return (
      <div className="card card3 ">
        <div className="card-body card-body3 ">
          <h5 className="card-title card-title 3">{this.props.title}</h5>
          <div className="card-content card-content3">{this.props.children}</div>
        </div>
      </div>
    );
  }
}

export class Card4 extends Component<{ title: ReactNode }> {
  render() {
    return (
      <div className="card card4 ">
        <div className="card-body card-body4 ">
          <h5 className="card-title card-title4">{this.props.title}</h5>
          <div className="card-content card-content4">{this.props.children}</div>
        </div>
      </div>
    );
  }
}

interface RevisionProps {
  page_id: number;
  onContentChange: (content: string) => void;
}

//Komponent for felles visning av revisjoner
export class RevisionComponent extends Component<RevisionProps> {
  revisions: Revisions[] = [];
  selectedRevisionId: number | string = '';

  render() {
    return (
      <>
        <Column>
          <Card2 title="Revisions">
            <Form.Select
              value={this.selectedRevisionId}
              onChange={(event) => {
                this.selectedRevisionId = event.currentTarget.value;
                const currentRevisionId = parseInt(this.selectedRevisionId, 10);
                const selectedRevision = this.revisions.find(
                  (revision) => revision.revision_id == currentRevisionId,
                );
                if (selectedRevision) {
                  this.props.onContentChange(selectedRevision.content);
                } else Alert.danger('Revision ID not found');
              }}
            >
              <option value="">Select revision</option>
              {this.revisions.map((revision) => (
                <option key={revision.revision_id} value={revision.revision_id}>
                  {new Date(revision.revised_at).toISOString().split('T')[0] +
                    ' by ' +
                    revision.username}
                </option>
              ))}
            </Form.Select>
          </Card2>
        </Column>
      </>
    );
  }

  mounted() {
    revisionService.getRevisions(this.props.page_id).then((revisions: Revisions[]) => {
      this.revisions = revisions;
    });
  }
}

interface DetailsProps {
  title: ReactNode;
  value: {
    id: number;
    name: string;
    content: string;
    birthDate?: string;
    height?: string;
    country_name?: string;
    country_id?: number;
    team_name?: string;
    pictureUrl?: string;
    created_by?: any;
    page_id?: number;
    created_at?: string;
    view_count?: number;
    revised_by?: any;
    revised_at?: string;
    league_name?: string;
    league_id?: number;
    team_id?: number;
    emblem_image_url?: string;
    first_login?: Date;
    last_login?: Date;
    last_logout?: Date | null;
    is_admin?: boolean;
    teams?: { team_id: number; team_name: string }[];
    players?: { id: number; name: string }[];
  };
  buttonText: string;
  onEdit: (id: number) => void;
  onNavigate: (path: string) => void;
  history: History;
}

//Felles oversikt over det som skal vises i detaljsiden av enten spiller, lag eller league
export class Details extends Component<DetailsProps> {
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
    const { title, value, buttonText, onEdit, onNavigate } = this.props;

    return (
      <>
        <Card title={title}>
          <h2>{value.name}</h2>
          <Row>
            <Column width={7}>
              <Row>
                <Card4 title>
                  <div dangerouslySetInnerHTML={{ __html: value.content }}></div>
                  <Row>
                    <Column>
                      {this.user.user_id != 0 ? (
                        <Button.Light onClick={() => onEdit(value.id)} data-testid="edit-button">
                          {buttonText}
                        </Button.Light>
                      ) : null}
                    </Column>
                  </Row>
                </Card4>
              </Row>
            </Column>
            <Column width={3}>
              <Row>
                <Card2 title={value.name}>
                  <Column width={11}>
                    <Card4 title>
                      {value.emblem_image_url && (
                        <img
                          src={value.emblem_image_url}
                          alt={`Image from ${value.emblem_image_url}`}
                          width="360px"
                          onError={() => console.error('Image not found')}
                        />
                      )}

                      {value.pictureUrl && (
                        <img
                          src={value.pictureUrl}
                          alt={`Image from ${value.pictureUrl}`}
                          width="360px"
                          onError={() => console.error('Image not found')}
                        />
                      )}
                      {value.birthDate && (
                        <p>
                          <b>Birth date:</b> {value.birthDate}
                        </p>
                      )}
                      {value.height && (
                        <p>
                          <b>Height:</b> {value.height} cm
                        </p>
                      )}
                      {value.country_name && (
                        <p>
                          <b>Country:</b> {value.country_name}
                        </p>
                      )}
                      {this.props.value.team_name && (
                        <p>
                          <b>Team:</b>{' '}
                          <a
                            onClick={() => onNavigate(`/team/${this.props.value.team_id}`)}
                            style={{
                              color: 'blue',
                              textDecoration: 'underline',
                              cursor: 'pointer',
                            }}
                          >
                            {this.props.value.team_name}
                          </a>
                        </p>
                      )}
                      {this.props.value.league_name && (
                        <p>
                          <b>League:</b>{' '}
                          <a
                            onClick={() => onNavigate(`/league/${this.props.value.league_id}`)}
                            style={{
                              color: 'blue',
                              textDecoration: 'underline',
                              cursor: 'pointer',
                            }}
                          >
                            {this.props.value.league_name}
                          </a>
                        </p>
                      )}
                      {this.props.value.teams && (
                        <p>
                          <b>Teams:</b>
                          {this.props.value.teams.map((team) => (
                            <a
                              key={team.team_id}
                              onClick={() => onNavigate(`/team/${team.team_id}`)}
                              style={{
                                color: 'blue',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                              }}
                            >
                              <br />
                              {team.team_name}
                            </a>
                          ))}
                        </p>
                      )}
                      {this.props.value.players && (
                        <p>
                          <b>Players:</b>
                          {this.props.value.players.map((player) => (
                            <a
                              key={player.id}
                              onClick={() => onNavigate(`/player/${player.id}`)}
                              style={{
                                color: 'blue',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                              }}
                            >
                              <br />
                              {player.name}
                            </a>
                          ))}
                        </p>
                      )}
                      {this.user.user_id != 0 ? (
                        <Button.Light onClick={() => onEdit(value.id)}>{buttonText}</Button.Light>
                      ) : null}
                    </Card4>
                  </Column>
                </Card2>
              </Row>
            </Column>
          </Row>
          <Card title="Page History">
            <div
              style={{
                marginLeft: '60px',
                display: 'flex',
                width: '1080px',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}
            >
              {value.created_by ||
              value.created_at ||
              value.revised_at ||
              value.revised_by ||
              value.view_count ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    width: '100%',
                  }}
                >
                  <p style={{ flex: 1, textAlign: 'left', marginRight: '20px' }}>
                    Laget av: {value.created_by || 'Unknown'},{' '}
                    {value.created_at ? value.created_at : 'Unknown'}
                  </p>
                  <p style={{ flex: 1, textAlign: 'center', marginRight: '20px' }}>
                    Sist oppdatert av:
                    {value.revised_by
                      ? ' ' + value.revised_by + ', '
                      : ' Denne siden har ikke blitt revidert enda'}
                    {value.revised_at ? value.revised_at : ''}
                  </p>
                  <p style={{ flex: 1, textAlign: 'right' }}>View count: {value.view_count || 0}</p>
                </div>
              ) : (
                <div style={{ width: '100%' }}>
                  <p data-testid="no-history">No history available for this page.</p>
                </div>
              )}
            </div>
          </Card>
        </Card>
      </>
    );
  }
  mounted() {
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

/**
 * Renders a row using Bootstrap classes.
 */
export class Row extends Component {
  render() {
    return <div className="row">{this.props.children}</div>;
  }
}

/**
 * Renders a column with specified width using Bootstrap classes.
 *
 * Properties: width, right
 */
export class Column extends Component<{ width?: number; right?: boolean }> {
  render() {
    return (
      <div className={'col' + (this.props.width ? '-' + this.props.width : '')}>
        <div className={'float-' + (this.props.right ? 'end' : 'start')}>{this.props.children}</div>
      </div>
    );
  }
}

/**
 * Renders a success button using Bootstrap styles.
 *
 * Properties: small, onClick
 */
class ButtonSuccess extends Component<{
  small?: boolean;
  onClick: () => void;
}> {
  render() {
    return (
      <button
        type="button"
        className="btn btn-success"
        style={
          this.props.small
            ? {
                padding: '5px 5px',
                fontSize: '16px',
                lineHeight: '0.7',
              }
            : {}
        }
        onClick={this.props.onClick}
      >
        {this.props.children}
      </button>
    );
  }
}

/**
 * Renders a danger button using Bootstrap styles.
 *
 * Properties: small, onClick
 */
class ButtonDanger extends Component<{
  small?: boolean;
  onClick: () => void;
}> {
  render() {
    return (
      <button
        type="button"
        className="btn btn-danger"
        style={
          this.props.small
            ? {
                padding: '5px 5px',
                fontSize: '16px',
                lineHeight: '0.7',
              }
            : {}
        }
        onClick={this.props.onClick}
      >
        {this.props.children}
      </button>
    );
  }
}

/**
 * Renders a light button using Bootstrap styles.
 *
 * Properties: small, onClick
 */
class ButtonLight extends Component<{
  small?: boolean;
  onClick: () => void;
  [key: string]: any; 
}> {
  render() {
    const { small, onClick, ...rest } = this.props;
    return (
      <button
        type="button"
        className="btn btn-light"
        style={
          small
            ? {
                padding: '5px 5px',
                fontSize: '16px',
                lineHeight: '0.7',
              }
            : {}
        }
        onClick={onClick}
        {...rest} 
      >
        {this.props.children}
      </button>
    );
  }
}

/**
 * Renders a button using Bootstrap styles.
 *
 * Properties: onClick
 */
export class Button {
  static Success = ButtonSuccess;
  static Danger = ButtonDanger;
  static Light = ButtonLight;
}

/**
 * Renders a NavBar link using Bootstrap styles.
 *
 * Properties: to
 */
class NavBarLink extends Component<{ to: string }> {
  render() {
    return (
      <NavLink className="nav-link" activeClassName="active" to={this.props.to}>
        {this.props.children}
      </NavLink>
    );
  }
}

/**
 * Renders a NavBar using Bootstrap classes.
 *
 * Properties: brand
 */
export class NavBar extends Component<{ brand: ReactNode }> {
  static Link = NavBarLink;

  render() {
    return (
      <nav className="navbar navbar-expand-sm navbar-light bg-light">
        <div className="container-fluid justify-content-start">
          <NavLink className="navbar-brand" activeClassName="active" exact to="/">
            {this.props.brand}
          </NavLink>
          <div className="navbar-nav">{this.props.children}</div>
        </div>
      </nav>
    );
  }
}

/**
 * Renders a form label using Bootstrap styles.
 */
class FormLabel extends Component {
  render() {
    return <label className="col-form-label">{this.props.children}</label>;
  }
}

/**
 * Renders a form input using Bootstrap styles.
 */
class FormInput extends Component<{
  type: string;
  value: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  [prop: string]: any;
}> {
  render() {
    // ...rest will contain extra passed attributes such as disabled, required, width, height, pattern
    // For further information, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
    const { type, value, onChange, ...rest } = this.props;
    return (
      <input
        {...rest}
        className="form-control"
        type={this.props.type}
        value={this.props.value}
        onChange={this.props.onChange}
      />
    );
  }
}

/**
 * Renders a form textarea using Bootstrap styles.
 */
class FormTextarea extends React.Component<{
  value: string | number;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  [prop: string]: any;
}> {
  render() {
    // ...rest will contain extra passed attributes such as disabled, required, rows, cols
    // For further information, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
    const { value, onChange, ...rest } = this.props;
    return <textarea {...rest} className="form-control" value={value} onChange={onChange} />;
  }
}

/**
 * Renders a form checkbox using Bootstrap styles.
 */
class FormCheckbox extends Component<{
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  [prop: string]: any;
}> {
  render() {
    // ...rest will contain extra passed attributes such as disabled, required, width, height, pattern
    // For further information, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
    const { checked, onChange, ...rest } = this.props;
    return (
      <input
        {...rest}
        className="form-check-input"
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
    );
  }
}

/**
 * Renders a form select using Bootstrap styles.
 */
class FormSelect extends Component<{
  value: string | number;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  [prop: string]: any;
}> {
  render() {
    // ...rest will contain extra passed attributes such as disabled, required, size.
    // For further information, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
    const { value, onChange, children, ...rest } = this.props;
    return (
      <select {...rest} className="custom-select" value={value} onChange={onChange}>
        {children}
      </select>
    );
  }
}

/**
 * Renders form components using Bootstrap styles.
 */
export class Form {
  static Label = FormLabel;
  static Input = FormInput;
  static Textarea = FormTextarea;
  static Checkbox = FormCheckbox;
  static Select = FormSelect;
}

/**
 * Renders alert messages using Bootstrap classes.
 *
 * Students: this slightly more complex component is not part of curriculum.
 */
export class Alert extends Component {
  alerts: { id: number; text: ReactNode; type: string }[] = [];
  nextId: number = 0;

  render() {
    return (
      <div style={{ marginTop: '5em' }}>
        {this.alerts.map((alert, i) => (
          <div
            key={alert.id}
            className={'alert alert-dismissible alert-' + alert.type}
            role="alert"
          >
            {alert.text}
            <button
              type="button"
              className="btn-close btn-sm"
              onClick={() => this.alerts.splice(i, 1)}
            />
          </div>
        ))}
      </div>
    );
  }

  /**
   * Show success alert.
   */
  static success(text: ReactNode) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      let instance = Alert.instance(); // Get rendered Alert component instance
      if (instance) instance.alerts.push({ id: instance.nextId++, text: text, type: 'success' });
    });
  }

  /**
   * Show info alert.
   */
  static info(text: ReactNode) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      let instance = Alert.instance(); // Get rendered Alert component instance
      if (instance) instance.alerts.push({ id: instance.nextId++, text: text, type: 'info' });
    });
  }

  /**
   * Show warning alert.
   */
  static warning(text: ReactNode) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      let instance = Alert.instance(); // Get rendered Alert component instance
      if (instance) instance.alerts.push({ id: instance.nextId++, text: text, type: 'warning' });
    });
  }

  /**
   * Show danger alert.
   */
  static danger(text: ReactNode) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      let instance = Alert.instance(); // Get rendered Alert component instance
      if (instance) instance.alerts.push({ id: instance.nextId++, text: text, type: 'danger' });
    });
  }
}

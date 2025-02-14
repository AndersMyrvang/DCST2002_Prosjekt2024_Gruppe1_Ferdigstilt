import React from 'react';
import { shallow, mount } from 'enzyme';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Card, Card2, Card3, Button, Row, Column, Alert, Details } from '../../src/widgets';
import { NavLink } from 'react-router-dom';
import { Action } from 'history';

beforeAll(() => {
  localStorage.setItem('user_id', '1');
});

afterAll(() => {
  localStorage.clear();
});

jest.mock('../../src/services/user-service', () => ({
  getUserById: jest.fn().mockResolvedValue({ user_id: 1, username: 'Test User' }),
}));

describe('Widgets Component Tests', () => {
  describe('Card Components', () => {
    test('Card renders with title and children', () => {
      const wrapper = shallow(
        <Card title="Test Card">
          <p>Card Content</p>
        </Card>,
      );
      expect(wrapper.find('.card-title1').text()).toBe('Test Card');
      expect(wrapper.find('.card-text1').contains(<p>Card Content</p>)).toBeTruthy();
    });

    test('Card2 renders with title and children', () => {
      const wrapper = shallow(
        <Card2 title="Test Card2">
          <p>Card2 Content</p>
        </Card2>,
      );
      expect(wrapper.find('.card-title2').text()).toBe('Test Card2');
      expect(wrapper.find('.card-content2').contains(<p>Card2 Content</p>)).toBeTruthy();
    });

    test('Card3 renders with title and children', () => {
      const wrapper = shallow(
        <Card3 title="Card3 Title">
          <p>Card3 Content</p>
        </Card3>,
      );

      expect(wrapper.find('.card-title').text()).toBe('Card3 Title');

      expect(wrapper.find('.card-content').text()).toBe('Card3 Content');

      expect(wrapper.find('.card').exists()).toBe(true);
      expect(wrapper.find('.card-body').exists()).toBe(true);
    });
  });

  describe('Row and Column Components', () => {
    test('Row renders children properly', () => {
      const wrapper = shallow(
        <Row>
          <p>Row Content</p>
        </Row>,
      );
      expect(wrapper.find('.row').contains(<p>Row Content</p>)).toBeTruthy();
    });

    test('Column renders with width and children', () => {
      const wrapper = shallow(
        <Column width={6}>
          <p>Column Content</p>
        </Column>,
      );
      expect(wrapper.find('.col-6').contains(<p>Column Content</p>)).toBeTruthy();
    });

    test('Column renders with right alignment', () => {
      const wrapper = shallow(
        <Column right>
          <p>Column Content</p>
        </Column>,
      );

      expect(wrapper.find('.float-end').exists()).toBe(true);
    });
  });

  describe('Button Components', () => {
    const mockOnClick = jest.fn();

    test('Button.Success renders and handles click', () => {
      const wrapper = shallow(<Button.Success onClick={mockOnClick}>Success</Button.Success>);
      wrapper.find('button').simulate('click');
      expect(mockOnClick).toHaveBeenCalled();
      expect(wrapper.find('.btn-success').text()).toBe('Success');
    });

    test('Button.Danger renders and handles click', () => {
      const wrapper = shallow(<Button.Danger onClick={mockOnClick}>Danger</Button.Danger>);
      wrapper.find('button').simulate('click');
      expect(mockOnClick).toHaveBeenCalled();
      expect(wrapper.find('.btn-danger').text()).toBe('Danger');
    });

    test('Button.Light renders and handles click', () => {
      const wrapper = shallow(<Button.Light onClick={mockOnClick}>Light</Button.Light>);
      wrapper.find('button').simulate('click');
      expect(mockOnClick).toHaveBeenCalled();
      expect(wrapper.find('.btn-light').text()).toBe('Light');
    });
  });
});

describe('Row widget tests', () => {
  test('Draws correctly', () => {
    const wrapper = shallow(<Row>Row</Row>);

    expect(wrapper.matchesElement(<div className="row">Row</div>)).toEqual(true);
  });
});

describe('Column widget tests', () => {
  test('Draws correctly', () => {
    const wrapper = shallow(<Column>Content</Column>);

    expect(
      wrapper.matchesElement(
        <div className="col">
          <div className="float-start">Content</div>
        </div>,
      ),
    ).toEqual(true);
  });

  test('Draws correctly when property width is set', () => {
    const wrapper = shallow(<Column width={5}>content</Column>);

    expect(
      wrapper.matchesElement(
        <div className="col-5">
          <div className="float-start">content</div>
        </div>,
      ),
    ).toEqual(true);
  });

  test('Draws correctly when property right is set', () => {
    const wrapper = shallow(<Column right>content</Column>);

    expect(
      wrapper.matchesElement(
        <div className="col">
          <div className="float-end">content</div>
        </div>,
      ),
    ).toEqual(true);
  });
});

describe('Button.Success widget tests', () => {
  test('Draws correctly', () => {
    const wrapper = shallow(<Button.Success onClick={() => {}}>test</Button.Success>);

    expect(
      wrapper.matchesElement(
        <button type="button" className="btn btn-success">
          test
        </button>,
      ),
    ).toEqual(true);
  });

  test('Draws correctly with small button', () => {
    const wrapper = shallow(<Button.Success small onClick={() => {}}>test</Button.Success>);

    expect(
      wrapper.matchesElement(
        <button
          type="button"
          className="btn btn-success"
          style={{
            padding: '5px 5px',
            fontSize: '16px',
            lineHeight: '0.7',
          }}
        >
          test
        </button>,
      ),
    ).toEqual(true);
  });

  test('Button calls function on click-event', () => {
    let buttonClicked = false;
    const wrapper = shallow(
      <Button.Success onClick={() => (buttonClicked = true)}>test</Button.Success>,
    );

    wrapper.find('button').simulate('click');

    expect(buttonClicked).toEqual(true);
  });
});

describe('Button.Danger widget tests', () => {
  test('Draws correctly', () => {
    const wrapper = shallow(<Button.Danger onClick={() => {}}>test</Button.Danger>);

    expect(
      wrapper.matchesElement(
        <button type="button" className="btn btn-danger">
          test
        </button>,
      ),
    ).toEqual(true);
  });

  test('Draws correctly with small button', () => {
    const wrapper = shallow(<Button.Danger small onClick={() => {}}>test</Button.Danger>);

    expect(
      wrapper.matchesElement(
        <button
          type="button"
          className="btn btn-danger"
          style={{
            padding: '5px 5px',
            fontSize: '16px',
            lineHeight: '0.7',
          }}
        >
          test
        </button>,
      ),
    ).toEqual(true);
  });

  test('Button calls function on click-event', () => {
    let buttonClicked = false;
    const wrapper = shallow(
      <Button.Danger onClick={() => (buttonClicked = true)}>test</Button.Danger>,
    );

    wrapper.find('button').simulate('click');

    expect(buttonClicked).toEqual(true);
  });
});

describe('ButtonLight widget tests', () => {
  test('Draws correctly', () => {
    const wrapper = shallow(<Button.Light onClick={() => {}}>test</Button.Light>);

    expect(
      wrapper.matchesElement(
        <button type="button" className="btn btn-light">
          test
        </button>,
      ),
    ).toEqual(true);
  });

  test('Draws correctly with small button', () => {
    const wrapper = shallow(<Button.Light small onClick={() => {}}>test</Button.Light>);

    expect(
      wrapper.matchesElement(
        <button
          type="button"
          className="btn btn-light"
          style={{
            padding: '5px 5px',
            fontSize: '16px',
            lineHeight: '0.7',
          }}
        >
          test
        </button>,
      ),
    ).toEqual(true);
  });

  test('Button calls function on click-event', () => {
    let buttonClicked = false;
    const wrapper = shallow(
      <Button.Light onClick={() => (buttonClicked = true)}>test</Button.Light>,
    );

    wrapper.find('button').simulate('click');

    expect(buttonClicked).toEqual(true);
  });
});

describe('Alert tests', () => {
  test('No alerts initially', () => {
    const wrapper = shallow(<Alert />);

    expect(wrapper.matchesElement(<div></div>)).toEqual(true);
  });

  test('Show alert message', (done) => {
    const wrapper = shallow(<Alert />);

    Alert.danger('test');

    setTimeout(() => {
      expect(
        wrapper.matchesElement(
          <div>
            <div>
              test
              <button />
            </div>
          </div>,
        ),
      ).toEqual(true);

      done();
    });
  });

  test('Close alert message', (done) => {
    const wrapper = shallow(<Alert />);

    Alert.danger('test');

    setTimeout(() => {
      expect(
        wrapper.matchesElement(
          <div>
            <div>
              test
              <button />
            </div>
          </div>,
        ),
      ).toEqual(true);

      wrapper.find('button.btn-close').simulate('click');

      expect(wrapper.matchesElement(<div></div>)).toEqual(true);

      done();
    });
  });
});

describe('Details Component', () => {
  const mockProps = {
    title: 'Test Title',
    value: {
      id: 1,
      name: 'Test Name',
      content: '<p>Test Content</p>',
      birthDate: '1990-01-01',
      height: '180',
      country_name: 'Test Country',
      team_name: 'Test Team',
      pictureUrl: 'https://example.com/image.jpg',
      created_by: 'Test Creator',
      created_at: '2024-01-01',
      view_count: 123,
      revised_by: 'Test Reviser',
      revised_at: '2024-01-02',
      league_name: 'Test League',
      league_id: 2,
      team_id: 3,
      emblem_image_url: 'https://example.com/emblem.jpg',
      teams: [{ team_id: 1, team_name: 'Team A' }],
      players: [{ id: 1, name: 'Player A' }],
    },
    buttonText: 'Edit',
    onEdit: jest.fn(),
    onNavigate: jest.fn(),
    history: {
      length: 10,
      action: 'PUSH' as Action,
      location: { pathname: '', search: '', state: '', hash: '' },
      push: jest.fn(),
      replace: jest.fn(),
      go: jest.fn(),
      goBack: jest.fn(),
      goForward: jest.fn(),
      block: jest.fn(),
      createHref: jest.fn(),
      listen: jest.fn(),
    },
  };

  test('handles onNavigate for team and league links', () => {
    render(<Details {...mockProps} />);

    fireEvent.click(screen.getByText(mockProps.value.team_name));
    expect(mockProps.onNavigate).toHaveBeenCalledWith(`/team/${mockProps.value.team_id}`);

    fireEvent.click(screen.getByText(mockProps.value.league_name));
    expect(mockProps.onNavigate).toHaveBeenCalledWith(`/league/${mockProps.value.league_id}`);
  });

  test('matches snapshot', () => {
    const { asFragment } = render(<Details {...mockProps} />);
    expect(asFragment()).toMatchSnapshot();
  });
});

import { Component } from 'react-simplified';
import * as React from 'react';
import { Alert, Card, Row, Column, Form, Button, Card2, Card3 } from '../widgets';
import { FaTrashAlt } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { Comment, Tag, User } from '../types';
import { createHashHistory } from 'history';
import tagService from '../services/tag-service';
import userService from '../services/user-service';

const history = createHashHistory();

//Komponent som viser liste over alle tags
export class TagList extends Component {
  tags: Tag[] = [];
  tagPageCounts: { [tag_id: number]: number } = {};
  user: User = {
    user_id: 0,
    google_id: '',
    username: '',
    email: '',
    profile_image_url: '',
    first_login: new Date(),
    last_login: new Date(),
    is_admin: false,
  };

  deleteTag(tagId: number) {
    tagService
      .deleteTag(tagId)
      .then(() => {
        this.tags = this.tags.filter((tag) => tag.tag_id !== tagId);
        this.forceUpdate();
      })
      .catch((error) => {
        console.error('Error deleting tag:', error);
        Alert.danger('Error deleting tag: ' + error.message);
      });
  }

  render() {
    return (
      <>
        <Card title="Tags">
          {this.tags.map((tag) => (
            <Row key={tag.tag_id}>
              <div
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  display: 'flex',
                  width: '100%',
                }}
              >
                <Column width={10}>
                  <a>{tag.tag_name}</a>
                </Column>
                <Column width={1}>
                  <span>Pages: {this.tagPageCounts[tag.tag_id] || 0}</span>
                </Column>
                <Column width={1}>
                  <div style={{ textAlign: 'right', marginLeft: '3em' }}>
                    {this.user.is_admin == true ? (
                      <Button.Danger
                        onClick={() => {
                          if (
                            window.confirm(
                              `Are you sure you want to delete the tag "${tag.tag_name}"?`,
                            )
                          ) {
                            this.deleteTag(tag.tag_id);
                          }
                        }}
                      >
                        <FaTrashAlt />
                      </Button.Danger>
                    ) : null}
                  </div>
                </Column>
              </div>
            </Row>
          ))}
        </Card>
        <Row>
          <Column>
            {this.user.user_id != 0 ? (
              <Button.Success onClick={() => history.push('/tags/new')}>New tag</Button.Success>
            ) : null}
          </Column>
        </Row>
      </>
    );
  }

  mounted(): void {
    tagService
      .getTags()
      .then((tags: Tag[]) => {
        this.tags = tags;
        const tagPageCounts: { [tag_id: number]: number } = {};
        const promises = tags.map((tag) =>
          tagService.getTagPageCount(tag.tag_id).then((pageCount: number) => {
            tagPageCounts[tag.tag_id] = pageCount;
          }),
        );
        Promise.all(promises)
          .then(() => {
            this.tagPageCounts = tagPageCounts;
            this.forceUpdate();
          })
          .catch((error) => {
            console.error('Error fetching page counts:', error);
          });
      })
      .catch((error: any) => {
        console.error('Error fetching tags:', error);
        Alert.danger('Error getting tags: ' + error.message);
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

//Komponent for å legge til tags
export class TagAdd extends Component {
  tag = { tag_id: 0, tag_name: '' };

  add = async () => {
    try {
      const result = await tagService.addTag(this.tag);

      Alert.success('Tag added');

      history.push('/tags');
    } catch (error) {
      console.error('Error adding tag:', error);
      if (error instanceof Error) {
        Alert.danger('Error adding tag: ' + error.message);
      } else {
        Alert.danger('Error adding tag');
      }
    }
  };

  render() {
    return (
      <Card title="Add tag">
        <Form.Label>Name</Form.Label>
        <Form.Input
          type="text"
          value={this.tag.tag_name}
          placeholder="Tag name"
          onChange={(event) => {
            this.tag.tag_name = event.currentTarget.value;
            this.forceUpdate();
          }}
        />
        <Button.Success onClick={this.add}>Add tag</Button.Success>
        <Button.Danger onClick={() => history.push('/tags')}>Cancel</Button.Danger>
      </Card>
    );
  }
}

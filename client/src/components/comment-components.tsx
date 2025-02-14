import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button, Card2, Card3 } from '../widgets';
import { NavLink } from 'react-router-dom';
import commentService from '../services/comment-service';
import userService from '../services/user-service';
import { Comment, User } from '../types';
import { createHashHistory } from 'history';
import { AiFillLike, AiFillDislike } from 'react-icons/ai';
import { FaTrashAlt } from 'react-icons/fa';
import { BiSolidPencil } from 'react-icons/bi';

const history = createHashHistory();

interface CommentSectionProps {
  page_id: number;
  onNewComment: () => void;
}

//Komponent for ny kommentar
export class NewComment extends Component<CommentSectionProps> {
  comment: Comment = {
    comment_id: 0,
    user_id: 0,
    content: '',
    created_at: new Date(),
    updated_at: new Date(),
    page_id: 0,
    likes: 0,
  };

  render() {
    return (
      <>
        <Card title="New Comment">
          <Column>
            <Form.Input
              type="text"
              aria-label={`Comment input`}
              value={this.comment.content}
              onChange={(event) => (this.comment.content = event.currentTarget.value)}
              rows={3}
            />
          </Column>
          <Column>
            <Button.Success
              onClick={() => {
                this.NewComment(this.comment.user_id, this.comment.content, this.props.page_id);
                this.comment.content = '';
              }}
            >
              {' '}
              SEND{' '}
            </Button.Success>
          </Column>
        </Card>
      </>
    );
  }
  mounted() {
    const currentUserId = localStorage.getItem('user_id');
    if (currentUserId != null) this.comment.user_id = parseInt(currentUserId, 10);
  }
  NewComment(user_id: number, content: string, page_id: number) {
    commentService
      .create(user_id, content, page_id)
      .then((comment) => {
        this.props.onNewComment();
      })
      .catch((error) => {
        console.error('Error creating comment:', error);
      });
  }
}

//Komponent for kommentarseksjonen (visning av kommentarer på en spesifikk side)
export class CommentSection extends Component<CommentSectionProps> {
  comment: Comment[] = [];
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
  updatingComment: number | null = null;
  updatedContent: string = '';

  render() {
    return (
      <>
        <Card title="Comments">
          {this.user.user_id != 0 ? (
            <NewComment page_id={this.props.page_id} onNewComment={() => this.mounted()} />
          ) : null}
          {this.comment.map((comment) => (
            <Row key={new Date(comment.created_at).getTime()}>
              <Column>
                {' '}
                <img
                  src={`${comment.profile_image_url}`}
                  alt={`Bilde fra ${comment.profile_image_url}`}
                  width={'45px'}
                  style={{
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
              </Column>
              <Column>
                <b>{comment.username}</b>
              </Column>
              <Column>
                {this.updatingComment == comment.comment_id ? (
                  <Form.Input
                    type="text"
                    value={this.updatedContent}
                    onChange={(event) => (this.updatedContent = event.currentTarget.value)}
                  />
                ) : (
                  comment.content
                )}
              </Column>

              <Column>
                {this.user.user_id == comment.user_id || this.user.is_admin == true ? (
                  <Button.Danger
                    onClick={() => {
                      this.deleteComment(comment.comment_id);
                      this.mounted();
                    }}
                  >
                    <FaTrashAlt />
                  </Button.Danger>
                ) : null}
              </Column>
              <Column>
                {this.user.user_id == comment.user_id || this.user.is_admin == true ? (
                  <>
                    {this.updatingComment == comment.comment_id ? (
                      <>
                        <Button.Success
                          onClick={() => {
                            this.updateComment(comment.comment_id, this.updatedContent);
                            this.updatingComment = null;
                            this.mounted();
                          }}
                        >
                          Lagre
                        </Button.Success>
                      </>
                    ) : (
                      <>
                        <Button.Light
                          onClick={() => {
                            this.updatingComment = comment.comment_id;
                            this.updatedContent = comment.content;
                          }}
                        >
                          <BiSolidPencil />
                        </Button.Light>
                      </>
                    )}
                  </>
                ) : null}
              </Column>
            </Row>
          ))}
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

    commentService
      .listComments(this.props.page_id)
      .then(async (comments: Comment[]) => {
        this.comment = comments;
      })
      .catch((error) => {
        console.error('Error fetching comments:', error);
        Alert.danger('Error getting comments: ' + error.message);
      });
  }

  deleteComment(comment_id: number) {
    commentService.deleteComment(comment_id);
  }
  updateComment(comment_id: number, content: string) {
    commentService.update(comment_id, content);
  }
}

export default CommentSection;

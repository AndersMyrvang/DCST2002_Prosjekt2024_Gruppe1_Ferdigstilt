import React, { useEffect, useState } from 'react';
import AdminPanel from './admin-component';
import { UserProfile } from '../types';

export const useUser = () => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetch('/api/current_user')
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setUser({
            username: data.username,
            email: data.email,
            photo: data.photo,
            firstLogin: new Date(data.firstLogin).toLocaleDateString(),
            lastLogin: new Date(data.lastLogin).toLocaleDateString(),
            is_admin: Boolean(data.is_admin),
            user_id: data.user_id,
          });
        }
      })
      .catch((error) => console.error('Error fetching user data:', error));
  }, []);

  return user;
};

const Profile = () => {
  const user = useUser();
  if (!user) {
    return <div>Laster...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-card-content">
          <div className="profile-header">
            <img src={user.photo} alt="Profilbilde" className="profile-img" />
          </div>
          <div className="profile-content">
            <h2 className="profile-name">{user.username}</h2>
            <p className="profile-info">Member since {user.firstLogin}</p>
            <p className="profile-details">
              <span>Last visited {user.lastLogin}</span>
              <br />
              <br />
              <span>{user.email}</span>
            </p>
          </div>
        </div>
      </div>

      {user.is_admin && (
        <div className="admin-panel-container">
          <h2>Admin Panel</h2>
          <AdminPanel />
        </div>
      )}
    </div>
  );
};

export default Profile;

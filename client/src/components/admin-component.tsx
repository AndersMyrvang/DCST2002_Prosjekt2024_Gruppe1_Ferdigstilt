import React, { useState, useEffect } from 'react';
import { User } from '../types';

const AdminPanel = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = () => {
    fetch('/api/users')
      .then((response) => response.json())
      .then((data) => setUsers(data));
  };

  useEffect(() => {
    fetchUsers();

    const interval = setInterval(fetchUsers, 60000);

    return () => clearInterval(interval);
  }, []);

  // Sjekker om en bruker er online basert på last_login og last_logout
  const isUserOnline = (user: User) => {
    if (
      user.last_login &&
      (!user.last_logout || new Date(user.last_login) > new Date(user.last_logout))
    ) {
      return true; 
    }
    return false;
  };

  // Funksjon for å endre admin-status
  const toggleAdminStatus = (userId: number, isAdmin: boolean) => {
    fetch(`/api/users/${userId}/set-admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isAdmin: !isAdmin }),
    })
      .then((response) => {
        if (response.ok) {
          setUsers(
            users.map((user) => (user.user_id === userId ? { ...user, is_admin: !isAdmin } : user)),
          );
        } else {
          console.error('Feil ved oppdatering av admin-status');
        }
      })
      .catch((error) => console.error('Feil ved toggleAdminStatus:', error));
  };

  return (
    <div className="admin-panel">
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Member Since</th>
            <th>Online Status</th>
            <th>Admin</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id}>
              <td>{user.user_id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{new Date(user.first_login).toLocaleDateString()}</td>
              <td>
                <span className={isUserOnline(user) ? 'online-dot' : 'offline-dot'}></span>
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={user.is_admin}
                  onChange={() => toggleAdminStatus(user.user_id!, user.is_admin)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;

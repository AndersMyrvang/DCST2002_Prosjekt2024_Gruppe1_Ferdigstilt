import React, { useEffect, useState } from 'react';

// Info om bruker som skal vises
interface UserProfile {
  displayName: string;
  email: string;
  photo: string;
}

// Lager komponent
const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetch('/api/current_user')
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setUser({
            displayName: data.displayName,
            email: data.emails && data.emails[0]?.value,
            photo: data.photos && data.photos[0]?.value,
          });
        }
      });
  }, []);

  // Dersom det ikke finnes eller laster inn tregt
  if (!user) {
    return <div>Laster...</div>;
  }

  // Viser info
  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <img
        src={user.photo}
        alt="Profilbilde"
        style={{ borderRadius: '50%', width: '150px', height: '150px', marginBottom: '20px' }}
      />
      <h2>{user.displayName}</h2>
      <p>{user.email}</p>
      <h3>"Vise lister eller noe annet her?"</h3>
    </div>
  );
};

export default Profile;

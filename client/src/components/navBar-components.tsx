import React, { useState, useRef, useEffect } from 'react';
import SearchBar from './searchBar-component';
import { FaHouse } from 'react-icons/fa6';
import { User } from '../types';

interface HamburgerProps {
  user: User | null;
}

function DarkModeButton() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true';
  });

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.body.classList.toggle('dark-mode', newMode);
    localStorage.setItem('darkMode', newMode.toString());
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    }
  }, [darkMode]);

  return (
    <button className="dark-mode-button" onClick={toggleDarkMode} aria-label="Toggle Dark Mode">
      <i
        className={darkMode ? 'fas fa-sun' : 'fas fa-moon'}
        style={{ fontSize: '24px', color: darkMode ? '#FFD700' : '#555' }}
      />
    </button>
  );
}

const Hamburger: React.FC<HamburgerProps> = ({ user }) => {
  const [burgerClass, setBurgerClass] = useState('burger-bar unclicked');
  const [menuClass, setMenuClass] = useState('menu hidden');
  const [isMenuClicked, setIsMenuClicked] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');

  const [userName, setUserName] = useState(localStorage.getItem('user') || '');
  const menuRef = useRef<HTMLDivElement>(null);

  const updateMenu = () => {
    setIsMenuClicked((prev) => !prev);
    setBurgerClass(isMenuClicked ? 'burger-bar unclicked' : 'burger-bar clicked');
    setMenuClass(isMenuClicked ? 'menu hidden' : 'menu visible');
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      closeMenu();
    }
  };

  const closeMenu = () => {
    setBurgerClass('burger-bar unclicked');
    setMenuClass('menu hidden');
    setIsMenuClicked(false);
  };

  const handleSearch = (query: string) => {
    fetch(`/api/search?q=${query}`)
      .then((response) => response.json())
      .then((data) => {})
      .catch((error) => {
        console.error('Feil ved søk:', error);
      });
  };

  const handleLogout = () => {
    fetch('/api/logout', { method: 'GET', credentials: 'include' })
      .then((response) => {
        if (response.ok) {
          setIsLoggedIn(false);
          setUserName('');
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('user');
          localStorage.removeItem('user_id');
          window.location.href = '/';
        } else {
          console.error('Logout failed');
        }
      })
      .catch((error) => console.error('Logout error:', error));
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Sjekker om bruker er pålogget
  useEffect(() => {
    fetch('/api/current_user')
      .then((response) => response.json())
      .then((data) => {
        if (data && data.username) {
          setIsLoggedIn(true);
          setUserName(data.username);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('user', data.username);
          localStorage.setItem('user_id', data.user_id);
        } else {
          setIsLoggedIn(false);
          localStorage.setItem('isLoggedIn', 'false');
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
        localStorage.setItem('isLoggedIn', 'false');
      });
  }, []);

  return (
    <div style={{ width: '100%' }} ref={menuRef}>
      <nav>
        <div className="house">
          <a href="/">
            <FaHouse />
          </a>
        </div>
        <div className="burger-menu" onClick={updateMenu} aria-label="Toggle Menu">
          <div className={burgerClass}></div>
          <div className={burgerClass}></div>
          <div className={burgerClass}></div>
        </div>

        <SearchBar onSearch={handleSearch} />

        <DarkModeButton />
      </nav>

      <div className={menuClass}>
        <ul className="menu-links" onClick={closeMenu} role="menu">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="#players">Players</a>
          </li>
          <li>
            <a href="#teams">Teams</a>
          </li>
          <li>
            <a href="#leagues">Leagues</a>
          </li>
          <li>
            <a href="#tags">Tags</a>
          </li>

          {!isLoggedIn ? (
            <li>
              <a href="https://accounts.google.com/signup/v2/createaccount">Register </a> /
              <a href="/auth/google"> Log in with Google </a>
            </li>
          ) : (
            <>
              <li>
                <a href="#/profile">My profile </a> /{' '}
                <a href="#" onClick={handleLogout}>
                  Log out
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Hamburger;

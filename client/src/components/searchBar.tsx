import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../../public/styles/searchBar.css';

type Suggestion = {
  type: string;
  id?: number;
  name: string;
};

const SearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const history = useHistory();

  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`/api/search/suggestions?q=${query}`);
      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error('Feil ved henting av søkeforslag:', error);
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
      setSuggestions([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    const { type, id, name } = suggestion;

    // Navigerer basert på type og id
    if (type === 'Player' && id) {
      history.push(`/player/${id}`);
    } else if (type === 'Team' && id) {
      history.push(`/team/${id}`);
    } else if (type === 'League') {
      history.push(`/league/${name}`);
    } else {
      console.error(`Ukjent type: ${type}`);
    }
    setSuggestions([]);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={handleInputChange}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
      />
      <span onClick={handleSearch} className="search-icon">
        🔍
      </span>

      {suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.type}: {suggestion.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

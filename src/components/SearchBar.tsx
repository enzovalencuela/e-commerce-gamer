// src/components/SearchBar.tsx

import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();

    if (!query.trim()) {
      setMessage("Por favor, digite um termo de pesquisa.");
    } else {
      setMessage(`Você buscou por: '${query}'`);
      onSearch(query);
    }
  };

  return (
    <div className="search-container">
      <form className="form-input" onSubmit={handleSearch}>
        <input
          type="text"
          id="nav-form__input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Digite sua busca..."
        />
        <button type="submit">
          <img src="/img/search.svg" alt="" />
        </button>
      </form>
      {message && (
        <div className="search-response">
          <p className="message">{message}</p>
          <button onClick={() => setMessage("")}>X</button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

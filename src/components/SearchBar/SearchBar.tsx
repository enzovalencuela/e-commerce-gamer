// src/components/SearchBar.tsx

import React, { useState } from "react";
import "./SearchBar.css";
import { useNavigate } from "react-router-dom";

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const navigate = useNavigate();

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();

    if (query.trim()) {
      navigate(`/produtos/search?q=${query.trim()}`);
      setQuery("");
    }
  };

  return (
    <>
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
    </>
  );
};

export default SearchBar;

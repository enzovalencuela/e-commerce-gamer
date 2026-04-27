import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

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
    <form
      className="flex h-11 w-full items-center rounded-full border border-slate-200 bg-white px-4 shadow-sm transition focus-within:border-slate-300 focus-within:shadow-md"
      onSubmit={handleSearch}
    >
      <Search className="h-4 w-4 text-slate-400" />
      <input
        type="text"
        id="nav-form__input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar setups, periféricos e novidades"
        className="h-full w-full border-none bg-transparent px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
      />
      <button
        type="submit"
        className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Buscar
      </button>
    </form>
  );
};

export default SearchBar;

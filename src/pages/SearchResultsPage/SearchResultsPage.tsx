// src/pages/SearchResultsPage/SearchResultsPage.tsx

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Product } from "../../types/Product";
import ProductCard from "../../components/ProductCard/ProductCard";
import Loading from "../../components/Loading/Loading";
import "./SearchResultsPage.css";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MenuSearchSort from "../../components/MenuSearchSort/MenuSearchSort";

const SearchResultsPage: React.FC = () => {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, SetSearchQuery] = useState("");
  const [showMenuSort, setShowMenuSort] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q") || "";
    const category = params.get("categoria") || "";

    SetSearchQuery(query || category);

    const fetchResults = async () => {
      setLoading(true);
      try {
        let url = `${VITE_BACKEND_URL}/api/products/search`;
        const queryParams = new URLSearchParams();

        if (query) {
          queryParams.append("q", query);
        }
        if (category) {
          queryParams.append("categoria", category);
        }

        url += `?${queryParams.toString()}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Falha na busca de produtos.");
        }
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [location.search, VITE_BACKEND_URL]);

  const handleClearSearch = () => {
    navigate("/");
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="search-results-container">
      {searchQuery && (
        <div className="nav-search-result">
          <div className="active-filter-tag">
            <span>{searchQuery}</span>
            <button onClick={handleClearSearch}>&times;</button>
          </div>
          <div className="active-sort-result">
            <FontAwesomeIcon
              icon={faSort}
              onClick={() => setShowMenuSort(!showMenuSort)}
            />
          </div>
          {showMenuSort && (
            <MenuSearchSort
              results={results}
              setResults={setResults}
              onClose={() => setShowMenuSort(false)}
            />
          )}
        </div>
      )}
      {results.length > 0 ? (
        <div className="product-grid">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p>Nenhum produto encontrado.</p>
      )}
    </div>
  );
};

export default SearchResultsPage;

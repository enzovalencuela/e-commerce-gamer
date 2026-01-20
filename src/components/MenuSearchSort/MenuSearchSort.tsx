import { useState } from "react";
import type { Product } from "../../types";
import "./MenuSearchSort.css";
import Loading from "../Loading/Loading";

interface MenuSearchSortProps {
  results: Product[];
  setResults: (products: Product[]) => void;
  onClose: () => void;
}

function MenuSearchSort({ results, setResults, onClose }: MenuSearchSortProps) {
  const [loading, setLoading] = useState(false);
  const searchSort = ["Preço", "Pedidos"];

  const sortSearchBy = (sortBy: string) => {
    setLoading(true);

    setTimeout(() => {
      const newResults = [...results];

      if (sortBy == "Preço") {
        newResults.sort((a, b) => a.preco - b.preco);
      } else if (sortBy === "Pedidos") {
        newResults.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
      }

      setResults(newResults);
      onClose();
      setLoading(false);
    }, 1000);
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="menu-search-sort">
      {searchSort.map((sortBy, index) => (
        <div key={index} onClick={() => sortSearchBy(sortBy)}>
          <p>{sortBy}</p>
        </div>
      ))}
    </div>
  );
}

export default MenuSearchSort;

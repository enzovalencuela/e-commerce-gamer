import { useEffect, useRef } from "react";
import type { Product } from "../../types";
import "./MenuSearchSort.css";

interface MenuSearchSortProps {
  results: Product[];
  setResults: (products: Product[]) => void;
  onClose: () => void;
}

function MenuSearchSort({ results, setResults, onClose }: MenuSearchSortProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const searchSort = ["Preço", "Pedidos"];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const sortSearchBy = (sortBy: string) => {
    const newResults = [...results];

    if (sortBy == "Preço") {
      newResults.sort((a, b) => a.preco - b.preco);
    } else if (sortBy === "Pedidos") {
      newResults.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
    }

    setResults(newResults);
    onClose();
  };

  return (
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

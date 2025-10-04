/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "../types/Product";

interface ProductContextType {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  searchQuery: string | undefined;
  setSearchQuery: React.Dispatch<React.SetStateAction<string | undefined>>;
  searchProducts: boolean;
  setSearchProducts: React.Dispatch<React.SetStateAction<boolean>>;
  produtos: boolean;
  setProdutos: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ProductProviderProps {
  children: ReactNode;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<ProductProviderProps> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>();
  const [searchProducts, setSearchProducts] = useState(false);
  const [produtos, setProdutos] = useState(false);

  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const categoria = [
    "Setups",
    "Notebooks",
    "Periféricos",
    "Consoles",
    "Acessórios",
    "Monitores",
    "Realidade VR",
    "Áudio",
  ];

  useEffect(() => {
    setLoading(true);

    const handleCategoryClick = async () => {
      try {
        const response = await fetch(
          categoria.includes(searchQuery ?? "")
            ? `${VITE_BACKEND_URL}/api/products/search?categoria=${searchQuery}`
            : `${VITE_BACKEND_URL}/api/products/search?q=${searchQuery}`
        );

        if (!response.ok) {
          throw new Error("Falha na busca de produtos.");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    handleCategoryClick();
  }, [searchQuery]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${VITE_BACKEND_URL}/api/products`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Erro ao buscar produtos.");
        }
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchProducts]);

  const contextValue = {
    loading,
    setLoading,
    products,
    setProducts,
    searchQuery,
    setSearchQuery,
    searchProducts,
    setSearchProducts,
    produtos,
    setProdutos,
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

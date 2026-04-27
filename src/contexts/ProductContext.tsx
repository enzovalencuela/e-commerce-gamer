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
import {
  fetchProductsWithCache,
  loadProductCache,
  saveProductCache,
} from "../utils/productCache";

interface ProductContextType {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  searchQuery: string | number | undefined;
  setSearchQuery: React.Dispatch<
    React.SetStateAction<string | number | undefined>
  >;
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
  const [searchQuery, setSearchQuery] = useState<string | number>();
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
    const cache = loadProductCache();
    if (cache?.products?.length) {
      setProducts(cache.products);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleCategoryClick = async () => {
      if (searchQuery === undefined) return;

      setLoading(true);
      try {
        const cache = loadProductCache();
        const cachedProducts = cache?.products || [];

        if (typeof searchQuery === "string") {
          if (categoria.includes(searchQuery)) {
            setProducts(
              cachedProducts.filter((product) => product.categoria === searchQuery)
            );
          } else {
            const normalizedQuery = searchQuery.toLowerCase();
            setProducts(
              cachedProducts.filter((product) =>
                `${product.titulo} ${product.descricao} ${product.categoria}`
                  .toLowerCase()
                  .includes(normalizedQuery)
              )
            );
          }
        } else if (
          typeof searchQuery === "number" &&
          searchQuery !== undefined
        ) {
          const cachedMatch = cachedProducts.find(
            (product) => product.id === searchQuery
          );

          if (cachedMatch) {
            setProducts([cachedMatch]);
          } else {
            const response = await fetch(
              `${VITE_BACKEND_URL}/api/products/${searchQuery}`,
              {
                method: "GET",
              }
            );

            if (!response.ok) {
              throw new Error("Falha na busca de produtos.");
            }
            const data = await response.json();
            setProducts(data ? [data] : []);
          }
        }
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
      try {
        const cached = loadProductCache();
        if (!searchProducts && cached?.products?.length) {
          setProducts(cached.products);
          setLoading(false);
        } else {
          setLoading(true);
        }

        const { products: fetchedProducts } = await fetchProductsWithCache(
          VITE_BACKEND_URL
        );
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchProducts]);

  useEffect(() => {
    if (products.length > 0) {
      saveProductCache(products);
    }
  }, [products]);

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
    throw new Error("useProduct deve ser usado dentro de um ProductProvider");
  }
  return context;
};

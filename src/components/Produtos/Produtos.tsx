// src/components/Produtos/Produtos.tsx
import { useState, useEffect } from "react";
import ProductCarousel from "../ProductCarousel/ProductCarousel";
import type { Product } from "../../types/Product";
import "./Produtos.css";
import Loading from "../Loading/Loading";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

type Categoria =
  | "Setups"
  | "Notebooks"
  | "Periféricos"
  | "Consoles"
  | "Acessórios"
  | "Monitores"
  | "Realidade VR"
  | "Áudio";

type TipoSessao = "maisVendidos" | "recomendados" | "emPromocao";

interface ProdutosProps {
  categoria?: Categoria;
  tipoSessao?: TipoSessao;
  titulo?: string;
}

const Produtos: React.FC<ProdutosProps> = ({ categoria, titulo }) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${VITE_BACKEND_URL}/api/products`);
        if (!response.ok) {
          throw new Error("Erro ao buscar produtos.");
        }
        const data = await response.json();
        setAllProducts(data);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        setError(
          "Não foi possível carregar os produtos. Tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {error}
      </div>
    );
  }

  // 🔎 Filtragem dinâmica
  let productsToShow: Product[] = [];
  let sectionTitle = titulo || "";

  if (categoria) {
    productsToShow = allProducts.filter((p) => p.categoria === categoria);
    sectionTitle = titulo || categoria;
  }

  return loading ? (
    <Loading />
  ) : (
    <section className="section-produtos">
      <div className="div-produtos__title">
        <h2>{sectionTitle}</h2>
      </div>
      <ProductCarousel products={productsToShow} sectionTitle={sectionTitle} />
    </section>
  );
};

export default Produtos;

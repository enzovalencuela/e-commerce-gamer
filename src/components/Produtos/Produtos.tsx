// src/components/Produtos/Produtos.tsx
import { useState, useEffect } from "react";
import ProductCarousel from "../ProductCarousel/ProductCarousel";
import type { Product } from "../../types/Product";
import "./Produtos.css";
import Loading from "../Loading/Loading";
import { useNavigate } from "react-router-dom";

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

const Produtos: React.FC<ProdutosProps> = ({
  categoria,
  titulo,
  tipoSessao,
}) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${VITE_BACKEND_URL}/api/products`);
        if (!response.ok) {
          throw new Error("Erro ao buscar produtos.");
        }
        const data = await response.json();
        const sortedData = data.sort(
          (a: Product, b: Product) => (b.salesCount || 0) - (a.salesCount || 0)
        );
        setAllProducts(sortedData);
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

  let productsToShow: Product[] = [];
  let sectionTitle = titulo || "";

  if (tipoSessao) {
    sectionTitle =
      titulo ||
      (tipoSessao === "maisVendidos"
        ? "Mais Vendidos"
        : tipoSessao === "emPromocao"
        ? "Em Promoção"
        : "Recomendados");

    switch (tipoSessao) {
      case "maisVendidos":
        productsToShow = allProducts.slice(0, 10);
        break;
      case "emPromocao":
        productsToShow = allProducts
          .filter((p) => p.preco !== p.preco_original)
          .slice(0, 10);
        break;
      case "recomendados":
        productsToShow = allProducts
          .filter((p) =>
            (p.avaliacoes || 1) > 1 && (p.mediaAvaliacao || 1) > 4
              ? (p.avaliacoes || 1) > 1 && (p.mediaAvaliacao || 1) > 4
              : allProducts
          )
          .slice(0, 10);
        break;
      default:
        productsToShow = allProducts.slice(0, 10);
        break;
    }
  } else if (categoria) {
    productsToShow = allProducts
      .filter((p) => p.categoria === categoria)
      .slice(0, 10);
    sectionTitle = titulo || categoria;
  } else {
    productsToShow = allProducts.slice(0, 10);
    sectionTitle = titulo || "Produtos";
  }

  return loading ? (
    <Loading />
  ) : (
    <section className="section-produtos">
      <div className="div-produtos__title">
        <h2>{sectionTitle}</h2>
        {!tipoSessao && (
          <button
            onClick={() => navigate(`/produtos/search/?q=${sectionTitle}`)}
          >
            ver mais
          </button>
        )}
      </div>
      <ProductCarousel products={productsToShow} sectionTitle={sectionTitle} />
    </section>
  );
};

export default Produtos;

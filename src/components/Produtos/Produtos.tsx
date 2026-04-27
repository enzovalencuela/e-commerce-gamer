import { useState, useEffect } from "react";
import type { Product } from "../../types/Product";
import Loading from "../Loading/Loading";
import { useNavigate } from "react-router-dom";
import ProductCard from "../ProductCard/ProductCard";
import { ArrowRight } from "lucide-react";

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
          minHeight: "50vh",
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
        productsToShow = allProducts.slice(0, 8);
        break;
      case "emPromocao":
        productsToShow = allProducts
          .filter((p) => p.preco !== p.preco_original)
          .slice(0, 8);
        break;
      case "recomendados":
        productsToShow = allProducts
          .filter((p) => (p.avaliacoes || 0) > 1 && (p.mediaAvaliacao || 0) >= 4)
          .slice(0, 8);
        if (productsToShow.length === 0) {
          productsToShow = allProducts.slice(0, 8);
        }
        break;
      default:
        productsToShow = allProducts.slice(0, 8);
        break;
    }
  } else if (categoria) {
    productsToShow = allProducts
      .filter((p) => p.categoria === categoria)
      .slice(0, 8);
    sectionTitle = titulo || categoria;
  } else {
    productsToShow = allProducts.slice(0, 8);
    sectionTitle = titulo || "Produtos";
  }

  return loading ? (
    <Loading />
  ) : (
    <section className="py-10">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Curadoria
            </p>
            <h2 className="font-display text-2xl font-semibold text-slate-950 sm:text-3xl">
              {sectionTitle}
            </h2>
          </div>
          {!tipoSessao && (
            <button
              onClick={() => navigate(`/produtos/search/?q=${sectionTitle}`)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary/30 hover:text-primary"
            >
              Ver mais
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {productsToShow.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              sectionTitle={sectionTitle}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Produtos;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Product } from "../../types/Product";
import Loading from "../Loading/Loading";
import ProductCard from "../ProductCard/ProductCard";
import { fetchProductsWithCache } from "../../utils/productCache";
import {
  getCollectionProducts,
  getCollectionTitle,
  type ProductCategory,
  type ProductCollectionType,
} from "../../utils/productCollections";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const SECTION_PREVIEW_LIMIT = 15;

interface ProdutosProps {
  categoria?: ProductCategory;
  tipoSessao?: ProductCollectionType;
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
        const { products } = await fetchProductsWithCache(VITE_BACKEND_URL);
        setAllProducts(products);
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
      <div className="flex min-h-[50vh] items-center justify-center px-4 text-center text-slate-600">
        {error}
      </div>
    );
  }

  const sectionTitle = getCollectionTitle({ categoria, tipoSessao, titulo });
  const sectionProducts = getCollectionProducts({
    products: allProducts,
    categoria,
    tipoSessao,
    titulo,
  });
  const productsToShow = sectionProducts.slice(0, SECTION_PREVIEW_LIMIT);

  const handleViewMore = () => {
    if (tipoSessao) {
      navigate(
        `/produtos/search?sessao=${tipoSessao}&titulo=${encodeURIComponent(sectionTitle)}`
      );
      return;
    }

    if (categoria) {
      navigate(`/produtos/search?categoria=${encodeURIComponent(categoria)}`);
      return;
    }

    navigate(`/produtos/search?q=${encodeURIComponent(sectionTitle)}`);
  };

  return loading ? (
    <Loading variant="products" />
  ) : productsToShow.length === 0 ? null : (
    <section className="py-8 sm:py-10">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Curadoria
            </p>
            <h2 className="font-display text-2xl font-semibold text-slate-950 sm:text-3xl">
              {sectionTitle}
            </h2>
          </div>
          <button
            onClick={handleViewMore}
            className="hidden min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-primary/30 hover:text-primary active:scale-[0.98] md:inline-flex"
          >
            Ver mais
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 pr-6 select-none touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:gap-5 md:pr-10">
          {productsToShow.map((product) => (
            <div
              key={product.id}
              className="min-w-[calc(50%-0.375rem)] max-w-[calc(50%-0.375rem)] snap-start first:ml-0 last:mr-4 sm:min-w-[calc(50%-0.5rem)] sm:max-w-[calc(50%-0.5rem)] md:min-w-[280px] md:max-w-[280px] md:first:ml-0 md:last:mr-0 xl:min-w-[300px] xl:max-w-[300px]"
            >
              <ProductCard product={product} sectionTitle={sectionTitle} />
            </div>
          ))}
        </div>

        <button
          onClick={handleViewMore}
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-primary/30 hover:text-primary active:scale-[0.98] md:hidden"
        >
          Ver mais
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
};

export default Produtos;

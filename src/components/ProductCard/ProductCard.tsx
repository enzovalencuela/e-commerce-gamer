import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Sparkles, Tag } from "lucide-react";
import type { Product } from "../../types/Product";
import { useAuth } from "../../contexts/AuthContext";
import SpanMessage from "../SpanMessage/SpanMessage";

interface ProductCardProps {
  product: Product;
  sectionTitle?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, sectionTitle }) => {
  const [showSpanOkMessage, setShowSpanOkMessage] = useState(false);
  const [showSpanErrorMessage, setShowSpanErrorMessage] = useState(false);
  const navigate = useNavigate();
  const { user, addToCart, cart } = useAuth();

  const isProductInCart = cart.some((item) => item.id === product.id);

  const handleAddToCart = async (selectedProduct: Product) => {
    if (!user) {
      return;
    }

    const status = await addToCart(selectedProduct);
    if (status === "error") {
      setShowSpanErrorMessage(true);
    } else {
      setShowSpanOkMessage(true);
    }
  };

  const parcela =
    (product.preco / product.max_parcelas) * (1 + product.taxa_parcela / 100);
  const desconto = 100 - (product.preco * 100) / (product.preco_original || 1);
  const hasPromotion =
    Boolean(product.preco_original) && Number(desconto.toFixed(0)) > 0;
  const isNewProduct = product.createdAt
    ? Date.now() - new Date(product.createdAt).getTime() <
      1000 * 60 * 60 * 24 * 45
    : sectionTitle === "Novidades";

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl select-none sm:rounded-[28px] sm:p-4">
      {showSpanOkMessage && (
        <SpanMessage message="Produto adicionado ao carrinho!" status="ok" />
      )}
      {showSpanErrorMessage && (
        <SpanMessage
          message="Produto já adicionado ao carrinho!"
          status="error"
        />
      )}

      <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2 sm:left-4 sm:top-4">
        {isNewProduct && (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
            <Sparkles className="h-3 w-3" />
            Novo
          </span>
        )}
        {hasPromotion && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-900">
            <Tag className="h-3 w-3" />
            Oferta
          </span>
        )}
      </div>

      <Link
        to={`/product/${product.id}`}
        className="relative flex aspect-[4/4.8] items-center justify-center overflow-hidden rounded-[20px] bg-gradient-to-br from-slate-50 via-white to-slate-100 sm:aspect-[4/4.2] sm:rounded-[24px]"
      >
        <img
          src={product.img}
          alt={product.titulo}
          loading="lazy"
          decoding="async"
          draggable={false}
          width={640}
          height={672}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          className="max-h-full w-full object-contain transition duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col pt-4 sm:pt-5">
        <div className="mb-3 space-y-1.5 sm:mb-4 sm:space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:text-xs">
            {product.categoria}
          </p>
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-slate-950 sm:text-lg sm:leading-tight">
            {product.titulo}
          </h3>
          <div className="space-y-0.5 sm:space-y-1">
            {product.preco_original && (
              <p className="text-xs text-slate-400 line-through sm:text-sm">
                R$ {product.preco_original}
              </p>
            )}
            <h4 className="text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl">
              R$ {product.preco}
            </h4>
            <span className="block text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
              em até{" "}
              <b className="text-slate-700">
                {product.max_parcelas}x de R$ {Number(parcela).toFixed(2)}
              </b>
            </span>
          </div>
        </div>

        <div className="mt-auto flex items-center gap-2">
          <motion.button
            onClick={() =>
              isProductInCart
                ? navigate("/carrinho")
                : handleAddToCart(product)
            }
            className={`flex min-h-11 flex-1 items-center justify-center rounded-full px-3 py-2.5 text-sm font-semibold transition active:scale-[0.98] sm:px-4 sm:py-3 ${
              isProductInCart
                ? "bg-slate-100 text-slate-900 hover:bg-slate-200"
                : "bg-primary text-white hover:bg-lightprimary"
            }`}
            whileTap={{ scale: 0.97 }}
          >
            <span className="inline-flex items-center gap-1.5 sm:gap-2">
              <ShoppingBag className="h-4 w-4 shrink-0" />
              <span className="truncate">
                {isProductInCart ? "Ver no carrinho" : "Adicionar"}
              </span>
            </span>
          </motion.button>

          <Link
            to={`/product/${product.id}`}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-slate-200 p-2.5 text-secondary transition hover:border-secondary/30 hover:text-secondary active:scale-[0.98] sm:p-3"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

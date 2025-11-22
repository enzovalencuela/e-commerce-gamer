// src/components/ProductCard/ProductCard.tsx

import React, { useState } from "react";
import type { Product } from "../../types/Product";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import SpanMessage from "../SpanMessage/SpanMessage";
import "./ProductCard.css";

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

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      return;
    }

    const status = await addToCart(product);
    if (status === "error") {
      setShowSpanErrorMessage(true);
    } else {
      setShowSpanOkMessage(true);
    }
  };

  const parcela =
    (product.preco / product.max_parcelas) * (1 + product.taxa_parcela / 100);

  const desconto = 100 - (product.preco * 100) / (product.preco_original || 1);

  const isPromotionSection = product.preco_original ? true : false;
  const isReleasesSection = sectionTitle === "Lançamentos";

  return (
    <div className="product">
      {showSpanOkMessage && (
        <SpanMessage message="Produto adicionado ao carrinho!" status="ok" />
      )}
      {showSpanErrorMessage && (
        <SpanMessage
          message="Produto já adicionado ao carrinho!"
          status="error"
        />
      )}
      {isReleasesSection && <span className="span-new">novo</span>}
      {isPromotionSection && (
        <span className="off">{desconto.toFixed(0)}% off</span>
      )}
      <Link to={`/product/${product.id}`}>
        <img src={product.img} alt={product.titulo} />
      </Link>
      <div className="produto__text">
        <h3>{product.titulo}</h3>
        {product.preco_original && <p>R${product.preco_original} </p>}
        <h4>
          R$ {product.preco} <span>Ou</span>
        </h4>
        <span>
          em até{" "}
          <b>
            {product.max_parcelas}x de R${Number(parcela).toFixed(2)}
          </b>
        </span>
      </div>
      {/* Lógica para o botão */}
      <button
        onClick={() =>
          isProductInCart ? navigate("/carrinho") : handleAddToCart(product)
        }
        className={isProductInCart ? "added-to-cart-btn" : "add-to-cart-btn"}
      >
        {isProductInCart ? "Ver no Carrinho" : "Add ao Carrinho"}
      </button>
    </div>
  );
};

export default ProductCard;

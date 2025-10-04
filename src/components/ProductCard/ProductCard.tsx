// src/components/ProductCard/ProductCard.tsx

import React, { useState } from "react";
import type { Product } from "../../types/Product";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import SpanMessage from "../SpanMessage/SpanMessage";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [showSpanOkMessage, setShowSpanOkMessage] = useState(false);
  const [showSpanErrorMessage, setShowSpanErrorMessage] = useState(false);
  const navigate = useNavigate();
  const { user, addToCart, cart } = useAuth();

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

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

  return (
    <div onClick={() => handleProductClick()} className="product">
      {showSpanOkMessage && (
        <SpanMessage message="Produto adicionado ao carrinho!" status="ok" />
      )}
      {showSpanErrorMessage && (
        <SpanMessage
          message="Produto já adicionado ao carrinho!"
          status="error"
        />
      )}
      <div>
        <Link to={`/product/${product.id}`}>
          <img src={product.img} alt={product.titulo} />
        </Link>
        <div className="produto__text">
          <h3>{product.titulo}</h3>
          <p>R${product.preco_original} </p>
          <h4>
            R$ {product.preco} <span>Ou</span>
          </h4>
          <span>
            em até <b>{product.max_parcelas}</b>
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
    </div>
  );
};

export default ProductCard;

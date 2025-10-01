/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/ProductPage.tsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import "./ProductPage.css";
import Produtos from "../../components/Produtos/Produtos";
import BackButton from "../../components/BackButton/BackButton";
import SpanMessage from "../../components/SpanMessage/SpanMessage";
import Loading from "../../components/Loading/Loading";
import type { Product } from "../../types/Product";

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showErrorMessage, setsShowErrorMessage] = useState(false);
  const [showOkMessage, setsShowOkMessage] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const okMessage = "Operação realizada com sucesso.";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${VITE_BACKEND_URL}/api/products/${id}`);
        if (!response.ok) {
          throw new Error("Erro ao buscar o produto.");
        }
        const data = await response.json();
        setProduct(data);

        if (user) {
          checkIfProductInCart(data.id);
        }
      } catch (err) {
        console.error("Erro ao buscar produto:", err);
        setError("Não foi possível carregar o produto. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, user]);

  const checkIfProductInCart = async (productId: number) => {
    try {
      const response = await fetch(`${VITE_BACKEND_URL}/api/cart/${user?.id}`);
      const cart = await response.json();
      setIsAddedToCart(cart.some((item: any) => item === productId));
    } catch (error) {
      console.error("Erro ao verificar carrinho:", error);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      setsShowErrorMessage(true);
    }
    if (product) {
      try {
        await fetch(`${VITE_BACKEND_URL}/api/cart/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user?.id, productId: product.id }),
        });
        setIsAddedToCart(true);
        setsShowOkMessage(true);
      } catch (error) {
        console.error("Erro ao adicionar produto:", error);
        setsShowErrorMessage(true);
      }
    }
  };

  const handleRemoveFromCart = async () => {
    if (!user) return;
    if (product) {
      try {
        const response = await fetch(`${VITE_BACKEND_URL}/api/cart/remove`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.id, productId: product.id }),
        });

        if (!response.ok) {
          throw new Error("Erro ao remover produto do carrinho.");
        }
        setIsAddedToCart(false);
        setsShowOkMessage(true);
      } catch (error) {
        console.error("Erro ao remover produto:", error);
        setsShowErrorMessage(true);
      }
    }
  };

  /*
  const handleBuyNow = () => {
    alert(
      "Funcionalidade de compra direta não implementada. Por favor, adicione ao carrinho primeiro."
    );
  };
   */

  if (error || !product) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BackButton />
        {error}
      </div>
    );
  }
  return loading ? (
    <Loading />
  ) : (
    <div className="product-page-container">
      {showErrorMessage && (
        <ErrorMessage onClose={() => setsShowErrorMessage(false)} />
      )}
      {showOkMessage && <SpanMessage message={okMessage} status="ok" />}
      <BackButton />
      <div className="product-page-card">
        <div className="product-div">
          <div className="product-image-section">
            <img src={product.img} alt={product.titulo} />
          </div>
          <div className="product-details-section">
            <h1>{product.titulo}</h1>

            <div className="price-info">
              <span className="original-price">
                De R$ {product.preco_original}
              </span>
              <h2 className="current-price">Por R$ {product.preco}</h2>
              <span className="payment-info">
                em até <b>{product.parcelamento}</b>
              </span>
            </div>
            <div>
              {!isAddedToCart ? (
                <>
                  <button className="add-to-cart-btn" onClick={handleAddToCart}>
                    Adicionar ao Carrinho
                  </button>
                  {/*
                  <button className="buy-now-btn" onClick={handleBuyNow}>
                    Comprar Agora
                  </button>
                  */}
                </>
              ) : (
                <>
                  <button
                    className="remove-from-cart-btn"
                    onClick={handleRemoveFromCart}
                  >
                    Remover do Carrinho
                  </button>
                  <button
                    className="go-to-cart-btn"
                    onClick={() => navigate("/carrinho")}
                  >
                    Ir para o Carrinho
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="product-description">
          <h3>Descrição</h3>
          <p>{product.descricao}</p>
        </div>
      </div>
      <Produtos sectionTitle="Mais Vendidos" sliceStart={7} sliceEnd={14} />
    </div>
  );
};

export default ProductPage;

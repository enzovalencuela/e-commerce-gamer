// src/components/Produtos/Produtos.tsx

import React, { useState, useEffect } from "react";
import ProductCarousel from "../ProductCarousel/ProductCarousel";
import "./Produtos.css";
import Loading from "../Loading/Loading";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface Product {
  id: number;
  titulo: string;
  preco: string;
  precoOriginal: string;
  parcelamento: string;
  img: string;
  descricao: string;
}

interface ProdutosProps {
  sectionTitle: string;
  sliceStart: number;
  sliceEnd: number;
}

const Produtos: React.FC<ProdutosProps> = ({
  sectionTitle,
  sliceStart,
  sliceEnd,
}) => {
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

  const productsToShow = allProducts.slice(sliceStart, sliceEnd);

  return loading ? (
    <Loading />
  ) : (
    <section className="section-produtos">
      <div className="div-produtos__title">
        <h2>{sectionTitle}</h2>
        <button>Ver mais</button>
      </div>
      <ProductCarousel products={productsToShow} sectionTitle={sectionTitle} />
    </section>
  );
};

export default Produtos;

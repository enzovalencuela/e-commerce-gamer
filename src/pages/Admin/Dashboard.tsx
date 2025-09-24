/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/Admin/Dashboard.tsx

import React, { useState, useEffect } from "react";
import ProductForm from "../../components/ProductForm/ProductForm";
import "./Dashboard.css";

import type { Product } from "../../types/Product";
import Loading from "../../components/Loading/Loading";
import BackButton from "../../components/BackButton/BackButton";
import SpanMessage from "../../components/SpanMessage/SpanMessage";
type NewProduct = Omit<Product, "id">;

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSpan, setShowSpan] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${VITE_BACKEND_URL}/api/products`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao buscar produtos.");
      }
      const data: Product[] = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [VITE_BACKEND_URL]);

  const handleSave = async (productData: NewProduct) => {
    const isNew = !editingProduct || !editingProduct.id;
    const url = isNew
      ? `${VITE_BACKEND_URL}/api/products/add`
      : `${VITE_BACKEND_URL}/api/products/${editingProduct?.id}`;
    const method = isNew ? "POST" : "PUT";

    const productWithDisponivel = {
      ...productData,
      disponivel: productData.disponivel ?? true, // default true
    };

    try {
      const response = await fetch(`${url}`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productWithDisponivel),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao salvar o produto.");
      }

      const updatedProduct = await response.json();

      if (isNew) {
        setProducts([...products, updatedProduct]);
      } else {
        setProducts(
          products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
        );
      }

      setEditingProduct(null);
      setShowSpan(true);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm("Tem certeza que deseja remover este produto?")) return;

    try {
      const response = await fetch(
        `${VITE_BACKEND_URL}/api/products/${productId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao remover produto.");
      }

      setProducts(products.filter((p) => p.id !== productId));
    } catch (error) {
      console.error("Erro ao remover produto:", error);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="dashboard-container">
      {showSpan && (
        <SpanMessage message="Produto salvo com sucesso!" status="ok" />
      )}
      <BackButton />
      <h1>Painel de Administração</h1>

      {editingProduct ? (
        <ProductForm
          product={editingProduct}
          onSave={handleSave}
          onCancel={() => setEditingProduct(null)}
        />
      ) : (
        <button
          onClick={() => setEditingProduct({} as Product)}
          className="add-product-btn"
        >
          Adicionar Novo Produto
        </button>
      )}

      {products ? (
        <div className="product-list">
          {products.map((product) => (
            <div key={product.id} className="product-item">
              <img src={product.img} alt={product.titulo} />
              <div className="product-info">
                <h3>{product.titulo}</h3>
                <p>R$ {product.preco}</p>
              </div>
              <div className="product-actions">
                <button onClick={() => handleEditProduct(product)}>
                  Editar
                </button>
                <button onClick={() => handleDeleteProduct(product.id)}>
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>sem produtos</p>
      )}
    </div>
  );
};

export default Dashboard;

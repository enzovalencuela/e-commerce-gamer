/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/Admin/Dashboard.tsx

import React, { useState, useEffect } from "react";
import ProductForm from "../../../components/ProductForm/ProductForm";
import "./Produtos.css";

import type { Product } from "../../../types/Product";
import Loading from "../../../components/Loading/Loading";
import BackButton from "../../../components/BackButton/BackButton";
import SpanMessage from "../../../components/SpanMessage/SpanMessage";
import { Swiper, SwiperSlide } from "swiper/react";
type NewProduct = Omit<Product, "id">;

const navDepartments = [
  { id: "1", name: "Setups" },
  { id: "2", name: "Notebooks" },
  { id: "3", name: "Periféricos" },
  { id: "4", name: "Consoles" },
  { id: "5", name: "Acessórios" },
  { id: "6", name: "Monitores" },
  { id: "7", name: "Realidade VR" },
  { id: "8", name: "Áudio" },
];

const ProdutosDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSpan, setShowSpan] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchProducts, setSearchProducts] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>();
  const [isAdding, setIsAdding] = useState(false);
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    setLoading(true);

    const handleCategoryClick = async () => {
      try {
        const response = await fetch(
          `${VITE_BACKEND_URL}/api/products/search?categoria=${searchQuery}`
        );

        if (!response.ok) {
          throw new Error("Falha na busca de produtos.");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    handleCategoryClick();
  }, [searchQuery]);

  useEffect(() => {
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

    fetchProducts();
  }, [searchProducts]);

  const handleSave = async (productData: NewProduct) => {
    const isNew = isAdding;
    const url = isNew
      ? `${VITE_BACKEND_URL}/api/products/add`
      : `${VITE_BACKEND_URL}/api/products/${editingProduct?.id}`;
    const method = isNew ? "POST" : "PUT";

    const productWithDisponivel = {
      ...productData,
      disponivel: productData.disponivel ?? true,
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
      setIsAdding(false);
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

  return loading ? (
    <Loading />
  ) : (
    <div className="products-container">
      {showSpan && (
        <SpanMessage message="Produto salvo com sucesso!" status="ok" />
      )}
      <BackButton />
      <h1>Produtos</h1>

      {isAdding ? (
        <ProductForm
          product={{} as Product}
          onSave={handleSave}
          onCancel={() => setIsAdding(false)}
        />
      ) : (
        <button onClick={() => setIsAdding(true)} className="add-product-btn">
          Adicionar Novo Produto
        </button>
      )}
      <ul className="div-ul">
        <Swiper
          breakpoints={{
            0: { slidesPerView: 3 },
            660: { slidesPerView: 5 },
            950: { slidesPerView: 6 },
            1290: {
              slidesPerView: 8,
            },
          }}
        >
          {navDepartments.map((dept) => (
            <SwiperSlide>
              <li
                key={dept.id}
                className="li-departamento"
                onClick={() => setSearchQuery(dept.name)}
              >
                {dept.name}
              </li>
            </SwiperSlide>
          ))}
        </Swiper>
      </ul>
      {searchQuery !== undefined && (
        <div className="active-filter-tag">
          <span>{searchQuery}</span>
          <button
            onClick={() => {
              setSearchQuery(undefined);
              setTimeout(() => {
                setSearchProducts(!searchProducts);
              }, 100);
            }}
          >
            &times;
          </button>
        </div>
      )}
      {products.length > 0 ? (
        <div className="product-list">
          {products.map((product) => (
            <div key={product.id} className="product-item">
              <div className="product-div-info">
                <div className="product-info">
                  <img src={product.img} alt={product.titulo} />
                  <div className="product-text">
                    <h3>{product.titulo}</h3>
                    <p>R$ {product.preco}</p>
                  </div>
                </div>
                <div className="product-actions">
                  <button onClick={() => setEditingProduct(product)}>
                    Editar
                  </button>
                  <button onClick={() => handleDeleteProduct(product.id)}>
                    Remover
                  </button>
                </div>
              </div>
              {editingProduct?.id === product.id && (
                <ProductForm
                  product={editingProduct}
                  onSave={handleSave}
                  onCancel={() => setEditingProduct(null)}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>sem produtos</p>
      )}
    </div>
  );
};

export default ProdutosDashboard;

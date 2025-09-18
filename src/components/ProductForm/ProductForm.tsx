// src/components/ProductForm.tsx

import React, { useState, useEffect } from "react";
import "./ProductForm.css";
import type { Product } from "../../types/Product";

interface ProductFormProps {
  product?: Product | null;
  onSave: (
    product: Omit<
      Product,
      "id" | "desconto" | "avaliacoes" | "mediaAvaliacao" | "cores" | "tamanhos"
    >
  ) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    titulo: "",
    preco: "",
    preco_original: "",
    parcelamento: "",
    img: "",
    descricao: "",
    categoria: "",
    tags: "",
    disponivel: true, // Adicionado o estado inicial para 'disponivel'
  });

  useEffect(() => {
    if (product) {
      setFormData({
        titulo: product.titulo || "",
        preco: product.preco.toString() || "",
        preco_original: product.preco_original?.toString() || "",
        parcelamento: product.parcelamento || "",
        img: product.img || "",
        descricao: product.descricao || "",
        categoria: product.categoria || "",
        tags: product.tags?.join(", ") || "",
        disponivel: product.disponivel, // Preenche com o valor do produto existente
      });
    }
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";

    setFormData((prevData) => ({
      ...prevData,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProduct = {
      titulo: formData.titulo,
      preco: parseFloat(formData.preco),
      preco_original: formData.preco_original
        ? parseFloat(formData.preco_original)
        : undefined,
      parcelamento: formData.parcelamento,
      img: formData.img,
      descricao: formData.descricao,
      categoria: formData.categoria,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
      disponivel: formData.disponivel, // Incluído na submissão
    };

    onSave(newProduct);
  };

  return (
    <div className="product-form-container">
      <h2>{product ? "Editar Produto" : "Adicionar Novo Produto"}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Título:
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Preço:
          <input
            type="number"
            name="preco"
            value={formData.preco}
            onChange={handleChange}
            step="0.01"
            required
          />
        </label>
        <label>
          Preço Original:
          <input
            type="number"
            name="preco_original"
            value={formData.preco_original}
            onChange={handleChange}
            step="0.01"
          />
        </label>
        <label>
          Parcelamento:
          <input
            type="text"
            name="parcelamento"
            value={formData.parcelamento}
            onChange={handleChange}
          />
        </label>
        <label>
          URL da Imagem:
          <input
            type="text"
            name="img"
            value={formData.img}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Descrição:
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            required
          ></textarea>
        </label>
        <label>
          Categoria:
          <input
            type="text"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Tags (separadas por vírgula):
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
          />
        </label>
        <label>
          Disponível:
          <input
            type="checkbox"
            name="disponivel"
            checked={formData.disponivel}
            onChange={handleChange}
          />
        </label>
        <div className="form-buttons">
          <button type="submit">
            {product ? "Salvar Alterações" : "Adicionar Produto"}
          </button>
          <button type="button" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;

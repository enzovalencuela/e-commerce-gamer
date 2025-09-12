// src/components/CategoryList.tsx

import React from "react";

// Define as interfaces para os dados
interface Category {
  nome: string;
  link: string;
}

interface CategoryListProps {
  categories: Category[];
}

const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
  if (categories.length === 0) {
    return <p>Nenhuma categoria encontrada.</p>;
  }

  // Divide as categorias em colunas para renderização
  const columns: Category[][] = [];
  for (let i = 0; i < categories.length; i += 8) {
    columns.push(categories.slice(i, i + 8));
  }

  return (
    <div className="categorias-colunas">
      {columns.map((column, index) => (
        <ul className="coluna" key={index}>
          {column.map((category, catIndex) => (
            <li key={catIndex}>
              <a href={category.link}>{category.nome}</a>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
};

export default CategoryList;

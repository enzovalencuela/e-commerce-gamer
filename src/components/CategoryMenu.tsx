// src/components/CategoryMenu.tsx

import React, { useState } from "react";

const departments = [
  { id: "1", name: "Eletrônicos" },
  { id: "2", name: "Moda" },
  { id: "3", name: "Casa" },
  { id: "4", name: "Esporte" },
  { id: "5", name: "Livros" },
  { id: "6", name: "Brinquedos" },
  { id: "7", name: "Jardinagem" },
  { id: "8", name: "Beleza" },
];

const CategoryMenu: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  return (
    <div
      className="menu-categorias-container"
      onMouseEnter={() => setIsMenuOpen(true)}
      onMouseLeave={() => setIsMenuOpen(false)}
    >
      <button id="todasCategorias">Todas as Categorias</button>

      {isMenuOpen && (
        <div className="menu-categorias">
          <ul className="departamentos-list">
            {departments.map((dept) => (
              <li
                key={dept.id}
                onMouseEnter={() => setSelectedDept(dept.id)}
                className={selectedDept === dept.id ? "active" : ""}
              >
                {dept.name}
              </li>
            ))}
          </ul>
          <div className="categorias-exibidas">
            {selectedDept && (
              <div className="categorias-content">
                <div className="categorias-container-right">
                  <h3>
                    Confira os Produtos<b> Que acabaram de chegar</b>
                  </h3>
                  <button>Ver todos</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryMenu;

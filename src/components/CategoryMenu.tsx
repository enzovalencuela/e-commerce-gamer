// src/components/CategoryMenu.tsx

import React, { useState } from "react";

const departments = [
  { id: "1", name: "PC Gamer" },
  { id: "2", name: "Notebooks" },
  { id: "3", name: "Periféricos" },
  { id: "4", name: "Consoles" },
  { id: "5", name: "Componentes" },
  { id: "6", name: "Monitores" },
  { id: "7", name: "Realidade Virtual" },
  { id: "8", name: "Hardware" },
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
            {selectedDept && <div className="categorias-content"></div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryMenu;

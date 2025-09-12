// src/components/CategoryNavbar.tsx

import React, { useState } from "react";
import CategoryMenu from "./CategoryMenu"; // Importando o componente que já criamos

// Dados de exemplo para os departamentos da navegação
const navDepartments = [
  { id: "1", name: "Departamento" },
  { id: "2", name: "Departamento" },
  { id: "3", name: "Departamento" },
  { id: "4", name: "Departamento" },
  { id: "5", name: "Departamento" },
  { id: "6", name: "Departamento" },
  { id: "7", name: "Departamento" },
  { id: "8", name: "Departamento" },
];

const CategoryNavbar: React.FC = () => {
  const [activeDept, setActiveDept] = useState<string | null>(null);

  return (
    <ul className="div-ul">
      <CategoryMenu />
      {navDepartments.map((dept) => (
        <li
          key={dept.id}
          className={`li-departamento ${
            activeDept === dept.id ? "active" : ""
          }`}
          data-departamento={dept.id}
          onMouseEnter={() => setActiveDept(dept.id)}
          onMouseLeave={() => setActiveDept(null)}
        >
          {dept.name}
        </li>
      ))}
    </ul>
  );
};

export default CategoryNavbar;

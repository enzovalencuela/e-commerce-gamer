// src/components/CategoryNavbar.tsx

import React, { useState } from "react";
import CategoryMenu from "./CategoryMenu";

const navDepartments = [
  { id: "1", name: "PC Gamer" },
  { id: "2", name: "Notebooks" },
  { id: "3", name: "Periféricos" },
  { id: "4", name: "Consoles" },
  { id: "5", name: "Componentes" },
  { id: "6", name: "Monitores" },
  { id: "7", name: "Realidade VR" },
  { id: "8", name: "Hardware" },
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

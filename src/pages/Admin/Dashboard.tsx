// src/pages/Admin/Dashboard.tsx

import React from "react";
import "./Dashboard.css";
import BackButton from "../../components/BackButton/BackButton";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <BackButton />
      <h1>Painel Dashboard</h1>
      <div className="dashboard-buttons">
        <button onClick={() => navigate("/dashboard/produtos")}>
          Produtos
        </button>
        <button onClick={() => navigate("/dashboard/vendas")}>Vendas</button>
      </div>
    </div>
  );
};

export default Dashboard;

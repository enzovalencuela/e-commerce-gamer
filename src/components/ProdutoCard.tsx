// src/components/ProdutoCard.tsx

import React from "react";

// 1. Defina a interface para as propriedades (props) do componente.
interface ProdutoCardProps {
  titulo: string;
  preco: string;
  precoOriginal: string;
  parcelamento: string;
  // O handleBuy agora é uma função que recebe um número (ID) e não retorna nada.
  handleBuy: (productId: number) => void;
}

// 2. Tipagem do componente funcional usando a interface criada.
const ProdutoCard: React.FC<ProdutoCardProps> = ({
  titulo,
  preco,
  precoOriginal,
  parcelamento,
  handleBuy,
}) => {
  return (
    <li className="card-item swiper-slide">
      <span className="span-new">novo</span>
      <img src="./img/modelo.svg" alt="" />
      <div className="produto__text">
        <span className="off">10% off</span>
        <h3>{titulo}</h3>
        <p>R$ {precoOriginal}</p>
        <h4>R$ {preco}</h4>
        <span>
          Ou em até <b>{parcelamento}</b>
        </span>
      </div>
      {/* O botão agora chama a função com o ID do produto */}
      <button onClick={() => handleBuy(1)}>Comprar</button>
    </li>
  );
};

export default ProdutoCard;

// src/components/TopBar.tsx

import React from "react";

const TopBar: React.FC = () => {
  return (
    <div className="div-span">
      <p>
        Ganhe <b>R$10,00</b> de desconto no seu primeiro pedido. Utilize o cupom{" "}
        <span>DESCONTO10</span>
      </p>
    </div>
  );
};

export default TopBar;

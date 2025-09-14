import { Link } from "react-router-dom";
import "./Carrinho.css";

export default function Carrinho() {
  return (
    <div className="container-carrinho">
      <Link className="back-button" to={"/"}>
        Voltar
      </Link>
      <h1>Carrinho</h1>
    </div>
  );
}

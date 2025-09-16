import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./BackButton.css";
import { Link } from "react-router-dom";

function BackButton() {
  return (
    <Link to={"/"} className="back-button">
      <FontAwesomeIcon icon={faArrowLeft} /> Voltar
    </Link>
  );
}

export default BackButton;

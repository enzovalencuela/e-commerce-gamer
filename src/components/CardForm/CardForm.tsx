import "./CardForm.css";

type CardFormProps = {
  selectedItems: number[];
};

const CardForm: React.FC<CardFormProps> = ({ selectedItems }) => {
  return (
    <form className="form">
      <div className="credit-card-info--form">
        <div className="input_container">
          <label className="input_label">Nome Completo</label>
          <input
            placeholder="Coloque Seu Nome Completo"
            title="Inpit title"
            name="input-name"
            type="text"
            className="input_field"
            id="password_field"
          />
        </div>
        <div className="input_container">
          <label className="input_label">Número do Cartão</label>
          <input
            placeholder="0000 0000 0000 0000"
            title="Inpit title"
            name="input-name"
            type="number"
            className="input_field"
            id="password_field"
          />
        </div>
        <div className="input_container">
          <label className="input_label">Data de Validade / CVV</label>
          <div className="split">
            <input
              placeholder="01/23"
              title="Expiry Date"
              name="input-name"
              type="text"
              className="input_field"
              id="password_field"
            />
            <input
              placeholder="CVV"
              title="CVV"
              name="cvv"
              type="number"
              className="input_field"
              id="password_field"
            />
          </div>
        </div>
        <button className="purchase--btn" disabled={selectedItems.length === 0}>
          Checkout
        </button>
      </div>
    </form>
  );
};

export default CardForm;

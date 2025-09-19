type CardFormProps = {
  selectedItems: number[];
};

const CardForm: React.FC<CardFormProps> = ({ selectedItems }) => {
  return (
    <form id="form-checkout">
      <input id="form-checkout__cardNumber" placeholder="Número do cartão" />
      <input id="form-checkout__cardExpirationMonth" placeholder="Mês" />
      <input id="form-checkout__cardExpirationYear" placeholder="Ano" />
      <input id="form-checkout__securityCode" placeholder="CVC" />
      <input id="form-checkout__cardholderName" placeholder="Nome do titular" />
      <input id="form-checkout__issuer" placeholder="Bandeira" />
      <input id="form-checkout__installments" placeholder="Parcelas" />
      <input
        id="form-checkout__identificationType"
        placeholder="Tipo de documento"
      />
      <input
        id="form-checkout__identificationNumber"
        placeholder="Número do documento"
      />
      <input id="form-checkout__email" placeholder="E-mail" />
      <button
        className="checkout-btn"
        type="submit"
        disabled={selectedItems.length === 0}
      >
        Pagar com cartão
      </button>
    </form>
  );
};

export default CardForm;

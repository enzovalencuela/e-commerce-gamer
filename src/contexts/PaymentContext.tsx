/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

interface PaymentContextType {
  onSubmit: ({ formData }: any) => Promise<void>;
  onError: (error: any) => Promise<void>;
  onReady: () => Promise<void>;
  totalAmount: number;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  showErrorMessage: boolean;
  setShowErrorMessage: React.Dispatch<React.SetStateAction<boolean>>;
  maxParcelas: () => number;
}

interface PaymentProviderProps {
  children: ReactNode;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<PaymentProviderProps> = ({
  children,
}) => {
  const { user, cart, selectedItems, setAtualizarQuery } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const calculateTotal = () => {
    if (!cart || !selectedItems) {
      return 0;
    }
    return cart
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => total + Number(item.preco), 0);
  };

  const totalAmount = calculateTotal();

  const maxParcelas = () => {
    if (!cart || !selectedItems || cart.length === 0) {
      return 1;
    }

    const selectedProducts = cart.filter((item) =>
      selectedItems.includes(item.id)
    );

    if (selectedProducts.length === 0) {
      return 1;
    }

    const maxMaxParcelas = selectedProducts.reduce((maxLimit, item) => {
      const itemLimit = Number(item.max_parcelas) || 1;
      return Math.max(maxLimit, itemLimit);
    }, 1);

    return maxMaxParcelas;
  };

  const onSubmit = async ({ formData }: { formData: Record<string, any> }) => {
    if (!user || totalAmount <= 0) {
      setShowErrorMessage(true);
      return;
    }

    return new Promise<void>((resolve, reject) => {
      fetch(`${VITE_BACKEND_URL}/api/payments/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          product_ids: selectedItems,
          user_id: user.id,
        }),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Erro no pagamento");
          return response.json();
        })
        .then((data) => {
          console.log("Pagamento processado:", data);
          setLoading(false);
          const id = data.payment.id;
          navigate(`/status?payment_id=${id}`);
          setAtualizarQuery(true);
          resolve();
        })
        .catch((error) => {
          setLoading(false);
          setShowErrorMessage(true);
          console.error("Erro ao processar pagamento", error);
          reject();
        });
    });
  };

  const onError = async (error: any) => {
    setLoading(false);
    console.log("Erro:", error);
  };

  const onReady = async () => {
    setLoading(false);
  };

  const contextValue = {
    onSubmit,
    totalAmount,
    loading,
    setLoading,
    showErrorMessage,
    setShowErrorMessage,
    onError,
    onReady,
    maxParcelas,
  };

  return (
    <PaymentContext.Provider value={contextValue}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

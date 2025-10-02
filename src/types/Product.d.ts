export interface Product {
  id: number;
  titulo: string;
  descricao: string;
  img: string;
  preco: number;
  preco_original?: number;
  parcelamento: string;
  desconto?: number;
  categoria: string;
  tags?: string[];
  cores?: string[];
  tamanhos?: string[];
  avaliacoes?: number;
  mediaAvaliacao?: number;
  salesCount?: number;
  createdAt?: string;
  disponivel: boolean;
}

// src/App.tsx

import "./App.css";
import About from "./components/About/About.tsx";
import Footer from "./components/Footer/Footer.tsx";
import Header from "./components/Header/Header.tsx";
import Produtos from "./components/Produtos/Produtos.tsx";
import Outdoor from "./components/Outdoor/Outdoor.tsx";
import Banner from "./components/Banner/Banner.tsx";
import { useEffect, useState } from "react";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage.tsx";

// Defina a interface Product
interface Product {
  id: number;
  titulo: string;
  preco: string;
  precoOriginal: string;
  parcelamento: string;
  img: string;
}

// Crie a lista completa de produtos
const allProducts: Product[] = [
  {
    id: 1,
    titulo: "Fone de Ouvido",
    preco: "99,90",
    precoOriginal: "110,00",
    parcelamento: "3x de R$ 33,30",
    img: "https://cdn.awsli.com.br/2500x2500/1307/1307157/produto/138258516/cd9356d94a.jpg",
  },
  {
    id: 2,
    titulo: "Mouse Gamer",
    preco: "149,99",
    precoOriginal: "160,00",
    parcelamento: "5x de R$ 30,00",
    img: "https://img.terabyteshop.com.br/produto/g/mouse-gamer-razer-cobra-rgb-6-botoes-programaveis-8500-dpi-black-rz0104650100r3u_180092.jpg",
  },
  {
    id: 3,
    titulo: "Teclado Mecânico",
    preco: "250,00",
    precoOriginal: "280,00",
    parcelamento: "6x de R$ 41,67",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT7v4_hBRpFke1LOCdKc_wpQk8rkIifTQiNw&s",
  },
  {
    id: 4,
    titulo: "Monitor Ultrawide",
    preco: "1500,00",
    precoOriginal: "1700,00",
    parcelamento: "10x de R$ 150,00",
    img: "https://images.kabum.com.br/produtos/fotos/525503/monitor-gamer-aoc-23-8-full-hd-100hz-1ms-ips-displayport-e-hdmi-adaptive-sync-24g2e1_1710771975_gg.jpg",
  },
  {
    id: 5,
    titulo: "Webcam HD",
    preco: "89,90",
    precoOriginal: "100,00",
    parcelamento: "3x de R$ 30,00",
    img: "https://m.media-amazon.com/images/I/61-K2lXmHQL._UF894,1000_QL80_.jpg",
  },
  {
    id: 6,
    titulo: "PlayStation 5",
    preco: "3189,90",
    precoOriginal: "3500,00",
    parcelamento: "10x de R$ 320,00",
    img: "https://m.media-amazon.com/images/I/41bsdF9lMPL._UF1000,1000_QL80_.jpg",
  },
  {
    id: 7,
    titulo: "Óculos VR Quest",
    preco: "4950,90",
    precoOriginal: "5500,00",
    parcelamento: "12x de R$ 480,00",
    img: "https://m.media-amazon.com/images/I/51pdPTbbjzL._UF894,1000_QL80_.jpg",
  },
  {
    id: 8,
    titulo: "Cadeira Gamer",
    preco: "990,00",
    precoOriginal: "1100,00",
    parcelamento: "10x de R$ 99,00",
    img: "https://lojagoldentec.vteximg.com.br/arquivos/ids/165902-600-600/image-cff5e7dc880d4c21bb11ed10984a894b.jpg?v=638483534503930000",
  },
  {
    id: 9,
    titulo: "Notebook Gamer",
    preco: "5500,00",
    precoOriginal: "6000,00",
    parcelamento: "12x de R$ 458,33",
    img: "https://images3.kabum.com.br/produtos/fotos/467613/notebook-gamer-asus-rog-strix-g16-rtx-4060-16gb-ram-brinde-controle-ps4-g614jv-n3094w_1721229589_gg.jpg",
  },
  {
    id: 10,
    titulo: "Notebook Gamer",
    preco: "5600,00",
    precoOriginal: "6200,00",
    parcelamento: "12x de R$ 478,33",
    img: "https://images.kabum.com.br/produtos/fotos/sync_mirakl/872622/xlarge/Notebook-Gamer-Asus-Rog-Strix-Scar-18-Intel-Core-Ultra-9-275hx-64GB-RAM-Nvidia-RTX5090-SSD-4TB-Tela-18-240Hz-Windows-11-Home-Black-G835lx_1755889506.jpg",
  },
  {
    id: 11,
    titulo: "Setup Gamer",
    preco: "4000,00",
    precoOriginal: "4400,00",
    parcelamento: "12x de R$ 378,33",
    img: "https://cdn.dooca.store/559/products/c1-2.png?v=1719521111&webp=0",
  },
  {
    id: 12,
    titulo: "Setup Gamer",
    preco: "3000,00",
    precoOriginal: "3200,00",
    parcelamento: "12x de R$ 268,33",
    img: "https://http2.mlstatic.com/D_730175-MLA87599323835_072025-C.jpg",
  },
  {
    id: 13,
    titulo: "Setup Gamer",
    preco: "2200,00",
    precoOriginal: "2500,00",
    parcelamento: "12x de R$ 188,33",
    img: "https://m.media-amazon.com/images/I/71yKcQlBe3L.jpg",
  },
  {
    id: 14,
    titulo: "PC Gamer Intel 12900",
    preco: "5999,00",
    precoOriginal: "6500,00",
    parcelamento: "12x de R$ 618,33",
    img: "https://alfatecnologico.com.br/cdn/shop/files/minipc1site_2da5fa9b-4fb9-4c6a-ad47-264436d68aad_500x.jpg?v=1692657159",
  },
  {
    id: 15,
    titulo: "Setup Gamer Completo",
    preco: "4199,00",
    precoOriginal: "4500,00",
    parcelamento: "12x de R$ 378,33",
    img: "https://shopinfo.vteximg.com.br/arquivos/ids/1718054-400-400/1.png?v=638877679507700000",
  },
  {
    id: 16,
    titulo: "Volante Gamer com Pedal",
    preco: "499,00",
    precoOriginal: "569,00",
    parcelamento: "6x de R$ 82,33",
    img: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcR2Wd7wEYFlKi5jFJ_us0avuMblHasaxMQ--As_mA4clnPAmLVKeXAT5CbSu-XCfRJya2ipiLlYzaCl8KzuCuzRyQFl4NSpBZi41PHVGGvQ-p-dqE3pHSya2w",
  },
  {
    id: 17,
    titulo: "Kit Mouse e Mousepad",
    preco: "89,00",
    precoOriginal: "111,00",
    parcelamento: "6x de R$ 17,33",
    img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcT2z88fUKY-6moIHlqoGzDrE_uCFQWVoxEvftjHRERr8Q6cZRnFjQSNa6WWxZIli3qMqF9JnlRdWOnAjBjeRNwKu_gyjQOc0vAr6rdMAKFkkLUX8z3YFRz7Uw",
  },
  {
    id: 18,
    titulo: "Headset Gamer Havit",
    preco: "157,90",
    precoOriginal: "171,90",
    parcelamento: "12x de R$ 14,35",
    img: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQTTzbU4WohMOrxdqK5v7KaeD6XLBWM1_zsU6DRmTpThdqUncDzr85dV60lLU7SFmCz9Owasm-Iqt6yAkn0A2Z0hs0sezMSyv1PXbSLQDJinvp_s7WJLo1K1wQ",
  },
  {
    id: 19,
    titulo: "Headset Gamer Logitech",
    preco: "292,90",
    precoOriginal: "324,90",
    parcelamento: "12x de R$ 29,90",
    img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTxLlA7eHCcgf1kjA0Va_ove87EzLbYnUjlFxuw_udFV6UWQV6OghM7yRy-xq9iH32H87wnSwSET-3EwnFH8fL-XjvpzZgJUBUOojktvJn4IubazW9fVxnE3A",
  },
  {
    id: 20,
    titulo: "Microfone Gamer Rgb",
    preco: "134,90",
    precoOriginal: "154,90",
    parcelamento: "12x de R$ 12,90",
    img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSZ8dXO0EfxjqEWs-VvV7U0fNtchj3R-IdVZtIVwaTncS3LPS2cyruayVgRa5bMffdWuZP40zwWuKeYrGpg43knVL-4CruN",
  },
  {
    id: 21,
    titulo: "Controle 8BitDo Ultimate",
    preco: "159,90",
    precoOriginal: "184,90",
    parcelamento: "12x de R$ 16,90",
    img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQEmKI1haBD7B48t_neK4gr1LhqjMDEREREgSxf_5oFywMLCNkpW-Fy09xHxzziKGpQhlQtOfVKA06--EdVPWmNZAmzuVFbVw",
  },
  {
    id: 22,
    titulo: "Mouse Pad com Led Rgb",
    preco: "49,90",
    precoOriginal: "62,90",
    parcelamento: "6x de R$ 9,90",
    img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQd6yYl49cAP-28HZxSqXmHnSgInDl3iE5rB2iiw7hMqlFi3p17J9xkw1jmM2JxUhLIVnCSM4Q01aGcizj7_2nlzUWu3A1bYo1WqyjHEYCwHugurmnaOnC9Kg",
  },
  {
    id: 23,
    titulo: "Kit Teclado e Mouse Gamer",
    preco: "52,90",
    precoOriginal: "63,90",
    parcelamento: "6x de R$ 10,90",
    img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSSdsAuWllgRwsTxEZo6kMAHmAG-43Zz-oGRzEQMI4uMQmsoxhbK3KOzUG-eaFsn3cIxYw1aPa_3nKfIDCiiqLiqkIN-LT4ZYkIGW4XlY3PADBMwhjemiAm",
  },
  {
    id: 24,
    titulo: "Controle Wirelless Gamer",
    preco: "169,90",
    precoOriginal: "193,90",
    parcelamento: "12x de R$ 15,90",
    img: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTlIRvPWFP6BpLgKRpjvdW_quhMiljc6_pPvtE7Bdg7G8WsJ5Y4Pvc_OCJbokl1kg85GC811SvKmXKVSdTqc_NcvWK0zG6Z3T550vEfCbjPWJ9Vj96KG8WnBA",
  },
  {
    id: 25,
    titulo: "Microfone Maono",
    preco: "199,90",
    precoOriginal: "229,90",
    parcelamento: "12x de R$ 17,90",
    img: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTx5vhqXWvHODONYux_BQmqOgKD7Qm4aD0I0wtAN0NHI4m1ey62n9hy20-jo1zohvaZtALwmJs-c97LPpgejI0_MrfSZ2LFu4y9kJukL_YHFMDhhSJKaPvwbQ",
  },
  {
    id: 26,
    titulo: "Fone De Ouvido Gamer",
    preco: "115,90",
    precoOriginal: "129,90",
    parcelamento: "12x de R$ 10,90",
    img: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRCTXZef71YBVcPh4AGJlUhHQGADubNuoACXKhYf6tWPLIZLvTDUr_7RGJwp7lhNgrAWNDB6AnSKWeDk76mgLBpCzUXA77VXwqZJLCS_mHMRicV1vtqlgwf-jE",
  },
  {
    id: 27,
    titulo: "Kit Mouse e Mousepad",
    preco: "65,90",
    precoOriginal: "79,90",
    parcelamento: "6x de R$ 13,90",
    img: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQqmPq-H4xFQo8L66M0mNW9RITeuZlL75L7d16wYr69jEWLWLOXnsNcy2LDfVCauzN_WMLn_uPi0HU_4kK-rRBBBv9XGsverkDxAO8N7m_k",
  },
  {
    id: 28,
    titulo: "Fone De Ouvido Gamer",
    preco: "185,90",
    precoOriginal: "219,90",
    parcelamento: "12x de R$ 16,90",
    img: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSacZCf-uht84OmNhvT5y6eMoPDjokVzkGSaDvDE-pS2G47MGxuQzUJGyUZxoRTGoUjkpWL23DXP8mtCxB4OkgxQQiJv79yZE51LypR2YVBCBDyz33S0HM5qQ",
  },
];

function App() {
  const handleSearch = (query: string) => {
    console.log(`Buscando por: "${query}"`);
  };
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);

  const welcomeMessage =
    "Este site é um projeto de estudo e os produtos expostos são fictícios e não estão à venda. Todos os direitos são de seus respectivos proprietários. Aproveite o site!";

  useEffect(() => {
    const messageShownKey = "welcomeMessageShown";

    const hasShownMessage = sessionStorage.getItem(messageShownKey);

    if (!hasShownMessage) {
      setShowWelcomeMessage(true);
      sessionStorage.setItem(messageShownKey, "true");
    }
  }, []);

  return (
    <>
      {showWelcomeMessage && (
        <ErrorMessage
          message={welcomeMessage}
          onClose={() => setShowWelcomeMessage(false)}
        />
      )}
      <Header onSearch={handleSearch} />
      <Outdoor />
      <Produtos products={allProducts.slice(0, 7)} sectionTitle="Lançamentos" />
      <Produtos
        products={allProducts.slice(7, 14)}
        sectionTitle="Mais Vendidos"
      />
      <Produtos
        products={allProducts.slice(14, 21)}
        sectionTitle="Em Promoção"
      />
      <About />
      <Produtos
        products={allProducts.slice(21, 28)}
        sectionTitle="Acessórios"
      />
      <Banner />
      <Footer />
    </>
  );
}

export default App;

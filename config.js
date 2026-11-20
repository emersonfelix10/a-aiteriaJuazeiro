/* ================================================================
   CONFIGURAÇÃO DA AÇAITERIA JUAZEIRO — EDITE OS VALORES DESTA ÁREA
   Os caminhos de imagem são relativos à raiz do site.
   O preço da batida é apenas exemplo: substitua antes de publicar.
   ================================================================ */
(function (root) {
  const config = {
    businessName: "Açaiteria Juazeiro",
    whatsappNumber: "5588992182832",
    whatsappDisplay: "(88) 99218-2832",
    profileImage: "img/perfil-acaiteria-demo.jpg",
    profileImageAlt: "Foto ilustrativa de açaí para o perfil da Açaiteria Juazeiro",

    dailyHighlights: {
      0: { category: "garrafa", label: "Açaí de garrafa" },
      1: { category: "garrafa", label: "Açaí de garrafa" },
      2: { category: "copo", label: "Açaí no copo" },
      3: { category: "barca", label: "Barca de açaí" },
      4: { category: "batida", label: "Batida de Maracujá" },
      5: { category: "barca", label: "Barca de açaí" },
      6: { category: "copo", label: "Açaí no copo" }
    },
    wednesdayIndex: 3,
    wednesdayDiscountRate: 0.10,

    products: [
      {
        category: "garrafa", title: "Açaí de garrafa", kicker: "PRÁTICO PARA LEVAR",
        description: "Escolha sua opção de garrafa.", image: "img/acai-garrafa-demo.jpg", imageAlt: "Foto fictícia de açaí de garrafa para demonstração",
        options: [
          { id: "garrafa", name: "Açaí de garrafa", priceCents: 1200 },
          { id: "ovomaltine", name: "Com Ovomaltine", priceCents: 1300 }
        ]
      },
      {
        category: "copo", title: "Açaí no copo", kicker: "SEU CLÁSSICO",
        description: "Uma escolha gostosa para curtir de colher.", image: "img/acai-copo-demo.jpg", imageAlt: "Foto fictícia de açaí no copo para demonstração",
        options: [{ id: "copo", name: "Açaí no copo", priceCents: 1800 }]
      },
      {
        category: "barca", title: "Barca de açaí", kicker: "ESCOLHA O TAMANHO",
        description: "Escolha o tamanho para dividir ou aproveitar.", image: "img/acai-barca-demo.jpg", imageAlt: "Foto fictícia de barca de açaí para demonstração",
        options: [
          { id: "barca-pequena", name: "Barca pequena", priceCents: 2000 },
          { id: "barca-media", name: "Barca média", priceCents: 2500 },
          { id: "barca-grande", name: "Barca grande", priceCents: 4000 }
        ]
      },
      {
        category: "batida", title: "Batida de Maracujá", kicker: "REFRESCANTE",
        description: "Batida cremosa de maracujá. Consulte a confirmação pelo WhatsApp.", image: "img/batida-maracuja-demo.jpg", imageAlt: "Foto ilustrativa de batida de maracujá",
        options: [{ id: "batida-maracuja", name: "Batida de Maracujá", priceCents: 1200 }]
      }
    ],

    deliveryFees: [
      { name: "Aeroporto", feeCents: 700 },
      { name: "Betolandia", feeCents: 800 },
      { name: "Carité", feeCents: 500 },
      { name: "Centro", feeCents: 600 },
      { name: "Conviver", feeCents: 700 },
      { name: "Franciscano", feeCents: 600 },
      { name: "João Cabral", feeCents: 700 },
      { name: "José Geraldo da Cruz", feeCents: 800 },
      { name: "Juvencio Santana", feeCents: 500 },
      { name: "Leandro Bezerra", feeCents: 800 },
      { name: "Limoeiro", feeCents: 700 },
      { name: "Novo Juazeiro", feeCents: 800 },
      { name: "Pedrinhas", feeCents: 700 },
      { name: "Pio XII", feeCents: 500 },
      { name: "Pirajá", feeCents: 700 },
      { name: "Romeirão", feeCents: 700 },
      { name: "Salesiano", feeCents: 700 },
      { name: "Santa Tereza", feeCents: 700 },
      { name: "São Miguel", feeCents: 700 },
      { name: "Socorro", feeCents: 600 },
      { name: "Timbaubas", feeCents: 600 },
      { name: "Tiradentes", feeCents: 800 },
      { name: "Vila Fátima", feeCents: 400 },
      { name: "Frei Damião", feeCents: 1000 },
      { name: "Horto em Baixo", feeCents: 700 },
      { name: "Rua do Horto", feeCents: 1000 },
      { name: "Vila pelo Sinal (até o trevo do horto)", feeCents: 1000 },
      { name: "Vila 3 Marias (até o condomínio)", feeCents: 800 },
      { name: "Cidade Universitária UFCA", feeCents: 1500 },
      { name: "Lagoa Seca", feeCents: 1000 },
      { name: "São José", feeCents: 1000 },
      { name: "Triângulo", feeCents: 700 },
      { name: "Antônio Vieira", feeCents: 700 },
      { name: "Jardim Gonzaga", feeCents: 1000 },
      { name: "Campo Alegre", feeCents: 1000 },
      { name: "Brejo Seco", feeCents: 900 },
      { name: "Crato", feeCents: 1500 },
      { name: "Barbalha", feeCents: 1700 }
    ],

    pix: {
      key: "INSIRA_SUA_CHAVE_PIX_AQUI",
      qrCodeImage: "img/pix-qrcode.png"
    },
    loyalty: {
      rewardAfterPoints: 10
    },
    proof: {
      maxFileSizeBytes: 8 * 1024 * 1024,
      acceptedMimeTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf"]
    },
    address: "Rua José Barbosa dos Santos, 211, Bairro Vila Fátima",
    hours: [
      { period: "Manhã", orders: "9h às 11h", route: "A rota sai ao meio-dia" },
      { period: "Tarde", orders: "16h às 18h", route: "A rota sai às 18h" }
    ]
  };

  root.ACAITERIA_CONFIG = config;
  if (typeof module !== "undefined" && module.exports) module.exports = config;
})(typeof window !== "undefined" ? window : globalThis);
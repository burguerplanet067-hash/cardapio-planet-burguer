const firebaseConfig = {
  apiKey: "AIzaSyDQMPmu6oBX5XBnijD3wKe52LhzL8oor1o",
  authDomain: "cardapio-digital-planetburguer.firebaseapp.com",
  projectId: "cardapio-digital-planetburguer",
  storageBucket: "cardapio-digital-planetburguer.firebasestorage.app",
  messagingSenderId: "854610195538",
  appId: "1:854610195538:web:11de30fbc8df006523db8b"
};

/* ==========================================================================
   CONFIGURAÇÕES GERAIS DA LOJA E TAXA DE ENTREGA
   ========================================================================== */

const WHATSAPP_LOJA = "5521998165047 "; // Coloque aqui o número do WhatsApp com DDD (apenas números)
const INSTAGRAM_LOJA = "@planetbuguer1"; // Coloque aqui o usuário do Instagram da loja
const HORARIO_FUNCIONAMENTO = "Quarta a Domingo, das 19h às 00h"; // Horário de funcionamento
const PEDIDO_MINIMO = 20.00; // Pedido mínimo de R$ 20,00
const TAXA_ENTREGA = 6.00; // Taxa de entrega de R$ 6,00
const AVISO_RODAPE = "Imagens meramente ilustrativas."; // Rodapé do site

/* ==========================================================================
   LISTA DE PRODUTOS DO CARDÁPIO
   ========================================================================== */

const PRODUTOS = [
  // --- HAMBÚRGUERES ---
  {
    id: "hamburguer_mercurio",
    categoria: "hamburgueres",
    nome: "Mercúrio",
    legenda: "Artesanal da casa",
    descricao: "Hambúrguer artesanal no pão australiano com queijo fatiado, molho cheddar, queijo cheddar extra e bacon crocante.",
    ingredientes: "Pão australiano, hambúrguer artesanal, queijo fatiado, molho cheddar, queijo cheddar e bacon",
    preco: 34.77,
    imagem: "images/mercurio.jpg",
    destaque: true,
    disponivel: true,
    permiteAdicionais: true,
    permiteCombo: true,
    removeis: ["Bacon", "Molho cheddar", "Queijo cheddar"]
  },
  {
    id: "hamburguer_terra",
    categoria: "hamburgueres",
    nome: "Terra",
    legenda: "Clássico especial da casa",
    descricao: "Hambúrguer artesanal suculento com ingredientes selecionados.",
    ingredientes: "Pão, carne artesanal, queijo e molho especial",
    preco: 34.77,
    imagem: "images/terra.jpg",
    destaque: true,
    disponivel: true,
    permiteAdicionais: true,
    permiteCombo: true,
    removeis: ["Molho especial"]
  },
  {
    id: "hamburguer_x_tudo",
    categoria: "hamburgueres",
    nome: "X-Tudo",
    legenda: "Completo e bem recheado",
    descricao: "O mais completo da casa com todos os acompanhamentos.",
    ingredientes: "Pão, carne, queijo, presunto, bacon, ovo, salada e molho especial",
    preco: 17.00,
    imagem: "images/x-tudo.jpg",
    destaque: true,
    disponivel: true,
    permiteAdicionais: true,
    permiteCombo: true,
    removeis: ["Bacon", "Ovo", "Salada"]
  },
  {
    id: "hamburguer_x_bacon",
    categoria: "hamburgueres",
    nome: "X-Bacon",
    legenda: "Muito bacon crocante",
    descricao: "Hambúrguer delicioso com bastante bacon crocante e queijo derretido.",
    ingredientes: "Pão, carne, queijo e bacon",
    preco: 14.07,
    imagem: "images/x-bacon.jpg",
    destaque: false,
    disponivel: true,
    permiteAdicionais: true,
    permiteCombo: true,
    removeis: ["Bacon"]
  },
  {
    id: "hamburguer_x_calabresa",
    categoria: "hamburgueres",
    nome: "X-Calabresa",
    legenda: "Com fatias de calabresa",
    descricao: "Hambúrguer acompanhado de fatias de calabresa acebolada e queijo.",
    ingredientes: "Pão, carne, queijo e calabresa",
    preco: 13.77,
    imagem: "images/x-calabresa.jpg",
    destaque: false,
    disponivel: true,
    permiteAdicionais: true,
    permiteCombo: true,
    removeis: ["Calabresa"]
  },
  {
    id: "hamburguer_x_burguer",
    categoria: "hamburgueres",
    nome: "X-Burguer",
    legenda: "O clássico simplificado",
    descricao: "Hambúrguer tradicional com queijo derretido no pão macio.",
    ingredientes: "Pão, carne e queijo",
    preco: 10.77,
    imagem: "images/x-burguer.jpg",
    destaque: false,
    disponivel: true,
    permiteAdicionais: true,
    permiteCombo: true,
    removeis: []
  },

  // --- ACOMPANHAMENTOS ---
  {
    id: "batata_bacon_cheddar_m",
    categoria: "acompanhamentos",
    nome: "Batata Frita com Cheddar e Bacon M",
    legenda: "Porção média",
    descricao: "Batata frita coberta com molho cheddar cremoso e bacon crocante.",
    ingredientes: "Batata frita, molho cheddar e bacon",
    preco: 17.00,
    imagem: "images/batata_frita.jpg",
    destaque: true,
    disponivel: true,
    permiteAdicionais: true,
    permiteCombo: false,
    removeis: ["Bacon", "Cheddar"]
  },
  {
    id: "batata_bacon_cheddar_g",
    categoria: "acompanhamentos",
    nome: "Batata Frita com Cheddar e Bacon G",
    legenda: "Porção grande",
    descricao: "Porção generosa de batata frita com muito cheddar cremoso e bastante bacon.",
    ingredientes: "Batata frita, molho cheddar e bacon",
    preco: 27.00,
    imagem: "images/batata_frita.jpg",
    destaque: true,
    disponivel: true,
    permiteAdicionais: true,
    permiteCombo: false,
    removeis: ["Bacon", "Cheddar"]
  },
  {
    id: "batata_p",
    categoria: "acompanhamentos",
    nome: "Batata Frita P",
    legenda: "Porção individual",
    descricao: "Porção pequena de batata frita crocante temperada apenas com sal.",
    ingredientes: "Batata frita e sal",
    preco: 7.00,
    imagem: "images/batata_frita.jpg",
    destaque: false,
    disponivel: true,
    permiteAdicionais: false,
    permiteCombo: false,
    removeis: ["Sal"]
  },
  {
    id: "aneis_cebola",
    categoria: "acompanhamentos",
    nome: "Anel de Cebola (10 unidades)",
    legenda: "Onion Rings crocantes",
    descricao: "Porção com 10 anéis de cebola empanados e fritos até ficarem dourados.",
    ingredientes: "Cebola empanada",
    preco: 15.77,
    imagem: "images/aneis_cebola.jpg",
    destaque: true,
    disponivel: true,
    permiteAdicionais: false,
    permiteCombo: false,
    removeis: []
  },

  // --- BEBIDAS ---
  {
    id: "coca_cola",
    categoria: "bebidas",
    nome: "Coca-Cola",
    legenda: "Lata 350ml",
    descricao: "Refrigerante Coca-Cola bem gelado.",
    ingredientes: "Coca-Cola",
    preco: 7.00,
    imagem: "images/coca_cola.jpg",
    destaque: false,
    disponivel: true,
    permiteAdicionais: false,
    permiteCombo: false,
    removeis: []
  },
  {
    id: "coquinha_200ml",
    categoria: "bebidas",
    nome: "Coquinha 200ml",
    legenda: "Garrafinha 200ml",
    descricao: "Coca-Cola caçulinha 200ml bem gelada.",
    ingredientes: "Coca-Cola",
    preco: 3.50,
    imagem: "images/coca_cola_200.jpg",
    destaque: false,
    disponivel: true,
    permiteAdicionais: false,
    permiteCombo: false,
    removeis: []
  },
  {
    id: "guarana_antarctica",
    categoria: "bebidas",
    nome: "Guaraná Antártica",
    legenda: "Lata 350ml",
    descricao: "Refrigerante Guaraná Antártica bem gelado.",
    ingredientes: "Guaraná Antártica",
    preco: 7.00,
    imagem: "images/guarana.jpg",
    destaque: false,
    disponivel: true,
    permiteAdicionais: false,
    permiteCombo: false,
    removeis: []
  },
  {
    id: "guaravita",
    categoria: "bebidas",
    nome: "Guaravita",
    legenda: "Copo 290ml",
    descricao: "Bebida de guaraná tradicional bem gelada.",
    ingredientes: "Guaravita",
    preco: 3.00,
    imagem: "images/guaravita.jpg",
    destaque: false,
    disponivel: true,
    permiteAdicionais: false,
    permiteCombo: false,
    removeis: []
  },
  {
    id: "del_valle",
    categoria: "bebidas",
    nome: "Del Valle",
    legenda: "Lata / Garrafa",
    descricao: "Suco Del Valle saboroso e gelado.",
    ingredientes: "Suco Del Valle",
    preco: 8.00,
    imagem: "images/del_valle_uva.jpg",
    destaque: false,
    disponivel: true,
    permiteAdicionais: false,
    permiteCombo: false,
    removeis: []
  },

  // --- SOBREMESAS ---
  {
    id: "morango_ao_leite_300ml",
    categoria: "sobremesas",
    nome: "Morango ao Leite 300ml",
    legenda: "Copo 300ml",
    descricao: "Deliciosa sobremesa de morango ao leite geladinha.",
    ingredientes: "Morango e leite condensado/creme",
    preco: 12.77,
    imagem: "images/morango_leite.jpg",
    destaque: false,
    disponivel: true,
    permiteAdicionais: false,
    permiteCombo: false,
    removeis: []
  },
  {
    id: "morango_ao_leite_500ml",
    categoria: "sobremesas",
    nome: "Morango ao Leite 500ml",
    legenda: "Copo 500ml",
    descricao: "Porção grande de morango ao leite geladinha.",
    ingredientes: "Morango e leite condensado/creme",
    preco: 15.97,
    imagem: "images/morango_leite.jpg",
    destaque: false,
    disponivel: true,
    permiteAdicionais: false,
    permiteCombo: false,
    removeis: []
  }
];

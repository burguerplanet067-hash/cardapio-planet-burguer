/* ============================================================
   PLANET BURGUER — ARQUIVO DE CONFIGURAÇÃO
   ============================================================
   Este é o ÚNICO arquivo que você precisa editar no dia a dia.
   Não é necessário saber programar: só troque os textos,
   números e caminhos de imagem que estão entre aspas " ".

   DICA: depois de editar, salve o arquivo e atualize a página
   do site (ou publique novamente, se já estiver no ar).
   ============================================================ */

/* ------------------------------------------------------------
   1) NÚMERO DO WHATSAPP DA LOJA
   ------------------------------------------------------------
   Coloque o número completo, com código do país (55) e DDD,
   SEM espaços, traços ou símbolos.
   Exemplo para (21) 99999-9999  ->  "5521999999999"
------------------------------------------------------------- */
const WHATSAPP_NUMBER = "5521998165047"; // <-- número real da loja

/* ------------------------------------------------------------
   1.1) SENHA DO PAINEL ADMINISTRATIVO
   ------------------------------------------------------------
   Essa senha protege a página admin.html contra acesso casual.
   IMPORTANTE: como este site não tem servidor/banco de dados,
   essa senha fica no próprio código do site — ou seja, ela
   impede que um cliente comum mexa por engano, mas NÃO é uma
   segurança forte (alguém com conhecimento técnico poderia
   contornar). Não reutilize uma senha importante aqui.
   Troque para uma senha simples só sua.
------------------------------------------------------------- */
const ADMIN_PASSWORD = "planetburguer2026"; // <-- TROQUE AQUI

/* ------------------------------------------------------------
   2) DADOS DA LOJA
------------------------------------------------------------- */
const STORE_INFO = {
  name: "Planet Burguer",
  slogan: "Uma viagem pelo universo dos sabores 🌌🍔",
  instagram: "planetbuguer1", // sem @, só o nome de usuário
  horario: "19h às 01h", // horário de funcionamento exibido no site
  endereco: {
    rua: "Rua General de Carvalho, 1123",
    bairro: "Vista Alegre",
    cidade: "Rio de Janeiro - RJ",
  },
};

/* ------------------------------------------------------------
   2.0.1) HORÁRIO DE FUNCIONAMENTO (para o aviso de aberto/fechado)
   ------------------------------------------------------------
   Use o formato 24h (0 a 23). Se o horário passar da meia-noite
   (como no nosso caso, 19h às 01h), pode colocar "fechamento"
   menor que "abertura" sem problema — o site entende que é do
   dia seguinte.
------------------------------------------------------------- */
const BUSINESS_HOURS = {
  abertura: 19, // abre às 19h
  fechamento: 1, // fecha à 01h (do dia seguinte)
};

/* ------------------------------------------------------------
   2.1) ENTREGA
   - taxaEntrega: valor cobrado quando o pedido é para entrega
     (somado automaticamente ao total e à mensagem do WhatsApp)
   - pedidoMinimo: valor mínimo de produtos exigido para fechar
     o pedido (não conta a taxa de entrega)
------------------------------------------------------------- */
const DELIVERY_FEE = 6.0;
const MINIMUM_ORDER = 20.0;

/* ------------------------------------------------------------
   2.2) "VIRAR COMBO" (acréscimo dentro do hambúrguer)
   ------------------------------------------------------------
   Em vez de combos como produtos separados, o cliente decide
   direto na tela do hambúrguer se quer "virar combo" (acrescenta
   batata + bebida por um valor a mais). Isso aparece como uma
   opção (interruptor) dentro de cada hambúrguer que tiver
   "permiteCombo: true" lá no cadastro do produto.
------------------------------------------------------------- */
const COMBO_ADDON = {
  nome: "Batata frita M + refrigerante lata",
  preco: 15.9,
};

/* ------------------------------------------------------------
   3) CATEGORIAS
   Cada categoria tem um id (não mude o id depois de usar,
   pois os produtos apontam para ele), um nome e um emoji/ícone.
------------------------------------------------------------- */
const CATEGORIES = [
  { id: "hamburgueres", nome: "Hambúrgueres", icone: "🍔" },
  { id: "combos", nome: "Combos", icone: "🍱" },
  { id: "acompanhamentos", nome: "Acompanhamentos", icone: "🍟" },
  { id: "bebidas", nome: "Bebidas", icone: "🥤" },
  { id: "sobremesas", nome: "Sobremesas", icone: "🍨" },
];

/* ------------------------------------------------------------
   4) ADICIONAIS DISPONÍVEIS
   Lista única de adicionais que qualquer hambúrguer pode usar.
   "preco" é o valor extra cobrado por unidade.
------------------------------------------------------------- */
const ADDONS = [
  { id: "bacon", nome: "Bacon", preco: 6.0 },
  { id: "cheddar", nome: "Cheddar extra", preco: 5.0 },
  { id: "queijo", nome: "Queijo extra", preco: 4.0 },
  { id: "hamburguer_extra", nome: "Hambúrguer extra (carne)", preco: 9.0 },
  { id: "ovo", nome: "Ovo", preco: 3.0 },
  { id: "cebola_caramelizada", nome: "Cebola caramelizada", preco: 4.0 },
  { id: "molho_especial", nome: "Molho especial da casa", preco: 2.5 },
  { id: "anel_cebola", nome: "Anéis de cebola empanados", preco: 6.5 },
];

/* ------------------------------------------------------------
   5) INGREDIENTES REMOVÍVEIS (sem custo)
   Ingredientes comuns que o cliente pode pedir para tirar,
   sem cobrar nada a mais.
------------------------------------------------------------- */
const REMOVABLE_DEFAULT = ["Cebola", "Picles", "Molho", "Tomate", "Alface"];

/* ------------------------------------------------------------
   6) FORMAS DE PAGAMENTO
------------------------------------------------------------- */
const PAYMENT_METHODS = [
  { id: "pix", nome: "Pix" },
  { id: "dinheiro", nome: "Dinheiro" },
  { id: "cartao", nome: "Cartão (na entrega/retirada)" },
  { id: "outros", nome: "Outros" },
];

/* ------------------------------------------------------------
   7) PRODUTOS
   Para adicionar um produto novo, copie um bloco { ... }
   inteiro, cole abaixo, e troque os valores.

   Campos:
   - id: identificador único, sem espaços (ex: "urano")
   - categoria: precisa ser um dos ids da lista CATEGORIES acima
   - nome: nome exibido
   - subtitulo: frase curta (o "conceito" do planeta)
   - descricao: descrição maior, some no modal do produto
   - ingredientes: lista de ingredientes (texto)
   - preco: preço base, em número (use ponto, não vírgula)
   - imagem: caminho do arquivo de imagem
   - destaque: true/false — aparece na seção "Destaques" da home
   - disponivel: true/false — false esconde o produto do cardápio
   - permiteAdicionais: true/false
   - permiteCombo: true/false — mostra a opção "virar combo" (batata
     + bebida por um valor a mais) na tela do produto
   - removiveis: lista de ingredientes que podem ser retirados
------------------------------------------------------------- */
const PRODUCTS = [
  {
    id: "x_burguer",
    categoria: "hamburgueres",
    nome: "X-Burguer",
    subtitulo: "O clássico, do jeito que tem que ser",
    descricao:
      "O lanche mais simples e certeiro da casa: pão macio, hambúrguer suculento, queijo derretido, alface, tomate e cebola.",
    ingredientes: "Pão, hambúrguer 150g, queijo, alface, tomate e cebola roxa",
    preco: 18.9,
    imagem: "images/x_burguer.jpg",
    destaque: false,
    disponivel: true,
    permiteAdicionais: true,
    permiteCombo: true,
    removiveis: REMOVABLE_DEFAULT,
  },
  {
    id: "x_tudo",
    categoria: "hamburgueres",
    nome: "X-Tudo",
    subtitulo: "Com tudo que você merece",
    descricao:
      "Completo do jeito que a gente gosta: queijo, bacon, calabresa, ovo, alface, tomate e cebola. Nosso mais pedido.",
    ingredientes:
      "Pão, hambúrguer 150g, queijo, bacon, calabresa, ovo, alface, tomate e cebola roxa",
    preco: 26.9,
    imagem: "images/x_tudo.jpg",
    destaque: true,
    disponivel: true,
    permiteAdicionais: true,
    permiteCombo: true,
    removiveis: REMOVABLE_DEFAULT,
  },
  {
    id: "x_calabresa",
    categoria: "hamburgueres",
    nome: "X-Calabresa",
    subtitulo: "Sabor marcante, no ponto certo",
    descricao:
      "Fatias generosas de calabresa grelhada com queijo derretido, alface, tomate e cebola. Para quem gosta de um sabor mais intenso.",
    ingredientes:
      "Pão, hambúrguer 150g, queijo, calabresa fatiada, alface, tomate e cebola roxa",
    preco: 24.9,
    imagem: "images/x_calabresa.jpg",
    destaque: false,
    disponivel: true,
    permiteAdicionais: true,
    permiteCombo: true,
    removiveis: REMOVABLE_DEFAULT,
  },
  {
    id: "x_bacon",
    categoria: "hamburgueres",
    nome: "X-Bacon",
    subtitulo: "Bacon crocante em dose generosa",
    descricao:
      "Fatias fartas de bacon crocante com queijo derretido, alface, tomate e cebola. Simples e delicioso, do jeito que o bacon merece.",
    ingredientes:
      "Pão, hambúrguer 150g, queijo, bacon crocante, alface, tomate e cebola roxa",
    preco: 25.9,
    imagem: "images/x_bacon.jpg",
    destaque: true,
    disponivel: true,
    permiteAdicionais: true,
    permiteCombo: true,
    removiveis: REMOVABLE_DEFAULT,
  },

  /* --- Combos --- */
  {
    id: "combo_kids",
    categoria: "combos",
    nome: "Combo Kids",
    subtitulo: "Mini lanche + batata + suco + brinde surpresa",
    descricao:
      "Combo pensado para os pequenos: um mini hambúrguer completo, batata frita, um suco Del Valle e um brinde surpresa da Planet Burguer.",
    ingredientes: "1x Mini hambúrguer, 1x Batata Frita M, 1x Del Valle e 1x brinde surpresa",
    preco: 29.9,
    imagem: "images/combo_kids.jpg",
    destaque: true,
    disponivel: true,
    permiteAdicionais: false,
    permiteCombo: false,
    removiveis: [],
  },

  /* --- Acompanhamentos --- */
  {
    id: "batata_frita_m",
    categoria: "acompanhamentos",
    nome: "Batata Frita M",
    subtitulo: "Porção média com cheddar e bacon",
    descricao:
      "Porção média de batatas fritas crocantes cobertas com cheddar cremoso e bacon crocante.",
    ingredientes: "Batata, cheddar cremoso e bacon crocante",
    preco: 15.9,
    imagem: "images/batata_frita.jpg",
    destaque: false,
    disponivel: true,
    permiteAdicionais: false,
    permiteCombo: false,
    removiveis: [],
  },
  {
    id: "batata_frita_g",
    categoria: "acompanhamentos",
    nome: "Batata Frita G",
    subtitulo: "Porção grande com cheddar e bacon — para compartilhar",
    descricao:
      "Porção grande de batatas fritas crocantes cobertas com cheddar cremoso e bacon crocante, ideal para compartilhar.",
    ingredientes: "Batata, cheddar cremoso e bacon crocante",
    preco: 22.9,
    imagem: "images/batata_frita.jpg",
    destaque: false,
    disponivel: true,
    permiteAdicionais: false,
    permiteCombo: false,
    removiveis: [],
  },

  /* --- Bebidas --- */
  {
    id: "coca_cola",
    categoria: "bebidas",
    nome: "Coca-Cola",
    subtitulo: "Lata 350ml, gelada",
    descricao: "Coca-Cola gelada, lata 350ml.",
    ingredientes: "",
    preco: 6.5,
    imagem: "images/coca_cola.jpg",
    destaque: false,
    disponivel: true,
    permiteAdicionais: false,
    permiteCombo: false,
    removiveis: [],
  },
  {
    id: "guaravita",
    categoria: "bebidas",
    nome: "Guaravita",
    subtitulo: "290ml, gelada",
    descricao: "Bebida de guaraná adoçada, 290ml, bem gelada.",
    ingredientes: "",
    preco: 5.5,
    imagem: "images/guaravita.jpg",
    destaque: false,
    disponivel: true,
    permiteAdicionais: false,
    permiteCombo: false,
    removiveis: [],
  },
  {
    id: "del_valle_uva",
    categoria: "bebidas",
    nome: "Del Valle Uva",
    subtitulo: "290ml, gelado",
    descricao: "Suco de uva Del Valle, lata 290ml, bem gelado.",
    ingredientes: "",
    preco: 6.0,
    imagem: "images/del_valle_uva.jpg",
    destaque: false,
    disponivel: true,
    permiteAdicionais: false,
    permiteCombo: false,
    removiveis: [],
  },

  /* --- Sobremesas --- */
  {
    id: "morango_ao_leite_300",
    categoria: "sobremesas",
    nome: "Morango ao Leite 300ml",
    subtitulo: "Cremoso, geladinho e bem docinho",
    descricao: "Bebida cremosa de morango com leite, 300ml, servida bem gelada.",
    ingredientes: "Morango, leite e açúcar",
    preco: 10.9,
    imagem: "images/morango_ao_leite.jpg",
    destaque: false,
    disponivel: true,
    permiteAdicionais: false,
    permiteCombo: false,
    removiveis: [],
  },
  {
    id: "morango_ao_leite_500",
    categoria: "sobremesas",
    nome: "Morango ao Leite 500ml",
    subtitulo: "Cremoso, geladinho e bem docinho — porção maior",
    descricao: "Bebida cremosa de morango com leite, 500ml, servida bem gelada.",
    ingredientes: "Morango, leite e açúcar",
    preco: 14.9,
    imagem: "images/morango_ao_leite.jpg",
    destaque: false,
    disponivel: true,
    permiteAdicionais: false,
    permiteCombo: false,
    removiveis: [],
  },
];

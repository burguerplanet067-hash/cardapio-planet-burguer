/* ============================================================
   PLANET BURGUER — LÓGICA DO PAINEL ADMINISTRATIVO
   ============================================================
   Este arquivo lê os dados atuais de js/config.js, permite editar
   tudo visualmente, guarda um rascunho no navegador (localStorage)
   e gera um novo js/config.js para você baixar e publicar.
   ============================================================ */

(function () {
  "use strict";

  const STORAGE_KEY = "planetburguer_admin_draft_v1";

  /* ---------------- ESTADO DE TRABALHO ---------------- */
  // Começa a partir do que está em config.js, ou de um rascunho salvo antes.
  let draft = loadDraft();

  function defaultDraft() {
    return {
      whatsappNumber: WHATSAPP_NUMBER,
      adminPassword: ADMIN_PASSWORD,
      deliveryFee: DELIVERY_FEE,
      minimumOrder: MINIMUM_ORDER,
      comboAddon: JSON.parse(JSON.stringify(COMBO_ADDON)),
      businessHours: JSON.parse(JSON.stringify(BUSINESS_HOURS)),
      storeInfo: JSON.parse(JSON.stringify(STORE_INFO)),
      categories: JSON.parse(JSON.stringify(CATEGORIES)),
      addons: JSON.parse(JSON.stringify(ADDONS)),
      paymentMethods: JSON.parse(JSON.stringify(PAYMENT_METHODS)),
      products: JSON.parse(JSON.stringify(PRODUCTS)),
    };
  }

  function loadDraft() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      /* localStorage indisponível ou corrompido: ignora e usa o padrão */
    }
    return defaultDraft();
  }

  function saveDraft() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch (e) {
      /* silencioso — se não der pra salvar rascunho, ainda dá pra exportar */
    }
  }

  function uid(prefix) {
    return (
      prefix +
      "_" +
      Date.now().toString(36) +
      Math.random().toString(36).slice(2, 6)
    );
  }

  function slugify(str) {
    return (str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/(^_|_$)/g, "") || uid("item");
  }

  function el(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }

  function showToast(msg, type) {
    const toast = document.getElementById("adminToast");
    toast.textContent = msg;
    toast.classList.toggle("error", type === "error");
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2600);
  }

  /* ---------------- LOGIN ---------------- */
  const loginScreen = document.getElementById("loginScreen");
  const adminScreen = document.getElementById("adminScreen");
  const SESSION_KEY = "planetburguer_admin_session";

  function tryLogin() {
    const input = document.getElementById("adminPasswordInput").value;
    if (input === draft.adminPassword) {
      sessionStorage.setItem(SESSION_KEY, "1");
      loginScreen.classList.add("hidden");
      adminScreen.classList.remove("hidden");
      renderAll();
    } else {
      document.getElementById("loginError").textContent = "Senha incorreta. Tente novamente.";
    }
  }

  document.getElementById("loginBtn").addEventListener("click", tryLogin);
  document.getElementById("adminPasswordInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") tryLogin();
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY);
    adminScreen.classList.add("hidden");
    loginScreen.classList.remove("hidden");
    document.getElementById("adminPasswordInput").value = "";
  });

  if (sessionStorage.getItem(SESSION_KEY) === "1") {
    loginScreen.classList.add("hidden");
    adminScreen.classList.remove("hidden");
  }

  /* ---------------- TABS ---------------- */
  document.querySelectorAll(".admin-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".admin-tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".admin-panel").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById("panel-" + tab.dataset.tab).classList.add("active");
    });
  });

  /* ---------------- RENDER: PRODUTOS ---------------- */
  const productsList = document.getElementById("productsList");

  function categoryOptions(selectedId) {
    return draft.categories
      .map(
        (c) =>
          `<option value="${c.id}" ${c.id === selectedId ? "selected" : ""}>${c.icone} ${c.nome}</option>`
      )
      .join("");
  }

  function renderProducts() {
    productsList.innerHTML = "";
    draft.products.forEach((p, index) => {
      productsList.appendChild(productItemCard(p, index));
    });
  }

  function productItemCard(p, index) {
    const card = el(`
      <div class="admin-item" data-index="${index}">
        <div class="admin-item-head">
          <div class="drag-thumb"><img src="${p.imagem || "images/logo.svg"}" alt=""></div>
          <div style="flex:1;">
            <div class="item-title">${p.nome || "(sem nome)"}</div>
            <div class="item-sub">${p.categoria || "sem categoria"} · R$ ${(p.preco || 0).toFixed(2).replace(".", ",")}</div>
          </div>
          <button type="button" class="delete-item-btn" data-action="delete">Excluir</button>
        </div>
        <div class="admin-field-grid">
          <div class="admin-field">
            <label>Nome</label>
            <input type="text" data-field="nome" value="${escapeAttr(p.nome)}">
          </div>
          <div class="admin-field">
            <label>Categoria</label>
            <select data-field="categoria">${categoryOptions(p.categoria)}</select>
          </div>
          <div class="admin-field span2">
            <label>Subtítulo</label>
            <input type="text" data-field="subtitulo" value="${escapeAttr(p.subtitulo)}">
          </div>
          <div class="admin-field span2">
            <label>Descrição</label>
            <textarea data-field="descricao">${escapeHtml(p.descricao)}</textarea>
          </div>
          <div class="admin-field span2">
            <label>Ingredientes</label>
            <input type="text" data-field="ingredientes" value="${escapeAttr(p.ingredientes)}">
          </div>
          <div class="admin-field">
            <label>Preço (R$)</label>
            <input type="number" step="0.01" min="0" data-field="preco" value="${p.preco}">
          </div>
          <div class="admin-field">
            <label>Caminho da imagem</label>
            <input type="text" data-field="imagem" value="${escapeAttr(p.imagem)}" placeholder="images/nome.jpg">
          </div>
          <div class="admin-field span2">
            <label>Ingredientes removíveis (separados por vírgula)</label>
            <input type="text" data-field="removiveis" value="${escapeAttr((p.removiveis || []).join(", "))}">
          </div>
        </div>
        <div class="admin-switches">
          <label class="admin-switch ${p.disponivel ? "on" : ""}"><input type="checkbox" data-field="disponivel" ${p.disponivel ? "checked" : ""}> Disponível no cardápio</label>
          <label class="admin-switch ${p.destaque ? "on" : ""}"><input type="checkbox" data-field="destaque" ${p.destaque ? "checked" : ""}> Aparece em Destaques</label>
          <label class="admin-switch ${p.permiteAdicionais ? "on" : ""}"><input type="checkbox" data-field="permiteAdicionais" ${p.permiteAdicionais ? "checked" : ""}> Permite adicionais</label>
          <label class="admin-switch ${p.permiteCombo ? "on" : ""}"><input type="checkbox" data-field="permiteCombo" ${p.permiteCombo ? "checked" : ""}> Permite "virar combo"</label>
        </div>
      </div>
    `);

    // campos de texto/número/select
    card.querySelectorAll("[data-field]").forEach((input) => {
      const field = input.dataset.field;
      const evt = input.tagName === "SELECT" || input.type === "checkbox" ? "change" : "input";
      input.addEventListener(evt, () => {
        if (input.type === "checkbox") {
          draft.products[index][field] = input.checked;
          input.closest(".admin-switch").classList.toggle("on", input.checked);
        } else if (field === "preco") {
          draft.products[index][field] = parseFloat(input.value) || 0;
        } else if (field === "removiveis") {
          draft.products[index][field] = input.value
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        } else {
          draft.products[index][field] = input.value;
        }
        saveDraft();
        // atualiza cabeçalho (nome/preço/categoria/imagem) sem re-renderizar tudo
        if (["nome", "preco", "categoria", "imagem"].includes(field)) {
          const head = card.querySelector(".item-title");
          const sub = card.querySelector(".item-sub");
          const thumb = card.querySelector(".drag-thumb img");
          head.textContent = draft.products[index].nome || "(sem nome)";
          sub.textContent = `${draft.products[index].categoria || "sem categoria"} · R$ ${(draft.products[index].preco || 0).toFixed(2).replace(".", ",")}`;
          thumb.src = draft.products[index].imagem || "images/logo.svg";
        }
      });
    });

    card.querySelector('[data-action="delete"]').addEventListener("click", () => {
      if (confirm(`Excluir o produto "${draft.products[index].nome}"?`)) {
        draft.products.splice(index, 1);
        saveDraft();
        renderProducts();
      }
    });

    return card;
  }

  document.getElementById("addProductBtn").addEventListener("click", () => {
    const novo = {
      id: uid("produto"),
      categoria: draft.categories[0] ? draft.categories[0].id : "",
      nome: "Novo Produto",
      subtitulo: "",
      descricao: "",
      ingredientes: "",
      preco: 0,
      imagem: "",
      destaque: false,
      disponivel: true,
      permiteAdicionais: true,
      permiteCombo: false,
      removiveis: [],
    };
    draft.products.push(novo);
    saveDraft();
    renderProducts();
    showToast("Produto adicionado — edite os campos abaixo.");
  });

  /* ---------------- RENDER: CATEGORIAS ---------------- */
  const categoriesList = document.getElementById("categoriesList");

  function renderCategories() {
    categoriesList.innerHTML = "";
    draft.categories.forEach((cat, index) => {
      const card = el(`
        <div class="admin-item">
          <div class="admin-item-head">
            <div style="flex:1;"><div class="item-title">${cat.icone || ""} ${cat.nome || "(sem nome)"}</div><div class="item-sub">id: ${cat.id}</div></div>
            <button type="button" class="delete-item-btn" data-action="delete">Excluir</button>
          </div>
          <div class="admin-field-grid">
            <div class="admin-field"><label>Nome</label><input type="text" data-field="nome" value="${escapeAttr(cat.nome)}"></div>
            <div class="admin-field"><label>Ícone (emoji)</label><input type="text" data-field="icone" value="${escapeAttr(cat.icone)}"></div>
          </div>
        </div>
      `);
      card.querySelectorAll("[data-field]").forEach((input) => {
        input.addEventListener("input", () => {
          draft.categories[index][input.dataset.field] = input.value;
          saveDraft();
          const head = card.querySelector(".item-title");
          head.textContent = `${draft.categories[index].icone || ""} ${draft.categories[index].nome || "(sem nome)"}`;
          renderProducts(); // atualiza os seletores de categoria nos produtos
        });
      });
      card.querySelector('[data-action="delete"]').addEventListener("click", () => {
        const emUso = draft.products.some((p) => p.categoria === cat.id);
        const msg = emUso
          ? `Existem produtos usando a categoria "${cat.nome}". Excluir mesmo assim?`
          : `Excluir a categoria "${cat.nome}"?`;
        if (confirm(msg)) {
          draft.categories.splice(index, 1);
          saveDraft();
          renderCategories();
          renderProducts();
        }
      });
      categoriesList.appendChild(card);
    });
  }

  document.getElementById("addCategoryBtn").addEventListener("click", () => {
    const nome = "Nova Categoria";
    draft.categories.push({ id: uid("cat"), nome, icone: "🍽️" });
    saveDraft();
    renderCategories();
    renderProducts();
  });

  /* ---------------- RENDER: ADICIONAIS ---------------- */
  const addonsList = document.getElementById("addonsList");

  function renderAddons() {
    addonsList.innerHTML = "";
    draft.addons.forEach((addon, index) => {
      const card = el(`
        <div class="admin-item">
          <div class="admin-item-head">
            <div style="flex:1;"><div class="item-title">${addon.nome || "(sem nome)"}</div><div class="item-sub">+ R$ ${(addon.preco || 0).toFixed(2).replace(".", ",")}</div></div>
            <button type="button" class="delete-item-btn" data-action="delete">Excluir</button>
          </div>
          <div class="admin-field-grid">
            <div class="admin-field"><label>Nome</label><input type="text" data-field="nome" value="${escapeAttr(addon.nome)}"></div>
            <div class="admin-field"><label>Preço extra (R$)</label><input type="number" step="0.01" min="0" data-field="preco" value="${addon.preco}"></div>
          </div>
        </div>
      `);
      card.querySelectorAll("[data-field]").forEach((input) => {
        input.addEventListener("input", () => {
          const field = input.dataset.field;
          draft.addons[index][field] = field === "preco" ? parseFloat(input.value) || 0 : input.value;
          saveDraft();
          card.querySelector(".item-title").textContent = draft.addons[index].nome || "(sem nome)";
          card.querySelector(".item-sub").textContent = `+ R$ ${(draft.addons[index].preco || 0).toFixed(2).replace(".", ",")}`;
        });
      });
      card.querySelector('[data-action="delete"]').addEventListener("click", () => {
        if (confirm(`Excluir o adicional "${addon.nome}"?`)) {
          draft.addons.splice(index, 1);
          saveDraft();
          renderAddons();
        }
      });
      addonsList.appendChild(card);
    });
  }

  document.getElementById("addAddonBtn").addEventListener("click", () => {
    draft.addons.push({ id: uid("addon"), nome: "Novo adicional", preco: 0 });
    saveDraft();
    renderAddons();
  });

  /* ---------------- RENDER: PAGAMENTO ---------------- */
  const paymentList = document.getElementById("paymentList");

  function renderPayments() {
    paymentList.innerHTML = "";
    draft.paymentMethods.forEach((pm, index) => {
      const card = el(`
        <div class="admin-item">
          <div class="admin-item-head">
            <div style="flex:1;"><div class="item-title">${pm.nome || "(sem nome)"}</div></div>
            <button type="button" class="delete-item-btn" data-action="delete">Excluir</button>
          </div>
          <div class="admin-field-grid">
            <div class="admin-field span2"><label>Nome exibido</label><input type="text" data-field="nome" value="${escapeAttr(pm.nome)}"></div>
          </div>
        </div>
      `);
      card.querySelectorAll("[data-field]").forEach((input) => {
        input.addEventListener("input", () => {
          draft.paymentMethods[index][input.dataset.field] = input.value;
          saveDraft();
          card.querySelector(".item-title").textContent = draft.paymentMethods[index].nome || "(sem nome)";
        });
      });
      card.querySelector('[data-action="delete"]').addEventListener("click", () => {
        if (confirm(`Excluir a forma de pagamento "${pm.nome}"?`)) {
          draft.paymentMethods.splice(index, 1);
          saveDraft();
          renderPayments();
        }
      });
      paymentList.appendChild(card);
    });
  }

  document.getElementById("addPaymentBtn").addEventListener("click", () => {
    draft.paymentMethods.push({ id: uid("pag"), nome: "Nova forma de pagamento" });
    saveDraft();
    renderPayments();
  });

  /* ---------------- RENDER: LOJA / WHATSAPP ---------------- */
  function renderStore() {
    if (!draft.storeInfo.endereco) draft.storeInfo.endereco = {};
    if (draft.deliveryFee === undefined) draft.deliveryFee = DELIVERY_FEE;
    if (draft.minimumOrder === undefined) draft.minimumOrder = MINIMUM_ORDER;
    if (!draft.businessHours) draft.businessHours = { abertura: 19, fechamento: 1 };
    if (!draft.comboAddon) draft.comboAddon = { nome: COMBO_ADDON.nome, preco: COMBO_ADDON.preco };

    document.getElementById("storeName").value = draft.storeInfo.name || "";
    document.getElementById("storeInstagram").value = (draft.storeInfo.instagram || "").replace(/^@/, "");
    document.getElementById("storeSlogan").value = draft.storeInfo.slogan || "";
    document.getElementById("storeHorario").value = draft.storeInfo.horario || "";
    document.getElementById("horaAbertura").value = draft.businessHours.abertura;
    document.getElementById("horaFechamento").value = draft.businessHours.fechamento;
    document.getElementById("whatsappNumber").value = draft.whatsappNumber || "";
    document.getElementById("storeRua").value = draft.storeInfo.endereco.rua || "";
    document.getElementById("storeBairro").value = draft.storeInfo.endereco.bairro || "";
    document.getElementById("storeCidade").value = draft.storeInfo.endereco.cidade || "";
    document.getElementById("adminPasswordField").value = draft.adminPassword || "";
    document.getElementById("deliveryFeeField").value = draft.deliveryFee;
    document.getElementById("minimumOrderField").value = draft.minimumOrder;
    document.getElementById("comboAddonNomeField").value = draft.comboAddon.nome;
    document.getElementById("comboAddonPrecoField").value = draft.comboAddon.preco;
  }

  document.getElementById("horaAbertura").addEventListener("input", (e) => {
    draft.businessHours.abertura = parseInt(e.target.value, 10) || 0;
    saveDraft();
  });
  document.getElementById("horaFechamento").addEventListener("input", (e) => {
    draft.businessHours.fechamento = parseInt(e.target.value, 10) || 0;
    saveDraft();
  });

  document.getElementById("storeHorario").addEventListener("input", (e) => {
    draft.storeInfo.horario = e.target.value;
    saveDraft();
  });
  document.getElementById("storeRua").addEventListener("input", (e) => {
    draft.storeInfo.endereco.rua = e.target.value;
    saveDraft();
  });
  document.getElementById("storeBairro").addEventListener("input", (e) => {
    draft.storeInfo.endereco.bairro = e.target.value;
    saveDraft();
  });
  document.getElementById("storeCidade").addEventListener("input", (e) => {
    draft.storeInfo.endereco.cidade = e.target.value;
    saveDraft();
  });
  document.getElementById("deliveryFeeField").addEventListener("input", (e) => {
    draft.deliveryFee = parseFloat(e.target.value) || 0;
    saveDraft();
  });
  document.getElementById("minimumOrderField").addEventListener("input", (e) => {
    draft.minimumOrder = parseFloat(e.target.value) || 0;
    saveDraft();
  });

  document.getElementById("comboAddonNomeField").addEventListener("input", (e) => {
    draft.comboAddon.nome = e.target.value;
    saveDraft();
  });
  document.getElementById("comboAddonPrecoField").addEventListener("input", (e) => {
    draft.comboAddon.preco = parseFloat(e.target.value) || 0;
    saveDraft();
  });

  document.getElementById("storeName").addEventListener("input", (e) => {
    draft.storeInfo.name = e.target.value;
    saveDraft();
  });
  document.getElementById("storeInstagram").addEventListener("input", (e) => {
    draft.storeInfo.instagram = e.target.value.replace(/^@/, "");
    saveDraft();
  });
  document.getElementById("storeSlogan").addEventListener("input", (e) => {
    draft.storeInfo.slogan = e.target.value;
    saveDraft();
  });
  document.getElementById("whatsappNumber").addEventListener("input", (e) => {
    draft.whatsappNumber = e.target.value.replace(/\D/g, "");
    saveDraft();
  });
  document.getElementById("adminPasswordField").addEventListener("input", (e) => {
    draft.adminPassword = e.target.value;
    saveDraft();
  });

  /* ---------------- RESET / EXPORT ---------------- */
  document.getElementById("resetChangesBtn").addEventListener("click", () => {
    if (confirm("Isso vai descartar todas as alterações feitas neste painel (que ainda não foram baixadas) e voltar aos dados originais do config.js. Continuar?")) {
      draft = defaultDraft();
      saveDraft();
      renderAll();
      showToast("Alterações descartadas.");
    }
  });

  document.getElementById("exportBtn").addEventListener("click", () => {
    const content = generateConfigJs(draft);
    const blob = new Blob([content], { type: "text/javascript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "config.js";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("config.js baixado! Troque o arquivo na pasta do projeto e publique de novo. 🚀");
  });

  /* ---------------- HELPERS DE ESCAPE ---------------- */
  function escapeAttr(str) {
    return String(str ?? "").replace(/"/g, "&quot;");
  }
  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  /* ---------------- GERADOR DO config.js ---------------- */
  function jsString(str) {
    return JSON.stringify(String(str ?? ""));
  }

  function generateConfigJs(d) {
    const categoriesBlock = d.categories
      .map(
        (c) =>
          `  { id: ${jsString(c.id)}, nome: ${jsString(c.nome)}, icone: ${jsString(c.icone)} },`
      )
      .join("\n");

    const addonsBlock = d.addons
      .map(
        (a) =>
          `  { id: ${jsString(a.id)}, nome: ${jsString(a.nome)}, preco: ${Number(a.preco) || 0} },`
      )
      .join("\n");

    const paymentBlock = d.paymentMethods
      .map((p) => `  { id: ${jsString(p.id)}, nome: ${jsString(p.nome)} },`)
      .join("\n");

    const productsBlock = d.products
      .map((p) => {
        const removiveis = (p.removiveis || []).map((r) => jsString(r)).join(", ");
        return `  {
    id: ${jsString(p.id)},
    categoria: ${jsString(p.categoria)},
    nome: ${jsString(p.nome)},
    subtitulo: ${jsString(p.subtitulo)},
    descricao: ${jsString(p.descricao)},
    ingredientes: ${jsString(p.ingredientes)},
    preco: ${Number(p.preco) || 0},
    imagem: ${jsString(p.imagem)},
    destaque: ${p.destaque ? "true" : "false"},
    disponivel: ${p.disponivel ? "true" : "false"},
    permiteAdicionais: ${p.permiteAdicionais ? "true" : "false"},
    permiteCombo: ${p.permiteCombo ? "true" : "false"},
    removiveis: [${removiveis}],
  },`;
      })
      .join("\n");

    return `/* ============================================================
   PLANET BURGUER — ARQUIVO DE CONFIGURAÇÃO
   ============================================================
   Gerado pelo Painel Administrativo (admin.html) em ${new Date().toLocaleString("pt-BR")}.
   Você também pode editar este arquivo manualmente se preferir.
   ============================================================ */

const WHATSAPP_NUMBER = ${jsString(d.whatsappNumber)}; // <-- número da loja

const ADMIN_PASSWORD = ${jsString(d.adminPassword)}; // <-- senha do painel /admin.html

const STORE_INFO = {
  name: ${jsString(d.storeInfo.name)},
  slogan: ${jsString(d.storeInfo.slogan)},
  instagram: ${jsString((d.storeInfo.instagram || "").replace(/^@/, ""))},
  horario: ${jsString(d.storeInfo.horario)},
  endereco: {
    rua: ${jsString(d.storeInfo.endereco ? d.storeInfo.endereco.rua : "")},
    bairro: ${jsString(d.storeInfo.endereco ? d.storeInfo.endereco.bairro : "")},
    cidade: ${jsString(d.storeInfo.endereco ? d.storeInfo.endereco.cidade : "")},
  },
};

const BUSINESS_HOURS = {
  abertura: ${Number(d.businessHours ? d.businessHours.abertura : 19) || 0},
  fechamento: ${Number(d.businessHours ? d.businessHours.fechamento : 1) || 0},
};

const DELIVERY_FEE = ${Number(d.deliveryFee) || 0};
const MINIMUM_ORDER = ${Number(d.minimumOrder) || 0};

const COMBO_ADDON = {
  nome: ${jsString(d.comboAddon ? d.comboAddon.nome : "")},
  preco: ${Number(d.comboAddon ? d.comboAddon.preco : 0) || 0},
};

const CATEGORIES = [
${categoriesBlock}
];

const ADDONS = [
${addonsBlock}
];

const REMOVABLE_DEFAULT = ["Cebola", "Picles", "Molho", "Tomate", "Alface"];

const PAYMENT_METHODS = [
${paymentBlock}
];

const PRODUCTS = [
${productsBlock}
];
`;
  }

  /* ---------------- INIT ---------------- */
  function renderAll() {
    renderProducts();
    renderCategories();
    renderAddons();
    renderPayments();
    renderStore();
  }

  if (sessionStorage.getItem(SESSION_KEY) === "1") {
    renderAll();
  }
})();

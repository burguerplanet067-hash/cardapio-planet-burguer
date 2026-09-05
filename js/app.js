/* ============================================================
   PLANET BURGUER — LÓGICA DO APLICATIVO
   Você não precisa mexer neste arquivo para trocar produtos,
   preços ou o número do WhatsApp — isso fica em js/config.js.
   ============================================================ */

(function () {
  "use strict";

  /* ---------------- ESTADO ---------------- */
  let cart = [];              // itens do carrinho
  let currentProduct = null;  // produto aberto no momento no painel
  let currentQty = 1;
  let currentAddons = {};     // { addonId: quantidade }
  let currentRemoved = {};    // { ingredienteNome: true/false }
  let currentCombo = false;   // se o cliente ativou "virar combo" no produto atual
  let currentOrderType = "retirada";

  /* ---------------- HELPERS ---------------- */
  function formatBRL(value) {
    return "R$ " + value.toFixed(2).replace(".", ",");
  }

  function findProduct(id) {
    return PRODUCTS.find((p) => p.id === id);
  }

  function findAddon(id) {
    return ADDONS.find((a) => a.id === id);
  }

  function showToast(msg, type) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.toggle("error", type === "error");
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function el(html) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstChild;
  }

  function productImageSrc(product) {
    return product.imagem && product.imagem.length > 0
      ? product.imagem
      : "images/logo.svg";
  }

  /* ---------------- OVERLAY / SHEETS ---------------- */
  const overlay = document.getElementById("overlay");
  const sheets = ["productSheet", "cartSheet", "checkoutSheet", "confirmSheet"].map(
    (id) => document.getElementById(id)
  );

  function closeAllSheets() {
    sheets.forEach((s) => s.classList.remove("open"));
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  function openSheet(sheetEl) {
    sheets.forEach((s) => s.classList.remove("open"));
    sheetEl.classList.add("open");
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  overlay.addEventListener("click", closeAllSheets);
  document.getElementById("closeProductSheet").addEventListener("click", closeAllSheets);
  document.getElementById("closeCartSheet").addEventListener("click", closeAllSheets);
  document.getElementById("closeCheckoutSheet").addEventListener("click", closeAllSheets);
  document.getElementById("closeConfirmSheet").addEventListener("click", closeAllSheets);

  /* ---------------- RENDER: TOPO / SLOGAN / INSTAGRAM / INFO STRIP ---------------- */
  document.getElementById("storeSlogan").textContent = STORE_INFO.slogan;
  document.title = STORE_INFO.name + " — Cardápio Digital";

  function renderStoreInfo() {
    const igHandle = "@" + (STORE_INFO.instagram || "").replace(/^@/, "");
    const igUrl = "https://instagram.com/" + (STORE_INFO.instagram || "").replace(/^@/, "");

    const heroIg = document.getElementById("heroInstagram");
    heroIg.href = igUrl;
    document.getElementById("heroInstagramHandle").textContent = igHandle;

    const footerIg = document.getElementById("footerInstagram");
    footerIg.href = igUrl;
    document.getElementById("footerInstagramHandle").textContent = igHandle;

    const endereco = STORE_INFO.endereco || {};
    const enderecoTexto = [endereco.rua, endereco.bairro, endereco.cidade].filter(Boolean).join(" — ");

    document.getElementById("infoDelivery").textContent =
      `Entrega ${formatBRL(DELIVERY_FEE)} · pedido mín. ${formatBRL(MINIMUM_ORDER)}`;

    document.getElementById("footerAddress").textContent = "📍 " + enderecoTexto;
    document.getElementById("footerHours").textContent = "🕒 Funcionamos das " + (STORE_INFO.horario || "");
  }

  /* ---------------- ABERTO / FECHADO ---------------- */
  function isStoreOpen() {
    const now = new Date();
    const hour = now.getHours();
    const { abertura, fechamento } = BUSINESS_HOURS;

    if (abertura === fechamento) return true; // aberto 24h, se configurado assim
    if (abertura < fechamento) {
      // horário normal, não passa da meia-noite (ex: 8h às 18h)
      return hour >= abertura && hour < fechamento;
    }
    // horário que cruza a meia-noite (ex: 19h às 01h)
    return hour >= abertura || hour < fechamento;
  }

  function renderStatusBanner() {
    const banner = document.getElementById("statusBanner");
    const icon = document.getElementById("statusIcon");
    const text = document.getElementById("statusText");
    const waLink = document.getElementById("statusWhatsappLink");

    if (isStoreOpen()) {
      banner.classList.remove("is-closed");
      banner.classList.add("is-open");
      icon.textContent = "🟢";
      text.textContent = "Estamos abertos agora! Peça já 🚀";
      waLink.classList.add("hidden");
    } else {
      banner.classList.remove("is-open");
      banner.classList.add("is-closed");
      icon.textContent = "🔴";
      text.textContent = `No momento estamos fechados. Funcionamos das ${STORE_INFO.horario}.`;
      const msg = `Olá! Vi o cardápio da ${STORE_INFO.name} fora do horário de funcionamento. Gostaria de deixar uma mensagem / fazer um pedido para quando abrirem.`;
      waLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      waLink.classList.remove("hidden");
    }
  }

  /* ---------------- RENDER: CATEGORIAS (nav) ---------------- */
  const categoryNav = document.getElementById("categoryNav");
  function renderCategoryNav() {
    categoryNav.innerHTML = "";
    const allChip = el(
      `<button class="category-chip active" data-cat="all">🌌 Tudo</button>`
    );
    categoryNav.appendChild(allChip);
    CATEGORIES.forEach((cat) => {
      const chip = el(
        `<button class="category-chip" data-cat="${cat.id}">${cat.icone} ${cat.nome}</button>`
      );
      categoryNav.appendChild(chip);
    });

    categoryNav.querySelectorAll(".category-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        categoryNav.querySelectorAll(".category-chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        const catId = chip.dataset.cat;
        const target =
          catId === "all"
            ? document.getElementById("featuredSection")
            : document.getElementById("cat-" + catId);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  /* ---------------- RENDER: DESTAQUES ---------------- */
  const featuredRow = document.getElementById("featuredRow");
  function renderFeatured() {
    const destaques = PRODUCTS.filter((p) => p.destaque && p.disponivel);
    if (destaques.length === 0) {
      document.getElementById("featuredSection").classList.add("hidden");
      return;
    }
    featuredRow.innerHTML = "";
    destaques.forEach((p) => featuredRow.appendChild(productCard(p)));
  }

  /* ---------------- RENDER: CARD DE PRODUTO ---------------- */
  function productCard(product) {
    const card = el(`
      <button class="product-card" data-id="${product.id}">
        <div class="thumb"><img src="${productImageSrc(product)}" alt="${product.nome}" loading="lazy"></div>
        <div class="info">
          <p class="name">${product.nome}</p>
          <p class="subtitle">${product.subtitulo || ""}</p>
          <div class="price-row">
            <span class="price">${formatBRL(product.preco)}</span>
            <span class="add-mini">+</span>
          </div>
        </div>
      </button>
    `);
    card.addEventListener("click", () => openProductSheet(product));
    return card;
  }

  /* ---------------- RENDER: CATEGORIAS COM PRODUTOS ---------------- */
  const categoriesOutput = document.getElementById("categoriesOutput");
  function renderCategories() {
    categoriesOutput.innerHTML = "";
    CATEGORIES.forEach((cat) => {
      const produtosDaCategoria = PRODUCTS.filter(
        (p) => p.categoria === cat.id && p.disponivel
      );
      if (produtosDaCategoria.length === 0) return;

      const section = el(`
        <section class="section" id="cat-${cat.id}">
          <h2 class="section-title">${cat.icone} ${cat.nome}</h2>
          <div class="product-grid"></div>
        </section>
      `);
      const grid = section.querySelector(".product-grid");
      produtosDaCategoria.forEach((p) => grid.appendChild(productCard(p)));
      categoriesOutput.appendChild(section);
    });
  }

  /* ---------------- PAINEL DE PRODUTO ---------------- */
  const productSheet = document.getElementById("productSheet");

  function openProductSheet(product) {
    currentProduct = product;
    currentQty = 1;
    currentAddons = {};
    currentRemoved = {};
    currentCombo = false;

    document.getElementById("productImg").src = productImageSrc(product);
    document.getElementById("productImg").alt = product.nome;
    document.getElementById("productName").textContent = product.nome;
    document.getElementById("productSubtitle").textContent = product.subtitulo || "";
    document.getElementById("productDesc").textContent = product.descricao || "";
    document.getElementById("productIngredients").textContent = product.ingredientes || "—";
    document.getElementById("qtyValue").textContent = currentQty;
    document.getElementById("productObs").value = "";

    // Removíveis
    const removablesBlock = document.getElementById("removablesBlock");
    const removablesList = document.getElementById("removablesList");
    removablesList.innerHTML = "";
    const removiveis = product.removiveis || [];
    if (removiveis.length === 0) {
      removablesBlock.classList.add("hidden");
    } else {
      removablesBlock.classList.remove("hidden");
      removiveis.forEach((ingrediente) => {
        currentRemoved[ingrediente] = false;
        const row = el(`
          <div class="removable-row">
            <span>Sem ${ingrediente}</span>
            <button type="button" class="toggle" data-ingrediente="${ingrediente}" aria-label="Retirar ${ingrediente}"></button>
          </div>
        `);
        row.querySelector(".toggle").addEventListener("click", (e) => {
          const btn = e.currentTarget;
          const isOn = btn.classList.toggle("on");
          currentRemoved[ingrediente] = isOn;
        });
        removablesList.appendChild(row);
      });
    }

    // Adicionais
    const addonsBlock = document.getElementById("addonsBlock");
    const addonsList = document.getElementById("addonsList");
    addonsList.innerHTML = "";
    if (!product.permiteAdicionais) {
      addonsBlock.classList.add("hidden");
    } else {
      addonsBlock.classList.remove("hidden");
      ADDONS.forEach((addon) => {
        currentAddons[addon.id] = 0;
        const row = el(`
          <div class="addon-row">
            <div class="addon-name">
              <span>${addon.nome}</span>
              <span class="addon-price">+ ${formatBRL(addon.preco)}</span>
            </div>
            <div class="qty-control sm" data-addon="${addon.id}">
              <button type="button" class="addon-minus">−</button>
              <span class="addon-qty">0</span>
              <button type="button" class="addon-plus">+</button>
            </div>
          </div>
        `);
        const qtySpan = row.querySelector(".addon-qty");
        row.querySelector(".addon-minus").addEventListener("click", () => {
          currentAddons[addon.id] = Math.max(0, currentAddons[addon.id] - 1);
          qtySpan.textContent = currentAddons[addon.id];
          updateProductTotal();
        });
        row.querySelector(".addon-plus").addEventListener("click", () => {
          currentAddons[addon.id] = currentAddons[addon.id] + 1;
          qtySpan.textContent = currentAddons[addon.id];
          updateProductTotal();
        });
        addonsList.appendChild(row);
      });
    }

    // Virar combo
    const comboBlock = document.getElementById("comboBlock");
    const comboToggleBtn = document.getElementById("comboToggle");
    if (!product.permiteCombo) {
      comboBlock.classList.add("hidden");
    } else {
      comboBlock.classList.remove("hidden");
      document.getElementById("comboAddonNome").textContent = COMBO_ADDON.nome;
      document.getElementById("comboAddonPreco").textContent = "+ " + formatBRL(COMBO_ADDON.preco);
      comboToggleBtn.classList.remove("on");
    }

    updateProductTotal();
    openSheet(productSheet);
  }

  document.getElementById("comboToggle").addEventListener("click", (e) => {
    const isOn = e.currentTarget.classList.toggle("on");
    currentCombo = isOn;
    updateProductTotal();
  });

  document.getElementById("qtyMinus").addEventListener("click", () => {
    currentQty = Math.max(1, currentQty - 1);
    document.getElementById("qtyValue").textContent = currentQty;
    updateProductTotal();
  });
  document.getElementById("qtyPlus").addEventListener("click", () => {
    currentQty = currentQty + 1;
    document.getElementById("qtyValue").textContent = currentQty;
    updateProductTotal();
  });

  function calcAddonsTotal() {
    let total = 0;
    Object.keys(currentAddons).forEach((addonId) => {
      const qty = currentAddons[addonId];
      if (qty > 0) {
        const addon = findAddon(addonId);
        total += addon.preco * qty;
      }
    });
    return total;
  }

  function updateProductTotal() {
    if (!currentProduct) return;
    const comboExtra = currentCombo ? COMBO_ADDON.preco : 0;
    const unit = currentProduct.preco + calcAddonsTotal() + comboExtra;
    const total = unit * currentQty;
    document.getElementById("productTotal").textContent = formatBRL(total);
  }

  document.getElementById("addToCartBtn").addEventListener("click", () => {
    if (!currentProduct) return;

    const selectedAddons = Object.keys(currentAddons)
      .filter((id) => currentAddons[id] > 0)
      .map((id) => ({ id, qty: currentAddons[id], addon: findAddon(id) }));

    const removedList = Object.keys(currentRemoved).filter((k) => currentRemoved[k]);

    const obs = document.getElementById("productObs").value.trim();

    cart.push({
      cartId: Date.now() + Math.random().toString(36).slice(2, 7),
      productId: currentProduct.id,
      nome: currentProduct.nome,
      imagem: productImageSrc(currentProduct),
      precoBase: currentProduct.preco,
      qty: currentQty,
      addons: selectedAddons,
      removidos: removedList,
      combo: currentCombo,
      obs: obs,
    });

    updateCartUI();
    closeAllSheets();
    showToast(`${currentProduct.nome} adicionado ao pedido! 🚀`);
  });

  /* ---------------- CARRINHO: CÁLCULOS ---------------- */
  function itemUnitPrice(item) {
    const addonsTotal = item.addons.reduce((sum, a) => sum + a.addon.preco * a.qty, 0);
    const comboExtra = item.combo ? COMBO_ADDON.preco : 0;
    return item.precoBase + addonsTotal + comboExtra;
  }

  function itemTotalPrice(item) {
    return itemUnitPrice(item) * item.qty;
  }

  function cartTotal() {
    return cart.reduce((sum, item) => sum + itemTotalPrice(item), 0);
  }

  function cartItemCount() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }

  /* ---------------- CARRINHO: RENDER ---------------- */
  const cartBadge = document.getElementById("cartBadge");
  const stickyCartBar = document.getElementById("stickyCartBar");

  function updateCartUI() {
    const count = cartItemCount();
    const total = cartTotal();

    // badge no topo
    if (count > 0) {
      cartBadge.textContent = count;
      cartBadge.classList.remove("hidden");
    } else {
      cartBadge.classList.add("hidden");
    }

    // barra flutuante
    document.getElementById("stickyCount").textContent = count;
    document.getElementById("stickyTotal").textContent = formatBRL(total);
    if (count > 0) {
      stickyCartBar.classList.add("show");
    } else {
      stickyCartBar.classList.remove("show");
    }

    // conteúdo do painel do carrinho
    const cartItemsEl = document.getElementById("cartItems");
    const emptyState = document.getElementById("cartEmptyState");
    const cartSummary = document.getElementById("cartSummary");
    const footerBtn = document.getElementById("goToCheckoutBtn");
    const minOrderNote = document.getElementById("minOrderNote");

    cartItemsEl.innerHTML = "";

    const belowMinimum = cart.length > 0 && total < MINIMUM_ORDER;

    if (cart.length === 0) {
      emptyState.classList.remove("hidden");
      cartSummary.classList.add("hidden");
      minOrderNote.classList.add("hidden");
      footerBtn.disabled = true;
      footerBtn.style.opacity = "0.5";
    } else {
      emptyState.classList.add("hidden");
      cartSummary.classList.remove("hidden");

      cart.forEach((item) => {
        cartItemsEl.appendChild(renderCartItem(item));
      });

      document.getElementById("cartSubtotal").textContent = formatBRL(total);
      document.getElementById("cartTotal").textContent = formatBRL(total);

      if (belowMinimum) {
        const faltam = MINIMUM_ORDER - total;
        minOrderNote.textContent = `Pedido mínimo de ${formatBRL(MINIMUM_ORDER)} — faltam ${formatBRL(faltam)} para continuar`;
        minOrderNote.classList.remove("hidden");
        footerBtn.disabled = true;
        footerBtn.style.opacity = "0.5";
      } else {
        minOrderNote.classList.add("hidden");
        footerBtn.disabled = false;
        footerBtn.style.opacity = "1";
      }
    }
  }

  function renderCartItem(item) {
    const extrasParts = [];
    if (item.combo) {
      extrasParts.push(`+ Combo (${COMBO_ADDON.nome})`);
    }
    if (item.addons.length > 0) {
      item.addons.forEach((a) => extrasParts.push(`+${a.qty}x ${a.addon.nome}`));
    }
    if (item.removidos.length > 0) {
      extrasParts.push("Sem: " + item.removidos.join(", "));
    }
    if (item.obs) {
      extrasParts.push("Obs: " + item.obs);
    }

    const row = el(`
      <div class="cart-item" data-cart-id="${item.cartId}">
        <div class="thumb-sm"><img src="${item.imagem}" alt="${item.nome}"></div>
        <div class="details">
          <p class="name">${item.nome}</p>
          <p class="extras">${extrasParts.join(" · ") || ""}</p>
          <div class="row-bottom">
            <div class="qty-control sm">
              <button type="button" class="dec">−</button>
              <span class="qtyval">${item.qty}</span>
              <button type="button" class="inc">+</button>
            </div>
            <span class="price">${formatBRL(itemTotalPrice(item))}</span>
          </div>
          <button type="button" class="remove-btn">Remover item</button>
        </div>
      </div>
    `);

    row.querySelector(".inc").addEventListener("click", () => {
      item.qty += 1;
      updateCartUI();
    });
    row.querySelector(".dec").addEventListener("click", () => {
      item.qty = Math.max(1, item.qty - 1);
      updateCartUI();
    });
    row.querySelector(".remove-btn").addEventListener("click", () => {
      cart = cart.filter((c) => c.cartId !== item.cartId);
      updateCartUI();
    });

    return row;
  }

  /* ---------------- ABRIR PAINÉIS ---------------- */
  const cartSheet = document.getElementById("cartSheet");
  const checkoutSheet = document.getElementById("checkoutSheet");
  const confirmSheet = document.getElementById("confirmSheet");

  function openCart() {
    updateCartUI();
    openSheet(cartSheet);
  }

  document.getElementById("openCartBtn").addEventListener("click", openCart);
  document.getElementById("heroOrderBtn").addEventListener("click", () => {
    document.getElementById("featuredSection").scrollIntoView({ behavior: "smooth" });
  });
  stickyCartBar.addEventListener("click", openCart);

  document.getElementById("goToCheckoutBtn").addEventListener("click", () => {
    if (cart.length === 0) return;
    updateCheckoutSummary();
    openSheet(checkoutSheet);
  });

  document.getElementById("backToCheckoutBtn").addEventListener("click", () => {
    openSheet(checkoutSheet);
  });

  /* ---------------- CHECKOUT ---------------- */
  // forma de pagamento
  const paymentSelect = document.getElementById("paymentMethod");
  PAYMENT_METHODS.forEach((pm) => {
    const opt = document.createElement("option");
    opt.value = pm.id;
    opt.textContent = pm.nome;
    paymentSelect.appendChild(opt);
  });

  // tipo de pedido (retirada/entrega)
  const orderTypeGroup = document.getElementById("orderTypeGroup");
  const addressFields = document.getElementById("addressFields");

  function updateCheckoutSummary() {
    const subtotal = cartTotal();
    const deliveryFee = currentOrderType === "entrega" ? DELIVERY_FEE : 0;
    const total = subtotal + deliveryFee;

    document.getElementById("checkoutSubtotal").textContent = formatBRL(subtotal);
    document.getElementById("checkoutTotal").textContent = formatBRL(total);

    const deliveryRow = document.getElementById("checkoutDeliveryRow");
    if (deliveryFee > 0) {
      document.getElementById("checkoutDeliveryFee").textContent = formatBRL(deliveryFee);
      deliveryRow.classList.remove("hidden");
    } else {
      deliveryRow.classList.add("hidden");
    }
  }

  orderTypeGroup.querySelectorAll(".radio-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      orderTypeGroup.querySelectorAll(".radio-chip").forEach((c) => c.classList.remove("selected"));
      chip.classList.add("selected");
      currentOrderType = chip.dataset.value;
      addressFields.classList.toggle("show", currentOrderType === "entrega");
      updateCheckoutSummary();
    });
  });

  function getCheckoutData() {
    return {
      nome: document.getElementById("customerName").value.trim(),
      tipo: currentOrderType,
      rua: document.getElementById("addrRua").value.trim(),
      numero: document.getElementById("addrNumero").value.trim(),
      complemento: document.getElementById("addrComplemento").value.trim(),
      bairro: document.getElementById("addrBairro").value.trim(),
      referencia: document.getElementById("addrReferencia").value.trim(),
      pagamento: paymentSelect.value,
      pagamentoNome: paymentSelect.options[paymentSelect.selectedIndex]
        ? paymentSelect.options[paymentSelect.selectedIndex].textContent
        : "",
      obs: document.getElementById("orderObs").value.trim(),
    };
  }

  document.getElementById("reviewOrderBtn").addEventListener("click", () => {
    const data = getCheckoutData();

    if (cartTotal() < MINIMUM_ORDER) {
      showToast(`Pedido mínimo de ${formatBRL(MINIMUM_ORDER)}. Volte ao carrinho e adicione mais itens.`, "error");
      return;
    }
    if (!data.nome) {
      showToast("Por favor, digite seu nome. 🙂", "error");
      return;
    }
    if (data.tipo === "entrega") {
      if (!data.rua || !data.numero || !data.bairro) {
        showToast("Preencha rua, número e bairro para a entrega.", "error");
        return;
      }
    }

    renderConfirmation(data);
    openSheet(confirmSheet);
  });

  /* ---------------- CONFIRMAÇÃO ---------------- */
  function renderConfirmation(data) {
    const confirmItems = document.getElementById("confirmItems");
    confirmItems.innerHTML = "";
    cart.forEach((item) => {
      const row = renderCartItem(item);
      // remove controles de edição na tela de confirmação (somente leitura)
      const qtyControl = row.querySelector(".qty-control");
      if (qtyControl) qtyControl.querySelectorAll("button").forEach((b) => (b.style.visibility = "hidden"));
      const removeBtn = row.querySelector(".remove-btn");
      if (removeBtn) removeBtn.style.display = "none";
      confirmItems.appendChild(row);
    });

    const subtotal = cartTotal();
    const deliveryFee = data.tipo === "entrega" ? DELIVERY_FEE : 0;
    const total = subtotal + deliveryFee;

    document.getElementById("confirmSubtotal").textContent = formatBRL(subtotal);
    document.getElementById("confirmTotal").textContent = formatBRL(total);

    const deliveryRow = document.getElementById("confirmDeliveryRow");
    if (deliveryFee > 0) {
      document.getElementById("confirmDeliveryFee").textContent = formatBRL(deliveryFee);
      deliveryRow.classList.remove("hidden");
    } else {
      deliveryRow.classList.add("hidden");
    }
  }

  /* ---------------- MENSAGEM DO WHATSAPP ---------------- */
  function buildWhatsappMessage(data) {
    const linhas = [];
    linhas.push(`🍔 *NOVO PEDIDO — ${STORE_INFO.name.toUpperCase()}* 🪐`);
    linhas.push("");
    linhas.push(`*Cliente:* ${data.nome}`);
    linhas.push("");
    linhas.push("*Pedido:*");

    cart.forEach((item) => {
      linhas.push(`${item.qty}x ${item.nome} — ${formatBRL(itemUnitPrice(item))}`);
      if (item.combo) {
        linhas.push(`   + Combo: ${COMBO_ADDON.nome} — ${formatBRL(COMBO_ADDON.preco)}`);
      }
      item.addons.forEach((a) => {
        linhas.push(`   + ${a.qty}x ${a.addon.nome} — ${formatBRL(a.addon.preco)}`);
      });
      if (item.removidos.length > 0) {
        linhas.push(`   - Sem: ${item.removidos.join(", ")}`);
      }
      if (item.obs) {
        linhas.push(`   Obs: ${item.obs}`);
      }
    });

    linhas.push("");
    linhas.push(`*Tipo de pedido:* ${data.tipo === "entrega" ? "Entrega 🛵" : "Retirada 🏠"}`);

    if (data.tipo === "entrega") {
      linhas.push("");
      linhas.push("*Endereço de entrega:*");
      let endereco = `${data.rua}, ${data.numero}`;
      if (data.complemento) endereco += ` — ${data.complemento}`;
      linhas.push(endereco);
      linhas.push(data.bairro);
      if (data.referencia) linhas.push(`Referência: ${data.referencia}`);
    }

    linhas.push("");
    linhas.push(`*Pagamento:* ${data.pagamentoNome}`);

    if (data.obs) {
      linhas.push("");
      linhas.push("*Observação do pedido:*");
      linhas.push(data.obs);
    }

    const subtotal = cartTotal();
    const deliveryFee = data.tipo === "entrega" ? DELIVERY_FEE : 0;
    const total = subtotal + deliveryFee;

    linhas.push("");
    linhas.push(`Subtotal: ${formatBRL(subtotal)}`);
    if (deliveryFee > 0) {
      linhas.push(`Taxa de entrega: ${formatBRL(deliveryFee)}`);
    }
    linhas.push(`*TOTAL: ${formatBRL(total)}*`);

    return linhas.join("\n");
  }

  document.getElementById("sendWhatsappBtn").addEventListener("click", () => {
    if (cart.length === 0) {
      showToast("Seu carrinho está vazio.", "error");
      return;
    }
    if (cartTotal() < MINIMUM_ORDER) {
      showToast(`Pedido mínimo de ${formatBRL(MINIMUM_ORDER)}.`, "error");
      return;
    }
    const data = getCheckoutData();
    const mensagem = buildWhatsappMessage(data);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  });

  /* ---------------- INICIALIZAÇÃO ---------------- */
  renderStoreInfo();
  renderStatusBanner();
  renderCategoryNav();
  renderFeatured();
  renderCategories();
  updateCartUI();
})();

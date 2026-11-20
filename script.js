/* Interações da homepage: catálogo, carrinho, entrega, Pix, comprovante e fidelidade. */
(function () {
  "use strict";
  const config = window.ACAITERIA_CONFIG;
  const utils = window.ACAITERIA_ORDER_UTILS;
  if (!config || !utils) return;

  const $ = (selector) => document.querySelector(selector);
  const cart = Object.fromEntries(config.products.flatMap((card) => card.options).map((option) => [option.id, 0]));
  const allOptions = config.products.flatMap((card) => card.options);
  const dayNames = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
  let sessionPoints = 0;
  let currentProof = null;
  let proofPreviewUrl = "";

  function make(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function setText(selector, text) {
    const node = $(selector);
    if (node) node.textContent = text;
  }

  function getDeliveryFee() {
    const selected = $("#neighborhood").value;
    const entry = config.deliveryFees.find((item) => item.name === selected);
    return entry ? entry.feeCents : 0;
  }

  function isWednesday() {
    return new Date().getDay() === Number(config.wednesdayIndex);
  }

  function calculateTotals() {
    const rate = isWednesday() ? Number(config.wednesdayDiscountRate) : 0;
    return utils.calculateTotals(cart, allOptions, getDeliveryFee(), rate);
  }

  function renderProfile() {
    const photo = $("#profilePhoto");
    const wrap = photo.closest(".brand-photo-wrap");
    photo.src = config.profileImage;
    photo.alt = config.profileImageAlt;
    photo.addEventListener("error", () => wrap.classList.add("is-fallback"), { once: true });
    photo.addEventListener("load", () => wrap.classList.remove("is-fallback"), { once: true });
    setText("#businessName", config.businessName);
    setText("#footerPhone", config.whatsappDisplay);
    setText("#currentYear", String(new Date().getFullYear()));
    setText("#businessAddress", config.address);
    const contactUrl = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(`Olá! Quero falar com a ${config.businessName}.` )}`;
    $("#contactWhatsApp").href = contactUrl;
    $("#whatsappFloat").href = contactUrl;
    $("#whatsappFloat").setAttribute("aria-label", `Tirar dúvidas com ${config.businessName} pelo WhatsApp ${config.whatsappDisplay}`);
  }

  function optionRow(option) {
    const row = make("div", "product-variant");
    const copy = make("div", "variant-copy");
    copy.append(make("span", "variant-title", option.name));
    const priceWrap = make("span", "variant-price-wrap");
    priceWrap.append(make("strong", "variant-price", utils.formatMoney(option.priceCents)));
    if (option.samplePrice) priceWrap.append(make("small", "sample-price-note", "PREÇO DE EXEMPLO — editar"));
    copy.append(priceWrap);

    const control = make("div", "quantity-control");
    control.setAttribute("role", "group");
    control.setAttribute("aria-label", `Quantidade de ${option.name}`);
    const minus = make("button", "", "−");
    minus.type = "button";
    minus.dataset.product = option.id;
    minus.dataset.quantityChange = "-1";
    minus.setAttribute("aria-label", `Diminuir ${option.name}`);
    const output = make("output", "", "0");
    output.id = `quantity-${option.id}`;
    output.setAttribute("aria-live", "polite");
    const plus = make("button", "", "+");
    plus.type = "button";
    plus.dataset.product = option.id;
    plus.dataset.quantityChange = "1";
    plus.setAttribute("aria-label", `Adicionar ${option.name}`);
    control.append(minus, output, plus);
    row.append(copy, control);
    return row;
  }

  function renderProducts() {
    const grid = $("#productGrid");
    grid.replaceChildren();
    config.products.forEach((product, index) => {
      const card = make("article", "product-card");
      card.dataset.productCard = product.category;
      card.setAttribute("aria-label", product.title);
      const imageWrap = make("div", "product-image-wrap");
      const image = document.createElement("img");
      image.src = product.image;
      image.alt = product.imageAlt || `Foto ilustrativa de ${product.title}`;
      image.loading = index === 0 ? "eager" : "lazy";
      image.decoding = "async";
      image.addEventListener("error", () => {
        imageWrap.classList.add("image-fallback");
        image.alt = `Imagem de exemplo não encontrada: ${product.image}`;
      }, { once: true });
      imageWrap.append(image, make("span", "photo-tag", "Foto ilustrativa"));
      const availability = make("span", "availability-tag", "Sempre disponível");
      availability.dataset.availability = "";
      imageWrap.append(availability);

      const content = make("div", "product-content");
      const titleRow = make("div", "product-title-row");
      const titleGroup = make("div");
      titleGroup.append(make("p", "product-kicker", product.kicker), make("h3", "", product.title));
      titleRow.append(titleGroup, make("span", "product-number", String(index + 1).padStart(2, "0")));
      content.append(titleRow, make("p", "product-description", product.description));
      const variants = make("div", "product-variants");
      product.options.forEach((option) => variants.append(optionRow(option)));
      content.append(variants);
      card.append(imageWrap, content);
      grid.append(card);
    });
  }

  function renderDailyHighlight() {
    const day = new Date().getDay();
    const highlight = config.dailyHighlights[day];
    const dayLabel = dayNames[day];
    setText("#todayName", `HOJE, ${dayLabel.toLocaleUpperCase("pt-BR")}`);
    setText("#todayPill", dayLabel);
    setText("#todaySummary", `Destaque: ${highlight.label}`);
    setText("#menuSubtitle", isWednesday()
      ? `Hoje, ${dayLabel}, ${Math.round(config.wednesdayDiscountRate * 100)}% de desconto nos produtos. Todos os itens continuam disponíveis.`
      : `Hoje, ${dayLabel}, destaque para ${highlight.label}. Todos os itens continuam disponíveis.`);
    $("#discountRibbon").hidden = !isWednesday();
    document.querySelectorAll("[data-product-card]").forEach((card) => {
      const featured = card.dataset.productCard === highlight.category;
      card.classList.toggle("is-featured", featured);
      const badge = card.querySelector("[data-availability]");
      badge.textContent = featured ? "Destaque de hoje" : "Sempre disponível";
      card.setAttribute("aria-label", `${card.querySelector("h3").textContent}${featured ? ", destaque de hoje" : ", disponível hoje"}`);
    });
  }

  function renderNeighborhoods() {
    const select = $("#neighborhood");
    config.deliveryFees.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.name;
      option.textContent = `${item.name} — ${utils.formatMoney(item.feeCents)}`;
      select.append(option);
    });
  }

  function renderHours() {
    const container = $("#hoursCards");
    container.replaceChildren();
    config.hours.forEach((hours, index) => {
      const card = make("article", `hours-card${index === 1 ? " hours-card-accent" : ""}`);
      const top = make("div", "hours-card-top");
      top.append(make("span", "hours-icon", index === 0 ? "AM" : "PM"), make("span", "", `ROTA 0${index + 1}`));
      card.append(top, make("h3", "", hours.period), make("p", "hours-label", "Pedidos"), make("strong", "hours-time", hours.orders));
      const line = make("div", "route-line");
      line.append(make("span"));
      card.append(line, make("p", "route-text", hours.route));
      container.append(card);
    });
  }

  function renderPix() {
    const image = $("#pixQrImage");
    const placeholder = $("#pixQrPlaceholder");
    if (config.pix.qrCodeImage) {
      image.addEventListener("load", () => { image.hidden = false; placeholder.hidden = true; }, { once: true });
      image.addEventListener("error", () => { image.hidden = true; placeholder.hidden = false; }, { once: true });
      image.src = config.pix.qrCodeImage;
    } else {
      image.hidden = true;
      placeholder.hidden = false;
    }
    const isPlaceholderKey = !config.pix.key || /INSIRA|EDITAR|SUA_CHAVE/i.test(config.pix.key);
    if (!isPlaceholderKey) {
      setText("#pixKeyValue", config.pix.key);
      $("#copyPixKey").disabled = false;
    }
    $("#copyPixKey").addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(config.pix.key);
        setText("#proofStatus", "Chave Pix copiada. Depois de pagar, anexe o comprovante para compartilhar com o pedido.");
      } catch (_) {
        setText("#proofStatus", "Não foi possível copiar automaticamente. Selecione e copie a chave Pix manualmente.");
      }
    });
  }

  function renderLoyalty() {
    const goal = Math.max(1, Math.min(30, Number(config.loyalty.rewardAfterPoints) || 10));
    setText("#loyaltyGoal", String(goal));
    setText("#loyaltyCount", String(Math.min(sessionPoints, goal)));
    const stamps = $("#loyaltyStamps");
    stamps.replaceChildren();
    for (let index = 0; index < Math.min(goal, 12); index += 1) {
      const stamp = make("span", `loyalty-stamp${index < sessionPoints ? " is-earned" : ""}`, index < sessionPoints ? "✓" : "•");
      stamp.setAttribute("aria-hidden", "true");
      stamps.append(stamp);
    }
    setText("#loyaltyRewardText", goal > 12 ? `${goal} pontos para o brinde` : "pontos para o brinde");
    if (sessionPoints >= goal) setText("#loyaltyStatus", "Meta visual alcançada nesta sessão. Consulte a equipe sobre o brinde.");
    else setText("#loyaltyStatus", "Um ponto visual é acrescentado ao encaminhar um pedido nesta sessão.");
  }

  function selectedItemCount() {
    return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  }

  function updateQuantity(optionId, delta) {
    if (!(optionId in cart)) return;
    cart[optionId] = Math.max(0, Math.min(99, cart[optionId] + delta));
    const output = document.getElementById(`quantity-${optionId}`);
    if (output) output.textContent = String(cart[optionId]);
    renderCart();
  }

  function renderCart() {
    const selected = allOptions.filter((option) => cart[option.id] > 0);
    const count = selectedItemCount();
    const totals = calculateTotals();
    setText("#cartCount", String(count));
    setText("#itemsSubtotal", utils.formatMoney(totals.subtotalCents));
    setText("#discountAmount", `−${utils.formatMoney(totals.discountCents)}`);
    $("#discountRow").hidden = totals.discountCents <= 0;
    const chosen = $("#neighborhood").value;
    setText("#deliveryAmount", chosen ? utils.formatMoney(totals.deliveryFeeCents) : "Selecione o bairro");
    setText("#finalTotal", utils.formatMoney(totals.totalCents));
    setText("#stickyCartTotal", utils.formatMoney(totals.totalCents));
    setText("#stickyCartCount", String(count));
    $("#stickyCart").setAttribute("aria-label", `Ir para pedido. ${count} itens, total ${utils.formatMoney(totals.totalCents)}`);
    $("#stickyCart").classList.toggle("is-visible", count > 0);
    const list = $("#orderList");
    list.replaceChildren();
    if (!selected.length) list.append(make("li", "empty-cart", "Escolha os produtos acima para começar."));
    selected.forEach((item) => {
      const row = make("li", "order-item");
      const copy = make("span", "order-item-copy");
      copy.append(make("strong", "", `${cart[item.id]} × ${item.name}`), make("small", "", `${utils.formatMoney(item.priceCents)} cada`));
      row.append(copy, make("span", "order-quantity", utils.formatMoney(item.priceCents * cart[item.id])));
      list.append(row);
    });
    const formValid = $("#checkoutForm").checkValidity();
    $("#finishOrder").disabled = !count || !chosen || !formValid;
  }

  function updateProofPreview(file) {
    const preview = $("#proofPreview");
    const image = $("#proofImage");
    if (proofPreviewUrl) URL.revokeObjectURL(proofPreviewUrl);
    proofPreviewUrl = "";
    currentProof = file || null;
    if (!file) {
      preview.hidden = true;
      image.hidden = true;
      setText("#proofFileName", "");
      renderCart();
      return;
    }
    preview.hidden = false;
    setText("#proofFileName", file.name);
    if (file.type.startsWith("image/")) {
      proofPreviewUrl = URL.createObjectURL(file);
      image.src = proofPreviewUrl;
      image.hidden = false;
    } else {
      image.hidden = true;
    }
    setText("#proofStatus", "Comprovante selecionado. Em aparelhos compatíveis, ele será incluído no compartilhamento com o texto do pedido.");
    renderCart();
  }

  function validateProof(file) {
    if (!file) return true;
    if (!config.proof.acceptedMimeTypes.includes(file.type)) {
      setText("#proofStatus", "Tipo de arquivo não aceito. Escolha JPG, PNG, WEBP ou PDF.");
      return false;
    }
    if (file.size > config.proof.maxFileSizeBytes) {
      setText("#proofStatus", `Arquivo acima do limite de ${Math.round(config.proof.maxFileSizeBytes / 1024 / 1024)} MB. Escolha um arquivo menor.`);
      return false;
    }
    return true;
  }

  function getCustomer() {
    const phone = $("#customerPhone").value.trim();
    return {
      name: $("#customerName").value.trim(),
      phone,
      address: $("#customerAddress").value.trim(),
      complement: $("#customerComplement").value.trim(),
      neighborhood: $("#neighborhood").value,
      note: $("#customerNote").value.trim()
    };
  }

  function buildMessage() {
    return utils.buildOrderMessage({
      businessName: config.businessName,
      options: allOptions,
      cart,
      customer: getCustomer(),
      totals: calculateTotals(),
      hasProof: Boolean(currentProof)
    });
  }

  function setSendStatus(text, isError) {
    const status = $("#sendStatus");
    status.textContent = text;
    status.classList.toggle("is-error", Boolean(isError));
  }

  function awardSessionPoint() {
    sessionPoints += 1;
    renderLoyalty();
  }

  function clearCartAfterHandoff() {
    Object.keys(cart).forEach((key) => { cart[key] = 0; });
    allOptions.forEach((option) => { document.getElementById(`quantity-${option.id}`).textContent = "0"; });
    $("#checkoutForm").reset();
    updateProofPreview(null);
    renderCart();
  }

  async function shareWithFile(message) {
    if (currentProof && navigator.share && navigator.canShare && navigator.canShare({ files: [currentProof] })) {
      try {
        await navigator.share({ title: `Pedido — ${config.businessName}`, text: `${message}\n\nWhatsApp da açaiteria: ${config.whatsappDisplay}`, files: [currentProof] });
        awardSessionPoint();
        clearCartAfterHandoff();
        setSendStatus("Compartilhamento concluído. Escolha WhatsApp, confirme o contato da açaiteria e envie a mensagem com o comprovante. O ponto foi exibido nesta sessão.");
      } catch (error) {
        if (error && error.name === "AbortError") {
          setSendStatus("Compartilhamento cancelado. O pedido continua no carrinho e nenhum ponto foi acrescentado.");
          return;
        }
        openWhatsAppFallback(message, true);
      }
      return;
    }
    openWhatsAppFallback(message, Boolean(currentProof));
  }

  function openWhatsAppFallback(message, hasFile) {
    const fileNote = hasFile ? "\n\nIMPORTANTE: anexe manualmente o comprovante Pix selecionado antes de enviar." : "";
    const url = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message + fileNote)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    awardSessionPoint();
    clearCartAfterHandoff();
    setSendStatus(hasFile
      ? "A conversa do WhatsApp foi aberta com o resumo. O navegador não consegue anexar o arquivo ao wa.me: selecione o comprovante manualmente na conversa antes de enviar."
      : "A conversa do WhatsApp foi aberta com o pedido. O ponto foi exibido nesta sessão; confirme o envio no WhatsApp.");
  }

  async function submitOrder(event) {
    event.preventDefault();
    if (!selectedItemCount()) {
      setSendStatus("Adicione pelo menos um produto ao carrinho.", true);
      return;
    }
    if (!$("#checkoutForm").reportValidity()) return;
    if (!validateProof(currentProof)) return;
    const message = buildMessage();
    await shareWithFile(message);
  }

  function bindEvents() {
    $("#productGrid").addEventListener("click", (event) => {
      const button = event.target.closest("[data-quantity-change]");
      if (button) updateQuantity(button.dataset.product, Number(button.dataset.quantityChange));
    });
    $("#neighborhood").addEventListener("change", renderCart);
    $("#checkoutForm").addEventListener("input", renderCart);
    $("#checkoutForm").addEventListener("change", renderCart);
    $("#checkoutForm").addEventListener("submit", submitOrder);
    $("#paymentProof").addEventListener("change", (event) => {
      const file = event.target.files && event.target.files[0];
      if (!validateProof(file)) {
        event.target.value = "";
        updateProofPreview(null);
        return;
      }
      updateProofPreview(file);
    });
    $("#removeProof").addEventListener("click", () => {
      $("#paymentProof").value = "";
      updateProofPreview(null);
      setText("#proofStatus", "Comprovante removido. Se pagar via Pix, anexe o arquivo antes de enviar.");
    });
  }

  renderProfile();
  renderProducts();
  renderDailyHighlight();
  renderNeighborhoods();
  renderHours();
  renderPix();
  renderLoyalty();
  bindEvents();
  renderCart();
})();

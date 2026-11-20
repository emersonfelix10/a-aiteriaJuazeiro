/* Funções sem dependência de DOM: cálculo monetário e resumo do pedido. */
(function (root) {
  function formatMoney(cents) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency", currency: "BRL", minimumFractionDigits: 2
    }).format((Number(cents) || 0) / 100);
  }

  function calculateTotals(cart, options, deliveryFeeCents, discountRate) {
    const subtotalCents = options.reduce((sum, option) => {
      const quantity = Math.max(0, Number(cart[option.id]) || 0);
      return sum + option.priceCents * quantity;
    }, 0);
    const discountCents = Math.round(subtotalCents * (Number(discountRate) || 0));
    const safeDelivery = Math.max(0, Number(deliveryFeeCents) || 0);
    return {
      subtotalCents,
      discountCents,
      deliveryFeeCents: safeDelivery,
      totalCents: Math.max(0, subtotalCents - discountCents) + safeDelivery
    };
  }

  function buildOrderMessage(data) {
    const selected = data.options.filter((option) => (Number(data.cart[option.id]) || 0) > 0);
    const lines = selected.map((option) => {
      const quantity = Number(data.cart[option.id]);
      const lineTotal = option.priceCents * quantity;
      return `• ${quantity} × ${option.name} — ${formatMoney(option.priceCents)} cada = ${formatMoney(lineTotal)}`;
    });
    const pieces = [
      `Olá! Quero fazer um pedido na ${data.businessName}:`,
      "",
      ...lines,
      "",
      `Cliente: ${data.customer.name}`,
      `WhatsApp para contato: ${data.customer.phone}`,
      `Endereço: ${data.customer.address}${data.customer.complement ? `, ${data.customer.complement}` : ""}`,
      `Bairro: ${data.customer.neighborhood}`,
      "",
      `Subtotal dos produtos: ${formatMoney(data.totals.subtotalCents)}`
    ];
    if (data.totals.discountCents > 0) pieces.push(`Desconto de quarta-feira: −${formatMoney(data.totals.discountCents)}`);
    pieces.push(
      `Taxa de entrega: ${formatMoney(data.totals.deliveryFeeCents)}`,
      `TOTAL: ${formatMoney(data.totals.totalCents)}`,
      `Pagamento: Pix${data.hasProof ? " — comprovante selecionado para compartilhar junto com o pedido" : " — sem comprovante anexado"}`
    );
    if (data.customer.note) pieces.push(`Observação: ${data.customer.note}`);
    pieces.push("", "Por favor, confirme o pedido e o pagamento. Obrigado(a)!");
    return pieces.join("\n");
  }

  const api = { formatMoney, calculateTotals, buildOrderMessage };
  root.ACAITERIA_ORDER_UTILS = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);

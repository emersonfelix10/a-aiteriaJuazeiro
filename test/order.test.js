const test = require('node:test');
const assert = require('node:assert/strict');
const config = require('../config.js');
const { calculateTotals, buildOrderMessage } = require('../order-utils.js');

const options = config.products.flatMap((product) => product.options);

test('catálogo mantém preços informados e batida de exemplo editável', () => {
  const byId = Object.fromEntries(options.map((item) => [item.id, item.priceCents]));
  assert.equal(byId.garrafa, 1200);
  assert.equal(byId.ovomaltine, 1300);
  assert.equal(byId.copo, 1800);
  assert.equal(byId['barca-pequena'], 2000);
  assert.equal(byId['barca-media'], 2500);
  assert.equal(byId['barca-grande'], 4000);
  assert.equal(options.find((item) => item.id === 'batida-maracuja').samplePrice, true);
});

test('bairro aplica a taxa exata ao total e quarta desconta produtos, não entrega', () => {
  const cart = { garrafa: 1, copo: 1 };
  const subtotal = 3000;
  const normal = calculateTotals(cart, options, 700, 0);
  const wednesday = calculateTotals(cart, options, 700, config.wednesdayDiscountRate);
  assert.deepEqual(normal, { subtotalCents: subtotal, discountCents: 0, deliveryFeeCents: 700, totalCents: 3700 });
  assert.deepEqual(wednesday, { subtotalCents: subtotal, discountCents: 300, deliveryFeeCents: 700, totalCents: 3400 });
});

test('gera resumo com itens, entrega, desconto e total no idioma português', () => {
  const cart = { 'barca-grande': 1 };
  const totals = calculateTotals(cart, options, 800, 0.10);
  const message = buildOrderMessage({
    businessName: config.businessName,
    options,
    cart,
    customer: { name: 'Joana', phone: '(88) 99999-0000', address: 'Rua Um, 10', complement: '', neighborhood: 'Betolandia', note: '' },
    totals,
    hasProof: true
  });
  assert.match(message, /Barca grande/);
  assert.match(message, /Taxa de entrega: R\$\s?8,00/);
  assert.match(message, /Desconto de quarta-feira/);
  assert.match(message, /TOTAL: R\$\s?44,00/);
  assert.match(message, /comprovante selecionado/);
});

test('taxas de todos os bairros permanecem configuradas', () => {
  assert.deepEqual(config.deliveryFees.map(({ name, feeCents }) => [name, feeCents]), [
    ['Aeroporto',700], ['Betolandia',800], ['Carité',500], ['Centro',600], ['Conviver',700],
    ['Franciscano',600], ['Pedrinhas',700], ['Pio XII',500], ['Pirajá',700], ['Romeirão',700],
    ['Salesiano',700], ['Santa Tereza',700], ['São Miguel',700], ['Socorro',600]
  ]);
});

test('destaque está configurado para os sete dias e não remove nenhum produto', () => {
  assert.deepEqual(Object.keys(config.dailyHighlights).sort(), ['0','1','2','3','4','5','6']);
  assert.equal(config.dailyHighlights[config.wednesdayIndex].category, 'barca');
  assert.equal(config.wednesdayDiscountRate, 0.10);
  assert.equal(config.products.length, 4);
  assert.equal(config.whatsappNumber, '5588992182832');
});

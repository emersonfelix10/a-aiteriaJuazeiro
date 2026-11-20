# Requisitos — Açaiteria Juazeiro (implementados e verificados)

## Página e visual
- [x] Página única, com cabeçalho “Açaiteria Juazeiro” e botão “Monte seu pedido”.
- [x] Usar o estilo vibrante existente da Açaiteria Juazeiro, adaptado a celular.
- [x] Incluir espaços visíveis para foto de perfil/cabeçalho e fotos fictícias de açaí de garrafa, açaí no copo, barca e batida de maracujá; cada imagem deve ter nome e caminho simples de substituir.
- [x] Usar caminhos relativos e manter o projeto estático, organizado e sem dependências externas.

## Produtos e carrinho
- [x] Mostrar Açaí de garrafa — R$ 12,00; opção com Ovomaltine — R$ 13,00; Açaí no copo — R$ 18,00; Barca pequena — R$ 20,00; Barca média — R$ 25,00; Barca grande — R$ 40,00; Batida de Maracujá — preço demonstrativo editável, porque o preço real não foi fornecido.
- [x] Cada produto/opção possui botões + e −, quantidade independente e carrinho.
- [x] O destaque de cada dia é configurável e não impede escolher nenhum produto.
- [x] Na quarta-feira o site mostra claramente 10% de desconto e aplica o desconto automaticamente ao subtotal dos produtos.
- [x] O total é calculado automaticamente com subtotal, desconto de quarta-feira, taxa do bairro e total final.

## Entrega e pagamento
- [x] Listar bairros e taxas exatas: Aeroporto R$ 7,00; Betolandia R$ 8,00; Carité R$ 5,00; Centro R$ 6,00; Conviver R$ 7,00; Franciscano R$ 6,00; Pedrinhas R$ 7,00; Pio XII R$ 5,00; Pirajá R$ 7,00; Romeirão R$ 7,00; Salesiano R$ 7,00; Santa Tereza R$ 7,00; São Miguel R$ 7,00; Socorro R$ 6,00.
- [x] Exibir chave Pix configurável e local para imagem do QR Pix. Na falta de dados reais, identificar claramente a área como placeholder e não simular cobrança válida.
- [x] Permitir anexar comprovante de pagamento e incluir mensagem completa do pedido, incluindo itens, dados de entrega, taxas, desconto e total.
- [x] Enviar o pedido ao WhatsApp (88) 99218-2832; quando houver arquivo e o navegador suportar compartilhamento, encaminhar texto/arquivo pela folha de compartilhamento do dispositivo; no fallback, abrir o chat com resumo e explicar que o comprovante deve ser anexado manualmente.

## Fidelidade e personalização
- [x] Exibir cartão de pontos; cada pedido encaminhado acrescenta visualmente um ponto sem banco de dados. Configurar a quantidade de pontos necessária para brinde.
- [x] Deixar locais de edição visíveis e comentados para nome/WhatsApp, nomes/preços/imagens dos produtos, bairros/taxas, destaque diário, desconto de quarta, chave/QR Pix e meta de pontos.

## Verificação
- [x] Testes de cálculo e conteúdo: 5 aprovados.
- [x] Simulação no Chromium de seleção, taxa do bairro, total, habilitação do botão, WhatsApp e ponto temporário.
- [x] Inspeção da homepage em viewport móvel e validação de links internos e IDs.

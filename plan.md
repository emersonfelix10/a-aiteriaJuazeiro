# Plano — Açaiteria Juazeiro: cardápio e pedidos

## Abordagem e estrutura

Construir uma página única estática em HTML, CSS e JavaScript, compatível com hospedagem estática no Vercel ou GitHub Pages. Reaproveitar como referência os arquivos e fotos ilustrativas existentes do projeto da Açaiteria Juazeiro, sem modificar a versão anterior. Não há banco de dados. O arquivo `config.js` concentra todos os campos que o cliente pode editar; o `script.js` lê essa única configuração para renderizar catálogo, destaque, taxa, chave/QR Pix e contato.

- `index.html`: cabeçalho com foto de perfil substituível e botão “Monte seu pedido”; hero e catálogo; destaques da semana; carrinho/checkout com dados de entrega, Pix e fidelidade; contato e rodapé.
- `styles.css`: preserva a identidade vibrante existente — roxo intenso, verde vivo, fundo creme e cartões fortes — com layout móvel primeiro.
- `config.js`: nome e WhatsApp; nomes, preços, imagens e opções dos produtos; taxas de bairro; mapa de destaque por dia; desconto de quarta; chave Pix, caminho da imagem QR; meta de pontos; limites de comprovante.
- `script.js`: quantidades +/−, carrinho, total em centavos, desconto e taxa; renderização dinâmica de destaques sem bloquear itens; prévia/validação de comprovante; compartilhamento pelo Web Share quando suportar arquivo e fallback para wa.me; cartão fidelidade temporário em memória de sessão.
- `img/`: três fotos demonstrativas existentes e imagens ilustrativas geradas para o cabeçalho e a batida de maracujá. O QR real e a logo/foto do cliente permanecem como substituições explícitas.
- `LEIA-ME.txt` e `FONTES-DAS-IMAGENS.txt`: personalização, hospedagem, imagens e limites do fluxo de comprovante.

## Regras do cardápio e checkout

Todos os produtos ficam disponíveis em todos os dias. O destaque é apenas visual e usa um produto ou categoria configurável para cada dia. Na quarta-feira, todos os itens selecionados recebem 10% de desconto antes da soma da taxa de entrega. Os preços conhecidos são: garrafa R$ 12,00; garrafa com Ovomaltine R$ 13,00; copo R$ 18,00; barca pequena R$ 20,00; média R$ 25,00; grande R$ 40,00. Como o preço da batida de maracujá não foi informado, a configuração trará R$ 15,00 como valor demonstrativo claramente marcado para substituição.

As taxas configuradas são Aeroporto 7, Betolandia 8, Carité 5, Centro 6, Conviver 7, Franciscano 6, Pedrinhas 7, Pio XII 5, Pirajá 7, Romeirão 7, Salesiano 7, Santa Tereza 7, São Miguel 7 e Socorro 6 (reais). O resumo mostra produtos, desconto, entrega e total.

A chave Pix e o QR ficam em campos editáveis. Como não foram fornecidos dados Pix, o local do QR será um placeholder claramente não pagável — não será inventado um código de cobrança.

## Comprovante e WhatsApp

A página valida tipo/tamanho do arquivo e tenta compartilhar mensagem e arquivo pelo compartilhamento nativo do dispositivo (`navigator.share` com `files`). Essa ação abre a folha de compartilhamento do aparelho para a pessoa escolher o WhatsApp; por limitações do navegador, não seleciona automaticamente o destinatário. Em navegadores sem compartilhamento de arquivo, abre a conversa `wa.me` com o resumo e avisa para anexar o arquivo manualmente. Sem comprovante, abre a conversa diretamente com o resumo. Não há upload de arquivo nem credenciais/back-end WhatsApp.

O cartão de fidelidade registra pontos somente na memória da página/sessão, sem banco nem persistência. Um ponto é acrescentado quando a pessoa inicia a entrega do pedido ao WhatsApp. O navegador não confirma se a mensagem foi enviada nem se o pedido foi concluído; a interface informa essa limitação e permite ao atendente confirmar a conclusão na conversa.

## Direção visual

Reutilizar o visual já definido da Açaiteria Juazeiro: plataforma de pedidos vibrante com roxo de açaí como assinatura, verde vivo em ações e descontos, creme claro como base e marrom como apoio. Manter cartões marcados, fotos de produto evidentes, títulos curtos e preços visíveis. No celular, CTA fixo para o carrinho, controles grandes e formulários em uma coluna. Interações curtas e sem animações essenciais; respeitar `prefers-reduced-motion`.

## Pastas e responsabilidades

A raiz reúne `index.html`, `styles.css`, `config.js`, `script.js`, `LEIA-ME.txt`, `FONTES-DAS-IMAGENS.txt` e `TODO.md`; a pasta `img/` contém os assets visuais substituíveis. Todos os caminhos são relativos para deploy estático. O ZIP tem uma pasta de raiz com o mesmo nome do projeto.
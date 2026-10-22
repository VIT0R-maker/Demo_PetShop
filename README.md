# Casa Pet

Landing page responsiva de demonstração para banho, tosa e cuidados de cães e gatos. Implementação em React, TypeScript e Vite, baseada nas quatro referências fotográficas fornecidas.

## Executar

Requer Node.js 22.12+ (verificado com Node.js 24).

```sh
npm ci
npm run dev
```

O Vite informa o endereço local. Para gerar e conferir a versão de produção:

```sh
npm run build
npm run preview
```

O build está em `dist/`. O projeto usa caminhos relativos (`base: './'`) e pode ser servido tanto na raiz quanto em um subdiretório, como `/Demo_PetShop/`. O repositório não ativa hospedagem ou publicação automática.

## Conteúdo e atendimento

Edite `src/config/business.ts`. O nome provisório é **Casa Pet**. Os dados ausentes ficam como `null`; a página nunca gera um telefone, endereço ou mapa aleatório.

Para ativar o atendimento real, faltam:

- Nome definitivo e descrição da empresa, se diferentes da marca provisória.
- Número real de WhatsApp, com código do país e DDD, somente dígitos (o prefixo `+` também é aceito).
- Endereço completo e link correto para a rota.
- Horários de atendimento.
- URL HTTPS de incorporação do mapa correspondente ao endereço, se desejada.
- URL HTTPS do Instagram, se houver.
- Confirmação dos serviços; preços e duração são opcionais e permanecem ausentes.

Os CTAs levam ao contato. Os cards selecionam o interesse no formulário, incluindo uma consulta de produtos sem checkout. A submissão valida tutor, espécie e interesse. Quando o WhatsApp estiver configurado, a ação abre `wa.me` com uma mensagem codificada; o visitante continua a conversa por lá. A equipe confirma disponibilidade e agendamento. O site não envia mensagens, não confirma reservas e não armazena os dados do formulário.

Sem WhatsApp, o formulário mantém a validação e informa que o canal será disponibilizado. O mapa e a rota só aparecem com dados válidos. Não há backend, autenticação, banco de dados ou integrações de rastreamento.

O título e a descrição SEO ficam em `index.html`. Não há domínio canônico ou dados estruturados de uma empresa fictícia. Atualize também esses metadados ao definir a marca final.

## Estrutura

- `src/App.tsx`: seções, navegação, menu, lightbox e barra de agendamento mobile.
- `src/components/ContactForm.tsx`: formulário e mensagens acessíveis.
- `src/config/business.ts`: dados comerciais, serviços e conteúdo editável.
- `src/lib/contact.ts`: validação do número e construção do link do WhatsApp.
- `src/styles.css`: tokens, layouts, estados e movimento reduzido.
- `public/images/`: 13 fotografias WebP locais, incluindo o hero mobile.
- `scripts/prepare-assets.py`: reprodução dos recortes com Pillow.
- `docs/assets.md`: origem, dimensões e limites dos recortes.
- `docs/verification.md`: verificações efetivamente executadas.

As quatro imagens originais permanecem intactas no local fornecido. O repositório contém somente os recortes necessários; as pessoas das fotografias não são apresentadas como clientes reais. As fontes Manrope e Inter são servidas localmente pelo pacote `@fontsource`, sem chamadas a serviços de fontes.

## Testes

```sh
npm test
npm run test:e2e
```

Os testes unitários verificam o número e o texto do WhatsApp, caracteres especiais e campos opcionais. Os testes de navegador verificam cinco larguras (1440, 1024, 768, 390 e 360 px), imagens, navegação, formulário, teclado, menu, lightbox, barra mobile e movimento reduzido. As capturas são geradas em `artifacts/screenshots/`, ignorado pelo Git.

O Playwright usa o Chrome instalado no caminho padrão do Windows quando disponível. Em outro ambiente, instale o Chromium para os testes:

```sh
npx playwright install chromium
```

Se um ambiente Windows restrito bloquear o diretório temporário padrão, use um diretório temporário dentro do projeto antes dos testes (PowerShell):

```powershell
New-Item -ItemType Directory -Force node_modules/.cache/tests | Out-Null
$env:TEMP = Join-Path (Get-Location) 'node_modules/.cache/tests'
$env:TMP = $env:TEMP
npm test
npm run test:e2e
```

## Interação e acessibilidade

Menu e galeria usam o elemento nativo `dialog`, fechamento por Escape e restauração de foco. Há rótulos visíveis, erros junto aos campos, link para pular ao conteúdo e foco visível. As imagens são elementos independentes, sem controles falsos do mockup. O hero carrega prioritariamente; as fotos seguintes usam lazy loading. As transições respeitam `prefers-reduced-motion` e as animações não bloqueiam o conteúdo.

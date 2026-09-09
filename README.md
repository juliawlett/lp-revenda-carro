# TP Veiculos Landing

Landing page estatica em Astro para apresentacao comercial da TP Veiculos.

## Comandos

Requer Node.js 20.19 ou superior.

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Estrutura

- `src/pages/index.astro`: pagina principal.
- `src/layouts/BaseLayout.astro`: metadados, fonte, CSS global e script do site.
- `src/styles/global.css`: identidade visual, responsividade e animacoes.
- `public/assets`: imagens, favicon e icones estaticos.
- `public/script.js`: interacoes de menu, scroll, formulario e animacoes.

## Deploy

O projeto gera saida estatica com `npm run build`, adequada para Cloudflare Pages, Vercel, Netlify ou hospedagem estatica.

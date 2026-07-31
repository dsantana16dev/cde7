# landpage — Crônicas da Eternidade

Site oficial bilíngue (PT/EN) da série em HQ **Crônicas da Eternidade**,
de Daniel Santana (DMG Santana). A série recria a história bíblica como
saga contínua, do Trono ao Apocalipse.

**Estado atual:**
- Volume 1 — *Gênesis: A Aurora e o Abismo* (Rebelião e Criação) · disponível em EPUB (PT + EN)
- Volume 2 — *Gênesis: A Queda, a Promessa, Adoração e Morte* · **disponível em PT e EN**
- Volume 3 — *Gênesis: Ausência, Convite e Confusão* · **disponível em PT e EN**
- Volume 4 — *Gênesis: O Chamado da Promessa* · revisão final (previsão set/2026, pré-lista aberta)
- Próximos volumes — em desenvolvimento (Êxodo, Reinos, Profetas, Evangelhos, Apocalipse)

## Estrutura de arquivos

```
landpage/
├── index.html        # Página única (PT/EN via toggle)
├── styles.css        # Visual dark + dourado, responsivo
├── script.js         # i18n, lightbox, checkout e pré-lista
├── assets/           # Capas, prévias e capas dos volumes
└── downloads/        # (opcional) hospedar os .epub se vender pelo próprio site
```

## Seções da página

1. **Hero** — apresenta a série; o fundo alterna as capas disponíveis (Vol.1 + Vol.2 + Vol.3)
2. **Quick facts** — universo bíblico, formato, idiomas, autor
3. **A série** — visão de longo prazo da saga
4. **Pilares** — fidelidade bíblica, arte cinematográfica, dossiês, bilíngue
5. **Volumes** — roadmap: Vols. 1–3 (disponíveis), Vol.4 (revisão final), próximos volumes
6. **Prévia · Volume 1** — galeria com lightbox de 6 páginas
7. **Público** — para quem é a série
8. **Ofertas · Volumes 1, 2 e 3** — uma seção por volume; o botão decide loja/preço por idioma + região
9. **Trust** — pagamento seguro, entrega instantânea, garantia 7 dias
10. **Pré-lista** — captura de e-mail para anúncios dos próximos volumes
11. **FAQ** — 7 perguntas frequentes
12. **CTA final** — Comprar no Kindle
13. **Rodapé** — contato e voltar ao topo

## Como rodar localmente

Abra `index.html` direto no navegador, ou (recomendado) suba um servidor estático:

```powershell
cd C:\Users\dsant\Downloads\Book\landpage
python -m http.server 8080
# abrir http://localhost:8080
```

## Configurar Kindle (links por volume)

A venda é feita directamente na Amazon Kindle. `script.js` → objecto `BOOKS`,
uma entrada por volume, cada uma com a loja `br` (edição PT) e `us` (edição EN):

```js
const BOOKS = {
  v1: { br: ".../dp/B0GX34LWFP", us: ".../dp/B0GXSXHMML" },
  v2: { br: ".../dp/B0H2SGQT65", us: ".../dp/B0H3175BN6" },
  v3: { br: ".../dp/B0HBZDP1PF", us: ".../dp/B0HC4SWJDS" },
};
```

No HTML, cada botão escolhe o volume com `data-book`:

```html
<a class="button button-primary checkout-link" data-book="v3">Comprar Volume 3</a>
```

Botões sem `data-book` caem no Vol.1 por retrocompatibilidade; CTAs de lançamento devem apontar explicitamente para o volume desejado.

A decisão de qual link/preço mostrar é automática via `regionForLang()`:

- **EN UI** → sempre Amazon US (US$)
- **PT UI**, locale `pt-PT` (Portugal) → Amazon US (US$)
- **PT UI**, locale `pt-BR`/`pt-AO`/`pt-MZ`/etc. (Brasil + África lusófona) → Amazon Brasil (R$)

Os botões "Comprar" abrem o Kindle em nova aba. Não há gateway próprio
nem hospedagem de EPUB no site.

## Configurar a pré-lista (Volume 4 e futuros)

`script.js` → constante `PRELIST_ENDPOINT`:

```js
const PRELIST_ENDPOINT = "https://formspree.io/f/SEU_ID";
```

Compatível com qualquer endpoint que aceite `POST { email }`:
- **Formspree** — `https://formspree.io/f/SEU_ID`
- **Buttondown** — `https://api.buttondown.email/v1/subscribers` (com token)
- **Sender / ConvertKit / Mailchimp** — endpoint de form embed
- **Webhook próprio**

Enquanto vazio, os e-mails são salvos no `localStorage` apenas como demonstração.

## Editar preços

Manter sincronizado com o preço actual na Amazon Kindle. Indexado por
**região** (não por idioma) — Portugal usa o preço `us`.

```js
const PRICES = {
  br: { currency: "R$",  single: "14,99" },
  us: { currency: "US$", single: "9.90"  },
};
```

## Editar textos da série

Tudo vive no objeto `I18N` em `script.js`. Cada chave existe nas seções `pt`
e `en` lado a lado. Para adicionar um novo volume ao roadmap (ex.: `v7`):

1. Duplicar o `<article class="volume volume-future">` em `index.html`,
   trocando o `data-i18n` para `volumes.v7_*`.
2. Adicionar as chaves `volumes.v7_num`, `v7_title`, `v7_arc`, `v7_desc`,
   `v7_cta` nas duas línguas do `I18N`.
3. Quando o volume entrar em produção, trocar `volume-future` por
   `volume-soon` (e o `data-i18n="volumes.status_*"` correspondente).
4. Quando ficar disponível: trocar para `volume-live`, usar o badge
   `status-live`, adicionar `checkout-link` + `data-book="v7"` ao botão,
   registar o par de ASINs em `BOOKS` e criar a seção de oferta
   (`<section class="offer" id="comprar-vol7">`, chaves `offer7.*`).

## Trocar capas e prévias

Substitua em `assets/` mantendo os nomes:

- `vol1-capa-pt.png`, `vol1-capa-en.png` — capa do card de Vol.1 (swap por idioma; 2:3)
- `vol2-capa.png`, `vol2-capa-en.png` — capa do card de Vol.2 (swap por idioma; 2:3)
- `vol3-capa.png`, `vol3-capa-en.png` — capa do card de Vol.3 (swap por idioma; 2:3)
- `vol7-capa.png`, `vol7-capa-en.png` — primeira capa do arco Êxodo (PT/EN; 2:3)
- `vol8-capa.png`, `vol8-capa-en.png` — segunda capa do arco Êxodo (PT/EN; 2:3)
- `cover-pt.png`, `cover-en.png` — capa do Volume 1 (offer + slideshow do hero)
- O slideshow do hero começa pelo Vol.3 e alterna automaticamente entre Vol.3, Vol.1 e Vol.2 do
  idioma activo (crossfade a cada ~5 s). O conjunto de capas vive em
  `HERO_COVERS` no `script.js`
- `page-002-pt.png` … `page-020-en.png` — prévia do Vol.1 PT e EN (swap automático no toggle)
- `vol2-page-004-pt.png` … `vol2-page-042-en.png` — prévia do Vol.2 (6 páginas, PT e EN)
- `vol3-page-002-pt.webp` … `vol3-page-041-en.webp` — prévia do Vol.3 (páginas 2, 11, 21, 26, 30 e 41; PT e EN)
- `page-02.jpg` … `page-30.jpg` — miniaturas da prévia (2:3)

## Hospedar os EPUBs

Toda a distribuição é feita pela **Amazon Kindle Direct Publishing (KDP)**.
A pasta `downloads/` pode conter samples ou versões de imprensa, mas a
entrega final do livro é responsabilidade da Amazon após a compra.

## Deploy rápido

- **Netlify Drop** — arraste a pasta `landpage` em https://app.netlify.com/drop
- **Vercel** — `npx vercel` dentro de `landpage`
- **GitHub Pages** — commit em uma branch e ative Pages
- **Cloudflare Pages** — conecte o repositório

100% estático (HTML/CSS/JS). Sem build, sem dependências.

## Checklist antes de publicar

- [ ] Conferir `BOOKS.v1`, `BOOKS.v2` e `BOOKS.v3` em `script.js` (ASINs correctos)
- [ ] Conferir `PRICES.br` (R$) e `.us` (US$) batem com a Amazon
- [ ] Preencher `PRELIST_ENDPOINT` em `script.js` (Formspree, Buttondown, etc.)
- [ ] Conferir/atualizar capas dos volumes em `assets/`
- [ ] Trocar e-mail de contato no `<footer>` do `index.html` se necessário
- [ ] Conferir prévia em mobile (DevTools responsive)
- [ ] Conferir `og:image` no `index.html` para a capa do lançamento atual

---

*Autor: Daniel Santana (DMG Santana). Crônicas da Eternidade — Edição 1/2026.*

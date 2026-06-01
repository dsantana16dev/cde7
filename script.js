/* ==========================================================================
   Crônicas da Eternidade — Landing Page da série
   Bilingual (PT/EN) · Lightbox · Checkout wiring · Pré-lista
   ========================================================================== */

/* ---------- CONFIG ---------- */
/* Links Amazon Kindle por volume e por região.
   br: Amazon Brasil (R$) — leitores lusófonos do Brasil + África lusófona.
   us: Amazon US (US$)    — leitores anglófonos + Portugal (lusófonos europeus).
   Para apontar um botão para um volume específico, usar
   <a class="checkout-link" data-book="v2">…</a> no HTML. */
const BOOKS = {
  v1: {
    br: "https://www.amazon.com.br/dp/B0GX34LWFP",
    us: "https://www.amazon.com/dp/B0GXSXHMML",
  },
  v2: {
    br: "https://www.amazon.com.br/dp/B0H2SGQT65",
    us: "https://www.amazon.com/dp/B0H3175BN6",
  },
};
// Alias retro-compatível — botões antigos sem data-book apontam para Vol. 1.
const KINDLE_URLS = BOOKS.v1;

/* Endpoint da pré-lista. Aceita Formspree, Buttondown, Mailchimp, Sender,
   ConvertKit ou qualquer endpoint que aceite POST com { email }.

   SETUP RECOMENDADO (Formspree — 2 minutos, free 50 submissões/mês):
   1. Criar conta em https://formspree.io
   2. New form → Form name "Crônicas da Eternidade · pré-lista"
      Email destinatário: cronicasdaeternidade7@gmail.com
   3. Copiar o endpoint (formato https://formspree.io/f/XXXXXXX)
   4. Colar abaixo, fazer commit e re-deploy

   Enquanto este campo estiver vazio, os emails ficam apenas no localStorage
   do leitor (não recebes nada). */
const PRELIST_ENDPOINT = "";  // TODO: colar endpoint Formspree

/* Preços por região (manter sincronizado com o preço actual na Amazon).
   Última revisão: 2026-06-01 (Vol. 1). Re-verificar antes de cada campanha
   ou alteração de preço no KDP. */
const PRICES = {
  br: { currency: "R$",  single: "14,99" },
  us: { currency: "US$", single: "9.90"  },
};

/* Decide a região (loja Amazon + moeda) a partir do idioma da UI + locale do
   browser. EN sempre → US. PT → BR por defeito, excepto Portugal (pt-PT) → US. */
function regionForLang(uiLang) {
  if (uiLang === "en") return "us";
  const nav = (navigator.language || "pt").toLowerCase();
  if (nav.startsWith("pt-pt")) return "us";
  return "br";
}

/* ---------- DICIONÁRIO ---------- */
const I18N = {
  pt: {
    "meta.title": "Crônicas da Eternidade | A saga em HQ de Daniel Santana",
    "meta.description": "Crônicas da Eternidade: a saga em HQ que recria a história bíblica do Trono ao Apocalipse. Volumes 1 e 2 disponíveis no Kindle, em português e em inglês.",

    "nav.brand": "Crônicas da Eternidade",
    "nav.series": "A série",
    "nav.volumes": "Volumes",
    "nav.preview": "Prévia",
    "nav.faq": "FAQ",
    "nav.buy": "Comprar",

    "hero.kicker": "A saga em HQ · Daniel Santana",
    "hero.title": "Crônicas da Eternidade",
    "hero.sub": "Do Trono ao Apocalipse — a história bíblica em quadrinhos.",
    "hero.copy": "Uma série épica em HQ que recria a grande controvérsia entre Cristo e Satanás — da rebelião no Céu até a restauração final. Cada volume, um arco bíblico. Cada arco, uma janela de luz e abismo.",
    "hero.cta_buy": "Comprar Volume 1",
    "hero.cta_explore": "Ver volumes",
    "hero.badge_status": "Vols. 1 e 2 disponíveis",

    "facts.universe_value": "Universo bíblico",
    "facts.universe_label": "Da criação ao juízo final",
    "facts.format_value": "EPUB digital",
    "facts.format_label": "Kindle · Apple Books · Kobo · Google Play",
    "facts.lang_value": "PT-BR · EN",
    "facts.lang_label": "Edições simultâneas em duas línguas",
    "facts.author_value": "Daniel Santana",
    "facts.author_label": "Autor e roteirista (DMG Santana)",

    "series.eyebrow": "A série",
    "series.title": "A maior história já contada — agora em HQ.",
    "series.body1": "Crônicas da Eternidade é uma série em quadrinhos que adapta a história bíblica como uma saga única e contínua: a grande controvérsia entre Cristo e Satanás, desenhada com reverência, ritmo cinematográfico e fundamento teológico.",
    "series.body2": "Cada volume cobre um arco — começando por Gênesis, atravessando os patriarcas, o êxodo, os reinos, os profetas, os evangelhos e o Apocalipse. Uma jornada de luz e abismo, planejada para crescer edição por edição.",
    "series.quote": "“Antes do tempo ter peso. Antes da matéria ter sombra. Havia o Céu — e nele, perfeição.”",
    "series.cite": "— Volume 1, Prólogo",

    "pillars.eyebrow": "Os pilares da série",
    "pillars.title": "Imaginação sem perder fundamento.",
    "pillars.f1_title": "Fidelidade bíblica",
    "pillars.f1_body": "Toda narrativa nasce da Bíblia e dos escritos de Ellen G. White, com âncoras teológicas listadas em cada volume.",
    "pillars.f2_title": "Arte cinematográfica",
    "pillars.f2_body": "Composições verticais 2:3, paleta dourada para o sagrado e sombras profundas para o conflito.",
    "pillars.f3_title": "Dossiês apologéticos",
    "pillars.f3_body": "Cada edição traz páginas extras com dossiês de personagens e suporte apologético em linguagem de HQ.",
    "pillars.f4_title": "Bilíngue desde o início",
    "pillars.f4_body": "Todos os volumes são publicados em português e inglês — recurso pronto para missões e evangelismo digital.",

    "volumes.eyebrow": "A saga em volumes",
    "volumes.title": "Os arcos de Crônicas da Eternidade.",
    "volumes.status_live": "Disponível",
    "volumes.status_soon": "Em produção",
    "volumes.status_future": "Em desenvolvimento",
    "volumes.pages": "páginas",
    "volumes.eta": "Previsão: 2026",

    "volumes.v1_num": "Volume 1",
    "volumes.v1_title": "Gênesis: A Aurora e o Abismo",
    "volumes.v1_arc": "Arco I — Criação e rebelião",
    "volumes.v1_desc": "O conflito no Céu, a criação do mundo, Adão e Eva e a advertência que prepara o próximo abismo.",
    "volumes.v1_cta": "Comprar Volume 1",

    "volumes.v2_num": "Volume 2",
    "volumes.v2_title": "Gênesis: A Queda, a Promessa, Adoração e Morte",
    "volumes.v2_arc": "Arco I — Queda e primeira promessa",
    "volumes.v2_desc": "A entrada do inimigo no Éden, a queda de Adão e Eva e a primeira promessa messiânica em Gênesis 3:15.",
    "volumes.v2_status": "Disponível",
    "volumes.v2_cta_buy": "Comprar Volume 2",
    "volumes.v2_cta": "Entrar na pré-lista",

    "volumes.v3_num": "Volume 3",
    "volumes.v3_title": "Gênesis: Ausência, Convite e Confusão",
    "volumes.v3_arc": "Arco I — Altares, dilúvio e Babel",
    "volumes.v3_desc": "O testemunho de Enoque, a arca de Noé e a Torre de Babel — a humanidade entre o convite divino e a confusão.",
    "volumes.v3_cta": "Entrar na pré-lista",

    "volumes.vN_num": "Próximos volumes",
    "volumes.vN_title": "A saga continua",
    "volumes.vN_arc": "Patriarcas · Êxodo · Reinos · Profetas · Evangelhos · Apocalipse",
    "volumes.vN_desc": "A série segue arco por arco até o último livro da Bíblia. Inscreva-se para acompanhar os anúncios e pré-vendas.",
    "volumes.vN_meta1": "Arcos planejados",
    "volumes.vN_meta2": "Lançamentos contínuos",
    "volumes.vN_cta": "Quero ser avisado",

    "preview.eyebrow": "Prévia · Volume 1",
    "preview.title": "Veja algumas páginas da edição já disponível.",
    "preview.p1": "Prólogo",
    "preview.p2": "Guerra no Céu",
    "preview.p3": "Haja luz",
    "preview.p4": "Vida criada",
    "preview.p5": "Éden",
    "preview.p6": "Sábado",

    "preview.v2_eyebrow": "Prévia · Volume 2",
    "preview.v2_title": "Páginas do Volume 2, agora disponível em português.",
    "preview.v2_p1": "Éden",
    "preview.v2_p2": "A serpente",
    "preview.v2_p3": "A queda",
    "preview.v2_p4": "A promessa",
    "preview.v2_p5": "Adoração",
    "preview.v2_p6": "Morte",

    "audience.eyebrow": "Para quem é a série",
    "audience.title": "Para quem quer imaginação sem perder fundamento.",
    "audience.a1_title": "Jovens e adultos",
    "audience.a1_body": "Porta de entrada visual para temas bíblicos profundos.",
    "audience.a2_title": "Famílias e estudos",
    "audience.a2_body": "Material para conversar sobre criação, liberdade, queda e redenção.",
    "audience.a3_title": "Leitores de HQ",
    "audience.a3_body": "Arte dramática, quadros densos e uma saga planejada para crescer.",
    "audience.a4_title": "Igrejas e missões",
    "audience.a4_body": "Recurso bilíngue PT/EN para evangelismo digital e estudos com jovens.",

    "offer.eyebrow": "Comece a saga · Volume 1",
    "offer.title": "Gênesis: A Aurora e o Abismo.",
    "offer.body": "O primeiro volume da série já está disponível no Kindle. Compra directa na Amazon — leitura imediata em qualquer dispositivo Kindle ou app oficial.",
    "offer.cover_caption": "Volume 1 · edição em português",
    "offer.currency": "R$",
    "offer.plan1_tag": "Disponível no Kindle",
    "offer.plan1_title": "Edição em português",
    "offer.plan1_l1": "EPUB do Volume 1 — 30 páginas",
    "offer.plan1_l2": "Compra e leitura na Amazon Kindle",
    "offer.plan1_l3": "Compatível com Kindle, app Kindle (iOS/Android) e leitura web",
    "offer.plan1_cta": "Comprar no Kindle",
    "offer.note": "Configure os links de checkout em",
    "offer.note_2": "antes de publicar.",

    "offer2.eyebrow": "Continue a saga · Volume 2",
    "offer2.title": "Gênesis: A Queda, a Promessa, Adoração e Morte.",
    "offer2.body": "O Volume 2 continua o Arco I — a entrada do inimigo no Éden, a queda de Adão e Eva, e a primeira promessa messiânica em Gênesis 3:15. Também disponível no Kindle.",
    "offer2.cover_caption": "Volume 2 · Capas PT e EN",
    "offer2.plan_tag": "Disponível no Kindle",
    "offer2.plan_title": "37 páginas · PT e EN",
    "offer2.plan_l1": "Continuação directa do Volume 1",
    "offer2.plan_l2": "Compra e leitura na Amazon Kindle",
    "offer2.plan_l3": "Compatível com Kindle, app Kindle (iOS/Android) e leitura web",
    "offer2.plan_cta": "Comprar Volume 2",

    "trust.t1": "Compra directa via Amazon Kindle — pagamento seguro Amazon",
    "trust.t2": "Leitura imediata em qualquer Kindle, app Kindle ou web reader",
    "trust.t3": "Garantia de 7 dias — política de devolução padrão da Amazon",

    "prelist.eyebrow": "Lista de pré-venda",
    "prelist.title": "Acompanhe os próximos volumes da saga.",
    "prelist.body": "Entre na lista e seja avisado dos próximos lançamentos da saga — o Volume 3 e seguintes. Leitores dos volumes anteriores entram com desconto automático.",
    "prelist.label": "Seu e-mail",
    "prelist.placeholder": "seu@email.com",
    "prelist.cta": "Quero ser avisado",
    "prelist.note": "Sem spam. Apenas anúncios da série Crônicas da Eternidade.",
    "prelist.success": "Pronto! Você foi adicionado à lista. Em breve avisaremos sobre o Volume 2.",
    "prelist.local": "Anotado neste navegador. Configure PRELIST_ENDPOINT em script.js para receber os e-mails.",
    "prelist.error": "Não foi possível enviar agora. Tente novamente em instantes.",

    "faq.eyebrow": "Dúvidas rápidas",
    "faq.title": "Informações essenciais sobre a série.",
    "faq.q1": "O que é Crônicas da Eternidade?",
    "faq.a1": "Uma série em HQ que recria a história bíblica como saga contínua, do Trono ao Apocalipse, com fundamento em Gênesis–Apocalipse e nos escritos de Ellen G. White.",
    "faq.q2": "Quantos volumes a série terá?",
    "faq.a2": "A série é planejada arco por arco. O Volume 1 (Aurora e o Abismo) e o Volume 2 (Queda, Promessa, Adoração e Morte) iniciam o Arco I — Gênesis. Os próximos arcos cobrirão patriarcas, êxodo, reinos, profetas, evangelhos e Apocalipse.",
    "faq.q3": "Em que formato recebo o livro?",
    "faq.a3": "Os volumes são publicados directamente no Kindle (Amazon). Após a compra, o livro fica na sua biblioteca Amazon e é lido no Kindle (dispositivo ou app) sem download manual.",
    "faq.q4": "Posso ler em outros dispositivos além do Kindle?",
    "faq.a4": "Sim. Lê na app Kindle (iOS/Android), no Kindle Cloud Reader (web), no Kindle para PC/Mac e em qualquer Kindle físico. A posição de leitura sincroniza entre eles via sua conta Amazon.",
    "faq.q5": "A versão em inglês é tradução automática?",
    "faq.a5": "Não. A edição em inglês é roteirizada com linguagem direta para o público jovem (13–18), preservando a fidelidade teológica.",
    "faq.q6": "Quando sai o Volume 2?",
    "faq.a6": "O Volume 2 — “A Queda, a Promessa, Adoração e Morte” — já está disponível no Kindle, em português e em inglês.",
    "faq.q7": "Preciso ter um Kindle físico para comprar?",
    "faq.a7": "Não. Basta uma conta Amazon e a app Kindle (gratuita) no telemóvel, tablet, PC ou Mac. Também há o Kindle Cloud Reader, que abre no browser sem instalar nada.",

    "finalcta.title": "Comece a saga hoje.",
    "finalcta.body": "Volumes 1 e 2 disponíveis no Kindle, em português e em inglês. Leitura imediata.",
    "finalcta.cta": "Comprar no Kindle",

    "footer.contact": "Contato",
    "footer.top": "Voltar ao topo ↑",
  },
  en: {
    "meta.title": "Chronicles of Eternity | Daniel Santana's comic book saga",
    "meta.description": "Chronicles of Eternity: the comic-book saga that retells biblical history from the Throne to the Apocalypse. Volumes 1 and 2 available on Kindle, in English and Portuguese.",

    "nav.brand": "Chronicles of Eternity",
    "nav.series": "The series",
    "nav.volumes": "Volumes",
    "nav.preview": "Preview",
    "nav.faq": "FAQ",
    "nav.buy": "Buy",

    "hero.kicker": "The comic-book saga · Daniel Santana",
    "hero.title": "Chronicles of Eternity",
    "hero.sub": "From the Throne to the Apocalypse — biblical history in comics.",
    "hero.copy": "An epic comic-book series that retells the great controversy between Christ and Satan — from the rebellion in Heaven to the final restoration. Every volume, a biblical arc. Every arc, a window of light and abyss.",
    "hero.cta_buy": "Buy Volume 1",
    "hero.cta_explore": "See volumes",
    "hero.badge_status": "Vols. 1 & 2 available",

    "facts.universe_value": "Biblical universe",
    "facts.universe_label": "From creation to final judgment",
    "facts.format_value": "Digital EPUB",
    "facts.format_label": "Kindle · Apple Books · Kobo · Google Play",
    "facts.lang_value": "EN · PT-BR",
    "facts.lang_label": "Simultaneous editions in two languages",
    "facts.author_value": "Daniel Santana",
    "facts.author_label": "Author & writer (DMG Santana)",

    "series.eyebrow": "The series",
    "series.title": "The greatest story ever told — now in comics.",
    "series.body1": "Chronicles of Eternity is a comic-book series that adapts biblical history as a single, continuous saga: the great controversy between Christ and Satan, drawn with reverence, cinematic rhythm, and theological grounding.",
    "series.body2": "Each volume covers one arc — starting in Genesis and moving through the patriarchs, the Exodus, the kingdoms, the prophets, the Gospels, and the Apocalypse. A journey of light and abyss, planned to grow issue by issue.",
    "series.quote": "“Before time had weight. Before matter had shadow. There was Heaven — and in it, perfection.”",
    "series.cite": "— Volume 1, Prologue",

    "pillars.eyebrow": "The pillars of the series",
    "pillars.title": "Imagination without losing foundation.",
    "pillars.f1_title": "Biblical fidelity",
    "pillars.f1_body": "Every narrative is rooted in the Bible and Ellen G. White's writings, with theological anchors listed in each volume.",
    "pillars.f2_title": "Cinematic art",
    "pillars.f2_body": "2:3 vertical compositions, a golden palette for the sacred, and deep shadows for the conflict.",
    "pillars.f3_title": "Apologetic dossiers",
    "pillars.f3_body": "Each issue includes extra pages with character dossiers and apologetic support in comic-book language.",
    "pillars.f4_title": "Bilingual from day one",
    "pillars.f4_body": "Every volume ships in English and Portuguese — ready-to-use resource for missions and digital evangelism.",

    "volumes.eyebrow": "The saga in volumes",
    "volumes.title": "The arcs of Chronicles of Eternity.",
    "volumes.status_live": "Available",
    "volumes.status_soon": "In production",
    "volumes.status_future": "In development",
    "volumes.pages": "pages",
    "volumes.eta": "ETA: 2026",

    "volumes.v1_num": "Volume 1",
    "volumes.v1_title": "Genesis: The Dawn and the Abyss",
    "volumes.v1_arc": "Arc I — Creation and rebellion",
    "volumes.v1_desc": "The war in Heaven, the creation of the world, Adam and Eve, and the warning that prepares the next abyss.",
    "volumes.v1_cta": "Buy Volume 1",

    "volumes.v2_num": "Volume 2",
    "volumes.v2_title": "Genesis: The Fall, the Promise, Worship and Death",
    "volumes.v2_arc": "Arc I — The fall and the first promise",
    "volumes.v2_desc": "The enemy enters Eden, Adam and Eve fall, and the first messianic promise of Genesis 3:15 is given.",
    "volumes.v2_status": "Available",
    "volumes.v2_cta_buy": "Buy Volume 2",
    "volumes.v2_cta": "Join the pre-sale list",

    "volumes.v3_num": "Volume 3",
    "volumes.v3_title": "Genesis: Absence, Invitation and Confusion",
    "volumes.v3_arc": "Arc I — Altars, flood and Babel",
    "volumes.v3_desc": "The witness of Enoch, Noah's ark, and the Tower of Babel — humanity between the divine invitation and confusion.",
    "volumes.v3_cta": "Join the pre-sale list",

    "volumes.vN_num": "Upcoming volumes",
    "volumes.vN_title": "The saga continues",
    "volumes.vN_arc": "Patriarchs · Exodus · Kingdoms · Prophets · Gospels · Apocalypse",
    "volumes.vN_desc": "The series continues arc by arc until the last book of the Bible. Subscribe to follow announcements and pre-sales.",
    "volumes.vN_meta1": "Planned arcs",
    "volumes.vN_meta2": "Ongoing releases",
    "volumes.vN_cta": "Notify me",

    "preview.eyebrow": "Preview · Volume 1",
    "preview.title": "Take a look at some pages from the available edition.",
    "preview.p1": "Prologue",
    "preview.p2": "War in Heaven",
    "preview.p3": "Let there be light",
    "preview.p4": "Living world",
    "preview.p5": "Eden",
    "preview.p6": "Sabbath",

    "preview.v2_eyebrow": "Preview · Volume 2",
    "preview.v2_title": "Pages from Volume 2, now available in Portuguese.",
    "preview.v2_p1": "Eden",
    "preview.v2_p2": "The serpent",
    "preview.v2_p3": "The fall",
    "preview.v2_p4": "The promise",
    "preview.v2_p5": "Worship",
    "preview.v2_p6": "Death",

    "audience.eyebrow": "Who the series is for",
    "audience.title": "For those who want imagination without losing foundation.",
    "audience.a1_title": "Teens & adults",
    "audience.a1_body": "A visual gateway into deep biblical themes.",
    "audience.a2_title": "Families & study groups",
    "audience.a2_body": "A starting point to talk about creation, freedom, the fall, and redemption.",
    "audience.a3_title": "Comic readers",
    "audience.a3_body": "Dramatic art, dense panels, and a saga built to grow.",
    "audience.a4_title": "Churches & missions",
    "audience.a4_body": "Bilingual EN/PT resource for digital evangelism and youth ministry.",

    "offer.eyebrow": "Start the saga · Volume 1",
    "offer.title": "Genesis: The Dawn and the Abyss.",
    "offer.body": "Volume 1 is available now on Kindle. Buy directly on Amazon — read instantly on any Kindle device or official app.",
    "offer.cover_caption": "Volume 1 · English edition",
    "offer.currency": "US$",
    "offer.plan1_tag": "Available on Kindle",
    "offer.plan1_title": "English edition",
    "offer.plan1_l1": "Volume 1 EPUB — 30 pages",
    "offer.plan1_l2": "Purchase and read on Amazon Kindle",
    "offer.plan1_l3": "Works on Kindle devices, Kindle app (iOS/Android), and web reader",
    "offer.plan1_cta": "Buy on Kindle",
    "offer.note": "Configure your checkout links in",
    "offer.note_2": "before publishing.",

    "offer2.eyebrow": "Continue the saga · Volume 2",
    "offer2.title": "Genesis: The Fall, the Promise, Worship and Death.",
    "offer2.body": "Volume 2 continues Arc I — the enemy enters Eden, Adam and Eve fall, and the first messianic promise of Genesis 3:15 is spoken. Also available on Kindle.",
    "offer2.cover_caption": "Volume 2 · PT and EN covers",
    "offer2.plan_tag": "Available on Kindle",
    "offer2.plan_title": "37 pages · EN and PT",
    "offer2.plan_l1": "Direct continuation of Volume 1",
    "offer2.plan_l2": "Buy and read on Amazon Kindle",
    "offer2.plan_l3": "Works on Kindle devices, Kindle app (iOS/Android), and web reader",
    "offer2.plan_cta": "Buy Volume 2",

    "trust.t1": "Direct purchase via Amazon Kindle — secure Amazon checkout",
    "trust.t2": "Instant reading on any Kindle device, Kindle app, or web reader",
    "trust.t3": "7-day refund — Amazon's standard return policy",

    "prelist.eyebrow": "Pre-sale list",
    "prelist.title": "Follow the next volumes of the saga.",
    "prelist.body": "Join the list and get notified about upcoming releases — Volume 3 and beyond. Past readers automatically receive a discount.",
    "prelist.label": "Your email",
    "prelist.placeholder": "you@email.com",
    "prelist.cta": "Notify me",
    "prelist.note": "No spam. Only Chronicles of Eternity announcements.",
    "prelist.success": "You're in! We'll let you know as soon as Volume 2 is ready.",
    "prelist.local": "Saved in this browser. Configure PRELIST_ENDPOINT in script.js to actually receive the emails.",
    "prelist.error": "We couldn't submit right now. Please try again in a moment.",

    "faq.eyebrow": "Quick questions",
    "faq.title": "Essential information about the series.",
    "faq.q1": "What is Chronicles of Eternity?",
    "faq.a1": "A comic-book series that retells biblical history as a single, continuous saga, from the Throne to the Apocalypse, rooted in Genesis–Revelation and Ellen G. White's writings.",
    "faq.q2": "How many volumes will the series have?",
    "faq.a2": "The series is planned arc by arc. Volume 1 (The Dawn and the Abyss) and Volume 2 (The Fall, the Promise, Worship and Death) open Arc I — Genesis. Upcoming arcs will cover the patriarchs, the Exodus, the kingdoms, the prophets, the Gospels, and the Apocalypse.",
    "faq.q3": "How do I get the book?",
    "faq.a3": "Each volume is published directly on Kindle (Amazon). After purchase, the book sits in your Amazon library and you read it on a Kindle device or app — no manual download needed.",
    "faq.q4": "Can I read on devices other than a Kindle?",
    "faq.a4": "Yes. You can read on the Kindle app (iOS/Android), Kindle Cloud Reader (web), Kindle for PC/Mac, and any physical Kindle. Your reading position syncs across them via your Amazon account.",
    "faq.q5": "Is the English version machine-translated?",
    "faq.a5": "No. The English edition is written with direct teen-friendly language (ages 13–18) while preserving full theological fidelity.",
    "faq.q6": "When does Volume 2 come out?",
    "faq.a6": "Volume 2 — “The Fall, the Promise, Worship and Death” — is available on Kindle, in both English and Portuguese.",
    "faq.q7": "Do I need a Kindle device to buy?",
    "faq.a7": "No. You just need an Amazon account and the free Kindle app (iOS/Android/PC/Mac). There's also the Kindle Cloud Reader — opens in your browser, no install needed.",

    "finalcta.title": "Begin the saga today.",
    "finalcta.body": "Volumes 1 and 2 available on Kindle, in English and Portuguese. Read instantly.",
    "finalcta.cta": "Buy on Kindle",

    "footer.contact": "Contact",
    "footer.top": "Back to top ↑",
  },
};

/* ---------- I18N ENGINE ---------- */
function applyLang(lang) {
  if (!I18N[lang]) lang = "pt";
  const dict = I18N[lang];

  document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  document.documentElement.dataset.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const attr = el.getAttribute("data-i18n-attr");
    if (!(key in dict)) return;
    if (attr) {
      el.setAttribute(attr, dict[key]);
    } else {
      el.textContent = dict[key];
    }
  });

  const region = regionForLang(lang);
  document.documentElement.dataset.region = region;
  const prices = PRICES[region];
  document.querySelectorAll("[data-price]").forEach((el) => {
    const k = el.getAttribute("data-price");
    if (prices && prices[k]) el.textContent = prices[k];
  });
  document.querySelectorAll(".plan-price .currency").forEach((el) => {
    el.textContent = prices.currency;
  });

  document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-lang-btn") === lang);
  });

  // Swap de imagens bilíngues (capas, prévias, etc.)
  const srcAttr = lang === "en" ? "data-src-en" : "data-src-pt";
  document.querySelectorAll("[data-src-pt][data-src-en]").forEach((img) => {
    const next = img.getAttribute(srcAttr);
    if (next && img.getAttribute("src") !== next) img.setAttribute("src", next);
  });

  // Swap dos links de full-size do lightbox
  const fullAttr = lang === "en" ? "data-full-en" : "data-full-pt";
  document.querySelectorAll("[data-full-pt][data-full-en]").forEach((btn) => {
    const next = btn.getAttribute(fullAttr);
    if (next) btn.setAttribute("data-full", next);
  });

  // O slideshow de capas do hero segue o idioma da UI
  if (window.heroSlideshowSetLang) window.heroSlideshowSetLang(lang);

  try { localStorage.setItem("eternity.lang", lang); } catch (_) {}
}

function detectInitialLang() {
  try {
    const stored = localStorage.getItem("eternity.lang");
    if (stored && I18N[stored]) return stored;
  } catch (_) {}
  const nav = (navigator.language || "pt").toLowerCase();
  return nav.startsWith("pt") ? "pt" : "en";
}

document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
  btn.addEventListener("click", () => applyLang(btn.getAttribute("data-lang-btn")));
});

/* ---------- SLIDESHOW DO HERO ---------- */
/* Capas que se alternam no fundo do hero, por idioma. */
const HERO_COVERS = {
  pt: ["assets/cover-pt.webp", "assets/vol2-capa.webp", "assets/vol3-capa.webp"],
  en: ["assets/cover-en.webp", "assets/vol2-capa-en.webp", "assets/vol3-capa-en.webp"],
};

(function heroSlideshow() {
  const figure = document.querySelector("[data-hero-slideshow]");
  const slides = figure ? figure.querySelectorAll(".hero-slide") : [];
  if (slides.length < 2) return;

  let covers = HERO_COVERS.pt;
  let index = 0;   // capa actualmente visível
  let front = 0;   // qual <img> está à frente (0 ou 1)

  function render(coverList) {
    covers = coverList && coverList.length ? coverList : HERO_COVERS.pt;
    index = 0;
    front = 0;
    slides[0].src = covers[0];
    slides[1].src = covers[1 % covers.length];
    slides[0].classList.add("is-active");
    slides[1].classList.remove("is-active");
  }

  function next() {
    if (covers.length < 2) return;
    const back = 1 - front;
    index = (index + 1) % covers.length;
    slides[back].src = covers[index];
    slides[back].classList.add("is-active");
    slides[front].classList.remove("is-active");
    front = back;
  }

  // Exposto para o i18n trocar o conjunto de capas ao mudar de idioma.
  window.heroSlideshowSetLang = function (lang) {
    render(HERO_COVERS[lang]);
  };

  render(HERO_COVERS.pt);
  setInterval(next, 5200);
})();

applyLang(detectInitialLang());

/* ---------- CHECKOUT (Amazon Kindle) ---------- */
const checkoutLinks = document.querySelectorAll(".checkout-link");

checkoutLinks.forEach((link) => {
  link.setAttribute("target", "_blank");
  link.setAttribute("rel", "noopener noreferrer");
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const region = document.documentElement.dataset.region || "br";
    const book = link.dataset.book || "v1";
    const urls = BOOKS[book] || BOOKS.v1;
    const url = urls[region] || urls.us;
    window.open(url, "_blank", "noopener,noreferrer");
  });
});

/* ---------- LIGHTBOX ---------- */
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const closeButton = document.querySelector("[data-close]");

function closeLightbox() {
  lightbox?.setAttribute("hidden", "");
  if (lightboxImage) {
    lightboxImage.src = "";
    lightboxImage.alt = "";
  }
}

document.querySelectorAll("[data-gallery] button").forEach((button) => {
  button.addEventListener("click", () => {
    const image = button.querySelector("img");
    const fullImage = button.getAttribute("data-full");
    if (!lightbox || !lightboxImage || !image || !fullImage) return;
    lightboxImage.src = fullImage;
    lightboxImage.alt = image.alt;
    lightbox.removeAttribute("hidden");
  });
});

closeButton?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

/* ---------- PRELIST ---------- */
const prelistForm = document.querySelector("[data-prelist-form]");
const prelistFeedback = document.querySelector("[data-prelist-feedback]");

function setPrelistFeedback(messageKey, isError) {
  if (!prelistFeedback) return;
  const lang = document.documentElement.dataset.lang || "pt";
  prelistFeedback.textContent = (I18N[lang] && I18N[lang][messageKey]) || "";
  prelistFeedback.classList.toggle("error", !!isError);
  prelistFeedback.removeAttribute("hidden");
}

prelistForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const input = prelistForm.querySelector("input[type=email]");
  const email = (input?.value || "").trim();
  if (!email) return;

  if (!PRELIST_ENDPOINT) {
    try {
      const list = JSON.parse(localStorage.getItem("eternity.prelist") || "[]");
      if (!list.includes(email)) list.push(email);
      localStorage.setItem("eternity.prelist", JSON.stringify(list));
    } catch (_) {}
    setPrelistFeedback("prelist.local", false);
    input.value = "";
    return;
  }

  try {
    const res = await fetch(PRELIST_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error("submit failed");
    setPrelistFeedback("prelist.success", false);
    input.value = "";
  } catch (_) {
    setPrelistFeedback("prelist.error", true);
  }
});

/* ---------- FOOTER YEAR ---------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

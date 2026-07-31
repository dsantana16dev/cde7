# Plano de construcao do site oficial de leitura e venda direta

Projeto: Crônicas da Eternidade  
Objetivo: transformar a landing page atual em uma plataforma propria para apresentar a saga, vender volumes digitais e permitir leitura dos HQs dentro do site.

## 1. Visao do produto

O site deve deixar de ser apenas uma pagina de venda externa e passar a ser a casa oficial da saga.

Experiencia esperada:

- O visitante entende que Crônicas da Eternidade e a saga principal.
- O leitor ve os arcos organizados: Genesis completo, Exodo iniciando e proximos arcos.
- O cliente compra volumes ou colecoes diretamente no site.
- Depois da compra, o leitor acessa uma biblioteca pessoal.
- A leitura acontece dentro do site, com uma experiencia boa para HQ em celular, tablet e desktop.

## 2. Premissas importantes

- Antes de vender fora da Amazon, confirmar se os eBooks estao inscritos no KDP Select / Kindle Unlimited.
- Se estiverem no KDP Select, a Amazon exige exclusividade digital durante o periodo de inscricao. Nesse caso, nao devemos disponibilizar a versao digital completa fora da Amazon ate sair do programa.
- O site pode manter links Amazon em paralelo se os contratos permitirem.
- O objetivo inicial nao e criar DRM perfeito. O objetivo e controle razoavel: login, acesso por compra, imagens protegidas, links temporarios e marca d'agua discreta.
- Comecar com Mercado Pago para Brasil e deixar Stripe como etapa posterior para vendas internacionais.

Referencias operacionais:

- Amazon KDP Select: https://kdp.amazon.com/select
- Mercado Pago Checkout Pro: https://www.mercadopago.com.br/developers/en/docs/checkout-pro/overview
- Stripe Checkout: https://docs.stripe.com/payments/checkout

## 3. Estrutura proposta do site

### Pagina inicial

Seções:

- Hero da saga: Crônicas da Eternidade.
- Marco atual: Genesis completo, Exodo iniciando.
- Arcos da saga.
- Colecao Genesis.
- Chamada para Exodo.
- Pre-lista / newsletter.
- FAQ.

### Arcos

Cada arco deve ter:

- Nome do arco.
- Status: completo, em lancamento, em producao, futuro.
- Descricao curta.
- Lista de volumes.
- CTA principal.

Arcos iniciais:

- Arco I: Genesis, completo.
- Arco II: Exodo, iniciando.
- Proximos: Levitico / Deserto / Reinos / Profetas / Evangelhos / Apocalipse, conforme planejamento editorial.

### Loja

Funcionalidades:

- Lista de volumes.
- Pagina de detalhe de cada volume.
- Compra individual.
- Compra de colecao, quando fizer sentido.
- Idiomas PT e EN.
- Preco por moeda/regiao.
- Botao de compra com Mercado Pago.
- Futuro suporte Stripe.

### Biblioteca do leitor

Funcionalidades:

- Login/cadastro.
- Lista de volumes comprados.
- Status de leitura.
- Botao "Ler agora".
- Acesso a volumes em PT e/ou EN conforme compra.

### Leitor de HQ

Funcionalidades:

- Leitura pagina por pagina.
- Modo vertical para celular.
- Modo pagina unica para desktop/tablet.
- Zoom.
- Tela cheia.
- Navegacao por teclado no desktop.
- Marcador de progresso.
- Continuar de onde parou.
- Alternancia PT/EN quando permitido.

### Area administrativa

Funcionalidades minimas:

- Criar/editar volume.
- Definir arco.
- Definir status.
- Cadastrar preco.
- Cadastrar paginas do HQ.
- Ver pedidos.
- Liberar acesso manualmente, se necessario.

## 4. Arquitetura recomendada

### Frontend

Opcao recomendada:

- Next.js ou React com Vite.

Motivo:

- O site atual e estatico, mas biblioteca, login, compra e leitor exigem estado, rotas e integracao com backend.
- Next.js facilita paginas publicas, rotas protegidas e futura otimizacao SEO.
- Vite pode ser mais simples se o deploy for separado do backend.

### Backend

Opcao recomendada para MVP:

- Supabase.

Componentes:

- Auth para login.
- Postgres para usuarios, volumes, compras e progresso.
- Storage para imagens protegidas.
- Edge Functions ou API propria para webhooks de pagamento.

Alternativas:

- Firebase: bom para Auth e Storage, menos relacional.
- Backend Node/Fastify ou NestJS proprio: mais controle, mais trabalho.
- Laravel: boa opcao se quiser painel administrativo robusto e ambiente PHP.

### Pagamentos

Fase 1:

- Mercado Pago Checkout Pro.

Fluxo:

1. Usuario escolhe volume.
2. Backend cria preferencia de pagamento.
3. Usuario paga no checkout Mercado Pago.
4. Mercado Pago envia webhook.
5. Backend valida pagamento.
6. Backend cria registro de compra.
7. Volume aparece na biblioteca do leitor.

Fase 2:

- Stripe Checkout para publico internacional.

### Conteudo protegido

Modelo recomendado:

- Capas e previews podem ser publicos.
- Paginas completas ficam em storage privado.
- O leitor solicita URLs temporarias ao backend.
- URLs expiram rapidamente.
- Marca d'agua discreta pode ser renderizada no leitor: e-mail ou codigo do pedido.

## 5. Modelo de dados inicial

### users

- id
- email
- name
- created_at

### arcs

- id
- slug
- title_pt
- title_en
- description_pt
- description_en
- status
- order_index

### volumes

- id
- arc_id
- slug
- number
- title_pt
- title_en
- subtitle_pt
- subtitle_en
- description_pt
- description_en
- status
- cover_pt_url
- cover_en_url
- language_mode
- page_count
- created_at

### products

- id
- volume_id
- type
- language
- price_brl
- price_usd
- active

### orders

- id
- user_id
- provider
- provider_payment_id
- status
- amount
- currency
- created_at
- paid_at

### order_items

- id
- order_id
- product_id
- volume_id
- language

### entitlements

- id
- user_id
- volume_id
- language
- source_order_id
- created_at

### pages

- id
- volume_id
- language
- page_number
- image_path
- width
- height

### reading_progress

- id
- user_id
- volume_id
- language
- current_page
- updated_at

## 6. Sprints

## Sprint 0 - Decisao editorial e juridica

Objetivo: confirmar o que pode ser vendido fora da Amazon e organizar o escopo.

Tarefas:

- Verificar status KDP Select / Kindle Unlimited de cada volume.
- Definir se Genesis sera vendido como volumes avulsos, colecao ou ambos.
- Definir se PT e EN serao produtos separados ou um produto bilingue.
- Definir preco inicial por volume e por colecao.
- Definir politica de acesso: vitalicio, tempo limitado ou assinatura.
- Definir termos basicos de uso e politica de privacidade.

Entregaveis:

- Decisao de venda direta aprovada.
- Lista de volumes liberados para venda fora da Amazon.
- Tabela inicial de precos.

## Sprint 1 - Prototipo visual e arquitetura da informacao

Objetivo: redesenhar a experiencia publica do site.

Tarefas:

- Transformar o conceito `index-conceito-exodo.html` em direcao visual.
- Definir navegacao principal: Saga, Arcos, Genesis, Exodo, Biblioteca.
- Criar secao "Arcos da Saga".
- Criar secao "Genesis completo".
- Criar secao "Exodo iniciando".
- Criar pagina de detalhe de volume.
- Revisar textos PT.
- Revisar textos EN.

Entregaveis:

- Protótipo navegavel.
- Textos finais da homepage.
- Estrutura de paginas aprovada.

## Sprint 2 - Base tecnica do app

Objetivo: sair de site estatico para app com rotas e estado.

Tarefas:

- Escolher stack final: Next.js ou Vite + backend.
- Criar novo projeto.
- Migrar assets atuais.
- Criar layout base.
- Criar rotas publicas.
- Configurar variaveis de ambiente.
- Configurar deploy de staging.

Entregaveis:

- App rodando localmente.
- Staging publicado.
- Homepage migrada.

## Sprint 3 - Banco de dados e autenticacao

Objetivo: permitir contas de leitor e estrutura de biblioteca.

Tarefas:

- Criar projeto Supabase.
- Criar tabelas: arcs, volumes, products, orders, entitlements, pages, reading_progress.
- Configurar Auth por e-mail.
- Criar tela de login.
- Criar tela de cadastro.
- Criar rota protegida `/biblioteca`.
- Criar seed inicial com Genesis e Exodo.

Entregaveis:

- Login funcionando.
- Biblioteca vazia funcionando.
- Dados editoriais vindo do banco.

## Sprint 4 - Leitor de HQ

Objetivo: entregar a experiencia principal de leitura.

Tarefas:

- Criar rota `/ler/[volume]`.
- Criar componente de pagina.
- Criar navegacao anterior/proxima.
- Criar modo vertical para mobile.
- Criar zoom.
- Criar tela cheia.
- Salvar progresso de leitura.
- Bloquear acesso se usuario nao tiver entitlement.
- Testar leitura em celular, tablet e desktop.

Entregaveis:

- Leitor funcional.
- Progresso salvo.
- Acesso protegido.

## Sprint 5 - Pagamento Mercado Pago

Objetivo: vender diretamente no Brasil.

Tarefas:

- Criar conta/app Mercado Pago.
- Criar backend para gerar preferencia de pagamento.
- Criar botao de compra por produto.
- Configurar webhook.
- Validar pagamento no backend.
- Criar pedido aprovado.
- Criar entitlement automatico.
- Criar tela de sucesso.
- Criar tela de falha/pendente.
- Testar compra sandbox.

Entregaveis:

- Compra teste aprovada.
- Volume liberado automaticamente na biblioteca.
- Logs basicos de pagamento.

## Sprint 6 - Protecao de conteudo

Objetivo: reduzir compartilhamento indevido.

Tarefas:

- Mover paginas completas para storage privado.
- Gerar URLs temporarias.
- Impedir listagem publica das imagens.
- Adicionar marca d'agua discreta no leitor.
- Limitar chamadas suspeitas.
- Registrar acesso por usuario, volume e pagina.

Entregaveis:

- Paginas completas inacessiveis publicamente.
- Leitor continua funcionando para compradores.
- Marca d'agua visivel, mas nao invasiva.

## Sprint 7 - Admin editorial

Objetivo: facilitar gestao dos proximos volumes.

Tarefas:

- Criar login administrativo.
- Criar tela de volumes.
- Criar formulario de volume.
- Criar upload de paginas.
- Criar status editorial.
- Criar controle de produtos/precos.
- Criar liberacao manual de acesso.

Entregaveis:

- Admin minimo utilizavel.
- Novo volume pode ser cadastrado sem editar codigo.

## Sprint 8 - Internacionalizacao e Stripe

Objetivo: melhorar venda para publico EN/internacional.

Tarefas:

- Consolidar i18n PT/EN.
- Criar precos USD.
- Integrar Stripe Checkout.
- Criar webhook Stripe.
- Criar entitlement via Stripe.
- Ajustar moeda por idioma/regiao.

Entregaveis:

- Compra internacional funcionando.
- Biblioteca reconhece compras Mercado Pago e Stripe.

## Sprint 9 - Lancamento publico

Objetivo: publicar a primeira versao oficial.

Tarefas:

- Revisar SEO.
- Revisar Open Graph.
- Revisar performance.
- Revisar mobile.
- Revisar fluxo completo de compra real.
- Criar backup dos dados.
- Configurar monitoramento basico.
- Publicar dominio final.

Entregaveis:

- Plataforma online em producao.
- Primeiro volume vendido e lido pelo site.

## 7. Priorizacao do MVP

MVP minimo recomendado:

- Homepage nova por arcos.
- Login.
- Biblioteca.
- Leitor de HQ.
- Compra Mercado Pago.
- Webhook liberando acesso.
- Genesis com pelo menos 1 volume publicado no leitor.

Nao incluir no MVP:

- Assinatura mensal.
- App mobile nativo.
- DRM complexo.
- Painel administrativo completo.
- Comunidade/comentarios.
- Sistema de afiliados.

## 8. Riscos e decisoes abertas

### Risco: exclusividade Amazon

Se volumes estiverem no KDP Select, vender ou distribuir digitalmente fora da Amazon pode violar os termos.

Decisao pendente:

- Confirmar status de cada volume no KDP.

### Risco: pirataria

Nao existe protecao perfeita para HQ digital no navegador.

Mitigacao:

- Login obrigatorio.
- URLs temporarias.
- Storage privado.
- Marca d'agua.
- Auditoria de acesso.

### Risco: complexidade do pagamento

Webhooks precisam ser validados corretamente para evitar liberar livros sem pagamento real.

Mitigacao:

- Nunca liberar acesso apenas pelo retorno do navegador.
- Sempre validar pagamento no backend.
- Registrar logs de pedido.

### Risco: custo de imagem

HQs tem muitas paginas pesadas.

Mitigacao:

- Usar WebP.
- Gerar resolucoes otimizadas.
- Lazy loading.
- CDN.

## 9. Checklist de definicoes necessarias

- [ ] Os volumes estao ou nao no KDP Select?
- [ ] Quais volumes podem ser vendidos fora da Amazon agora?
- [ ] Venda individual ou colecao Genesis?
- [ ] PT e EN vendidos juntos ou separados?
- [ ] Preco BRL por volume.
- [ ] Preco USD por volume.
- [ ] Mercado Pago sera o primeiro gateway?
- [ ] Stripe entra no MVP ou depois?
- [ ] Leitura apenas online ou tambem download?
- [ ] Sera permitido acesso familiar?
- [ ] Quantos dispositivos simultaneos?
- [ ] Qual dominio final da plataforma?

## 10. Memoria de execucao

Esta secao deve ser atualizada a cada decisao ou sprint concluida.

### 2026-07-31

- Site atual e uma landing page estatica com `index.html`, `styles.css`, `script.js` e assets locais.
- Volume 3 foi atualizado no site atual como disponivel em PT e EN.
- Foi criado o prototipo `index-conceito-exodo.html` para testar a nova estrutura por arcos.
- Decisao inicial sugerida: manter Crônicas da Eternidade como marca principal, apresentar Genesis como arco completo e Exodo como novo arco.
- Ideia rejeitada parcialmente: segundo carrossel no hero principal.
- Ideia recomendada: carrossel/abas de arcos dentro de uma nova secao editorial.
- Nova demanda: estudar substituicao gradual da Amazon por venda direta e leitura dentro do site.

### Proxima atualizacao

- Registrar decisao sobre KDP Select.
- Registrar stack escolhida.
- Registrar escopo fechado do MVP.
- Registrar gateway de pagamento inicial.

## 11. Proxima acao recomendada

Antes de escrever codigo do app novo, fechar estas 5 respostas:

1. Os volumes 1 a 6 estarao fora do KDP Select?
2. O Genesis sera vendido como colecao completa?
3. O leitor tera apenas leitura online ou tambem download?
4. O primeiro pagamento sera Mercado Pago?
5. O MVP deve reaproveitar o site atual ou nascer como app novo em pasta separada?

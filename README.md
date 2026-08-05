# Loud Fit Anchieta — Landing Page

Landing page estática (HTML/CSS/JS puro, sem build step) para a Loud Fit Anchieta.
Já testada localmente e sem erros de console.

## Estrutura de arquivos

```
index.html          → toda a página (seções comentadas por bloco)
css/style.css        → design system completo (cores, tipografia, componentes, responsivo)
js/main.js            → CONFIG editável, autoplay de vídeo, menu, accordion, formulário, tracking
assets/img/           → fotos da unidade + logo/favicon em SVG
assets/video/         → vídeos de fundo (hero e seção de experiência/CTA final)
robots.txt / sitemap.xml
```

## ⚠️ Antes de publicar — campos que PRECISAM ser editados

Nenhum dado de contato real foi inventado. Os campos abaixo estão com placeholders
e devem ser preenchidos com as informações reais da unidade antes do site ir ao ar:

### 1. `js/main.js` — bloco `CONFIG` (topo do arquivo)
- `whatsappNumber` — número real do WhatsApp da unidade (formato `55DDDNUMERO`, sem espaços/símbolos)
- `instagramUrl` — link do Instagram oficial da Loud Fit Anchieta
- `mapsDirectionsUrl` — link de rota do Google Maps com o endereço real
- `googleReviewsUrl` — link das avaliações reais no Google
- `phoneDisplay` — telefone exibido na seção de Localização

### 2. `index.html`
- Seção **Localização** (`#localizacao`): endereço completo, horário de funcionamento, iframe do mapa (`src` do `<iframe>` — hoje usa uma busca genérica por nome, trocar pelo endereço real ou pelo embed exato do Google Maps)
- Seção **FAQ**: resposta de "Qual é o horário de funcionamento?"
- Seção **Depoimentos** (`#depoimentos`): 3 cards com placeholders `[Depoimento a confirmar]` / `[Nome do aluno]` — substituir por avaliações reais de alunos ou do Google
- **Rodapé**: endereço, telefone, horário
- `<title>`/meta tags: `og:image` e `canonical` usam o domínio placeholder `www.loudfitanchieta.com.br` — trocar pelo domínio real antes de publicar
- Dados estruturados (JSON-LD no `<head>`): `telephone` e `address.streetAddress`

### 3. Planos (`#planos`)
Os nomes, preços e benefícios dos 3 planos (Start R$99,90 / Performance R$129,90 /
Black R$159,90) foram fornecidos no briefing e já estão implementados. Continuam
totalmente editáveis diretamente no HTML (`plan-card`) caso os valores mudem.
**Não foram adicionadas** taxa de matrícula, multa ou fidelidade — conforme
instruído, isso deve ser confirmado com a equipe antes de exibir.

## Vídeos e imagens

- Os 2 vídeos fornecidos (`assets/video/`) estão em MP4, sem versão WebM ou versão
  vertical dedicada para mobile (não havia `ffmpeg` disponível no ambiente de build
  para gerar essas variantes). Recomenda-se, antes do deploy final:
  - Gerar uma versão `.webm` de cada vídeo (menor e mais eficiente).
  - Comprimir os MP4s (bitrate/resolução) para acelerar o carregamento.
  - Opcional: gerar um recorte vertical do vídeo do Hero para telas pequenas.
- As fotos estão em JPG. Para performance máxima, gerar versões `.webp`/`.avif`
  e servir via `<picture>` ou `srcset`.

## Como testar localmente

Qualquer servidor estático funciona, por exemplo:

```bash
npx serve .
# ou
python -m http.server 8080
```

Depois abra `http://localhost:PORTA/index.html`.

## Rastreamento (GA4 / GTM / Meta Pixel)

`js/main.js` já dispara eventos via `dataLayer.push(...)` e chama `gtag`/`fbq`
automaticamente se essas globais existirem na página (basta colar os snippets do
GA4, GTM e Meta Pixel no `<head>`). Eventos implementados:

`view_pricing`, `select_start_plan`, `select_performance_plan`, `select_black_plan`,
`click_whatsapp`, `request_trial`, `submit_lead`, `click_directions`, `scroll_depth`
(25/50/75/100%).

## Formulário de Aula Experimental

Hoje o formulário (`#trialForm`) monta a mensagem com os dados preenchidos e abre
o WhatsApp (`wa.me`) em uma nova aba — não requer backend. Se preferir integrar com
CRM, e-mail ou automação, o `submit` handler em `js/main.js` é o ponto único a
adaptar.

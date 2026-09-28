import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';

const siteUrl = process.env.SITE_URL ?? 'http://localhost:3000/';
const ifoodUrl =
  'https://www.ifood.com.br/delivery/sao-paulo-sp/delicias-rosicleia-conjunto-habitacional-brigadeiro-faria-lima/47694be2-a16e-49d2-9ba6-fbdaa2efe570?utm_medium=share';
const expectedTitle =
  'Delícias Rosicleia — comida caseira, direto no seu iFood';
const expectedDescription =
  'Comida feita à moda da casa, com ingredientes selecionados. Veja o cardápio completo e peça pelo iFood.';

let html = '';
let cardapioHtml = '';

function luminanciaRelativa(hex) {
  const canais = hex
    .replace('#', '')
    .match(/../g)
    .map((canal) => Number.parseInt(canal, 16) / 255)
    .map((canal) =>
      canal <= 0.04045 ? canal / 12.92 : ((canal + 0.055) / 1.055) ** 2.4,
    );

  return canais[0] * 0.2126 + canais[1] * 0.7152 + canais[2] * 0.0722;
}

function contraste(corA, corB) {
  const luzA = luminanciaRelativa(corA);
  const luzB = luminanciaRelativa(corB);

  return (Math.max(luzA, luzB) + 0.05) / (Math.min(luzA, luzB) + 0.05);
}

test.before(async () => {
  const response = await fetch(siteUrl);
  assert.equal(response.status, 200);
  html = await response.text();
  const cardapioResponse = await fetch(new URL('/cardapio', siteUrl));
  assert.equal(cardapioResponse.status, 200);
  cardapioHtml = await cardapioResponse.text();
});

test('entrega idioma, título e descrição corretos', () => {
  assert.match(html, /<html[^>]+lang="pt-BR"/);
  assert.ok(html.includes(expectedTitle));
  assert.ok(html.includes(expectedDescription));
});

test('todas as CTAs renderizadas usam o link externo seguro do iFood', () => {
  const anchors = html.match(/<a\b[^>]*>/g) ?? [];
  const ifoodAnchors = anchors.filter((anchor) => anchor.includes(ifoodUrl));

  assert.ok(ifoodAnchors.length >= 4);
  for (const anchor of ifoodAnchors) {
    assert.match(anchor, /target="_blank"/);
    assert.match(anchor, /rel="noopener noreferrer"/);
  }
  assert.doesNotMatch(html, />\s*(Carrinho|Checkout)\s*</i);
});

test('JSON-LD contém 12 faixas e nenhum endereço inventado', () => {
  const match = html.match(
    /<script type="application\/ld\+json">([^<]+)<\/script>/,
  );
  assert.ok(match, 'JSON-LD não encontrado');

  const data = JSON.parse(match[1]);
  assert.equal(data['@type'], 'FoodEstablishment');
  assert.equal(data.name, 'Delícias Rosicleia');
  assert.equal(data.url, ifoodUrl);
  assert.equal(data.openingHoursSpecification.length, 12);
  assert.equal('address' in data, false);
});

test('textura autoral, assets provisórios e cartão social existem localmente', async () => {
  const assets = [
    'public/og.png',
    'public/brand/hero-kitchen-texture.webp',
    'public/produtos/ifood-largato.webp',
    'public/produtos/ifood-parmegiana-frango.webp',
    'public/produtos/ifood-parmegiana-carne.webp',
    'public/produtos/placeholder-1.jpg',
    'public/produtos/placeholder-2.jpg',
    'public/produtos/placeholder-3.jpg',
  ];

  await Promise.all(assets.map((asset) => access(join(process.cwd(), asset))));
});

test('exibe o cadastro real sem produtos fictícios nem destaque escolhido automaticamente', () => {
  assert.ok(cardapioHtml.includes('Largato'));
  assert.ok(cardapioHtml.includes('Caldo de mocotó'));
  assert.doesNotMatch(html, /Produto a confirmar/i);
  assert.doesNotMatch(html, /Cardápio em preparação/i);
  assert.doesNotMatch(html, /Destaque da semana/i);
});

test('início mantém a introdução e a busca sem repetir filtros ou produtos', async () => {
  assert.ok(html.includes('Escolha o que combina com hoje.'));
  assert.ok(html.includes('Explore os sabores da casa.'));
  assert.doesNotMatch(html, /data-product-id="|id="filtros-cardapio"/);
  assert.match(html, /<form[^>]*action="\/cardapio"/);
  assert.match(html, /name="busca"/);

  const response = await fetch(new URL('/cardapio?busca=mocoto', siteUrl));
  assert.equal(response.status, 200);
  const resultado = await response.text();
  assert.ok(resultado.includes('Caldo de mocotó'));
  assert.equal((resultado.match(/data-product-id="/g) ?? []).length, 1);
});

test('Cardápio abre uma página própria com os 26 itens e as 9 categorias', () => {
  const links = html.match(/<a\b[^>]*href="\/cardapio"[^>]*>/g) ?? [];
  assert.ok(
    links.length >= 2,
    'Cabeçalhos desktop e mobile devem levar ao cardápio',
  );
  assert.match(cardapioHtml, /<h1[^>]*>Nosso cardápio<\/h1>/);
  assert.doesNotMatch(cardapioHtml, /data-parallax-layers/);
  const ids = [...cardapioHtml.matchAll(/data-product-id="([^"]+)"/g)].map(
    (match) => match[1],
  );
  assert.equal(ids.length, 26);
  assert.equal(
    new Set(ids).size,
    26,
    'Entradas repetidas em categorias diferentes mantêm IDs próprios',
  );
  assert.equal((cardapioHtml.match(/class="menu-category"/g) ?? []).length, 9);
  assert.match(cardapioHtml, /datetime="2026-09-10"/i);
  assert.ok(cardapioHtml.includes('href="/#horarios"'));

  const anchors = cardapioHtml.match(/<a\b[^>]*>/g) ?? [];
  for (const anchor of anchors.filter((tag) => tag.includes(ifoodUrl))) {
    assert.match(anchor, /target="_blank"/);
    assert.match(anchor, /rel="noopener noreferrer"/);
  }
});

test('links de categoria abrem o filtro correto e categoria desconhecida mostra todos', async () => {
  const bebidas = await fetch(new URL('/cardapio?categoria=Bebidas', siteUrl));
  assert.equal(bebidas.status, 200);
  const bebidasHtml = await bebidas.text();
  assert.equal((bebidasHtml.match(/data-product-id="/g) ?? []).length, 4);
  assert.match(bebidasHtml, /Refrigerante Coca-Cola Lata 350ml/);
  assert.doesNotMatch(
    bebidasHtml,
    /data-product-id="28dcb6c9-f668-420a-859b-5e399b3b544e"/,
  );

  const desconhecida = await fetch(
    new URL('/cardapio?categoria=inexistente', siteUrl),
  );
  assert.equal(desconhecida.status, 200);
  const desconhecidaHtml = await desconhecida.text();
  assert.equal((desconhecidaHtml.match(/data-product-id="/g) ?? []).length, 26);
});

test('hero preserva reduced motion e limpeza de animação', async () => {
  const [hero, styles] = await Promise.all([
    readFile(join(process.cwd(), 'components/ui/hero-parallax.tsx'), 'utf8'),
    readFile(join(process.cwd(), 'app/globals.css'), 'utf8'),
  ]);

  assert.ok(hero.includes('prefers-reduced-motion: reduce'));
  assert.ok(hero.includes('ScrollTrigger.getAll().forEach'));
  assert.ok(hero.includes('gsap.killTweensOf(triggerElement)'));
  assert.ok(hero.includes('gsap.ticker.remove(updateLenis)'));
  assert.ok(hero.includes('lenis.destroy()'));
  assert.ok(styles.includes('@media (prefers-reduced-motion: reduce)'));
});

test('cores de texto pequeno atingem contraste AA no modo claro', () => {
  assert.ok(contraste('#6f521f', '#fbf8f2') >= 4.5);
  assert.ok(contraste('#6f521f', '#fffdf9') >= 4.5);
  assert.ok(contraste('#6b5d45', '#fbf8f2') >= 4.5);
  assert.ok(contraste('#6b5d45', '#fffdf9') >= 4.5);
});

test('header, filtros e tema claro expõem os estados esperados', async () => {
  const [header, catalogo, layout, botao] = await Promise.all([
    readFile(join(process.cwd(), 'components/site-header.tsx'), 'utf8'),
    readFile(join(process.cwd(), 'components/menu-catalog.tsx'), 'utf8'),
    readFile(join(process.cwd(), 'app/layout.tsx'), 'utf8'),
    readFile(join(process.cwd(), 'components/ui/flow-button.tsx'), 'utf8'),
  ]);

  assert.ok(
    header.includes("aria-current={paginaCardapio ? 'page' : undefined}"),
  );
  assert.ok(catalogo.includes('aria-pressed={ativa}'));
  assert.ok(catalogo.includes('grid size-11'));
  assert.ok(layout.includes('forcedTheme="light"'));
  assert.ok(layout.includes('defaultTheme="light"'));
  assert.ok(layout.includes('enableSystem={false}'));
  assert.doesNotMatch(header, /ThemeToggle/);
  assert.ok(botao.includes('abre em uma nova aba'));
  assert.ok(botao.includes('aria-hidden="true"'));
  assert.match(html, /href="#conteudo-principal"/);
});

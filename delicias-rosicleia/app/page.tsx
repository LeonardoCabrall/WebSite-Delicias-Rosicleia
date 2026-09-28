import { Clock3 } from 'lucide-react';
import Image from 'next/image';

import { MenuCatalog } from '@/components/menu-catalog';
import { SiteHeader } from '@/components/site-header';
import { FlowButton } from '@/components/ui/flow-button';
import { HeroParallax } from '@/components/ui/hero-parallax';
import {
  horarios,
  IFOOD_LINK,
  precoVisivel,
  produtosConfirmados,
} from '@/lib/site-data';

const diasSchema: Record<string, string> = {
  'Segunda-feira': 'https://schema.org/Monday',
  'Terça-feira': 'https://schema.org/Tuesday',
  'Quarta-feira': 'https://schema.org/Wednesday',
  'Quinta-feira': 'https://schema.org/Thursday',
  'Sexta-feira': 'https://schema.org/Friday',
  Sábado: 'https://schema.org/Saturday',
  Domingo: 'https://schema.org/Sunday',
};

const openingHoursSpecification = horarios.flatMap(({ dia, faixas }) =>
  faixas.map((faixa) => {
    const [opens, closes] = faixa.split('–');

    return {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: diasSchema[dia],
      opens,
      closes,
    };
  }),
);

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'FoodEstablishment',
  name: 'Delícias Rosicleia',
  url: IFOOD_LINK,
  openingHoursSpecification,
};

const compromissos = [
  {
    titulo: 'À moda da casa',
    texto: 'Uma marca de comida feita com cuidado e ingredientes selecionados.',
  },
  {
    titulo: 'Cardápio do dia',
    texto: 'Itens, valores e disponibilidade reunidos no canal oficial.',
  },
  {
    titulo: 'Pedido pelo iFood',
    texto: 'A escolha, o pedido e o pagamento são concluídos por lá.',
  },
];

export default function Home() {
  const destaque = produtosConfirmados.find(
    (produto) => produto.destaque && produto.imagem,
  );

  return (
    <>
      <a className="skip-link" href="#conteudo-principal">
        Pular para o conteúdo
      </a>

      <SiteHeader />

      <main id="conteudo-principal" tabIndex={-1}>
        <HeroParallax />

        <section className="promise-ribbon" aria-label="Sobre a experiência">
          <div className="promise-ribbon__inner">
            {compromissos.map(({ titulo, texto }) => (
              <article key={titulo}>
                <span aria-hidden="true" className="promise-ribbon__mark" />
                <div>
                  <h2>{titulo}</h2>
                  <p>{texto}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {destaque?.imagem ? (
          <section
            aria-labelledby="destaque-title"
            className="featured-editorial"
          >
            <div className="featured-editorial__shell">
              <div className="featured-editorial__image-wrap">
                <Image
                  src={destaque.imagem}
                  alt={`${destaque.nome}, destaque da Delícias Rosicleia`}
                  width="1200"
                  height="900"
                  priority
                  sizes="(max-width: 767px) 100vw, 58vw"
                  className="featured-editorial__image"
                />
              </div>

              <div className="featured-editorial__copy">
                <p>Escolha da casa</p>
                <h2 id="destaque-title">{destaque.nome}</h2>
                <p>{destaque.descricao}</p>
                <strong>{precoVisivel(destaque.preco)}</strong>
              </div>
            </div>
          </section>
        ) : null}

        <MenuCatalog />
      </main>

      <footer id="horarios" className="site-footer scroll-mt-20">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <p className="site-footer__wordmark">
              <span>Delícias</span>
              <em>Rosicleia</em>
            </p>
            <p>
              Comida feita à moda da casa. Veja o cardápio e faça seu pedido
              pelo canal oficial no iFood.
            </p>
            <a href="#inicio">Voltar ao início</a>
          </div>

          <section
            aria-labelledby="horarios-title"
            className="site-footer__hours"
          >
            <div className="site-footer__heading">
              <Clock3 aria-hidden="true" />
              <h2 id="horarios-title">Horários de funcionamento</h2>
            </div>

            <ul>
              {horarios.map(({ dia, faixas }) => (
                <li key={dia}>
                  <span>{dia}</span>
                  <span>
                    {faixas.map((faixa) => (
                      <span key={faixa}>{faixa}</span>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <div className="site-footer__order">
            <p>Quando bater a vontade, o cardápio está a um toque.</p>
            <FlowButton
              className="border-[#d9b15f] text-[#f0d9a0] hover:text-[#2b2216]"
              text="Abrir iFood"
            />
          </div>
        </div>

        <div className="site-footer__base">
          <p>© {new Date().getFullYear()} Delícias Rosicleia.</p>
          <p>Pedidos e pagamentos são concluídos exclusivamente no iFood.</p>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';

import { MenuCatalog } from '@/components/menu-catalog';
import { SiteHeader } from '@/components/site-header';
import { categorias } from '@/lib/site-data';

export const metadata: Metadata = {
  title: 'Cardápio — Delícias Rosicleia',
  description:
    'Conheça os produtos da Delícias Rosicleia, consulte os preços e escolha por categoria. Finalize seu pedido no iFood.',
};

export default async function CardapioPage({
  searchParams,
}: {
  searchParams: Promise<{
    categoria?: string | string[];
    busca?: string | string[];
  }>;
}) {
  const parametros = await searchParams;
  const buscaInicial =
    typeof parametros.busca === 'string' ? parametros.busca : '';
  const categoriaInicial =
    typeof parametros.categoria === 'string' &&
    categorias.includes(parametros.categoria)
      ? parametros.categoria
      : 'Todos';

  return (
    <>
      <a className="skip-link" href="#conteudo-principal">
        Pular para o cardápio
      </a>
      <SiteHeader paginaCardapio />

      <main id="conteudo-principal" tabIndex={-1} className="menu-page">
        <div className="menu-shell menu-page__intro">
          <nav aria-label="Você está em">
            <ol className="menu-page__breadcrumbs">
              <li>
                <Link href="/">Início</Link>
              </li>
              <li aria-current="page">Cardápio</li>
            </ol>
          </nav>
          <h1>Nosso cardápio</h1>
          <p>
            Encontre seu próximo pedido. Confira os valores e a disponibilidade
            no iFood antes de finalizar.
          </p>
        </div>

        <MenuCatalog
          key={JSON.stringify([categoriaInicial, buscaInicial])}
          paginaCompleta
          categoriaInicial={categoriaInicial}
          buscaInicial={buscaInicial}
        />
      </main>

      <footer className="menu-page__footer">
        <div className="menu-shell">
          <Link href="/" className="font-heading text-xl">
            Delícias Rosicleia
          </Link>
          <Link href="/#horarios">Horários de funcionamento</Link>
          <p>Pedidos e pagamentos pelo iFood.</p>
        </div>
      </footer>
    </>
  );
}

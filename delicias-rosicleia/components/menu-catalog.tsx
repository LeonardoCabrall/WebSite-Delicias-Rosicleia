'use client';

import { useMemo, useState } from 'react';
import { NotebookTabs, Search, SearchX, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { FlowButton } from '@/components/ui/flow-button';
import { Input } from '@/components/ui/input';
import {
  IFOOD_LINK,
  categorias,
  precoVisivel,
  produtosConfirmados,
  type Produto,
} from '@/lib/site-data';
import { cn } from '@/lib/utils';
import { cardapioConferidoEm } from '@/lib/cardapio';

function normalizar(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim();
}

function ProductCard({ produto }: { produto: Produto }) {
  return (
    <a
      href={IFOOD_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${produto.nome} — ver a loja no iFood (abre em nova aba)`}
      className={cn(
        'menu-product group',
        !produto.imagem && 'menu-product--text-only',
      )}
      data-product-id={produto.id}
    >
      {produto.imagem ? (
        <div className="menu-product__image-wrap">
          <Image
            src={produto.imagem}
            alt={`${produto.nome}, item do cardápio da Delícias Rosicleia`}
            width="1200"
            height="900"
            loading="lazy"
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className="menu-product__image"
          />
        </div>
      ) : null}

      <div className="menu-product__body">
        <p className="menu-product__category">{produto.categoria}</p>
        <div className="menu-product__heading">
          <h3>{produto.nome}</h3>
          <p>{precoVisivel(produto.preco)}</p>
        </div>
        {produto.descricao ? (
          <p className="menu-product__description">{produto.descricao}</p>
        ) : null}
        {produto.servePessoas ? (
          <p className="menu-product__serving">
            Serve {produto.servePessoas}{' '}
            {produto.servePessoas === 1 ? 'pessoa' : 'pessoas'}
          </p>
        ) : null}
      </div>
    </a>
  );
}

export function MenuCatalog({
  paginaCompleta = false,
  categoriaInicial = 'Todos',
  buscaInicial = '',
}: {
  paginaCompleta?: boolean;
  categoriaInicial?: string;
  buscaInicial?: string;
}) {
  const [busca, setBusca] = useState(buscaInicial);
  const [categoriaAtiva, setCategoriaAtiva] = useState(categoriaInicial);

  const produtosFiltrados = useMemo(() => {
    const termo = normalizar(busca);

    return produtosConfirmados.filter((produto) => {
      const correspondeCategoria =
        categoriaAtiva === 'Todos' || produto.categoria === categoriaAtiva;
      const textoPesquisavel = normalizar(
        [produto.nome, produto.descricao, produto.categoria].join(' '),
      );

      return correspondeCategoria && textoPesquisavel.includes(termo);
    });
  }, [busca, categoriaAtiva]);

  const grupos = categorias
    .slice(1)
    .map((categoria) => ({
      categoria,
      produtos: produtosFiltrados.filter(
        (produto) => produto.categoria === categoria,
      ),
    }))
    .filter((grupo) => grupo.produtos.length > 0);

  if (!produtosConfirmados.length) {
    return (
      <section
        id="catalogo"
        aria-labelledby="catalogo-title"
        className="menu-availability scroll-mt-20"
      >
        <div className="menu-shell">
          <div className="menu-availability__intro">
            <h2 id="catalogo-title">O cardápio do dia está no iFood.</h2>
            <p>
              Os itens, valores e disponibilidade ficam reunidos no canal
              oficial. Abra o cardápio para escolher com calma e concluir o
              pedido por lá.
            </p>
            <p className="menu-availability__signature">
              Cuidado no preparo. Leveza na escolha. Comida com jeito de casa.
            </p>
          </div>

          <aside className="menu-ledger" aria-label="Como fazer seu pedido">
            <div className="menu-ledger__heading">
              <NotebookTabs aria-hidden="true" />
              <p>Canal oficial de pedidos</p>
            </div>

            <dl className="menu-ledger__list">
              <div>
                <dt>Cardápio</dt>
                <dd>Itens disponíveis no dia</dd>
              </div>
              <div>
                <dt>Valores</dt>
                <dd>Preços atualizados</dd>
              </div>
              <div>
                <dt>Pedido</dt>
                <dd>Conclusão pelo iFood</dd>
              </div>
            </dl>

            <p className="menu-ledger__note">
              Este site apresenta a Delícias Rosicleia. O pedido e o pagamento
              acontecem diretamente no iFood.
            </p>
            <FlowButton
              text="Abrir cardápio no iFood"
              className="menu-ledger__button"
            />
          </aside>
        </div>
      </section>
    );
  }

  return (
    <section
      id="catalogo"
      aria-labelledby="catalogo-title"
      className={cn(
        'menu-catalog scroll-mt-20',
        paginaCompleta && 'menu-catalog--page',
      )}
    >
      <div className="menu-shell">
        <div className="menu-catalog__header">
          <div className={paginaCompleta ? 'menu-catalog__summary' : undefined}>
            <h2 id="catalogo-title">
              {paginaCompleta
                ? 'Sabores da casa'
                : 'Escolha o que combina com hoje.'}
            </h2>
            <p>
              Explore os sabores da casa. Disponibilidade e valores finais são
              sempre confirmados no iFood.
            </p>
          </div>

          <form
            className="menu-search"
            action="/cardapio"
            method="get"
            role="search"
            onSubmit={
              paginaCompleta ? (event) => event.preventDefault() : undefined
            }
          >
            <label className="sr-only" htmlFor="busca-cardapio">
              Buscar produto no cardápio
            </label>
            <Search aria-hidden="true" />
            <Input
              id="busca-cardapio"
              name="busca"
              type="search"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Busque um sabor"
              className="menu-search__input"
            />
            {busca ? (
              <button
                type="button"
                onClick={() => setBusca('')}
                aria-label="Limpar busca"
                className="menu-search__clear grid size-11"
              >
                <X aria-hidden="true" />
              </button>
            ) : null}
          </form>
        </div>

        {paginaCompleta ? (
          <>
            <div id="filtros-cardapio" className="menu-filters">
              <fieldset>
                <legend className="sr-only">Filtrar por categoria</legend>
                {categorias.map((categoria) => {
                  const ativa = categoria === categoriaAtiva;

                  return (
                    <button
                      key={categoria}
                      type="button"
                      aria-pressed={ativa}
                      onClick={() => setCategoriaAtiva(categoria)}
                      className={cn(
                        'menu-filter',
                        ativa && 'menu-filter--active',
                      )}
                    >
                      {categoria}
                    </button>
                  );
                })}
              </fieldset>

              <output aria-live="polite">
                {produtosFiltrados.length}{' '}
                {produtosFiltrados.length === 1
                  ? 'item encontrado'
                  : 'itens encontrados'}
              </output>
            </div>

            {produtosFiltrados.length ? (
              <div>
                {grupos.map((grupo) => {
                  const tituloId = `categoria-${normalizar(grupo.categoria).replace(/[^a-z0-9]+/g, '-')}`;
                  return (
                    <section
                      key={grupo.categoria}
                      className="menu-category"
                      aria-labelledby={tituloId}
                    >
                      <h2 id={tituloId} className="menu-category__title">
                        {grupo.categoria}
                      </h2>
                      <div className="menu-products">
                        {grupo.produtos.map((produto) => (
                          <ProductCard key={produto.id} produto={produto} />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            ) : (
              <div className="menu-empty">
                <SearchX aria-hidden="true" />
                <h3>Nenhum item por aqui</h3>
                <p>Tente outra palavra ou escolha a categoria “Todos”.</p>
                <button
                  type="button"
                  className="menu-catalog__reset"
                  onClick={() => {
                    setBusca('');
                    setCategoriaAtiva('Todos');
                  }}
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </>
        ) : null}

        <div className="menu-catalog__footer">
          <div>
            <p>O pedido e o pagamento são concluídos no iFood.</p>
            <p className="menu-catalog__updated">
              Preços consultados em{' '}
              <time dateTime={cardapioConferidoEm}>
                {cardapioConferidoEm.split('-').reverse().join('/')}
              </time>
              . Complementos e opções no iFood.
            </p>
            {!paginaCompleta ? (
              <Link href="/cardapio" className="menu-catalog__page-link">
                Abrir página do cardápio
              </Link>
            ) : null}
          </div>
          <FlowButton text="Ver cardápio no iFood" />
        </div>
      </div>
    </section>
  );
}

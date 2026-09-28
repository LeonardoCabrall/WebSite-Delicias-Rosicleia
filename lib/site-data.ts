import { produtos, type Produto } from './cardapio';

export { produtos, type Produto } from './cardapio';

export const IFOOD_LINK =
  'https://www.ifood.com.br/delivery/sao-paulo-sp/delicias-rosicleia-conjunto-habitacional-brigadeiro-faria-lima/47694be2-a16e-49d2-9ba6-fbdaa2efe570?utm_medium=share';

export const horarios = [
  { dia: 'Segunda-feira', faixas: ['11:00–15:00', '18:00–23:00'] },
  { dia: 'Terça-feira', faixas: ['11:10–19:04'] },
  { dia: 'Quarta-feira', faixas: ['11:00–15:00', '18:00–23:00'] },
  { dia: 'Quinta-feira', faixas: ['11:00–15:00', '18:00–23:00'] },
  { dia: 'Sexta-feira', faixas: ['11:00–15:00', '18:00–23:00'] },
  { dia: 'Sábado', faixas: ['11:00–15:00', '18:00–23:00'] },
  { dia: 'Domingo', faixas: ['11:00–15:00'] },
];

// Preencher somente quando o endereço oficial for confirmado.
export const endereco = '';

export function produtoEstaConfirmado(produto: Produto) {
  return (
    produto.nome.trim().length > 0 &&
    !produto.nome.startsWith('[') &&
    !produto.descricao.startsWith('[') &&
    Number.isFinite(produto.preco) &&
    produto.preco > 0
  );
}

export const produtosConfirmados = produtos.filter(produtoEstaConfirmado);

export const categorias = [
  'Todos',
  ...Array.from(
    new Set(produtosConfirmados.map((produto) => produto.categoria)),
  ),
];

export function nomeVisivel(produto: Produto) {
  return produto.nome.startsWith('[') ? 'Produto a confirmar' : produto.nome;
}

export function descricaoVisivel(produto: Produto) {
  return produto.descricao.startsWith('[')
    ? 'Descrição e disponibilidade serão atualizadas em breve.'
    : produto.descricao;
}

export function precoVisivel(preco: number) {
  if (preco <= 0) return 'Consulte no iFood';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(preco);
}

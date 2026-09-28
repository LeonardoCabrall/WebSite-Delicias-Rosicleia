// Cadastro manual da vitrine. Edite este arquivo para atualizar produtos e preços.
// Valores lidos no cardápio público do iFood; não há sincronização automática.
export const cardapioConferidoEm = '2026-09-10';

export interface Produto {
  id: string;
  nome: string;
  categoria: string;
  descricao: string;
  preco: number;
  imagem: string | null;
  servePessoas?: number;
  destaque?: boolean;
}

// Nomes e categorias preservam o cadastro de origem, inclusive as parmegianas
// repetidas com IDs diferentes. Campos não disponíveis não foram completados.
// Complementos, variações e disponibilidade devem ser consultados no iFood.
export const produtos: Produto[] = [
  {
    id: '28dcb6c9-f668-420a-859b-5e399b3b544e',
    nome: 'Largato',
    categoria: 'Pratos',
    descricao:
      'Arroz, feijão, salada de alface, cebola, tomate & largato bovino',
    preco: 38.99,
    imagem: '/produtos/ifood-largato.webp',
    servePessoas: 1,
  },
  {
    id: '7d3cc12c-8e8b-4ab8-ae23-452b718a5229',
    nome: 'Parmegiana de Frango',
    categoria: 'Pratos',
    descricao: '',
    preco: 37.99,
    imagem: '/produtos/ifood-parmegiana-frango.webp',
    servePessoas: 1,
  },
  {
    id: 'd363f641-274d-4a48-9f8c-69b6cf14a5c2',
    nome: 'Parmegiana de Carne',
    categoria: 'Pratos',
    descricao: '',
    preco: 37.99,
    imagem: '/produtos/ifood-parmegiana-carne.webp',
    servePessoas: 1,
  },
  {
    id: 'bd390084-ecb8-481a-9838-5de9a453d1bc',
    nome: 'Bife acebolado',
    categoria: 'Marmitex',
    descricao: '',
    preco: 38.99,
    imagem: null,
    servePessoas: 1,
  },
  {
    id: '0fab1391-97c2-4fcd-82ae-ceac5d8677a6',
    nome: 'Filé de frango',
    categoria: 'Marmitex',
    descricao: '',
    preco: 32.99,
    imagem: null,
    servePessoas: 1,
  },
  {
    id: '87252ed1-753e-4253-a81d-f8374fee3df6',
    nome: 'Bisteca suína',
    categoria: 'Marmitex',
    descricao: '',
    preco: 32.99,
    imagem: null,
    servePessoas: 1,
  },
  {
    id: '859f5dce-8280-4b1e-9d8e-80769237ae97',
    nome: 'Macarrão com molho branco e bacon',
    categoria: 'Marmitex',
    descricao: '',
    preco: 35.99,
    imagem: null,
  },
  {
    id: '1233d73b-8d0e-439b-b702-9bdb46568eb2',
    nome: 'Prato + refrigerante',
    categoria: 'Marmitex',
    descricao: '',
    preco: 45.1,
    imagem: null,
  },
  {
    id: 'f1502aac-6792-45c0-a9e8-742563f21f63',
    nome: 'Refrigerante Coca-Cola Lata 350ml',
    categoria: 'Bebidas',
    descricao: 'Lata 350ml',
    preco: 8.99,
    imagem: null,
  },
  {
    id: 'a9390494-ff32-443b-8d8b-b7ed8039d298',
    nome: 'Refrigerante Guaraná Antarctica Lata 350ml',
    categoria: 'Bebidas',
    descricao: 'Lata 350ml',
    preco: 8.99,
    imagem: null,
  },
  {
    id: '62086903-845e-43e5-b2d4-a13f8f20578b',
    nome: 'Agua Minalba Nat 510ml',
    categoria: 'Bebidas',
    descricao: '',
    preco: 8.99,
    imagem: null,
  },
  {
    id: 'a8407f92-d211-4a00-b643-6598c7f8b500',
    nome: 'Fanta Uva 350ml',
    categoria: 'Bebidas',
    descricao: 'Lata 350ml',
    preco: 7.99,
    imagem: null,
  },
  {
    id: '24e9acc7-16e8-49c2-a705-fc0695a0df32',
    nome: 'Frango a Passarinho',
    categoria: 'Porções',
    descricao: '',
    preco: 38.99,
    imagem: null,
    servePessoas: 2,
  },
  {
    id: '3f9744ca-56c7-4551-9b8b-ea573aed04ed',
    nome: 'Calabresa com fritas',
    categoria: 'Porções',
    descricao: '',
    preco: 45.99,
    imagem: null,
    servePessoas: 2,
  },
  {
    id: 'df90b169-7770-4dd4-aa2a-3601ce641b93',
    nome: 'Caldo de feijão',
    categoria: 'Caldos',
    descricao: '',
    preco: 22.99,
    imagem: null,
    servePessoas: 1,
  },
  {
    id: '6052cea9-77d8-4e80-a5ed-3b52d3df3e6e',
    nome: 'Caldo verde',
    categoria: 'Caldos',
    descricao: 'Couve, batata, calabresa, bacon',
    preco: 23.99,
    imagem: null,
    servePessoas: 1,
  },
  {
    id: 'ab437803-81f1-4d6f-9d84-422331a79563',
    nome: 'Caldo de mocotó',
    categoria: 'Caldos',
    descricao: 'Mandioca, calabresa, bacon, mocotó bovino e temperos naturais.',
    preco: 23.99,
    imagem: null,
  },
  {
    id: '01ac8580-3ec2-4065-9801-3ba2a38bd637',
    nome: 'Caldo de legumes',
    categoria: 'Caldos',
    descricao: 'Batata cenoura chuchu vagem abobora proteina patinho',
    preco: 26.99,
    imagem: null,
    servePessoas: 1,
  },
  {
    id: '36ceb268-6064-4a68-890b-f275b55b9f6d',
    nome: 'Abobora com gengibre',
    categoria: 'Caldos',
    descricao: '',
    preco: 23.99,
    imagem: null,
    servePessoas: 1,
  },
  {
    id: 'b70feb1c-ee49-4f53-8638-69f5e8aee39f',
    nome: 'Mix de saladas',
    categoria: 'Mix de saladas',
    descricao:
      'Isca de frango, alface, cenoura, tomate, cebola, rabanete e repolho',
    preco: 34.99,
    imagem: null,
  },
  {
    id: 'e5ef9801-f80a-4269-bf4d-86304804c228',
    nome: 'Mix de saladas',
    categoria: 'Mix de saladas',
    descricao: 'Isca de frango, alface, tomate, cebola roxa, milho e palmito.',
    preco: 34.99,
    imagem: null,
  },
  {
    id: 'a3e3c658-d6b1-4f1f-a703-d7167010bd1e',
    nome: 'Molho Rosé',
    categoria: 'Molhos',
    descricao: 'Molho para salada.',
    preco: 4.99,
    imagem: null,
  },
  {
    id: '01c116ec-7b9a-4f54-b89b-6150706c2617',
    nome: 'X-Salada',
    categoria: 'Ofertas (3)',
    descricao:
      'Pão brioche, carne suculenta, queijo cheddar, alface, tomate e cebola.',
    preco: 29.99,
    imagem: null,
    servePessoas: 1,
  },
  {
    id: '7b2eec0e-d908-4320-ace1-fa26dde2dbc5',
    nome: 'X salada com fritas',
    categoria: 'Ofertas (3)',
    descricao: '',
    preco: 35.99,
    imagem: null,
  },
  {
    id: 'b59bd091-6742-4b49-a98c-f0942c6b2b2b',
    nome: 'Parmegiana de Frango',
    categoria: 'Pratos (1)',
    descricao: '',
    preco: 37.99,
    imagem: null,
    servePessoas: 1,
  },
  {
    id: 'e02a4cc0-ed1b-43ad-a4ad-18891c79dee9',
    nome: 'Parmegiana de Carne',
    categoria: 'Pratos (1)',
    descricao: '',
    preco: 37.99,
    imagem: null,
    servePessoas: 1,
  },
];

# Delícias Rosicleia

Site institucional e cardápio digital da Delícias Rosicleia. A experiência apresenta a marca, permite explorar os produtos e encaminha os pedidos para o canal oficial da loja no iFood.

<p align="center">
  <img src="./public/site-preview.png" alt="Página inicial do site Delícias Rosicleia" width="100%" />
</p>

## O que você encontra

- Página inicial com apresentação da marca, produto em destaque e horários de funcionamento.
- Cardápio com 26 itens organizados em 9 categorias, busca e filtros.
- Links seguros para consultar disponibilidade, fazer pedidos e pagar pelo iFood.
- Layout adaptável a dispositivos móveis, navegação acessível e suporte à preferência por movimento reduzido.
- Metadados para compartilhamento e dados estruturados com os horários de funcionamento.

## Tecnologias

- React 19 e TypeScript
- Vinext e Vite
- Tailwind CSS 4
- Cloudflare Vite Plugin e Wrangler
- Lucide React

## Requisitos

- Node.js 22.13.0 ou superior
- npm

## Executar localmente

Instale as dependências:

```bash
npm ci
```

O arquivo `vite.config.ts` carrega `.openai/hosting.json`. Se esse arquivo não estiver disponível no clone, crie-o com os bindings desativados para desenvolvimento local:

```json
{
  "d1": null,
  "r2": null
}
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Publicar no Netlify

O deploy usa Next.js e o adaptador Next.js do Netlify. Para publicar pela primeira vez:

1. Envie o repositório para o GitHub.
2. No Netlify, escolha **Add new project** e conecte sua conta do GitHub.
3. Importe `LeonardoCabrall/WebSite-Delicias-Rosicleia` e escolha a branch `main`.
4. Confirme o deploy. O Netlify usa `netlify.toml`, instala as dependências e executa `npm run build:netlify`.

As configurações de build e a versão do Node já estão definidas no projeto. Depois da conexão inicial, novos commits enviados para `main` iniciam novos deploys automaticamente.

## Comandos

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento. |
| `npm run build` | Gera a versão de produção. |
| `npm run build:netlify` | Gera a versão Next.js usada no deploy do Netlify. |
| `npm start` | Executa a versão gerada com Wrangler; rode `npm run build` antes. |
| `npm test` | Executa os testes do site. Por padrão, espera o servidor em `http://localhost:3000`. |
| `npm run lint` | Verifica o código com Oxlint. |
| `npm run format` | Formata os arquivos com Oxfmt. |

Para rodar os testes, deixe `npm run dev` ativo em um terminal e execute `npm test` em outro.

## Conteúdo do site

Os produtos e seus dados ficam em `lib/cardapio.ts`. Horários de funcionamento e o link oficial de pedidos são mantidos em `lib/site-data.ts`.

Preços e disponibilidade podem mudar. O iFood é a fonte oficial para confirmar os dados e concluir cada pedido.

# Gestio (frontend)

Frontend do Gestio, plataforma de gerenciamento para pequenos comércios. Feito em React com JavaScript e Vite, com um componente por tela e CSS puro.

## Tecnologias

React, Vite, lucide-react (ícones) e Oxlint. A troca de telas é feita por estado no `App.jsx`.

## Pré-requisitos

Node.js (versão LTS recente) com npm. Confira com `node -v` e `npm -v`. O backend não é obrigatório para ver as telas: sem ele, tudo abre zerado.

## Instalação

**Do zero**, dentro da pasta `frontend`:

```bash
npm create vite@latest client-react -- --template react
```

Respostas do assistente: confirmar com `y`, escolher **Oxlint** e aceitar "Install with npm and start now". Depois, em um segundo terminal:

```bash
cd client-react
npm install lucide-react
```

Em `src`, apague `App.css` e o conteúdo de `assets`, e deixe o `index.css` apenas com:

```css
body {
  margin: 0;
}
```

**A partir do repositório:**

```bash
git clone <url-do-repositorio>
cd Gestio/frontend/client-react
npm install
```

## Como rodar

Dentro de `client-react`:

```bash
npm run dev
```

Abra o endereço mostrado, normalmente `http://localhost:5173/`. Para parar, `Ctrl + C`. Para gerar a versão de produção, `npm run build`.

## Estrutura

```
src/
  css/    Barra, Cadastro, Clientes, Dashboard, Produtos, Vendas (.css)
  img/    Logo_Gestio.png
  App.jsx  Barra.jsx  Cadastro.jsx  Clientes.jsx
  Dashboard.jsx  Login.jsx  Produtos.jsx  Vendas.jsx  main.jsx
```

## Como funciona

O `App.jsx` guarda a tela atual em um `useState` e passa a função `irPara` para cada tela. O texto do valor precisa ser idêntico no `App.jsx`, nas telas e no menu da `Barra.jsx`.

| Valor | Tela |
|---|---|
| `login` | Login |
| `cadastro` | Criar conta |
| `dashboard` | Painel Resumo |
| `venda` | Nova venda |
| `produtos` | Produtos e Estoque |
| `clientes` | Clientes e Fiado |

A `Barra.jsx` reúne a barra superior e o menu lateral e é usada por todas as telas internas, com `<Barra irPara={irPara} />`.

## Regras de dados

- Tudo vem do backend por `fetch`.
- Sem dado, aparece vazio ou zero (`R$ 0,00`, `0`, listas vazias).
- Sem conta logada, o ícone de conta não aparece.
- Fica fixo no código só a estrutura: títulos, botões e itens de menu.

## Backend

A URL fica na constante `API` de cada arquivo (`http://localhost:8000`). O backend precisa liberar CORS para `http://localhost:5173`.

| Rota | Recebe | Devolve |
|---|---|---|
| `POST /cadastro` | `usuario`, `senha` | 2xx |
| `POST /login` | `usuario`, `senha`, `lembrar` | 2xx |
| `GET /usuario` | | `{ nome, foto }` ou `{}` |
| `GET /painel` | | `{ cards: { ... } }` ou `{}` |
| `GET /estoque` | | `{ itens, valor_total, estoque_baixo }` ou `{}` |
| `GET /produtos?busca=` | | lista de `{ id, nome, preco }` ou `[]` |
| `POST /produtos` | `nome`, `categoria`, `preco`, `quantidade` | 2xx |
| `POST /vendas` | `itens` (`produto_id`, `quantidade`), `pagamento` | 2xx |
| `GET /clientes` | | lista de `{ id, nome, contato, limite, saldo_devedor }` ou `[]` |
| `POST /clientes` | `nome`, `contato`, `limite`, `fiado_inicial` | 2xx |
| `POST /clientes/{id}/abatimentos` | `valor` | 2xx |

O campo `pagamento` é `"dinheiro"` ou `"fiado"`. Cada card de `/painel` tem o formato `{ "valor": 26080, "variacao": 15 }`, com as chaves `faturamento_total`, `receita_liquida`, `total_estoque`, `clientes_ativos`, `vendas_hoje` e `total_receber`. As regras reais (total da venda, estoque, limites) devem ser validadas no backend.

## Testando sem backend

Troque o valor inicial no `App.jsx` para abrir a tela desejada e volte para `"login"` depois:

```jsx
const [tela, setTela] = useState("dashboard");
```

## Nova tela

1. Crie `src/NomeDaTela.jsx` e `src/css/NomeDaTela.css`, começando com `<Barra irPara={irPara} />`.
2. No `App.jsx`, importe e adicione `if (tela === "nome") { return <NomeDaTela irPara={setTela} />; }`.
3. Para ligar ao menu, acrescente `tela: "nome"` ao item na `Barra.jsx`.

## Problemas comuns

| Sintoma | Solução |
|---|---|
| `ENOENT ... package.json` | Rodar os comandos dentro de `client-react` |
| `Failed to resolve import` | Conferir o caminho e o nome do arquivo (maiúsculas contam) |
| Falta `lucide-react` | `npm install lucide-react` |
| Tela branca sem erro vermelho | Import faltando no `App.jsx`; ver o Console com `Ctrl + Shift + I` |
| Botão não troca de tela | Valor da tela diferente entre `App.jsx`, tela e `Barra.jsx` |
| Erro de CORS | Liberar `http://localhost:5173` no backend |
| Tudo zerado | Backend fora do ar ou rota diferente; ver a aba Rede |

## Pendências

Autenticação com token, arquivo único para a URL da API, seleção de cliente na venda no fiado, lista de produtos em Produtos e Estoque, tela de Histórico e Alertas, e busca e notificações da barra superior.
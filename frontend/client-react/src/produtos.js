import { api } from "./api";

export async function listarTodosProdutos() {
  const todos = [];
  let pagina = 1;
  let totalPaginas = 1;

  do {
    const resposta = await api(`/products?page=${pagina}&limit=100`);
    todos.push(...(resposta?.data || []));
    totalPaginas = resposta?.meta?.totalPages || 1;
    pagina += 1;
  } while (pagina <= totalPaginas);

  return todos;
}

export function resumoEstoque(lista) {
  let valorTotal = 0;
  let baixo = 0;

  for (const p of lista) {
    const quantidade = Number(p.quantidade_estoque) || 0;
    const custo = Number(p.preco_custo) || 0;
    const minimo = Number(p.estoque_minimo) || 0;

    valorTotal += quantidade * custo;
    if (quantidade <= minimo) baixo += 1;
  }

  return { itens: lista.length, valor_total: valorTotal, estoque_baixo: baixo };
}
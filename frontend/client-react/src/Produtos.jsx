import { useEffect, useState } from "react";
import { PackagePlus } from "lucide-react";
import Barra from "./Barra";
import { api } from "./api";
import { listarTodosProdutos, resumoEstoque } from "./produtos";
import "./css/Produtos.css";

const formVazio = {
  nome: "",
  preco_custo: "",
  preco_venda: "",
  quantidade_estoque: "",
  estoque_minimo: "",
};

function numero(valor) {
  const n = Number(valor);
  return (Number.isFinite(n) ? n : 0).toLocaleString("pt-BR");
}

function moeda(valor) {
  const n = Number(valor);
  return (Number.isFinite(n) ? n : 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function Produtos({ irPara }) {
  const [resumo, setResumo] = useState({});
  const [versao, setVersao] = useState(0);
  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState(formVazio);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        const lista = await listarTodosProdutos();
        if (ativo) setResumo(resumoEstoque(lista));
      } catch {
        if (ativo) setResumo({});
      }
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, [versao]);

  function abrirModal() {
    setForm(formVazio);
    setErro("");
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
  }

  function alterar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function salvar(e) {
    e.preventDefault();
    setErro("");
    setEnviando(true);

    try {
      await api("/products", {
        metodo: "POST",
        corpo: {
          nome: form.nome.trim(),
          preco_custo: Number(form.preco_custo),
          preco_venda: Number(form.preco_venda),
          quantidade_estoque: Number(form.quantidade_estoque || 0),
          estoque_minimo: Number(form.estoque_minimo || 0),
        },
      });

      setModalAberto(false);
      setVersao((v) => v + 1);
    } catch (err) {
      setErro(
        err.status
          ? err.message || "Não foi possível salvar o produto."
          : "Não foi possível conectar ao servidor."
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="prod">
      <Barra irPara={irPara} />

      <main className="prod-conteudo">
        <div className="prod-titulo">
          <h1>Produtos e Estoque</h1>
          <button className="prod-novo" onClick={abrirModal}>
            + Novo Produto
          </button>
        </div>

        <div className="prod-cards">
          <div className="prod-card">
            <p className="prod-card-titulo">Itens cadastrados</p>
            <p className="prod-card-valor">{numero(resumo.itens)} Produtos</p>
          </div>

          <div className="prod-card">
            <p className="prod-card-titulo">Valor Total em Estoque</p>
            <p className="prod-card-valor negrito">{moeda(resumo.valor_total)}</p>
          </div>

          <div className="prod-card">
            <p className="prod-card-titulo">Alerta de Estoque Baixo</p>
            <p className="prod-card-valor alerta">
              {numero(resumo.estoque_baixo)} Produto (s)
            </p>
          </div>
        </div>
      </main>

      {modalAberto && (
        <div className="prod-fundo" onClick={fecharModal}>
          <form
            className="prod-modal"
            onClick={(e) => e.stopPropagation()}
            onSubmit={salvar}
          >
            <h2>
              <PackagePlus size={26} /> Cadastrar Novo Produto
            </h2>
            <hr />

            <label htmlFor="nome">Nome do Produto</label>
            <input
              id="nome"
              name="nome"
              type="text"
              value={form.nome}
              onChange={alterar}
              required
            />

            <div className="prod-linha">
              <div>
                <label htmlFor="preco_custo">Preço de Custo</label>
                <input
                  id="preco_custo"
                  name="preco_custo"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.preco_custo}
                  onChange={alterar}
                  required
                />
              </div>

              <div>
                <label htmlFor="preco_venda">Preço de Venda</label>
                <input
                  id="preco_venda"
                  name="preco_venda"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.preco_venda}
                  onChange={alterar}
                  required
                />
              </div>
            </div>

            <div className="prod-linha">
              <div>
                <label htmlFor="quantidade_estoque">Quantidade de Estoque</label>
                <input
                  id="quantidade_estoque"
                  name="quantidade_estoque"
                  type="number"
                  min="0"
                  step="1"
                  value={form.quantidade_estoque}
                  onChange={alterar}
                />
              </div>

              <div>
                <label htmlFor="estoque_minimo">Estoque Mínimo</label>
                <input
                  id="estoque_minimo"
                  name="estoque_minimo"
                  type="number"
                  min="0"
                  step="1"
                  value={form.estoque_minimo}
                  onChange={alterar}
                />
              </div>
            </div>

            {erro && <p className="prod-erro">{erro}</p>}

            <div className="prod-botoes">
              <button type="button" className="prod-cancelar" onClick={fecharModal}>
                Cancelar
              </button>
              <button type="submit" className="prod-salvar" disabled={enviando}>
                {enviando ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Produtos;
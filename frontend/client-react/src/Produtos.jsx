import { useEffect, useState } from "react";
import { PackagePlus } from "lucide-react";
import Barra from "./Barra";
import "./css/Produtos.css";

const API = "http://localhost:8000";

const formVazio = { nome: "", categoria: "", preco: "", quantidade: "" };

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
        const resposta = await fetch(`${API}/estoque`);
        if (!resposta.ok) throw new Error();
        const json = await resposta.json();
        if (ativo) setResumo(json || {});
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
      const resposta = await fetch(`${API}/produtos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome.trim(),
          categoria: form.categoria.trim(),
          preco: Number(form.preco),
          quantidade: Number(form.quantidade),
        }),
      });

      if (!resposta.ok) throw new Error();

      setModalAberto(false);
      setVersao((v) => v + 1);
    } catch {
      setErro("Não foi possível salvar o produto.");
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
                <label htmlFor="categoria">Categoria</label>
                <input
                  id="categoria"
                  name="categoria"
                  type="text"
                  value={form.categoria}
                  onChange={alterar}
                />
              </div>

              <div>
                <label htmlFor="preco">Preço</label>
                <input
                  id="preco"
                  name="preco"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.preco}
                  onChange={alterar}
                  required
                />
              </div>
            </div>

            <label htmlFor="quantidade">Quantidade de Estoque</label>
            <input
              id="quantidade"
              name="quantidade"
              type="number"
              min="0"
              step="1"
              value={form.quantidade}
              onChange={alterar}
              required
            />

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
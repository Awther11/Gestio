import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import Barra from "./Barra";
import "./css/Clientes.css";

const API = "http://localhost:8000";

const formVazio = { nome: "", contato: "", limite: "", fiado: "" };

function moeda(valor) {
  const n = Number(valor);
  return (Number.isFinite(n) ? n : 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function CardCliente({ cliente, aoAbater }) {
  const saldo = Number(cliente.saldo_devedor) || 0;
  const limite = Number(cliente.limite) || 0;
  const disponivel = Math.max(limite - saldo, 0);
  const usado = limite > 0 ? Math.min(Math.round((saldo / limite) * 100), 100) : 0;

  return (
    <section className="cli-cliente">
      <div className="cli-cliente-topo">
        <h2>{cliente.nome}</h2>
        {cliente.contato && <span>{cliente.contato}</span>}
      </div>
      <hr />

      <div className="cli-valores">
        <div className="cli-valor">
          <p>Saldo Devedor</p>
          <strong>{moeda(saldo)}</strong>
        </div>
        <div className="cli-valor">
          <p>Limite Disponível</p>
          <strong>{moeda(disponivel)}</strong>
        </div>
      </div>

      <p className="cli-uso">Limite Utilizado ({usado}%)</p>
      <div className="cli-barra">
        <div className="cli-barra-cheia" style={{ width: `${usado}%` }} />
      </div>

      <button type="button" className="cli-abater" onClick={() => aoAbater(cliente)}>
        Abater
      </button>
    </section>
  );
}

function Clientes({ irPara }) {
  const [clientes, setClientes] = useState([]);
  const [versao, setVersao] = useState(0);

  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState(formVazio);
  const [erro, setErro] = useState("");

  const [abatendo, setAbatendo] = useState(null);
  const [valorAbater, setValorAbater] = useState("");
  const [erroAbater, setErroAbater] = useState("");

  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        const resposta = await fetch(`${API}/clientes`);
        if (!resposta.ok) throw new Error();
        const json = await resposta.json();
        if (ativo) setClientes(Array.isArray(json) ? json : []);
      } catch {
        if (ativo) setClientes([]);
      }
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, [versao]);

  const totalReceber = clientes.reduce(
    (soma, c) => soma + (Number(c.saldo_devedor) || 0),
    0
  );

  function abrirCadastro() {
    setForm(formVazio);
    setErro("");
    setModalAberto(true);
  }

  function alterar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function salvar(e) {
    e.preventDefault();
    setErro("");

    const limite = Number(form.limite);
    const fiado = Number(form.fiado) || 0;

    if (fiado > limite) {
      setErro("O fiado inicial não pode ser maior que o limite.");
      return;
    }

    setEnviando(true);

    try {
      const resposta = await fetch(`${API}/clientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome.trim(),
          contato: form.contato.trim(),
          limite,
          fiado_inicial: fiado,
        }),
      });

      if (!resposta.ok) throw new Error();

      setModalAberto(false);
      setVersao((v) => v + 1);
    } catch {
      setErro("Não foi possível salvar o cliente.");
    } finally {
      setEnviando(false);
    }
  }

  function abrirAbater(cliente) {
    setAbatendo(cliente);
    setValorAbater("");
    setErroAbater("");
  }

  async function abater(e) {
    e.preventDefault();
    setErroAbater("");
    setEnviando(true);

    try {
      const resposta = await fetch(`${API}/clientes/${abatendo.id}/abatimentos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ valor: Number(valorAbater) }),
      });

      if (!resposta.ok) throw new Error();

      setAbatendo(null);
      setVersao((v) => v + 1);
    } catch {
      setErroAbater("Não foi possível registrar o abatimento.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="cli">
      <Barra irPara={irPara} />

      <main className="cli-conteudo">
        <div className="cli-titulo">
          <h1>Cliente e Fiado</h1>
          <button className="cli-novo" onClick={abrirCadastro}>
            + Novo Cliente
          </button>
        </div>

        <div className="cli-resumo">
          <div className="cli-card">
            <p>Total a Receber</p>
            <strong>{moeda(totalReceber)}</strong>
          </div>
          <div className="cli-card">
            <p>Clientes na Carteira</p>
            <strong>{clientes.length}</strong>
          </div>
        </div>

        <div className="cli-lista">
          {clientes.length === 0 ? (
            <p className="cli-vazio">Nenhum cliente cadastrado.</p>
          ) : (
            clientes.map((c) => (
              <CardCliente key={c.id} cliente={c} aoAbater={abrirAbater} />
            ))
          )}
        </div>
      </main>

      {modalAberto && (
        <div className="cli-fundo" onClick={() => setModalAberto(false)}>
          <form
            className="cli-modal"
            onClick={(e) => e.stopPropagation()}
            onSubmit={salvar}
          >
            <h2>
              <Users size={26} /> Cadastrar Cliente
            </h2>
            <hr />

            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              name="nome"
              type="text"
              value={form.nome}
              onChange={alterar}
              required
            />

            <div className="cli-linha">
              <div>
                <label htmlFor="contato">Contato</label>
                <input
                  id="contato"
                  name="contato"
                  type="tel"
                  value={form.contato}
                  onChange={alterar}
                />
              </div>

              <div>
                <label htmlFor="limite">Limite Crédito R$</label>
                <input
                  id="limite"
                  name="limite"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.limite}
                  onChange={alterar}
                  required
                />
              </div>
            </div>

            <label htmlFor="fiado">Fiado Inicial R$</label>
            <input
              id="fiado"
              name="fiado"
              type="number"
              min="0"
              step="0.01"
              value={form.fiado}
              onChange={alterar}
            />

            {erro && <p className="cli-erro">{erro}</p>}

            <div className="cli-botoes">
              <button
                type="button"
                className="cli-cancelar"
                onClick={() => setModalAberto(false)}
              >
                Cancelar
              </button>
              <button type="submit" className="cli-salvar" disabled={enviando}>
                {enviando ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      )}

      {abatendo && (
        <div className="cli-fundo" onClick={() => setAbatendo(null)}>
          <form
            className="cli-modal"
            onClick={(e) => e.stopPropagation()}
            onSubmit={abater}
          >
            <h2>Abater Fiado</h2>
            <hr />

            <p className="cli-abater-info">
              {abatendo.nome}: saldo devedor de {moeda(abatendo.saldo_devedor)}
            </p>

            <label htmlFor="valor">Valor a abater R$</label>
            <input
              id="valor"
              type="number"
              min="0.01"
              step="0.01"
              max={Number(abatendo.saldo_devedor) || undefined}
              value={valorAbater}
              onChange={(e) => setValorAbater(e.target.value)}
              required
            />

            {erroAbater && <p className="cli-erro">{erroAbater}</p>}

            <div className="cli-botoes">
              <button
                type="button"
                className="cli-cancelar"
                onClick={() => setAbatendo(null)}
              >
                Cancelar
              </button>
              <button type="submit" className="cli-salvar" disabled={enviando}>
                {enviando ? "Salvando..." : "Abater"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Clientes;
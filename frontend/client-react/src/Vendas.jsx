import { useEffect, useState } from "react";
import { Search, ShoppingBag, Minus, Plus } from "lucide-react";
import { api } from "./api";
import Barra from "./Barra";
import "./css/Vendas.css";


const formas = [
  { valor: "dinheiro", texto: "Dinheiro" },
  { valor: "fiado", texto: "Fiado" },
];

function moeda(valor) {
  const n = Number(valor);
  return (Number.isFinite(n) ? n : 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function NovaVenda({ irPara }) {
  const [busca, setBusca] = useState("");
  const [encontrados, setEncontrados] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [pagamento, setPagamento] = useState("");
  const [aviso, setAviso] = useState(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const texto = busca.trim();
    if (!texto) return;

    let ativo = true;

    const espera = setTimeout(async () => {
      try {
        const resposta = await api(
          `/products?busca=${encodeURIComponent(texto)}&limit=8`
        );
        const lista = resposta?.data;
        if (ativo) setEncontrados(Array.isArray(lista) ? lista : []);
      } catch {
        if (ativo) setEncontrados([]);
      }
    }, 300);

    return () => {
      ativo = false;
      clearTimeout(espera);
    };
  }, [busca]);

  const resultados = busca.trim() ? encontrados : [];

  const total = carrinho.reduce((soma, i) => soma + i.preco * i.quantidade, 0);
  const podeFinalizar = carrinho.length > 0 && pagamento !== "" && !enviando;

  function adicionar(produto) {
    setAviso(null);
    setCarrinho((atual) => {
      const existe = atual.find((i) => i.id === produto.id);
      if (existe) {
        return atual.map((i) =>
          i.id === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i
        );
      }
      return [
        ...atual,
        {
          id: produto.id,
          nome: produto.nome,
          preco: Number(produto.preco_venda) || 0,
          quantidade: 1,
        },
      ];
    });
    setBusca("");
  }

  function alterar(id, delta) {
    setCarrinho((atual) =>
      atual
        .map((i) => (i.id === id ? { ...i, quantidade: i.quantidade + delta } : i))
        .filter((i) => i.quantidade > 0)
    );
  }

  async function finalizar() {
    setAviso(null);
    setEnviando(true);

    try {
      await api("/vendas", {
        metodo: "POST",
        corpo: {
          itens: carrinho.map((i) => ({
            produto_id: i.id,
            quantidade: i.quantidade,
          })),
          pagamento,
        },
      });

      setCarrinho([]);
      setPagamento("");
      setAviso({ texto: "Venda finalizada.", erro: false });
    } catch (err) {
      setAviso({
        texto: err.status
          ? "Não foi possível finalizar a venda."
          : "Não foi possível conectar ao servidor.",
        erro: true,
      });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="venda">
      <Barra irPara={irPara} />

      <main className="venda-conteudo">
        <h1>Nova Venda</h1>

        <section className="venda-bloco">
          <div className="venda-busca">
            <Search size={22} />
            <input
              type="text"
              placeholder="Nome do Produto"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          {resultados.length > 0 && (
            <ul className="venda-resultados">
              {resultados.map((p) => (
                <li key={p.id}>
                  <button type="button" onClick={() => adicionar(p)}>
                    <span>{p.nome}</span>
                    <span>{moeda(p.preco_venda)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="venda-bloco">
          <h2 className="venda-titulo">
            <ShoppingBag size={20} /> Carrinho da Venda
          </h2>
          <hr />

          <div className="venda-itens">
            {carrinho.length === 0 ? (
              <p className="venda-vazio">Carrinho Vazio</p>
            ) : (
              carrinho.map((i) => (
                <div className="venda-item" key={i.id}>
                  <div>
                    <p className="venda-item-nome">{i.nome}</p>
                    <p className="venda-item-preco">{moeda(i.preco)}</p>
                  </div>

                  <div className="venda-qtd">
                    <button type="button" onClick={() => alterar(i.id, -1)}>
                      <Minus size={14} />
                    </button>
                    <span>{i.quantidade}</span>
                    <button type="button" onClick={() => alterar(i.id, 1)}>
                      <Plus size={14} />
                    </button>
                  </div>

                  <strong>{moeda(i.preco * i.quantidade)}</strong>
                </div>
              ))
            )}
          </div>
          <hr />

          <h3 className="venda-subtitulo">Forma de Pagamento</h3>
          <div className="venda-pagamento">
            {formas.map((f) => (
              <button
                key={f.valor}
                type="button"
                className={pagamento === f.valor ? "ativo" : ""}
                onClick={() => setPagamento(f.valor)}
              >
                {f.texto}
              </button>
            ))}
          </div>
          <hr />

          <div className="venda-total">
            <span>Total a Pagar</span>
            <strong>{moeda(total)}</strong>
          </div>

          {aviso && (
            <p className={aviso.erro ? "venda-aviso erro" : "venda-aviso"}>
              {aviso.texto}
            </p>
          )}

          <button
            type="button"
            className="venda-finalizar"
            disabled={!podeFinalizar}
            onClick={finalizar}
          >
            Finalizar Venda
          </button>
        </section>
      </main>
    </div>
  );
}

export default NovaVenda;
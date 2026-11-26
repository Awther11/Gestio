import { useEffect, useState } from "react";
import { Box } from "lucide-react";
import { listarTodosProdutos } from "./produtos";
import Barra from "./Barra";
import "./css/Dashboard.css";


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

const cards = [
  { chave: "faturamento_total", titulo: "Faturamento Total", formato: moeda, sufixo: " vs mês anterior" },
  { chave: "receita_liquida", titulo: "Receita Líquida", formato: moeda },
  { chave: "total_estoque", titulo: "Total em Estoque", formato: (v) => `${numero(v)} Itens` },
  { chave: "clientes_ativos", titulo: "Clientes Ativos", formato: numero },
  { chave: "vendas_hoje", titulo: "Vendas Hoje", formato: moeda },
  { chave: "total_receber", titulo: "Total a Receber / Fiado", formato: moeda },
];

function Variacao({ valor, sufixo }) {
  if (typeof valor !== "number") return null;

  const sinal = valor > 0 ? "▲ +" : valor < 0 ? "▼ -" : "= ";
  const classe = valor < 0 ? "card-variacao negativo" : "card-variacao";

  return (
    <p className={classe}>
      {sinal}
      {Math.abs(valor)}%{sufixo || ""}
    </p>
  );
}

function Dashboard({ irPara }) {
  const [dados, setDados] = useState({});

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        const lista = await listarTodosProdutos();
        const total = lista.reduce(
          (soma, p) => soma + (Number(p.quantidade_estoque) || 0),
          0
        );
        if (ativo) setDados({ cards: { total_estoque: { valor: total } } });
      } catch {
        if (ativo) setDados({});
      }
    }
    
    carregar();
    return () => {
      ativo = false;
    };
  }, []);

  return (
    <div className="painel">
      <Barra irPara={irPara} />

      <main className="painel-conteudo">
        <div className="painel-titulo">
          <h1>Painel Resumo</h1>
          <div className="painel-acoes">
            <button className="btn-claro" onClick={() => irPara("produtos")}>
              <Box size={22} /> Gerenciar Produtos
            </button>
            <button className="btn-escuro" onClick={() => irPara("venda")}>
              + Nova Venda
            </button>
          </div>
        </div>

        <div className="painel-cards">
          {cards.map((c) => {
            const info = dados.cards?.[c.chave] || {};
            return (
              <div className="painel-card" key={c.chave}>
                <p className="card-titulo">{c.titulo}</p>
                <p className="card-valor">{c.formato(info.valor)}</p>
                <Variacao valor={info.variacao} sufixo={c.sufixo} />
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
import { api } from "./api";
import { useEffect, useState } from "react";
import {
  Menu,
  Search,
  Home,
  Bell,
  X,
  Box,
  ShoppingBag,
  Users,
} from "lucide-react";
import logo from "./img/Logo_Gestio.png";
import "./css/Barra.css";


function iniciais(nome) {
  if (!nome) return "";
  return nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

const menuPrincipal = [
  { nome: "Painel Resumo", icone: Home, tela: "dashboard" },
  { nome: "Produtos e estoque", icone: Box, tela: "produtos" },
  { nome: "Vendas", icone: ShoppingBag, tela: "venda" },
];

const menuRelatorios = [
  { nome: "Clientes e Fiado", icone: Users, tela: "clientes" },
  { nome: "Histórico e Alertas", icone: Bell },
];


function ItemMenu({ item, aoClicar }) {
  const Icone = item.icone;
  return (
    <button className="painel-item" onClick={() => aoClicar(item)}>
      {item.nome}
      <Icone size={22} />
    </button>
  );
}

function Barra({ irPara }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [usuario, setUsuario] = useState({});

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        const resposta = await fetch(`${API}/usuario`);
        if (!resposta.ok) throw new Error();
        const json = await resposta.json();
        if (ativo) setUsuario(json || {});
      } catch {
        if (ativo) setUsuario({});
      }
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, []);

  const nome = usuario.nome || "";
  const foto = usuario.foto || "";
  const logado = Boolean(nome || foto);

  function abrir(item) {
    setMenuAberto(false);
    if (item.tela) irPara(item.tela);
  }

  return (
    <>
      <header className="painel-topo">
        <button className="painel-icone" onClick={() => setMenuAberto(true)}>
          <Menu size={28} />
        </button>

        <div className="painel-busca">
          <Search size={20} />
          <input type="text" placeholder="Buscar tarefas, produtos ou clientes" />
        </div>

        <button className="painel-icone" onClick={() => irPara("dashboard")}>
          <Home size={30} />
        </button>

        {logado && (
          <div className="painel-usuario">
            <button className="painel-icone">
              <Bell size={28} />
            </button>
            {foto ? (
              <img className="painel-avatar" src={foto} alt={nome} />
            ) : (
              <div className="painel-avatar">{iniciais(nome)}</div>
            )}
            {nome && <span>{nome}</span>}
          </div>
        )}
      </header>

      {menuAberto && (
        <div className="painel-fundo" onClick={() => setMenuAberto(false)} />
      )}

      <aside className={menuAberto ? "painel-menu aberto" : "painel-menu"}>
        <div className="menu-topo">
          <img src={logo} alt="Logo Gestio" />
          <span className="menu-nome">
            Gest<span>io</span>
          </span>
          <button className="menu-fechar" onClick={() => setMenuAberto(false)}>
            <X size={28} />
          </button>
        </div>

        {menuPrincipal.map((item) => (
          <ItemMenu key={item.nome} item={item} aoClicar={abrir} />
        ))}

        <p className="menu-secao">Relatórios & Gestão</p>

        {menuRelatorios.map((item) => (
          <ItemMenu key={item.nome} item={item} aoClicar={abrir} />
        ))}
      </aside>
    </>
  );
}

export default Barra;
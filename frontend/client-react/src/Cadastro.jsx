import { useState } from "react";
import logo from "./img/Logo_Gestio.png";
import "./css/Cadastro.css";
import { api } from "./api";

function Cadastro({ irParaLogin }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviar(e) {
    e.preventDefault();

    if (senha !== confirmar) {
      setErro("As senhas não coincidem.");
      return;
    }

    setErro("");
    setEnviando(true);

    try {
      await api("/auth/register", {
        metodo: "POST",
        corpo: { nome: nome.trim(), email: email.trim(), senha },
      });

      irParaLogin();
    } catch (err) {
      setErro(
        err.status
          ? err.message || "Não foi possível criar a conta."
          : "Não foi possível conectar ao servidor."
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="cadastro">
      <img className="cadastro-logo" src={logo} alt="Logo Gestio" />
      <h1 className="cadastro-nome">
        Gest<span>io</span>
      </h1>
      <p className="cadastro-slogan">uma plataforma de gerenciamento</p>

      <form className="cadastro-card" onSubmit={enviar}>
        <h2>Criar Conta</h2>
        <p className="cadastro-sub">Realize um cadastro simples</p>

        <label htmlFor="nome">Nome</label>
        <input
          id="nome"
          type="text"
          autoComplete="name"
          minLength={2}
          maxLength={100}
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="senha">Senha</label>
        <input
          id="senha"
          type="password"
          autoComplete="new-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <label htmlFor="confirmar">Confirmar Senha</label>
        <input
          id="confirmar"
          type="password"
          autoComplete="new-password"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
          required
        />

        {erro && <p className="cadastro-erro">{erro}</p>}

        <button type="submit" disabled={enviando}>
          {enviando ? "Criando..." : "Criar Conta"}
        </button>

        <p className="cadastro-rodape">
          Já possui conta?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              irParaLogin();
            }}
          >
            Entrar
          </a>
        </p>
      </form>
    </div>
  );
}

export default Cadastro;
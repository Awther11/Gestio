import { useState } from "react";
import logo from "./img/Logo_Gestio.png";
import "./css/Cadastro.css";

function Cadastro({ irParaLogin }) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [erro, setErro] = useState("");

  async function enviar(e) {
    e.preventDefault();

    if (senha !== confirmar) {
      setErro("As senhas não coincidem.");
      return;
    }

    setErro("");

    try {
      const resposta = await fetch("http://localhost:8000/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, senha }),
      });

      if (!resposta.ok) throw new Error();

      irParaLogin();
    } catch {
      setErro("Não foi possível criar a conta.");
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

        <label htmlFor="usuario">Usuário</label>
        <input
          id="usuario"
          type="text"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        />

        <label htmlFor="senha">Senha</label>
        <input
          id="senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <label htmlFor="confirmar">Confirmar Senha</label>
        <input
          id="confirmar"
          type="password"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
          required
        />

        {erro && <p className="cadastro-erro">{erro}</p>}

        <button type="submit">Criar Conta</button>

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
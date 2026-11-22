import { useState } from "react";
import logo from "./img/Logo_Gestio.png";
import "./css/Cadastro.css";

function Login({ irParaCadastro, aoEntrar }) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(false);
  const [erro, setErro] = useState("");

  async function enviar(e) {
    e.preventDefault();
    setErro("");

    try {
      const resposta = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, senha, lembrar }),
      });

      if (!resposta.ok) throw new Error();

      aoEntrar();
    } catch {
      setErro("Usuário ou senha inválidos.");
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
        <h2>Acessar Conta</h2>
        <p className="cadastro-sub">Insira suas credenciais para continuar</p>

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

        <label className="cadastro-lembrar">
          <input
            type="checkbox"
            checked={lembrar}
            onChange={(e) => setLembrar(e.target.checked)}
          />
          Lembrar desse dispositivo
        </label>

        {erro && <p className="cadastro-erro">{erro}</p>}

        <button type="submit">Entrar</button>

        <p className="cadastro-rodape">
          Não possui conta?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              irParaCadastro();
            }}
          >
            Cadastrar
          </a>
        </p>
      </form>
    </div>
  );
}

export default Login;
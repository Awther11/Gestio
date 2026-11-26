import { useState } from "react";
import logo from "./img/Logo_Gestio.png";
import "./css/Cadastro.css";
import { api, salvarToken } from "./api";

function Login({ irParaCadastro, aoEntrar }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(false);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setErro("");
    setEnviando(true);

    try {
      const { token } = await api("/auth/login", {
        metodo: "POST",
        corpo: { email: email.trim(), senha },
      });

      salvarToken(token, lembrar);
      aoEntrar();
    } catch (err) {
      setErro(
        err.status
          ? err.message || "Não foi possível entrar."
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
        <h2>Acessar Conta</h2>
        <p className="cadastro-sub">Insira suas credenciais para continuar</p>

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
          autoComplete="current-password"
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

        <button type="submit" disabled={enviando}>
          {enviando ? "Entrando..." : "Entrar"}
        </button>

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
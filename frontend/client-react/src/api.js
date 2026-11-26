const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
const CHAVE_TOKEN = "gestio_token";

export class ErroApi extends Error {
  constructor(status, mensagem) {
    super(mensagem);
    this.status = status;
  }
}

export function limparToken() {
  localStorage.removeItem(CHAVE_TOKEN);
  sessionStorage.removeItem(CHAVE_TOKEN);
}

export function salvarToken(token, lembrar) {
  limparToken();
  const armazenamento = lembrar ? localStorage : sessionStorage;
  armazenamento.setItem(CHAVE_TOKEN, token);
}

export function lerToken() {
  return (
    localStorage.getItem(CHAVE_TOKEN) ||
    sessionStorage.getItem(CHAVE_TOKEN) ||
    ""
  );
}

export async function api(caminho, { metodo = "GET", corpo } = {}) {
  const token = lerToken();

  const resposta = await fetch(`${BASE}${caminho}`, {
    method: metodo,
    headers: {
      ...(corpo ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: corpo ? JSON.stringify(corpo) : undefined,
  });

  const texto = await resposta.text();
  let dados = null;

  try {
    dados = texto ? JSON.parse(texto) : null;
  } catch {
    dados = null;
  }

  if (!resposta.ok) {
    const mensagem = dados?.message || dados?.error || dados?.erro || "";
    throw new ErroApi(
      resposta.status,
      typeof mensagem === "string" ? mensagem : ""
    );
  }

  return dados;
}
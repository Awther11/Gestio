import { useState } from "react";
import Login from "./Login";
import Cadastro from "./Cadastro";
import Dashboard from "./Dashboard";
import Vendas from "./Vendas";
// import Produtos from "./Produtos";
import Clientes from "./Clientes";
import Produtos from "./Produtos.jsx";
import { listarTodosProdutos, resumoEstoque } from "./produtos";

function App() {
  const [tela, setTela] = useState("login");  // caso queira testar uma tela diferente, basta alterar o valor para o nome da tela desejada (por padrão, está login)

  if (tela === "dashboard") {
    return <Dashboard irPara={setTela} />;
  }

  if (tela === "venda") {
    return <Vendas irPara={setTela} />;
  }

  if (tela === "produtos") {
    return <Produtos irPara={setTela} />;
  }

  if (tela === "clientes") {
    return <Clientes irPara={setTela} />;
  }

  if (tela === "cadastro") {
    return <Cadastro irParaLogin={() => setTela("login")} />;
  }

  return (
    <Login
      irParaCadastro={() => setTela("cadastro")}
      aoEntrar={() => setTela("dashboard")}
    />
  );
}

export default App;
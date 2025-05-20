require("dotenv").config(); 
const db = require("./db");
const express = require("express");

const app = express();
const port = process.env.PORT;

app.use(express.json());

// POST: inserir cliente
app.post("/client", async (req, res) => {
  const { cpf, nome, email, idade, profissao } = req.body;

  try {
    const conn = await db();
    await conn.query(
      "INSERT INTO client (cpf, nome, email, idade, profissao) VALUES ($1, $2, $3, $4, $5)",
      [cpf, nome, email, idade, profissao]
    );
    res.status(201).send("Cliente inserido com sucesso.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao inserir cliente.");
  }
});

// GET: buscar todos os clientes
app.get("/client", async (req, res) => {
  try {
    const conn = await db();
    const result = await conn.query("SELECT * FROM client");
    res.json(result.rows);
  } catch (err) {
    console.error("ERRO AO BUSCAR CLIENTES:", err.message);
    res.status(500).send("Erro ao buscar clientes: " + err.message);
  }
});

// GET: buscar cliente por ID
app.get("/client/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const conn = await db();
    const result = await conn.query("SELECT * FROM client WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).send("Cliente não encontrado.");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("ERRO AO BUSCAR CLIENTE:", err.message);
    res.status(500).send("Erro ao buscar cliente: " + err.message);
  }
});

app.listen(port, () => {
  console.log("Backend Rodando na porta " + port);
});

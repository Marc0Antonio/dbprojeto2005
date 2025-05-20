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
    console.error(err);
    res.status(500).send("Erro ao buscar clientes.");
  }
});

app.listen(port, () => {
  console.log("Backend Rodando na porta " + port);
});

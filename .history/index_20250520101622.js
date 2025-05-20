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


// PATCH: atualizar cliente por ID
app.patch("/client/:id", async (req, res) => {
  const { id } = req.params;
  const { cpf, nome, email, idade, profissao } = req.body;

  try {
    const conn = await db();
    
    // Verificar se o cliente existe
    const checkClient = await conn.query("SELECT * FROM client WHERE id = $1", [id]);
    if (checkClient.rows.length === 0) {
      return res.status(404).send("Cliente não encontrado.");
    }

    // Construir query dinâmica para atualizar apenas os campos fornecidos
    let updateFields = [];
    let values = [];
    let paramCount = 1;

    if (cpf !== undefined) { updateFields.push(`cpf = $${paramCount++}`); values.push(cpf); }
    if (nome !== undefined) { updateFields.push(`nome = $${paramCount++}`); values.push(nome); }
    if (email !== undefined) { updateFields.push(`email = $${paramCount++}`); values.push(email); }
    if (idade !== undefined) { updateFields.push(`idade = $${paramCount++}`); values.push(idade); }
    if (profissao !== undefined) { updateFields.push(`profissao = $${paramCount++}`); values.push(profissao); }

    if (updateFields.length === 0) {
      return res.status(400).send("Nenhum campo para atualizar foi fornecido.");
    }

    values.push(id);
    const updateQuery = `UPDATE client SET ${updateFields.join(", ")} WHERE id = $${paramCount}`;
    
    await conn.query(updateQuery, values);
    res.send("Cliente atualizado com sucesso.");
  } catch (err) {
    console.error("ERRO AO ATUALIZAR CLIENTE:", err.message);
    res.status(500).send("Erro ao atualizar cliente: " + err.message);
  }
});

app.listen(port, () => {
  console.log("Backend Rodando na porta " + port);
});

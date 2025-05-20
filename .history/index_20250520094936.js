require("dotenv").config(); 

const db = require("./db");

const port = process.env.PORT;

const express = require('express');

const app = express();

app.use(express.json());


// Rota para inserir clientes


app.listen(port);

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
  

console.log("Backend Rodando!")
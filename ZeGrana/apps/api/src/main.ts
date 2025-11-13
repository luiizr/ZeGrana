import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

/*
=============================
Iniciando o servidor Express
    e serviços de API
=============================
*/

const porta = process.env.PORTA_API || 3000
const app = express();

// Configuração do CORS
app.use(cors({
  origin: '*', // Somente em desenvolvimento. Em produção, especificar domínios permitidos
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(porta, () => {
  console.log(`Servidor API rodando na porta ${porta} \n http://localhost:${porta}`);
});

/*
=============================
  Verificando conexão com o
      banco de dados
=============================
*/


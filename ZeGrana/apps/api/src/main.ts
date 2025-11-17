import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

import { db, ProvedorPostgreSQL } from '@ze-grana/externals';


import salvarUsuarioController from '../src/api/salvarUsuarioController';

import { salvarUsuario } from '@ze-grana/core';
import { senhaCripto } from '@ze-grana/externals';
import { ColecaoUsuario } from '@ze-grana/adapters';
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
db.connect()
  .then((obj) => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    console.log(`Banco: ${process.env["DB_NAME"]} em ${process.env["DB_HOST"]}:${process.env["DB_PORT"]}`);
    obj.done(); // libera a conexão
  })
  .catch((error) => {
      console.error("❌ Erro ao conectar ao banco de dados PostgreSQL:");
      console.error(error.message);
      console.error("\n🔍 Verifique se:");
      console.error("  - O PostgreSQL está rodando");
      console.error("  - As credenciais no .env estão corretas");
      console.error("  - O banco de dados existe");
      console.error(" === Após aplicar as modificações, reinicie o projeto! === ");
  });

/*
=============================
        Adaptadores
=============================
*/
const provedorPG = new ProvedorPostgreSQL()
const repoUsuario = new ColecaoUsuario(provedorPG)
const provCripto = new senhaCripto()

const cduSalvarUsuario = new salvarUsuario(repoUsuario)


/*
=============================
       Rotas Abertas
=============================
*/

new salvarUsuarioController(app, provCripto, cduSalvarUsuario )

/*
=============================
      Rotas Protegidas
=============================
*/
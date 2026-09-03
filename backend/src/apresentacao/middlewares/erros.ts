import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { ErroAplicacao } from '../../dominio/erros/erro-aplicacao.js';
export const tratarErros: ErrorRequestHandler = (erro, _req, res, _next) => {
  if (erro instanceof ZodError) { res.status(422).json({ message: 'Revise os campos informados.', fields: erro.flatten().fieldErrors }); return; }
  if (erro instanceof ErroAplicacao) { res.status(erro.status).json({ message: erro.message }); return; }
  console.error(erro);
  res.status(500).json({ message: 'Não foi possível realizar a operação.' });
};

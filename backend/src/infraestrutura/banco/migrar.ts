import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { banco } from './conexao.js';

export async function executarMigracoes(): Promise<void> {
  await banco.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
  const pasta = join(process.cwd(), 'backend/src/infraestrutura/banco/migracoes');
  for (const arquivo of (await readdir(pasta)).filter((nome) => nome.endsWith('.sql')).sort()) {
    await banco.query(await readFile(join(pasta, arquivo), 'utf8'));
  }
}
if (process.argv[1]?.includes('migrar')) executarMigracoes().finally(() => banco.end());

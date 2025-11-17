// Expose externals used by the API and other libs
export { default as db } from './lib/db/postgres/db';
export { default as jwt } from './lib/jwt/jwt';
export { default as senhaCripto } from './lib/auth/senhaCripto';
export { default as ProvedorPostgreSQL } from './lib/db/postgres/RepositorioUsuarioPG';

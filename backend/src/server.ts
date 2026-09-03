import 'dotenv/config';
import cors from 'cors'; import express from 'express'; import session from 'express-session'; import connectPgSimple from 'connect-pg-simple'; import helmet from 'helmet';
import { banco } from './infraestrutura/banco/conexao.js'; import { executarMigracoes } from './infraestrutura/banco/migrar.js'; import { apiRoutes } from './apresentacao/routes/api-routes.js'; import { tratarErros } from './apresentacao/middlewares/erros.js';
const app = express(); const PgStore = connectPgSimple(session);
app.set('trust proxy', 1); app.use(helmet({ crossOriginResourcePolicy: false })); app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:4200', credentials: true })); app.use(express.json({ limit: '20kb' }));
app.use(session({ store: new PgStore({ pool: banco, tableName: 'sessoes', createTableIfMissing: true }), name: 'zegrana.sid', secret: process.env.SESSION_SECRET ?? 'desenvolvimento-inseguro-nao-use-em-producao', resave: false, saveUninitialized: false, cookie: { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 1000 * 60 * 60 * 24 * 7 } }));
app.use('/api', apiRoutes); app.use(tratarErros);
const porta = Number(process.env.PORT ?? 3000); executarMigracoes().then(() => app.listen(porta, () => console.log(`API em http://localhost:${porta}/api`))).catch((erro) => { console.error('Falha nas migrations', erro); process.exit(1); });

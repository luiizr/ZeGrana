import { Pool } from 'pg';
import 'dotenv/config';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL não configurada.');
export const banco = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined });

# 🚀 Próximos Passos - Implementação do Sistema Financeiro

Você agora tem toda a estrutura core do sistema financeiro. Aqui está um guia prático do que fazer a seguir:

## 1️⃣ Implementar Providers (Adapters) - **PRIORIDADE MÁXIMA**

Os services estão prontos, mas precisam de implementações concretas dos providers para persistir dados.

### Opção A: PostgreSQL (Recomendado para produção)

Criar em `libs/src/adapters/financeiro/postgres/`:

```typescript
// PgContaProvider.ts
export class PgContaProvider implements IContaProvider {
  constructor(private pool: Pool) {}
  
  async criar(dados: CriarContaDTO): Promise<Conta> {
    const query = `
      INSERT INTO contas (id, usuario_id, banco_id, nome, tipo, moeda, saldo, ativa)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    // implementação...
  }
  
  // ... outros métodos
}
```

**Providers a implementar**:
- ✅ `PgBancoProvider.ts`
- ✅ `PgContaProvider.ts`
- ✅ `PgCartaoProvider.ts`
- ✅ `PgCategoriaProvider.ts`
- ✅ `PgTransacaoProvider.ts`
- ✅ `PgEmprestimoProvider.ts`
- ✅ `PgOrcamentoProvider.ts`

### Opção B: In-Memory (Para testes rápidos)

Criar em `libs/src/adapters/financeiro/inMemory/`:

```typescript
export class InMemoryContaProvider implements IContaProvider {
  private contas: Map<string, Conta> = new Map();
  
  async criar(dados: CriarContaDTO): Promise<Conta> {
    const id = uuidv4();
    const conta: Conta = {
      id,
      ...dados,
      saldo: dados.saldoInicial || createMoney('0.00'),
      ativa: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.contas.set(id, conta);
    return conta;
  }
  
  // ... outros métodos
}
```

## 2️⃣ Criar Migrations de Banco de Dados

Se usar PostgreSQL, criar migrations:

```sql
-- migrations/001_create_bancos.sql
CREATE TABLE bancos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  codigo VARCHAR(10),
  pais VARCHAR(3) DEFAULT 'BRA',
  logo_url TEXT,
  suporta_integracao BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- migrations/002_create_contas.sql
CREATE TABLE contas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  banco_id UUID REFERENCES bancos(id) ON DELETE SET NULL,
  nome VARCHAR(255) NOT NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('corrente', 'poupanca', 'investimento', 'dinheiro')),
  moeda VARCHAR(3) DEFAULT 'BRL',
  numero_mascarado VARCHAR(50),
  saldo_amount DECIMAL(15, 2) DEFAULT 0,
  saldo_currency VARCHAR(3) DEFAULT 'BRL',
  ativa BOOLEAN DEFAULT true,
  cor VARCHAR(7),
  icone VARCHAR(50),
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_contas_usuario ON contas(usuario_id);
CREATE INDEX idx_contas_banco ON contas(banco_id);

-- migrations/003_create_categorias.sql
CREATE TABLE categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  categoria_pai_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
  cor VARCHAR(7),
  icone VARCHAR(50),
  ativa BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_categorias_usuario ON categorias(usuario_id);
CREATE INDEX idx_categorias_pai ON categorias(categoria_pai_id);

-- migrations/004_create_transacoes.sql
CREATE TABLE transacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  conta_id UUID NOT NULL REFERENCES contas(id) ON DELETE CASCADE,
  cartao_id UUID REFERENCES cartoes(id) ON DELETE SET NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('receita', 'despesa', 'transferencia')),
  valor_amount DECIMAL(15, 2) NOT NULL,
  valor_currency VARCHAR(3) DEFAULT 'BRL',
  moeda VARCHAR(3) DEFAULT 'BRL',
  data DATE NOT NULL,
  data_lancamento DATE,
  descricao TEXT NOT NULL,
  categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
  favorecido_id UUID,
  tags TEXT[],
  status VARCHAR(20) NOT NULL DEFAULT 'confirmada' CHECK (status IN ('pendente', 'confirmada', 'reconciliada', 'cancelada')),
  referencia VARCHAR(255),
  transacao_relacionada_id UUID REFERENCES transacoes(id) ON DELETE SET NULL,
  parcela_id UUID,
  numero_parcela INTEGER,
  total_parcelas INTEGER,
  observacoes TEXT,
  anexos TEXT[],
  recorrente BOOLEAN DEFAULT false,
  recorrente_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_transacoes_usuario ON transacoes(usuario_id);
CREATE INDEX idx_transacoes_conta ON transacoes(conta_id);
CREATE INDEX idx_transacoes_data ON transacoes(data);
CREATE INDEX idx_transacoes_categoria ON transacoes(categoria_id);
CREATE INDEX idx_transacoes_status ON transacoes(status);
CREATE INDEX idx_transacoes_referencia ON transacoes(referencia);

-- migrations/005_create_transacoes_divisoes.sql
CREATE TABLE transacoes_divisoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transacao_id UUID NOT NULL REFERENCES transacoes(id) ON DELETE CASCADE,
  valor_amount DECIMAL(15, 2) NOT NULL,
  valor_currency VARCHAR(3) DEFAULT 'BRL',
  categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
  observacao TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_divisoes_transacao ON transacoes_divisoes(transacao_id);

-- migrations/006_create_cartoes.sql
CREATE TABLE cartoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  conta_id UUID REFERENCES contas(id) ON DELETE SET NULL,
  nome VARCHAR(255) NOT NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('credito', 'debito', 'multiplo')),
  bandeira VARCHAR(20) NOT NULL,
  ultimos_4_digitos VARCHAR(4),
  token TEXT,
  limite_credito_amount DECIMAL(15, 2),
  limite_credito_currency VARCHAR(3),
  limite_disponivel_amount DECIMAL(15, 2),
  limite_disponivel_currency VARCHAR(3),
  dia_vencimento INTEGER CHECK (dia_vencimento BETWEEN 1 AND 31),
  dia_fechamento INTEGER CHECK (dia_fechamento BETWEEN 1 AND 31),
  melhor_dia_compra INTEGER,
  cor VARCHAR(7),
  ativo BOOLEAN DEFAULT true,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cartoes_usuario ON cartoes(usuario_id);

-- migrations/007_create_emprestimos.sql
CREATE TABLE emprestimos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  valor_principal_amount DECIMAL(15, 2) NOT NULL,
  valor_principal_currency VARCHAR(3) DEFAULT 'BRL',
  taxa_juros_anual DECIMAL(5, 2) NOT NULL,
  tipo_amortizacao VARCHAR(10) NOT NULL CHECK (tipo_amortizacao IN ('PRICE', 'SAC', 'SAM')),
  data_inicio DATE NOT NULL,
  prazo_meses INTEGER NOT NULL,
  valor_total_amount DECIMAL(15, 2) NOT NULL,
  valor_total_currency VARCHAR(3) DEFAULT 'BRL',
  saldo_devedor_amount DECIMAL(15, 2) NOT NULL,
  saldo_devedor_currency VARCHAR(3) DEFAULT 'BRL',
  ativo BOOLEAN DEFAULT true,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_emprestimos_usuario ON emprestimos(usuario_id);

-- migrations/008_create_parcelas.sql
CREATE TABLE parcelas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emprestimo_id UUID NOT NULL REFERENCES emprestimos(id) ON DELETE CASCADE,
  numero INTEGER NOT NULL,
  data_vencimento DATE NOT NULL,
  valor_amount DECIMAL(15, 2) NOT NULL,
  valor_currency VARCHAR(3) DEFAULT 'BRL',
  valor_principal_amount DECIMAL(15, 2) NOT NULL,
  valor_principal_currency VARCHAR(3) DEFAULT 'BRL',
  valor_juros_amount DECIMAL(15, 2) NOT NULL,
  valor_juros_currency VARCHAR(3) DEFAULT 'BRL',
  data_pagamento DATE,
  valor_pago_amount DECIMAL(15, 2),
  valor_pago_currency VARCHAR(3),
  status VARCHAR(20) NOT NULL DEFAULT 'aberta' CHECK (status IN ('aberta', 'paga', 'atrasada', 'cancelada')),
  transacao_id UUID REFERENCES transacoes(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_parcelas_emprestimo ON parcelas(emprestimo_id);
CREATE INDEX idx_parcelas_vencimento ON parcelas(data_vencimento);

-- migrations/009_create_orcamentos.sql
CREATE TABLE orcamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  categoria_id UUID NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  periodo VARCHAR(20) NOT NULL CHECK (periodo IN ('semanal', 'mensal', 'trimestral', 'semestral', 'anual')),
  valor_planejado_amount DECIMAL(15, 2) NOT NULL,
  valor_planejado_currency VARCHAR(3) DEFAULT 'BRL',
  valor_gasto_amount DECIMAL(15, 2) DEFAULT 0,
  valor_gasto_currency VARCHAR(3) DEFAULT 'BRL',
  percentual_utilizado DECIMAL(5, 2) DEFAULT 0,
  inicio_periodo DATE NOT NULL,
  fim_periodo DATE NOT NULL,
  alertar BOOLEAN DEFAULT false,
  percentual_alerta INTEGER CHECK (percentual_alerta BETWEEN 1 AND 100),
  cor VARCHAR(7),
  ativo BOOLEAN DEFAULT true,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orcamentos_usuario ON orcamentos(usuario_id);
CREATE INDEX idx_orcamentos_categoria ON orcamentos(categoria_id);
CREATE UNIQUE INDEX idx_orcamentos_categoria_unico ON orcamentos(categoria_id) WHERE ativo = true;
```

## 3️⃣ Configurar Injeção de Dependência

No seu arquivo `main.ts` ou módulo de inicialização:

```typescript
import { Pool } from 'pg';
import {
  ContaService,
  TransacaoService,
  CartaoService,
  // ... outros services
} from '@ze-grana/core/financeiro';

import {
  PgContaProvider,
  PgTransacaoProvider,
  // ... outros providers
} from '@ze-grana/adapters/financeiro/postgres';

// Configurar conexão
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Instanciar providers
const contaProvider = new PgContaProvider(pool);
const transacaoProvider = new PgTransacaoProvider(pool);
const cartaoProvider = new PgCartaoProvider(pool);
// ... outros providers

// Instanciar services
const contaService = new ContaService(contaProvider);
const transacaoService = new TransacaoService(transacaoProvider, contaProvider);
const cartaoService = new CartaoService(cartaoProvider);
// ... outros services

// Exportar ou registrar em DI container
export const services = {
  conta: contaService,
  transacao: transacaoService,
  cartao: cartaoService,
  // ...
};
```

## 4️⃣ Criar Endpoints da API

Em `apps/api/src/` criar controllers/routes:

```typescript
// apps/api/src/controllers/transacao.controller.ts
import { Request, Response } from 'express';
import { services } from '../services';

export class TransacaoController {
  async criar(req: Request, res: Response) {
    try {
      const transacao = await services.transacao.criar({
        usuarioId: req.user.id, // do middleware de autenticação
        ...req.body,
      });
      
      res.status(201).json(transacao);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  async listar(req: Request, res: Response) {
    try {
      const transacoes = await services.transacao.listar(
        {
          usuarioId: req.user.id,
          ...req.query,
        },
        {
          page: parseInt(req.query.page as string) || 1,
          limit: parseInt(req.query.limit as string) || 50,
        }
      );
      
      res.json(transacoes);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  // ... outros endpoints
}

// apps/api/src/routes/transacao.routes.ts
import { Router } from 'express';
import { TransacaoController } from '../controllers/transacao.controller';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const controller = new TransacaoController();

router.use(authMiddleware); // Todas as rotas precisam de autenticação

router.post('/transacoes', controller.criar);
router.get('/transacoes', controller.listar);
router.get('/transacoes/:id', controller.buscarPorId);
router.put('/transacoes/:id', controller.atualizar);
router.delete('/transacoes/:id', controller.remover);

// Endpoints especiais
router.post('/transacoes/transferencia', controller.criarTransferencia);
router.get('/transacoes/pendentes', controller.listarPendentes);
router.post('/transacoes/:id/confirmar', controller.confirmar);
router.post('/transacoes/:id/reconciliar', controller.reconciliar);

export default router;
```

## 5️⃣ Criar Testes

### Testes Unitários (Services)

```typescript
// libs/src/core/src/lib/financeiro/transacao/service.spec.ts
import { TransacaoService } from './service';
import { InMemoryTransacaoProvider } from '../../../adapters/inMemory/transacao';
import { InMemoryContaProvider } from '../../../adapters/inMemory/conta';

describe('TransacaoService', () => {
  let service: TransacaoService;
  let transacaoProvider: InMemoryTransacaoProvider;
  let contaProvider: InMemoryContaProvider;
  
  beforeEach(() => {
    transacaoProvider = new InMemoryTransacaoProvider();
    contaProvider = new InMemoryContaProvider();
    service = new TransacaoService(transacaoProvider, contaProvider);
  });
  
  it('deve criar uma transação', async () => {
    // Arrange
    const conta = await contaProvider.criar({
      usuarioId: 'user-1',
      nome: 'Conta Teste',
      tipo: TipoConta.CORRENTE,
      saldoInicial: createMoney('1000.00'),
    });
    
    // Act
    const transacao = await service.criar({
      usuarioId: 'user-1',
      contaId: conta.id,
      tipo: TipoTransacao.DESPESA,
      valor: createMoney('100.00'),
      data: new Date(),
      descricao: 'Teste',
    });
    
    // Assert
    expect(transacao).toBeDefined();
    expect(transacao.valor.amount).toBe('100.00');
  });
  
  it('deve validar splits corretamente', async () => {
    // ...
  });
});
```

### Testes de Integração (Providers)

```typescript
// libs/src/adapters/financeiro/postgres/conta.provider.spec.ts
import { PgContaProvider } from './conta.provider';
import { Pool } from 'pg';

describe('PgContaProvider', () => {
  let provider: PgContaProvider;
  let pool: Pool;
  
  beforeAll(async () => {
    pool = new Pool({
      connectionString: process.env.TEST_DATABASE_URL,
    });
    provider = new PgContaProvider(pool);
    
    // Roda migrations de teste
    await runMigrations(pool);
  });
  
  afterAll(async () => {
    await pool.end();
  });
  
  beforeEach(async () => {
    // Limpa dados de teste
    await pool.query('TRUNCATE contas CASCADE');
  });
  
  it('deve criar uma conta no banco', async () => {
    const conta = await provider.criar({
      usuarioId: 'user-1',
      nome: 'Conta Teste',
      tipo: TipoConta.CORRENTE,
      saldoInicial: createMoney('1000.00'),
    });
    
    expect(conta.id).toBeDefined();
    
    // Verifica no banco
    const result = await pool.query('SELECT * FROM contas WHERE id = $1', [conta.id]);
    expect(result.rows).toHaveLength(1);
  });
});
```

## 6️⃣ Adicionar Validações de Segurança

```typescript
// middlewares/auth.ts
export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// middlewares/ownership.ts
export const checkOwnership = (entityField = 'usuarioId') => {
  return async (req, res, next) => {
    const resourceId = req.params.id;
    const userId = req.user.id;
    
    // Buscar recurso e verificar se pertence ao usuário
    // ... implementação
    
    if (resource[entityField] !== userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    next();
  };
};
```

## 7️⃣ Frontend (Angular)

```typescript
// apps/ZeGrana/src/app/services/transacao.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transacao, CriarTransacaoDTO } from '@ze-grana/core/financeiro';

@Injectable({ providedIn: 'root' })
export class TransacaoService {
  private apiUrl = 'http://localhost:3000/api/transacoes';
  
  constructor(private http: HttpClient) {}
  
  criar(dados: CriarTransacaoDTO): Observable<Transacao> {
    return this.http.post<Transacao>(this.apiUrl, dados);
  }
  
  listar(filtros?: any): Observable<Transacao[]> {
    return this.http.get<Transacao[]>(this.apiUrl, { params: filtros });
  }
  
  // ... outros métodos
}
```

## 8️⃣ Checklist de Implementação

### Fase 1: Setup Básico (1-2 dias)
- [ ] Criar providers in-memory para todos os services
- [ ] Criar testes unitários básicos
- [ ] Testar criação de transações, contas, categorias

### Fase 2: Banco de Dados (2-3 dias)
- [ ] Criar migrations PostgreSQL
- [ ] Implementar PgProviders
- [ ] Testes de integração com DB de teste

### Fase 3: API (2-3 dias)
- [ ] Criar controllers/routes
- [ ] Middleware de autenticação
- [ ] Middleware de ownership
- [ ] Documentação Swagger/OpenAPI

### Fase 4: Frontend (3-5 dias)
- [ ] Criar services Angular
- [ ] Componentes de listagem (contas, transações)
- [ ] Componentes de formulário
- [ ] Dashboard inicial

### Fase 5: Features Avançadas (ongoing)
- [ ] Importação de extratos (OFX, CSV)
- [ ] Relatórios e gráficos
- [ ] Notificações de orçamento
- [ ] Exportação de dados

## 🎯 Comandos Úteis

```bash
# Rodar testes
npm test

# Rodar migrations
npm run migrate:up

# Reverter migrations
npm run migrate:down

# Seed do banco (dados iniciais)
npm run seed

# Rodar API em dev
npm run dev:api

# Rodar frontend em dev
npm run dev:app

# Build completo
npm run build
```

## 📚 Recursos Adicionais

- TypeORM ou Prisma para facilitar mapeamento ORM
- Jest para testes
- Swagger para documentação de API
- Class-validator para validações de DTOs
- Class-transformer para transformações

---

**Boa sorte com a implementação! 🚀**

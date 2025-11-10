# 💰 Módulo Financeiro - ZeGrana

Sistema completo de gerenciamento financeiro pessoal com controle de contas, transações, cartões, empréstimos e orçamentos.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Entidades Principais](#entidades-principais)
- [Como Usar](#como-usar)
- [Exemplos de Código](#exemplos-de-código)
- [Próximos Passos](#próximos-passos)

## 🎯 Visão Geral

Este módulo fornece uma arquitetura completa e escalável para gerenciar todas as operações financeiras do usuário:

- ✅ **Contas Bancárias**: Corrente, poupança, investimentos e dinheiro
- ✅ **Transações**: Receitas, despesas e transferências com splits
- ✅ **Cartões**: Crédito e débito com controle de faturas
- ✅ **Categorias**: Organização hierárquica de despesas e receitas
- ✅ **Empréstimos**: Controle de financiamentos com amortização (PRICE/SAC)
- ✅ **Orçamentos**: Planejamento e acompanhamento por categoria
- ✅ **Bancos**: Cadastro de instituições financeiras

## 📁 Estrutura do Projeto

```
financeiro/
├── types/                    # Tipos compartilhados
│   ├── money.ts             # Money value object e operações
│   ├── enums.ts             # Enums do sistema
│   └── common.ts            # Tipos comuns (EntityBase, Pagination, etc)
│
├── shared/                   # Utilitários compartilhados
│   └── validators.ts        # Validações (Money, Date, etc)
│
├── vo/                       # Value Objects (futura expansão)
│
├── banco/                    # Instituições financeiras
│   ├── model.ts             # Interface Banco + DTOs
│   ├── provider.ts          # Interface IBancoProvider (repositório)
│   └── service.ts           # BancoService (regras de negócio)
│
├── conta/                    # Contas bancárias
│   ├── model.ts
│   ├── provider.ts
│   └── service.ts
│
├── cartao/                   # Cartões de crédito/débito
│   ├── model.ts
│   ├── provider.ts
│   └── service.ts
│
├── categoria/                # Categorias de transações
│   ├── model.ts
│   ├── provider.ts
│   └── service.ts
│
├── transacao/                # Transações financeiras
│   ├── model.ts
│   ├── provider.ts
│   └── service.ts
│
├── emprestimo/               # Empréstimos e financiamentos
│   ├── model.ts
│   ├── provider.ts
│   └── service.ts
│
├── orcamento/                # Orçamentos
│   ├── model.ts
│   ├── provider.ts
│   └── service.ts
│
└── index.ts                  # Barrel export
```

## 🏗️ Arquitetura

Cada entidade segue o padrão **Model-Provider-Service**:

### Model (`model.ts`)
- Interfaces da entidade principal
- DTOs para criar/atualizar
- Filtros para queries
- Value Objects específicos

### Provider (`provider.ts`)
- Interface do repositório (abstração de persistência)
- Métodos CRUD + operações específicas
- **Não contém lógica de negócio**
- Implementações concretas (Postgres, MongoDB, InMemory) ficam em `adapters/`

### Service (`service.ts`)
- Regras de negócio
- Validações
- Orquestração entre providers
- Cálculos e transformações

## 📦 Entidades Principais

### 1. **Money** (Value Object)
```typescript
interface Money {
  amount: string;    // SEMPRE string decimal (ex: "1234.56")
  currency: string;  // ISO 4217 (ex: "BRL", "USD")
}
```
**⚠️ IMPORTANTE**: Nunca use `number` para valores monetários! Use `string` para evitar erros de arredondamento.

### 2. **Conta**
Representa uma conta bancária ou carteira digital.

**Tipos**: `CORRENTE`, `POUPANCA`, `INVESTIMENTO`, `DINHEIRO`

**Campos principais**:
- `saldo`: Money (calculado a partir das transações)
- `bancoId`: Opcional (para dinheiro físico)
- `ativa`: boolean

### 3. **Transação**
Operação financeira: receita, despesa ou transferência.

**Tipos**: `RECEITA`, `DESPESA`, `TRANSFERENCIA`

**Status**: `PENDENTE`, `CONFIRMADA`, `RECONCILIADA`, `CANCELADA`

**Funcionalidades**:
- ✅ **Splits**: Dividir uma transação em múltiplas categorias
- ✅ **Transferências**: Cria automaticamente débito + crédito
- ✅ **Deduplicação**: Busca duplicatas potenciais
- ✅ **Reconciliação**: Conciliar com extratos bancários
- ✅ **Recorrência**: Transações que se repetem

### 4. **Cartão**
Cartões de crédito ou débito.

**Tipos**: `CREDITO`, `DEBITO`, `MULTIPLO`

**Funcionalidades**:
- ✅ Limite de crédito
- ✅ Controle de faturas
- ✅ Ciclo de fechamento e vencimento
- ✅ **Não armazena PAN completo** (apenas últimos 4 dígitos + token)

### 5. **Categoria**
Organização hierárquica de receitas e despesas.

**Tipos**: `RECEITA`, `DESPESA`

**Funcionalidades**:
- ✅ Categorias e subcategorias (árvore)
- ✅ Cor e ícone personalizados
- ✅ Relatórios por categoria

### 6. **Empréstimo**
Controle de empréstimos e financiamentos com amortização.

**Tipos de amortização**: `PRICE` (parcelas fixas), `SAC` (amortização constante)

**Funcionalidades**:
- ✅ Geração automática de cronograma
- ✅ Controle de parcelas pagas/pendentes
- ✅ Cálculo de juros e amortização
- ✅ Simulação sem salvar
- ✅ Vinculação automática com transações

### 7. **Orçamento**
Planejamento e acompanhamento de gastos por categoria.

**Períodos**: `SEMANAL`, `MENSAL`, `TRIMESTRAL`, `SEMESTRAL`, `ANUAL`

**Funcionalidades**:
- ✅ Alertas personalizados (ex: 80% do limite)
- ✅ Histórico de períodos anteriores
- ✅ Resumo geral (total planejado vs gasto)
- ✅ Renovação automática de períodos

## 🚀 Como Usar

### 1. Importar os tipos e serviços

```typescript
import {
  // Services
  ContaService,
  TransacaoService,
  CartaoService,
  CategoriaService,
  EmprestimoService,
  OrcamentoService,
  
  // Types
  Money,
  createMoney,
  TipoTransacao,
  StatusTransacao,
  
  // DTOs
  CriarContaDTO,
  CriarTransacaoDTO,
  
} from '@ze-grana/core/financeiro';
```

### 2. Instanciar os serviços (com DI)

```typescript
// No seu módulo de inicialização (ex: app.module.ts ou main.ts)

// Providers (implementações concretas - a implementar em adapters/)
const contaProvider = new PgContaProvider(dbConnection);
const transacaoProvider = new PgTransacaoProvider(dbConnection);

// Services
const contaService = new ContaService(contaProvider);
const transacaoService = new TransacaoService(transacaoProvider, contaProvider);
```

## 💡 Exemplos de Código

### Criar uma conta

```typescript
const conta = await contaService.criar({
  usuarioId: 'uuid-do-usuario',
  bancoId: 'uuid-do-banco',
  nome: 'Conta Corrente',
  tipo: TipoConta.CORRENTE,
  saldoInicial: createMoney('1000.00', 'BRL'),
});
```

### Registrar uma despesa

```typescript
const despesa = await transacaoService.criar({
  usuarioId: 'uuid-do-usuario',
  contaId: conta.id,
  tipo: TipoTransacao.DESPESA,
  valor: createMoney('150.50', 'BRL'),
  data: new Date(),
  descricao: 'Supermercado',
  categoriaId: 'uuid-categoria-alimentacao',
  tags: ['supermercado', 'mensal'],
});
```

### Criar uma transferência entre contas

```typescript
const transferencia = await transacaoService.criarTransferencia({
  usuarioId: 'uuid-do-usuario',
  contaOrigemId: 'conta-corrente-id',
  contaDestinoId: 'conta-poupanca-id',
  valor: createMoney('500.00', 'BRL'),
  data: new Date(),
  descricao: 'Poupança mensal',
});

// Cria automaticamente 2 transações vinculadas
console.log(transferencia.origem); // Despesa na conta corrente
console.log(transferencia.destino); // Receita na poupança
```

### Transação com divisão (split)

```typescript
const transacaoSplit = await transacaoService.criar({
  usuarioId: 'uuid-do-usuario',
  contaId: 'conta-id',
  tipo: TipoTransacao.DESPESA,
  valor: createMoney('200.00', 'BRL'),
  data: new Date(),
  descricao: 'Compras do mês',
  divisoes: [
    {
      valor: createMoney('120.00', 'BRL'),
      categoriaId: 'categoria-alimentacao-id',
      observacao: 'Supermercado',
    },
    {
      valor: createMoney('80.00', 'BRL'),
      categoriaId: 'categoria-casa-id',
      observacao: 'Produtos de limpeza',
    },
  ],
});
```

### Criar empréstimo com amortização PRICE

```typescript
const emprestimo = await emprestimoService.criar({
  usuarioId: 'uuid-do-usuario',
  nome: 'Financiamento Carro',
  valorPrincipal: createMoney('30000.00', 'BRL'),
  taxaJurosAnual: 12, // 12% a.a.
  tipoAmortizacao: TipoAmortizacao.PRICE,
  dataInicio: new Date(),
  prazoMeses: 36,
});

// Cronograma gerado automaticamente
console.log(emprestimo.parcelas); // 36 parcelas calculadas
```

### Simular empréstimo sem salvar

```typescript
const simulacao = emprestimoService.simular({
  usuarioId: 'uuid',
  nome: 'Simulação',
  valorPrincipal: createMoney('10000.00', 'BRL'),
  taxaJurosAnual: 10,
  tipoAmortizacao: TipoAmortizacao.SAC,
  dataInicio: new Date(),
  prazoMeses: 12,
});

console.log(simulacao.valorTotal); // Total a pagar
console.log(simulacao.totalJuros); // Total de juros
console.log(simulacao.parcelas);   // Cronograma completo
```

### Criar orçamento mensal

```typescript
const orcamento = await orcamentoService.criar({
  usuarioId: 'uuid-do-usuario',
  categoriaId: 'categoria-alimentacao-id',
  nome: 'Alimentação Mensal',
  periodo: Periodo.MENSAL,
  valorPlanejado: createMoney('800.00', 'BRL'),
  alertar: true,
  percentualAlerta: 80, // Alerta aos 80%
});
```

### Gerar resumo de gastos

```typescript
const resumo = await transacaoService.gerarResumo(
  'uuid-do-usuario',
  {
    inicio: new Date('2024-01-01'),
    fim: new Date('2024-01-31'),
  }
);

console.log(resumo.totalReceitas);  // Total de receitas
console.log(resumo.totalDespesas);  // Total de despesas
console.log(resumo.saldoPeriodo);   // Saldo do período
console.log(resumo.porCategoria);   // Gastos por categoria
```

## ⚙️ Validações Implementadas

Todas as entidades possuem validações rigorosas:

- ✅ **IDs**: Validação de UUID
- ✅ **Money**: Formato decimal válido, valores positivos/negativos conforme contexto
- ✅ **Datas**: Datas válidas, períodos consistentes
- ✅ **Splits**: Soma das divisões = valor total da transação
- ✅ **Duplicação**: Detecção de transações duplicadas
- ✅ **Integridade**: Categoria pai/filho do mesmo tipo, limites de cartão, etc.

## 🔐 Segurança

- ✅ **Nunca armazenar PAN de cartão completo** (apenas últimos 4 dígitos + token)
- ✅ Valores monetários sempre como string decimal (evita erros de arredondamento)
- ✅ Validação de permissões (usuário só acessa seus próprios dados)
- ⚠️ **TODO**: Implementar criptografia de dados sensíveis

## 📊 Próximos Passos

### 1. **Implementar Providers (Adapters)**
Atualmente temos apenas as **interfaces** dos providers. Você precisará criar as implementações concretas:

```
libs/src/adapters/
└── financeiro/
    ├── postgres/
    │   ├── PgContaProvider.ts
    │   ├── PgTransacaoProvider.ts
    │   └── ...
    ├── mongodb/
    │   └── ...
    └── inMemory/  (para testes)
        └── ...
```

### 2. **Migrations de Banco de Dados**
Criar migrations para PostgreSQL/MongoDB com as tabelas necessárias.

### 3. **Testes**
- Unit tests para services (lógica de negócio)
- Integration tests para providers (com DB de teste)
- E2E tests para fluxos completos

### 4. **Entidades Adicionais** (futuras)
- `Favorecido` / `Merchant`: Destinatários recorrentes
- `RecurringTransaction`: Transações automáticas
- `Statement`: Importação de extratos (OFX, CSV)
- `Tag`: Sistema de tags avançado
- `Attachment`: Anexos de comprovantes
- `Rule`: Regras de automação e categorização

### 5. **APIs REST/GraphQL**
Criar controllers/resolvers no módulo `api/` para expor os serviços.

### 6. **Relatórios e Analytics**
- Dashboard de patrimônio
- Gráficos de gastos por categoria
- Previsão de fluxo de caixa
- Comparação orçado vs realizado

### 7. **Integrações**
- Open Banking (PSD2, Open Finance Brasil)
- Importação de extratos bancários
- Sincronização automática

## 🎨 Convenções e Boas Práticas

1. **Money sempre como string**: Use `createMoney()` para criar valores
2. **Validações no Service**: Nunca confie em dados externos
3. **Provider é burro**: Apenas persistência, sem lógica de negócio
4. **DTOs claros**: Separar criação/atualização/filtros
5. **Imutabilidade**: Value Objects são imutáveis
6. **Async/Await**: Sempre use async para operações de IO
7. **Nomenclatura em português**: Entidades e campos em PT-BR para domínio local

## 📚 Referências

- Domain-Driven Design (DDD)
- Clean Architecture
- Repository Pattern
- Value Objects
- Aggregate Roots

## 📝 Notas Importantes

### Saldos de Contas
O saldo de uma conta é **calculado** a partir das transações, não é um campo que você edita diretamente. Quando você cria uma transação:

- **Receita**: adiciona ao saldo
- **Despesa**: subtrai do saldo
- **Transferência**: subtrai da origem e adiciona ao destino

### Amortização de Empréstimos
O sistema suporta dois tipos:

- **PRICE**: Parcelas fixas (juros decrescentes, amortização crescente)
- **SAC**: Amortização constante (parcelas decrescentes)

### Orçamentos
Os orçamentos são **automáticos**: quando você cria transações na categoria orçamentada, o sistema atualiza automaticamente o `valorGasto` e `percentualUtilizado`.

---

**Desenvolvido para o projeto ZeGrana** 💰

*Última atualização: 07/11/2025*

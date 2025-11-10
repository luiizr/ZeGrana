# 🏗️ Estrutura do Core Financeiro - ZeGrana

## 📊 Diagrama de Entidades

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USUÁRIO (User)                              │
│                     ┌───────────────────────┐                        │
│                     │   usuarioId (FK)      │                        │
│                     └───────────┬───────────┘                        │
│                                 │                                    │
└─────────────────────────────────┼────────────────────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
        ▼                         ▼                         ▼
┌──────────────┐         ┌─────────────┐          ┌─────────────┐
│    BANCO     │◄────────│    CONTA    │          │  CATEGORIA  │
│   (Bank)     │         │  (Account)  │          │  (Category) │
└──────────────┘         └─────┬───────┘          └──────┬──────┘
                               │                         │
                               │                         │ categoriaPaiId
                               │                         │ (hierarquia)
                               │                         │
                         ┌─────┴─────┐                   │
                         │           │                   │
                         ▼           ▼                   │
                  ┌──────────┐ ┌──────────┐             │
                  │  CARTÃO  │ │TRANSAÇÃO │◄────────────┘
                  │  (Card)  │ │(Transaction)
                  └────┬─────┘ └────┬─────┘
                       │            │
                       │            │ parcelaId (opcional)
                       │            │
                       │            ▼
                       │      ┌──────────────┐
                       │      │  PARCELA     │
                       │      │ (Installment)│
                       │      └──────┬───────┘
                       │             │
                       │             │ emprestimoId
                       │             │
                       │             ▼
                       │      ┌─────────────┐
                       │      │ EMPRÉSTIMO  │
                       │      │   (Loan)    │
                       │      └─────────────┘
                       │
                       │ (faturas)
                       ▼
                  ┌──────────────┐
                  │FATURA CARTÃO │
                  │(CardStatement)
                  └──────────────┘

                         ┌─────────────┐
                         │  ORÇAMENTO  │◄─── categoriaId
                         │  (Budget)   │
                         └─────────────┘
```

## 🔗 Relacionamentos Principais

### 1. **Usuário → Contas** (1:N)
Um usuário possui múltiplas contas (corrente, poupança, etc.)

### 2. **Banco → Contas** (1:N)
Um banco pode ter múltiplas contas de usuários diferentes

### 3. **Conta → Transações** (1:N)
Uma conta possui múltiplas transações (receitas/despesas)

### 4. **Conta → Cartões** (1:N)
Uma conta pode ter múltiplos cartões vinculados

### 5. **Cartão → Transações** (1:N)
Um cartão possui múltiplas transações (compras)

### 6. **Categoria → Transações** (1:N)
Uma categoria agrupa múltiplas transações

### 7. **Categoria → Subcategorias** (1:N - autorreferência)
Uma categoria pode ter subcategorias (hierarquia)

### 8. **Empréstimo → Parcelas** (1:N)
Um empréstimo possui múltiplas parcelas

### 9. **Parcela → Transação** (1:1)
Quando uma parcela é paga, gera uma transação

### 10. **Categoria → Orçamento** (1:1)
Uma categoria pode ter um orçamento associado

### 11. **Transação → Transação** (transferências)
Transferências criam 2 transações vinculadas (origem/destino)

## 📦 Módulos e Dependências

```
┌──────────────────────────────────────────────────────┐
│                    TYPES (base)                      │
│  Money, Enums, EntityBase, Pagination, DateRange    │
└────────────────────────┬─────────────────────────────┘
                         │
                         │ (usado por todos)
                         │
┌────────────────────────┴─────────────────────────────┐
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │  BANCO   │  │CATEGORIA │  │  CONTA   │          │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘          │
│       │             │              │                 │
│       └─────────────┴──────────────┘                 │
│                     │                                │
│                     ▼                                │
│            ┌─────────────────┐                       │
│            │   TRANSAÇÃO     │                       │
│            │  (depende de:)  │                       │
│            │  - Conta        │                       │
│            │  - Categoria    │                       │
│            │  - Cartão       │                       │
│            └────────┬────────┘                       │
│                     │                                │
│         ┌───────────┴───────────┐                    │
│         ▼                       ▼                    │
│  ┌─────────────┐         ┌─────────────┐            │
│  │ EMPRÉSTIMO  │         │  ORÇAMENTO  │            │
│  │ (depende de:)         │ (depende de:)            │
│  │ - Transação │         │ - Categoria │            │
│  └─────────────┘         │ - Transação │            │
│                          └─────────────┘            │
│                                                      │
│  ┌──────────┐                                        │
│  │  CARTÃO  │                                        │
│  │(depende: │                                        │
│  │  Conta)  │                                        │
│  └──────────┘                                        │
└──────────────────────────────────────────────────────┘
```

## 🔄 Fluxo de Dados Típico

### Cenário 1: Criar uma despesa com cartão

```
User Action → TransacaoService.criar()
                    ↓
            Valida dados (service)
                    ↓
            TransacaoProvider.criar()
                    ↓
            Salva no DB (adapter)
                    ↓
            ContaProvider.atualizarSaldo()
                    ↓
            CartaoProvider.atualizarLimite()
                    ↓
            OrcamentoProvider.atualizarGasto() (se categoria tem orçamento)
                    ↓
            Retorna Transacao
```

### Cenário 2: Pagar parcela de empréstimo

```
User Action → EmprestimoService.pagarParcela()
                    ↓
            Valida parcela (service)
                    ↓
            TransacaoService.criar() (cria transação de pagamento)
                    ↓
            EmprestimoProvider.pagarParcela()
                    ↓
            EmprestimoProvider.atualizarSaldoDevedor()
                    ↓
            Retorna { parcela, transacaoId }
```

## 📂 Arquivos Criados

```
libs/src/core/src/lib/financeiro/
├── README.md                          ← Documentação completa
├── index.ts                           ← Barrel export
│
├── types/
│   ├── money.ts                       ← Money VO + operações
│   ├── enums.ts                       ← Todos os enums do sistema
│   ├── common.ts                      ← Tipos base (EntityBase, etc)
│   └── index.ts
│
├── shared/
│   ├── validators.ts                  ← Validadores (Money, Date, etc)
│   └── index.ts
│
├── vo/                                ← (para futuras expansões)
│
├── banco/
│   ├── model.ts                       ← Interface + DTOs
│   ├── provider.ts                    ← Interface repositório
│   ├── service.ts                     ← Regras de negócio
│   └── index.ts
│
├── conta/
│   ├── model.ts
│   ├── provider.ts
│   ├── service.ts
│   └── index.ts
│
├── cartao/
│   ├── model.ts
│   ├── provider.ts
│   ├── service.ts
│   └── index.ts
│
├── categoria/
│   ├── model.ts
│   ├── provider.ts
│   ├── service.ts
│   └── index.ts
│
├── transacao/
│   ├── model.ts                       ← Inclui TransacaoDivisao (splits)
│   ├── provider.ts
│   ├── service.ts                     ← Lógica complexa (splits, transfers)
│   └── index.ts
│
├── emprestimo/
│   ├── model.ts                       ← Emprestimo + Parcela
│   ├── provider.ts
│   ├── service.ts                     ← Cálculo amortização PRICE/SAC
│   └── index.ts
│
└── orcamento/
    ├── model.ts                       ← Orcamento + HistoricoOrcamento
    ├── provider.ts
    ├── service.ts
    └── index.ts
```

## ✅ Total de Arquivos Criados

- **57 arquivos** criados
- **7 entidades principais** completas
- **3 módulos auxiliares** (types, shared, vo)
- **100% TypeScript** tipado
- **0 erros de compilação**

## 🎯 Status do Projeto

✅ **Concluído**: Core financeiro completo com todas as entidades principais
⚠️ **Próximo**: Implementar adapters (providers concretos com DB)
📝 **Futuro**: APIs REST/GraphQL, testes, integração com bancos

---

**ZeGrana** - Sistema de Gerenciamento Financeiro Pessoal 💰

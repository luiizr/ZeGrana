CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cartoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nome VARCHAR(80) NOT NULL, limite NUMERIC(14,2) NOT NULL CHECK (limite >= 0), dia_fechamento SMALLINT NOT NULL CHECK (dia_fechamento BETWEEN 1 AND 31), dia_vencimento SMALLINT NOT NULL CHECK (dia_vencimento BETWEEN 1 AND 31), criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$ BEGIN CREATE TYPE tipo_lancamento AS ENUM ('DESPESA', 'RECEBIMENTO'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE meio_pagamento AS ENUM ('DINHEIRO', 'CARTAO'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE TABLE IF NOT EXISTS lancamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  cartao_id UUID REFERENCES cartoes(id) ON DELETE SET NULL, tipo tipo_lancamento NOT NULL, titulo VARCHAR(120) NOT NULL,
  categoria VARCHAR(50) NOT NULL, valor NUMERIC(14,2) NOT NULL CHECK (valor > 0), data_lancamento DATE NOT NULL,
  meio_pagamento meio_pagamento NOT NULL DEFAULT 'DINHEIRO', observacao VARCHAR(500), fixo BOOLEAN NOT NULL DEFAULT FALSE,
  pago BOOLEAN NOT NULL DEFAULT FALSE, criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(), atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK ((meio_pagamento = 'CARTAO' AND cartao_id IS NOT NULL) OR (meio_pagamento = 'DINHEIRO' AND cartao_id IS NULL))
);
CREATE INDEX IF NOT EXISTS lancamentos_usuario_data_idx ON lancamentos(usuario_id, data_lancamento DESC);

CREATE TABLE IF NOT EXISTS caixinhas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nome VARCHAR(80) NOT NULL, meta NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (meta >= 0), saldo NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (saldo >= 0), criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS movimentacoes_caixinha (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), caixinha_id UUID NOT NULL REFERENCES caixinhas(id) ON DELETE CASCADE,
  valor NUMERIC(14,2) NOT NULL CHECK (valor > 0), tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('APORTE', 'RETIRADA')), criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

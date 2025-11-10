# Documento de Visão - ZeGrana

## Histórico de Revisões

| Data | Versão | Descrição | Autores |
| :--: | :----: | :-------: | :-----: |
| 10/11/2025 | 1.0 | Criando documento de visão | Luiz Roberto |


## 1. Objetivo do projeto

ZeGrana é uma plataforma de gerenciamento financeiro pessoal destinada a ajudar usuários a entender, acompanhar e melhorar sua saúde financeira. O objetivo é oferecer um software seguro e intuitive para centralizar conta(s) bancária(s), cartões, transações, orçamentos, faturas e empréstimos, com importação automática de histórico por meio de agregadores (Open Banking), feedbacks automáticos via whatsapp e ferramentas de categorização e análise.

O produto visa reduzir o tempo e o esforço necessários para controlar despesas, aumentar a visibilidade sobre receitas e compromissos, automatizar conciliações e facilitar decisões financeiras do dia a dia.


## 2. Descrição do problema

|     |      |
| --- | --- |
| **Problema** | Usuários dispersos entre bancos, cartões e boletos têm dificuldade em visualizar seu histórico financeiro consolidado, controlar gastos recorrentes e planejar orçamentos. Muitas informações estão fragmentadas, e o processo manual de importação/organização é pesado. |
| **Afeta** | Pessoas físicas que desejam gerenciar melhor suas finanças pessoais (salários, despesas, cartões, empréstimos). |
| **Impacta** | Causa estresse financeiro, perda de oportunidades de economia e decisões baseadas em dados incompletos. |
| **Solução** | Plataforma centralizada que importa automaticamente transações (via agregadores ou CSV), organiza em contas e categorias, permite orçamentos, monitora faturas e parcelas, e fornece relatórios e alertas. |


## 3. Descrição dos usuários (personas)

| Nome | Descrição | Responsabilidade / objetivos |
| ---- | --------- | --------------------------- |
| Usuário (Titular) | Pessoa que deseja controlar suas finanças pessoais: contas, cartões e despesas. Pode ter múltiplas contas e cartões de diferentes instituições. | Registrar contas, conectar agregadores/PSPs, revisar transações categorizadas, criar orçamentos, pagar faturas e acompanhar empréstimos. |
| Visitante | Pessoa que ainda não criou conta no ZeGrana; pode visualizar conteúdo público (artigos, guias). | Avaliar o produto antes de criar conta. |
| Contabilista / Consultor Financeiro | Profissional que ajuda um conjunto de usuários (com consentimento) a organizar finanças. | Analisar relatórios, exportar dados (CSV/PDF), propor ajustes de orçamento (mediante consentimento). |
| Administrador do Sistema | Equipe técnica/operacional responsável pela manutenção da plataforma. | Gerenciar integrações (agregadores/PSPs), monitorar jobs e webhooks, aplicar políticas de retenção e segurança. |


## 4. Descrição do ambiente dos usuários

- Ambientes: desktop (web responsive), mobile (PWA / app futuro). Conexão à Internet requerida para sincronização com agregadores.
- Plataformas usuais no ecossistema: apps bancários, serviços de pagamento (PSP), agregadores Open Banking (Belvo etc.), planilhas e serviços de nuvem — o ZeGrana se integra via APIs e permitirá exportação/importação.
- Restrições: autenticação forte para operações sensíveis; o usuário deve consentir para importação de dados por terceiros (agregador).


## 5. Principais necessidades dos usuários

1) Centralizar histórico financeiro

- Causa: múltiplas contas e cartões espalhados entre bancos/PSPs.
- Solução ZeGrana: importação automática de transações e agrupamento por conta/cartão; busca e filtros por período, valor e categoria.

2) Controle de orçamentos e faturas

- Causa: dificuldade em acompanhar limites, parcelas e datas de vencimento.
- Solução ZeGrana: criar orçamentos por categoria, rastrear consumo do mês, notificar quando perto do limite; rastrear faturas e parcelas por cartão e empréstimo.

3) Automação da categorização e conciliação

- Causa: categorizar manualmente centenas de transações é oneroso.
- Solução ZeGrana: regras automáticas, aprendizado simples por heurísticas (MCC, merchant), e opção de regras manuais do usuário.

4) Segurança e privacidade

- Causa: dados financeiros são sensíveis.
- Solução ZeGrana: criptografia de tokens sensíveis, validação de webhooks, consentimento explícito, conformidade com LGPD e práticas de segurança (TLS, secret management).

5) Relatórios e insights
- Causa: falta de visibilidade sobre padrões de gastos e oportunidades de economia.
- Solução ZeGrana: dashboards com gráficos de fluxo de caixa, despesas por categoria, comparativos por período, exportação de relatórios em PDF e envio via whatsapp do usuário com seus insights.


## 6. Alternativas concorrentes

Analisar concorrentes diretos e indiretos no mercado para reaproveitar boas práticas e diferenciar o ZeGrana:

| Concorrentes | Pontos positivos | Pontos negativos | O que iremos reutilizar / diferenciar |
| --- | --- | --- | --- |
| GuiaBolso / Mobills / Organizze | Interface pronta para controle de despesas, categorização automática e relatórios | Modelos comerciais já estabelecidos (pago), foco limitado em mercados locais | Reutilizar visualização de despesas e relatórios; diferenciar com integração Open Banking nativa e automações mais robustas para carteiras e empréstimos |
| Apps bancários | Integração direta com contas; atualizações em tempo real | Foco limitado à própria instituição; falta visão consolidada | ZeGrana agrega várias instituições e fornece visão consolidada e ferramentas de planejamento |



## 7. Visão geral do produto

ZeGrana é uma aplicação web responsiva que permite ao usuário conectar contas bancárias e cartões (via agregador ou manualmente), importar e reconciliar transações, criar orçamentos e acompanhar faturas e empréstimos. O produto prioriza segurança, privacidade e automação para reduzir o trabalho manual do usuário. A interface terá um painel (dashboard) com resumo do patrimônio, gráfico de fluxo de caixa, lista de transações, painéis de orçamento e alertas de faturas/parcelas.


## 8. Requisitos funcionais (exemplos iniciais)

| Código | Nome | Descrição |
| --- | --- | --- |
| F01 | Autenticação de usuários | Cadastro/login com e-mail/senha; suporte a OAuth e autenticação via agregador (quando aplicável). |
| F02 | Conexão com agregadores | Iniciar fluxo de consentimento (link), trocar token, persistir `AggregatorLink` e `ImportMetadata`. |
| F03 | Importação de transações | Buscar e persistir transações (historico) por conta; deduplicação baseada em `providerTransactionId` e heurísticas. |
| F04 | Gestão de contas e bancos | CRUD para `Conta` e `Banco` (metadados vindos do agregador). |
| F05 | Gestão de cartões e faturas | Registrar cartões, agrupar transações por fatura, acompanhar vencimentos e gerar alertas. |
| F06 | Lançamentos manuais | Permitir criação/edição/remoção de lançamentos manuais com categoria, parcelamento e tags. |
| F07 | Categorização automática e regras | Aplicar regras automáticas por MCC/merchant; confirmar e aplicar correções em lote. |
| F08 | Orçamentos | Criar orçamentos por categoria com período, alertas e relatório de cumprimento. |
| F09 | Relatórios e gráficos | Fluxo de caixa, despesas por categoria, comparativos por período, export CSV/PDF. |
| F10 | Regras de conciliação e transferências | Identificar transferências internas e conciliá-las automaticamente. |
| F11 | Integração com PSPs (opcional) | Permitir marcar pagamentos e (quando usar PSP) criar cobranças ou efetivar pagamentos via integrações. |
| F12 | Webhooks e sincronização | Endpoint para receber webhooks do agregador e processar eventos (transactions.created, accounts.updated, consent.revoked). |
| F13 | Permissões e multi-usuário | Controlar papéis (usuário, consultor, admin) e consentimentos para compartilhar dados. |
| F14 | Notificações via whatsapp | Enviar notificações e relatórios via WhatsApp para usuários com consentimento. |


## 9. Requisitos não-funcionais

| Código | Nome | Descrição | Categoria | Classificação |
| --- | --- | --- | --- | --- |
| NF01 | Stack principal | TypeScript (Node.js/Nest ou similar), banco relacional (Postgres), frontend React/TS + Tailwind / PWA | Desenvolvimento | Obrigatório |
| NF02 | Segurança | TLS obrigatório, criptografia at-rest para tokens sensíveis, verificação HMAC para webhooks, gestão de secrets via Vault/KeyVault | Segurança | Obrigatório |
| NF03 | Privacidade / LGPD | Reter apenas o mínimo necessário; permitir deleção de dados e exportação por usuário; registrar consentimentos | Compliance | Obrigatório |
| NF04 | Escalabilidade | Arquitetura preparada para escalonamento (jobs para importação, filas para processamento de webhooks, horizontalização dos serviços) | Performance | Desejável |
| NF05 | Disponibilidade | Serviços críticos com SLAs (monitoramento e alerting); rotinas de retry nos webhooks e jobs | Operacional | Desejável |
| NF06 | Usabilidade | Interface responsiva, acessível (nível básico) e com fluxos guiados para importar contas | Usabilidade | Obrigatório |
| NF07 | Testabilidade | Cobertura de testes unitários e alguns testes de integração para flows críticos (importação, dedupe, pagamento) | Qualidade | Obrigatório |
| NF08 | Performance | Dashboard com carga inicial rápida; paginação e filters para listas de transações com centenas de registros | Performance | Desejável |


## 10. Restrições e considerações de segurança

- Não armazenar dados sensíveis de cartão (PAN/CVV) em texto; usar tokenização via PSP quando aplicável.
- Criptografar access/refresh tokens dos agregadores em repouso.
- Implementar verificação de assinatura HMAC para webhooks e idempotência por `eventId`.
- Manter logs de auditoria para operações de importação e ações críticas; mascarar dados sensíveis nos logs.



## 11. Glossário (termos usados no documento)

- Aggregator / Agregador: serviço que provê conexão com múltiplas instituições bancárias (e.g., Belvo, Plaid).
- PSP: Payment Service Provider (provedor de pagamentos).
- Conta: registro lógico que representa uma conta bancária ou carteira do usuário.
- Transação: item de histórico financeiro (débito/crédito) importado ou lançado manualmente.
- ImportMetadata: metadados do lote de importação (proveniência, raw payload, eventId).

---

_Podem haver ajustes nesse arquivo, não leve tudo desse documento ao pé da letra sem conscentimento do autor._

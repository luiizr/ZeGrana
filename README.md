# ZeGrana  
![ZeGrana Logo](https://via.placeholder.com/150)

## 📖 Visão Geral  

O **ZeGrana** é um sistema de gestão financeira pessoal projetado para simplificar a forma como você controla, planeja e melhora sua vida financeira. Com um painel web robusto desenvolvido em Angular e arquitetura NX Monorepo, a plataforma oferece:

- Insights financeiros inteligentes  
- Dicas automáticas de otimização  
- Estratégias personalizadas de gestão de gastos  
- Roadmap com integrações futuras (WhatsApp e automação bancária)  

---

## 🚀 Roadmap do Projeto  

### Fase 1: Painel Web - Gestão Manual  
- [x] Autenticação e gerenciamento de perfil  
- [] Cadastro de receitas e despesas  
- [] Visualização de dados com gráficos dinâmicos  
- [] Relatórios semanais/mensais/anuais  
- [] Sugestões inteligentes de economia  
- [] Definição e acompanhamento de metas  

### Fase 2: Integração com WhatsApp (Futuro)  
- [ ] Registrar transações via mensagens  
- [ ] Solicitar relatórios diretamente no chat  
- [ ] Análise de viabilidade de compras  
- [ ] Alertas de orçamento e conquistas de metas  

### Fase 3: Automação via Notificações Bancárias (Futuro)  
- [ ] Atualização em tempo real via SMS/push bancário  
- [ ] Classificação automática de transações  
- [ ] Integração com Open Finance  
- [ ] Automação de pagamentos (Pix, contas)  

---

## 🏗️ Arquitetura do Projeto  

```plaintext
Estrutura NX Monorepo modular:  
zegrana/
├── frontend/ # apps
│ └── dashboard/ # Aplicação Angular principal
├── libs/
│ ├── ui/ # Componentes UI reutilizáveis
│ ├── features/ # Lógica de negócio (transações, metas)
│ ├── data-access/ # APIs e gerenciamento de estado
│ ├── models/ # Interfaces TypeScript
│ └── API / # Api
├── tools/
│ └── scripts/ # Scripts de build/deploy
```
---

## 🛠️ Tecnologias Utilizadas  

| Categoria          | Tecnologias                          |
|--------------------|--------------------------------------|
| Framework          | Angular 19                           |
| Monorepo           | NX                                   |
| UI Components      | PrimeNG + Design System Customizado  |
| Gráficos           | PrimeNG Charts (Chart.js)            |
| Linguagem          | TypeScript                           |
| CSS                | Tailwind                             |

---

## 🧩 Executando Localmente  

```bash
# Clonar repositório
git clone https://github.com/luiizr/zegrana.git

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
nx serve dashboard
Acesse: http://localhost:4200
```
---


## 👤 Informações do Desenvolvedor  

**Nome:** [Luiz Roberto]  
**Email:** [Luizroberto312005@gmail.com]  
**GitHub:** [github](https://github.com/luiizr)  
**LinkedIn:** [linkedin](https://www.linkedin.com/in/luiz-roberto-desenvolvedor/)

---

## 📞 Contato e Contribuições  

Contribuições são bem-vindas!  

1. **Reportar problemas:**  
   Abra uma [issue](https://github.com/luiizr/zegrana/issues) no GitHub  

2. **Enviar melhorias:**  
   - Faça um fork do projeto  
   - Crie um branch com sua feature (`git checkout -b feature/nova-feature`)  
   - Envie um Pull Request  

---

## 📋 Licença  

Distribuído sob licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.  

---
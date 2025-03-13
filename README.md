# 💰 Finance AI

> Plataforma de gerenciamento financeiro com relatórios inteligentes via **GPT** e planos pagos via **Stripe**.

---

## 📌 **Features**
✅ Dashboard financeiro interativo  
✅ Integração com **Stripe** para planos e pagamentos  
✅ Relatórios inteligentes usando **GPT**  
✅ Interface moderna e responsiva com **TailwindCSS**  
✅ Autenticação com **Clerk**  
✅ Validações robustas com **Zod**  
✅ Banco de dados gerenciado com **Prisma**  

---

## 📸 **Demonstração**
> _Inclua prints do projeto aqui quando disponíveis._

---

## 🚀 **Instalação e Configuração**

### **Pré-requisitos**
- **Node.js** `>=18`
- **PostgreSQL ou outro banco compatível com Prisma**
- **Chaves de API do Stripe e OpenAI**

### **Passos**

1️⃣ **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/finance-ai.git
cd finance-ai
```

2️⃣ **Instale as dependências**
```bash
npm install
```

3️⃣ **Crie um arquivo `.env` e adicione:**
```env
DATABASE_URL="sua_url_do_banco"
NEXT_PUBLIC_STRIPE_KEY="sua_chave_stripe"
OPENAI_API_KEY="sua_chave_openai"
```

4️⃣ **Rodando as migrações do banco**
```bash
npx prisma migrate dev
```

5️⃣ **Inicie o projeto**
```bash
npm run dev
```

---

## 🔗 **Tecnologias Utilizadas**
- **Next.js 14** ⚡
- **React 18** ⚛️
- **Prisma ORM** 🛠️
- **TailwindCSS** 🎨
- **Clerk Auth** 🔑
- **Zod Validation** ✅
- **Stripe API** 💳
- **GPT AI** 🤖

---

## 🤝 **Contribuindo**
Contribuições são bem-vindas! Para contribuir, siga os passos:
1. Fork este repositório
2. Crie uma branch (`git checkout -b feature/sua-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/sua-feature`)
5. Abra um Pull Request

---

## 📜 **Licença**
Este projeto é licenciado sob a **MIT License**.

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
> Login ![image](https://github.com/user-attachments/assets/1aa1ef84-5ef7-4a9e-a79a-8ee890706fad)
> Dashboard ![image](https://github.com/user-attachments/assets/70108c54-c31f-4f3b-aad7-c0ec32d1feed)
> Adicione transações ![image](https://github.com/user-attachments/assets/6d4770d3-c9ad-450a-b46a-ab0283a9fec9)
> Planos ![image](https://github.com/user-attachments/assets/f9a32ef2-4e5b-4a08-ad5a-d7caa86643b2)


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

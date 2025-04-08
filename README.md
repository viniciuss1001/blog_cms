# 📰 Blog CMS

Um **sistema de gerenciamento de conteúdo (CMS)** para blogs, construído com **Next.js 15**, **React 19**, **Ant Design 5** e **Prisma ORM**.

Gerencie facilmente postagens, categorias e conteúdo usando uma interface intuitiva.

---

## ✨ Tecnologias Utilizadas

- [Next.js 15](https://nextjs.org/)
- [React 19](https://react.dev/)
- [Ant Design 5](https://ant.design/)
- [NextAuth.js 5](https://next-auth.js.org/)
- [Prisma ORM](https://www.prisma.io/)
- [MySQL](https://www.mysql.com/)
- [React Quill](https://github.com/zenoamaro/react-quill) (Editor WYSIWYG)
- [Zustand](https://github.com/pmndrs/zustand) (State Management)
- [Next Intl](https://next-intl-docs.vercel.app/) (Internacionalização)
- [Nodemailer](https://nodemailer.com/about/) (Envio de e-mails)

---

## ⚙️ Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/viniciuss1001/blog_cms.git
cd blog-cms
```
### 2. Instale dependências

```bash
pnpm install
```
### 3. Configure o ambiente
- Crie um arquivo .env na raiz do projeto, e adicione as seguintes variáveis:

```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/nomedobanco"
NEXTAUTH_SECRET="uma_chave_secreta_aleatória"
NEXTAUTH_URL="http://localhost:3000"
EMAIL_SERVER_USER="seu@email.com"
EMAIL_SERVER_PASSWORD="sua-senha"
EMAIL_SERVER_HOST="smtp.seuprovedor.com"
EMAIL_SERVER_PORT=587
EMAIL_FROM="seu@email.com"
```
### 4. Rode as migrações do banco de dados
```bash
pnpm prisma migrate dev
```
### 5. Inicie o servidor:
```bash
pnpm run dev 
```
## 🖥️ Funcionalidades
- ✅ Cadastro e edição de posts
- ✅ Editor de texto com suporte a formatação (React Quill)
- ✅ Autenticação de usuários (NextAuth)
- ✅ Interface totalmente responsiva e moderna (Ant Design)
- ✅ Sistema de internacionalização (Next Intl)
- ✅ Envio de e-mails com Nodemailer
- ✅ Gerenciamento de estados globais com Zustand
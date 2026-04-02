🚀 Visão Geral

Este projeto é uma API para uma plataforma de listas pessoais, onde usuários podem:

Criar listas (ex: filmes, tarefas, compras)
Adicionar itens dentro das listas
Marcar itens como concluídos ou pendentes
Gerenciar suas próprias listas e itens

🧱 Stack
Next.js (App Router)
Prisma ORM
PostgreSQL (Neon)
JWT para autenticação
Zod para validação
Axios no frontend

🗄️ Banco de dados (Prisma)
Criar nova tabela (model)
Editar:
prisma/schema.prisma
Rodar migration:
npx prisma migrate dev --name nome-da-migration
Gerar client:
npx prisma generate

Atualizar banco em produção (Neon + Vercel)
Se estiver usando deploy:
npx prisma migrate deploy

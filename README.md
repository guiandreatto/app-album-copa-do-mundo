# ⚽ Sticker Tracker - Copa do Mundo

Aplicativo mobile para controle de figurinhas do álbum da Copa do Mundo. Permite criar uma conta, marcar figurinhas obtidas, controlar repetidas e acompanhar o progresso de conclusão do álbum.

> Projeto acadêmico desenvolvido com **Ionic + Angular** no frontend e **Node.js + Express + SQLite** no backend.

---

## 📋 Descrição do Projeto

O **Sticker Tracker** é uma aplicação mobile-first que permite ao usuário:

- Criar conta e fazer login
- Visualizar todas as 400 figurinhas do álbum (20 seleções × 20 jogadores)
- Marcar figurinhas como obtidas e controlar a quantidade
- Identificar figurinhas repetidas para troca
- Acompanhar o progresso geral e por seleção através de dashboards
- Gerenciar seu perfil (editar nome e alterar senha)

---

## 🚀 Tecnologias Utilizadas

### Frontend
- **Ionic** - Framework mobile
- **Angular** - Framework JavaScript (Standalone Components)
- **TypeScript** - Linguagem tipada
- **SCSS** - Pré-processador CSS

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Linguagem tipada
- **better-sqlite3** - Banco de dados SQLite
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas

---

## 📁 Estrutura do Projeto

```
Sticker-tracker-copa/
├── backend/
│   ├── src/
│   │   ├── index.ts                 # Servidor Express
│   │   ├── database/
│   │   │   ├── db.ts                # Conexão SQLite
│   │   │   ├── schema.ts            # Criação das tabelas
│   │   │   └── seed.ts              # Seed com 400 figurinhas
│   │   ├── controllers/             # Controladores das rotas
│   │   ├── services/                # Lógica de negócio
│   │   ├── routes/                  # Definição de rotas
│   │   ├── middleware/              # Middleware de autenticação
│   │   └── models/                  # Interfaces TypeScript
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/               # 7 telas do app
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   ├── reset-password/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── album/
│   │   │   │   ├── repeated/
│   │   │   │   └── profile/
│   │   │   ├── services/            # Serviços HTTP
│   │   │   ├── guards/              # Guards de autenticação
│   │   │   └── interfaces/          # Interfaces TypeScript
│   │   ├── theme/                   # Tema Copa do Mundo
│   │   └── environments/            # Configurações de ambiente
│   ├── package.json
│   └── ionic.config.json
└── README.md
```

---

## ⚙️ Como Instalar

### Pré-requisitos

- **Node.js** versão 18 ou superior
- **npm** versão 9 ou superior

### Backend

```bash
cd backend
npm install
npm run seed
npm run dev
```

O servidor irá iniciar em `http://localhost:3000`.

### Frontend

```bash
cd frontend
npm install
npx ionic serve
```

O aplicativo irá abrir em `http://localhost:8100`.

> **Nota:** É necessário que o backend esteja rodando para o frontend funcionar corretamente.

---

## 🎯 Funcionalidades

### Autenticação
- ✅ Cadastro de novo usuário
- ✅ Login com email e senha
- ✅ Recuperação de senha (simulada)
- ✅ Proteção de rotas com JWT

### Dashboard
- ✅ Total de figurinhas do álbum
- ✅ Figurinhas obtidas e faltantes
- ✅ Figurinhas repetidas
- ✅ Percentual de conclusão
- ✅ Barra de progresso circular
- ✅ Progresso por seleção com barras visuais

### Meu Álbum
- ✅ Listagem de todas as 400 figurinhas
- ✅ Filtros: Todas / Obtidas / Faltantes
- ✅ Busca por nome ou país
- ✅ Controle de quantidade (+/-)
- ✅ Indicadores visuais (obtida, faltante, repetida)

### Figurinhas Repetidas
- ✅ Listagem exclusiva de figurinhas repetidas
- ✅ Resumo com total de extras para troca

### Perfil
- ✅ Visualização de dados do usuário
- ✅ Edição de nome
- ✅ Alteração de senha
- ✅ Logout

### Acessibilidade
- ✅ Labels em todos os campos
- ✅ Atributos aria-label
- ✅ Contraste adequado (WCAG AA)
- ✅ Área mínima de toque 44×44px
- ✅ Textos legíveis
- ✅ Navegação intuitiva

---

## 🗄️ Banco de Dados

### Tabelas

#### users
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | Chave primária |
| name | TEXT | Nome do usuário |
| email | TEXT | Email (único) |
| password | TEXT | Senha (hash bcrypt) |
| created_at | TEXT | Data de criação |

#### stickers
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | Chave primária |
| sticker_number | INTEGER | Número da figurinha |
| player_name | TEXT | Nome do jogador |
| country | TEXT | Seleção |
| position | TEXT | Posição |

#### user_stickers
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | Chave primária |
| user_id | INTEGER | FK → users |
| sticker_id | INTEGER | FK → stickers |
| quantity | INTEGER | Quantidade (0=faltando, 1=obtida, >1=repetidas) |

### Seed
O seed popula o banco com **400 figurinhas** de **20 seleções reais** da Copa do Mundo 2022:

🇧🇷 Brasil · 🇦🇷 Argentina · 🇫🇷 França · 🇩🇪 Alemanha · 🇪🇸 Espanha · 🇵🇹 Portugal · 🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra · 🇳🇱 Holanda · 🇧🇪 Bélgica · 🇭🇷 Croácia · 🇲🇦 Marrocos · 🇯🇵 Japão · 🇰🇷 Coreia do Sul · 🇺🇸 EUA · 🇲🇽 México · 🇺🇾 Uruguai · 🇸🇳 Senegal · 🇨🇭 Suíça · 🇩🇰 Dinamarca · 🇵🇱 Polônia

---

## 🔗 API REST

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/api/auth/register` | Cadastro | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| PUT | `/api/auth/reset-password` | Recuperar senha | ❌ |
| GET | `/api/stickers` | Listar figurinhas | ✅ |
| GET | `/api/stickers/search` | Buscar figurinhas | ✅ |
| GET | `/api/stickers/countries` | Listar países | ✅ |
| GET | `/api/user-stickers` | Figurinhas do usuário | ✅ |
| GET | `/api/user-stickers/repeated` | Figurinhas repetidas | ✅ |
| PUT | `/api/user-stickers/:stickerId` | Atualizar quantidade | ✅ |
| GET | `/api/dashboard` | Estatísticas | ✅ |
| GET | `/api/profile` | Perfil do usuário | ✅ |
| PUT | `/api/profile` | Atualizar nome | ✅ |
| PUT | `/api/profile/password` | Alterar senha | ✅ |
| GET | `/api/health` | Status do servidor | ❌ |

---

## 📱 Telas

1. **Login** - Autenticação do usuário
2. **Cadastro** - Registro de nova conta
3. **Recuperação de Senha** - Reset de senha simulado
4. **Dashboard** - Estatísticas e progresso do álbum
5. **Meu Álbum** - Gerenciamento de figurinhas
6. **Repetidas** - Figurinhas em duplicata
7. **Perfil** - Dados do usuário e configurações

---

## 👤 Autor

Projeto acadêmico desenvolvido como atividade da disciplina.

---

## 📄 Licença

Este projeto é de uso acadêmico.

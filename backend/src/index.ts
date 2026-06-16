import express from 'express';
import cors from 'cors';
import { createTables } from './database/schema';

// Importar rotas
import authRoutes from './routes/auth.routes';
import stickerRoutes from './routes/sticker.routes';
import userStickerRoutes from './routes/user-sticker.routes';
import dashboardRoutes from './routes/dashboard.routes';
import profileRoutes from './routes/profile.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Inicializa o banco de dados (cria tabelas se não existirem)
createTables();

// Registro de rotas
app.use('/api/auth', authRoutes);
app.use('/api/stickers', stickerRoutes);
app.use('/api/user-stickers', userStickerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profile', profileRoutes);

// Rota de verificação de saúde
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Sticker Tracker API está funcionando! ⚽',
    version: '1.0.0',
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`\n🏆 Sticker Tracker API rodando em http://localhost:${PORT}`);
  console.log(`📋 Endpoints disponíveis:`);
  console.log(`   POST   /api/auth/register`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   PUT    /api/auth/reset-password`);
  console.log(`   GET    /api/stickers`);
  console.log(`   GET    /api/stickers/search`);
  console.log(`   GET    /api/stickers/countries`);
  console.log(`   GET    /api/user-stickers`);
  console.log(`   GET    /api/user-stickers/repeated`);
  console.log(`   PUT    /api/user-stickers/:stickerId`);
  console.log(`   GET    /api/dashboard`);
  console.log(`   GET    /api/profile`);
  console.log(`   PUT    /api/profile`);
  console.log(`   PUT    /api/profile/password`);
  console.log(`   GET    /api/health\n`);
});

export default app;

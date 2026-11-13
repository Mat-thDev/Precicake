import express from 'express';
import cors from 'cors';
import { ingredientsRouter } from './routes/ingredients.js';
import { recipesRouter } from './routes/recipes.js';
import { settingsRouter } from './routes/settings.js';
import { backupRouter } from './routes/backup.js';

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'precicake-api' });
});

app.use('/api/ingredients', ingredientsRouter);
app.use('/api/recipes', recipesRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/backup', backupRouter);

// 0.0.0.0 para permitir acesso pelo celular na mesma rede
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[precicake] API rodando em http://localhost:${PORT}/api`);
});

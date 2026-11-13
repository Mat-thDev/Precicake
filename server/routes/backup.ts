import { Router } from 'express';

// TODO: backup e restauração do banco (fase 5)
export const backupRouter = Router();

backupRouter.get('/', (_req, res) => {
  res.json({ message: 'backup não implementado' });
});

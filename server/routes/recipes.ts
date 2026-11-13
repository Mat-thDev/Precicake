import { Router } from 'express';

// TODO: CRUD de receitas e itens (fase 3)
export const recipesRouter = Router();

recipesRouter.get('/', (_req, res) => {
  res.json([]);
});

import { Router } from 'express';

// TODO: CRUD de ingredientes (fase 2)
export const ingredientsRouter = Router();

ingredientsRouter.get('/', (_req, res) => {
  res.json([]);
});

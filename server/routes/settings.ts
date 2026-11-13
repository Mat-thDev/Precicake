import { Router } from 'express';

// TODO: configurações (percentual custos indiretos, multiplicadores) (fase 5)
export const settingsRouter = Router();

settingsRouter.get('/', (_req, res) => {
  res.json({});
});

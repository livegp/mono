import { t } from 'elysia';

export const envSchema = {
  VITE_API_PORT: t.Integer({
      minimum: 1000,
      maximum: 9999,
    }),
  NODE_ENV: t.Union([
    t.Literal('development'),
    t.Literal('production')
  ])
};

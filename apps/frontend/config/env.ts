import { defineConfig } from '@julr/vite-plugin-validate-env';
import { length, nonEmpty, pipe, regex, string, url } from 'valibot';

export default defineConfig({
  validator: 'standard',
  schema: {
    VITE_WEB_PORT: pipe(
      string('VITE_WEB_PORT must be a string'),
      nonEmpty('VITE_WEB_PORT must not be empty'),
      length(4, 'VITE_WEB_PORT must be 4 characters long'),
      regex(/^\d+$/, 'VITE_WEB_PORT must be a number')
    ),
    VITE_WEB_URL: pipe(
      string('VITE_WEB_URL must be a string'),
      nonEmpty('VITE_WEB_URL must not be empty'),
      url('VITE_WEB_URL must be a valid URL')
    ),
    VITE_API_PORT: pipe(
      string('VITE_API_PORT must be a string'),
      nonEmpty('VITE_API_PORT must not be empty'),
      length(4, 'VITE_API_PORT must be 4 characters long'),
      regex(/^\d+$/, 'VITE_API_PORT must be a number')
    ),
    VITE_API_URL: pipe(
      string('VITE_API_URL must be a string'),
      nonEmpty('VITE_API_URL must not be empty'),
      url('VITE_API_URL must be a valid URL')
    ),
    VITE_CORS_ORIGIN: pipe(
      string('VITE_CORS_ORIGIN must be a string'),
      nonEmpty('VITE_CORS_ORIGIN must not be empty'),
      url('VITE_CORS_ORIGIN must be a valid URL')
    ),
  },
});

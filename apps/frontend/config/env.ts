import { defineConfig } from '@julr/vite-plugin-validate-env'
import * as v from 'valibot';

export default defineConfig({
  validator: 'standard',
  schema: {
        VITE_WEB_PORT:
        v.pipe(
          v.string('VITE_WEB_PORT must be a string'),
          v.nonEmpty('VITE_WEB_PORT must not be empty'),
          v.length(4, 'VITE_WEB_PORT must be 4 characters long'),
          v.regex(/^\d+$/, 'VITE_WEB_PORT must be a number'),
        ),
        VITE_WEB_URL:
        v.pipe(
          v.string('VITE_WEB_URL must be a string'),
          v.nonEmpty('VITE_WEB_URL must not be empty'),
          v.url('VITE_WEB_URL must be a valid URL')),
        VITE_API_PORT:
        v.pipe(
          v.string('VITE_API_PORT must be a string'),
          v.nonEmpty('VITE_API_PORT must not be empty'),
          v.length(4, 'VITE_API_PORT must be 4 characters long'),
          v.regex(/^\d+$/, 'VITE_API_PORT must be a number'),
        ),
        VITE_API_URL:
        v.pipe(
          v.string('VITE_API_URL must be a string'),
          v.nonEmpty('VITE_API_URL must not be empty'),
          v.url('VITE_API_URL must be a valid URL')),
        VITE_CORS_ORIGIN:
        v.pipe(
          v.string('VITE_CORS_ORIGIN must be a string'),
          v.nonEmpty('VITE_CORS_ORIGIN must not be empty'),
          v.url('VITE_CORS_ORIGIN must be a valid URL')),
  }
})



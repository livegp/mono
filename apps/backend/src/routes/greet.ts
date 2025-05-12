import { Elysia } from 'elysia'
import { greetParams, type GreetParams } from '../schemas/greet'

export const greetRouter = new Elysia()
  .get('/api/greet/:name', ({ params }: { params: GreetParams }) => {
    return {
      message: `Hello, ${params.name}!`
    }
  }, {
    params: greetParams
  })
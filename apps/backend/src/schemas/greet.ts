import { t } from 'elysia'

export const greetParams = t.Object({
  name: t.String()
})

export type GreetParams = typeof greetParams.static
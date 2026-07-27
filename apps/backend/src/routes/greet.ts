import { Elysia } from "elysia";

import { type GreetParams, greetParams } from "../schemas/greet";

export const greetRouter = new Elysia().get(
  "/api/greet/:name",
  ({ params }: { params: GreetParams }) => ({
    message: `Hello, ${params.name}!`,
  }),
  {
    params: greetParams,
  }
);

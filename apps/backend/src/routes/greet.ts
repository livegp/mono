import { Elysia } from "elysia";

import { greetParams } from "../schemas/greet";
import type { GreetParams } from "../schemas/greet";

export const greetRouter = new Elysia().get(
  "/api/greet/:name",
  ({ params }: { params: GreetParams }) => ({
    message: `Hello, ${params.name}!`,
  }),
  {
    params: greetParams,
  }
);

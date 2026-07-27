import { t } from "elysia";

export const greetParams = t.Object({
  name: t.String({
    minLength: 1,
    maxLength: 100,
    pattern: ".*\\S.*",
  }),
});

export type GreetParams = typeof greetParams.static;

import { t } from "elysia";

export const greetParams = t.Object({
  name: t.String({
    maxLength: 100,
    minLength: 1,
    pattern: ".*\\S.*",
  }),
});

export type GreetParams = typeof greetParams.static;

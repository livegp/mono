import { treaty } from "@elysiajs/eden";
import type { App } from "@mono/backend";

export const api = treaty<App>(window.location.origin);

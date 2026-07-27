import type { ComponentProps } from "react";

import { cn } from "../lib/utils";

export type ButtonProps = ComponentProps<"button">;

export function Button({ className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 font-medium text-sm text-white",
        "transition-colors hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      type={type}
      {...props}
    />
  );
}

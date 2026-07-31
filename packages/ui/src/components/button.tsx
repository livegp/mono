import type { ComponentProps } from "react";

import { cn } from "../lib/utils";

export type ButtonProps = ComponentProps<"button">;

// oxlint-disable react/button-has-type -- The typed prop is constrained and defaults to "button".
export const Button = ({
  className,
  type = "button",
  ...props
}: ButtonProps) => (
  <button
    {...props}
    className={cn(
      "inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white",
      "transition-colors hover:bg-slate-700 focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:outline-none",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    type={type}
  />
);

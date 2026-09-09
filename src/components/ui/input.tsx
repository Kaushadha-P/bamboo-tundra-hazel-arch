import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-md bg-chip px-3 text-sm text-fg placeholder:text-subtle",
        "outline-none ring-1 ring-inset ring-transparent transition-[box-shadow,background-color] duration-150",
        "focus:ring-ring",
        className,
      )}
      {...props}
    />
  );
}

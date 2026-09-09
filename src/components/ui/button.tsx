import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[transform,background-color,color,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 [&_svg]:shrink-0 active:not-disabled:scale-[0.96]",
  {
    variants: {
      variant: {
        default: "bg-fg text-bg hover:bg-fg/90",
        accent: "bg-accent text-accent-fg hover:bg-accent/90",
        ghost: "bg-transparent text-fg hover:bg-chip",
        chip: "bg-chip text-fg hover:bg-hover",
        outline: "bg-transparent text-fg ring-1 ring-inset ring-border hover:bg-chip",
        subtle: "bg-elevated text-fg hover:bg-chip",
      },
      size: {
        sm: "h-8 rounded-sm px-3 text-sm",
        md: "h-10 rounded-md px-4 text-sm",
        lg: "h-12 rounded-lg px-5 text-base",
        icon: "size-10 rounded-full",
        "icon-sm": "size-8 rounded-full",
        "icon-lg": "size-14 rounded-full",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

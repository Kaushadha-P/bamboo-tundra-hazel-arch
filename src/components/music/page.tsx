import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function Page({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-6xl space-y-10 px-4 py-6 sm:px-8", className)}>
      {children}
    </div>
  );
}

export function PageHeader({
  kicker,
  title,
  subtitle,
  actions,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {kicker ? (
          <p className="text-xs font-medium tracking-wide text-muted uppercase">{kicker}</p>
        ) : null}
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-1 max-w-xl text-sm text-muted">{subtitle}</p> : null}
      </div>
      {actions}
    </div>
  );
}

export function FeedSkeleton() {
  return (
    <Page>
      <Skeleton className="h-10 w-48" />
      <div className="flex gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-36 shrink-0 space-y-2 sm:w-40">
            <Skeleton className="aspect-square w-full rounded-md" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-md" />
        ))}
      </div>
    </Page>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <Page>
      <div className="rounded-lg bg-surface px-5 py-10 text-center">
        <p className="font-display text-lg font-semibold">Couldn't load this</p>
        <p className="mt-1 text-sm text-muted">{message}</p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex h-10 items-center rounded-full bg-fg px-4 text-sm font-medium text-bg"
          >
            Try again
          </button>
        ) : null}
      </div>
    </Page>
  );
}

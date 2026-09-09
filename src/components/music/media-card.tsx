import { useNavigate } from "@tanstack/react-router";
import { Play } from "lucide-react";
import type { MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

function MediaLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    void navigate({ to: href as never });
  };
  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}

export function MediaCard({
  href,
  image,
  title,
  subtitle,
  circle = false,
  onPlay,
}: {
  href: string;
  image: string;
  title: string;
  subtitle?: string;
  circle?: boolean;
  onPlay?: () => void;
}) {
  return (
    <article className="group w-36 shrink-0 sm:w-40">
      <div className="relative">
        <MediaLink href={href} className="block">
          <img
            src={image}
            alt=""
            className={cn(
              "cover aspect-square w-full bg-chip object-cover",
              circle ? "rounded-full" : "rounded-md",
            )}
          />
        </MediaLink>
        {onPlay ? (
          <button
            type="button"
            aria-label={`Play ${title}`}
            onClick={(e) => {
              e.preventDefault();
              onPlay();
            }}
            className="absolute right-2 bottom-2 inline-flex size-10 items-center justify-center rounded-full bg-fg text-bg opacity-0 shadow-lg transition-[opacity,transform] duration-150 group-hover:opacity-100 hover:scale-105 max-sm:opacity-100"
          >
            <Play className="size-4 fill-current" style={{ marginLeft: 2 }} />
          </button>
        ) : null}
      </div>
      <MediaLink href={href} className="mt-2 block">
        <h3 className="truncate text-sm font-medium">{title}</h3>
        {subtitle ? <p className="truncate text-xs text-muted">{subtitle}</p> : null}
      </MediaLink>
    </article>
  );
}

export function HScroll({ children }: { children: ReactNode }) {
  return (
    <div className="hide-scroll -mx-4 flex gap-4 overflow-x-auto px-4 pb-1 sm:-mx-8 sm:px-8">
      {children}
    </div>
  );
}

export function Section({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          {subtitle ? (
            <p className="text-xs font-medium tracking-wide text-muted uppercase">{subtitle}</p>
          ) : null}
          <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
            {title}
          </h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

import { cn } from "@/lib/utils";

export default function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border px-6 py-16 text-center",
      className
    )}>
      {Icon && <Icon className="h-12 w-12 text-muted-foreground/40" />}
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

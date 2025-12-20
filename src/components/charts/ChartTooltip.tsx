import type { TooltipProps } from "recharts";

type PayloadItem = {
  name?: string;
  value?: string | number;
  color?: string;
};

export function ChartTooltip({
  active,
  payload,
  label,
}: TooltipProps<string | number, string>) {
  if (!active || !payload?.length) return null;

  const items = payload as unknown as PayloadItem[];

  return (
    <div className="chart-tooltip">
      {label !== undefined && label !== null && (
        <div className="text-xs font-medium text-muted-foreground mb-2">{String(label)}</div>
      )}
      <div className="space-y-1">
        {items.map((p, idx) => (
          <div key={idx} className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="h-2 w-2 rounded-sm flex-shrink-0"
                style={{ backgroundColor: p.color }}
              />
              <span className="text-xs text-foreground truncate">{p.name}</span>
            </div>
            <span className="text-xs font-semibold text-foreground">{String(p.value ?? "")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import {
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { PieChartWidget as PieChartWidgetType } from "../../types/dashboard";

type PieChartWidgetProps = {
  widget: PieChartWidgetType;
  isSelected: boolean;
  onSelect: (widgetId: string) => void;
  onRemove: (widgetId: string) => void;
};

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#a855f7",
  "#f97316",
  "#eab308",
  "#06b6d4",
  "#ec4899",
  "#64748b",
];

function formatNumber(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 2,
  }).format(value);
}

export default function PieChartWidget({
  widget,
  isSelected,
  onSelect,
  onRemove,
}: PieChartWidgetProps) {
  const total = widget.data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div
      onClick={() => onSelect(widget.id)}
      className={[
        "flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border bg-slate-900 shadow-sm shadow-black/10 transition",
        isSelected
          ? "border-blue-500 ring-1 ring-blue-500/30"
          : "border-slate-800 hover:border-slate-600",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3 border-b border-slate-800 p-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-slate-100">
            {widget.title}
          </h3>

          <p className="mt-1 truncate text-xs text-slate-500">
            {widget.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onRemove(widget.id);
          }}
          className="widget-action shrink-0 rounded-md border border-red-500/40 px-2 py-1 text-[10px] text-red-300 transition hover:bg-red-500/10"
        >
          Supprimer
        </button>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[1fr_150px] gap-3 p-3">
        <div className="min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={widget.data}
                dataKey="value"
                nameKey="name"
                innerRadius="55%"
                outerRadius="82%"
                paddingAngle={3}
              >
                {widget.data.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  border: "1px solid #334155",
                  borderRadius: "0.75rem",
                  color: "#e2e8f0",
                  fontSize: "12px",
                }}
                formatter={(value) => [
                  formatNumber(Number(value)),
                  "élément(s)",
                ]}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        <div className="min-w-0 overflow-auto">
          <p className="mb-2 text-[10px] uppercase tracking-[0.16em] text-slate-500">
            Répartition
          </p>

          <div className="space-y-2">
            {widget.data.map((item, index) => {
              const percent = total > 0 ? Math.round((item.value / total) * 100) : 0;

              return (
                <div key={item.name} className="min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />

                      <span className="truncate text-xs text-slate-300">
                        {item.name}
                      </span>
                    </div>

                    <span className="shrink-0 text-xs text-slate-500">
                      {percent}%
                    </span>
                  </div>

                  <p className="ml-4 text-[10px] text-slate-600">
                    {item.value} élément(s)
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-800 px-3 py-2">
        <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-300">
          {widget.collectionPath}
        </span>

        <span className="text-[10px] text-slate-500">
          group by {widget.groupByField}
        </span>
      </div>
    </div>
  );
}
"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BarChartWidget as BarChartWidgetType } from "../../types/dashboard";

type BarChartWidgetProps = {
  widget: BarChartWidgetType;
  isSelected: boolean;
  onSelect: (widgetId: string) => void;
  onRemove: (widgetId: string) => void;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 2,
  }).format(value);
}

export default function BarChartWidget({
  widget,
  isSelected,
  onSelect,
  onRemove,
}: BarChartWidgetProps) {
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

      <div className="min-h-0 flex-1 p-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={widget.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

            <XAxis
              dataKey="label"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={{ stroke: "#334155" }}
              tickLine={{ stroke: "#334155" }}
              interval={0}
              angle={-25}
              textAnchor="end"
              height={55}
            />

            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={{ stroke: "#334155" }}
              tickLine={{ stroke: "#334155" }}
              tickFormatter={(value) => formatNumber(Number(value))}
            />

            <Tooltip
              cursor={{ fill: "rgba(59, 130, 246, 0.08)" }}
              contentStyle={{
                backgroundColor: "#020617",
                border: "1px solid #334155",
                borderRadius: "0.75rem",
                color: "#e2e8f0",
                fontSize: "12px",
              }}
              formatter={(value) => [
                formatNumber(Number(value)),
                widget.valueField,
              ]}
              labelStyle={{
                color: "#93c5fd",
              }}
            />

            <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between border-t border-slate-800 px-3 py-2">
        <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-300">
          {widget.collectionPath}
        </span>

        <span className="text-[10px] text-slate-500">
          {widget.labelField} / {widget.valueField}
        </span>
      </div>
    </div>
  );
}
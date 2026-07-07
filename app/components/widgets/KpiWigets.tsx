"use client";

import { useEffect, useRef, useState } from "react";
import type { KpiWidget as KpiWidgetType } from "../../types/dashboard";

type KpiWidgetProps = {
  widget: KpiWidgetType;
  isSelected: boolean;
  onSelect: (widgetId: string) => void;
  onRemove: (widgetId: string) => void;
};

function getMetricLabel(metric: KpiWidgetType["metric"], fieldName?: string) {
  if (metric === "count") return "Nombre total";
  if (metric === "sum") return `Somme de ${fieldName}`;
  if (metric === "average") return `Moyenne de ${fieldName}`;

  return "Statistique";
}

function getVariantClasses(variant: KpiWidgetType["variant"]) {
  const variants: Record<KpiWidgetType["variant"], string> = {
    blue: "border-blue-500/40 bg-blue-500/10 text-blue-300",
    green: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    purple: "border-purple-500/40 bg-purple-500/10 text-purple-300",
    orange: "border-orange-500/40 bg-orange-500/10 text-orange-300",
  };

  return variants[variant];
}

export default function KpiWidget({
  widget,
  isSelected,
  onSelect,
  onRemove,
}: KpiWidgetProps) {
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!widgetRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;

      if (!rect) return;

      setSize({
        width: rect.width,
        height: rect.height,
      });
    });

    observer.observe(widgetRef.current);

    return () => observer.disconnect();
  }, []);

  const isTiny = size.width < 115 || size.height < 90;
  const isCompact = size.width < 170 || size.height < 135;
  const isComfortable = size.width >= 220 && size.height >= 155;

  return (
    <div
      ref={widgetRef}
      onClick={() => onSelect(widget.id)}
      className={[
        "h-full cursor-pointer overflow-hidden rounded-xl border bg-slate-900 shadow-sm shadow-black/10 transition",
        isTiny ? "p-2" : "p-3",
        isSelected
          ? "border-blue-500 ring-1 ring-blue-500/30"
          : "border-slate-800 hover:border-slate-600",
      ].join(" ")}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-2">
          {!isTiny && (
            <p className="min-w-0 truncate text-xs font-medium text-slate-400">
              {widget.title}
            </p>
          )}

          {isTiny && (
            <p className="min-w-0 truncate text-[10px] font-medium text-slate-500">
              KPI
            </p>
          )}

          {!isCompact && (
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
          )}

          {isCompact && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onRemove(widget.id);
              }}
              className="widget-action shrink-0 rounded-md border border-red-500/40 px-1.5 py-0.5 text-[10px] text-red-300 transition hover:bg-red-500/10"
              title="Supprimer"
            >
              ×
            </button>
          )}
        </div>

        <p
          className={[
            "font-bold leading-none text-white",
            isTiny
              ? "mt-2 text-2xl"
              : isCompact
                ? "mt-2 text-3xl"
                : "mt-3 text-4xl",
          ].join(" ")}
        >
          {widget.value}
        </p>

        {!isTiny && (
          <p
            className={[
              "truncate text-slate-400",
              isCompact ? "mt-2 text-[11px]" : "mt-3 text-xs",
            ].join(" ")}
          >
            {widget.subtitle}
          </p>
        )}

        {!isCompact && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
            <span
              className={[
                "rounded-full border px-2 py-0.5 text-[10px]",
                getVariantClasses(widget.variant),
              ].join(" ")}
            >
              {widget.collectionPath}
            </span>

            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
              {getMetricLabel(widget.metric, widget.field)}
            </span>
          </div>
        )}

        {isCompact && !isTiny && isComfortable && (
          <div className="mt-auto flex flex-wrap gap-1 pt-2">
            <span
              className={[
                "rounded-full border px-2 py-0.5 text-[10px]",
                getVariantClasses(widget.variant),
              ].join(" ")}
            >
              {widget.collectionPath}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
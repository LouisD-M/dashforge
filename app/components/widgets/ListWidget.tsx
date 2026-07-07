"use client";

import type { ListWidget as ListWidgetType } from "../../types/dashboard";

type ListWidgetProps = {
  widget: ListWidgetType;
  isSelected: boolean;
  onSelect: (widgetId: string) => void;
  onRemove: (widgetId: string) => void;
};

export default function ListWidget({
  widget,
  isSelected,
  onSelect,
  onRemove,
}: ListWidgetProps) {
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

      <div className="min-h-0 flex-1 overflow-auto p-2">
        <div className="space-y-2">
          {widget.rows.map((row, index) => (
            <div
              key={row.id}
              className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-950/50 p-2 transition hover:bg-slate-800/40"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-xs font-semibold text-blue-300">
                {index + 1}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-100">
                  {row.primary}
                </p>

                {row.secondary && (
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {row.secondary}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-800 px-3 py-2">
        <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-300">
          {widget.collectionPath}
        </span>

        <span className="text-[10px] text-slate-500">
          {widget.primaryField}
          {widget.secondaryField ? ` / ${widget.secondaryField}` : ""}
        </span>
      </div>
    </div>
  );
}
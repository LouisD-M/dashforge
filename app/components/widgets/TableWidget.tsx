import type { TableWidget as TableWidgetType } from "../../types/dashboard";

type TableWidgetProps = {
  widget: TableWidgetType;
  isSelected: boolean;
  onSelect: (widgetId: string) => void;
  onRemove: (widgetId: string) => void;
};

function formatCellValue(value: unknown) {
  if (value === null || value === undefined) return "-";

  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "Oui" : "Non";

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

export default function TableWidget({
  widget,
  isSelected,
  onSelect,
  onRemove,
}: TableWidgetProps) {
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

      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full min-w-[520px] text-left text-xs">
          <thead className="sticky top-0 z-10 bg-slate-950 text-slate-400">
            <tr>
              {widget.columns.map((column) => (
                <th
                  key={column}
                  className="border-b border-slate-800 px-3 py-2 font-medium"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {widget.rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-slate-800/70 last:border-0 hover:bg-slate-800/40"
              >
                {widget.columns.map((column) => (
                  <td
                    key={column}
                    className="max-w-[220px] truncate px-3 py-2 text-slate-300"
                    title={formatCellValue(row[column])}
                  >
                    {formatCellValue(row[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-800 px-3 py-2">
        <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-300">
          {widget.collectionPath}
        </span>

        <span className="text-[10px] text-slate-500">
          {widget.columns.length} colonne(s)
        </span>
      </div>
    </div>
  );
}
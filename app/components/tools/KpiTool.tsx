import type { ToolType } from "../../types/dashboard";

type KpiToolProps = {
  onSelectTool: (tool: ToolType) => void;
};

export default function KpiTool({ onSelectTool }: KpiToolProps) {
  return (
    <button
      type="button"
      onClick={() => onSelectTool("kpi")}
      className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 text-left transition hover:border-blue-500 hover:bg-slate-800"
    >
      <p className="font-medium">KPI Card</p>
      <p className="mt-1 text-sm text-slate-400">
        Crée une carte statistique depuis une collection détectée.
      </p>
    </button>
  );
}
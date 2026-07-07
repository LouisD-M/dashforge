import type { ToolType } from "../../types/dashboard";

type BarChartToolProps = {
  onSelectTool: (tool: ToolType) => void;
};

export default function BarChartTool({ onSelectTool }: BarChartToolProps) {
  return (
    <button
      type="button"
      onClick={() => onSelectTool("bar-chart")}
      className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 text-left transition hover:border-blue-500 hover:bg-slate-800"
    >
      <p className="font-medium">Graphique en barres</p>

      <p className="mt-1 text-sm text-slate-400">
        Compare une valeur numérique par élément d’une collection.
      </p>
    </button>
  );
}
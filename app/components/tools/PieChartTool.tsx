import type { ToolType } from "../../types/dashboard";

type PieChartToolProps = {
  onSelectTool: (tool: ToolType) => void;
};

export default function PieChartTool({ onSelectTool }: PieChartToolProps) {
  return (
    <button
      type="button"
      onClick={() => onSelectTool("pie-chart")}
      className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 text-left transition hover:border-blue-500 hover:bg-slate-800"
    >
      <p className="font-medium">Pie Chart</p>

      <p className="mt-1 text-sm text-slate-400">
        Affiche une répartition par catégorie ou statut.
      </p>
    </button>
  );
}
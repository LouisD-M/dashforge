import type { ToolType } from "../../types/dashboard";

type TableToolProps = {
  onSelectTool: (tool: ToolType) => void;
};

export default function TableTool({ onSelectTool }: TableToolProps) {
  return (
    <button
      type="button"
      onClick={() => onSelectTool("table")}
      className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 text-left transition hover:border-blue-500 hover:bg-slate-800"
    >
      <p className="font-medium">Tableau</p>

      <p className="mt-1 text-sm text-slate-400">
        Affiche une collection JSON sous forme de tableau.
      </p>
    </button>
  );
}
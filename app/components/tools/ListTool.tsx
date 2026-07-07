import type { ToolType } from "../../types/dashboard";

type ListToolProps = {
  onSelectTool: (tool: ToolType) => void;
};

export default function ListTool({ onSelectTool }: ListToolProps) {
  return (
    <button
      type="button"
      onClick={() => onSelectTool("list")}
      className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 text-left transition hover:border-blue-500 hover:bg-slate-800"
    >
      <p className="font-medium">Liste dynamique</p>

      <p className="mt-1 text-sm text-slate-400">
        Affiche des éléments sous forme de liste compacte.
      </p>
    </button>
  );
}
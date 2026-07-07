import type { DataCollection } from "../../lib/dataAnalyzer";
import type { DashboardWidget, ToolType } from "../../types/dashboard";
import KpiToolPanel from "./KpiToolPanel";

type ToolsSidebarProps = {
  collections: DataCollection[];
  selectedTool: ToolType | null;
  onSelectTool: (tool: ToolType) => void;
  onBack: () => void;
  onAddWidget: (widget: DashboardWidget) => void;
  apiUrl: string;
};

export default function ToolsSidebar({
  collections,
  selectedTool,
  onSelectTool,
  onBack,
  onAddWidget,
  apiUrl,
}: ToolsSidebarProps) {
  const hasCollections = collections.length > 0;

  return (
    <aside className="overflow-auto border-r border-slate-800 bg-slate-900/60 p-4">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
          Builder
        </p>
        <h2 className="mt-2 text-lg font-semibold">Outils</h2>
        <p className="mt-1 text-sm text-slate-400">
          Crée des widgets depuis les données détectées.
        </p>
      </div>

      {!hasCollections ? (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/50 p-4">
          <p className="text-sm font-medium text-slate-300">
            Aucune collection détectée
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Charge une API ou importe un JSON brut pour débloquer les outils.
          </p>
        </div>
      ) : selectedTool === "kpi" ? (
        <KpiToolPanel
          collections={collections}
          onAddWidget={onAddWidget}
          onBack={onBack}
          apiUrl={apiUrl}
        />
      ) : (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => onSelectTool("kpi")}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 text-left transition hover:border-blue-500 hover:bg-slate-800"
          >
            <p className="font-medium">KPI Card</p>
            <p className="mt-1 text-sm text-slate-400">
              Crée une carte statistique depuis une collection.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onSelectTool("table")}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 text-left transition hover:border-blue-500 hover:bg-slate-800"
          >
            <p className="font-medium">Tableau</p>
            <p className="mt-1 text-sm text-slate-400">
              Affiche les lignes d’une collection.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onSelectTool("bar-chart")}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 text-left transition hover:border-blue-500 hover:bg-slate-800"
          >
            <p className="font-medium">Graphique</p>
            <p className="mt-1 text-sm text-slate-400">
              Bientôt : créer un graphique depuis un champ.
            </p>
          </button>
        </div>
      )}
    </aside>
  );
}
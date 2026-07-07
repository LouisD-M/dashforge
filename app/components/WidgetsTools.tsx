type WidgetsToolsProps = {
  onAddKpi: () => void;
};

export default function WidgetsTools({ onAddKpi }: WidgetsToolsProps) {
  return (
    <div className="space-y-3">
      <button
        onClick={onAddKpi}
        className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 text-left transition hover:border-blue-500 hover:bg-slate-800"
      >
        <p className="font-medium">KPI Card</p>
        <p className="mt-1 text-sm text-slate-400">
          Carte statistique simple.
        </p>
      </button>

      <button className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 text-left transition hover:border-blue-500 hover:bg-slate-800">
        <p className="font-medium">Graphique</p>
        <p className="mt-1 text-sm text-slate-400">
          Barres, lignes ou secteurs.
        </p>
      </button>

      <button className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 text-left transition hover:border-blue-500 hover:bg-slate-800">
        <p className="font-medium">Tableau</p>
        <p className="mt-1 text-sm text-slate-400">
          Affichage de données tabulaires.
        </p>
      </button>

      <button className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 text-left transition hover:border-blue-500 hover:bg-slate-800">
        <p className="font-medium">Alerte</p>
        <p className="mt-1 text-sm text-slate-400">
          Message d’information ou warning.
        </p>
      </button>
    </div>
  );
}
"use client";

import { useMemo, useState } from "react";
import DashboardCanvas from "./components/canvas/DashboardCanvas";
import JsonPreview from "./components/output/JsonPreview";
import SourcePanel from "./components/source/SourcePanel";
import KpiTool from "./components/tools/KpiTool";
import KpiToolPanel from "./components/tools/KpiToolPanel";
import { analyzeJsonData } from "./lib/dataAnalyzer";
import type {
  DashboardLayoutItem,
  DashboardWidget,
  ToolType,
} from "./types/dashboard";
import TableTool from "./components/tools/Tabletool";
import TableToolPanel from "./components/tools/TableToolPanel";
import BarChartTool from "./components/tools/BarChartTool";
import BarChartToolPanel from "./components/tools/BarChartToolPanel";
import ListTool from "./components/tools/ListTool";
import ListToolPanel from "./components/tools/ListToolPanel";

const DEFAULT_API_URL = "https://jsonplaceholder.typicode.com/users";

export default function Home() {
  const [sourceData, setSourceData] = useState<unknown>(null);
  const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL);
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [selectedTool, setSelectedTool] = useState<ToolType | null>(null);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
const [layout, setLayout] = useState<DashboardLayoutItem[]>([]);  
  const collections = useMemo(() => {
    return analyzeJsonData(sourceData);
  }, [sourceData]);

const dashboardJson = {
  dashboard: {
    name: "Nouveau dashboard",
    source: {
      apiUrl,
      collections: collections.map((collection) => ({
        id: collection.id,
        label: collection.label,
        path: collection.path,
        count: collection.count,
        fields: collection.fields,
      })),
    },
    widgets,
    layout,
  },
};
const addWidget = (widget: DashboardWidget) => {
  setWidgets((currentWidgets) => [...currentWidgets, widget]);

  setLayout((currentLayout) => {
    const isKpi = widget.type === "kpi";
    const isTable = widget.type === "table";
    const isBarChart = widget.type === "bar-chart";
     const isList = widget.type === "list";

    const newLayoutItem: DashboardLayoutItem = {
      i: widget.id,
      x: 0,
      y: currentLayout.length * 8,

      // Largeur par défaut
      w: isKpi ? 3 : isTable ? 36 : isBarChart ? 32 : isList ? 22 :24,

      // Hauteur par défaut
      h: isKpi ? 1 : isTable ? 1 : isBarChart ? 1 : isList ? 1 : 14,

      // Taille minimale
      minW: isKpi ? 1 : isTable ? 2 : isBarChart ? 2 : isList ? 2 : 12,
      minH: isKpi ? 1 : isTable ? 1 : isBarChart ? 2 : isList ? 2 : 8,

      // Taille maximale
      maxW: isKpi ? 48 : 96,
      maxH: isKpi ? 14 : isTable ? 60 : isBarChart ? 32 : isList ? 22 : 30,
    };

    return [...currentLayout, newLayoutItem];
  });
};

const removeWidget = (widgetId: string) => {
  setWidgets((currentWidgets) =>
    currentWidgets.filter((widget) => widget.id !== widgetId)
  );

  setLayout((currentLayout) =>
    currentLayout.filter((layoutItem) => layoutItem.i !== widgetId)
  );

  setSelectedWidgetId((currentSelectedId) =>
    currentSelectedId === widgetId ? null : currentSelectedId
  );
};

  const hasCollections = collections.length > 0;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950 px-6">
        <div>
          <h1 className="text-lg font-semibold">DashForge</h1>
          <p className="text-xs text-slate-400">
            Dashboard builder depuis API ou JSON brut
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigator.clipboard.writeText(JSON.stringify(dashboardJson, null, 2))
          }
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          Exporter
        </button>
      </header>

      <div className="grid h-[calc(100vh-4rem)] grid-cols-[280px_minmax(0,1fr)_340px]">
        <aside className="overflow-auto border-r border-slate-800 bg-slate-900/60 p-3 text-xs [&_button]:text-xs [&_input]:text-xs [&_label]:text-[11px] [&_p]:text-xs [&_select]:text-xs [&_textarea]:text-xs">
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
    apiUrl={apiUrl}
    onBack={() => setSelectedTool(null)}
    onAddWidget={addWidget}
  />
) : selectedTool === "table" ? (
  <TableToolPanel
    collections={collections}
    onBack={() => setSelectedTool(null)}
    onAddWidget={addWidget}
  />
) : selectedTool === "bar-chart" ? (
  <BarChartToolPanel
    collections={collections}
    onBack={() => setSelectedTool(null)}
    onAddWidget={addWidget}
  />
) : selectedTool === "list" ? (
  <ListToolPanel
    collections={collections}
    onBack={() => setSelectedTool(null)}
    onAddWidget={addWidget}
  />
) : (
  <div className="space-y-3">
    <KpiTool onSelectTool={setSelectedTool} />
    <TableTool onSelectTool={setSelectedTool} />
    <BarChartTool onSelectTool={setSelectedTool} />
    <ListTool onSelectTool={setSelectedTool} />
  </div>
)}
        </aside>
          <DashboardCanvas
            widgets={widgets}
            layout={layout}
            selectedWidgetId={selectedWidgetId}
            onSelectWidget={setSelectedWidgetId}
            onLayoutChange={setLayout}
            onRemoveWidget={removeWidget}
          />
        <aside className="overflow-auto border-l border-slate-800 bg-slate-900/60 p-3 text-xs [&_button]:text-xs [&_input]:text-xs [&_label]:text-[11px] [&_p]:text-xs [&_select]:text-xs [&_textarea]:text-xs">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Source
            </p>
            <h2 className="mt-2 text-lg font-semibold">API / JSON</h2>
            <p className="mt-1 text-sm text-slate-400">
              Charge des données, puis DashForge détecte les collections.
            </p>
          </div>

          <SourcePanel
            apiUrl={apiUrl}
            sourceData={sourceData}
            collections={collections}
            onApiUrlChange={setApiUrl}
            onSourceDataChange={setSourceData}
          />

          <JsonPreview title="JSON dashboard" data={dashboardJson} />

          <JsonPreview
            title="JSON source"
            data={sourceData ?? {}}
            maxHeightClassName="max-h-96"
          />
        </aside>
      </div>
    </main>
  );
}
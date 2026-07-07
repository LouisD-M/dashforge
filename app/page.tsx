"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardCanvas from "./components/canvas/DashboardCanvas";
import JsonPreview from "./components/output/JsonPreview";
import SourcePanel from "./components/source/SourcePanel";
import KpiTool from "./components/tools/KpiTool";
import KpiToolPanel from "./components/tools/KpiToolPanel";
import { analyzeJsonData } from "./lib/dataAnalyzer";
import type {
  DashboardDocument,
  DashboardLayoutItem,
  DashboardWidget,
  SavedDashboard,
  ToolType,
} from "./types/dashboard";
import TableTool from "./components/tools/Tabletool";
import TableToolPanel from "./components/tools/TableToolPanel";
import BarChartTool from "./components/tools/BarChartTool";
import BarChartToolPanel from "./components/tools/BarChartToolPanel";
import ListTool from "./components/tools/ListTool";
import ListToolPanel from "./components/tools/ListToolPanel";

const DEFAULT_API_URL = "https://jsonplaceholder.typicode.com/users";
const STORAGE_KEY = "dashforge-current-dashboard";
const CHANNEL_NAME = "dashforge-dashboard-channel";
const SAVED_DASHBOARDS_KEY = "dashforge-saved-dashboards";

export default function Home() {
  const [sourceData, setSourceData] = useState<unknown>(null);
  const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL);
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [selectedTool, setSelectedTool] = useState<ToolType | null>(null);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
const [layout, setLayout] = useState<DashboardLayoutItem[]>([]);  
const [isCanvasModalOpen, setIsCanvasModalOpen] = useState(false);
const [dashboardName, setDashboardName] = useState("Nouveau dashboard");
const [savedDashboards, setSavedDashboards] = useState<SavedDashboard[]>([]);
  const collections = useMemo(() => {
    return analyzeJsonData(sourceData);
  }, [sourceData]);

const dashboardJson = useMemo<DashboardDocument>(() => {
  return {
    dashboard: {
      name: dashboardName,
      source: {
        apiUrl,
        sourceData,
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
}, [dashboardName, apiUrl, sourceData, collections, widgets, layout]);

useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dashboardJson));

  let channel: BroadcastChannel | null = null;

  if ("BroadcastChannel" in window) {
    channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage(dashboardJson);
  }

  return () => {
    channel?.close();
  };
}, [dashboardJson]);

useEffect(() => {
  try {
    const rawSavedDashboards = localStorage.getItem(SAVED_DASHBOARDS_KEY);

    if (!rawSavedDashboards) return;

    setSavedDashboards(JSON.parse(rawSavedDashboards) as SavedDashboard[]);
  } catch {
    setSavedDashboards([]);
  }
}, []);

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

  const saveDashboard = () => {
  const now = new Date().toISOString();

  const existingDashboard = savedDashboards.find(
    (savedDashboard) => savedDashboard.name === dashboardName
  );

  const savedDashboard: SavedDashboard = {
    id: existingDashboard?.id ?? `dashboard-${Date.now()}`,
    name: dashboardName.trim() || "Dashboard sans nom",
    createdAt: existingDashboard?.createdAt ?? now,
    updatedAt: now,
    document: dashboardJson,
  };

  const nextSavedDashboards = existingDashboard
    ? savedDashboards.map((dashboard) =>
        dashboard.id === existingDashboard.id ? savedDashboard : dashboard
      )
    : [savedDashboard, ...savedDashboards];

  setSavedDashboards(nextSavedDashboards);

  localStorage.setItem(
    SAVED_DASHBOARDS_KEY,
    JSON.stringify(nextSavedDashboards)
  );
};

const loadDashboard = (savedDashboardId: string) => {
  const savedDashboard = savedDashboards.find(
    (dashboard) => dashboard.id === savedDashboardId
  );

  if (!savedDashboard) return;

  const document = savedDashboard.document;

  setDashboardName(document.dashboard.name);
  setApiUrl(document.dashboard.source.apiUrl);
  setSourceData(document.dashboard.source.sourceData ?? null);
  setWidgets(document.dashboard.widgets);
  setLayout(document.dashboard.layout);
  setSelectedTool(null);
  setSelectedWidgetId(null);
};

const deleteSavedDashboard = (savedDashboardId: string) => {
  const nextSavedDashboards = savedDashboards.filter(
    (dashboard) => dashboard.id !== savedDashboardId
  );

  setSavedDashboards(nextSavedDashboards);

  localStorage.setItem(
    SAVED_DASHBOARDS_KEY,
    JSON.stringify(nextSavedDashboards)
  );
};

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
<header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950 px-6">
  <div>
    <h1 className="text-lg font-semibold">DashForge</h1>
    <p className="text-xs text-slate-400">
      Dashboard builder depuis API ou JSON brut
    </p>
  </div>

  <div className="flex items-center gap-2">
    <input
      type="text"
      value={dashboardName}
      onChange={(event) => setDashboardName(event.target.value)}
      className="w-56 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-blue-500"
      placeholder="Nom du dashboard"
    />

    <button
      type="button"
      onClick={saveDashboard}
      className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/20"
    >
      Sauvegarder
    </button>

    <button
      type="button"
      onClick={() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dashboardJson));
        window.open("/preview", "_blank", "noopener,noreferrer");
      }}
      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
    >
      Ouvrir le rendu
    </button>
  </div>
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
          viewMode="embedded"
          onOpenFullscreen={() => setIsCanvasModalOpen(true)}
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

  <section className="mb-6 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
    <div className="mb-3 flex items-center justify-between gap-2">
      <div>
        <p className="text-xs font-semibold text-slate-300">
          Dashboards sauvegardés
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Sauvegarde locale du navigateur
        </p>
      </div>

      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
        {savedDashboards.length}
      </span>
    </div>

    {savedDashboards.length === 0 ? (
      <p className="text-xs text-slate-500">
        Aucun dashboard sauvegardé pour le moment.
      </p>
    ) : (
      <div className="space-y-2">
        {savedDashboards.map((savedDashboard) => (
          <div
            key={savedDashboard.id}
            className="rounded-lg border border-slate-800 bg-slate-900 p-2"
          >
            <p className="truncate text-xs font-medium text-slate-200">
              {savedDashboard.name}
            </p>

            <p className="mt-1 text-[10px] text-slate-500">
              Modifié le{" "}
              {new Date(savedDashboard.updatedAt).toLocaleDateString("fr-FR")} à{" "}
              {new Date(savedDashboard.updatedAt).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => loadDashboard(savedDashboard.id)}
                className="rounded-md border border-blue-500/40 px-2 py-1 text-[10px] text-blue-300 transition hover:bg-blue-500/10"
              >
                Charger
              </button>

              <button
                type="button"
                onClick={() => deleteSavedDashboard(savedDashboard.id)}
                className="rounded-md border border-red-500/40 px-2 py-1 text-[10px] text-red-300 transition hover:bg-red-500/10"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </section>

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
      {isCanvasModalOpen && (
  <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/95 backdrop-blur-sm">
    <div className="mx-auto min-h-screen w-full max-w-[1500px] p-4 sm:p-6">
      <DashboardCanvas
        widgets={widgets}
        layout={layout}
        selectedWidgetId={selectedWidgetId}
        onSelectWidget={setSelectedWidgetId}
        onLayoutChange={setLayout}
        onRemoveWidget={removeWidget}
        viewMode="modal"
        onCloseFullscreen={() => setIsCanvasModalOpen(false)}
      />
    </div>
  </div>
)}


    </main>
    
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import type { DataCollection } from "../../lib/dataAnalyzer";
import type {
  DashboardWidget,
  KpiMetric,
  KpiWidget,
} from "../../types/dashboard";

type KpiToolPanelProps = {
  collections: DataCollection[];
  apiUrl: string;
  onBack: () => void;
  onAddWidget: (widget: DashboardWidget) => void;
};

function createId() {
  return `widget-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 2,
  }).format(value);
}

function getLastUrlSegment(url: string) {
  try {
    const parsedUrl = new URL(url);
    const segments = parsedUrl.pathname.split("/").filter(Boolean);
    return segments.at(-1) || "root";
  } catch {
    return "root";
  }
}

function getCollectionDisplayName(collection: DataCollection, apiUrl: string) {
  if (collection.label === "root") {
    return getLastUrlSegment(apiUrl);
  }

  return collection.label;
}

function getMetricLabel(metric: KpiMetric, fieldName?: string) {
  if (metric === "count") return "Nombre total";
  if (metric === "sum") return `Somme de ${fieldName}`;
  if (metric === "average") return `Moyenne de ${fieldName}`;

  return "Statistique";
}

function calculateMetric(
  collection: DataCollection,
  metric: KpiMetric,
  fieldName: string
) {
  if (metric === "count") {
    return collection.count;
  }

  const values = collection.rows
    .map((row) => row[fieldName])
    .filter((value): value is number => typeof value === "number");

  if (metric === "sum") {
    return values.reduce((total, value) => total + value, 0);
  }

  if (metric === "average") {
    if (values.length === 0) return 0;

    const total = values.reduce((sum, value) => sum + value, 0);
    return total / values.length;
  }

  return 0;
}

export default function KpiToolPanel({
  collections,
  apiUrl,
  onBack,
  onAddWidget,
}: KpiToolPanelProps) {
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [selectedMetric, setSelectedMetric] = useState<KpiMetric>("count");
  const [selectedField, setSelectedField] = useState("");
  const [customTitle, setCustomTitle] = useState("");

  const selectedCollection = useMemo(() => {
    return collections.find(
      (collection) => collection.id === selectedCollectionId
    );
  }, [collections, selectedCollectionId]);

  const numericFields = useMemo(() => {
    if (!selectedCollection) return [];

    return selectedCollection.fields.filter((field) => field.isNumeric);
  }, [selectedCollection]);

const canCreateKpi =
  selectedMetric === "count" || numericFields.length > 0;

  const createKpi = () => {
    if (!selectedCollection) return;

    const fieldName = selectedField || numericFields[0]?.name || "";
    const displayName = getCollectionDisplayName(selectedCollection, apiUrl);

    const metricValue = calculateMetric(
      selectedCollection,
      selectedMetric,
      fieldName
    );

    const title =
      customTitle.trim() ||
      `${getMetricLabel(selectedMetric, fieldName)} - ${displayName}`;

    const newWidget: KpiWidget = {
      id: createId(),
      type: "kpi",
      title,
      value: formatNumber(metricValue),
      subtitle: `${selectedCollection.count} élément(s) dans ${selectedCollection.path}`,
      collectionPath: selectedCollection.path,
      metric: selectedMetric,
      field: selectedMetric === "count" ? undefined : fieldName,
      size: "medium",
    variant: "blue",
    };

    onAddWidget(newWidget);
  };

  useEffect(() => {
    if (collections.length === 0) {
      setSelectedCollectionId("");
      return;
    }

    const currentCollectionExists = collections.some(
      (collection) => collection.id === selectedCollectionId
    );

    if (!currentCollectionExists) {
      setSelectedCollectionId(collections[0].id);
    }
  }, [collections, selectedCollectionId]);

  useEffect(() => {
    if (selectedMetric === "count") {
      setSelectedField("");
      return;
    }

    if (numericFields.length > 0 && !selectedField) {
      setSelectedField(numericFields[0].name);
    }
  }, [selectedMetric, numericFields, selectedField]);

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 text-sm text-slate-400 transition hover:text-slate-200"
      >
        ← Retour aux outils
      </button>

      <h3 className="text-sm font-medium text-slate-300">
        Créer une KPI depuis les données
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        Choisis une collection détectée, puis la statistique à afficher.
      </p>

      <div className="mt-4 space-y-4">
        <div>
          <label className="mb-1 block text-xs text-slate-400">
            Collection
          </label>

          <select
            value={selectedCollectionId}
            onChange={(event) => {
              setSelectedCollectionId(event.target.value);
              setSelectedField("");
              setCustomTitle("");
            }}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300 outline-none focus:border-blue-500"
          >
            {collections.map((collection) => (
              <option key={collection.id} value={collection.id}>
                {getCollectionDisplayName(collection, apiUrl)} —{" "}
                {collection.count} élément(s)
              </option>
            ))}
          </select>
        </div>

        {selectedCollection && (
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
            <p className="text-xs text-slate-500">Chemin JSON</p>
            <p className="mt-1 break-all text-sm text-slate-300">
              {selectedCollection.path}
            </p>
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs text-slate-400">
            Titre personnalisé
          </label>

          <input
            type="text"
            value={customTitle}
            onChange={(event) => setCustomTitle(event.target.value)}
            placeholder="Ex : Nombre d’utilisateurs"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300 outline-none placeholder:text-slate-600 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-slate-400">
            Statistique
          </label>

          <select
            value={selectedMetric}
            onChange={(event) => {
              setSelectedMetric(event.target.value as KpiMetric);
              setSelectedField("");
            }}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300 outline-none focus:border-blue-500"
          >
            <option value="count">Nombre total d’éléments</option>
            <option value="sum">Somme d’un champ numérique</option>
            <option value="average">Moyenne d’un champ numérique</option>
          </select>
        </div>

        {selectedMetric !== "count" && (
          <div>
            <label className="mb-1 block text-xs text-slate-400">
              Champ numérique
            </label>

            <select
              value={selectedField}
              onChange={(event) => setSelectedField(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300 outline-none focus:border-blue-500"
            >
              {numericFields.map((field) => (
                <option key={field.name} value={field.name}>
                  {field.name}
                </option>
              ))}
            </select>

            {numericFields.length === 0 && (
              <p className="mt-2 text-xs text-amber-300">
                Aucun champ numérique détecté pour cette collection.
              </p>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={createKpi}
          disabled={!selectedCollection || !canCreateKpi}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Créer la KPI
        </button>
      </div>
    </section>
  );
}
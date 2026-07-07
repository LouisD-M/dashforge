"use client";

import { useEffect, useMemo, useState } from "react";
import type { DataCollection } from "../../lib/dataAnalyzer";
import type { DashboardWidget, TableWidget } from "../../types/dashboard";

type TableToolPanelProps = {
  collections: DataCollection[];
  onBack: () => void;
  onAddWidget: (widget: DashboardWidget) => void;
};

function createId() {
  return `widget-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function formatCollectionName(collection: DataCollection) {
  if (collection.label === "root") {
    return "root";
  }

  return collection.label;
}

export default function TableToolPanel({
  collections,
  onBack,
  onAddWidget,
}: TableToolPanelProps) {
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [rowLimit, setRowLimit] = useState(10);
  const [customTitle, setCustomTitle] = useState("");

  const selectedCollection = useMemo(() => {
    return collections.find(
      (collection) => collection.id === selectedCollectionId
    );
  }, [collections, selectedCollectionId]);

  const availableColumns = useMemo(() => {
    if (!selectedCollection) return [];

    return selectedCollection.fields.map((field) => field.name);
  }, [selectedCollection]);

  const toggleColumn = (column: string) => {
    setSelectedColumns((currentColumns) => {
      if (currentColumns.includes(column)) {
        return currentColumns.filter((currentColumn) => currentColumn !== column);
      }

      return [...currentColumns, column];
    });
  };

  const createTable = () => {
    if (!selectedCollection) return;
    if (selectedColumns.length === 0) return;

    const collectionName = formatCollectionName(selectedCollection);

    const newWidget: TableWidget = {
      id: createId(),
      type: "table",
      title: customTitle.trim() || `Tableau ${collectionName}`,
      subtitle: `${Math.min(rowLimit, selectedCollection.rows.length)} ligne(s) affichée(s) sur ${selectedCollection.count}`,
      collectionPath: selectedCollection.path,
      columns: selectedColumns,
      rows: selectedCollection.rows.slice(0, rowLimit),
    };

    onAddWidget(newWidget);
  };

  useEffect(() => {
    if (collections.length === 0) {
      setSelectedCollectionId("");
      setSelectedColumns([]);
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
    if (!selectedCollection) return;

    const defaultColumns = selectedCollection.fields
      .slice(0, 5)
      .map((field) => field.name);

    setSelectedColumns(defaultColumns);
    setCustomTitle("");
  }, [selectedCollection]);

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
        Créer un tableau
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        Choisis une collection, les colonnes à afficher et le nombre de lignes.
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
              setSelectedColumns([]);
            }}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300 outline-none focus:border-blue-500"
          >
            {collections.map((collection) => (
              <option key={collection.id} value={collection.id}>
                {formatCollectionName(collection)} — {collection.count} élément(s)
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
            placeholder="Ex : Liste des utilisateurs"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300 outline-none placeholder:text-slate-600 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-slate-400">
            Nombre de lignes
          </label>

          <input
            type="number"
            min={1}
            max={100}
            value={rowLimit}
            onChange={(event) => setRowLimit(Number(event.target.value))}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-xs text-slate-400">
              Colonnes
            </label>

            <span className="text-xs text-slate-500">
              {selectedColumns.length} sélectionnée(s)
            </span>
          </div>

          <div className="max-h-60 space-y-2 overflow-auto rounded-lg border border-slate-800 bg-slate-950 p-2">
            {availableColumns.length === 0 ? (
              <p className="text-sm text-slate-500">
                Aucune colonne détectée.
              </p>
            ) : (
              availableColumns.map((column) => (
                <label
                  key={column}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-slate-300 transition hover:bg-slate-900"
                >
                  <input
                    type="checkbox"
                    checked={selectedColumns.includes(column)}
                    onChange={() => toggleColumn(column)}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-900"
                  />

                  <span className="truncate">{column}</span>
                </label>
              ))
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={createTable}
          disabled={!selectedCollection || selectedColumns.length === 0}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Créer le tableau
        </button>
      </div>
    </section>
  );
}
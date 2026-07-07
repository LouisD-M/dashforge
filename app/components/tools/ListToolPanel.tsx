"use client";

import { useEffect, useMemo, useState } from "react";
import type { DataCollection } from "../../lib/dataAnalyzer";
import type { DashboardWidget, ListWidget } from "../../types/dashboard";

type ListToolPanelProps = {
  collections: DataCollection[];
  onBack: () => void;
  onAddWidget: (widget: DashboardWidget) => void;
};

function createId() {
  return `widget-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function formatValue(value: unknown) {
  if (value === null || value === undefined) return "-";

  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "Oui" : "Non";

  if (typeof value === "object") return JSON.stringify(value);

  return String(value);
}

function getCollectionName(collection: DataCollection) {
  return collection.label === "root" ? "root" : collection.label;
}

export default function ListToolPanel({
  collections,
  onBack,
  onAddWidget,
}: ListToolPanelProps) {
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [primaryField, setPrimaryField] = useState("");
  const [secondaryField, setSecondaryField] = useState("");
  const [rowLimit, setRowLimit] = useState(6);
  const [customTitle, setCustomTitle] = useState("");

  const selectedCollection = useMemo(() => {
    return collections.find(
      (collection) => collection.id === selectedCollectionId
    );
  }, [collections, selectedCollectionId]);

  const availableFields = useMemo(() => {
    if (!selectedCollection) return [];

    return selectedCollection.fields.filter(
      (field) =>
        field.type === "string" ||
        field.type === "number" ||
        field.type === "boolean"
    );
  }, [selectedCollection]);

  const createList = () => {
    if (!selectedCollection) return;
    if (!primaryField) return;

    const collectionName = getCollectionName(selectedCollection);

    const rows = selectedCollection.rows.slice(0, rowLimit).map((row, index) => {
      return {
        id: `${index}-${formatValue(row[primaryField])}`,
        primary: formatValue(row[primaryField]),
        secondary: secondaryField ? formatValue(row[secondaryField]) : undefined,
      };
    });

    const newWidget: ListWidget = {
      id: createId(),
      type: "list",
      title: customTitle.trim() || `Liste ${collectionName}`,
      subtitle: `${rows.length} élément(s) affiché(s) sur ${selectedCollection.count}`,
      collectionPath: selectedCollection.path,
      primaryField,
      secondaryField: secondaryField || undefined,
      rows,
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
    if (!selectedCollection) return;

    const firstTextField =
      availableFields.find((field) => field.type === "string")?.name ||
      availableFields[0]?.name ||
      "";

    const secondField =
      availableFields.find((field) => field.name !== firstTextField)?.name || "";

    setPrimaryField(firstTextField);
    setSecondaryField(secondField);
    setCustomTitle("");
  }, [selectedCollection, availableFields]);

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
        Créer une liste dynamique
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        Choisis une collection, un champ principal et un champ secondaire.
      </p>

      <div className="mt-4 space-y-4">
        <div>
          <label className="mb-1 block text-xs text-slate-400">
            Collection
          </label>

          <select
            value={selectedCollectionId}
            onChange={(event) => setSelectedCollectionId(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300 outline-none focus:border-blue-500"
          >
            {collections.map((collection) => (
              <option key={collection.id} value={collection.id}>
                {getCollectionName(collection)} — {collection.count} élément(s)
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
            placeholder="Ex : Derniers utilisateurs"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300 outline-none placeholder:text-slate-600 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-slate-400">
            Champ principal
          </label>

          <select
            value={primaryField}
            onChange={(event) => setPrimaryField(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300 outline-none focus:border-blue-500"
          >
            {availableFields.map((field) => (
              <option key={field.name} value={field.name}>
                {field.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs text-slate-400">
            Champ secondaire
          </label>

          <select
            value={secondaryField}
            onChange={(event) => setSecondaryField(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300 outline-none focus:border-blue-500"
          >
            <option value="">Aucun</option>

            {availableFields.map((field) => (
              <option key={field.name} value={field.name}>
                {field.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs text-slate-400">
            Nombre d’éléments
          </label>

          <input
            type="number"
            min={1}
            max={30}
            value={rowLimit}
            onChange={(event) => setRowLimit(Number(event.target.value))}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300 outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="button"
          onClick={createList}
          disabled={!selectedCollection || !primaryField}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Créer la liste
        </button>
      </div>
    </section>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";
import type { DataCollection } from "../../lib/dataAnalyzer";

type SourcePanelProps = {
  apiUrl: string;
  sourceData: unknown;
  collections: DataCollection[];
  onApiUrlChange: (url: string) => void;
  onSourceDataChange: (data: unknown) => void;
};

async function fetchApi(url: string) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status}`);
  }

  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export default function SourcePanel({
  apiUrl,
  sourceData,
  collections,
  onApiUrlChange,
  onSourceDataChange,
}: SourcePanelProps) {
  const [rawJson, setRawJson] = useState("");
  const [sourceError, setSourceError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const hasLoadedOnMount = useRef(false);

  const loadApi = async () => {
    if (!apiUrl.trim()) {
      setSourceError("Merci de renseigner une URL d’API.");
      return;
    }

    try {
      setIsLoading(true);
      setSourceError("");

      const data = await fetchApi(apiUrl);

      onSourceDataChange(data);
    } catch (error) {
      setSourceError(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue pendant la requête."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadRawJson = () => {
    if (!rawJson.trim()) {
      setSourceError("Colle un JSON brut avant de l’importer.");
      return;
    }

    try {
      setSourceError("");

      const parsedJson = JSON.parse(rawJson);

      onSourceDataChange(parsedJson);
    } catch {
      setSourceError("Le JSON brut n’est pas valide.");
    }
  };

  useEffect(() => {
    if (hasLoadedOnMount.current) return;

    hasLoadedOnMount.current = true;
    loadApi();
  }, []);

  return (
    <>
      <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-300">Requête API</h3>

          <span className="rounded-full border border-slate-700 px-2 py-1 text-xs text-slate-400">
            GET
          </span>
        </div>

        <div className="mt-4 space-y-3">
          <input
            type="text"
            value={apiUrl}
            onChange={(event) => onApiUrlChange(event.target.value)}
            placeholder="https://api.example.com/data"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300 outline-none placeholder:text-slate-600 focus:border-blue-500"
          />

          <button
            type="button"
            onClick={loadApi}
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Chargement..." : "Charger depuis l’API"}
          </button>
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
        <h3 className="text-sm font-medium text-slate-300">
          Import JSON brut
        </h3>

        <textarea
          value={rawJson}
          onChange={(event) => setRawJson(event.target.value)}
          rows={7}
          placeholder='{"users":[{"id":1,"name":"Louis"}]}'
          className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-300 outline-none placeholder:text-slate-600 focus:border-blue-500"
        />

        <button
          type="button"
          onClick={loadRawJson}
          className="mt-3 w-full rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
        >
          Importer ce JSON
        </button>
      </section>

      {sourceError && (
        <div className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
          {sourceError}
        </div>
      )}

      <section className="mt-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
        <h3 className="text-sm font-medium text-slate-300">
          Collections détectées
        </h3>

        {collections.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            Aucune collection détectée.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="rounded-lg border border-slate-800 bg-slate-950 p-3"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium text-slate-200">
                    {collection.label}
                  </p>

                  <span className="rounded-full bg-blue-500/10 px-2 py-1 text-xs text-blue-300">
                    {collection.count}
                  </span>
                </div>

                <p className="mt-1 break-all text-xs text-slate-500">
                  {collection.path}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {collection.fields.slice(0, 8).map((field) => (
                    <span
                      key={field.name}
                      className={[
                        "rounded-full border px-2 py-1 text-xs",
                        field.isNumeric
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                          : "border-slate-700 text-slate-300",
                      ].join(" ")}
                    >
                      {field.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
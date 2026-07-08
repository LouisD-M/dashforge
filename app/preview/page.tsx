"use client";

import { useEffect, useState } from "react";
import DashboardRenderer from "../components/render/DashboardRenderer";
import type { DashboardDocument } from "../types/dashboard";
import { downloadCurrentPreviewHtml } from "../lib/previewExporter";
const STORAGE_KEY = "dashforge-current-dashboard";
const CHANNEL_NAME = "dashforge-dashboard-channel";

function readDashboardFromStorage() {
  try {
    const rawDashboard = localStorage.getItem(STORAGE_KEY);

    if (!rawDashboard) return null;

    return JSON.parse(rawDashboard) as DashboardDocument;
  } catch {
    return null;
  }
}

export default function PreviewPage() {
  const [dashboardDocument, setDashboardDocument] =
    useState<DashboardDocument | null>(null);

  useEffect(() => {
    setDashboardDocument(readDashboardFromStorage());

    let channel: BroadcastChannel | null = null;

    if ("BroadcastChannel" in window) {
      channel = new BroadcastChannel(CHANNEL_NAME);

      channel.onmessage = (event) => {
        setDashboardDocument(event.data as DashboardDocument);
      };
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;

      setDashboardDocument(readDashboardFromStorage());
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      channel?.close();
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (!dashboardDocument) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center">
          <h1 className="text-lg font-semibold">Aucun dashboard à afficher</h1>

          <p className="mt-2 text-sm text-slate-400">
            Ouvre cette page depuis le builder DashForge pour afficher le rendu.
          </p>
        </div>
      </main>
    );
  }

  return (
  <main className="min-h-screen bg-slate-950 text-slate-100">
    <div className="fixed right-4 top-4 z-50">
<button
  type="button"
  data-export-ignore="true"
  onClick={() => downloadCurrentPreviewHtml()}
  className="rounded-lg border border-blue-500/40 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-200 backdrop-blur transition hover:bg-blue-500/20"
>
  Exporter cette preview
</button>
    </div>

    <DashboardRenderer dashboardDocument={dashboardDocument} />
  </main>
);
}
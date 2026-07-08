"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ComponentType, CSSProperties, ReactNode } from "react";
import GridLayoutBase from "react-grid-layout";
import type {
  DashboardDocument,
  DashboardLayoutItem,
} from "../../types/dashboard";
import KpiWidget from "../widgets/KpiWigets";
import TableWidget from "../widgets/TableWidget";
import BarChartWidget from "../widgets/BarChartWidget";
import ListWidget from "../widgets/ListWidget";
import PieChartWidget from "../widgets/PieChartWidget";

type DashboardRendererProps = {
  dashboardDocument: DashboardDocument;
};

type ResizeHandle = "s" | "w" | "e" | "n" | "sw" | "nw" | "se" | "ne";

type TypedGridLayoutProps = {
  className?: string;
  layout: DashboardLayoutItem[];
  cols: number;
  maxRows?: number;
  rowHeight: number;
  width: number;
  margin?: [number, number];
  containerPadding?: [number, number];
  autoSize?: boolean;
  compactType?: "vertical" | "horizontal" | null;
  preventCollision?: boolean;
  isDraggable?: boolean;
  isResizable?: boolean;
  isBounded?: boolean;
  draggableCancel?: string;
  resizeHandles?: ResizeHandle[];
  onLayoutChange?: (layout: DashboardLayoutItem[]) => void;
  style?: CSSProperties;
  children: ReactNode;
};

const GridLayout =
  GridLayoutBase as unknown as ComponentType<TypedGridLayoutProps>;

const GRID_COLUMNS = 96;
const ROW_HEIGHT = 7;

export default function DashboardRenderer({
  dashboardDocument,
}: DashboardRendererProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(1100);

  const widgets = dashboardDocument.dashboard.widgets;
  const layout = dashboardDocument.dashboard.layout;

  const canvasHeight = useMemo(() => {
    const maxBottom = layout.reduce((max, item) => {
      return Math.max(max, item.y + item.h);
    }, 0);

    return Math.max(900, (maxBottom + 12) * ROW_HEIGHT);
  }, [layout]);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;

      if (width) {
        setContainerWidth(Math.floor(width));
      }
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              DashForge Render
            </p>

            <h1 className="mt-1 text-xl font-semibold">
              {dashboardDocument.dashboard.name}
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Source : {dashboardDocument.dashboard.source.apiUrl || "JSON brut"}
            </p>
          </div>

          <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
            Synchronisé en temps réel
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-6 py-6">
        <div
          ref={containerRef}
          style={{ minHeight: canvasHeight }}
          className="rounded-2xl border border-slate-800 bg-slate-900/30 p-4 [&_.widget-action]:hidden"
        >
          {widgets.length === 0 ? (
            <div className="flex min-h-[600px] items-center justify-center">
              <div className="text-center">
                <h2 className="text-lg font-semibold">Aucun widget</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Crée des widgets dans le builder pour les afficher ici.
                </p>
              </div>
            </div>
          ) : (
            <GridLayout
              className="layout"
              layout={layout}
              cols={GRID_COLUMNS}
              maxRows={500}
              rowHeight={ROW_HEIGHT}
              width={Math.max(containerWidth - 32, 320)}
              margin={[8, 4]}
              containerPadding={[0, 0]}
              autoSize={false}
              compactType={null}
              preventCollision={false}
              isDraggable={false}
              isResizable={false}
              isBounded={false}
            >
              {widgets.map((widget) => {
                if (widget.type === "kpi") {
                  return (
                    <div key={widget.id} className="h-full">
                      <KpiWidget
                        widget={widget}
                        isSelected={false}
                        onSelect={() => {}}
                        onRemove={() => {}}
                      />
                    </div>
                  );
                }

                if (widget.type === "table") {
                  return (
                    <div key={widget.id} className="h-full">
                      <TableWidget
                        widget={widget}
                        isSelected={false}
                        onSelect={() => {}}
                        onRemove={() => {}}
                      />
                    </div>
                  );
                }

                if (widget.type === "bar-chart") {
                  return (
                    <div key={widget.id} className="h-full">
                      <BarChartWidget
                        widget={widget}
                        isSelected={false}
                        onSelect={() => {}}
                        onRemove={() => {}}
                      />
                    </div>
                  );
                }

                if (widget.type === "list") {
                  return (
                    <div key={widget.id} className="h-full">
                      <ListWidget
                        widget={widget}
                        isSelected={false}
                        onSelect={() => {}}
                        onRemove={() => {}}
                      />
                    </div>
                  );
                }

                if (widget.type === "pie-chart") {
                return (
                  <div key={widget.id} className="h-full">
                    <PieChartWidget
                      widget={widget}
                      isSelected={false}
                      onSelect={() => {}}
                      onRemove={() => {}}
                    />
                  </div>
                );
              }

                return null;
              })}
            </GridLayout>
          )}
        </div>
      </main>
    </div>
  );
}
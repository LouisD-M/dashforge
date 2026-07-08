"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentType, CSSProperties, ReactNode } from "react";
import GridLayoutBase from "react-grid-layout";
import type {
  DashboardLayoutItem,
  DashboardWidget,
} from "../../types/dashboard";
import KpiWidget from "../widgets/KpiWigets";
import TableWidget from "../widgets/TableWidget";
import BarChartWidget from "../widgets/BarChartWidget";
import ListWidget from "../widgets/ListWidget";
import PieChartWidget from "../widgets/PieChartWidget";

type DashboardCanvasProps = {
  widgets: DashboardWidget[];
  layout: DashboardLayoutItem[];
  selectedWidgetId: string | null;
  onSelectWidget: (widgetId: string) => void;
  onLayoutChange: (layout: DashboardLayoutItem[]) => void;
  onRemoveWidget: (widgetId: string) => void;
  viewMode?: "embedded" | "modal";
  onOpenFullscreen?: () => void;
  onCloseFullscreen?: () => void;
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
const EMBEDDED_ROW_HEIGHT = 7;
const MODAL_ROW_HEIGHT = 9;
const EMBEDDED_CANVAS_HEIGHT = 560;

export default function DashboardCanvas({
  widgets,
  layout,
  selectedWidgetId,
  onSelectWidget,
  onLayoutChange,
  onRemoveWidget,
  viewMode = "embedded",
  onOpenFullscreen,
  onCloseFullscreen,
}: DashboardCanvasProps) {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(900);

  const isModal = viewMode === "modal";

const rowHeight = isModal ? MODAL_ROW_HEIGHT : EMBEDDED_ROW_HEIGHT;
const gridRows = isModal ? 100 : 80;
const canvasHeight = isModal
  ? "calc(100vh - 190px)"
  : `${EMBEDDED_CANVAS_HEIGHT}px`;

  useEffect(() => {
    if (!canvasRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;

      if (width) {
        setCanvasWidth(Math.floor(width));
      }
    });

    observer.observe(canvasRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={
        isModal
          ? "bg-slate-950 p-4 sm:p-6"
          : "overflow-auto bg-slate-950 p-6"
      }
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
            Canvas
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            {isModal ? "Canvas grand format" : "Dashboard en construction"}
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            {isModal
              ? "Travaille ton dashboard avec plus d’espace vertical."
              : "Déplace et redimensionne tes widgets dans la grille."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">
            {widgets.length} widget{widgets.length > 1 ? "s" : ""}
          </div>

          {!isModal && (
            <button
              type="button"
              onClick={onOpenFullscreen}
              className="rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-2 text-xs font-medium text-blue-300 transition hover:bg-blue-500/20"
            >
              Ouvrir en grand
            </button>
          )}

          {isModal && (
            <button
              type="button"
              onClick={onCloseFullscreen}
              className="rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs font-medium text-red-300 transition hover:bg-red-500/20"
            >
              Fermer
            </button>
          )}
        </div>
      </div>

      <div
        ref={canvasRef}
        style={{ height: canvasHeight }}
        className={[
          "rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-3",
          isModal ? "overflow-hidden" : "overflow-hidden",
        ].join(" ")}
      >
        {widgets.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="max-w-sm text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-3xl text-slate-400">
                +
              </div>

              <h3 className="text-lg font-semibold">Dashboard vide</h3>

              <p className="mt-2 text-sm text-slate-400">
                Charge une API ou colle un JSON brut, puis crée un widget.
              </p>
            </div>
          </div>
        ) : (
          <GridLayout
            className="layout"
            layout={layout}
            cols={GRID_COLUMNS}
            maxRows={gridRows}
            rowHeight={rowHeight}
            width={Math.max(canvasWidth - 24, 320)}
            margin={[8, 4]}
            containerPadding={[0, 0]}
            autoSize={false}
            compactType={null}
            preventCollision={false}
            isDraggable
            isResizable
            isBounded
            draggableCancel=".widget-action"
            resizeHandles={["se", "s", "e"]}
            onLayoutChange={onLayoutChange}
          >
            {widgets.map((widget) => {
              if (widget.type === "kpi") {
                return (
                  <div key={widget.id} className="h-full">
                    <KpiWidget
                      widget={widget}
                      isSelected={selectedWidgetId === widget.id}
                      onSelect={onSelectWidget}
                      onRemove={onRemoveWidget}
                    />
                  </div>
                );
              }

              if (widget.type === "table") {
                return (
                  <div key={widget.id} className="h-full">
                    <TableWidget
                      widget={widget}
                      isSelected={selectedWidgetId === widget.id}
                      onSelect={onSelectWidget}
                      onRemove={onRemoveWidget}
                    />
                  </div>
                );
              }

              if (widget.type === "bar-chart") {
                return (
                  <div key={widget.id} className="h-full">
                    <BarChartWidget
                      widget={widget}
                      isSelected={selectedWidgetId === widget.id}
                      onSelect={onSelectWidget}
                      onRemove={onRemoveWidget}
                    />
                  </div>
                );
              }

              if (widget.type === "list") {
                return (
                  <div key={widget.id} className="h-full">
                    <ListWidget
                      widget={widget}
                      isSelected={selectedWidgetId === widget.id}
                      onSelect={onSelectWidget}
                      onRemove={onRemoveWidget}
                    />
                  </div>
                );
              }

              if (widget.type === "pie-chart") {
  return (
    <div key={widget.id} className="h-full">
      <PieChartWidget
        widget={widget}
        isSelected={selectedWidgetId === widget.id}
        onSelect={onSelectWidget}
        onRemove={onRemoveWidget}
      />
    </div>
  );
}

              return null;
            })}
          </GridLayout>
        )}
      </div>
    </section>
  );
}
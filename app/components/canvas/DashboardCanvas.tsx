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


type DashboardCanvasProps = {
  widgets: DashboardWidget[];
  layout: DashboardLayoutItem[];
  selectedWidgetId: string | null;
  onSelectWidget: (widgetId: string) => void;
  onLayoutChange: (layout: DashboardLayoutItem[]) => void;
  onRemoveWidget: (widgetId: string) => void;
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
const GRID_ROWS = 80;
const CANVAS_HEIGHT = 560;
const ROW_HEIGHT = CANVAS_HEIGHT / GRID_ROWS;


export default function DashboardCanvas({
  widgets,
  layout,
  selectedWidgetId,
  onSelectWidget,
  onLayoutChange,
  onRemoveWidget,
}: DashboardCanvasProps) {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(900);

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
    <section className="overflow-auto bg-slate-950 p-3">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
            Canvas
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Dashboard en construction
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Déplace et redimensionne tes widgets dans la grille.
          </p>
        </div>

        <div className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">
          {widgets.length} widget{widgets.length > 1 ? "s" : ""}
        </div>
      </div>

      <div
        ref={canvasRef}
        style={{ height: CANVAS_HEIGHT }}
        className="overflow-hidden rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-3"
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
  maxRows={GRID_ROWS}
  rowHeight={ROW_HEIGHT}
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
  return null;
})}
</GridLayout>
        )}
      </div>
    </section>
  );
}
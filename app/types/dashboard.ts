export type ToolType = "kpi" | "table" | "bar-chart" | "list" | "pie-chart";

export type KpiMetric = "count" | "sum" | "average";

export type WidgetSize = "small" | "medium" | "large";
export type WidgetVariant = "blue" | "green" | "purple" | "orange";

export type DashboardLayoutItem = {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
};

export type KpiWidget = {
  id: string;
  type: "kpi";
  title: string;
  value: string;
  subtitle: string;
  collectionPath: string;
  metric: KpiMetric;
  field?: string;
  size: WidgetSize;
  variant: WidgetVariant;
};

export type TableWidget = {
  id: string;
  type: "table";
  title: string;
  subtitle: string;
  collectionPath: string;
  columns: string[];
  rows: Record<string, unknown>[];
};


export type BarChartWidget = {
  id: string;
  type: "bar-chart";
  title: string;
  subtitle: string;
  collectionPath: string;
  labelField: string;
  valueField: string;
  data: {
    label: string;
    value: number;
  }[];
};

export type ListWidget = {
  id: string;
  type: "list";
  title: string;
  subtitle: string;
  collectionPath: string;
  primaryField: string;
  secondaryField?: string;
  rows: {
    id: string;
    primary: string;
    secondary?: string;
  }[];
};

export type DashboardDocument = {
  dashboard: {
    name: string;
    source: {
      apiUrl: string;
      sourceData: unknown;
      collections: {
        id: string;
        label: string;
        path: string;
        count: number;
        fields: {
          name: string;
          type: string;
          isNumeric: boolean;
          isText: boolean;
        }[];
      }[];
    };
    widgets: DashboardWidget[];
    layout: DashboardLayoutItem[];
  };
};
export type SavedDashboard = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  document: DashboardDocument;
};

export type PieChartWidget = {
  id: string;
  type: "pie-chart";
  title: string;
  subtitle: string;
  collectionPath: string;
  groupByField: string;
  data: {
    name: string;
    value: number;
  }[];
};

export type DashboardWidget = KpiWidget | TableWidget | BarChartWidget | ListWidget | PieChartWidget;
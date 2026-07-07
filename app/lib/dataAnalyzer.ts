export type FieldType = "string" | "number" | "boolean" | "object" | "array" | "null" | "unknown";

export type FieldInfo = {
  name: string;
  type: FieldType;
  isNumeric: boolean;
  isText: boolean;
};

export type DataCollection = {
  id: string;
  label: string;
  path: string;
  count: number;
  rows: Record<string, unknown>[];
  fields: FieldInfo[];
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getValueType(value: unknown): FieldType {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  if (typeof value === "string") return "string";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "object") return "object";

  return "unknown";
}

function normalizeRows(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    return value.filter(isObject);
  }

  if (isObject(value)) {
    return [value];
  }

  return [];
}

function analyzeFields(rows: Record<string, unknown>[]): FieldInfo[] {
  const fieldNames = new Set<string>();

  for (const row of rows) {
    Object.keys(row).forEach((key) => fieldNames.add(key));
  }

  return Array.from(fieldNames).map((fieldName) => {
    const sampleValue = rows.find((row) => row[fieldName] !== undefined)?.[fieldName];
    const type = getValueType(sampleValue);

    return {
      name: fieldName,
      type,
      isNumeric: type === "number",
      isText: type === "string",
    };
  });
}

function createCollection(
  label: string,
  path: string,
  value: unknown
): DataCollection | null {
  const rows = normalizeRows(value);

  if (rows.length === 0) {
    return null;
  }

  return {
    id: path,
    label,
    path,
    count: rows.length,
    rows,
    fields: analyzeFields(rows),
  };
}

export function analyzeJsonData(data: unknown): DataCollection[] {
  const collections: DataCollection[] = [];

  if (Array.isArray(data)) {
    const rootCollection = createCollection("root", "root", data);

    if (rootCollection) {
      collections.push(rootCollection);
    }

    return collections;
  }

  if (!isObject(data)) {
    return collections;
  }

  const rootCollection = createCollection("root", "root", data);

  if (rootCollection) {
    collections.push(rootCollection);
  }

  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      const collection = createCollection(key, key, value);

      if (collection) {
        collections.push(collection);
      }
    }

    if (isObject(value)) {
      for (const [nestedKey, nestedValue] of Object.entries(value)) {
        if (Array.isArray(nestedValue)) {
          const path = `${key}.${nestedKey}`;
          const collection = createCollection(nestedKey, path, nestedValue);

          if (collection) {
            collections.push(collection);
          }
        }
      }
    }
  }

  return collections;
}
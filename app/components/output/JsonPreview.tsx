type JsonPreviewProps = {
  title: string;
  data: unknown;
  maxHeightClassName?: string;
};

export default function JsonPreview({
  title,
  data,
  maxHeightClassName = "max-h-72",
}: JsonPreviewProps) {
  return (
    <section className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-300">{title}</h3>

        <button
          type="button"
          onClick={() =>
            navigator.clipboard.writeText(JSON.stringify(data ?? {}, null, 2))
          }
          className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-400 transition hover:bg-slate-800"
        >
          Copier
        </button>
      </div>

      <pre
        className={`${maxHeightClassName} overflow-auto rounded-lg bg-slate-950 text-xs text-slate-500`}
      >
        {JSON.stringify(data ?? {}, null, 2)}
      </pre>
    </section>
  );
}
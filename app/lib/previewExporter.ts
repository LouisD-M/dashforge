export function downloadCurrentPreviewHtml(filename = "dashforge-preview.html") {
  const html = buildHtmlFromDocument(document, filename);
  downloadHtml(html, filename);
}

export async function downloadPreviewRouteHtml(
  filename = "dashforge-dashboard.html"
) {
  const iframe = document.createElement("iframe");

  iframe.src = "/preview";
  iframe.style.position = "fixed";
  iframe.style.left = "-99999px";
  iframe.style.top = "0";
  iframe.style.width = "1440px";
  iframe.style.height = "1000px";
  iframe.style.opacity = "0";
  iframe.style.pointerEvents = "none";

  document.body.appendChild(iframe);

  await new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      reject(new Error("Timeout pendant le chargement de la preview."));
    }, 5000);

    iframe.onload = () => {
      window.setTimeout(() => {
        window.clearTimeout(timeout);
        resolve();
      }, 700);
    };
  });

  const iframeDocument = iframe.contentDocument;

  if (!iframeDocument) {
    iframe.remove();
    throw new Error("Impossible de lire la preview.");
  }

  const html = buildHtmlFromDocument(iframeDocument, filename);

  iframe.remove();

  downloadHtml(html, filename);
}

function buildHtmlFromDocument(sourceDocument: Document, title: string) {
  const clonedBody = sourceDocument.body.cloneNode(true) as HTMLElement;

  clonedBody.querySelectorAll("[data-export-ignore='true']").forEach((element) => {
    element.remove();
  });

  clonedBody.querySelectorAll("script").forEach((script) => {
    script.remove();
  });

  const styleTags: string[] = [];

  Array.from(sourceDocument.styleSheets).forEach((styleSheet) => {
    try {
      const rules = Array.from(styleSheet.cssRules)
        .map((rule) => rule.cssText)
        .join("\n");

      if (rules.trim()) {
        styleTags.push(`<style>${rules}</style>`);
      }
    } catch {
      // Certains styles externes peuvent être inaccessibles.
    }
  });

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  ${styleTags.join("\n")}
</head>
${clonedBody.outerHTML}
</html>`;
}

function downloadHtml(html: string, filename: string) {
  const blob = new Blob([html], {
    type: "text/html;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
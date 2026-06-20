function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/** Strips inline HTML tags from EditorJS / rich-text fragments. */
function stripHtmlTags(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function textFromEditorJs(value: unknown): string | undefined {
  if (!isRecord(value) || !Array.isArray(value.blocks)) return undefined;

  const parts: string[] = [];
  for (const block of value.blocks) {
    if (!isRecord(block) || !isRecord(block.data)) continue;
    const text = block.data.text;
    if (typeof text === "string" && text.trim()) {
      parts.push(stripHtmlTags(text.trim()));
    }
  }

  const joined = parts.filter(Boolean).join(" ");
  return joined || undefined;
}

/**
 * Normalizes BFF `description` for the PDP subtitle — Saleor often sends
 * EditorJS JSON (`blocks[].data.text`); we show joined plain text only.
 */
export function plainTextFromDescription(raw: unknown): string | undefined {
  if (raw == null) return undefined;

  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) return undefined;

    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed) as unknown;
        const fromEditor = textFromEditorJs(parsed);
        if (fromEditor) return fromEditor;
      } catch {
        // Not JSON — fall through to plain / HTML handling.
      }
    }

    if (trimmed.includes("<") && trimmed.includes(">")) {
      const plain = stripHtmlTags(trimmed);
      return plain || undefined;
    }

    return trimmed;
  }

  if (isRecord(raw)) {
    if (typeof raw.text === "string") {
      const plain = stripHtmlTags(raw.text.trim());
      return plain || undefined;
    }
    return textFromEditorJs(raw);
  }

  return undefined;
}

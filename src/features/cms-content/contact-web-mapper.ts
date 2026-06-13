import type {
  ContactGetInTouchItem,
  ContactWebContent,
} from "./contact-web-types";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readString(record: UnknownRecord, ...keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return "";
}

function readMediaUrl(record: UnknownRecord, ...keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
    if (!isRecord(value)) continue;

    const direct = readString(value, "url", "src", "href");
    if (direct) return direct;
  }
  return "";
}

function isActive(record: UnknownRecord): boolean {
  const value = record.is_active ?? record.isActive;
  if (value === false || value === "false") return false;
  return true;
}

function splitDescription(text: string): string[] {
  return text
    .replace(/\u2028/g, "\n")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function mapGetInTouchItem(raw: UnknownRecord): ContactGetInTouchItem | null {
  if (!isActive(raw)) return null;

  const label = readString(raw, "info_heading", "title", "label");
  const iconSrc = readMediaUrl(raw, "icon", "image", "imageUrl");
  const description = readString(raw, "description", "value", "body");
  const lines = description ? splitDescription(description) : [];

  if (!label || !iconSrc) return null;

  return { label, lines, iconSrc };
}

/** Maps `get_in_touch` rows from the contact-web single type. */
export function mapContactWebGetInTouch(
  input: ContactWebContent,
): ContactGetInTouchItem[] {
  return [...(input.get_in_touch ?? [])]
    .sort(
      (a, b) =>
        (((a as UnknownRecord).sort_order as number | undefined) ?? 0) -
        (((b as UnknownRecord).sort_order as number | undefined) ?? 0),
    )
    .map((item) => mapGetInTouchItem(item as UnknownRecord))
    .filter((item): item is ContactGetInTouchItem => item !== null);
}

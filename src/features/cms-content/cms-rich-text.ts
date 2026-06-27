function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripHtmlTags(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function looksLikeHtml(value: string): boolean {
  return /<[a-z][\s\S]*>/i.test(value);
}

function looksLikeMarkdown(value: string): boolean {
  return /^#{1,6}\s/m.test(value) || /\*\*.+?\*\*/.test(value);
}

function parseInlineMarkdown(text: string): string {
  return text
    .split(/(\*\*.+?\*\*)/g)
    .map((part) => {
      const boldMatch = /^\*\*(.+)\*\*$/.exec(part);
      if (boldMatch?.[1]) {
        return `<strong>${escapeHtml(boldMatch[1])}</strong>`;
      }
      return escapeHtml(part);
    })
    .join("");
}

function markdownTextToHtml(text: string): string {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const headingMatch = /^(#{1,6})\s+(.+)$/.exec(line);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const inner = parseInlineMarkdown(headingMatch[2]);
        return `<h${level}>${inner}</h${level}>`;
      }
      return `<p>${parseInlineMarkdown(line)}</p>`;
    })
    .join("");
}

function plainTextToHtml(text: string): string {
  const paragraphs = text
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return "";
  return paragraphs.map((part) => `<p>${escapeHtml(part)}</p>`).join("");
}

function renderStrapiInlineNodes(nodes: unknown[]): string {
  return nodes.map(renderStrapiInlineNode).join("");
}

function renderStrapiInlineNode(node: unknown): string {
  if (!isRecord(node)) return "";

  if (node.type === "text" && typeof node.text === "string") {
    let text = escapeHtml(node.text);
    if (node.bold) text = `<strong>${text}</strong>`;
    if (node.italic) text = `<em>${text}</em>`;
    if (node.underline) text = `<u>${text}</u>`;
    if (node.strikethrough) text = `<s>${text}</s>`;
    if (node.code) text = `<code>${text}</code>`;
    return text;
  }

  if (node.type === "link" && typeof node.url === "string") {
    const children = Array.isArray(node.children)
      ? renderStrapiInlineNodes(node.children)
      : "";
    return `<a href="${escapeHtml(node.url)}">${children}</a>`;
  }

  if (Array.isArray(node.children)) {
    return renderStrapiInlineNodes(node.children);
  }

  return "";
}

function renderStrapiBlock(block: unknown): string {
  if (!isRecord(block)) return "";

  const type = typeof block.type === "string" ? block.type : "";
  const children = Array.isArray(block.children) ? block.children : [];
  const inner = renderStrapiInlineNodes(children);

  if (type === "paragraph") {
    return inner.trim() ? `<p>${inner}</p>` : "";
  }

  if (type === "heading") {
    const level =
      typeof block.level === "number" && block.level >= 1 && block.level <= 6
        ? block.level
        : 2;
    return inner.trim() ? `<h${level}>${inner}</h${level}>` : "";
  }

  if (type === "list") {
    const tag = block.format === "ordered" ? "ol" : "ul";
    const items = children
      .map((child) => {
        if (!isRecord(child) || child.type !== "list-item") return "";
        const itemChildren = Array.isArray(child.children) ? child.children : [];
        const itemInner = renderStrapiInlineNodes(itemChildren);
        return itemInner.trim() ? `<li>${itemInner}</li>` : "";
      })
      .filter(Boolean)
      .join("");
    return items ? `<${tag}>${items}</${tag}>` : "";
  }

  if (type === "quote") {
    return inner.trim() ? `<blockquote>${inner}</blockquote>` : "";
  }

  if (type === "code" && Array.isArray(block.children) && block.children.length > 0) {
    const codeNode = block.children[0];
    if (isRecord(codeNode) && typeof codeNode.text === "string") {
      return `<pre><code>${escapeHtml(codeNode.text)}</code></pre>`;
    }
  }

  return inner.trim() ? `<p>${inner}</p>` : "";
}

function htmlFromStrapiBlocks(blocks: unknown[]): string | undefined {
  const html = blocks.map(renderStrapiBlock).filter(Boolean).join("");
  return html || undefined;
}

function htmlFromEditorJs(value: Record<string, unknown>): string | undefined {
  if (!Array.isArray(value.blocks)) return undefined;

  const parts: string[] = [];
  for (const block of value.blocks) {
    if (!isRecord(block) || !isRecord(block.data)) continue;
    const text = block.data.text;
    if (typeof text === "string" && text.trim()) {
      parts.push(`<p>${text.trim()}</p>`);
    }
  }

  const html = parts.join("");
  return html || undefined;
}

function parseJsonRichText(value: string): unknown {
  if (!value.startsWith("{") && !value.startsWith("[")) return undefined;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return undefined;
  }
}

/**
 * Normalizes Strapi / BFF rich text (HTML, blocks, EditorJS, or plain text)
 * into sanitized HTML for trusted CMS rendering.
 */
export function richTextToHtml(raw: unknown): string | undefined {
  if (raw == null) return undefined;

  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) return undefined;

    const parsed = parseJsonRichText(trimmed);
    if (parsed !== undefined) {
      const fromParsed = richTextToHtml(parsed);
      if (fromParsed) return fromParsed;
    }

    if (looksLikeHtml(trimmed)) return trimmed;

    if (looksLikeMarkdown(trimmed)) {
      return markdownTextToHtml(trimmed) || undefined;
    }

    return plainTextToHtml(trimmed) || undefined;
  }

  if (Array.isArray(raw)) {
    return htmlFromStrapiBlocks(raw);
  }

  if (isRecord(raw)) {
    if (typeof raw.html === "string" && raw.html.trim()) {
      return raw.html.trim();
    }

    if (typeof raw.text === "string" && raw.text.trim()) {
      const text = raw.text.trim();
      return looksLikeHtml(text) ? text : plainTextToHtml(text);
    }

    return htmlFromEditorJs(raw) ?? htmlFromStrapiBlocks([raw]);
  }

  return undefined;
}

/** Plain-text extraction for maps search, aria labels, and metadata. */
export function richTextToPlainText(raw: unknown): string | undefined {
  const html = richTextToHtml(raw);
  if (html) {
    const plain = stripHtmlTags(html);
    return plain || undefined;
  }

  if (typeof raw === "string") {
    const trimmed = raw.trim();
    return trimmed || undefined;
  }

  return undefined;
}

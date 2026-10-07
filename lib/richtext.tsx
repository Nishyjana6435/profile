import { documentToReactComponents, type Options } from "@contentful/rich-text-react-renderer";
import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";
import { BLOCKS, INLINES, MARKS, type Block, type Document, type Inline, type Text } from "@contentful/rich-text-types";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import CopyButton from "@/components/CopyButton";

export function richTextToPlainText(document?: Document): string {
  if (!document) return "";
  return documentToPlainTextString(document);
}

/** Words per minute for the reading-time estimate. */
export function readingMinutes(document?: Document): number {
  const words = richTextToPlainText(document).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/* ---------- helpers ---------- */

type AnyNode = Block | Inline | Text;

const isText = (n: AnyNode): n is Text => n.nodeType === "text";

/** A paragraph whose every text run carries the `code` mark is a code block. */
function codeBlockText(node: Block): string | null {
  const runs = node.content.filter((c) => !(isText(c) && c.value === ""));
  if (runs.length === 0) return null;
  const allCode = runs.every((c) => isText(c) && c.marks.some((m) => m.type === MARKS.CODE));
  if (!allCode) return null;
  const text = runs.map((c) => (isText(c) ? c.value : "")).join("");
  // single short inline snippets stay inline; multi-line or long runs become blocks
  return text.includes("\n") || text.length > 60 ? text : null;
}

/** Guess a language label from a leading "```lang" line or a comment hint. */
function splitLanguage(text: string): { lang?: string; code: string } {
  const m = text.match(/^```?\s*([a-zA-Z0-9+#-]+)\s*\n([\s\S]*?)(?:\n```)?$/);
  if (m) return { lang: m[1], code: m[2] };
  const hint = text.match(/^(?:\/\/|#)\s*(?:lang|language):\s*([a-zA-Z0-9+#-]+)\s*\n/);
  if (hint) return { lang: hint[1], code: text.slice(hint[0].length) };
  return { code: text };
}

/** Contentful has no code block, so authors often paste code into a quote. Spot those. */
function looksLikeCode(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  const prose = (t.match(/[.!?]\s+[A-Z]/g) ?? []).length >= 2 || /\b(the|and|which|that)\b/i.test(t) && !/[{}();=<>]/.test(t);
  const codey = /[{}();=<>]|^\s*(npm|yarn|pnpm|npx|git|cd|curl|docker|pip|brew)\b|^\s*(const|let|var|import|export|function|return|router|app)\b/m.test(t) || /\S{40,}/.test(t);
  return codey && !prose;
}

/** Straighten the curly quotes a CMS editor turns code into. */
const straighten = (s: string) => s.replace(/[\u201C\u201D]/g, '"').replace(/[\u2018\u2019]/g, "'");

function CodeBlock({ code, lang, title }: { code: string; lang?: string; title?: string }) {
  const lines = code.replace(/\s+$/, "").split("\n");
  return (
    <figure className="rt-pre not-prose">
      <div className="rt-pre-bar">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="label ml-2 text-white/50">{title ?? lang ?? "code"}</span>
        </span>
        <CopyButton text={code} />
      </div>
      <pre className="rt-pre-body" tabIndex={0}>
        <code>
          {lines.map((l, i) => (
            <span key={i} className="rt-line">
              <span className="rt-ln" aria-hidden="true">{i + 1}</span>
              <span>{l || " "}</span>
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}

type AssetLike = { fields?: { title?: string; description?: string; file?: { url?: string; contentType?: string; details?: { image?: { width: number; height: number } } } } };
type EntryLike = { sys?: { contentType?: { sys?: { id?: string } } }; fields?: Record<string, unknown> };

function EmbeddedAsset({ asset }: { asset: AssetLike }) {
  const file = asset.fields?.file;
  if (!file?.url) return null;
  const url = `https:${file.url}`;
  const type = file.contentType ?? "";
  const title = asset.fields?.title ?? "";
  const caption = asset.fields?.description;

  if (type.startsWith("image/")) {
    const w = file.details?.image?.width ?? 1600;
    const h = file.details?.image?.height ?? 900;
    return (
      <figure className="rt-figure">
        <a href={url} target="_blank" rel="noopener noreferrer" className="block">
          <Image src={url} alt={title} width={w} height={h} sizes="(min-width: 768px) 720px, 100vw" className="h-auto w-full" unoptimized={type === "image/gif" || type === "image/svg+xml" || !url.includes("ctfassets.net")} />
        </a>
        {(caption || title) && <figcaption>{caption || title}</figcaption>}
      </figure>
    );
  }
  if (type.startsWith("video/")) {
    return (
      <figure className="rt-figure">
        <video src={url} controls playsInline className="w-full" />
        {caption && <figcaption>{caption}</figcaption>}
      </figure>
    );
  }
  return (
    <p>
      <a href={url} target="_blank" rel="noopener noreferrer" className="rt-link">
        {title || "Download file"}
      </a>
    </p>
  );
}

/** Embedded entries: a `codeBlock`-style entry (code + language) renders as a block; others are skipped. */
function EmbeddedEntry({ entry }: { entry: EntryLike }) {
  const f = entry.fields ?? {};
  const code = (f.code ?? f.snippet ?? f.body) as string | undefined;
  if (typeof code === "string") {
    return <CodeBlock code={code} lang={typeof f.language === "string" ? f.language : undefined} title={typeof f.title === "string" ? f.title : undefined} />;
  }
  return null;
}

const options: Options = {
  renderMark: {
    [MARKS.BOLD]: (t) => <strong>{t}</strong>,
    [MARKS.ITALIC]: (t) => <em>{t}</em>,
    [MARKS.UNDERLINE]: (t) => <u>{t}</u>,
    [MARKS.CODE]: (t) => <code className="rt-code">{t}</code>,
    [MARKS.STRIKETHROUGH]: (t) => <s>{t}</s>,
    [MARKS.SUPERSCRIPT]: (t) => <sup>{t}</sup>,
    [MARKS.SUBSCRIPT]: (t) => <sub>{t}</sub>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => {
      const code = codeBlockText(node as Block);
      if (code !== null) {
        const { lang, code: body } = splitLanguage(straighten(code));
        return <CodeBlock code={body} lang={lang} />;
      }
      return <p>{children}</p>;
    },
    [BLOCKS.HEADING_1]: (_n, c) => <h2 className="rt-h1">{c}</h2>,
    [BLOCKS.HEADING_2]: (_n, c) => <h2>{c}</h2>,
    [BLOCKS.HEADING_3]: (_n, c) => <h3>{c}</h3>,
    [BLOCKS.HEADING_4]: (_n, c) => <h4>{c}</h4>,
    [BLOCKS.HEADING_5]: (_n, c) => <h5>{c}</h5>,
    [BLOCKS.HEADING_6]: (_n, c) => <h6>{c}</h6>,
    [BLOCKS.UL_LIST]: (_n, c) => <ul>{c}</ul>,
    [BLOCKS.OL_LIST]: (_n, c) => <ol>{c}</ol>,
    [BLOCKS.LIST_ITEM]: (_n, c) => <li>{c}</li>,
    [BLOCKS.QUOTE]: (node, c) => {
      const text = documentToPlainTextString(node as Block);
      if (looksLikeCode(text)) {
        const { lang, code } = splitLanguage(straighten(text));
        return <CodeBlock code={code} lang={lang} />;
      }
      return <blockquote>{c}</blockquote>;
    },
    [BLOCKS.HR]: () => <hr />,
    [BLOCKS.TABLE]: (_n, c) => (
      <div className="rt-table">
        <table>
          <tbody>{c}</tbody>
        </table>
      </div>
    ),
    [BLOCKS.TABLE_ROW]: (_n, c) => <tr>{c}</tr>,
    [BLOCKS.TABLE_HEADER_CELL]: (_n, c) => <th>{c}</th>,
    [BLOCKS.TABLE_CELL]: (_n, c) => <td>{c}</td>,
    [BLOCKS.EMBEDDED_ASSET]: (node) => <EmbeddedAsset asset={node.data?.target as AssetLike} />,
    [BLOCKS.EMBEDDED_ENTRY]: (node) => <EmbeddedEntry entry={node.data?.target as EntryLike} />,
    [INLINES.EMBEDDED_ENTRY]: (node) => <EmbeddedEntry entry={node.data?.target as EntryLike} />,
    [INLINES.HYPERLINK]: (node, children) => {
      const href = String(node.data?.uri ?? "#");
      const internal = href.startsWith("/") || href.startsWith("https://www.nishyai.com");
      return internal ? (
        <Link href={href.replace("https://www.nishyai.com", "")} className="rt-link">{children}</Link>
      ) : (
        <a href={href} target="_blank" rel="noopener noreferrer" className="rt-link">{children}</a>
      );
    },
    [INLINES.ASSET_HYPERLINK]: (node, children) => {
      const url = (node.data?.target as AssetLike)?.fields?.file?.url;
      return url ? <a href={`https:${url}`} target="_blank" rel="noopener noreferrer" className="rt-link">{children}</a> : <>{children}</>;
    },
    [INLINES.ENTRY_HYPERLINK]: (node, children) => {
      const slug = (node.data?.target as EntryLike)?.fields?.slug;
      return typeof slug === "string" ? <Link href={`/blog/${slug}`} className="rt-link">{children}</Link> : <>{children}</>;
    },
  },
  renderText: (text) =>
    text.split("\n").reduce<ReactNode[]>((acc, seg, i) => (i === 0 ? [seg] : [...acc, <br key={i} />, seg]), []),
};

export function RichText({ document, className = "" }: { document?: Document; className?: string }) {
  if (!document) return null;
  return <div className={`rt ${className}`}>{documentToReactComponents(document, options)}</div>;
}

/** Crisp copy helpers: one sentence, trimmed to a readable length. */
export function firstSentence(text: string | undefined, max = 170): string {
  if (!text) return "";
  const clean = text.replace(/\s+/g, " ").trim();
  const m = clean.match(/^.*?[.!?](?=\s|$)/);
  let out = m ? m[0] : clean;
  if (out.length > max) {
    out = out.slice(0, max);
    out = out.slice(0, out.lastIndexOf(" ")).replace(/[,;:]$/, "") + "…";
  }
  return out;
}

export const pad = (n: number) => String(n).padStart(2, "0");

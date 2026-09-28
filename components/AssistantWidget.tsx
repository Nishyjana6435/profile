"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { compact, LIMITS, type ChatMessage } from "@/lib/assistant/compact";
import AssistantAvatar from "./AssistantAvatar";
import { WHATSAPP_URL } from "./Contact";

type Shown = ChatMessage & { id: string; blocked?: boolean; error?: boolean };
type Saved = { messages: Shown[]; summary: string; sessionId: string };

const STORE = "nishy-assistant:v1";
const HINT = "nishy-assistant:hint";
const WELCOME =
  "Hi, I'm Nishy's assistant. Ask me about Agent Studio, Flows, Nishy's work, or how he can build an AI system for your business.";
const SUGGESTIONS = [
  "What is Agent Studio?",
  "How does Flows work?",
  "Can Nishy build an AI system for my business?",
  "How do I contact Nishy?",
];

const uid = () => Math.random().toString(36).slice(2, 10);

function load(): Saved {
  try {
    const raw = sessionStorage.getItem(STORE);
    if (raw) {
      const v = JSON.parse(raw) as Saved;
      if (Array.isArray(v.messages)) return v;
    }
  } catch {}
  return { messages: [], summary: "", sessionId: uid() + uid() };
}
function save(v: Saved) {
  try {
    sessionStorage.setItem(STORE, JSON.stringify({ ...v, messages: v.messages.slice(-60) }));
  } catch {}
}

const LINK_CLS = "text-violet-300 underline underline-offset-2 hover:text-white";

/** Inline markdown: [text](url), **bold**, bare URLs and nishy.space hosts. */
function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|\*\*([^*]+)\*\*|(https?:\/\/[^\s)]+|(?:[a-z0-9-]+\.)+nishy\.space[^\s),]*)/gi;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${keyBase}-${m.index}`;
    if (m[1] && m[2]) {
      out.push(<a key={k} href={m[2]} target="_blank" rel="noopener noreferrer" className={LINK_CLS}>{m[1]}</a>);
    } else if (m[3]) {
      out.push(<strong key={k} className="font-semibold text-white">{m[3]}</strong>);
    } else if (m[4]) {
      const href = m[4].startsWith("http") ? m[4] : `https://${m[4]}`;
      out.push(<a key={k} href={href} target="_blank" rel="noopener noreferrer" className={LINK_CLS}>{m[4].replace(/^https?:\/\//, "")}</a>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Light markdown for agent replies: paragraphs, bullet and numbered lists, inline links and bold. */
function Rich({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  const lines = text.replace(/\r/g, "").split("\n");
  let list: { ordered: boolean; items: string[] } | null = null;
  const flush = (i: number) => {
    if (!list) return;
    const Tag = list.ordered ? "ol" : "ul";
    blocks.push(
      <Tag key={`l${i}`} className={`my-1.5 space-y-1 pl-4 ${list.ordered ? "list-decimal" : "list-disc"} marker:text-violet-300/70`}>
        {list.items.map((it, j) => <li key={j}>{inline(it, `l${i}-${j}`)}</li>)}
      </Tag>,
    );
    list = null;
  };
  lines.forEach((raw, i) => {
    const line = raw.trimEnd();
    const bullet = line.match(/^\s*[-*•]\s+(.*)$/);
    const num = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (bullet || num) {
      const ordered = Boolean(num);
      if (!list || list.ordered !== ordered) {
        flush(i);
        list = { ordered, items: [] };
      }
      list.items.push((bullet ?? num)![1]);
      return;
    }
    flush(i);
    if (!line.trim()) return;
    const heading = line.match(/^#{1,4}\s+(.*)$/);
    blocks.push(
      <p key={`p${i}`} className={`break-words ${heading ? "font-semibold text-white" : ""} [&:not(:first-child)]:mt-1.5`}>
        {inline(heading ? heading[1] : line, `p${i}`)}
      </p>,
    );
  });
  flush(lines.length);
  return <div>{blocks}</div>;
}

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<Saved | null>(null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState(false);
  const [ready, setReady] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Only appear when the server says the agent is configured.
  useEffect(() => {
    let live = true;
    fetch("/api/assistant", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { configured?: boolean }) => live && setReady(Boolean(d.configured)))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  // Hydrate from this browser session.
  useEffect(() => {
    const s = load();
    const t = setTimeout(() => {
      setState(s);
      let seen = false;
      try {
        seen = sessionStorage.getItem(HINT) === "1";
      } catch {}
      if (!seen && !s.messages.length) setHint(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (state) save(state);
  }, [state]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [state?.messages.length, busy, open]);

  const dismissHint = () => {
    setHint(false);
    try {
      sessionStorage.setItem(HINT, "1");
    } catch {}
  };

  const send = useCallback(
    async (text: string) => {
      const content = text.trim().slice(0, LIMITS.maxMessageChars);
      if (!content || busy || !state) return;
      const userMsg: Shown = { id: uid(), role: "user", content };
      const history = [...state.messages.filter((m) => !m.error), userMsg];
      // Compact long chats for this browser session before sending.
      const { summary, recent } = compact(
        history.map(({ role, content }) => ({ role, content })),
        state.summary,
      );
      setState({ ...state, messages: [...state.messages, userMsg] });
      setInput("");
      setBusy(true);
      try {
        const res = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: recent, summary, sessionId: state.sessionId }),
        });
        const data = (await res.json().catch(() => ({}))) as { output?: string; blocked?: boolean; error?: string; summary?: string };
        setState((s) =>
          s
            ? {
                ...s,
                summary: data.summary ?? summary,
                messages: [
                  ...s.messages,
                  res.ok && data.output
                    ? { id: uid(), role: "assistant", content: data.output, blocked: data.blocked }
                    : { id: uid(), role: "assistant", content: data.error ?? "Something went wrong. Please try again.", error: true },
                ],
              }
            : s,
        );
      } catch {
        setState((s) =>
          s ? { ...s, messages: [...s.messages, { id: uid(), role: "assistant", content: "You seem to be offline. Please try again.", error: true }] } : s,
        );
      } finally {
        setBusy(false);
      }
    },
    [busy, state],
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };
  const clear = () => state && setState({ messages: [], summary: "", sessionId: state.sessionId });

  const messages = state?.messages ?? [];
  const compacted = Boolean(state?.summary);

  if (!ready) return null;

  return (
    <div className="as-root fixed bottom-5 right-5 z-[60] sm:bottom-6 sm:right-6">
      {/* chat panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="false"
        aria-label="Chat with Nishy's assistant"
        className={`as-panel fixed inset-x-3 bottom-24 top-20 flex flex-col overflow-hidden rounded-3xl border border-white/15 sm:absolute sm:inset-auto sm:bottom-20 sm:right-0 sm:h-[min(640px,calc(100vh-8rem))] sm:w-[400px] ${open ? "is-open" : ""}`}
      >
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-fuchsia-500/25 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -left-20 bottom-10 h-56 w-56 rounded-full bg-sky-500/15 blur-3xl" />

        {/* header */}
        <div className="relative flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
          <AssistantAvatar size={42} talking={busy} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">Nishy&apos;s Assistant</p>
            <p className="flex items-center gap-1.5 text-[11px] text-white/55">
              <span className="relative flex h-1.5 w-1.5">
                <span className="fx-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              {busy ? "Thinking…" : "Online · powered by Agent Studio"}
            </p>
          </div>
          {messages.length > 0 && (
            <button type="button" onClick={clear} className="rounded-full px-2.5 py-1 text-[11px] text-white/55 transition-colors hover:bg-white/10 hover:text-white">
              New chat
            </button>
          )}
          <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="grid h-8 w-8 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>

        {/* messages */}
        <div ref={listRef} className="as-list relative flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
          <div className="as-msg flex gap-2.5">
            <AssistantAvatar size={28} />
            <div className="as-bubble as-bubble--bot">{WELCOME}</div>
          </div>
          {!messages.length && (
            <div className="flex flex-wrap gap-2 pl-[38px]">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  style={{ animationDelay: `${0.15 + i * 0.07}s` }}
                  className="as-chip rounded-full border border-violet-400/35 bg-violet-500/10 px-3 py-1.5 text-left text-xs text-white/85 transition-all hover:-translate-y-0.5 hover:border-violet-300/70 hover:bg-violet-500/20 hover:text-white"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          {compacted && (
            <p className="mx-auto w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-white/40">
              Earlier messages summarised to keep chat fast
            </p>
          )}
          {messages.map((m) =>
            m.role === "user" ? (
              <div key={m.id} className="as-msg flex justify-end">
                <div className="as-bubble as-bubble--me">{m.content}</div>
              </div>
            ) : (
              <div key={m.id} className="as-msg flex gap-2.5">
                <AssistantAvatar size={28} />
                <div className={`as-bubble as-bubble--bot ${m.error ? "is-error" : ""} ${m.blocked ? "is-blocked" : ""}`}>
                  <Rich text={m.content} />
                  {m.error && (
                    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mt-2 block text-xs font-medium text-emerald-300 hover:text-white">
                      Message Nishy on WhatsApp →
                    </a>
                  )}
                </div>
              </div>
            ),
          )}
          {busy && (
            <div className="as-msg flex gap-2.5">
              <AssistantAvatar size={28} talking />
              <div className="as-bubble as-bubble--bot flex items-center gap-1.5 py-3.5">
                <span className="as-dot" />
                <span className="as-dot" style={{ animationDelay: "0.15s" }} />
                <span className="as-dot" style={{ animationDelay: "0.3s" }} />
              </div>
            </div>
          )}
        </div>

        {/* composer */}
        <form onSubmit={onSubmit} className="relative border-t border-white/10 p-3">
          <div className="as-composer flex items-end gap-2 rounded-2xl border border-white/15 bg-white/[0.04] p-1.5 pl-3.5 transition-colors focus-within:border-violet-400/60">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, LIMITS.maxMessageChars))}
              onKeyDown={onKeyDown}
              rows={1}
              placeholder="Ask anything…"
              aria-label="Message"
              className="max-h-32 min-h-[2.25rem] flex-1 resize-none bg-transparent py-2 text-sm text-white placeholder:text-white/35 focus:outline-none"
              style={{ fieldSizing: "content" } as React.CSSProperties}
            />
            <button
              type="submit"
              disabled={!input.trim() || busy}
              aria-label="Send message"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-[0_8px_24px_-8px_rgba(217,70,239,0.9)] transition-all hover:scale-105 disabled:scale-100 disabled:opacity-40"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
          </div>
          <p className="mt-2 flex justify-between px-1 text-[10px] text-white/35">
            <span>AI can make mistakes. For projects, WhatsApp Nishy.</span>
            {input.length > LIMITS.maxMessageChars * 0.8 && <span>{input.length}/{LIMITS.maxMessageChars}</span>}
          </p>
        </form>
      </div>

      {/* hint bubble */}
      {hint && !open && (
        <button
          type="button"
          onClick={() => {
            dismissHint();
            setOpen(true);
          }}
          className="as-hint absolute bottom-3 right-[4.75rem] w-max max-w-[15rem] rounded-2xl rounded-br-md border border-white/15 bg-[#160b2e]/95 px-4 py-2.5 text-left text-xs text-white/85 shadow-[0_18px_40px_-16px_rgba(139,92,246,0.9)] backdrop-blur"
        >
          <span className="block font-semibold text-white">Hi, I&apos;m Nishy&apos;s assistant</span>
          Ask me about Agent Studio, Flows or your AI project.
        </button>
      )}

      {/* launcher */}
      <button
        type="button"
        onClick={() => {
          dismissHint();
          setOpen((o) => !o);
        }}
        aria-label={open ? "Close chat" : "Chat with Nishy's assistant"}
        aria-expanded={open}
        className={`as-launcher relative grid h-16 w-16 place-items-center rounded-full ${open ? "is-open" : ""}`}
      >
        <span aria-hidden="true" className="as-halo absolute inset-0 rounded-full" />
        <span className="as-launch-face relative">
          <AssistantAvatar size={60} talking={busy} />
        </span>
        <span aria-hidden="true" className="as-launch-close absolute inset-0 grid place-items-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </span>
        {!open && !messages.length && (
          <span aria-hidden="true" className="absolute right-0.5 top-0.5 flex h-3.5 w-3.5">
            <span className="fx-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
            <span className="relative h-3.5 w-3.5 rounded-full border-2 border-[#0a0514] bg-emerald-400" />
          </span>
        )}
      </button>
    </div>
  );
}

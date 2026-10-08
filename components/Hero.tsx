import Image from "next/image";
import type { CSSProperties } from "react";
import type { ProfileEntry } from "@/lib/contentful";
import { AGENT_STUDIO_FLOWS_NEWS as NEWS } from "@/lib/news";
import { Arrow, Btn, Num } from "./ui";
import Link from "next/link";
import HeroRules from "./HeroRules";
import LiquidTiles from "./LiquidTiles";
import WaterText from "./WaterText";
import Parallax from "./Parallax";
import Spotlight from "./Spotlight";

/* ---------- Wording: the three answers every visitor needs first ---------- */
const STATEMENT = ["I build AI agents", "and workflows that", "run the business."];

const ANSWERS = [
  {
    tag: "What I do",
    title: "AI that does the job.",
    body: "Agents, workflows and RAG assistants that complete real business processes. Not demos.",
  },
  {
    tag: "How I do it",
    title: "Products first. Custom when needed.",
    body: "Agent Studio and Flows, the two products I founded, or a custom build on your data and your tools.",
  },
  {
    tag: "How long",
    title: "7+ years. 2 live products.",
    body: "Production software since 2019, two AI products launched in 2026, teams of up to 31 engineers led.",
  },
];

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export default function Hero({ profile }: { profile: ProfileEntry | null }) {
  const fields = profile?.fields;
  const avatar = fields?.avatar && "fields" in fields.avatar ? fields.avatar : undefined;
  const src = avatar?.fields.file?.url ? `https:${avatar.fields.file.url}` : undefined;
  const name = fields?.name ?? "Nishanthan Janarthanarajah";
  const location = fields?.location ?? "Colombo, Sri Lanka";

  return (
    <section className="hero relative overflow-clip border-b hairline">
      <HeroRules />
      <Spotlight />
      {/* news line */}
      <Link
        href={NEWS.path}
        className="group news-accent relative z-10 flex items-center justify-center gap-3 px-6 py-2.5 text-center text-[#0b0b0c] transition-[filter] hover:brightness-110"
      >
        <span className="rounded bg-[#0b0b0c] px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white">New</span>
        <span className="truncate text-xs font-semibold sm:text-sm">{NEWS.title}</span>
        <Arrow className="h-3 w-3 text-inherit transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>

      <div className="relative mx-auto max-w-6xl px-6 pt-10 text-center sm:pt-14 lg:text-left">
        <p className="label hero-up flex flex-wrap items-center justify-center gap-x-3 gap-y-1 !text-[13px] text-neutral-400 sm:!text-sm lg:justify-start" style={d(0.05)}>
          <Arrow className="h-3 w-3 text-brand-500" />
          <span className="text-white">{name}</span>
          <span className="hidden sm:inline">·</span>
          <span>Founder of Agent Studio &amp; Flows</span>
          <span className="hidden sm:inline">·</span>
          <span>{location}</span>
        </p>

        {/* name + portrait overlap */}
        <div className="relative mt-6">
          <h1 className="display hero-name text-white">
            <span className="hero-mask">
              <span style={d(0.15)}>
                <WaterText text="Nishy" />
              </span>
            </span>
          </h1>

          <div className="hero-portrait relative mx-auto mt-6 w-[62%] max-w-[18rem] sm:w-[40%] lg:absolute lg:right-[9%] lg:top-[74%] lg:mx-0 lg:mt-0 lg:w-[27%] lg:max-w-[21rem]">
            <Parallax strength={10}>
            <div className="hero-portrait-float group relative aspect-[4/5]">
              <div className="absolute inset-0 overflow-clip rounded-2xl bg-white/20 p-px">
                <div className="hero-sheet relative h-full w-full overflow-clip rounded-2xl bg-ink-700">
                  {src ? (
                    <Image src={src} alt={`${name} (Nishy), founder of Agent Studio and Flows`} fill priority quality={70} sizes="(min-width: 1024px) 336px, 60vw" className="object-cover" />
                  ) : (
                    <span className="grid h-full w-full place-items-center text-6xl font-semibold text-white/60">N</span>
                  )}
                  <span aria-hidden="true" className="hero-sheet-tint absolute inset-0" />
                  <span aria-hidden="true" className="hero-scan pointer-events-none absolute inset-x-0 top-0 h-1/4" />
                </div>
              </div>
              <div className="absolute left-3 top-3 flex flex-col rounded-md bg-[#121212]/85 px-2 py-1.5 backdrop-blur">
                <span className="label text-brand-400">(01)</span>
                <span className="label text-white">Founder</span>
              </div>
              <span className="label absolute right-3 top-3 text-right text-white/60">
                Fig. 01
                <span className="mt-1 block text-white/35">6.9°N 79.8°E</span>
              </span>
              <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-md bg-[#121212]/85 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Available for projects
              </span>
            </div>
            </Parallax>
          </div>
        </div>

        {/* statement + doors */}
        <div className="mx-auto mt-8 max-w-xl lg:mx-0 lg:mt-12 lg:min-h-[25rem]">
          <p className="display text-2xl text-white sm:text-4xl">
            {STATEMENT.map((line, i) => (
              <span key={line} className="hero-mask">
                <span style={d(0.55 + i * 0.1)}>{line}</span>
              </span>
            ))}
          </p>
          <div className="hero-up mt-7 flex flex-wrap justify-center gap-3 lg:justify-start" style={d(0.95)}>
            <Btn href="/build-ai-system-for-your-business" solid>
              Build with me
            </Btn>
            <Btn href="#proof">See the work</Btn>
          </div>
        </div>
      </div>

      {/* the three answers */}
      <div className="mx-auto mt-14 max-w-6xl px-6 pb-10 sm:mt-20 sm:pb-14">
        <LiquidTiles>
        <ol className="grid overflow-clip rounded-2xl border hairline sm:grid-cols-3">
          {ANSWERS.map((a, i) => (
            <li
              key={a.tag}
              className="hero-up border-b hairline p-6 text-center transition-colors duration-300 hover:bg-white/[0.025] sm:border-b-0 sm:border-r sm:text-left sm:last:border-r-0 sm:p-7"
              style={d(1.05 + i * 0.12)}
            >
              <Num n={i + 1}>{a.tag}</Num>
              <h2 className="display-sm mt-4 text-xl text-white sm:text-2xl">{a.title}</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-400">{a.body}</p>
            </li>
          ))}
        </ol>
        </LiquidTiles>
      </div>
    </section>
  );
}

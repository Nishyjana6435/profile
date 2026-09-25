import Link from "next/link";
import type { CSSProperties } from "react";
import type { SiteSettingsEntry } from "@/lib/contentful";
import type { ProductPageConfig } from "@/lib/marketing/types";
import AgentScene from "@/components/AgentScene";
import Contact from "@/components/Contact";
import FAQ from "@/components/FAQ";
import FlowsScene from "@/components/FlowsScene";
import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import ProductStructuredData from "./ProductStructuredData";

const ACCENT = {
  fuchsia: {
    gradient: "from-violet-500 to-fuchsia-500",
    glow: "shadow-[0_12px_40px_-12px_rgba(217,70,239,0.8)]",
    blob: "bg-fuchsia-600/10",
    icon: "from-violet-500 via-fuchsia-500 to-violet-600",
    tilt: "tilt-right" as const,
  },
  sky: {
    gradient: "from-violet-500 to-sky-500",
    glow: "shadow-[0_12px_40px_-12px_rgba(56,189,248,0.8)]",
    blob: "bg-sky-600/10",
    icon: "from-violet-500 via-indigo-500 to-sky-500",
    tilt: "tilt-left" as const,
  },
};

function withHighlight(text: string, highlight: string) {
  const index = text.indexOf(highlight);
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <span className="text-shimmer">{text.slice(index, index + highlight.length)}</span>
      {text.slice(index + highlight.length)}
    </>
  );
}

function SectionHeading({ id, eyebrow, title, intro }: { id?: string; eyebrow: string; title: string; intro: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <Reveal as="p" variant="fade" className="text-xs uppercase tracking-[0.3em] text-violet-300/70">
        {eyebrow}
      </Reveal>
      <Reveal as="h2" delay={80} className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
        <span id={id}>{title}</span>
      </Reveal>
      <Reveal as="p" delay={160} className="mt-4 text-sm leading-7 text-white/60">
        {intro}
      </Reveal>
    </div>
  );
}

function ExternalCta({ href, label, accent, big = false }: { href: string; label: string; accent: keyof typeof ACCENT; big?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn-shine group/btn inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${ACCENT[accent].gradient} ${ACCENT[accent].glow} ${big ? "px-8 py-3.5 text-sm" : "px-6 py-2.5 text-xs"} font-medium uppercase tracking-wide text-white transition-transform duration-300 hover:-translate-y-0.5`}
    >
      {label}
      <span aria-hidden="true" className="transition-transform duration-300 group-hover/btn:translate-x-1">
        →
      </span>
    </a>
  );
}

export default function ProductLanding({
  config,
  siteSettings,
}: {
  config: ProductPageConfig;
  siteSettings: SiteSettingsEntry | null;
}) {
  const a = ACCENT[config.accent];

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#0a0514] text-white">
      <ProductStructuredData config={config} />
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pb-20 pt-16 sm:pt-24">
          <div aria-hidden="true" className={`pointer-events-none absolute right-[-10%] top-1/3 h-[36rem] w-[36rem] rounded-full ${a.blob} blur-[140px]`} />
          <div aria-hidden="true" className="pointer-events-none absolute left-[-10%] top-0 h-[28rem] w-[40rem] rounded-full bg-violet-700/15 blur-[140px]" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
            <div>
              <nav aria-label="Breadcrumb" className="text-xs text-white/40">
                <ol className="flex items-center gap-2">
                  <li><Link href="/" className="hover:text-white">Home</Link></li>
                  <li aria-hidden="true">/</li>
                  <li className="text-white/70">{config.name}</li>
                </ol>
              </nav>
              <Reveal as="p" variant="fade" delay={60} className="mt-6 inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.25em] text-violet-300/70">
                <span className="relative flex h-2 w-2">
                  <span className="fx-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
                  <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                {config.hero.eyebrow}
              </Reveal>
              <Reveal delay={120}>
                <h1 className="mt-4 text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-[3.4rem]">
                  {withHighlight(config.hero.h1, config.hero.highlight)}
                </h1>
              </Reveal>
              <Reveal as="p" delay={200} className="mt-6 max-w-xl text-base leading-8 text-white/65">
                {config.hero.sub}
              </Reveal>
              <Reveal delay={280} className="mt-8 flex flex-wrap items-center gap-3">
                <ExternalCta href={config.hero.primary.href} label={config.hero.primary.label} accent={config.accent} />
                <a
                  href={config.hero.secondary.href}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-2.5 text-xs uppercase tracking-wide text-white/80 transition-all duration-300 hover:border-violet-400/60 hover:bg-violet-500/10 hover:text-white"
                >
                  {config.hero.secondary.label}
                </a>
                <span className="basis-full text-xs text-white/40">{config.hero.trust}</span>
              </Reveal>
              <Reveal variant="fade" stagger delay={360} className="mt-8 flex flex-wrap gap-2">
                {config.hero.audience.map((who, i) => (
                  <span
                    key={who}
                    style={{ "--i": i } as CSSProperties}
                    className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/60"
                  >
                    {who}
                  </span>
                ))}
              </Reveal>
            </div>
            <Reveal variant={a.tilt} threshold={0.2} className="px-5 pb-14 pt-12 sm:px-12 lg:px-8">
              {config.scene === "flows" ? <FlowsScene /> : <AgentScene />}
            </Reveal>
          </div>
        </section>

        {/* Use cases */}
        <section id="use-cases" className="scroll-mt-24 px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="Use cases" title={config.useCases.heading} intro={config.useCases.intro} />
            <Reveal variant="fade" stagger delay={200} className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {config.useCases.items.map((item, i) => (
                <article
                  key={item.title}
                  style={{ "--i": i } as CSSProperties}
                  className="group flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/40 hover:bg-violet-500/10"
                >
                  <span className="text-[11px] uppercase tracking-[0.2em] text-violet-300/70">{item.tag}</span>
                  <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/60">{item.body}</p>
                  <ol className="mt-5 flex flex-wrap items-center gap-1.5 text-[11px] text-white/70">
                    {item.flow.map((step, j) => (
                      <li key={step} className="flex items-center gap-1.5">
                        <span className="rounded-md border border-white/10 bg-[#130a26] px-2 py-1">{step}</span>
                        {j < item.flow.length - 1 && <span aria-hidden="true" className="text-violet-400">→</span>}
                      </li>
                    ))}
                  </ol>
                </article>
              ))}
            </Reveal>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="scroll-mt-24 px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="How it works" title={config.steps.heading} intro={config.steps.intro} />
            <Reveal variant="fade" stagger delay={200} className="mt-12 grid gap-5 md:grid-cols-3">
              {config.steps.items.map((step, i) => (
                <div
                  key={step.title}
                  style={{ "--i": i } as CSSProperties}
                  className="rounded-3xl border border-white/5 bg-gradient-to-br from-violet-900/40 to-[#1a0f38] p-6"
                >
                  <span className={`inline-grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${a.icon} font-mono text-sm font-semibold text-white`}>
                    0{i + 1}
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/60">{step.body}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-24 px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="Features" title={config.features.heading} intro={config.features.intro} />
            <Reveal variant="fade" stagger delay={200} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {config.features.items.map((f, i) => (
                <div
                  key={f.title}
                  style={{ "--i": i } as CSSProperties}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/40 hover:bg-violet-500/10"
                >
                  <h3 className="text-sm font-semibold text-white">{f.title}</h3>
                  <p className="mt-2 text-xs leading-6 text-white/55">{f.body}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* Comparison */}
        <section id="compare" className="scroll-mt-24 px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="Comparison" title={config.comparison.heading} intro={config.comparison.intro} />
            <p className="mt-10 text-center text-[11px] uppercase tracking-[0.2em] text-white/40 lg:hidden">
              Swipe the table to compare →
            </p>
            <Reveal delay={200} className="mt-4 overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.02] lg:mt-12">
              <table className="w-full min-w-[56rem] border-collapse text-left text-sm">
                <caption className="sr-only">{config.comparison.heading}</caption>
                <thead>
                  <tr className="border-b border-white/10">
                    <th scope="col" className="sticky left-0 z-10 bg-[#0d0718] px-5 py-4 text-xs font-medium uppercase tracking-[0.2em] text-white/40">
                      Criteria
                    </th>
                    <th scope="col" className="bg-violet-500/10 px-5 py-4 text-sm font-semibold text-white">
                      {config.name}
                    </th>
                    {config.comparison.competitors.map((c) => (
                      <th key={c} scope="col" className="px-5 py-4 text-sm font-medium text-white/70">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {config.comparison.rows.map((row) => (
                    <tr key={row.label} className="border-b border-white/5 last:border-0">
                      <th scope="row" className="sticky left-0 z-10 bg-[#0d0718] px-5 py-4 align-top text-xs font-medium text-white/80">
                        {row.label}
                      </th>
                      {row.cells.map((cell, i) => (
                        <td
                          key={i}
                          className={`px-5 py-4 align-top text-xs leading-6 ${i === 0 ? "bg-violet-500/10 text-white" : "text-white/60"}`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
            <Reveal as="p" delay={260} className="mx-auto mt-8 max-w-3xl text-center text-sm leading-7 text-white/70">
              {config.comparison.verdict}
            </Reveal>
            <p className="mx-auto mt-4 max-w-3xl text-center text-[11px] leading-5 text-white/35">{config.comparison.note}</p>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-24 px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="Pricing" title={config.pricing.heading} intro={config.pricing.intro} />
            <Reveal variant="fade" stagger delay={200} className={`mt-12 grid gap-4 sm:grid-cols-2 ${config.pricing.plans.length > 4 ? "lg:grid-cols-5" : "lg:grid-cols-4"}`}>
              {config.pricing.plans.map((plan, i) => (
                <div
                  key={plan.name}
                  style={{ "--i": i } as CSSProperties}
                  className={`relative flex flex-col rounded-3xl border p-6 ${
                    plan.highlight
                      ? "border-violet-400/60 bg-violet-500/10 shadow-[0_30px_80px_-40px_rgba(167,139,250,0.9)]"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  {plan.highlight && (
                    <span className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                      Most popular
                    </span>
                  )}
                  <h3 className="text-sm font-semibold text-white">{plan.name}</h3>
                  <p className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-semibold text-white">{plan.price}</span>
                    <span className="text-xs text-white/50">{plan.period}</span>
                  </p>
                  <p className="mt-2 text-xs leading-5 text-white/55">{plan.blurb}</p>
                  <ul className="mt-5 flex flex-1 flex-col gap-2 text-xs text-white/70">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span aria-hidden="true" className="mt-0.5 text-emerald-400">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={config.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-6 inline-flex justify-center rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wide transition-all duration-300 hover:-translate-y-0.5 ${
                      plan.highlight
                        ? `bg-gradient-to-r ${a.gradient} text-white`
                        : "border border-white/15 text-white/80 hover:border-violet-400/60 hover:bg-violet-500/10 hover:text-white"
                    }`}
                  >
                    {plan.cta}
                  </a>
                </div>
              ))}
            </Reveal>
            <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-6 text-white/40">{config.pricing.note}</p>
          </div>
        </section>

        <FAQ items={config.faqs} />

        {/* Related product + CTA */}
        <section className="px-6 py-20 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.4fr_1fr]">
            <Reveal className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-900/50 to-[#1a0f38] p-8 sm:p-12">
              <div aria-hidden="true" className={`pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full ${a.blob} blur-3xl`} />
              <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">{config.cta.title}</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/65">{config.cta.body}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ExternalCta href={config.url} label={config.hero.primary.label} accent={config.accent} big />
                <a href="#pricing" className="inline-flex items-center rounded-full border border-white/15 px-8 py-3.5 text-sm uppercase tracking-wide text-white/80 transition-all duration-300 hover:border-violet-400/60 hover:bg-violet-500/10 hover:text-white">
                  See pricing
                </a>
              </div>
            </Reveal>
            <Reveal variant="right" delay={120} className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-8">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-violet-300/70">Also by Nishy</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">{config.related.name}</h3>
                <p className="mt-3 text-sm leading-7 text-white/60">{config.related.blurb}</p>
              </div>
              <Link href={config.related.href} className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-white">
                Explore {config.related.name}
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
      <Contact siteSettings={siteSettings} />
    </div>
  );
}

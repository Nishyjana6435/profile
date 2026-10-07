import { AGENT_STUDIO } from "@/lib/agent";
import { FLOWS } from "@/lib/flows";
import { AGENT_STUDIO_FLOWS_NEWS as N } from "@/lib/news";
import { AgentLogo } from "./AgentScene";
import { FlowsLogo } from "./FlowsScene";
import { Arrow } from "./ui";

/**
 * The announcement poster, drawn in the site theme instead of the purple flyer:
 * the Deploy dialog with its switch flipping on, a live wire, and the agent
 * appearing as a step in a Flows workflow.
 */
export default function NewsPoster() {
  return (
    <div className="np relative overflow-hidden rounded-2xl border hairline bg-[#161616] p-6 sm:p-8">
      <div aria-hidden="true" className="rules absolute inset-0 opacity-60" />

      <div className="relative">
        <p className="label flex items-center gap-2 text-neutral-400">
          <span className="rounded bg-brand-500 px-1.5 py-0.5 text-[10px] font-bold text-white">New</span>
          <time dateTime={N.date}>28 Sep 2026</time>
        </p>
        <h2 className="display mt-5 text-3xl text-white sm:text-5xl">
          Your agents now run <span className="text-neutral-500">inside your workflows.</span>
        </h2>

        {/* Agent Studio: deploy dialog */}
        <div className="np-card mt-8 rounded-xl border hairline bg-[#121212] p-4" style={{ "--d": "0.2s" } as React.CSSProperties}>
          <div className="flex items-center gap-3">
            <AgentLogo className="h-8 w-8" />
            <div className="min-w-0 flex-1">
              <p className="label text-neutral-500">{AGENT_STUDIO.name} · Deploy</p>
              <p className="truncate text-sm font-semibold text-white">Support Copilot</p>
            </div>
            <span className="label rounded-md border border-white/15 px-2 py-1 text-white">v3</span>
          </div>
          <div className="mt-4 flex items-center justify-between gap-4 border-t hairline pt-4">
            <p className="text-sm text-neutral-200">Add this agent to Flows automatically</p>
            <span className="np-toggle" aria-hidden="true">
              <span className="np-knob" />
            </span>
          </div>
        </div>

        {/* wire */}
        <div className="relative mx-auto h-16 w-px">
          <span className="np-wire absolute inset-0 border-l border-dashed border-white/25" />
          <span className="np-pulse absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-brand-500 shadow-[0_0_12px_2px_rgb(var(--accent-500-rgb)/0.7)]" />
        </div>

        {/* Flows: the workflow with the new step */}
        <div className="np-card rounded-xl border hairline bg-[#121212] p-4" style={{ "--d": "0.6s" } as React.CSSProperties}>
          <div className="flex items-center gap-3">
            <FlowsLogo className="h-8 w-8" />
            <div className="min-w-0 flex-1">
              <p className="label text-neutral-500">{FLOWS.name} · Workflow</p>
              <p className="truncate text-sm font-semibold text-white">Support inbox</p>
            </div>
            <span className="label inline-flex items-center gap-1.5 text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Live
            </span>
          </div>
          <ol className="mt-4 flex flex-col gap-2 border-t hairline pt-4">
            {N.example.map((step, i) => (
              <li
                key={step}
                className={`np-step flex items-center gap-3 rounded-md border px-3 py-2 text-sm ${i === 1 ? "np-step--new border-brand-500 bg-brand-500/10 text-white" : "border-white/10 text-neutral-300"}`}
              >
                <span className="label w-8 text-brand-400">({String(i + 1).padStart(2, "0")})</span>
                <span className="flex-1">{step}</span>
                {i === 1 && <span className="label rounded bg-brand-500 px-1.5 py-0.5 text-[9px] text-white">Agent</span>}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t hairline pt-4">
          <p className="label text-neutral-500">One switch · no API keys · no glue code</p>
          <span className="label inline-flex items-center gap-1.5 text-white">
            nishyai.com <Arrow className="h-3 w-3 text-brand-500" />
          </span>
        </div>
      </div>
    </div>
  );
}

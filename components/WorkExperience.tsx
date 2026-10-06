import type { ExperienceItemEntry } from "@/lib/contentful";
import { FOUNDER_ROLES } from "@/lib/agent-view";
import { AGENT_STUDIO } from "@/lib/agent";
import { FLOWS } from "@/lib/flows";
import { firstSentence } from "@/lib/text";
import { AgentLogo } from "./AgentScene";
import ExperienceRows, { type ExperienceRow } from "./ExperienceRows";
import { FlowsLogo } from "./FlowsScene";
import Reveal from "./Reveal";
import StatsBand from "./StatsBand";
import { SectionHead } from "./ui";

const FOUNDER_URLS: Record<string, string> = { "Agent Studio": AGENT_STUDIO.url, Flows: FLOWS.url };
const FOUNDER_LINES: Record<string, string> = {
  "Agent Studio": "A visual AI agent builder: design the orchestrator and sub-agents on a canvas, add guardrails and an injection shield, deploy as a versioned API.",
  Flows: "AI workflow automation: describe a process in plain English and Claude drafts, runs and repairs it across Slack, Sheets, Gmail, SMS and any REST API.",
};
const FOUNDER_HIGHLIGHTS: Record<string, string[]> = {
  "Agent Studio": ["Orchestrator and sub-agents on a canvas", "Guardrails and a three-layer injection shield", "One-click versioned API deployment"],
  Flows: ["Plain English in, running workflow out", "Slack, Sheets, Gmail, SMS and any REST API", "Claude reads failed runs and proposes the fix"],
};

function founderRows(): ExperienceRow[] {
  return FOUNDER_ROLES.map((r) => ({
    id: r.company.toLowerCase().replace(/\s+/g, "-"),
    company: r.company,
    role: `${r.role} · built and operated solo`,
    period: r.period,
    line: FOUNDER_LINES[r.company] ?? firstSentence(r.description, 190),
    highlights: FOUNDER_HIGHLIGHTS[r.company] ?? [],
    stack: r.stack.slice(0, 6),
    url: FOUNDER_URLS[r.company],
    logo: r.company === "Flows" ? <FlowsLogo className="h-12 w-12" /> : <AgentLogo className="h-12 w-12" />,
    founder: true,
  }));
}

function toRow(item: ExperienceItemEntry): ExperienceRow {
  const f = item.fields;
  const [titleCompany, titleRole] = f.title.split(/\s+[—–-]\s+/);
  const company = (f.company ?? titleCompany ?? f.title).trim();
  const role = (f.role ?? titleRole ?? f.title).trim();
  const period = f.period;
  let description = f.description;
  if (period && description.startsWith(period)) description = description.slice(period.length).replace(/^[.\s]+/, "");
  const logo = f.logo && "fields" in f.logo ? f.logo : undefined;
  const logoUrl = logo?.fields.file?.url;
  return {
    id: item.sys.id,
    company,
    role,
    period,
    line: firstSentence(description, 190),
    highlights: (f.highlights ?? []).slice(0, 3).map((h) => firstSentence(h, 110)),
    stack: (f.stack ?? []).slice(0, 6),
    logoUrl: logoUrl ? `https:${logoUrl}` : undefined,
    url: f.learnMoreUrl && f.learnMoreUrl !== "#" ? f.learnMoreUrl : undefined,
  };
}

export default function WorkExperience({ items }: { items: ExperienceItemEntry[] }) {
  const rows = [...founderRows(), ...items.map(toRow)];
  if (rows.length === 0) return null;

  return (
    <section id="experience" className="border-b hairline">
      <div className="mx-auto max-w-6xl px-6 pt-24 sm:pt-32">
        <SectionHead
          n={3}
          eyebrow="How long"
          title={[{ text: "Seven years," }, { text: "one direction.", className: "text-neutral-500" }]}
          lead="From freelance full stack work to leading enterprise delivery, and now two AI products of my own. Open a row for the short version."
        />
      </div>
      <div className="mx-auto mt-14 max-w-6xl px-6">
        <StatsBand />
      </div>
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-14 sm:pb-32">
        <Reveal variant="fade">
          <ExperienceRows items={rows} />
        </Reveal>
      </div>
    </section>
  );
}

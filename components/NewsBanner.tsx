import Link from "next/link";
import { AGENT_STUDIO_FLOWS_NEWS as N } from "@/lib/news";

export default function NewsBanner() {
  return (
    <div className="px-6 pt-4">
      <Link
        href={N.path}
        className="group mx-auto flex max-w-3xl items-center justify-center gap-3 rounded-full border border-emerald-400/30 bg-emerald-400/[0.07] px-4 py-2.5 text-xs text-white/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300/60 hover:bg-emerald-400/15 hover:text-white sm:text-sm"
      >
        <span className="rounded-full bg-gradient-to-r from-emerald-300 to-emerald-400 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0a0514]">New</span>
        <span className="truncate">{N.title}: one switch, no glue code</span>
        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </Link>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Contact from "@/components/Contact";
import Header from "@/components/Header";
import { Eyebrow } from "@/components/ui";
import { getSiteSettings } from "@/lib/contentful";
import { pad } from "@/lib/text";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const revalidate = 60000;
const url = `${SITE_URL}/privacy`;
const title = "Privacy policy";
const description = "What nishyai.com collects, why, and how to control it. Written to be read, not skimmed.";
export const metadata: Metadata = { title, description, alternates: { canonical: url }, openGraph: { title, description, url, siteName: SITE_NAME }, robots: { index: true, follow: true } };

const UPDATED = "7 October 2026";
const SECTIONS: { title: string; body: (string | readonly string[])[] }[] = [
  { title: "Who we are", body: ["This site, www.nishyai.com, is published by Nishanthan Janarthanarajah (Nishy), an independent AI engineer in Colombo, Sri Lanka, and the operator of Agent Studio (agents.nishyai.com) and Flows (flows.nishyai.com). Each product has its own privacy policy; this one covers the portfolio site and the ways you can contact me through it."] },
  { title: "What this site collects", body: [
    ["Contact and booking: when you send the discovery-call form, the answers you type, your name, email and company are emailed to me so I can reply. Nothing is stored in a database on this site.",
     "Assistant chat: messages you type into the on-page assistant are sent to an agent I built in Agent Studio, which generates the reply with language models served by Groq, using only the public facts on this site. Conversation history stays in your browser; this site's server keeps no copy beyond the request itself and short-lived rate-limit counters. Agent Studio's own privacy policy covers the agent's run logs.",
     "Server logs: the hosting platform records IP address, browser and timestamps for security and reliability.",
     "Your preferences: the accessibility switches, the arcade high scores and the assistant conversation live in your browser's local storage and never leave your device."],
  ] },
  { title: "What it does not do", body: ["No advertising trackers, no cross-site cookies, no third-party analytics scripts. Nothing you type is used to train models; the model providers behind the assistant do not train on this traffic under the agreements in place."] },
  { title: "Providers", body: [["Vercel hosts the site and serves it from its edge network.", "Contentful stores the published content you read here.", "Agent Studio, with models served by Groq, generates assistant replies for the messages you send.", "Google Mail delivers booking-form emails to me."]] },
  { title: "Retention", body: ["Booking emails are kept in my mailbox for as long as we are in conversation, and deleted on request. Server logs follow the hosting platform's retention. Local storage is yours to clear from your browser at any time."] },
  { title: "Your rights", body: ["You can ask what I hold about you, have it corrected or deleted, or object to processing, by emailing the address in the footer. I reply within 30 days. If you are in the EU or UK you also have the right to complain to a supervisory authority."] },
  { title: "Changes", body: ["When this policy changes, the date at the top changes with it. Material changes are noted on the news page."] },
];

export default async function PrivacyPage() {
  const siteSettings = await getSiteSettings();
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#121212] text-white">
      <Header />
      <main className="flex-1 px-6 pb-24 pt-14 sm:pt-20">
        <article className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="label text-neutral-500"><Link href="/" className="hover:text-white">Home</Link> / Privacy</nav>
          <div className="mt-8"><Eyebrow>Legal · Last updated {UPDATED}</Eyebrow></div>
          <h1 className="display mt-5 text-4xl text-white sm:text-6xl">Privacy policy<span className="text-neutral-500">.</span></h1>
          <p className="mt-5 text-lg leading-8 text-neutral-300">{description}</p>
          <div className="mt-12 border-t hairline">
            {SECTIONS.map((s, i) => (
              <section key={s.title} className="grid gap-3 border-b hairline py-7 sm:grid-cols-[5rem_1fr] sm:gap-8">
                <span className="label text-brand-400">{pad(i + 1)}</span>
                <div>
                  <h2 className="display-sm text-2xl text-white">{s.title}</h2>
                  {s.body.map((b, j) =>
                    typeof b === "string" ? (
                      <p key={j} className="mt-3 text-base leading-7 text-neutral-300">{b}</p>
                    ) : (
                      <ul key={j} className="mt-3 flex flex-col gap-2">
                        {b.map((li, k) => <li key={k} className="flex gap-3 text-base leading-7 text-neutral-300"><span className="label mt-2 shrink-0 text-brand-400">({pad(k + 1)})</span>{li}</li>)}
                      </ul>
                    ),
                  )}
                </div>
              </section>
            ))}
          </div>
          <p className="mt-8 text-sm leading-6 text-neutral-400">
            Product policies: <a href="https://flows.nishyai.com/privacy" className="text-white underline underline-offset-4">Flows privacy</a>, <a href="https://flows.nishyai.com/terms" className="text-white underline underline-offset-4">Flows terms</a>, <a href="https://agents.nishyai.com/privacy" className="text-white underline underline-offset-4">Agent Studio privacy</a>, <a href="https://agents.nishyai.com/terms" className="text-white underline underline-offset-4">Agent Studio terms</a>. Working terms for client projects are on the <Link href="/engagements" className="text-white underline underline-offset-4">engagements page</Link>.
          </p>
        </article>
      </main>
      <Contact siteSettings={siteSettings} />
    </div>
  );
}

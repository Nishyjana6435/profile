import type { Metadata } from "next";
import Link from "next/link";
import BookingCalendar from "@/components/BookingCalendar";
import BookingForm from "@/components/BookingForm";
import Contact from "@/components/Contact";
import Header from "@/components/Header";
import { Eyebrow, Num } from "@/components/ui";
import { getSiteSettings } from "@/lib/contentful";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const revalidate = 60000;
const url = `${SITE_URL}/book`;
const title = "Book a 20-minute discovery call";
const description = "Pick a free slot on Nishy's calendar, in your time zone. A Google Meet invite lands in your inbox. Free, no preparation needed.";
export const metadata: Metadata = { title, description, alternates: { canonical: url }, openGraph: { title, description, url, siteName: SITE_NAME }, twitter: { card: "summary_large_image", title, description } };

const EXPECT = [
  { t: "Ten minutes on your process", b: "What it costs you today, which tools it touches, where people step in." },
  { t: "Five on the fit", b: "Flows, Agent Studio, a custom build, or honestly nothing. I will say which." },
  { t: "Five on next steps", b: "If it is a build, what a discovery sprint would look at and cost." },
];

export default async function BookPage() {
  const siteSettings = await getSiteSettings();
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#121212] text-white">
      <Header />
      <main className="flex-1 px-6 pb-24 pt-14 sm:pt-20">
        <div className="mx-auto max-w-6xl">
          <nav aria-label="Breadcrumb" className="label text-neutral-500"><Link href="/" className="hover:text-white">Home</Link> / Book a call</nav>
          <div className="mt-8"><Eyebrow>Discovery call · 20 minutes · free</Eyebrow></div>
          <h1 className="display mt-5 max-w-4xl text-4xl text-white sm:text-6xl">Pick a time, <span className="text-neutral-500">get a Meet link.</span></h1>
          <div className="mt-12 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div className="min-w-0">
              <ol className="border-t hairline">
                {EXPECT.map((e, i) => (
                  <li key={e.t} className="grid gap-1 border-b hairline py-4 sm:grid-cols-[4rem_1fr] sm:gap-4">
                    <Num n={i + 1} />
                    <div><p className="text-sm font-semibold text-white">{e.t}</p><p className="mt-0.5 text-sm leading-6 text-neutral-400">{e.b}</p></div>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-sm leading-6 text-neutral-400">Based in Colombo, with slots covering European, UK and US mornings and Asia-Pacific afternoons. Prefer to write first? <Link href="/engagements#book" className="text-white underline underline-offset-4">Send the three answers instead</Link>.</p>
            </div>
            <div className="min-w-0"><BookingCalendar /></div>
          </div>
          <details className="mt-16 rounded-2xl border hairline bg-[#161616] p-6">
            <summary className="cursor-pointer list-none eyebrow text-white marker:content-none">Can&apos;t find a slot? Send the three answers and I will propose one.</summary>
            <div className="mt-6"><BookingForm compact /></div>
          </details>
        </div>
      </main>
      <Contact siteSettings={siteSettings} />
    </div>
  );
}

import { WHATSAPP_URL, WhatsAppIcon } from "./Contact";
import Reveal from "./Reveal";
import ScrollWords from "./ScrollWords";
import { Btn, Eyebrow } from "./ui";

export default function CtaBand({ lookingFor }: { lookingFor?: string }) {
  return (
    <section id="contact" className="rules border-b hairline px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal as="div" variant="fade">
          <Eyebrow>Next step</Eyebrow>
        </Reveal>
        <ScrollWords as="h2" className="display mt-6 max-w-5xl text-4xl text-white sm:text-7xl" text="Have a process that should run itself?" />
        <Reveal as="p" delay={100} className="mt-6 max-w-xl text-base leading-7 text-neutral-400">
          {lookingFor ?? "Tell me the job. Within a day I will say whether Flows or Agent Studio already covers it, or what a custom build would take."}
        </Reveal>
        <Reveal delay={180} className="mt-8 flex flex-wrap gap-3">
          <Btn href={WHATSAPP_URL} solid icon={<WhatsAppIcon />}>
            Chat on WhatsApp
          </Btn>
          <Btn href="/build-ai-system-for-your-business">How I work with clients</Btn>
        </Reveal>
      </div>
    </section>
  );
}

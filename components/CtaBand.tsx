import { WHATSAPP_URL, WhatsAppIcon } from "./Contact";
import Reveal from "./Reveal";
import BookingForm from "./BookingForm";
import { Btn, Eyebrow } from "./ui";
import SplitReveal from "./SplitReveal";

export default function CtaBand({ lookingFor }: { lookingFor?: string }) {
  return (
    <section id="contact" className="border-b hairline px-6 py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="min-w-0">
          <Reveal as="div" variant="fade">
            <Eyebrow>Next step</Eyebrow>
          </Reveal>
          <SplitReveal segs={[{ text: "Have a process that" }, { text: "should run itself?", className: "text-neutral-500" }]} className="display mt-6 text-4xl text-white sm:text-6xl" />
          <Reveal as="p" delay={100} className="mt-6 max-w-md text-base leading-7 text-neutral-400">
            {lookingFor ?? "Tell me the job. Within a day I will say whether Flows or Agent Studio already covers it, or what a custom build would take."}
          </Reveal>
          <Reveal delay={180} className="mt-8 flex flex-wrap gap-3">
            <Btn href="/book" solid>Book a 20-minute call</Btn>
            <Btn href="/engagements">Shapes and pricing</Btn>
            <Btn href={WHATSAPP_URL} icon={<WhatsAppIcon />}>WhatsApp</Btn>
          </Reveal>
        </div>
        <Reveal variant="fade" delay={120}>
          <BookingForm />
        </Reveal>
      </div>
    </section>
  );
}

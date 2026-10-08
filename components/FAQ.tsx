import type { FaqItem } from "@/lib/faq";
import { pad } from "@/lib/text";
import { Eyebrow } from "./ui";

/** Numbered question rows; native details/summary, so it works without JS and is keyboard-friendly. */
export default function FAQ({ items, eyebrow = "Questions", title = "Asked often.", id = "faq" }: { items: readonly FaqItem[]; eyebrow?: string; title?: string; id?: string }) {
  if (items.length === 0) return null;
  return (
    <section id={id} className="border-b hairline px-6 py-24 sm:py-32" aria-labelledby={`${id}-heading`}>
      <div className="mx-auto max-w-6xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 id={`${id}-heading`} className="display mt-5 text-4xl text-white sm:text-6xl">{title}</h2>
        <div className="mt-12 border-t hairline">
          {items.map((item, i) => (
            <details key={item.question} className="faq group border-b hairline">
              <summary className="grid cursor-pointer list-none grid-cols-[3rem_1fr_2.5rem] items-center gap-4 py-5 marker:content-none sm:grid-cols-[5rem_1fr_2.5rem] sm:gap-8">
                <span className="label text-brand-400">{pad(i + 1)}</span>
                <span className="display-sm text-lg text-white sm:text-2xl">{item.question}</span>
                <span aria-hidden="true" className="row-plus grid h-9 w-9 place-items-center rounded-md border border-brand-500/60 text-lg leading-none text-brand-500 group-open:rotate-45">+</span>
              </summary>
              <p className="pb-6 text-base leading-7 text-neutral-300 sm:pl-[5rem]">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

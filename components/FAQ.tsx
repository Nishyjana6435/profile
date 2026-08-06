import type { FaqItem } from "@/lib/faq";

export default function FAQ({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="px-6 py-16" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-6xl">
        <h2 id="faq-heading" className="text-2xl font-semibold text-white">
          Frequently Asked Questions
        </h2>
        <div className="mt-8 grid gap-4">
          {items.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-white/5 bg-gradient-to-br from-violet-900/40 to-[#1a0f38] p-6 open:pb-6"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-white marker:content-none">
                {item.question}
                <span
                  aria-hidden="true"
                  className="shrink-0 text-violet-400 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-white/60">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

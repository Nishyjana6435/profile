/**
 * The hero's drafting grid draws itself on the first visit of the session:
 * vertical rules sweep down, then the content lands on them. Later visits in
 * the same session skip the draw. The check runs inline while the HTML parses,
 * so the entrance never waits for hydration.
 */
const SCRIPT = `try{var s=document.currentScript.parentElement;if(sessionStorage.getItem("hero-drawn")==="1")s.classList.add("hero-instant");sessionStorage.setItem("hero-drawn","1")}catch(e){}`;

export default function HeroRules() {
  return (
    <>
      <div aria-hidden="true" className="hero-rules pointer-events-none absolute inset-0" />
      <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
    </>
  );
}

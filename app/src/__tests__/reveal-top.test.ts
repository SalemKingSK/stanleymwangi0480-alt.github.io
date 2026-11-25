// @vitest-environment happy-dom
import { describe, it, expect, beforeAll, beforeEach, vi } from "vitest";
import { installRevealTop, revealTop } from "@/lib/reveal-top";

const tick = (ms = 20) => new Promise((r) => setTimeout(r, ms));
const settle = () => tick(450); // the opening animation settles, then the page moves

/** Give an element a layout box (the test DOM has none). */
function box(el: Element, get: () => { top: number; height: number }) {
  el.getBoundingClientRect = () => {
    const { top, height } = get();
    return { top, height, bottom: top + height, left: 0, right: 360, width: 360, x: 0, y: top, toJSON() {} } as DOMRect;
  };
}

const scrollBy = vi.fn();

beforeAll(() => {
  Object.defineProperty(window, "innerHeight", { value: 800, configurable: true });
  window.scrollBy = scrollBy as unknown as typeof window.scrollBy;
  installRevealTop();
});

/** The results page: sticky tab bar (44px) and one section with a header button. */
function page(sectionTop: number) {
  document.body.innerHTML = `
    <main>
      <nav class="dash-nav"><button role="tab" id="tab">Numerology</button></nav>
      <div id="section"><button id="header" aria-expanded="false">Personal Year</button><div id="body"></div></div>
    </main>`;
  const nav = document.querySelector(".dash-nav")!;
  box(nav, () => ({ top: 0, height: 44 }));
  const state = { open: false, top: sectionTop };
  const section = document.getElementById("section")!;
  const header = document.getElementById("header")!;
  box(section, () => ({ top: state.top, height: state.open ? 900 : 56 }));
  box(header, () => ({ top: state.top, height: 56 }));
  header.addEventListener("click", () => (state.open = !state.open));
  return { state, header };
}

describe("anything opened is shown from its top", () => {
  beforeEach(() => scrollBy.mockClear());

  it("opening a section low on the screen scrolls it up so its text starts at the top, under the tab bar", async () => {
    const { header } = page(520);
    header.click();
    await settle();
    expect(scrollBy).toHaveBeenCalledTimes(1);
    expect(scrollBy.mock.calls[0][0]).toMatchObject({ top: 520 - (44 + 10) });
  });

  it("a section that jumped up out of view (another one above closed) is brought back to its top", async () => {
    const { state, header } = page(300);
    header.addEventListener("click", () => (state.top = -380)); // the one above collapsed
    header.click();
    await settle();
    expect(scrollBy.mock.calls[0][0]).toMatchObject({ top: -380 - 54 });
  });

  it("works for any control that opens something — not just accordions (a card, a 'more' button)", async () => {
    document.body.innerHTML = `<main><div id="card"><p>Intro</p><span role="button" id="more">More</span></div></main>`;
    const card = document.getElementById("card")!;
    let open = false;
    box(card, () => ({ top: 610, height: open ? 700 : 120 }));
    box(document.getElementById("more")!, () => ({ top: 700, height: 24 }));
    document.getElementById("more")!.addEventListener("click", () => (open = true));
    document.getElementById("more")!.click();
    await settle();
    expect(scrollBy.mock.calls[0][0]).toMatchObject({ top: 610 - 10 }); // the card's top, not the button's
  });

  it("leaves the page alone when nothing opened, when closing, when already in full view, or for tabs", async () => {
    let p = page(200);
    p.state.open = true; // closing an open section
    p.header.click();
    await settle();
    document.getElementById("tab")!.click();
    await settle();
    p = page(120);
    const section = document.getElementById("section")!;
    box(section, () => ({ top: 120, height: p.state.open ? 400 : 56 })); // fits on screen once open
    p.header.click();
    await settle();
    expect(scrollBy).not.toHaveBeenCalled();
  });

  it("doesn't fight the user: no jump if they scroll meanwhile", async () => {
    const { header } = page(520);
    header.click();
    window.dispatchEvent(new Event("touchmove"));
    await settle();
    expect(scrollBy).not.toHaveBeenCalled();
  });

  it("revealTop() (used by the cards that jump to a section) puts it at the top, not the centre", () => {
    page(0);
    const target = document.createElement("div");
    document.querySelector("main")!.appendChild(target);
    box(target, () => ({ top: 1400, height: 300 }));
    revealTop(target, false);
    expect(scrollBy).toHaveBeenCalledWith({ top: 1400 - 54, behavior: "auto" });
  });
});

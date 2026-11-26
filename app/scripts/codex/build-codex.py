#!/usr/bin/env python3
"""
Builds src/lib/codex/codex-data.json — the "Codex" layer (numbers 1–9, 11, 22,
33 and the twelve Chinese zodiac animals).

    python3 scripts/codex/build-codex.py

INTERNAL NOTE (never shown in the app): source.txt is the text of the uploaded
"GG33 Organised Compliment" PDF (GG33 / Gary "The Numbers Guy" teachings,
compiled from NotebookLM-style chat answers). Every bullet is carried over
verbatim; only the chat framing ("Here is everything stated in the sources…",
"Would you like…?", the Studio-panel note) is dropped, line wraps are joined,
LaTeX is turned into plain symbols, and public references to GG33 / Gary /
"the sources" are replaced by neutral wording ("this system", "the
numerologist"). The build asserts that none of those names survive.
"""
import json
import re
import sys
import unicodedata
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = HERE / "source.txt"
OUT = HERE.parent.parent / "src" / "lib" / "codex" / "codex-data.json"

raw = unicodedata.normalize("NFKC", SRC.read_text(encoding="utf-8"))
raw = re.sub(r"\n*=====PAGE=====\n*", "\n", raw)
LINES = raw.split("\n")


def find(pred, start=0):
    for i in range(start, len(LINES)):
        if pred(LINES[i]):
            return i
    raise ValueError("marker not found")


def starts(s):
    return lambda l: l.strip().startswith(s)


# ── Locate every chapter by its markers (robust to page-break removal) ──────
def first_section_after(i):
    return find(lambda l: l.startswith("### "), i)


def next_would_you(i):
    return find(lambda l: "Would you like" in l, i)


# Explicit boundaries, discovered from markers rather than line numbers.
def locate():
    out = {}
    nums = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
    pos = 0
    for n in nums:
        s = find(lambda l, n=n: f"**Number {n} /" in l, pos)
        a = first_section_after(s)
        if n == "7":
            e = next_would_you(a)
            out["7a"] = (a, e)
            b = first_section_after(e)
            e2 = next_would_you(b)
            out["7b"] = (b, e2)
            pos = e2 + 1
            continue
        e = next_would_you(a)
        out[n] = (a, e)
        pos = e + 1
    # 11 has no intro line: it starts right after the 9's closing question.
    a = first_section_after(pos)
    e = find(lambda l: "Number 22 / 22 Life Path" in l or ("regarding **Master" in l), a)
    out["11"] = (a, e)
    a = first_section_after(e)
    e = next_would_you(a)
    out["22"] = (a, e)
    comp = find(starts("### **Summary of Compiled Topics"), e)
    comp_end = next_would_you(comp)
    out["compendium"] = (comp + 1, comp_end)
    pos = comp_end + 1
    for animal, key in [("Rat", "Rat"), ("Ox", "OxA"), ("Tiger", "Tiger"), ("Rabbit /", "Rabbit"), ("Dragon", "Dragon")]:
        s = find(lambda l, animal=animal: f"**{animal}" in l, pos)
        a = first_section_after(s)
        e = next_would_you(a)
        out[key] = (a, e)
        pos = e + 1
    p1 = find(starts("# **PART 1"), pos)
    p2 = find(starts("# **PART 2"), p1)
    out["Snake"] = (first_section_after(p1), p2)
    a = first_section_after(p2)
    e = next_would_you(a)
    out["OxB"] = (a, e)
    pos = e + 1
    for animal in ["Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"]:
        s = find(lambda l, animal=animal: f"**{animal}**" in l, pos)
        a = first_section_after(s)
        try:
            e = next_would_you(a)
        except ValueError:
            e = len(LINES)
        nxt = None
        try:
            nxt = find(lambda l: l.strip().startswith("Here is"), a)
        except ValueError:
            pass
        if nxt is not None and nxt < e:
            e = nxt
        out[animal] = (a, e)
        pos = e
    return out


# ── Inline clean-up ─────────────────────────────────────────────────────────
def clean_inline(t: str) -> str:
    t = re.sub(r"\\+rightarrow", "→", t)
    t = re.sub(r"\\+\(", "", t)
    t = re.sub(r"\\+\)", "", t)
    t = t.replace("\\$", "$")
    t = re.sub(r"\\+", "", t)
    t = t.replace("`", "")
    # single-asterisk italics → the app's ==emphasis== marker
    t = re.sub(r"(?<!\*)\*(?![\s*])([^*\n]+?)(?<![\s*])\*(?!\*)", r"==\1==", t)
    t = re.sub(r"[ \t]{2,}", " ", t)
    t = re.sub(r"\(\s+", "(", t)
    t = re.sub(r"\s+\)", ")", t)
    return t.strip()


NEUTRAL = [
    (r"Gary \(the founder of GG33\)", "The numerologist behind this system"),
    (r"Gary \(The Numbers Guy\)", "The system's founding numerologist"),
    (r"Elon Musk \(Pig born 1971\) vs\. Gary \(Snake\)", "Elon Musk (Pig born 1971) vs. the system's founding numerologist (Snake)"),
    (r"opposition to Gary \(a Snake\)", "opposition to the system's founding numerologist (a Snake)"),
    (r"([Tt])he GG33 system", r"\1his system"),
    (r"In the GG33 framework", "In this framework"),
    (r"GG33’s framework", "this system’s framework"),
    (r"GG33's framework", "this system's framework"),
    (r"In GG33 (letterology|numerology|child-rearing)", r"In this system's \1"),
    (r"GG33 child-rearing", "this system's child-rearing"),
    (r"within the GG33 analysis", "within this system's analysis"),
    (r"Within the GG33 analysis", "Within this system's analysis"),
    (r"In GG33,", "In this system,"),
    (r"Predicted by GG33", "Predicted by this system"),
    (r"which GG33 uses", "which this system uses"),
    (r"which GG33 cited", "which this system cited"),
    (r"that GG33 states", "that this system states"),
    (r"Mentioned in the Sources", "on Record"),
    (r"in the sources", "in this system"),
    (r"the sources", "this system"),
    (r"GG33", "the system"),
    (r"Gary’s", "the numerologist’s"),
    (r"Gary's", "the numerologist's"),
    (r"Gary", "the numerologist"),
]


def neutralise(t: str) -> str:
    for a, b in NEUTRAL:
        t = re.sub(a, b, t)
    # Capitalise a replacement that opens a sentence / bullet / bold run.
    t = re.sub(r"(^|[.!?:]\s+|\*\*\s*|^==|—\s)(the|this) (system|numerologist)",
               lambda m: m.group(1) + m.group(2).capitalize() + " " + m.group(3), t)
    t = t.replace("vs. The system's", "vs. the system's")
    return t


# ── Section → app text ──────────────────────────────────────────────────────
BULLET = re.compile(r"^(\s*)\*\s+(.*)$")
HEAD4 = re.compile(r"^####\s+(.*)$")


def section_text(lines):
    """Join wrapped lines into items, then render in the app's text format."""
    items = []  # (kind, depth, text)
    for l in lines:
        if not l.strip() or l.strip() == "---":
            if items and items[-1][0] == "para":
                items.append(("gap", 0, ""))
            continue
        m4 = HEAD4.match(l.strip())
        mb = BULLET.match(l)
        if m4:
            items.append(("head", 0, m4.group(1)))
        elif mb:
            depth = 1 if len(mb.group(1).replace("\t", "  ")) >= 2 else 0
            items.append(("bullet", depth, mb.group(2)))
        elif items and items[-1][0] in ("bullet", "para", "head") and not (items[-1][0] == "head"):
            k, d, t = items[-1]
            items[-1] = (k, d, t + " " + l.strip())
        else:
            items.append(("para", 0, l.strip()))
    out = []
    for k, d, t in items:
        t = neutralise(clean_inline(t))
        if not t and k != "gap":
            continue
        if k == "head":
            t = t.strip("*").strip()
            out += ["", f"#### {t}"]
        elif k == "bullet":
            out.append(("◦ " if d else "• ") + t)
        elif k == "para":
            out += ["", t, ""]
    text = "\n".join(out)
    text = re.sub(r"\n{3,}", "\n\n", text).strip()
    return text


def split_sections(a, b):
    """### headings inside [a, b) → [(title, text)]."""
    secs = []
    cur = None
    body = []
    pending = False
    for l in LINES[a:b]:
        if l.startswith("### "):
            if cur is not None:
                secs.append((cur, body))
            cur = l[4:]
            body = []
            pending = not cur.rstrip().endswith("**")
        elif l.startswith("# "):
            continue
        elif cur is not None and pending and not body:
            cur += " " + l.strip()
            pending = not cur.rstrip().endswith("**")
        else:
            if "Would you like" in l:
                break
            body.append(l)
    if cur is not None:
        secs.append((cur, body))
    res = []
    for title, body in secs:
        title = clean_inline(title).strip("*").strip()
        title = re.sub(r"^\d+\.\s*", "", title)
        title = neutralise(title)
        res.append((title, section_text(body)))
    return res


B = locate()

# ── Compendium summaries ("At a Glance") ────────────────────────────────────
comp_lines = LINES[B["compendium"][0]:B["compendium"][1]]
comp_text = []
for l in comp_lines:
    if re.match(r"^\d+\.\s+\*\*Part", l.strip()):
        comp_text.append("@@PART " + l.strip())
        continue
    if l.strip() == "---":
        continue
    comp_text.append(l)
glance = {}
cur = None
buf = []


def flush():
    if cur:
        glance[cur] = neutralise(clean_inline(" ".join(buf)))


for l in comp_text:
    if l.startswith("@@PART"):
        flush(); cur = None; buf = []
        part_title = l
        continue
    m = BULLET.match(l)
    if m:
        flush()
        body = m.group(2)
        hm = re.match(r"\*\*(.+?):\*\*\s*(.*)", body)
        if not hm:
            cur = None
            continue
        key = hm.group(1)
        km = re.match(r"(?:Master )?Number (\d+)", key) or re.match(r"(\w+)(?:/Cat)? \(", key)
        cur = km.group(1)
        buf = [hm.group(2)]
    elif cur:
        buf.append(l.strip())
flush()
# "Direct enemy of\n1." was split by a line wrap that looked like a numbered list.
part4 = [l for l in comp_text if l.startswith("@@PART") and "Part IV" in l]
part4_desc = neutralise(clean_inline(" ".join(
    BULLET.match(l).group(2) if BULLET.match(l) else l.strip()
    for l in comp_lines[[i for i, l in enumerate(comp_lines) if "Part IV" in l][0] + 1:] if l.strip() and l.strip() != "---")))

NUMBER_SUBTITLES = {
    "1": "Number 1 / Life Path 1",
    "2": "Number 2 / Life Path 2 / 2 Energy",
    "3": "Number 3 / Life Path 3 / 3 Energy",
    "4": "Number 4 / Life Path 4 / 4 Energy / 4 Cycles",
    "5": "Number 5 / Life Path 5 / 5 Energy / 5 Cycles",
    "6": "Number 6 / Life Path 6 / 6 Energy",
    "7": "Number 7 / Life Path 7 / 7 Energy / 7 Cycles",
    "8": "Number 8 / Life Path 8 / 8 Energy / 8 Cycles",
    "9": "Number 9 / Life Path 9 / 9 Energy / 9 Cycles",
    "11": "Master Number 11 / 11 Life Path / 11 Energy",
    "22": "Master Number 22 / 22 Life Path / 22 Energy",
    "33": "Master Number 33 / 33 Life Path / 33 Energy",
}
NUMBER_TITLES = {
    "1": "The Leader", "2": "The Peacemaker", "3": "The Communicator", "4": "The Builder of Order",
    "5": "The Free Spirit", "6": "The Keeper of Home", "7": "The Genius", "8": "The Wealth Frequency",
    "9": "The Enigma", "11": "The Old Soul", "22": "The Master Builder", "33": "The Master Teacher",
}


def layers(key):
    return [{"title": t, "text": x} for t, x in split_sections(*B[key])]


numbers = {}
for n in ["1", "2", "3", "4", "5", "6", "8", "9", "11", "22"]:
    numbers[n] = {"layers": layers(n)}
numbers["7"] = {"layers": [dict(l, group="Perspective I") for l in layers("7a")] +
                [dict(l, group="Perspective II") for l in layers("7b")]}

animals = {}
for a in ["Rat", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"]:
    animals[a] = {"layers": layers(a)}
animals["Ox"] = {"layers": [dict(l, group="Perspective I") for l in layers("OxA")] +
                 [dict(l, group="Perspective II") for l in layers("OxB")]}


# ── Number 33: the material has no chapter of its own, so its layers are the
# compendium summary plus every passage about 33 found elsewhere (verbatim),
# then one expounded layer written for the app. ────────────────────────────
def layer_of(collection, key, title_prefix):
    for l in collection[key]["layers"]:
        if l["title"].startswith(title_prefix):
            return l
    raise KeyError(title_prefix)


def block(text, starts_with):
    """A top-level bullet and its nested children, verbatim."""
    out, on = [], False
    for line in text.split("\n"):
        if line.startswith("• "):
            on = line.startswith(starts_with)
        elif line.startswith("#### "):
            on = False
        if on:
            out.append(line)
    assert out, starts_with
    return "\n".join(out)


snake_core = layer_of(animals, "Snake", "Core Essence")["text"]
snake_figs = layer_of(animals, "Snake", "Prominent Snake Figures")["text"]
rooster_figs = layer_of(animals, "Rooster", "Prominent Figures")["text"]
six_family = layer_of(numbers, "6", "Family Business")["text"]
numbers["33"] = {"layers": [
    {"title": "The Master Teacher — Highest Human Vibration",
     "text": layer_of(numbers, "3", "Higher Vibration")["text"]},
    {"title": "The 33/6 Master Vibration",
     "text": layer_of(numbers, "6", "The 33/6")["text"] + "\n" +
     next(l for l in six_family.split("\n") if "33/6" in l).replace("◦ ", "• ")},
    {"title": "The Snake Connection — 33 AD",
     "text": block(snake_core, "• **Connection to Master Number 33")},
    {"title": "Prominent 33 Figures on Record",
     "text": "\n".join([
         next(l for l in snake_figs.split("\n") if "founding numerologist" in l),
         next(l for l in snake_figs.split("\n") if "Zelenskyy" in l),
         block(rooster_figs, "• **Vince McMahon"),
     ])},
    {"title": "Living the 33 — An Expounded Reading", "expounded": True, "text": "\n".join([
        "• **Built From Two Threes:** 33 is the 3 doubled. The 3 is the entertainer, the comedian and the mouthpiece; doubled and raised to a Master Number, that same gift of communication stops being entertainment and becomes **teaching**. The 33 is meant to speak so that others learn.",
        "• **Grounded by the 6:** 33 reduces to 6 (3 + 3 = 6), the frequency of home, family and responsibility. That is why the 33 so often teaches from inside a family, a family business or a household it protects and provides for — the 6 is the floor the Master Teacher stands on.",
        "• **Pure 33 vs. 33/6:** A pure 33 holds the Master Teacher frequency more steadily; a 33/6 oscillates, living some seasons as the global influencer (33) and others as the keeper of the home (6). Neither is a lesser path — knowing which mode is active explains why ambition and duty seem to take turns.",
        "• **The Spine Code:** The 33 vertebrae of the human spine make the 33 the backbone image of the system: the 33 is meant to be the structure others lean on, and it carries that weight best when its own body and posture are disciplined.",
        "• **The 33-Degree Threshold:** Water freezes at 32 degrees and liquefies at 33 — the 33 is the frequency at which what was frozen begins to move again. In practice the 33 thrives as the person who unlocks stuck people, stuck families and stuck institutions.",
        "• **Snake Affinity:** Because 33 AD was a Snake year and the Snake is the sign of the occult, numerology and astrology, a 33 who is also a Snake carries the teacher frequency at double strength, and every 33 tends to prosper in Snake years and around Snake-energy allies.",
        "• **The Shadow of the Master Teacher:** The 3 inside the 33 can still lie for the sport of it, and the 6 can still smother. An unevolved 33 preaches without living the lesson; an evolved 33 teaches by example first and by speech second.",
    ])},
]}

# "At a Glance" summaries. 6–9, 11, 22, 33 and every animal come from the
# material's own compendium (verbatim); 1–5 were not summarised there, so their
# glances are written for the app from their own chapters.
WRITTEN_GLANCE = {
    "1": "The leader and the masculine frequency of new beginnings, innovation and creation. Dominant, aggressive and \"not soft\"; amplifies aggression in already aggressive signs. Must be athletic (the thin shape of the 1; A for Athlete) and must avoid alcohol (A for Alcohol). Direct enemy: 9. Friendly with 11 and with Horse energy.",
    "2": "The pure feminine vibration: sensitive, supportive and secondary in role. The peacemaker and diplomat — make peace on the 2nd of the month. Ideal second-in-command (Vice President, COO). Women born on the 2nd carry hourglass figures; 2 energy mellows aggressive signs.",
    "3": "The entertainer, comedian and social butterfly who earns through the mouthpiece. Spontaneous, joyful, and when unevolved a liar for the sport of it — 3 is the number of the criminal. Direct enemy: 4 (law and order). Bedroom magic with 5s. January 3rd holds the most soulmates in the world. Gateway to the Master Teacher, 33.",
    "4": "The frequency of law, order, government, structure and discipline (BLUE = 4). No shortcuts: success through hard work and labour. Direct enemy: 3, the criminal. 4-year cycles bring courts, arrests and discipline. Born on the 4th, 13th or 31st: worker energy drawn to law enforcement, government and the military.",
    "5": "The vibration of good looks, attraction, health and the entertainer (E, the 5th letter). Open-minded, highly sexual, and bound to change, travel, freedom and evolution — stagnant 5 energy fails its cycle. 5 personal years are for evolution and dating. The United States is a 5 Life Path nation.",
}
for k, v in WRITTEN_GLANCE.items():
    glance[k] = v

# ── Part IV: the Strategic Matrix of trines (described in the material but
# never actually tabulated — built here from the animal chapters). ──────────
TRINES = [
    {"id": "wealthy", "name": "The Wealthy Trine", "members": ["Rat", "Monkey", "Dragon"],
     "signature": "The wealthiest trine in astrology, heavily favored by the matrix for financial success.",
     "roles": "Strategists and plotters (Rat), playful intelligence (Monkey) and natural authority (Dragon)."},
    {"id": "enforcer", "name": "The Enforcer Trine", "members": ["Ox", "Snake", "Rooster"],
     "signature": "The enforcers who operate through raw power and execution — and the most loyal trine in astrology (first vowel O = 15th letter → 6, the first vowel of Loyalty).",
     "roles": "The Snake is the wise leader and teacher; the Ox and Rooster are the executioners and soldiers. \"A snake should always be an ox's teacher.\""},
    {"id": "athletic", "name": "The Athletic / Fighting Trine", "members": ["Tiger", "Horse", "Dog"],
     "signature": "The fighters, workaholics and physical powerhouses of the zodiac who value movement, action and physical discipline.",
     "roles": "Brute force (Tiger), relentless work (Horse) and the entertainer who must be walked and kept active (Dog)."},
    {"id": "leastloyal", "name": "The Least Loyal Trine", "members": ["Rabbit", "Goat", "Pig"],
     "signature": "A powerhouse for making money and generating wealth — with about as much loyalty in that trine as a back alley.",
     "roles": "The master psychologist (Cat), the best-looking finesser (Goat) and the natural politician (Pig) — each operating to see who can use the other most."},
]
ENEMIES = [["Rat", "Horse"], ["Ox", "Goat"], ["Tiger", "Monkey"], ["Rabbit", "Rooster"], ["Dragon", "Dog"], ["Snake", "Pig"]]
DISPLAY = {"Rabbit": "Cat"}


def nm(a):
    return DISPLAY.get(a, a)


def trine_text(animal):
    t = next(x for x in TRINES if animal in x["members"])
    foe = next(b if a == animal else a for a, b in ENEMIES if animal in (a, b))
    foe_t = next(x for x in TRINES if foe in x["members"])
    lines = [
        "#### Your Alliance",
        f"• **{nm(animal)} → {t['name']}** ({', '.join(nm(m) for m in t['members'])}): {t['signature']}",
        f"◦ {t['roles']}",
        f"• **Direct Enemy — The {nm(foe)}:** The {nm(foe)} sits in {foe_t['name']}. Enemy signs struggle together, and each sign's enemy year (the year of its opposite animal) is a year to lay low rather than expand, marry or launch.",
        "",
        "#### The Strategic Matrix",
        "• " + part4_desc,
    ]
    for x in TRINES:
        pairs = "; ".join(f"{nm(m)} vs. {nm(next(b if a == m else a for a, b in ENEMIES if m in (a, b)))}" for m in x["members"])
        lines.append(f"• **{x['name']} — {', '.join(nm(m) for m in x['members'])}:** {x['signature']}")
        lines.append(f"◦ **Roles:** {x['roles']}")
        lines.append(f"◦ **Direct enemies:** {pairs}.")
    lines += [
        "",
        "#### Reading the Matrix",
        "• **Enemies Cross in Pairs of Trines:** Every enemy of a Wealthy Trine sign sits in the Athletic / Fighting Trine, and every enemy of an Enforcer sits in the Least Loyal Trine — so the twelve animals form two great rivalries: wealth against force, and loyalty against self-interest.",
        "• **The Worst Pairings:** The Ox–Goat conflict is ranked the absolute worst enemy pairing in astrology, with Monkey–Tiger right alongside it.",
    ]
    return "\n".join(lines)


def finish(entry_layers, glance_text, extra=None):
    out = [{"title": "At a Glance", "text": glance_text, "glance": True}] + entry_layers
    if extra:
        out.append(extra)
    for i, l in enumerate(out):
        l["id"] = f"l{i + 1}"
    return out


NUMBER_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "11", "22", "33"]
ANIMAL_KEYS = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"]
data = {
    "numbers": {n: {"title": NUMBER_TITLES[n], "subtitle": NUMBER_SUBTITLES[n],
                    "layers": finish(numbers[n]["layers"], glance[n])} for n in NUMBER_KEYS},
    "animals": {a: {"title": nm(a) if a != "Rabbit" else "Cat (Rabbit)",
                    "layers": finish(animals[a]["layers"], glance[a],
                                     {"title": "Trine Alliances & The Strategic Matrix", "text": trine_text(a), "matrix": True})}
                for a in ANIMAL_KEYS},
    "trines": TRINES,
    "enemies": ENEMIES,
}

blob = json.dumps(data, ensure_ascii=False)
for bad in ["GG33", "Gary", "the sources", "Would you like", "Studio panel", "Here is", "\\\\(", "=====PAGE"]:
    assert bad not in blob, bad
assert not re.search(r"\bsources?\b", blob, re.I), re.search(r".{40}\bsources?\b.{40}", blob, re.I).group(0)
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print("numbers:", {n: len(data["numbers"][n]["layers"]) for n in NUMBER_KEYS})
print("animals:", {a: len(data["animals"][a]["layers"]) for a in ANIMAL_KEYS})
print("bytes:", OUT.stat().st_size)

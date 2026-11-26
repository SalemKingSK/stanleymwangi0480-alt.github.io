# Internal check: every word sequence of the source chapters survives in codex-data.json.
import json, re
exec(open('build-codex.py').read().split('B = locate()')[0])
B = locate()
d = json.load(open(OUT))
def words(t):
    t = re.sub(r"[*=#•◦`\\]|rightarrow", " ", t)
    return re.findall(r"[\w'’$%°.-]+", t.lower())
def grams(ws, n=5):
    return {tuple(ws[i:i+n]) for i in range(len(ws)-n+1)}
M = {"7a":("numbers","7"),"7b":("numbers","7"),"OxA":("animals","Ox"),"OxB":("animals","Ox")}
bad = 0
for key,(a,b) in B.items():
    if key == "compendium": continue
    grp,k = M.get(key, ("numbers" if key[0].isdigit() else "animals", key))
    src = "\n".join(re.sub(r"^#+\s*\**\d+\.\s*", "", l) for l in LINES[a:b] if "Would you like" not in l and l.strip() != "---" and not l.startswith("# "))
    src = neutralise(clean_inline(src))
    out = " ".join(l["title"] + " " + l["text"] for l in d[grp][k]["layers"])
    g = grams(words(src)); o = grams(words(out))
    miss = g - o
    print(key, len(g), "missing", len(miss))
    bad += len(miss)
    for m in list(miss)[:6]: print("   ", " ".join(m))

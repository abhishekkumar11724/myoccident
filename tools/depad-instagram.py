#!/usr/bin/env python3
"""
Remove the blurred side/top bars Instagram adds when it squares a non-square photo.

    python3 tools/depad-instagram.py input.webp [output.webp]      # auto-detect, prints the crop box
    python3 tools/depad-instagram.py input.webp out.webp --box 180,0,1260,1440   # force a crop box

Use it on photos exported from an Instagram backup BEFORE dropping them into photos/<category>/.
(Photos taken straight from your phone gallery do not need this.) Needs: pip install pillow
"""
import sys, statistics
from PIL import Image, ImageOps, ImageChops

CANDS = [0, 108, 144, 180, 240, 315]  # common pad widths on a 1440px square

def profiles(im):
    g = im.convert("L"); W, H = g.size
    dx = ImageChops.difference(g.crop((0, 0, W - 1, H)), g.crop((1, 0, W, H)))
    dy = ImageChops.difference(g.crop((0, 0, W, H - 1)), g.crop((0, 1, W, H)))
    col = list(dx.resize((W - 1, 1), Image.BOX).get_flattened_data() if hasattr(dx, "get_flattened_data") else dx.resize((W - 1, 1), Image.BOX).getdata())
    row = list(dy.resize((1, H - 1), Image.BOX).get_flattened_data() if hasattr(dy, "get_flattened_data") else dy.resize((1, H - 1), Image.BOX).getdata())
    return col, row

def score(p, n, b):
    if b == 0: return 0.0
    bar = sum(p[2:b - 3]) / max(1, b - 5)
    cont = sum(p[b + 3:min(n - 1, 2 * b)]) / max(1, min(n - 1, 2 * b) - b - 3)
    step = max(p[b - 2:b + 2]); base = statistics.median(p[b + 3:b + 40]) + 0.5
    return (cont / (bar + 0.3)) * (step / base)

def detect(im, thr=10):
    W, H = im.size
    if abs(W - 1440) > 8 and abs(H - 1440) > 8: return (0, 0, W, H)   # not an Instagram square export
    scale = W / 1440
    col, row = profiles(im)
    best = lambda p, n: max(((score(p, n, int(b * scale)), int(b * scale)) for b in CANDS))
    sx, bx = best(col, W); sy, by = best(row, H)
    bx = bx if sx > thr else 0; by = by if sy > thr else 0
    return (bx, by, W - bx, H - by)

if __name__ == "__main__":
    if len(sys.argv) < 2: print(__doc__); sys.exit(1)
    src = sys.argv[1]; out = sys.argv[2] if len(sys.argv) > 2 and not sys.argv[2].startswith("--") else None
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    box = tuple(int(v) for v in sys.argv[sys.argv.index("--box") + 1].split(",")) if "--box" in sys.argv else detect(im)
    print("crop box:", box, "of", im.size)
    if out: im.crop(box).save(out, quality=92, method=6) if out.lower().endswith(".webp") else im.crop(box).save(out, quality=92)

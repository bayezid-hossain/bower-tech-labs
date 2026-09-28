"""Compare Playwright screenshots against the Figma exports.

Writes side-by-side slices (design | build | diff) and prints a per-band mismatch report.
"""
from pathlib import Path

from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "tests" / "visual" / "output"
PAIRS = {
    "desktop": ROOT / "assets" / "Final Design.png",
    "mobile": ROOT / "assets" / "Frame 2147241977.png",
}
BAND = 700


def compare(name: str, design_path: Path) -> None:
    shot_path = OUT / f"{name}.png"
    if not shot_path.exists():
        print(f"[skip] {shot_path} missing")
        return
    design = Image.open(design_path).convert("RGB")
    shot = Image.open(shot_path).convert("RGB")
    print(f"\n== {name}: design {design.size}, build {shot.size} (height diff {shot.height - design.height:+d}px)")

    width, height = design.width, max(design.height, shot.height)
    d = Image.new("RGB", (width, height), "white")
    d.paste(design, (0, 0))
    s = Image.new("RGB", (width, height), "white")
    s.paste(shot.crop((0, 0, width, shot.height)), (0, 0))
    diff = ImageChops.difference(d, s).convert("L").point(lambda v: 255 if v > 40 else 0)

    slices = OUT / f"{name}-slices"
    slices.mkdir(parents=True, exist_ok=True)
    for i, y in enumerate(range(0, height, BAND)):
        box = (0, y, width, min(y + BAND, height))
        band = diff.crop(box)
        pct = 100 * band.histogram()[255] / (band.width * band.height)
        print(f"  band {i:02d} y={y:5d}-{box[3]:5d}: {pct:5.1f}% differing")
        red = Image.merge("RGB", (band, Image.new("L", band.size, 0), Image.new("L", band.size, 0)))
        row = Image.new("RGB", (width * 3, box[3] - y), "white")
        row.paste(d.crop(box), (0, 0))
        row.paste(s.crop(box), (width, 0))
        row.paste(red, (width * 2, 0))
        row.save(slices / f"{i:02d}.png")


if __name__ == "__main__":
    for name, path in PAIRS.items():
        compare(name, path)

"""Crop pixel-exact brand assets from the transparent 2x design export.

Boxes are in 1x design coordinates (Final Design.png); the source is the 2x export.
Also writes solid placeholder images for every AI-generated slot that doesn't exist yet.
"""
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SRC_2X = ROOT / "assets" / "Frame 2147241938.png"
PUBLIC = ROOT / "public"
PLACEHOLDER = (0xC0, 0xDC, 0xEB)

# dest -> (x0, y0, x1, y1, circle)
CROPS = {
    "brand/logo-lockup.png": (120, 30, 321, 62, False),
    "brand/logo-lockup-lg.png": (120, 10621, 351, 10661, False),
    "brand/hero-glass.png": (839, 148, 1320, 640, False),
    "brand/play-reel.png": (408, 1686, 1020, 2138, False),
    "brand/wordmark.png": (133, 11038, 1313, 11179, False),
    "brand/whatsapp.png": (360, 536, 384, 560, True),
    "logos/logoipsum-shield.png": (353, 1321, 567, 1353, False),
    "logos/logoipsum-diamond.png": (615, 1321, 777, 1353, False),
    "images/team/ssm-siam.png": (264, 10136, 364, 10236, False),
    "images/testimonials/avatar-1.png": (684, 8396, 740, 8452, True),
    "images/testimonials/avatar-2.png": (1044, 8396, 1100, 8452, True),
}

# AI-generated slots: dest -> (width, height) at 2x
GENERATED = {
    **{f"images/hero/gallery-{i}.jpg": (1072, 1224) for i in range(1, 5)},
    **{f"images/recent-works/work-{i}.jpg": (1072, 1224) for i in range(1, 5)},
    "images/services/ui-ux-design.jpg": (1116, 728),
    "images/services/logo-branding.jpg": (1116, 728),
    "images/services/web-development.jpg": (1116, 728),
    "images/services/ui-ux-redesign.jpg": (1116, 728),
    **{f"images/projects/project-{i}.jpg": (1100, 1006) for i in range(1, 5)},
    "images/testimonials/avatar-3.jpg": (112, 112),
}


def crop(dest: str, box: tuple) -> None:
    x0, y0, x1, y1, circle = box
    img = Image.open(SRC_2X).convert("RGBA").crop((x0 * 2, y0 * 2, x1 * 2, y1 * 2))
    if circle:
        mask = Image.new("L", img.size, 0)
        ImageDraw.Draw(mask).ellipse((0, 0, img.width - 1, img.height - 1), fill=255)
        alpha = Image.composite(img.getchannel("A"), mask, mask)
        img.putalpha(alpha)
    out = PUBLIC / dest
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out)
    print(f"crop  {dest} {img.size}")


def placeholder(dest: str, size: tuple) -> None:
    out = PUBLIC / dest
    if out.exists():
        print(f"keep  {dest}")
        return
    out.parent.mkdir(parents=True, exist_ok=True)
    Image.new("RGB", size, PLACEHOLDER).save(out, quality=90)
    print(f"stub  {dest} {size}")


def main() -> None:
    for dest, box in CROPS.items():
        crop(dest, box)
    for dest, size in GENERATED.items():
        placeholder(dest, size)
    mark = Image.open(ROOT / "assets" / "Group 1413375668.png")
    mark.save(PUBLIC / "brand" / "logo-mark.png")
    print("copy  brand/logo-mark.png", mark.size)


if __name__ == "__main__":
    main()

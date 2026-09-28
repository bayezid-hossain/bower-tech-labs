"""Cover-crop an image to an exact size and save as JPEG.

Usage: python scripts/fit-image.py <src> <dest> <width> <height>
"""
import sys
from pathlib import Path

from PIL import Image, ImageOps


def main() -> None:
    src, dest, width, height = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
    img = Image.open(src).convert("RGB")
    fitted = ImageOps.fit(img, (width, height), method=Image.LANCZOS, centering=(0.5, 0.5))
    Path(dest).parent.mkdir(parents=True, exist_ok=True)
    fitted.save(dest, quality=88, optimize=True)
    print(f"{dest} {fitted.size}")


if __name__ == "__main__":
    main()

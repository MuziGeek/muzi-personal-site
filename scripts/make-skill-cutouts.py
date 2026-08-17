"""Create alpha-preserving Skill illustration cutouts from the original WebP files.

The source illustrations stay untouched. Background removal is intentionally
edge-connected so enclosed light details such as paper and cat fur remain opaque.
"""

from __future__ import annotations

from collections import deque
from pathlib import Path
from statistics import median

from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SKILL_DIR = ROOT / "public" / "images" / "skills"
ASSETS = (
    ("mz-icon-design.webp", "mz-icon-design-cutout.webp", 22),
    ("mz-crayon-illustrations.webp", "mz-crayon-illustrations-cutout.webp", 22),
    ("mz-minimal-zine.webp", "mz-minimal-zine-cutout.webp", 75),
)

EDGE_FEATHER_RADIUS = 0.65


def sample_border_key(image: Image.Image) -> tuple[int, int, int]:
    width, height = image.size
    pixels = image.load()
    band = 10
    samples: list[tuple[int, int, int]] = []

    for x in range(width):
        for y in range(band):
            samples.append(pixels[x, y][:3])
            samples.append(pixels[x, height - 1 - y][:3])
    for y in range(height):
        for x in range(band):
            samples.append(pixels[x, y][:3])
            samples.append(pixels[width - 1 - x, y][:3])

    return tuple(int(round(median(sample[channel] for sample in samples))) for channel in range(3))


def is_background(
    pixel: tuple[int, int, int, int],
    key: tuple[int, int, int],
    tolerance: int,
) -> bool:
    return max(abs(pixel[channel] - key[channel]) for channel in range(3)) <= tolerance


def connected_background_mask(
    image: Image.Image,
    key: tuple[int, int, int],
    tolerance: int,
) -> Image.Image:
    width, height = image.size
    pixels = image.load()
    visited = bytearray(width * height)
    queue: deque[tuple[int, int]] = deque()

    def enqueue(x: int, y: int) -> None:
        index = y * width + x
        if visited[index] or not is_background(pixels[x, y], key, tolerance):
            return
        visited[index] = 1
        queue.append((x, y))

    for x in range(width):
        enqueue(x, 0)
        enqueue(x, height - 1)
    for y in range(height):
        enqueue(0, y)
        enqueue(width - 1, y)

    while queue:
        x, y = queue.popleft()
        if x > 0:
            enqueue(x - 1, y)
        if x + 1 < width:
            enqueue(x + 1, y)
        if y > 0:
            enqueue(x, y - 1)
        if y + 1 < height:
            enqueue(x, y + 1)

    alpha = Image.new("L", image.size, 255)
    alpha.putdata([0 if value else 255 for value in visited])
    return alpha.filter(ImageFilter.GaussianBlur(EDGE_FEATHER_RADIUS))


def create_cutout(source: Path, output: Path, tolerance: int) -> None:
    with Image.open(source) as opened:
        image = opened.convert("RGBA")

    key = sample_border_key(image)
    alpha = connected_background_mask(image, key, tolerance)
    image.putalpha(alpha)
    image.save(output, "WEBP", lossless=True, quality=100, method=6, exact=True)

    alpha_histogram = alpha.histogram()
    transparent = alpha_histogram[0]
    partial = sum(alpha_histogram[1:255])
    opaque = alpha_histogram[255]
    bbox = alpha.getbbox()
    corners = (
        alpha.getpixel((0, 0)),
        alpha.getpixel((image.width - 1, 0)),
        alpha.getpixel((0, image.height - 1)),
        alpha.getpixel((image.width - 1, image.height - 1)),
    )

    if corners != (0, 0, 0, 0):
        raise RuntimeError(f"{output.name}: corners are not transparent: {corners}")
    if bbox is None or bbox == (0, 0, image.width, image.height):
        raise RuntimeError(f"{output.name}: invalid alpha bounds: {bbox}")
    if transparent == 0 or opaque == 0:
        raise RuntimeError(f"{output.name}: alpha channel lacks transparent or opaque pixels")

    print(
        f"{output.name}: key={key}, tolerance={tolerance}, bbox={bbox}, "
        f"transparent={transparent}, partial={partial}, opaque={opaque}"
    )


def main() -> None:
    for source_name, output_name, tolerance in ASSETS:
        create_cutout(SKILL_DIR / source_name, SKILL_DIR / output_name, tolerance)


if __name__ == "__main__":
    main()

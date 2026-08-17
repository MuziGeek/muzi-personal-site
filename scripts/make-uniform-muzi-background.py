from __future__ import annotations

import argparse
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image


TARGET = np.array([0xF3, 0xEB, 0xDB], dtype=np.float32)


def warm_background_candidates(rgb: np.ndarray) -> np.ndarray:
    values = rgb.astype(np.int16)
    red, green, blue = values[..., 0], values[..., 1], values[..., 2]
    # The originals use a warm studio sweep whose lower area contains a darker
    # cast shadow. Keep the selection broad enough to include that sweep, but
    # reject skin and saturated subject colors. Flood filling from the canvas
    # edge prevents enclosed light objects (paper, shoe rubber) being selected.
    warm_neutral = (
        (red >= 122)
        & (green >= 108)
        & (blue >= 90)
        & ((red - green) >= -3)
        & ((red - green) <= 43)
        & ((green - blue) >= -3)
        & ((green - blue) <= 43)
        & ((red - blue) <= 70)
    )
    return warm_neutral


def edge_connected_mask(candidates: np.ndarray) -> np.ndarray:
    height, width = candidates.shape
    mask = np.zeros_like(candidates, dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    def add(y: int, x: int) -> None:
        if candidates[y, x] and not mask[y, x]:
            mask[y, x] = True
            queue.append((y, x))

    for x in range(width):
        add(0, x)
        add(height - 1, x)
    for y in range(height):
        add(y, 0)
        add(y, width - 1)

    while queue:
        y, x = queue.popleft()
        if y > 0:
            add(y - 1, x)
        if y + 1 < height:
            add(y + 1, x)
        if x > 0:
            add(y, x - 1)
        if x + 1 < width:
            add(y, x + 1)
    return mask


def dilate(mask: np.ndarray, iterations: int) -> np.ndarray:
    result = mask.copy()
    for _ in range(iterations):
        padded = np.pad(result, 1, mode="constant")
        result = (
            padded[1:-1, 1:-1]
            | padded[:-2, 1:-1]
            | padded[2:, 1:-1]
            | padded[1:-1, :-2]
            | padded[1:-1, 2:]
            | padded[:-2, :-2]
            | padded[:-2, 2:]
            | padded[2:, :-2]
            | padded[2:, 2:]
        )
    return result


def process(source: Path, destination: Path) -> dict[str, object]:
    image = Image.open(source).convert("RGB")
    rgb = np.asarray(image)
    candidates = warm_background_candidates(rgb)
    background = edge_connected_mask(candidates)

    # Feather only the one-pixel boundary. The subject itself remains unchanged.
    outer = dilate(background, 1) & ~background
    output = rgb.astype(np.float32)
    output[background] = TARGET
    output[outer] = output[outer] * 0.78 + TARGET * 0.22
    output = np.clip(np.rint(output), 0, 255).astype(np.uint8)

    destination.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(output, "RGB").save(destination, optimize=True)

    flat = output[background]
    unique_background = np.unique(flat.reshape(-1, 3), axis=0)
    return {
        "source": str(source),
        "destination": str(destination),
        "width": image.width,
        "height": image.height,
        "background_pixels": int(background.sum()),
        "background_ratio": round(float(background.mean()), 6),
        "uniform_background_colors": int(len(unique_background)),
        "target_rgb": TARGET.astype(int).tolist(),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    args = parser.parse_args()
    print(process(args.source, args.destination))


if __name__ == "__main__":
    main()

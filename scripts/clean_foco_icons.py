"""Cut FOCO characters: transparent bg; keep character only (no glow/rings)."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

ROOT = Path(r"c:\Projects\FOCO-App\assets")
FILES = [
    ROOT / "icons" / "foco_state_a.png",
    ROOT / "icons" / "foco_state_b.png",
    ROOT / "icons" / "foco_state_c.png",
    ROOT / "icons" / "foco_state_d.png",
    ROOT / "icons" / "logo-foco.png",
    ROOT / "images" / "foco-logo.png",
]


def load_source(path: Path) -> Image.Image:
    bak = path.with_suffix(path.suffix + ".bak")
    if not bak.exists():
        bak.write_bytes(path.read_bytes())
    return Image.open(bak).convert("RGBA")


def clean(img: Image.Image, *, wordmark: bool = False, max_dist: float = 8.0) -> Image.Image:
    arr = np.asarray(img).astype(np.float32)
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    mx = np.maximum(np.maximum(r, g), b)
    luma = 0.2126 * r + 0.7152 * g + 0.0722 * b

    # Local detail: character has highlights/face; soft aura is low-variance
    mean = ndimage.uniform_filter(luma, size=11)
    mean_sq = ndimage.uniform_filter(luma * luma, size=11)
    var = np.clip(mean_sq - mean * mean, 0, None)

    purple = (b > 50) & (r > 35) & (b >= g * 0.85) & (r >= g * 0.65) & (mx > 55)
    shine = (luma > 165) & (mx > 170)
    cheek = (r > 145) & (g > 60) & (g < 175) & (b > 95) & (r > b * 0.8)
    letter = wordmark & purple & (mx > 85)

    # Prefer detailed purple regions (body) over smooth aura wash
    detailed = var > (35 if wordmark else 55)
    body = ((purple & detailed) | shine | cheek | letter) & (mx > 28)

    # Grow into continuous character silhouette
    body = ndimage.binary_closing(body, iterations=3)
    body = ndimage.binary_dilation(body, iterations=2)
    body = ndimage.binary_fill_holes(body)

    # Largest blob = character (and letters for wordmark)
    labeled, n = ndimage.label(body)
    if n:
        sizes = ndimage.sum(body, labeled, index=range(1, n + 1))
        if wordmark:
            thr = max(30, 0.008 * body.size)
            body = np.isin(labeled, [i + 1 for i, s in enumerate(sizes) if s >= thr])
        else:
            body = labeled == (int(np.argmax(sizes)) + 1)

    dist = ndimage.distance_transform_edt(~body)
    keep = (dist <= max_dist) & (mx > 18)

    keep_img = Image.fromarray((keep.astype(np.uint8) * 255), mode="L")
    keep_img = keep_img.filter(ImageFilter.MaxFilter(3))
    keep_img = keep_img.filter(ImageFilter.MinFilter(3))
    keep = np.asarray(keep_img) > 0

    # Final largest-component cleanup (non-wordmark)
    labeled, n = ndimage.label(keep)
    if n and not wordmark:
        sizes = ndimage.sum(keep, labeled, index=range(1, n + 1))
        keep = labeled == (int(np.argmax(sizes)) + 1)
    elif n and wordmark:
        thr = max(30, 0.008 * keep.size)
        sizes = ndimage.sum(keep, labeled, index=range(1, n + 1))
        keep = np.isin(labeled, [i + 1 for i, s in enumerate(sizes) if s >= thr])

    out = arr.copy()
    out[:, :, 3] = np.where(keep, 255.0, 0.0)
    out[~keep] = 0

    cleaned = Image.fromarray(out.astype(np.uint8), "RGBA")
    bbox = cleaned.getbbox()
    if bbox:
        pad = 6
        l, t, rr, bb = bbox
        cleaned = cleaned.crop(
            (
                max(0, l - pad),
                max(0, t - pad),
                min(cleaned.width, rr + pad),
                min(cleaned.height, bb + pad),
            )
        )
    return cleaned


def main() -> None:
    dist = {
        "foco_state_a.png": 7,
        "foco_state_b.png": 6,
        "foco_state_c.png": 6,
        "foco_state_d.png": 6,
        "logo-foco.png": 5,
        "foco-logo.png": 6,
    }
    for path in FILES:
        src = load_source(path)
        wordmark = path.name == "logo-foco.png"
        out = clean(src, wordmark=wordmark, max_dist=dist[path.name])
        out.save(path, optimize=True)
        print(f"ok {path.name}: {src.size} -> {out.size}")


if __name__ == "__main__":
    main()

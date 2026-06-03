from __future__ import annotations

import io
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / "assets"
ASSETS.mkdir(exist_ok=True)

SOURCE_IMAGES = {
    "hero-lab.webp": "https://raw.createusercontent.com/d1893b66-8bf7-42a6-8e3e-7c7eeffab526/",
    "campus.webp": "https://raw.createusercontent.com/edc82ec4-de75-44ec-b81f-c8fda3ea9fa3/",
    "anatomy.webp": "https://raw.createusercontent.com/45904d99-3d55-4d22-bc96-3b91fd7ccc09/",
    "physiology.webp": "https://raw.createusercontent.com/ba07b000-16fa-41ac-81f4-7bfdb2727c6e/",
    "biochemistry.webp": "https://raw.createusercontent.com/11ea8cfc-0c2e-46fb-ae4e-f31e564ce4c4/",
    "outreach.webp": "https://raw.createusercontent.com/b262986b-9866-4646-88f8-69e2ce5de99e/",
    "whitecoat.webp": "https://raw.createusercontent.com/6e517c76-3c6a-41fb-858e-863ae88d3c43/",
    "sports.webp": "https://raw.createusercontent.com/1b83388e-dcc7-4c7d-bc81-ba3dd9f91171/",
}

TARGET_ALIASES = {
    "gallery-lecture.webp": "hero-lab.webp",
    "gallery-practical.webp": "anatomy.webp",
    "gallery-outreach.webp": "outreach.webp",
    "gallery-sports.webp": "sports.webp",
    "gallery-campus.webp": "campus.webp",
    "gallery-whitecoat.webp": "whitecoat.webp",
    "gallery-seminar.webp": "physiology.webp",
    "staff-banner.webp": "campus.webp",
    "executives-banner.webp": "whitecoat.webp",
    "contact-banner.webp": "outreach.webp",
    "exec-amina-yusuf.webp": "whitecoat.webp",
    "exec-daniel-okafor.webp": "physiology.webp",
    "exec-chisom-eze.webp": "anatomy.webp",
    "exec-ibrahim-musa.webp": "biochemistry.webp",
    "exec-maryam-bello.webp": "campus.webp",
    "exec-samuel-ojo.webp": "outreach.webp",
    "exec-esther-paul.webp": "whitecoat.webp",
    "exec-michael-adebayo.webp": "sports.webp",
    "staff-prof.-e.-onuoha.webp": "campus.webp",
    "staff-dr.-a.-okoro.webp": "anatomy.webp",
    "staff-mrs.-n.-udo.webp": "physiology.webp",
    "staff-mr.-c.-eke.webp": "biochemistry.webp",
    "staff-ms.-l.-umeh.webp": "outreach.webp",
    "staff-dr.-i.-bassey.webp": "whitecoat.webp",
}


def hex_rgba(color: str, alpha: int = 255) -> tuple[int, int, int, int]:
    color = color.lstrip("#")
    if len(color) == 3:
        color = "".join(ch * 2 for ch in color)
    return tuple(int(color[i : i + 2], 16) for i in (0, 2, 4)) + (alpha,)


def save_webp(image: Image.Image, path: Path, quality: int = 86) -> None:
    image.save(path, format="WEBP", quality=quality, method=6)


def download_image(url: str) -> Image.Image:
    with urllib.request.urlopen(url, timeout=30) as response:
        data = response.read()
    return Image.open(io.BytesIO(data)).convert("RGBA")


def fit_image(image: Image.Image, size: tuple[int, int], centering: tuple[float, float] = (0.5, 0.45)) -> Image.Image:
    return ImageOps.fit(image, size, method=Image.Resampling.LANCZOS, centering=centering)


def add_soft_frame(image: Image.Image) -> Image.Image:
    framed = image.convert("RGBA")
    overlay = Image.new("RGBA", framed.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    draw.rounded_rectangle(
        (10, 10, framed.width - 10, framed.height - 10),
        radius=34,
        outline=(255, 255, 255, 38),
        width=2,
    )
    overlay = overlay.filter(ImageFilter.GaussianBlur(0.8))
    return Image.alpha_composite(framed, overlay)


def clean_logo(source_path: Path, target_path: Path) -> None:
    image = Image.open(source_path).convert("RGBA")
    width, height = image.size
    pixels = image.load()

    if width == 0 or height == 0:
        return

    from collections import deque

    background = [[False] * width for _ in range(height)]
    queue = deque()

    def is_background(px: int, py: int) -> bool:
        r, g, b, a = pixels[px, py]
        return a > 0 and (r + g + b) < 80

    for x in range(width):
        if is_background(x, 0):
            queue.append((x, 0))
        if is_background(x, height - 1):
            queue.append((x, height - 1))
    for y in range(height):
        if is_background(0, y):
            queue.append((0, y))
        if is_background(width - 1, y):
            queue.append((width - 1, y))

    while queue:
        x, y = queue.popleft()
        if not (0 <= x < width and 0 <= y < height):
            continue
        if background[y][x] or not is_background(x, y):
            continue
        background[y][x] = True
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < width and 0 <= ny < height and not background[ny][nx]:
                queue.append((nx, ny))

    cleaned = Image.new("RGBA", image.size, (0, 0, 0, 0))
    cleaned_pixels = cleaned.load()
    min_x, min_y = width, height
    max_x, max_y = 0, 0
    for y in range(height):
        for x in range(width):
            if background[y][x]:
                continue
            r, g, b, a = pixels[x, y]
            if a <= 0:
                continue
            cleaned_pixels[x, y] = (r, g, b, a)
            min_x = min(min_x, x)
            min_y = min(min_y, y)
            max_x = max(max_x, x)
            max_y = max(max_y, y)

    crop = cleaned.crop((min_x, min_y, max_x + 1, max_y + 1)) if min_x < max_x and min_y < max_y else cleaned
    tile = Image.new("RGBA", (512, 512), hex_rgba("#233e72"))
    glow = Image.new("RGBA", tile.size, (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gdraw.rounded_rectangle((18, 18, 494, 494), radius=88, fill=(255, 255, 255, 14), outline=(255, 255, 255, 24), width=2)
    glow = glow.filter(ImageFilter.GaussianBlur(14))
    tile = Image.alpha_composite(tile, glow)

    fitted = ImageOps.contain(crop, (392, 392), method=Image.Resampling.LANCZOS)
    tile.paste(fitted, ((512 - fitted.width) // 2, (512 - fitted.height) // 2), fitted)
    save_webp(tile, target_path, quality=92)


def download_and_convert(url: str, target_name: str, size: tuple[int, int], centering: tuple[float, float] = (0.5, 0.45)) -> None:
    image = download_image(url)
    if image.mode not in ("RGB", "RGBA"):
        image = image.convert("RGBA")
    fitted = fit_image(image, size, centering=centering)
    fitted = add_soft_frame(fitted)
    save_webp(fitted, ASSETS / target_name, quality=88)


def build_assets() -> None:
    logo_source = ROOT / "logo.jpg"
    if logo_source.exists():
        clean_logo(logo_source, ASSETS / "logo-clean.webp")
        logo = Image.open(ASSETS / "logo-clean.webp").convert("RGBA")
        favicon = ImageOps.fit(logo, (96, 96), method=Image.Resampling.LANCZOS)
        save_webp(favicon, ASSETS / "favicon.webp", quality=92)

    # Base images used across the site. These should preserve the human/people-focused
    # look from the earlier version of the site.
    for target_name, url in SOURCE_IMAGES.items():
        download_and_convert(url, target_name, (1600, 1000))

    for target_name, alias in TARGET_ALIASES.items():
        source_path = ASSETS / alias
        if not source_path.exists():
            continue
        image = Image.open(source_path).convert("RGBA")
        size = (1600, 1000) if "banner" in target_name or "gallery" in target_name else (1100, 1400)
        centering = (0.5, 0.42) if size[1] > size[0] else (0.5, 0.45)
        fitted = fit_image(image, size, centering=centering)
        save_webp(add_soft_frame(fitted), ASSETS / target_name, quality=86)


if __name__ == "__main__":
    build_assets()

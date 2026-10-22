"""Extract the supplied mockup photography without modifying its source PNGs.

Requires Pillow. Example:
  python scripts/prepare-assets.py --source-dir "C:/Users/you/Downloads"
"""

from argparse import ArgumentParser
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps


SOURCES = {
    "hero": "Pet shop sofisticado com cão e gato (1).png",
    "services": "Serviços premium de banho e tosa.png",
    "gallery": "Galeria acolhedora do pet shop.png",
    "facade": "Fachada ao entardecer, mapa e contato.png",
}

# Pixel boxes are left, top, right, bottom, measured on the 1487 x 1058
# supplied originals. They exclude mockup headers, empty controls and borders.
CROPS = {
    "hero": ("hero", (0, 70, 1487, 950)),
    "hero-mobile": ("hero", (700, 150, 1487, 885)),
    "service-bath": ("services", (76, 145, 502, 268)),
    "service-grooming": ("services", (530, 145, 957, 268)),
    "service-brushing": ("services", (985, 145, 1413, 268)),
    "service-nails": ("services", (76, 421, 502, 547)),
    "service-hydration": ("services", (530, 421, 957, 547)),
    "service-products": ("services", (985, 421, 1413, 547)),
    "about": ("services", (90, 686, 740, 987)),
    "gallery-welcome": ("gallery", (63, 187, 860, 788)),
    "gallery-cat": ("gallery", (910, 187, 1423, 470)),
    "gallery-space": ("gallery", (910, 494, 1424, 788)),
    "facade": ("facade", (620, 58, 1487, 531)),
}


def main():
    parser = ArgumentParser(description=__doc__)
    parser.add_argument("--source-dir", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, default=Path("public/images"))
    parser.add_argument("--contact-sheet", type=Path)
    args = parser.parse_args()
    originals = {}
    for key, filename in SOURCES.items():
        with Image.open(args.source_dir / filename) as original:
            if original.size != (1487, 1058):
                raise ValueError(f"Unexpected original size for {filename}: {original.size}")
            originals[key] = original.convert("RGB")

    args.output_dir.mkdir(parents=True, exist_ok=True)
    previews = []
    for name, (source, box) in CROPS.items():
        crop = originals[source].crop(box)
        destination = args.output_dir / f"{name}.webp"
        crop.save(destination, "WEBP", quality=87, method=6)
        print(f"{destination.name}: {crop.width} x {crop.height}, {destination.stat().st_size:,} bytes")
        if args.contact_sheet:
            preview = Image.new("RGB", (440, 300), "#FAF7F2")
            thumb = ImageOps.contain(crop, (420, 264))
            preview.paste(thumb, ((440-thumb.width)//2, 25+(264-thumb.height)//2))
            ImageDraw.Draw(preview).text((10, 8), f"{name}: {crop.width} x {crop.height}", fill="#183D38")
            previews.append(preview)

    if args.contact_sheet:
        sheet = Image.new("RGB", (1320, 300*((len(previews)+2)//3)), "#FAF7F2")
        for index, preview in enumerate(previews):
            sheet.paste(preview, ((index % 3)*440, (index // 3)*300))
        args.contact_sheet.parent.mkdir(parents=True, exist_ok=True)
        sheet.save(args.contact_sheet)


if __name__ == "__main__":
    main()

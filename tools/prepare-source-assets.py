"""Source-only V2 asset preparation. No artwork, upscale, render or retouch.

Copies public runtime assets and preserves archival original PNGs/provenance.
The native alpha cutouts already exist in film V2 and are checked against the
original product RGB in every visible and opaque pixel before being selected.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import shutil
from pathlib import Path

from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT.parents[1]
V1 = PROJECT / "web/v1"
FILM2 = PROJECT / "tanitim-filmi/v2"
FILM3 = PROJECT / "tanitim-filmi/v3"
INVENTORY = ROOT / "source-inventory.json"
DATE = "2026-10-13"


def sha(path: Path) -> str:
    result = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            result.update(block)
    return result.hexdigest()


def write_json(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def compare_native_rgb(original: Path, native: Path, crop: list[int]) -> dict:
    with Image.open(original) as source_image, Image.open(native) as native_image:
        source = source_image.convert("RGBA").crop(crop)
        cutout = native_image.convert("RGBA")
        assert source.size == cutout.size, f"Native crop dimensions differ: {native.name}"
        difference = ImageChops.difference(source.convert("RGB"), cutout.convert("RGB"))
        results = {}
        for key, minimum in [("visible", 1), ("opaque", 250)]:
            mask = cutout.getchannel("A").point(lambda value: 255 if value >= minimum else 0)
            masked_difference = ImageChops.multiply(difference, Image.merge("RGB", (mask, mask, mask)))
            assert masked_difference.getbbox() is None, f"Product {key} RGB differs: {native.name}"
            results[key + "RgbExactlyMatchesOriginalCrop"] = True
            results[key + "PixelCountChecked"] = mask.histogram()[255]
        results.update({"nativeDimensions": list(cutout.size), "sourcePixelCrop": crop,
                        "labelRedrawn": False, "resampled": False,
                        "comparison": "Direct pixel comparison of native RGB with the registered crop from the original official PNG; alpha/provenance separately preserved."})
        return results


def prepare() -> None:
    matrix = json.loads((V1 / "docs/research/product-source-matrix.json").read_text(encoding="utf-8"))
    film_ledger = json.loads((FILM2 / "production/asset-source-ledger.json").read_text(encoding="utf-8"))
    film_by_id = {item["id"]: item for item in film_ledger["assets"]}
    copies, inputs, products = [], {}, []

    def copy(source: Path, relative: str, kind: str, source_url: str | None = None) -> dict:
        original_hash = sha(source)
        inputs[str(source)] = original_hash
        target = ROOT / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        if target.exists():
            assert sha(target) == original_hash, f"Existing target differs; will not overwrite: {relative}"
        else:
            shutil.copyfile(source, target)
        assert sha(target) == original_hash and sha(source) == original_hash
        item = {"path": relative, "originalSourcePath": str(source), "sha256": original_hash,
                "bytes": target.stat().st_size, "kind": kind, "copiedByteForByte": True,
                "sourceUrl": source_url}
        copies.append(item)
        return item

    for product in matrix["products"]:
        pid, filename = product["id"], product["filename"]
        original = V1 / product["preparedPath"]
        native = FILM2 / "public/products/native" / filename
        registered = film_by_id["PROD-" + product["productIdentity"]["slug"]]
        assert sha(original) == product["sha256"] == registered["sha256"]
        assert sha(native) == registered["nativeSha256"]
        comparison = compare_native_rgb(original, native, registered["sourcePixelCrop"])
        original_copy = copy(original, "assets/source/products/originals/" + filename, "official-original-packshot", product["sourceUrl"])
        native_copy = copy(native, "assets/source/products/native/" + filename, "existing-registered-native-alpha-cutout", product["sourceUrl"])
        runtime = copy(native, "public/assets/products/" + filename, "runtime-real-product-native-cutout", product["sourceUrl"])
        products.append({"id": pid, "slug": product["productIdentity"]["slug"], "identity": product["productIdentity"],
                         "original": original_copy, "native": native_copy, "runtime": runtime,
                         "originalProductOpaqueDimensions": [product["image"]["effectiveProductWidth"], product["image"]["effectiveProductHeight"]],
                         "sourceUrl": product["sourceUrl"], "sourcePage": product["sourcePage"],
                         "liveSourceByteVerifiedAt": DATE if pid in ["P01", "P04", "P09"] else None,
                         "nativeDerivativeShaDiffersFromOriginal": original_copy["sha256"] != native_copy["sha256"],
                         "nativeAlphaProvenance": registered.get("alphaProvenance"), "rgbComparison": comparison,
                         "nativeProvenanceEvidencePath": "assets/source/evidence/film-v2-asset-source-ledger.json"})

    facilities = []
    for fid, slug in [("F01", "burhaniye"), ("F02", "ovakoy")]:
        source = V1 / f"design/approval-panels/homepage-r02/references/{fid}-{slug}-pdfium-render-visible.png"
        archive = copy(source, f"assets/source/facilities/{fid}-{slug}.png", "real-catalogue-facility-PDFium-decode")
        runtime = copy(source, f"public/assets/facilities/{fid}.png", "runtime-real-catalogue-facility-photo")
        with Image.open(source) as image:
            size = list(image.size)
        facilities.append({"id": fid, "location": slug, "archive": archive, "runtime": runtime,
                           "dimensions": size, "sourceType": "Actual archived catalogue photograph, not AI generation",
                           "captureDateKnown": False, "decodeEvidence": "assets/source/evidence/factory-source-decode.json"})
    copy(V1 / "design/approval-panels/homepage-r02/references/source-decode.json", "assets/source/evidence/factory-source-decode.json", "PDF-decode-provenance")

    brand = copy(V1 / "assets/source/brand/burcu-logo.png", "assets/source/brand/burcu-logo.png", "official-logo-PNG",
                 "https://www.burcu.com.tr/wp-content/themes/burcu/images/burcu-logo-v2.png")
    brand_runtime = copy(V1 / "assets/source/brand/burcu-logo.png", "public/assets/brand/burcu-logo.png", "runtime-official-logo-PNG", brand["sourceUrl"])
    vector_candidate = copy(FILM3 / "public/brand/burcu-logo.svg", "assets/source/brand/burcu-logo-catalogue.svg", "catalogue-vector-candidate-pending-visual-review")
    fonts = []
    for filename, source_folder, source_url in [
        ("Manrope.ttf", "fonts", "https://github.com/google/fonts/tree/main/ofl/manrope"),
        ("OFL.txt", "fonts", "https://github.com/google/fonts/tree/main/ofl/manrope"),
        ("NotoSansArabic.ttf", "brand", "https://github.com/google/fonts/tree/main/ofl/notosansarabic"),
        ("OFL-NotoSansArabic.txt", "brand", "https://github.com/google/fonts/tree/main/ofl/notosansarabic"),
    ]:
        source = V1 / "assets/source" / source_folder / filename
        archive = copy(source, "assets/source/fonts/" + filename, "OFL-font-or-license", source_url)
        runtime = copy(source, "public/assets/fonts/" + filename, "runtime-OFL-font-or-license", source_url)
        fonts.append({"archive": archive, "runtime": runtime, "license": "SIL-OFL-1.1"})

    movie = copy(FILM3 / "out/burcu-v3-tarladan-sofralara.mp4", "public/assets/video/burcu-concept.mp4", "concept-brand-film; representative-photos-and-motion-graphics")
    for filename in ["delivery-summary.json", "full-film-qa.json", "products-authenticity.json"]:
        copy(FILM3 / "qa" / filename, "assets/source/evidence/film-v3-" + filename, "existing-internal-technical-QA")
    copy(FILM2 / "production/asset-source-ledger.json", "assets/source/evidence/film-v2-asset-source-ledger.json", "registered-native-alpha-and-RGB-provenance")
    qa = json.loads((FILM3 / "qa/delivery-summary.json").read_text(encoding="utf-8"))
    assert movie["sha256"] == qa["movieSha256"]
    for source, original_hash in inputs.items():
        assert sha(Path(source)) == original_hash, f"Protected input changed: {source}"

    inventory = {"schemaVersion": "2.0-source-inventory", "preparedAt": DATE, "sourceOnly": True,
                 "creativeAssetsProduced": 0, "originalSourcesAndV1Preserved": True,
                 "preparedCopyCount": len(copies), "uniqueProtectedInputCount": len(inputs),
                 "products": products, "facilities": facilities, "brand": {"archive": brand, "runtime": brand_runtime, "vectorCandidate": vector_candidate},
                 "fonts": fonts, "copies": copies,
                 "protectedInputs": [{"path": path, "sha256": value} for path, value in sorted(inputs.items())],
                 "sameSkuHigherResolutionAudit": {"verifiedAt": DATE, "livePrimaryPages": ["https://www.burcu.com.tr/urunler/ketcap-mayonez/", "https://www.burcu.com.tr/urunler/haslanmis-urunler/", "https://www.burcu.com.tr/urunler/domates-salcasi/"], "maxAdvertisedSrcsetCanvas": 1024, "threeLivePngHashesMatchLocalOriginals": True, "sameSkuHigherResolutionFound": False, "scope": "Inspected primary pages and known local asset folders only; not a claim that no private print master exists."},
                 "packagingLocks": {"P04": "Actual 250g long red bottle; no invented back label or full 3D turn", "P09": "Actual 600g green-cap jar; red-cap catalogue variant not substituted"},
                 "qualityLimit": "Canvas size is not label detail. Original opaque widths P04=300,P09=308,P01=412px. Native cutouts preserve source RGB and add no new detail. No native 4K/retina label claim or hypothetical upscale.",
                 "retinaCapacity": {"formula": "maximum CSS width without enlargement = effective source width / devicePixelRatio", "dpr2MaxCssWidths": {"P04": 150, "P09": 154, "P01": 206}},
                 "facilityPolicy": "F01/F02 are actual archived catalogue photos decoded via PDFium. Generated representative factory interiors do not belong in actual-facility proof. Photo count never proves operating facility count.",
                 "film": {"runtime": movie, "width": 1920, "height": 1080, "fps": 25, "frames": 3750, "videoDurationSeconds": 150, "containerDurationSeconds": 150.016, "technicalDeliveryComplete": qa["technicalDeliveryComplete"], "humanFilmAccepted": qa["humanFilmAccepted"], "customerReady": qa["customerReady"], "shots": 30, "authenticPackages": 24, "portfolioFamilies": 19, "filmSourceType": "Concept film: user-authorised generated representative photography, authored motion graphics and real product pixels; not documentary footage of actual Burcu interiors.", "knownException": "Intentional 40ms plain-cream first sample frame3650 at closing fade", "loadingPolicy": "preload none; user clicks Play before metadata/media request; never a heavy startup hero request"},
                 "otherExistingSources": {"filmV2Pilot": {"path": str(FILM2 / "out/burcu-v2-quality-pilot.mp4"), "videoDurationSeconds": 20, "width": 1920, "height": 1080, "bytes": 10719584, "type": "Representative generated commercial pilot; not real-factory proof"}, "filmV3Products": {"path": str(FILM3 / "public/products"), "count": 24, "families": 19, "type": "Authentic un-upscaled native cutouts; source selection differs from 10-SKU web demo and omits yaprak-sarma"}, "filmV3NativeLookdev": {"path": str(FILM3 / "public/lookdev/native"), "count": 3, "dimensions": [5504, 3072], "type": "Generated representative photographic inputs, not actual company photos; not copied into the actual-facility pool"}, "educationV2": {"path": str(PROJECT / "egitim-demo/v2"), "productFileCount": 10, "productHashesMatchV1": True, "type": "Same PNG packshots; cartoon learning scenes excluded from corporate photograph pool"}},
                 "officialBurcuTv": {"url": "https://www.burcu.com.tr/burcu-tv/", "verifiedAt": DATE, "iframeOrVideoEmbedFound": False, "localActualFactoryDocumentaryVideoFound": False},
                 "publicationRights": "User-authorised private demo use; public rights and final publishing acceptance remain separate."}
    write_json(INVENTORY, inventory)
    verify()


def verify() -> None:
    inventory = json.loads(INVENTORY.read_text(encoding="utf-8"))
    for item in inventory["protectedInputs"]:
        assert sha(Path(item["path"])) == item["sha256"], f"Original source changed: {item['path']}"
    for item in inventory["copies"]:
        assert sha(ROOT / item["path"]) == item["sha256"], f"Copy differs: {item['path']}"
    for product in inventory["products"]:
        compare_native_rgb(ROOT / product["original"]["path"], ROOT / product["native"]["path"], product["rgbComparison"]["sourcePixelCrop"])
    print(json.dumps({"status": "PASS", "inventoryPath": str(INVENTORY), "preparedCopies": len(inventory["copies"]), "protectedInputs": len(inventory["protectedInputs"]), "runtimeProducts": len(inventory["products"]), "opaqueAndVisibleRgbExactMatch": "10/10", "facilityPhotos": len(inventory["facilities"]), "conceptFilmSha256": inventory["film"]["runtime"]["sha256"], "sourceOnly": True, "V1Preserved": True}, ensure_ascii=False))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--verify", action="store_true", help="Read-only input/copy/RGB verification")
    arguments = parser.parse_args()
    verify() if arguments.verify else prepare()

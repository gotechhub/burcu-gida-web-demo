"""Encode immutable Burcu TTF sources as WOFF2 and verify decoded font data.

Run with tools/font-runtime/Scripts/python.exe. This utility never subsets,
changes font axes, edits source TTFs, or wires a runtime UI font import.
"""

from __future__ import annotations

import argparse
import hashlib
import io
import json
import sys
from datetime import datetime, timezone
from importlib.metadata import version
from pathlib import Path

from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.ttLib import TTFont
from fontTools.ttLib.woff2 import compress, decompress


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "assets" / "source" / "fonts"
RUNTIME_DIR = ROOT / "public" / "assets" / "fonts"
FONT_NAMES = ("Manrope", "NotoSansArabic")
AXIS_TABLES = {"fvar", "avar", "gvar", "HVAR", "VVAR", "MVAR", "STAT", "cvar"}
SHAPING_TABLES = {"GSUB", "GPOS", "GDEF", "BASE", "JSTF"}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def stable_hash(value: object) -> str:
    payload = json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def ensure(condition: bool, message: str) -> None:
    if not condition:
        raise RuntimeError(message)


def cmap_signature(font: TTFont) -> list[dict]:
    result = []
    for table in font["cmap"].tables:
        item = {
            "format": table.format,
            "platformID": table.platformID,
            "platEncID": table.platEncID,
            "language": table.language,
            "cmap": sorted(getattr(table, "cmap", {}).items()),
        }
        if hasattr(table, "uvsDict"):
            item["uvsDict"] = sorted(
                (selector, sorted(entries)) for selector, entries in table.uvsDict.items()
            )
        result.append(item)
    return result


def axis_signature(font: TTFont) -> list[dict]:
    if "fvar" not in font:
        return []
    return [
        {
            "tag": axis.axisTag,
            "min": axis.minValue,
            "default": axis.defaultValue,
            "max": axis.maxValue,
            "flags": axis.flags,
            "nameID": axis.axisNameID,
        }
        for axis in font["fvar"].axes
    ]


def glyph_data_signature(font: TTFont, name: str) -> dict:
    """Compare decoded point topology, composites, instructions and bounds."""
    glyf = font["glyf"]
    glyph = glyf[name]
    coordinates, end_points, flags = glyph.getCoordinates(glyf)
    components = []
    if glyph.isComposite():
        for component in glyph.components:
            component_name, transform = component.getComponentInfo()
            components.append({
                "name": component_name,
                "transform": list(transform),
                "flags": component.flags,
                "firstPt": getattr(component, "firstPt", None),
                "secondPt": getattr(component, "secondPt", None),
            })
    program = getattr(glyph, "program", None)
    return {
        "contours": glyph.numberOfContours,
        "coordinates": [list(point) for point in coordinates],
        "endPoints": list(end_points),
        "flags": list(flags),
        "components": components,
        "instructions": program.getBytecode().hex() if program is not None else "",
        "bounds": [getattr(glyph, key, None) for key in ("xMin", "yMin", "xMax", "yMax")],
    }


def decoded_outline_signature(glyph_set, name: str) -> list:
    pen = DecomposingRecordingPen(glyph_set)
    glyph_set[name].draw(pen)
    return pen.value


def verify_font(name: str, source_hash: str) -> dict:
    source = SOURCE_DIR / f"{name}.ttf"
    target = RUNTIME_DIR / f"{name}.woff2"
    original_runtime = RUNTIME_DIR / f"{name}.ttf"
    ensure(target.exists(), f"Missing WOFF2: {target}")
    ensure(sha256(source) == source_hash, f"Source TTF modified: {source}")
    ensure(sha256(original_runtime) == source_hash, f"Existing runtime TTF differs: {original_runtime}")

    decoded_buffer = io.BytesIO()
    decompress(str(target), decoded_buffer)
    decoded_buffer.seek(0)
    original = TTFont(str(source), recalcBBoxes=False, recalcTimestamp=False)
    decoded = TTFont(decoded_buffer, recalcBBoxes=False, recalcTimestamp=False)
    try:
        source_order = original.getGlyphOrder()
        ensure(source_order == decoded.getGlyphOrder(), f"Glyph order changed: {name}")
        source_tags = set(original.reader.keys())
        decoded_tags = set(decoded.reader.keys())
        ensure(source_tags == decoded_tags, f"Font table set changed: {name}")
        source_cmap = cmap_signature(original)
        ensure(source_cmap == cmap_signature(decoded), f"cmap changed: {name}")
        axes = axis_signature(original)
        ensure(axes == axis_signature(decoded), f"Decoded axes changed: {name}")

        # WOFF2 transforms glyf/loca, and the sfnt checksum changes on decode.
        # All other tables, including variable deltas and Arabic shaping, must
        # retain their original binary data exactly.
        preserved_tags = sorted(source_tags - {"glyf", "loca", "head"})
        table_hashes = {}
        for tag in preserved_tags:
            source_bytes = original.reader[tag]
            decoded_bytes = decoded.reader[tag]
            ensure(source_bytes == decoded_bytes, f"Untransformed table {tag} changed: {name}")
            table_hashes[tag] = hashlib.sha256(source_bytes).hexdigest()

        source_head = original["head"]
        decoded_head = decoded["head"]
        head_keys = (
            "tableVersion", "fontRevision", "unitsPerEm", "created", "modified",
            "xMin", "yMin", "xMax", "yMax", "macStyle", "lowestRecPPEM",
            "fontDirectionHint", "glyphDataFormat",
        )
        ensure(all(getattr(source_head, key) == getattr(decoded_head, key) for key in head_keys),
               f"Head geometry/identity metadata changed: {name}")
        ensure(original["hmtx"].metrics == decoded["hmtx"].metrics, f"Horizontal metrics changed: {name}")
        if "vmtx" in original:
            ensure(original["vmtx"].metrics == decoded["vmtx"].metrics, f"Vertical metrics changed: {name}")
        ensure("glyf" in original, f"This project verifier expects TrueType outlines: {name}")

        source_glyph_set = original.getGlyphSet()
        decoded_glyph_set = decoded.getGlyphSet()
        glyph_hashes = {}
        outline_hashes = {}
        for glyph_name in source_order:
            data = glyph_data_signature(original, glyph_name)
            ensure(data == glyph_data_signature(decoded, glyph_name), f"Decoded glyph data changed: {name}/{glyph_name}")
            outline = decoded_outline_signature(source_glyph_set, glyph_name)
            ensure(outline == decoded_outline_signature(decoded_glyph_set, glyph_name),
                   f"Decoded drawing outline changed: {name}/{glyph_name}")
            glyph_hashes[glyph_name] = stable_hash(data)
            outline_hashes[glyph_name] = stable_hash(outline)

        source_bytes = source.stat().st_size
        woff2_bytes = target.stat().st_size
        return {
            "name": name,
            "sourcePath": source.relative_to(ROOT).as_posix(),
            "existingRuntimeTtfPath": original_runtime.relative_to(ROOT).as_posix(),
            "woff2Path": target.relative_to(ROOT).as_posix(),
            "sourceSha256": source_hash,
            "woff2Sha256": sha256(target),
            "sourceBytes": source_bytes,
            "woff2Bytes": woff2_bytes,
            "savedBytes": source_bytes - woff2_bytes,
            "reductionPercent": round((1 - woff2_bytes / source_bytes) * 100, 2),
            "glyphCount": len(source_order),
            "unicodeCodePointCount": len(original.getBestCmap()),
            "axes": axes,
            "axisTablesPreserved": sorted(source_tags & AXIS_TABLES),
            "shapingTablesPreserved": sorted(source_tags & SHAPING_TABLES),
            "untransformedTablesPreserved": preserved_tags,
            "untransformedTableSha256": table_hashes,
            "decodedGlyphDataSha256": stable_hash(glyph_hashes),
            "decodedDrawingOutlineSha256": stable_hash(outline_hashes),
            "checks": {
                "sourceTtfUnchanged": True,
                "existingRuntimeTtfUnchanged": True,
                "tableSetIdentical": True,
                "glyphOrderIdentical": True,
                "allCmapSubtablesIdentical": True,
                "axisTablesBinaryIdentical": True,
                "shapingTablesBinaryIdentical": True,
                "decodedGlyphPointsContoursCompositesInstructionsBoundsIdentical": True,
                "allDecodedDrawingOutlinesIdentical": True,
                "horizontalAndVerticalMetricsIdentical": True,
                "headGeometryAndIdentityMetadataIdentical": True,
                "subsetApplied": False,
                "axisLimitsChanged": False,
            },
        }
    finally:
        original.close()
        decoded.close()


def write_review(result: dict) -> None:
    qa_dir = ROOT / "qa"
    qa_dir.mkdir(exist_ok=True)
    (qa_dir / "font-codec-review.json").write_text(
        json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    rows = "\n".join(
        f"| {font['name']} | {font['sourceBytes']:,} | {font['woff2Bytes']:,} | {font['savedBytes']:,} | %{font['reductionPercent']} | {font['glyphCount']} |"
        for font in result["fonts"]
    )
    axis_rows = "\n".join(
        f"- **{font['name']}**: " + "; ".join(
            f"`{axis['tag']}` {axis['min']:g}–{axis['max']:g} (varsayılan {axis['default']:g})" for axis in font["axes"]
        ) + f". Korunan değişken font tabloları: {', '.join(font['axisTablesPreserved'])}."
        for font in result["fonts"]
    )
    report = f"""# V2 font codec doğrulaması

**{result['checkedAt']} · PASS · Yerel WOFF2 dönüşümü**

Korunan Manrope ve Noto Sans Arabic TTF kaynakları WOFF2 olarak kodlandı. Fontlar subset edilmedi; glif, karakter veya eksen aralığı çıkarılmadı. Özgün `assets/source/fonts/*.ttf` ve mevcut `public/assets/fonts/*.ttf` dosyaları değişmedi. `src/app/fonts.ts`, UI, CSS ve kaynak lisans dosyaları değiştirilmedi; runtime bağlantısını ana ajan ayrıca yapacaktır.

| Font | TTF byte | WOFF2 byte | Kazanç byte | Azalma | Glif |
|---|---:|---:|---:|---:|---:|
{rows}

Toplam: **{result['totals']['sourceBytes']:,} → {result['totals']['woff2Bytes']:,} byte**, **{result['totals']['savedBytes']:,} byte / %{result['totals']['reductionPercent']}** dosya boyutu azalması. Bu ölçüm yerel font dosyası boyutudur; gerçek browser transferi, mobil LCP veya Lighthouse kazanımı henüz ölçülmüş sayılmaz.

## Kurulum ve izolasyon

- Bundled Python: `{result['pythonExecutableBase']}`; sürüm `{result['pythonVersion']}`.
- Projeye ait ortam: `tools/font-runtime`; global Python veya kullanıcı ortamına paket kurulmadı.
- Paketler yalnız resmî PyPI üzerinden wheel olarak alındı: **fonttools {result['dependencies']['fonttools']}**, **Brotli {result['dependencies']['Brotli']}**. Exact pinler `tools/fonts-requirements.txt` içinde.
- Sandbox geçici klasör erişimi nedeniyle ensurepip/pip geçici dosyaları proje içindeki `tools/font-runtime/tmp` dizinine yönlendirildi. PyPI indirmesi için yalnız bu yerel paket kurulumuna auto-reviewed ağ yükseltmesi kullanıldı; ücretli hizmet veya hesap açılmadı.
- Font lisansları mevcut OFL dosyalarında korundu; lisans metni veya font adları yeniden yazılmadı.

## Çözülmüş içerik karşılaştırması

Her WOFF2 yeniden OpenType/TTF verisine çözüldü ve korunan kaynakla karşılaştırıldı:

1. Font tablo kümesi ve **tüm gliflerin sırası** aynı.
2. Tüm `cmap` alt tabloları; platform/encoding, dil, format, Unicode eşlemeleri ve varsa varyasyon seçicileri aynı.
3. Değişken font eksenleri ve ilgili tabloların binary içeriği aynı. `gvar` delta verilerinin tamamı korunur; yalnız örnek karakter/eksen sınamasıyla yetinilmez.
4. Her glifin çözülmüş koordinatları, kontur uçları, flag’leri, composite bileşen/transform’ları, hint bytecode’u ve bounding box’ı aynı.
5. **Tüm gliflerin decompose edilmiş çizim komutları birebir aynı**; her glif karşılaştırıldı ve font başına toplu SHA-256 imzaları JSON kanıtına kaydedildi.
6. Yatay/dikey metrikler, head geometrisi/kimlik alanları ve WOFF2’nin dönüştürmediği tüm tablolar aynı. Arapça şekillendirme için `GSUB`, `GPOS`, `GDEF` tabloları byte düzeyinde korunmuştur.

{axis_rows}

WOFF2 `glyf`/`loca` depolama biçimini dönüştürür; geri çözülmüş SFNT checksum/yerleşim byte’ları özgün TTF konteyneriyle tamamen aynı olmak zorunda değildir. Kanıt, fontun bütün glif/karakter/eksen/şekillendirme içeriğinin korunmasına dayanır. Byte düzeyinde farklı konteyner, farklı font çizimi diye raporlanmaz.

## Tekrarlanabilir komutlar

```powershell
& 'C:\\Users\\SG\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe' -m venv tools/font-runtime
./tools/font-runtime/Scripts/python.exe -m pip install --index-url https://pypi.org/simple --only-binary=:all: -r tools/fonts-requirements.txt
./tools/font-runtime/Scripts/python.exe tools/encode-fonts.py
./tools/font-runtime/Scripts/python.exe tools/encode-fonts.py --verify
```

Bu sandbox’ta kurulum öncesi `TEMP`/`TMP` için `tools/font-runtime/tmp` proje klasörü kullanılabilir. Kodlama yalnız iki WOFF2 çıktısı üretir; `--verify` çıktıları yeniden kodlamadan kontrol eder. Ayrıntılı boyut, hash, eksen ve table sonuçları [font-codec-review.json](font-codec-review.json) içindedir.

Runtime’ın WOFF2’ye bağlanması, final build ve gerçek mobil font request ölçümü sonraki entegrasyon kontrolüdür. Bu rapor, söz konusu browser aşamalarının tamamlandığını iddia etmez.

Kaynaklar: [FontTools resmî WOFF2 codec dokümanı](https://fonttools.readthedocs.io/en/latest/ttLib/woff2.html), [FontTools PyPI](https://pypi.org/project/fonttools/), [Brotli PyPI](https://pypi.org/project/brotli/).
"""
    (qa_dir / "font-codec-review.md").write_text(report, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--verify", action="store_true", help="Check existing WOFF2 outputs without re-encoding.")
    args = parser.parse_args()
    ensure(Path(sys.prefix).resolve() == (ROOT / "tools" / "font-runtime").resolve(),
           "Run this utility with the project-local font-runtime Python.")
    source_hashes = {name: sha256(SOURCE_DIR / f"{name}.ttf") for name in FONT_NAMES}
    if not args.verify:
        for name in FONT_NAMES:
            compress(str(SOURCE_DIR / f"{name}.ttf"), str(RUNTIME_DIR / f"{name}.woff2"))
    results = [verify_font(name, source_hashes[name]) for name in FONT_NAMES]
    dependencies = {"fonttools": version("fonttools"), "Brotli": version("Brotli")}
    total_source = sum(font["sourceBytes"] for font in results)
    total_woff2 = sum(font["woff2Bytes"] for font in results)
    report = {
        "schemaVersion": "1.0-font-codec-review",
        "checkedAt": datetime.now(timezone.utc).isoformat(),
        "status": "passed",
        "mode": "verify-existing" if args.verify else "encode-and-verify",
        "pythonVersion": sys.version.split()[0],
        "pythonExecutableBase": str(Path(sys.base_prefix) / "python.exe"),
        "pythonEnvironment": str(Path(sys.prefix)),
        "projectLocalEnvironment": Path(sys.prefix).resolve() == (ROOT / "tools" / "font-runtime").resolve(),
        "dependencies": dependencies,
        "fonts": results,
        "totals": {
            "sourceBytes": total_source,
            "woff2Bytes": total_woff2,
            "savedBytes": total_source - total_woff2,
            "reductionPercent": round((1 - total_woff2 / total_source) * 100, 2),
        },
        "uiFontImportsModified": False,
        "browserTransferMeasured": False,
        "lighthouseGainClaimed": False,
    }
    ensure(report["projectLocalEnvironment"], "Run this utility with the project-local font-runtime Python.")
    write_review(report)
    print(json.dumps({"status": report["status"], "totals": report["totals"],
                      "fonts": [{"name": font["name"], "woff2Bytes": font["woff2Bytes"],
                                 "glyphCount": font["glyphCount"]} for font in results]}, indent=2))


if __name__ == "__main__":
    main()

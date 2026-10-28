"""Create a full-character Arabic WOFF2 with width fixed at its default.

Run with tools/font-runtime/Scripts/python.exe -B. The target contains every
source-supported character in the declared full Unicode blocks, plus existing
source-code characters. No character subsetting is applied. Only the unused
wdth axis is instantiated at its original normal-width default 100; wght stays
variable 100–900. Original font sources and OFL files remain unchanged.
"""
from __future__ import annotations

import argparse
import copy
import hashlib
import importlib.util
import io
import json
from datetime import datetime, timezone
from importlib.metadata import version
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public/assets/fonts/NotoSansArabic-web.woff2"
MANIFEST = ROOT / "assets/manifest.font-arabic-web.json"
BLOCKS = [
    ("Basic Latin, Latin-1 and Latin Extended", 0x0000, 0x024F),
    ("Arabic", 0x0600, 0x06FF),
    ("Arabic Supplement", 0x0750, 0x077F),
    ("Arabic Extended-A", 0x08A0, 0x08FF),
    ("General Punctuation", 0x2000, 0x206F),
    ("Currency Symbols", 0x20A0, 0x20CF),
    ("Arabic Presentation Forms-A", 0xFB50, 0xFDFF),
    ("Arabic Presentation Forms-B", 0xFE70, 0xFEFF),
]
PROTECTED = [
    "assets/source/fonts/NotoSansArabic.ttf",
    "public/assets/fonts/NotoSansArabic.ttf",
    "public/assets/fonts/NotoSansArabic.woff2",
    "assets/source/fonts/OFL-NotoSansArabic.txt",
    "public/assets/fonts/OFL-NotoSansArabic.txt",
    "assets/source/fonts/Manrope.ttf",
    "public/assets/fonts/Manrope.ttf",
    "public/assets/fonts/Manrope.woff2",
    "assets/source/fonts/OFL.txt",
    "public/assets/fonts/OFL.txt",
]
AXIS_TABLES = {"fvar", "gvar", "HVAR", "STAT"}

# Reuse the established outline/axis verifier without changing it or writing
# Python caches. The existing codec report remains a native-font proof.
spec = importlib.util.spec_from_file_location("burcu_font_codec", ROOT / "tools/encode-fonts.py")
codec = importlib.util.module_from_spec(spec)
spec.loader.exec_module(codec)


def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def ensure(condition: bool, message: str) -> None:
    if not condition:
        raise RuntimeError(message)


def codepoint(value: int) -> str:
    return f"U+{value:04X}"


def snapshot(relative: str) -> dict:
    data = (ROOT / relative).read_bytes()
    return {"path": relative, "bytes": len(data), "sha256": sha(data)}


def name_signature(font: TTFont) -> list:
    return sorted((n.nameID, n.platformID, n.platEncID, n.langID, n.toUnicode()) for n in font["name"].names)


def instances(font: TTFont) -> list:
    return [{"subfamilyNameID": i.subfamilyNameID, "postscriptNameID": i.postscriptNameID,
             "flags": i.flags, "coordinates": dict(i.coordinates)} for i in font["fvar"].instances]


def layout_signature(font: TTFont, tag: str) -> dict:
    table = font[tag].table
    features = table.FeatureList.FeatureRecord
    result = {}
    for script in table.ScriptList.ScriptRecord:
        languages = {"default": script.Script.DefaultLangSys} if script.Script.DefaultLangSys else {}
        languages.update({item.LangSysTag: item.LangSys for item in script.Script.LangSysRecord})
        result[script.ScriptTag] = {
            language: sorted({features[index].FeatureTag for index in lang.FeatureIndex}
                             | ({features[lang.ReqFeatureIndex].FeatureTag} if lang.ReqFeatureIndex != 0xFFFF else set()))
            for language, lang in languages.items()
        }
    return result


def source_characters() -> tuple[set[int], list[dict]]:
    characters: set[int] = set()
    files = []
    for file in sorted((ROOT / "src").rglob("*.ts*")):
        data = file.read_bytes()
        characters.update(map(ord, data.decode("utf-8")))
        files.append({"path": file.relative_to(ROOT).as_posix(), "sha256": sha(data)})
    return characters, files


def normal_width_font(font: TTFont, inplace: bool = False) -> TTFont:
    """Use the official fontTools axis-instancing API, without IUP optimization."""
    width = next(axis for axis in font["fvar"].axes if axis.axisTag == "wdth")
    ensure(width.defaultValue == 100, "Review changed upstream width default")
    return instantiateVariableFont(font, {"wdth": 100}, inplace=inplace, optimize=False, updateFontNames=False)


def outline_deviation(before, after) -> float:
    """Measure actual coordinates; fail on any drawing-command topology change."""
    if isinstance(before, (int, float)) and isinstance(after, (int, float)):
        return abs(before - after)
    if isinstance(before, (list, tuple)) and isinstance(after, (list, tuple)):
        ensure(len(before) == len(after), "Drawing operation/point topology changed")
        return max([outline_deviation(a, b) for a, b in zip(before, after)] or [0])
    ensure(before == after, "Drawing command changed")
    return 0


def required_characters(source: TTFont) -> tuple[set[int], dict]:
    cmap = source.getBestCmap()
    script_coverage = {c for c in cmap if any(first <= c <= last for _, first, last in BLOCKS)}
    source_chars, files = source_characters()
    current_coverage = source_chars.intersection(cmap)
    # The upstream Arabic GSUB language systems also expose rtlm for U+221A.
    # Preserve its input and GSUB closure, even though the mathematical symbol
    # lies outside the eight requested blocks, to keep the RTL feature set.
    rtlm_inputs: set[str] = set()
    gsub = source["GSUB"].table
    for feature in gsub.FeatureList.FeatureRecord:
        if feature.FeatureTag != "rtlm":
            continue
        for index in feature.Feature.LookupListIndex:
            lookup = gsub.LookupList.Lookup[index]
            ensure(lookup.LookupType == 1, "Review changed upstream rtlm lookup before subsetting")
            for table in lookup.SubTable:
                rtlm_inputs.update(table.mapping)
    rtlm_coverage = {c for c, glyph in cmap.items() if glyph in rtlm_inputs}
    return script_coverage | current_coverage | rtlm_coverage, {
        "sourceCodeFiles": files,
        "sourceCharactersCount": len(source_chars),
        "currentCharactersSupportedByOriginal": [codepoint(c) for c in sorted(current_coverage)],
        "currentCharactersNotSupportedByOriginal": [codepoint(c) for c in sorted(source_chars - set(cmap))],
        "sourceSupportedBlockCharacters": [codepoint(c) for c in sorted(script_coverage)],
        "currentSupportedCharactersOutsideBlocks": [codepoint(c) for c in sorted(current_coverage - script_coverage)],
        "additionalRtlMirroringFeatureInputs": [codepoint(c) for c in sorted(rtlm_coverage)],
        "blocks": [{"label": label, "from": codepoint(first), "to": codepoint(last),
                    "originalSupportedCount": sum(first <= c <= last for c in cmap)} for label, first, last in BLOCKS],
        "unsupportedOriginalBoundary": "The derivative adds no glyph absent from the original. Unicode controls and originally missing characters retain the original fallback boundary.",
    }


def verify_font(report: dict) -> dict:
    for item in report["protectedSources"]:
        ensure(snapshot(item["path"]) == item, f"Protected source changed: {item['path']}")
    original = TTFont(ROOT / "assets/source/fonts/NotoSansArabic.ttf", recalcTimestamp=False)
    decoded = TTFont(OUTPUT, recalcTimestamp=False)
    try:
        required, current = required_characters(original)
        actual = decoded.getBestCmap()
        original_cmap = original.getBestCmap()
        ensure(required.issubset(actual), "Target-script or current-copy character missing from web font")
        ensure(all(actual[c] == original_cmap[c] for c in required), "Character-to-glyph mapping changed")
        ensure(set(actual) == set(original_cmap), "Any original character coverage removed")
        ensure(actual == original_cmap, "Full original cmap mapping changed")
        ensure(name_signature(original) == name_signature(decoded), "Original name, copyright or OFL metadata changed")
        expected_axes = [axis for axis in codec.axis_signature(original) if axis["tag"] != "wdth"]
        ensure(expected_axes == codec.axis_signature(decoded), "wght axis range/default/name changed")
        reference = normal_width_font(original)
        ensure(instances(reference) == instances(decoded), "Default-width named variation instances changed")
        ensure(AXIS_TABLES.issubset(set(decoded.keys())), "Variable-font table missing")
        for tag in ("GSUB", "GPOS"):
            ensure(tag in decoded, f"{tag} missing")
            before = layout_signature(original, tag).get("arab")
            after = layout_signature(decoded, tag).get("arab")
            ensure(before == after, f"Arabic language/feature set changed in {tag}")
        source_glyphs = set(original.getGlyphOrder())
        retained = decoded.getGlyphOrder()
        ensure(retained == original.getGlyphOrder(), "Any glyph removed, reconstructed or reordered")
        required_gsub = set(report["closure"]["gsubGlyphs"])
        ensure(required_gsub.issubset(retained), "GSUB glyph closure lost")
        outlines = {}
        empty_bounds_normalized = []
        zero_variation_tuples_normalized = []
        serialized_variation_records_differ = []
        for glyph in retained:
            before_data = codec.glyph_data_signature(reference, glyph)
            after_data = codec.glyph_data_signature(decoded, glyph)
            # WOFF2 omits a bbox for an empty glyph; fontTools' in-memory
            # instancer stores a zero bbox. Neither has a contour or ink.
            if before_data["contours"] == after_data["contours"] == 0:
                ensure(not before_data["coordinates"] and not after_data["coordinates"], "Unexpected empty-glyph points")
                if before_data["bounds"] != after_data["bounds"]:
                    empty_bounds_normalized.append(glyph)
                    before_data["bounds"] = after_data["bounds"] = [0, 0, 0, 0]
            ensure(before_data == after_data,
                   f"Retained glyph points/instructions/composites changed: {glyph}")
            ensure(reference["hmtx"].metrics[glyph] == decoded["hmtx"].metrics[glyph], f"Glyph metrics changed: {glyph}")
            before_variations = reference["gvar"].variations.get(glyph, [])
            after_variations = decoded["gvar"].variations.get(glyph, [])
            meaningful = lambda items: [variation for variation in items
                                        if any(delta is not None and delta != (0, 0) for delta in variation.coordinates)]
            # Serialization drops all-zero variation tuples; they have no
            # effect on any outline or phantom-point/advance coordinate.
            if before_variations != after_variations and meaningful(before_variations) == meaningful(after_variations):
                zero_variation_tuples_normalized.append(glyph)
            if meaningful(before_variations) != meaningful(after_variations):
                serialized_variation_records_differ.append(glyph)
        locations = [{"wght": weight, "wdth": 100} for weight in (100, 400, 750, 900)]
        max_coordinate_deviation = 0.0
        max_advance_deviation = 0.0
        coordinate_different_cases = 0
        location_measurements = []
        for location in locations:
            source_set = original.getGlyphSet(location=location)
            output_set = decoded.getGlyphSet(location={"wght": location["wght"]})
            location_hashes = {}
            location_max = 0.0
            location_changed = 0
            for glyph in retained:
                source_outline = codec.decoded_outline_signature(source_set, glyph)
                output_outline = codec.decoded_outline_signature(output_set, glyph)
                deviation = outline_deviation(source_outline, output_outline)
                # gvar stores integer deltas. Official instancing followed by
                # serialization can round fractional IUP deltas by half a unit.
                # Do not claim bit-identical variable contours; measure them.
                ensure(deviation < 1.0, f"Variable outline deviates by >=1 font unit: {glyph}/{location}/{deviation}")
                advance_deviation = abs(source_set[glyph].width - output_set[glyph].width)
                ensure(advance_deviation < 1e-7, f"Variable advance differs: {glyph}/{location}")
                max_coordinate_deviation = max(max_coordinate_deviation, deviation)
                max_advance_deviation = max(max_advance_deviation, advance_deviation)
                location_max = max(location_max, deviation)
                location_changed += deviation > 0
                location_hashes[glyph] = codec.stable_hash(output_outline)
            outlines[str(location)] = codec.stable_hash(location_hashes)
            coordinate_different_cases += location_changed
            location_measurements.append({"sourceLocation": location, "outputLocation": {"wght": location["wght"]},
                                          "glyphCases": len(retained), "maxCoordinateDeviationFontUnits": location_max,
                                          "nonzeroCoordinateDeviationCases": location_changed})
        for tag, keys in (("hhea", ["ascent", "descent", "lineGap"]),
                          ("OS/2", ["sTypoAscender", "sTypoDescender", "sTypoLineGap", "usWinAscent", "usWinDescent"])):
            ensure(all(getattr(original[tag], key) == getattr(decoded[tag], key) for key in keys), f"Line metrics changed: {tag}")
        return {"checkedAt": datetime.now(timezone.utc).isoformat(), "status": "PASS",
                "targetCoverage": {"requiredSourceSupportedCodepoints": len(required), "covered": len(required.intersection(actual)),
                                   "allDeclaredBlocksSourceCoverageRetained": True, "currentSourceCopyCoverageRetained": True},
                "retainedGlyphs": len(retained), "fullOriginalCmapCount": len(actual), "gsubClosureGlyphs": len(required_gsub),
                "emptyGlyphBboxNormalization": {"method": "For contour-free glyphs only, absent WOFF2 bbox is equivalent to zero instancer bbox", "glyphs": empty_bounds_normalized},
                "zeroVariationTupleNormalization": {"method": "Discard only all-zero/no-delta tuples removed during serialization", "glyphs": zero_variation_tuples_normalized},
                "serialization": {"variationRecordsDifferGlyphCount": len(serialized_variation_records_differ),
                                  "integerDeltaQuantizationMeasured": True, "variableContoursBitIdenticalClaimed": False},
                "variableOutlineLocations": locations, "variableOutlineGlyphCases": len(retained) * len(locations),
                "variableOutlineHashes": outlines,
                "outlineComparison": {"method": "Decomposed drawing commands and coordinates at source wdth100 vs official-API output; all commands/point topology retained",
                                      "acceptedMaxExclusiveFontUnits": 1, "maxActualCoordinateDeviationFontUnits": max_coordinate_deviation,
                                      "maxActualAdvanceDeviationFontUnits": max_advance_deviation,
                                      "nonzeroCoordinateDeviationCases": coordinate_different_cases, "drawingTopologyErrors": 0,
                                      "unitsPerEm": original["head"].unitsPerEm,
                                      "maxDeviationAt120CssPixels": 120 * max_coordinate_deviation / original["head"].unitsPerEm,
                                      "locations": location_measurements},
                "sourceFontAndOflFilesUnchanged": True, "nameAndLicenseMetadataIdentical": True,
                "weightAxisAndDefaultWidthNamedInstancesPreserved": True, "widthAxisInstantiatedAtOriginalDefault100": True,
                "retainedDefaultGlyphDataMatchesOfficialDefaultWidthReference": True,
                "horizontalMetricsAndVariableAdvancesIdentical": True, "lineMetricsIdentical": True,
                "arabicGsubGposLanguagesAndFeaturesRetained": True, "gsubClosureRetained": True,
                "fullCmapAndGlyphOrderIdentical": True, "characterSubsettingApplied": False,
                "uiImportsModified": False, "browserShapingVisualAcceptance": "pending root browser review",
                "browserTransferMeasured": False, "currentCoverage": current}
    finally:
        original.close()
        decoded.close()


def prepare() -> None:
    protected = [snapshot(item) for item in PROTECTED]
    old_review = json.loads((ROOT / "qa/font-codec-review.json").read_text(encoding="utf-8"))
    original_record = next(font for font in old_review["fonts"] if font["name"] == "NotoSansArabic")
    ensure(protected[0]["sha256"] == original_record["sourceSha256"], "Original TTF no longer matches native codec proof")
    ensure(protected[2]["sha256"] == original_record["woff2Sha256"], "Original WOFF2 no longer matches native codec proof")
    font = TTFont(ROOT / protected[0]["path"], recalcTimestamp=False)
    original_names = copy.deepcopy(font["name"])
    required, coverage = required_characters(font)
    full_codepoints = set(font.getBestCmap())
    source_glyphs = font.getGlyphOrder()
    # The rendered website uses normal wdth=100. Retain the complete original
    # character/glyph set while removing only the unused width variation axis.
    font = normal_width_font(font, inplace=True)
    font["name"] = original_names
    font.flavor = "woff2"
    buffer = io.BytesIO()
    font.save(buffer)
    data = buffer.getvalue()
    # Prepare in memory first; write only the independently named derivative.
    OUTPUT.write_bytes(data)
    report = {"schemaVersion": "1.0-default-width-full-cmap-arabic-web-font",
              "preparedAt": datetime.now(timezone.utc).isoformat(), "protectedSources": protected,
              "source": protected[0], "nativeWoff2": protected[2],
              "output": {"path": OUTPUT.relative_to(ROOT).as_posix(), "bytes": len(data), "sha256": sha(data), "format": "woff2"},
              "savingsVsNativeWoff2": {"bytes": protected[2]["bytes"] - len(data),
                                      "percent": round(100 * (1 - len(data) / protected[2]["bytes"]), 2)},
              "dependencies": {"fonttools": version("fonttools"), "Brotli": version("Brotli")},
              "coverage": coverage, "targetCodepoints": [codepoint(c) for c in sorted(required)],
              "fullOriginalCodepointsRetained": [codepoint(c) for c in sorted(full_codepoints)],
              "closure": {"mappedGlyphCount": len(source_glyphs), "gsubGlyphs": source_glyphs,
                          "retainedGlyphs": source_glyphs},
              "options": {"characterSubsettingApplied": False, "widthAxisValue": 100, "widthAxisWasSourceDefault": True,
                          "weightAxisVariable": True, "officialFontToolsInstancerApi": True, "optimize": False, "updateFontNames": False,
                          "customGlyphOrGvarProjectionApplied": False,
                          "completeOriginalNameTableRestored": True},
              "axes": codec.axis_signature(font), "sourceFontsModified": False, "sourceLicensesModified": False,
              "aiUsed": False, "uiImportsModified": False,
              "policy": "Retains all original cmap characters and glyphs. Only unused wdth variation is instantiated at its original normal-width default 100; wght stays variable 100–900. No character subset or glyph redraw."}
    font.close()
    report["verification"] = verify_font(report)
    MANIFEST.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_review(report)


def write_review(report: dict) -> None:
    review = {"schemaVersion": "1.0-arabic-web-font-review", "manifestPath": MANIFEST.relative_to(ROOT).as_posix(),
              "manifestSha256": sha(MANIFEST.read_bytes()), "output": report["output"],
              "savingsVsNativeWoff2": report["savingsVsNativeWoff2"], **report["verification"]}
    (ROOT / "qa/font-arabic-web-review.json").write_text(json.dumps(review, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    blocks = "\n".join(f"| {block['label']} | {block['from']}–{block['to']} | {block['originalSupportedCount']} |" for block in report["coverage"]["blocks"])
    text = f"""# Arapça web fontu — tüm kaynak karakterleri, normal genişlik

**{review['status']} · Yeni türev: {report['output']['bytes']:,} byte**

Özgün NotoSansArabic TTF, native WOFF2, Manrope dosyaları ve OFL lisansları değişmedi. Yeni `NotoSansArabic-web.woff2`, özgün fontun **bütün {review['fullOriginalCmapCount']} cmap karakterini ve {review['retainedGlyphs']} glyph’ini** korur. Karakter alt kümesi uygulanmadı. Kullanılmayan `wdth` ekseni özgün normal genişlik değerinde **100** sabitlendi; `wght` ekseni **100–900**, varsayılan **400** olarak değişken kaldı. Site bu türevi normal genişlikte kullanmalıdır; değişken genişlik sunulduğu iddia edilmez.

| Blok | Aralık | Korunan kaynak karakteri |
|---|---|---:|
{blocks}

İstenen bloklar ve mevcut içerik hedef kapsamı **{review['targetCoverage']['covered']}/{review['targetCoverage']['requiredSourceSupportedCodepoints']}**; bunun ötesindeki bütün kaynak karakterleri de aynen vardır. GSUB closure, Arapça GSUB/GPOS dil ve feature kümeleri, bütün ad/telif/lisans kayıtları ve ağırlık ekseni sınırları korundu. Üretim yalnız resmî fontTools `instantiateVariableFont(... optimize=False)` API’sini kullanır; özel glyph/gvar projection yapılmadı. **wght 100/400/750/900 × bütün {review['retainedGlyphs']} glyph = {review['variableOutlineGlyphCases']:,}** outline/advance vakası incelendi; çizim komutları ve nokta topolojisinde fark yok.

Değişken konturların bit olarak birebir aynı olduğu iddia edilmez. Integer `gvar` delta serialization/IUP yuvarlaması nedeniyle ölçülmüş azami nokta farkı **{review['outlineComparison']['maxActualCoordinateDeviationFontUnits']:.6f} font birimi**, azami advance farkı **{review['outlineComparison']['maxActualAdvanceDeviationFontUnits']:g}**. Font **{review['outlineComparison']['unitsPerEm']} units/em**; azami fark 120 CSS px metinde yaklaşık **{review['outlineComparison']['maxDeviationAt120CssPixels']:.4f} CSS px**. Kayıtlı kabul eşiği `<1 font birimi`; geçmiştir. Varsayılan glyph veri, yatay metrikler ve satır metrikleri ayrıca doğrulanmıştır.

Özgün WOFF2’ye göre kazanç **{report['savingsVsNativeWoff2']['bytes']:,} byte (%{report['savingsVsNativeWoff2']['percent']})**. Bu kazanç karakter silmekten değil, kullanılmayan genişlik değişkenliğini sabitlemekten gelir. Önceki dar 156 karakter fontunun %75,8 veya geniş karakter subset’inin %6,9 tahmini bu çıktıya uygulanmaz.

UI font importları değiştirilmedi. Tarayıcıda Arapça şekillendirme/görsel kabul, doğru kaynak isteği ve gerçek transfer ölçümü entegrasyon sonrasında ayrıca yapılmalıdır. Kaynakta zaten bulunmayan Unicode karakterleri için yeni glyph icat edilmez; özgün fallback sınırı korunur.

[Manifest](../assets/manifest.font-arabic-web.json) · [Makine kontrolü](font-arabic-web-review.json) · [OFL](../public/assets/fonts/OFL-NotoSansArabic.txt)
"""
    (ROOT / "qa/font-arabic-web-review.md").write_text(text, encoding="utf-8")
    print(json.dumps({"status": review["status"], "output": report["output"], "savings": report["savingsVsNativeWoff2"],
                      "coverage": review["targetCoverage"], "outlineCases": review["variableOutlineGlyphCases"]}, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--verify", action="store_true")
    args = parser.parse_args()
    if args.verify:
        data = json.loads(MANIFEST.read_text(encoding="utf-8"))
        ensure(sha(OUTPUT.read_bytes()) == data["output"]["sha256"], "Web font output changed")
        data["verification"] = verify_font(data)
        write_review(data)
    else:
        prepare()

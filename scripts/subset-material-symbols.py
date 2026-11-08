#!/usr/bin/env python3
"""Optional asset-authoring tool: fonttools[woff]==4.68.0; no runtime dependency.
Subset the retained original font, preserving exact glyph outlines and variation axes.
Run from any directory; generated font is checked in, original/provenance untouched.
"""
from pathlib import Path
import hashlib,json,re
from fontTools.ttLib import TTFont
from fontTools import subset,version
ROOT=Path(__file__).resolve().parents[1]
source=ROOT/'public/reference-assets/material-symbols-outlined.woff2'
font=TTFont(source,recalcTimestamp=False)
cmap=font.getBestCmap();reverse={glyph:chr(code) for code,glyph in cmap.items() if code<128}
ligatures={}
for lookup in font['GSUB'].table.LookupList.Lookup:
 for table in lookup.SubTable:
  table=getattr(table,'ExtSubTable',table)
  for first,entries in getattr(table,'ligatures',{}).items():
   for entry in entries:
    components=[first,*entry.Component]
    if all(g in reverse for g in components):ligatures[''.join(reverse[g] for g in components)]=entry.LigGlyph
candidates=set()
for path in (ROOT/'src').rglob('*'):
 if path.suffix in {'.ts','.tsx','.json'} and path.name!='icon-font-manifest.json':
  candidates.update(re.findall(r'''["']([a-z0-9][a-z0-9_]{1,80})["']''',path.read_text()))
icons=sorted(candidates&ligatures.keys());glyphs={ligatures[name] for name in icons}|set(reverse)
# Preserve explicit single substitutions used by the original variable font.
for lookup in font['GSUB'].table.LookupList.Lookup:
 for table in lookup.SubTable:
  table=getattr(table,'ExtSubTable',table)
  for old,new in getattr(table,'mapping',{}).items():
   if old in glyphs:glyphs.add(new)
options=subset.Options();options.layout_closure=False;options.layout_features=['*'];options.name_IDs=['*'];options.name_legacy=True;options.name_languages=['*'];options.recalc_timestamp=False;options.glyph_names=True
worker=subset.Subsetter(options=options);worker.populate(glyphs=glyphs);worker.subset(font);font.flavor='woff2'
output=ROOT/'public/fonts/material-symbols-site.woff2';font.save(output)
manifest={'source':'public/reference-assets/material-symbols-outlined.woff2','sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'outputSha256':hashlib.sha256(output.read_bytes()).hexdigest(),'fontTools':version,'originalBytes':source.stat().st_size,'subsetBytes':output.stat().st_size,'icons':icons}
(ROOT/'src/config/icon-font-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(f'{len(icons)} named icons; {manifest["originalBytes"]} → {manifest["subsetBytes"]} bytes; exact original glyphs retained.')

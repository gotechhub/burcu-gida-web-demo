import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'assets/manifest.product-responsive.json'), 'utf8'));
const profiles = Object.fromEntries(manifest.assets.map(asset => {
  const candidates = [...asset.derivatives.map(item => ({url:item.url,width:item.width})),
    {url:asset.nativeWebp.path.replace(/^public/, ''),width:asset.nativeWebp.width}].sort((a,b)=>a.width-b.width);
  return [asset.id, {width:asset.source.width,height:asset.source.height,
    srcSet:candidates.map(item=>`${item.url} ${item.width}w`).join(', ')}];
}));
fs.writeFileSync(path.join(root, 'src/content/product-image-profiles.ts'),
  '// Generated from the source-backed responsive product manifest.\nimport type {ProductId} from "./products";\n' +
  `export const productImageProfiles = ${JSON.stringify(profiles,null,2)} satisfies Record<ProductId,{width:number;height:number;srcSet:string}>;\n`);
console.log(JSON.stringify({products:Object.keys(profiles).length,output:'src/content/product-image-profiles.ts'}));

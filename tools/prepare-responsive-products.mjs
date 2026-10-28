/** Runtime-size derivatives only: source labels remain photographic pixels. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require=createRequire(import.meta.url);
const sharp=require('sharp');
const WIDTHS=[240,360];
const CODEC={lossless:true,nearLossless:false,exact:true,quality:100,alphaQuality:100,effort:6};
const manifestPath='assets/manifest.product-responsive.json';
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const read=relative=>fs.readFileSync(path.join(ROOT,relative));
const snapshot=relative=>({path:relative,bytes:read(relative).length,sha256:sha(read(relative))});
function write(relative,bytes){
  const target=path.join(ROOT,relative);
  assert(target.startsWith(`${ROOT}${path.sep}`));
  fs.mkdirSync(path.dirname(target),{recursive:true});
  const temporary=`${target}.responsive-${process.pid}.tmp`;
  try{fs.writeFileSync(temporary,bytes);fs.renameSync(temporary,target);}finally{if(fs.existsSync(temporary))fs.unlinkSync(temporary);}
}
async function rgba(buffer){return sharp(buffer).ensureAlpha().raw().toBuffer({resolveWithObject:true});}
async function resized(buffer,width){return sharp(buffer).ensureAlpha().resize({width,kernel:sharp.kernel.lanczos3,withoutEnlargement:true}).raw().toBuffer({resolveWithObject:true});}

async function verifyAsset(asset){
  const source=read(asset.source.path),nativeWebp=read(asset.nativeWebp.path);
  assert.equal(sha(source),asset.source.sha256,`${asset.id}: PNG changed`);
  assert.equal(sha(nativeWebp),asset.nativeWebp.sha256,`${asset.id}: native WebP changed`);
  const native=await rgba(source),nativeDecoded=await rgba(nativeWebp);
  assert.equal(sha(native.data),asset.source.decodedRgbaSha256);
  assert(native.data.equals(nativeDecoded.data),`${asset.id}: native RGBA no longer matches original PNG`);
  assert.equal(native.info.width,asset.source.width);
  assert.equal(native.info.height,asset.source.height);
  for(const derivative of asset.derivatives){
    const canonical=await resized(source,derivative.width),encoded=read(derivative.path),decoded=await rgba(encoded),metadata=await sharp(encoded).metadata();
    assert.equal(sha(encoded),derivative.sha256,`${asset.id}: derivative file changed`);
    assert.equal(encoded.length,derivative.bytes);
    assert.equal(metadata.format,'webp');assert.equal(metadata.hasAlpha,true);
    assert.equal(decoded.info.width,derivative.width);assert.equal(decoded.info.height,derivative.height);
    assert(canonical.data.equals(decoded.data),`${asset.id}/${derivative.width}: codec differs from canonical Lanczos RGBA`);
    assert.equal(sha(canonical.data),derivative.comparison.canonicalResizedRgbaSha256);
    assert.equal(sha(decoded.data),derivative.comparison.decodedRgbaSha256);
    assert(derivative.width<asset.source.width,'Upscale or duplicate native derivative not permitted');
  }
}

async function prepare(){
  const nativeBytes=read('assets/manifest.product-webp.json'),nativeManifest=JSON.parse(nativeBytes);
  const sources=nativeManifest.assets.filter(asset=>asset.id!=='BR01');
  assert.equal(sources.length,10);
  const assets=[];
  for(const binding of sources){
    const source=read(binding.source.path),sourceMeta=await sharp(source).metadata(),sourceRgba=await rgba(source);
    const webp=read(binding.derivative.path),webpDecoded=await rgba(webp);
    assert.equal(sha(source),binding.source.sha256);assert.equal(sha(webp),binding.derivative.sha256);
    assert(sourceRgba.data.equals(webpDecoded.data));
    assert.equal(sha(sourceRgba.data),binding.comparison.sourceDecodedRgbaSha256);
    const derivatives=[];
    for(const width of WIDTHS.filter(candidate=>candidate<sourceMeta.width)){
      const canonical=await resized(source,width);
      const encoded=await sharp(canonical.data,{raw:{width:canonical.info.width,height:canonical.info.height,channels:4}}).webp(CODEC).toBuffer();
      const decoded=await rgba(encoded),meta=await sharp(encoded).metadata();
      assert(canonical.data.equals(decoded.data),'Lossless encoded RGBA differs from canonical resized buffer');
      const outputPath=`public/assets/products/responsive/${binding.slug}-${width}w.webp`;
      write(outputPath,encoded);
      derivatives.push({path:outputPath,url:`/assets/products/responsive/${binding.slug}-${width}w.webp`,
        width:meta.width,height:meta.height,bytes:encoded.length,sha256:sha(encoded),format:meta.format,alpha:meta.hasAlpha,
        comparison:{canonicalResizedRgbaSha256:sha(canonical.data),decodedRgbaSha256:sha(decoded.data),
          rgbaExactlyEqualToCanonicalResizedBuffer:true,pixelsChecked:canonical.info.width*canonical.info.height},
        savingsComparedWithNativeWebp:{bytes:webp.length-encoded.length,percent:Number((100*(1-encoded.length/webp.length)).toFixed(2))}});
    }
    const asset={id:binding.id,slug:binding.slug,sourceUrl:binding.sourceUrl,
      source:{...snapshot(binding.source.path),width:sourceMeta.width,height:sourceMeta.height,alpha:sourceMeta.hasAlpha,decodedRgbaSha256:sha(sourceRgba.data)},
      nativeWebp:{...snapshot(binding.derivative.path),width:sourceMeta.width,height:sourceMeta.height,decodedRgbaSha256:sha(webpDecoded.data)},
      derivatives,skippedWidths:WIDTHS.filter(width=>width>=sourceMeta.width),
      policy:{sourcePngModified:false,nativeWebpModified:false,sourceRgbaPreserved:true,resamplingApplied:true,
        kernel:'lanczos3',withoutEnlargement:true,losslessCodec:true,fullRgbaPreservedAfterResampling:true,
        derivativeEqualsNativeRgba:false,aiUsed:false,labelsRedrawn:false,
        note:'These are resized runtime derivatives, not byte-identical native master pixels. Native packs remain available for sufficient DPR and large rendering.'}};
    await verifyAsset(asset);assets.push(asset);
  }
  const report={schemaVersion:'1.0-responsive-resampled-lossless-product-webp',preparedAt:new Date().toISOString(),
    sourceManifest:{path:'assets/manifest.product-webp.json',sha256:sha(nativeBytes)},
    encoder:{sharp:sharp.versions.sharp,libvips:sharp.versions.vips,webp:sharp.versions.webp},codec:CODEC,widths:WIDTHS,
    counts:{products:assets.length,derivatives:assets.reduce((sum,a)=>sum+a.derivatives.length,0),
      derivativeBytes:assets.reduce((sum,a)=>sum+a.derivatives.reduce((subtotal,d)=>subtotal+d.bytes,0),0)},
    existing48WebpCountChanged:false,newResponsiveDerivativesCountedSeparately:true,
    uiCodeModified:false,srcsetIntegration:'Root agent will wire sizes/srcset; files do not change browser transfer until referenced.',
    browserTransferMeasured:false,assets};
  write(manifestPath,Buffer.from(JSON.stringify(report,null,2)+'\n'));
  await verify();
}
async function verify(){
  const report=JSON.parse(read(manifestPath));
  assert.equal(sha(read(report.sourceManifest.path)),report.sourceManifest.sha256);
  assert.equal(report.counts.products,10);
  for(const asset of report.assets)await verifyAsset(asset);
  const result={schemaVersion:'1.0-responsive-product-review',checkedAt:new Date().toISOString(),status:'PASS',
    manifestPath,manifestSha256:sha(read(manifestPath)),counts:report.counts,
    sourcePngAndNativeWebpUnchanged:true,sourceRgbaHashesMatch:true,allDerivativesExactlyMatchCanonicalLanczosRgba:true,
    allAlphasPreservedByLosslessCodec:true,upscalingApplied:false,labelsOrLogosRegenerated:false,
    resamplingDisclosure:'Lossless refers to the codec after Lanczos resizing. Resampling itself changes native pixels; native sources remain unchanged.',
    uiCodeModified:false,browserTransferMeasured:false};
  write('qa/product-responsive-review.json',Buffer.from(JSON.stringify(result,null,2)+'\n'));
  const rows=report.assets.map(asset=>`| ${asset.id} | ${asset.source.width}×${asset.source.height} | ${asset.derivatives.map(d=>`${d.width}×${d.height}: ${d.bytes.toLocaleString('en-US')} B`).join('; ')} |`).join('\n');
  write('qa/product-responsive-review.md',Buffer.from(`# Responsive ürün görselleri\n\n**${result.status} · ${report.counts.products} ürün · ${report.counts.derivatives} yeni türev**\n\n| Ürün | Korunan native kaynak | Yeni runtime türevleri |\n|---|---:|---|\n${rows}\n\nÖzgün PNG ve native WebP dosyalarının byte ve RGBA hash’leri değişmedi. Yeni 240/360 px türevler Lanczos3 ile küçültüldü; upscale uygulanmadı. Her WebP’nin tam çözülmüş RGBA verisi, aynı küçültmenin kanonik RGBA çıktısıyla birebir eşleşir. Bu sonuç türevin native master pikselleriyle birebir aynı olduğu anlamına gelmez. Etiketler, logolar veya ambalaj biçimi yeniden üretilmedi; AI kullanılmadı.\n\nYeni türev sayısı önceki 48 WebP kaydından ayrı tutulur. Gerçek ağ kazancı ve DPR seçimi UI entegrasyonu sonrasında ölçülmelidir.\n\n[Manifest](../assets/manifest.product-responsive.json) · [Makine kontrolü](product-responsive-review.json)\n`));
  console.log(JSON.stringify(result,null,2));
}
await(process.argv.includes('--verify')?verify():prepare());

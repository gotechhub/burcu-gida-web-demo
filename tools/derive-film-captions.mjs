import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

// Produce website-only derivatives. V3 film, audio, script and SRT remain immutable.
const projectRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const workspace=path.resolve(projectRoot,'../..');
const relativeSource='tanitim-filmi/v3/public/audio/r05/burcu-tr.srt';
const sourcePath=path.join(workspace,relativeSource);
const contractPath=path.join(workspace,'tanitim-filmi/v3/content/shots.json');
const timelinePath=path.join(workspace,'tanitim-filmi/v2/production/audio/r05-source/audio-timeline.json');
const videoPath=path.join(projectRoot,'public/assets/video/burcu-concept.mp4');
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const sourceHash=hash(sourcePath);
const videoHash=hash(videoPath);
assert.equal(sourceHash,'8093658b664cfd71bf61b48ed3163cd6ccea4457801570b8bf4dbf2344af3264','The approved source SRT changed; review before deriving captions.');
assert.equal(videoHash,'2d44602be651b7c570e4529b072befda41149ddf843b9146ffd480ddc05b2f67','The film source changed; review its timings before deriving captions.');

const parseTime=value=>{
  const match=value.match(/^(\d{2}):(\d{2}):(\d{2}),(\d{3})$/);
  assert.ok(match,`Invalid SRT timestamp: ${value}`);
  return ((Number(match[1])*60+Number(match[2]))*60+Number(match[3]))*1000+Number(match[4]);
};
const original=fs.readFileSync(sourcePath,'utf8').replace(/^\uFEFF/,'').trim().split(/\r?\n\r?\n/).map(block=>{
  const [id,timing,...lines]=block.split(/\r?\n/);
  const [start,end]=timing.split(' --> ').map(parseTime);
  return {sourceCues:[Number(id)],start,end,text:lines.join(' ')};
});
assert.equal(original.length,40);
const tokens=text=>text.normalize('NFKC').replace(/[’']/g,'').match(/[\p{L}\p{N}]+/gu)??[];
const contract=JSON.parse(fs.readFileSync(contractPath,'utf8'));
const sourceTokens=tokens(original.map(cue=>cue.text).join(' '));
assert.equal(sourceTokens.length,242);
assert.deepEqual(sourceTokens,tokens(contract.sequences.map(sequence=>sequence.voiceover).join(' ')),'SRT must preserve the actually recorded script, not the unrecorded proposal.');

const cues=[];
const merges=[];
for(const cue of original){
  const previous=cues.at(-1);
  // The existing short sentence fragments range from 0.44 to 1.40 seconds.
  // Merge only close continuations; preserve paragraph breaks and every word.
  if(previous&&cue.end-cue.start<=1500&&cue.start-previous.end<=150){
    merges.push({sourceCue:cue.sourceCues[0],into:previous.sourceCues[0],durationMs:cue.end-cue.start,gapMs:cue.start-previous.end});
    previous.sourceCues.push(...cue.sourceCues);
    previous.end=cue.end;
    previous.text+=` ${cue.text}`;
  }else cues.push({...cue,sourceCues:[...cue.sourceCues]});
}
const overlapAdjustments=[];
for(let i=0;i<cues.length;i++){
  const cue=cues[i],next=cues[i+1];
  const correctedEnd=Math.min(cue.end,next?.start??150000,150000);
  if(correctedEnd!==cue.end)overlapAdjustments.push({sourceCues:cue.sourceCues,originalEndMs:cue.end,derivedEndMs:correctedEnd});
  cue.end=correctedEnd;
  assert.ok(cue.start>=0&&cue.end>cue.start&&cue.end<=150000);
}
assert.deepEqual(tokens(cues.map(cue=>cue.text).join(' ')),sourceTokens);
const translations=JSON.parse(fs.readFileSync(path.join(projectRoot,'assets/source/captions/film-translations.json'),'utf8'));
assert.equal(translations.cues.length,cues.length);
translations.cues.forEach((translation,index)=>{
  assert.deepEqual(translation.sourceCues,cues[index].sourceCues);
  assert.ok(translation.en.trim()&&translation.ar.trim());
});
const music=JSON.parse(fs.readFileSync(timelinePath,'utf8')).music;
assert.equal(music.path,'audio/music-source.mp3');
assert.ok(music.gain>0&&music.envelope.some(point=>point.gain>0),'Music annotation requires an actual soundtrack source.');

const timestamp=ms=>{
  const h=Math.floor(ms/3600000),m=Math.floor(ms%3600000/60000),s=Math.floor(ms%60000/1000);
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(ms%1000).padStart(3,'0')}`;
};
const characterCount=text=>Array.from(text).length;
const wrap=text=>{
  if(characterCount(text)<=46)return [text];
  const words=text.split(' '),candidates=[];
  for(let split=1;split<words.length;split++){
    const left=words.slice(0,split).join(' '),right=words.slice(split).join(' ');
    if(Math.max(characterCount(left),characterCount(right))<=46)candidates.push({left,right,balance:Math.abs(characterCount(left)-characterCount(right))});
  }
  candidates.sort((a,b)=>a.balance-b.balance);
  assert.ok(candidates.length,`Caption needs an editorial line-length review: ${text}`);
  return [candidates[0].left,candidates[0].right];
};
const outputDirectory=path.join(projectRoot,'public/assets/video/captions');
fs.mkdirSync(outputDirectory,{recursive:true});
const tracks=[];
const decodedTracks=[];
for(const locale of ['tr','en','ar']){
  const trackCues=cues.map((cue,index)=>{
    const text=locale==='tr'?cue.text:translations.cues[index][locale];
    const lines=wrap(text);
    if(index===0)lines.unshift(translations.musicLabels[locale]);
    assert.ok(lines.length<=2&&lines.every(line=>characterCount(line)<=46));
    return {...cue,lines};
  });
  const vtt=`WEBVTT\n\nNOTE\nSource voice: Turkish. ${locale==='tr'?'Source-preserved Turkish captions.':'Translated subtitles; no dubbing.'}\n\n`+trackCues.map((cue,index)=>`${index+1}\n${timestamp(cue.start)} --> ${timestamp(cue.end)}\n${cue.lines.join('\n')}\n`).join('\n');
  const file=path.join(outputDirectory,`burcu-${locale}.vtt`);
  fs.writeFileSync(file,vtt,'utf8');
  // Read the actual UTF-8 deliverable back, not only its in-memory input.
  const written=fs.readFileSync(file,'utf8');
  assert.ok(written.startsWith('WEBVTT\n\n'));
  const decoded=written.trim().split('\n\n').filter(block=>/^\d+\n/.test(block)).map(block=>{
    const [id,timing,...lines]=block.split('\n');
    assert.match(timing,/^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/);
    const [start,end]=timing.split(' --> ').map(value=>parseTime(value.replace('.',',')));
    return {id:Number(id),start,end,lines};
  });
  assert.equal(decoded.length,cues.length);
  decoded.forEach((cue,index)=>{
    assert.equal(cue.id,index+1);
    assert.equal(cue.start,cues[index].start);
    assert.equal(cue.end,cues[index].end);
    assert.ok(cue.end>cue.start&&cue.end<=150000&&(!index||decoded[index-1].end<=cue.start));
    assert.ok(cue.lines.length>0&&cue.lines.length<=2&&cue.lines.every(line=>line.trim()&&characterCount(line)<=46));
    assert.deepEqual(cue.lines,trackCues[index].lines);
  });
  decodedTracks.push(decoded);
  const spokenText=decoded.flatMap((cue,index)=>index===0?cue.lines.slice(1):cue.lines).join(' ');
  if(locale==='tr')assert.deepEqual(tokens(spokenText),sourceTokens);
  tracks.push({locale,kind:locale==='tr'?'captions':'subtitles',url:`/assets/video/captions/burcu-${locale}.vtt`,sha256:hash(file),bytes:fs.statSync(file).size,cueCount:trackCues.length,firstStartMs:trackCues[0].start,lastEndMs:trackCues.at(-1).end,maxLines:Math.max(...trackCues.map(cue=>cue.lines.length)),maxCharactersPerLine:Math.max(...trackCues.flatMap(cue=>cue.lines.map(characterCount))),maxCharactersPerSecond:Number(Math.max(...trackCues.map(cue=>characterCount(cue.lines.join(' '))/(cue.end-cue.start)*1000)).toFixed(2))});
}
for(const track of decodedTracks.slice(1))assert.deepEqual(track.map(({start,end})=>[start,end]),decodedTracks[0].map(({start,end})=>[start,end]));
assert.equal(hash(sourcePath),sourceHash);
assert.equal(hash(videoPath),videoHash);
const manifest={
  createdAt:new Date().toISOString(),
  scope:'Local website caption derivatives; original V3 sources unchanged. No public deployment, dubbing or human acceptance claim.',
  source:{path:relativeSource,sha256:sourceHash,originalCueCount:original.length,spokenWordCount:sourceTokens.length,activeScriptExactTokenMatch:true,immutable:true},
  sourceVoiceLanguage:'tr',
  film:{path:'public/assets/video/burcu-concept.mp4',sha256:videoHash,unchanged:true,durationMs:150000},
  nonSpeech:{musicLabelAtFirstCue:true,source:'tanitim-filmi/v2/production/audio/r05-source/audio-timeline.json',musicPath:music.path,sfxInvented:false},
  derivation:{shortFragmentMaximumMs:1500,maximumContinuationGapMs:150,merges,overlapAdjustments,derivedCueCount:cues.length,sourceCueCoverage:cues.flatMap(cue=>cue.sourceCues),allSourceWordsPreserved:true},
  tracks,
  editorialReview:{en:'Professional editorial translation; native review pending.',ar:'Professional editorial translation; native review pending.'},
  remainingChecks:['Native-language proofreading and translation acceptance','Normal-speed human narration/caption timing review','Native video cue legibility, Arabic direction and dialog fit on physical devices','Overall accessibility audit; caption presence alone does not establish WCAG 2.2 AA conformance']
};
fs.mkdirSync(path.join(projectRoot,'docs/research'),{recursive:true});
fs.mkdirSync(path.join(projectRoot,'qa'),{recursive:true});
fs.writeFileSync(path.join(projectRoot,'docs/research/film-captions-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
fs.writeFileSync(path.join(projectRoot,'qa/film-captions-review.json'),JSON.stringify({checkedAt:manifest.createdAt,validation:'Source derivation only; browser load and normal-speed human acceptance remain separate.',allPassed:true,checks:{sourceSrtHashPinned:true,filmHashPinnedAndUnchanged:true,sourceScriptExact242Tokens:true,source40CueCoverageComplete:true,threeTracksHaveIdenticalTimeline:true,noDerivedCueOverlaps:true,allCuesWithin150Seconds:true,noEmptyCaptions:true,atMostTwoLinesPerCue:true,atMost46CharactersPerLine:true,sourceV3FilesNotModified:true},tracks,remainingChecks:manifest.remainingChecks},null,2)+'\n');
console.log(JSON.stringify({derivedCueCount:cues.length,mergedFragments:merges.length,overlapEndsCorrected:overlapAdjustments.length,spokenWordsPreserved:sourceTokens.length,tracks,sourceSrtUnchanged:true,filmUnchanged:true},null,2));

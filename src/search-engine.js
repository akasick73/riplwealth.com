const stop=new Set(['a','an','and','are','as','at','be','can','do','for','from','how','i','in','is','it','me','my','of','on','or','our','the','their','to','us','we','what','with','you','your']);
const groups=[['sell','selling','sold','sale','sales','exit','exits'],['company','companies','business','businesses'],['tax','taxes','taxation'],['retire','retiring','retirement','retired'],['invest','investing','investment','investments','portfolio','portfolios'],['note','notes'],['athlete','athletes','sports','sport','nil'],['cash','liquidity','liquid'],['plan','planning','planner'],['fee','fees','pricing','cost','costs'],['goal','goals'],['stock','stocks','equity'],['college','university']];
const dictionary=new Map(groups.flatMap(g=>g.map(word=>[word,g[0]])));
export function tokens(value){return [...new Set(String(value).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').match(/[a-z0-9]+/g)?.filter(w=>!stop.has(w)).map(w=>dictionary.get(w)||w)||[])];}
export function searchDocuments(documents,query,limit=12){
 const terms=tokens(query);if(!terms.length)return [];
 const scored=documents.map(doc=>{
  const title=new Set(tokens(doc.title)),body=new Set(tokens(doc.text+' '+doc.description));
  const matches=terms.filter(t=>body.has(t)||title.has(t));if(matches.length!==terms.length)return null;
  const titleCount=terms.filter(t=>title.has(t)).length;
  const businessIntent=terms.includes('company');
  const topicBonus=businessIntent&&doc.category==='Business Owners'?6:0;
  const stockPenalty=businessIntent&&terms.includes('sell')&&!terms.includes('stock')&&title.has('stock')?12:0;
  return {doc,score:titleCount*12+(titleCount===terms.length?24:0)+topicBonus-stockPenalty};
 }).filter(Boolean).sort((a,b)=>b.score-a.score||a.doc.title.localeCompare(b.doc.title));
 const seen=new Set();return scored.filter(({doc})=>{const key=doc.title.toLowerCase();if(seen.has(key))return false;seen.add(key);return true;}).slice(0,limit).map(({doc})=>doc);
}
export function snippet(doc,query){
 const terms=String(query).toLowerCase().match(/[a-z0-9]+/g)||[];
 const text=doc.text||doc.description;const lower=text.toLowerCase();
 const hits=terms.filter(t=>t.length>2&&!stop.has(t)).map(t=>lower.indexOf(t)).filter(i=>i>=0);
 const start=hits.length?Math.max(0,Math.min(...hits)-55):0;
 const excerpt=text.slice(start,start+200).trim();
 return (start?'…':'')+excerpt+(start+200<text.length?'…':'');
}

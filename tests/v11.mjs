import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {parse} from 'parse5';
import {searchDocuments,snippet} from '../src/search-engine.js';
import {compoundProjection} from '../src/compound-math.js';
const docs=JSON.parse(await readFile('dist/search-index.json','utf8'));
assert.equal(docs.length,106);assert.equal(docs.filter(d=>d.url.includes('#')).length,41);
const cases=[['selling my company',r=>r.some(d=>/business-owners\/(before|after)-selling-business/.test(d.url))],['structured notes',r=>r.some(d=>d.url.startsWith('/structured-notes/'))],['SAGE',r=>r.some(d=>d.url==='/how-we-work/')],['Adam Kasick',r=>r[0]?.url==='/team/adam-kasick/'],['Chase Bellefeuille',r=>r[0]?.url==='/team/chase-bellefeuille/'],['NIL taxes',r=>r.some(d=>d.category==='Money Questions')],['Roth',r=>r.some(d=>d.url.includes('#mq-taxes-'))],['business cash',r=>r.some(d=>d.url.startsWith('/business-owners/'))],['financial freedom',r=>r.some(d=>d.url==='/financial-freedom/')]];
for(const [q,test] of cases){const result=searchDocuments(docs,q);assert(test(result),q+': '+result.map(d=>d.url));assert(result.every(d=>snippet(d,q).length<=202));}
assert.deepEqual(searchDocuments(docs,'zzqxunfindable'),[]);assert.deepEqual(searchDocuments(docs,'  '),[]);assert.deepEqual(searchDocuments(docs,'<script>alert(1)</script>'),[]);
for(const d of docs){assert(d.url.startsWith('/'));assert(!d.text.includes('Pause motion'));assert(!d.text.includes('formsubmit.co'));
 const [path,anchor]=d.url.split('#');const html=await readFile('dist'+path+'index.html','utf8');if(anchor)assert(html.includes(`id="${anchor}"`),d.url);
}
function all(node,predicate,out=[]){if(predicate(node))out.push(node);for(const c of node.childNodes||[])all(c,predicate,out);return out;}
const attrs=n=>Object.fromEntries((n.attrs||[]).map(a=>[a.name,a.value]));
const tree=parse(await readFile('dist/compound-interest-calculator/index.html','utf8'));
const controls=Object.fromEntries(all(tree,n=>n.tagName==='input'&&attrs(n).name).map(n=>[attrs(n).name,attrs(n).value]));
assert.equal(controls.principal,'500000');assert.equal(controls.years,'15');assert.equal(controls.rate,'8');assert.equal(controls.contribution,'0');
const rows=compoundProjection({principal:500000,years:15,rate:8,contribution:0,frequency:'monthly'});
assert(Math.abs(rows.at(-1).balance-500000*1.08**15)<1e-6);
const portfolio=await readFile('dist/wealth/index.html','utf8');assert(portfolio.includes('$1,586,085'));assert(portfolio.includes('Excludes advisory fees'));assert(portfolio.includes('growth-mobile-title'));assert(portfolio.includes('growth-desktop-title'));
const home=await readFile('dist/index.html','utf8');assert(home.includes('RIPL Wealth provides financial planning and investment management'));
const planning=await readFile('dist/how-we-work/index.html','utf8');for(const value of ['A Plan + Investing','Investing','4+ planning conversations.','Clarity and guidance on next, actionable steps.','Quarterly check-ins, an annual review and a contact calendar.'])assert(planning.includes(value),value);
console.log('V11 passed: 106 search entries, 41 answer anchors, nine real-topic queries, unsafe/empty/no-match inputs, calculator defaults, independent projection, chart disclosures and approved copy.');

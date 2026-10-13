import {parse} from 'parse5';
import {readdir,readFile,writeFile} from 'node:fs/promises';
import {join,relative,resolve} from 'node:path';
const root=resolve('dist');
const ignored=new Set(['script','style','nav','form','noscript','dialog','svg']);
const attrs=node=>Object.fromEntries((node.attrs||[]).map(a=>[a.name,a.value]));
function all(node,predicate,out=[]){if(predicate(node))out.push(node);for(const c of node.childNodes||[])all(c,predicate,out);return out;}
function text(node){if(ignored.has(node.tagName))return '';if(node.nodeName==='#text')return node.value;return (node.childNodes||[]).map(text).join(' ');}
const tidy=s=>s.replace(/\s+/g,' ').trim();
async function files(dir){const out=[];for(const entry of await readdir(dir,{withFileTypes:true})){const path=join(dir,entry.name);if(entry.isDirectory())out.push(...await files(path));else if(path.endsWith('.html'))out.push(path);}return out;}
const documents=[];
for(const path of (await files(root)).sort()){
 const rel=relative(root,path).replaceAll('\\','/');
 if(['404.html','thank-you/index.html','search/index.html'].includes(rel))continue;
 const url=rel==='index.html'?'/':'/'+rel.replace(/index\.html$/,'');
 const tree=parse(await readFile(path,'utf8'));
 const main=all(tree,n=>n.tagName==='main')[0];if(!main)continue;
 const title=tidy(text(all(main,n=>n.tagName==='h1')[0]||main));
 const description=attrs(all(tree,n=>n.tagName==='meta'&&attrs(n).name==='description')[0]||{}).content||'';
 const category=url.startsWith('/team/')?'Our Team':url.startsWith('/money-questions/')?'Money Questions':url.startsWith('/business-owners/')?'Business Owners':url.startsWith('/structured-notes/')?'Structured Notes':url.startsWith('/concentrated-wealth/')?'Company Stock':'RIPL';
 documents.push({url,title,description,category,text:tidy(text(main)).slice(0,30000)});
 for(const item of all(main,n=>n.tagName==='details'&&attrs(n).id?.startsWith('mq-'))){
  const heading=all(item,n=>n.tagName==='summary')[0];
  const ps=all(item,n=>n.tagName==='p');
  documents.push({url:url+'#'+attrs(item).id,title:tidy(text(heading)),description:tidy(text(ps[0]||item)),category:'Money Questions',text:tidy(text(item))});
 }
}
await writeFile(join(root,'search-index.json'),JSON.stringify(documents));
console.log(`Search index built: ${documents.length} entries, ${documents.filter(d=>!d.url.includes('#')).length} pages.`);

import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {searchDocuments,snippet} from '../src/search-engine.js';
const source=(await readFile('src/site-search.js','utf8')).replace(/^import .*;\n/,'');
const docs=JSON.parse(await readFile('dist/search-index.json','utf8'));
class Element{
 constructor(){this.listeners={};this.children=[];this.dataset={};this.value='';this.textContent='';}
 addEventListener(t,f){this.listeners[t]=f;}
 append(...items){this.children.push(...items);}
 replaceChildren(...items){this.children=items;}
 focus(){this.focused=true;}
 closest(){return null;}
 fire(t,e={}){this.listeners[t]?.({...e,target:e.target||this,preventDefault(){this.prevented=true;}});}
}
function harness(fetcher){
 const form=new Element(),input=new Element(),status=new Element(),output=new Element(),suggestion=new Element(),surface=new Element(),trigger=new Element(),close=new Element(),dialog=new Element();suggestion.dataset.searchSuggestion='Structured notes';
 const selectors={'[data-search-form]':form,'[data-search-input]':input,'[data-search-status]':status,'[data-search-results]':output};surface.querySelector=s=>selectors[s];surface.querySelectorAll=()=>[suggestion];
 dialog.querySelector=s=>s==='[data-close-search]'?close:input;dialog.showModal=()=>{dialog.open=true;};dialog.close=()=>{dialog.open=false;dialog.fire('close');};
 const document={getElementById:()=>dialog,querySelectorAll:s=>s==='[data-open-search]'?[trigger]:[surface],createElement:()=>new Element()};
 vm.runInNewContext(source,{document,fetch:fetcher,searchDocuments,snippet,setTimeout,clearTimeout,URLSearchParams,location:{search:''}});
 return {form,input,status,output,suggestion,trigger,dialog,close};
}
const settle=()=>new Promise(resolve=>setImmediate(resolve));
let calls=0;const h=harness(async()=>{calls++;return {ok:true,json:async()=>docs};});
h.trigger.fire('click');assert(h.dialog.open);assert(h.input.focused);h.close.fire('click');assert(!h.dialog.open);assert(h.trigger.focused);
h.input.value='selling my company';h.form.fire('submit');await settle();assert(h.status.textContent.includes('results'));assert(h.output.children.some(a=>a.children[0].href.includes('/business-owners/')));
h.suggestion.fire('click');await settle();assert.equal(h.input.value,'Structured notes');assert.equal(calls,1);assert(h.output.children.some(a=>a.children[0].href.startsWith('/structured-notes/')));
h.input.value='zzqxunfindable';h.form.fire('submit');await settle();assert(h.status.textContent.startsWith('No matches'));assert.equal(h.output.children[0].href,'/money-questions/');
h.input.value='';h.form.fire('submit');assert.equal(h.output.children.length,0);
let attempts=0;const retry=harness(async()=>{if(++attempts===1)throw Error('Offline');return {ok:true,json:async()=>docs};});retry.input.value='SAGE';retry.form.fire('submit');await settle();assert(retry.status.textContent.includes('could not load'));retry.form.fire('submit');await settle();assert(retry.status.textContent.includes('result'));assert.equal(attempts,2);
let release;const race=harness(()=>new Promise(resolve=>{release=resolve;}));race.input.value='Taxes';race.form.fire('submit');race.input.value='';race.form.fire('submit');release({ok:true,json:async()=>docs});await settle();assert.equal(race.output.children.length,0);assert(race.status.textContent.startsWith('Search across'));
console.log('Search UI checks passed: dialog opening/closing and focus return, real search rendering, suggestion buttons, index caching, no-match fallback, error/retry and stale-request cancellation.');

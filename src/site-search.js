import {searchDocuments,snippet} from './search-engine.js';
let indexPromise;
function loadIndex(){if(!indexPromise)indexPromise=fetch('/search-index.json').then(r=>{if(!r.ok)throw Error('Search unavailable');return r.json();}).catch(e=>{indexPromise=null;throw e;});return indexPromise;}
const dialog=document.getElementById('site-search-dialog');let previousFocus;
document.querySelectorAll('[data-open-search]').forEach(link=>link.addEventListener('click',e=>{
 if(!dialog?.showModal)return;
 e.preventDefault();const menu=link.closest('details.mobile');previousFocus=menu?menu.querySelector('summary'):link;if(menu)menu.open=false;
 dialog.showModal();dialog.querySelector('[data-search-input]').focus();
}));
dialog?.querySelector('[data-close-search]')?.addEventListener('click',()=>dialog.close());
dialog?.addEventListener('close',()=>previousFocus?.focus());
dialog?.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
for(const surface of document.querySelectorAll('[data-search-surface]')){
 const form=surface.querySelector('[data-search-form]'),input=surface.querySelector('[data-search-input]'),status=surface.querySelector('[data-search-status]'),output=surface.querySelector('[data-search-results]');let request=0,timer;
 async function update(){
  const sequence=++request,query=input.value.trim();output.replaceChildren();
  if(query.length<2){status.textContent='Search across RIPL’s pages and money questions.';return;}
  status.textContent='Searching…';
  try{
   const docs=await loadIndex();if(sequence!==request)return;
   const results=searchDocuments(docs,query);
   status.textContent=results.length?`${results.length} ${results.length===1?'result':'results'} for “${query}”.`:'No matches yet. Try fewer words, a related topic, or browse Money Questions.';
   for(const doc of results){
    const article=document.createElement('article'),link=document.createElement('a'),heading=document.createElement('h3'),category=document.createElement('span'),preview=document.createElement('p');
    link.href=doc.url;heading.textContent=doc.title;category.className='search-category';category.textContent=doc.category;preview.textContent=snippet(doc,query);link.append(category,heading,preview);article.append(link);output.append(article);
   }
   if(!results.length){const link=document.createElement('a');link.href='/money-questions/';link.textContent='Browse Money Questions →';output.append(link);}
  }catch(_){if(sequence===request){status.textContent='Search could not load. Try again, or browse Money Questions.';const link=document.createElement('a');link.href='/money-questions/';link.textContent='Browse Money Questions →';output.append(link);}}
 }
 form.addEventListener('submit',e=>{e.preventDefault();clearTimeout(timer);update();});
 input.addEventListener('input',()=>{++request;clearTimeout(timer);timer=setTimeout(update,180);});
 surface.querySelectorAll('[data-search-suggestion]').forEach(button=>button.addEventListener('click',()=>{clearTimeout(timer);input.value=button.dataset.searchSuggestion;update();input.focus();}));
 if(surface.closest('.search-page')){input.value=new URLSearchParams(location.search).get('q')||'';if(input.value)update();}
}

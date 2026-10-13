const tabs = Array.from(document.querySelectorAll('[data-path]'));
const panels = Array.from(document.querySelectorAll('[data-pathview]'));
function selectPath(tab, focus = false) {
  tabs.forEach(t => { const selected=t===tab; t.setAttribute('aria-selected',String(selected)); t.tabIndex=selected?0:-1; });
  panels.forEach(p => { p.hidden=p.dataset.pathview!==tab.dataset.path; });
  if(focus) tab.focus();
}
if(tabs.length){
  const path=new URLSearchParams(location.search).get('path');
  selectPath(tabs.find(t=>t.dataset.path===path)||tabs[0]);
  tabs.forEach((tab,i)=>{
    tab.addEventListener('click',()=>selectPath(tab));
    tab.addEventListener('keydown',event=>{
      let target;
      if(event.key==='ArrowRight'||event.key==='ArrowDown')target=tabs[(i+1)%tabs.length];
      if(event.key==='ArrowLeft'||event.key==='ArrowUp')target=tabs[(i-1+tabs.length)%tabs.length];
      if(event.key==='Home')target=tabs[0];
      if(event.key==='End')target=tabs[tabs.length-1];
      if(target){event.preventDefault();selectPath(target,true);}
    });
  });
}

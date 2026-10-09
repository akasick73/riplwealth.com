import data from './quiz-data.json';
import {scoreMindsets,scoreTendency} from './quiz-scoring.js';
const body=document.getElementById('quizBody');
const tracks={owner:'Business owner',athlete:'Athlete',career:'Career and life'};
const fromUrl=new URLSearchParams(location.search).get('track');
let q={aud:Object.hasOwn(tracks,fromUrl)?fromUrl:null,step:0,rate:Array(12).fill(null),duel:Array(5).fill(null),lead:null};
const esc=value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const nav=(ok,label='Continue')=>`<div class="q-nav">${q.step>0?'<button type="button" class="q-back" data-back>Back</button>':'<button type="button" class="q-back" data-restart>Change my track</button>'}<button type="button" class="btn" data-next ${ok?'':'disabled'}>${label}</button></div><p class="small">Answer each item to continue. There are no right or wrong answers.</p>`;
const heading=text=>`<h2 tabindex="-1" class="quiz-heading" data-quiz-heading>${text}</h2>`;
function result(){
  const {scores,leaders}=scoreMindsets(data.statements[q.aud],q.rate);
  if(!q.lead&&leaders.length>1){
    const zero=Math.max(...Object.values(scores))===0;
    return heading(zero?'Let’s find a better starting point.':'More than one mindset fits.')+`<p>${zero?'None of those statements felt like you. Choose the stage that comes closest to your life today, or start over.':'Your answers gave these mindsets the same score. Which best describes the decisions in front of you today?'}</p><div class="q-choose">${leaders.map(k=>`<button type="button" data-lead="${k}"><strong>${data.mindsets[k]}</strong><small>${{builder:'I am building my income and creating room to save.',accumulator:'Money is arriving faster than the structure around it.',navigator:'A change in life has brought new financial decisions.',steward:'Family, community and giving are central to my decisions.'}[k]}</small></button>`).join('')}</div><div class="q-nav"><button class="q-back" type="button" data-back>Review my answers</button><button class="q-back" type="button" data-restart>Start over</button></div>`;
  }
  const lead=q.lead||leaders[0],tendency=scoreTendency(q.duel),key=lead==='steward'?'steward':`${lead}_${tendency}`;
  const p=data.personas[q.aud][key];
  const href=q.aud!=='athlete'&&p.cta==='learn'?'/ripl-effect/':'/contact/';
  const cta=href==='/contact/'?'Talk to the Team':'Explore the RIPL Effect';
  const overlap=leaders.length>1?`<p class="small">You also recognized elements of ${leaders.filter(k=>k!==lead).map(k=>data.mindsets[k]).join(' and ')}. You selected ${data.mindsets[lead]} as the closest fit today.</p>`:'';
  return `<div class="q-res"><div class="q-icon" aria-hidden="true">${data.icons[key]||''}</div><div class="eyebrow">YOUR CLOSEST WEALTH PERSONA TODAY</div>${heading(`<span>${esc(p.label)}</span>`)}<div class="q-tags"><span>Mindset: ${data.mindsets[lead]}</span><span>Tendency: ${tendency==='bold'?'Opportunity':'Safety'}</span><span>${tracks[q.aud]}</span></div>${overlap}<p class="lead">${esc(p.identity)}</p><p><strong>What drives you.</strong> ${esc(p.driver)}</p><div class="q-box"><h3>Your strengths</h3><ul>${p.strengthBullets.map(s=>`<li>${esc(s)}</li>`).join('')}</ul><p>${esc(p.strengthBody)}</p></div><div class="q-box"><h3>Worth a second look</h3><h4>${esc(p.pitfallHead)}</h4><p>${esc(p.pitfallBody)}</p></div><div class="q-box"><h3>Your next stage</h3>${p.next.map(n=>`<h4>${esc(n.label)}</h4><p>${esc(n.text)}</p>`).join('')}</div><div class="q-cta"><h3>What could your next decision make possible?</h3><p>${href==='/contact/'?'Bring the short version. We’ll help you see the options and decide whether there is a fit.':'Start with the ideas behind our work. When you are ready to connect them to your own life, our team is here.'}</p><div class="page-actions"><a class="btn" href="${href}">${cta}</a><a class="text-link" href="/money-mindsets/">Explore the mindsets →</a></div></div><p class="small pm-disc">This short assessment reflects your own answers today. It is educational and directional, not a validated psychological test, risk assessment, financial plan or investment, tax or legal advice. It does not establish your financial readiness or recommend an investment. Your priorities may change.</p><section class="q-contact"><h3>Want to talk through your result?</h3><p>Send your result to Adam and Chase and ask the team to reach out. Your individual answers stay in your browser.</p><form class="form" data-result-form><label for="result-name">Name<input id="result-name" name="name" autocomplete="name" required maxlength="120"/></label><label for="result-email">Email<input id="result-email" name="email" type="email" autocomplete="email" required maxlength="254"/></label><label for="result-phone">Phone (optional)<input id="result-phone" name="phone" type="tel" autocomplete="tel" maxlength="40"/></label><label class="consent"><input name="consent" type="checkbox" required/>Please send my result to the RIPL team and have them contact me.</label><input type="text" name="website" class="honeypot" tabindex="-1" autocomplete="off" aria-hidden="true"/><p class="small">Delivery is processed through FormSubmit. This does not subscribe you to a newsletter or request text messages. <a href="/privacy/">Privacy details</a>.</p><button class="btn" type="submit">Send My Result to the Team</button><p class="quiz-status" role="status" data-result-status></p></form></section><div class="q-nav"><button class="q-back" type="button" data-back>Review my answers</button><button class="q-back" type="button" data-restart>Start over</button></div></div>`;
}
function render(focus=false){
  if(!body)return;
  let h='';
  if(!q.aud){
    h=heading('Which sounds most like you?')+'<p>The questions will fit the life you are building.</p><div class="q-choose"><button type="button" data-pick="owner"><strong>I own a business.</strong><small>Connect business success with personal wealth.</small></button><button type="button" data-pick="athlete"><strong>I’m an athlete.</strong><small>Organize new income and build beyond your sport.</small></button><button type="button" data-pick="career"><strong>I’m building my career or next chapter.</strong><small>Make your income and savings work toward your life.</small></button></div>';
  }else if(q.step<2){
    h=`<div class="q-prog">${tracks[q.aud]} · Step ${q.step+1} of 3</div>`+heading('Does this sound like you?')+'<p>Think about where you are today, rather than where you want to be.</p>';
    const start=q.step*6;
    for(let i=start;i<start+6;i++)h+=`<fieldset class="q-item"><legend>${i+1}. ${esc(data.statements[q.aud][i][1])}</legend><div class="q-btns">${[[0,'Not me'],[1,'Feels like me']].map(([v,label])=>`<button type="button" data-rate="${i}" data-value="${v}" aria-pressed="${q.rate[i]===v}">${label}</button>`).join('')}</div></fieldset>`;
    h+=nav(q.rate.slice(start,start+6).every(v=>v!==null));
  }else if(q.step===2){
    h=`<div class="q-prog">${tracks[q.aud]} · Step 3 of 3</div>`+heading('Which feels more like you?')+'<p>Choose the closer fit in each pair. Both approaches have strengths and tradeoffs.</p>';
    data.duels.forEach((pair,i)=>{h+=`<fieldset class="q-duel"><legend>Choice ${i+1} of 5</legend><div class="q-pair">${pair.map((s,j)=>`<button type="button" data-duel="${i}" data-value="${j===0?'o':'s'}" aria-pressed="${q.duel[i]===(j===0?'o':'s')}">${esc(s)}</button>`).join('')}</div></fieldset>`;});
    h+=nav(q.duel.every(v=>v!==null),'See My Wealth Persona');
  }else h=result();
  body.innerHTML=h;
  if(focus){body.querySelector('[data-quiz-heading]')?.focus({preventScroll:true});document.getElementById('quiz')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});}
}
if(body){
  body.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b||b.disabled)return;
    let focus=true,restore=null;
    if(b.dataset.pick){q={aud:b.dataset.pick,step:0,rate:Array(12).fill(null),duel:Array(5).fill(null),lead:null};}
    else if(b.dataset.rate!==undefined){q.rate[Number(b.dataset.rate)]=Number(b.dataset.value);q.lead=null;restore=`[data-rate="${b.dataset.rate}"][data-value="${b.dataset.value}"]`;focus=false;}
    else if(b.dataset.duel!==undefined){q.duel[Number(b.dataset.duel)]=b.dataset.value;q.lead=null;restore=`[data-duel="${b.dataset.duel}"][data-value="${b.dataset.value}"]`;focus=false;}
    else if(b.dataset.lead){q.lead=b.dataset.lead;}
    else if(b.hasAttribute('data-next')){q.step++;q.lead=null;}
    else if(b.hasAttribute('data-back')){q.step=Math.max(0,q.step-1);q.lead=null;}
    else if(b.hasAttribute('data-restart')){q={aud:null,step:0,rate:Array(12).fill(null),duel:Array(5).fill(null),lead:null};}
    else return;
    render(focus);if(restore)body.querySelector(restore)?.focus({preventScroll:true});
  });
  body.addEventListener('submit',async e=>{
    const form=e.target.closest('[data-result-form]');if(!form)return;e.preventDefault();
    if(!form.reportValidity())return;
    const fields=new FormData(form);if(fields.get('website'))return;
    const {leaders}=scoreMindsets(data.statements[q.aud],q.rate),lead=q.lead||leaders[0],tendency=scoreTendency(q.duel),key=lead==='steward'?'steward':`${lead}_${tendency}`;
    const status=form.querySelector('[data-result-status]'),button=form.querySelector('[type=submit]');button.disabled=true;status.textContent='Sending your result to Adam and Chase…';
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),15000);
    try{
      const response=await fetch('https://formsubmit.co/ajax/adam@riplwealth.com',{method:'POST',signal:controller.signal,headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({name:String(fields.get('name')).trim(),email:String(fields.get('email')).trim(),phone:String(fields.get('phone')||'').trim(),persona:data.personas[q.aud][key].label,track:tracks[q.aud],mindset:data.mindsets[lead],tendency:tendency==='bold'?'Opportunity':'Safety',overlapping_mindsets:leaders.map(k=>data.mindsets[k]).join(', '),consent:'Requested result delivery and contact from the RIPL team.',_cc:'chase@riplwealth.com',_subject:'RIPL wealth persona: conversation request',_template:'table'})});
      const receipt=await response.json();if(!response.ok||!(receipt.success===true||receipt.success==='true'))throw new Error('Delivery not confirmed');
      status.textContent='Your result was sent. The RIPL team will follow up.';button.textContent='Result Sent';
    }catch(_){status.textContent='We could not confirm delivery. You can try again or contact us at hello@riplwealth.com. Your result is still shown above.';button.disabled=false;}
    finally{clearTimeout(timeout);}
  });
  render();
}

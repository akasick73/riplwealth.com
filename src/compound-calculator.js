import {compoundProjection} from './compound-math.js';
const root=document.querySelector('[data-compound]');
if(root){
  const form=root.querySelector('form'),results=root.querySelector('[data-calc-results]'),error=root.querySelector('[data-calc-error]');
  const currency=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
  const compact=new Intl.NumberFormat('en-US',{notation:'compact',maximumFractionDigits:1});
  const ns='http://www.w3.org/2000/svg';
  const svgElement=(name,attrs,text)=>{const el=document.createElementNS(ns,name);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,String(v)));if(text!==undefined)el.textContent=text;return el;};
  function update(){
    try{
      if(!form.checkValidity())throw new Error('Check the fields: amounts must be nonnegative, years a whole number from 0 to 60, and the assumed rate between −100% and 30%.');
      const f=new FormData(form),params={principal:Number(f.get('principal')),contribution:Number(f.get('contribution')),frequency:String(f.get('frequency')),rate:Number(f.get('rate')),years:Number(f.get('years'))};
      const rows=compoundProjection(params),last=rows.at(-1);
      error.textContent='';results.hidden=false;
      root.querySelector('[data-calc-total]').textContent=currency.format(last.balance);
      root.querySelector('[data-calc-deposits]').textContent=currency.format(last.deposits);
      root.querySelector('[data-calc-growth]').textContent=currency.format(last.growth);
      root.querySelector('[data-calc-summary]').textContent=`After ${params.years} ${params.years===1?'year':'years'}, these assumptions produce ${currency.format(last.balance)}. This is a hypothetical illustration, not a forecast.`;
      const chart=root.querySelector('[data-calc-chart]');chart.replaceChildren();
      const L=68,R=20,T=20,B=44,W=720,H=360,top=Math.max(1,...rows.flatMap(r=>[r.balance,r.deposits]))*1.08;
      const x=year=>L+(W-L-R)*year/Math.max(1,params.years),y=value=>H-B-(H-T-B)*value/top;
      for(let i=0;i<=4;i++){
        const v=top*i/4;
        chart.append(svgElement('line',{x1:L,y1:y(v),x2:W-R,y2:y(v),stroke:'#DCDCE8'}));
        chart.append(svgElement('text',{x:L-10,y:y(v)+4,'text-anchor':'end',fill:'#3D3D58','font-size':12},'$'+compact.format(v)));
      }
      const ticks=[...new Set([0,Math.round(params.years/2),params.years])];
      ticks.forEach(t=>chart.append(svgElement('text',{x:x(t),y:H-14,'text-anchor':t===0?'start':t===params.years?'end':'middle',fill:'#3D3D58','font-size':13},t===0?'Today':`Year ${t}`)));
      for(const [key,color] of [['deposits','#6355B8'],['balance','#C9963A']]){
        chart.append(svgElement('polyline',{points:rows.map(r=>`${x(r.year)},${y(r[key])}`).join(' '),fill:'none',stroke:color,'stroke-width':3,'stroke-linejoin':'round'}));
        if(rows.length===1)chart.append(svgElement('circle',{cx:x(0),cy:y(rows[0][key]),r:4,fill:color}));
      }
      const table=root.querySelector('[data-calc-table]');table.replaceChildren();
      rows.forEach(row=>{const tr=document.createElement('tr');[row.year,currency.format(row.deposits),currency.format(row.growth),currency.format(row.balance)].forEach(value=>{const td=document.createElement('td');td.textContent=String(value);tr.append(td);});table.append(tr);});
    }catch(e){results.hidden=true;error.textContent=e instanceof RangeError?'Please enter values within the ranges shown.':e.message;}
  }
  form.addEventListener('submit',e=>{e.preventDefault();update();});
  form.addEventListener('input',update);form.addEventListener('change',update);update();
}

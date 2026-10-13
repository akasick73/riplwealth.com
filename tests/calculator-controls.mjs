import assert from 'node:assert/strict';import vm from 'node:vm';import {readFile} from 'node:fs/promises';import {compoundProjection} from '../src/compound-math.js';
class Element{constructor(){this.value='';this.dataset={};this.children=[];this.listeners={};this.textContent='';}append(...xs){this.children.push(...xs);}replaceChildren(){this.children=[];}setAttribute(k,v){this[k]=v;}addEventListener(k,v){this.listeners[k]=v;}closest(s){return this.dataset.calcSlider?this:null;}}
const config={principal:[500000,0,1e9],years:[15,0,60],rate:[8,-100,30],contribution:[0,0,1e7],frequency:['monthly']};
const fields=Object.fromEntries(Object.entries(config).map(([name,[value,min,max]])=>{const e=new Element();e.value=String(value);e.checkValidity=()=>name==='frequency'||(e.value!==''&&Number.isFinite(Number(e.value))&&Number(e.value)>=min&&Number(e.value)<=max&&(name!=='years'||Number.isInteger(Number(e.value))));return [name,e];}));
const sliders=Object.entries({principal:[0,5000000],years:[0,60],rate:[-10,20],contribution:[0,10000]}).map(([key,[min,max]])=>{const e=new Element();e.dataset={calcSlider:key,baseMin:String(min),baseMax:String(max)};return e;});
const selectors={};for(const name of ['results','error','total','deposits','growth','summary','chart','table'])selectors[`[data-calc-${name}]`]=new Element();
const form=new Element();form.querySelector=s=>fields[s.match(/name="([^"]+)/)?.[1]];form.querySelectorAll=()=>sliders;form.checkValidity=()=>Object.values(fields).every(f=>f.checkValidity());
const root={querySelector:s=>s==='form'?form:selectors[s]};
const document={querySelector:()=>root,createElementNS:()=>new Element(),createElement:()=>new Element()};
class FormData{get(k){return fields[k].value;}}
const source=(await readFile('src/compound-calculator.js','utf8')).replace(/^import .*;\n/,'');vm.runInNewContext(source,{document,Intl,FormData,compoundProjection,RangeError});
const displayed=()=>Number(selectors['[data-calc-total]'].textContent.replace(/[$,]/g,''));
assert.equal(displayed(),1586085);assert.equal(sliders[0].value,'500000');
sliders[0].value='750000';form.listeners.input({target:sliders[0]});assert.equal(fields.principal.value,'750000');assert.equal(displayed(),Math.round(750000*1.08**15));
fields.years.value='20';form.listeners.input({target:fields.years});assert.equal(sliders[1].value,'20');assert.equal(selectors['[data-calc-table]'].children.length,21);
fields.principal.value='6000000';form.listeners.input({target:fields.principal});assert.equal(sliders[0].max,'6000000');assert.equal(sliders[0].value,'6000000');
fields.years.value='2.5';form.listeners.input({target:fields.years});assert(selectors['[data-calc-results]'].hidden);assert(selectors['[data-calc-error]'].textContent);
fields.years.value='10';form.listeners.change({target:fields.years});assert(!selectors['[data-calc-results]'].hidden);assert.equal(selectors['[data-calc-error]'].textContent,'');
sliders[2].value='-5';form.listeners.input({target:sliders[2]});assert.equal(fields.rate.value,'-5');assert(displayed()<6000000);
console.log('Calculator controls passed: initial defaults, slider-to-field, field-to-slider, live math/table updates, large manual amounts, invalid input recovery and negative-rate illustration.');

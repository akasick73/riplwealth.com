export function scoreMindsets(statements,answers){
  if(statements.length!==12||answers.length!==12||answers.some(a=>a!==0&&a!==1))throw new Error('Complete all twelve statements.');
  const scores={builder:0,accumulator:0,navigator:0,steward:0};
  statements.forEach(([mindset],i)=>{scores[mindset]+=answers[i];});
  const high=Math.max(...Object.values(scores));
  return {scores,leaders:Object.keys(scores).filter(k=>scores[k]===high)};
}
export function scoreTendency(answers){
  if(answers.length!==5||answers.some(a=>a!=='o'&&a!=='s'))throw new Error('Complete all five choices.');
  return answers.filter(a=>a==='o').length>=3?'bold':'cautious';
}

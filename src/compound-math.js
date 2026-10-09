// Annual crediting. Monthly deposits earn simple prorated interest until year end.
export function compoundProjection({principal, contribution, frequency, rate, years}) {
  if(![principal,contribution,rate,years].every(Number.isFinite)||principal<0||principal>1e9||contribution<0||contribution>1e7||rate<-100||rate>30||years<0||years>60||!Number.isInteger(years)||!['monthly','annually'].includes(frequency)) throw new RangeError('Invalid illustration inputs.');
  const r=rate/100, annual=contribution*(frequency==='monthly'?12:1);
  let balance=principal, deposits=principal;
  const rows=[{year:0,deposits,balance,growth:0}];
  for(let year=1;year<=years;year++){
    // Month-end deposits have 11,10,...,0 months left until annual crediting.
    balance=balance*(1+r)+annual+(frequency==='monthly'?contribution*r*5.5:0);
    deposits+=annual;
    rows.push({year,deposits,balance,growth:balance-deposits});
  }
  return rows;
}

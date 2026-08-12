/* Soru üretimi, metinden soru ayrıştırma, ses. */

/* --- soru üretimi --- */
function soruUret(c){
  for(let a=0;a<40;a++){
    const n=rnd(c.min,c.max);const t=[];let r=0;
    for(let i=0;i<n;i++){
      let v;
      if(i>0&&Math.random()<c.neg&&r>1){const cap=Math.min(r-1,c.hi);v=cap>=1?-rnd(1,cap):rnd(c.lo,c.hi)}
      else v=rnd(c.lo,c.hi);
      r+=v;t.push(v);
    }
    if(r>0) return {t,c:r};
  }
  return {t:[3,4],c:7};
}
function soruAyikla(metin){
  const qs=[],hata=[];
  String(metin||"").split(/\r?\n/).forEach((satir,li)=>{
    let s=satir.trim(); if(!s||s.startsWith("#"))return;
    let zorla=null; const p=s.split("=");
    if(p.length===2){const f=Number(p[1].trim().replace(/[−–]/g,"-"));if(!isNaN(f)&&p[1].trim()!=="")zorla=f;s=p[0].trim()}
    const tk=s.split(/[\s,;]+/).filter(Boolean); const t=[]; let ok=tk.length>0;
    for(let x of tk){
      x=x.replace(/[−–]/g,"-").replace(/^\+/,"");
      if(/^\d+-$/.test(x)) x="-"+x.slice(0,-1);
      const v=Number(x); if(x===""||isNaN(v)){ok=false;break} t.push(v);
    }
    if(!ok||t.length<2){hata.push(li+1);return}
    qs.push({t,c:zorla!==null?zorla:t.reduce((a,b)=>a+b,0)});
  });
  return {qs,hata};
}
function sorulariYaz(qs){ return (qs||[]).map(q=>{const s=q.t.reduce((a,b)=>a+b,0);
  return q.t.join(" ")+(q.c!==s?" = "+q.c:"")}).join("\n"); }
let actx=null;
function bip(f,d,tip){
  if(!SX.exam||SX.exam.ses===false) return;
  try{ actx=actx||new (window.AudioContext||window.webkitAudioContext)();
    const o=actx.createOscillator(),g=actx.createGain();
    o.type=tip;o.frequency.value=f;g.gain.setValueAtTime(.09,actx.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001,actx.currentTime+d);
    o.connect(g).connect(actx.destination);o.start();o.stop(actx.currentTime+d);
  }catch(e){}
}

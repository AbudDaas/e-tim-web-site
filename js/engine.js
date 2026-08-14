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

/* ===================================================================
   GENEL SORU AYIRICI — aritmetik dışındaki dersler için.
   Öğretmen düz metin yazar, biçim şöyledir:

   Çoktan seçmeli:  Soru metni | şık | *doğru şık | şık
   Kısa cevap:      Soru metni = cevap = ikinci kabul edilen yazım
   Doğru/yanlış:    Soru metni = D      (ya da = Y)

   # ile başlayan satır atlanır, boş satır atlanır.
   =================================================================== */
function metniSadelestir(x){
  return String(x==null?"":x).trim().toLowerCase()
    .replace(/\s+/g," ")
    .replace(/[.,;:!?'"’“”]/g,"")
    .replace(/[İIıi]/g,"i").replace(/[Şş]/g,"s").replace(/[Ğğ]/g,"g")
    .replace(/[Üü]/g,"u").replace(/[Öö]/g,"o").replace(/[Çç]/g,"c")
    .replace(/[أإآا]/g,"ا").replace(/[ةه]/g,"ه").replace(/[ىي]/g,"ي")
    .replace(/[\u064B-\u0652]/g,"");
}
function soruAyiklaGenel(metin, tip){
  const qs=[], hata=[];
  String(metin||"").split(/\r?\n/).forEach((satir,li)=>{
    const s=satir.trim();
    if(!s || s.startsWith("#")) return;

    if(s.includes("|")){                       /* çoktan seçmeli */
      const p=s.split("|").map(x=>x.trim()).filter(x=>x!=="");
      if(p.length<3){ hata.push(li+1); return; }
      const soru=p[0], sec=p.slice(1);
      let dogru=sec.findIndex(x=>x.startsWith("*"));
      if(dogru<0) dogru=0;
      qs.push({tip:"secmeli", s:soru, sec:sec.map(x=>x.replace(/^\*/,"").trim()), d:dogru});
      return;
    }
    if(s.includes("=")){
      const i=s.indexOf("=");
      const soru=s.slice(0,i).trim();
      const kalan=s.slice(i+1).split("=").map(x=>x.trim()).filter(Boolean);
      if(!soru || !kalan.length){ hata.push(li+1); return; }
      const ilk=kalan[0].toUpperCase();
      if(["D","Y","DOĞRU","YANLIŞ","TRUE","FALSE","صح","خطأ"].includes(ilk)){
        qs.push({tip:"dv", s:soru, d:["D","DOĞRU","TRUE","صح"].includes(ilk)});
      } else {
        qs.push({tip:"yazili", s:soru, d:kalan[0], alt:kalan.slice(1)});
      }
      return;
    }
    hata.push(li+1);
  });
  return {qs,hata};
}
function cevapDogruMu(q,cevap){
  if(!q) return false;
  const tip=q.tip||"aritmetik";
  if(tip==="aritmetik") return Number(cevap)===q.c;
  if(tip==="secmeli")   return Number(cevap)===Number(q.d);
  if(tip==="dv")        return Boolean(cevap)===Boolean(q.d);
  if(tip==="yazili"){
    const c=metniSadelestir(cevap);
    if(!c) return false;
    const kabul=[q.d].concat(q.alt||[]).map(metniSadelestir);
    return kabul.includes(c);
  }
  return false;
}
function soruMetni(q,eksiSag){
  const tip=q.tip||"aritmetik";
  if(tip==="aritmetik") return q.t.map(v=>sayiYaz(v,eksiSag)).join(" ");
  return q.s||"";
}
function dogruMetni(q){
  const tip=q.tip||"aritmetik";
  if(tip==="aritmetik") return String(q.c);
  if(tip==="secmeli")   return (q.sec||[])[q.d]||"";
  if(tip==="dv")        return q.d?"Doğru":"Yanlış";
  return String(q.d||"");
}
function cevapMetni(q,cevap){
  if(cevap===null||cevap===undefined||cevap==="") return null;
  const tip=q.tip||"aritmetik";
  if(tip==="secmeli") return (q.sec||[])[cevap]||String(cevap);
  if(tip==="dv")      return cevap?"Doğru":"Yanlış";
  return String(cevap);
}

/* Kaydedilmiş soruları yeniden düzenlenebilir metne çevirir. */
function sorulariYazGenel(qs){
  return (qs||[]).map(q=>{
    const tip=q.tip||"aritmetik";
    if(tip==="secmeli") return [q.s].concat((q.sec||[]).map((x,i)=>(i===q.d?"*":"")+x)).join(" | ");
    if(tip==="dv")      return q.s+" = "+(q.d?"D":"Y");
    if(tip==="yazili")  return [q.s,q.d].concat(q.alt||[]).join(" = ");
    const s=q.t.reduce((a,b)=>a+b,0);
    return q.t.join(" ")+(q.c!==s?" = "+q.c:"");
  }).join("\n");
}
/* Aralıklı tekrar (SRS).
   Kart, yanlış çözülen soru ve ezberlenen sure aynı zamanlayıcıya girer.
   SM-2'nin sadeleştirilmiş hâli: her öğe için kolaylık katsayısı ve aralık tutulur.

   Değerlendirme:  1 = zor (baştan)   2 = normal   3 = kolay
   Aralık günü büyüdükçe öğe seyrekleşir; yanlışta sıfırlanır. */

const SRS = { durum:{}, kuyruk:[], i:0, acik:false, yuklendi:false };

function srsGun(){ return Math.floor(Date.now()/864e5); }

function srsKayit(id){
  return SRS.durum[id] || {aralik:0, kolaylik:2.5, tekrar:0, gun:0};
}
function srsPlanla(id, puan){
  const k=srsKayit(id);
  if(puan<=1){ k.tekrar=0; k.aralik=1; k.kolaylik=Math.max(1.3,k.kolaylik-0.2); }
  else{
    k.tekrar++;
    if(k.tekrar===1) k.aralik=1;
    else if(k.tekrar===2) k.aralik=3;
    else k.aralik=Math.round(k.aralik*k.kolaylik);
    if(puan===3) k.kolaylik=Math.min(3.2,k.kolaylik+0.12);
  }
  k.gun=srsGun()+k.aralik;
  SRS.durum[id]=k;
  return k;
}
function srsZamaniGelmis(id){ const k=SRS.durum[id]; return !k || k.gun<=srsGun(); }

/* --- öğeleri topla: kartlar, yanlış sorular, ezberlenen sureler --- */
function srsOgeler(){
  const o=[];
  (DATA.kartlar||[]).forEach(k=>{
    o.push({ id:"k:"+k.ders+":"+ceviri(k.on), ders:k.ders, tur:"kart",
             on:ceviri(k.on), arka:ceviri(k.arka), etiket:ceviri(k.ipucu)||"" });
  });
  (SX.ogrSonuc||[]).forEach(r=>{
    (Array.isArray(r.dokum)?r.dokum:[]).forEach((d,i)=>{
      const yanlis = d.a===null || d.a===undefined || String(d.a)!==String(d.c);
      if(!yanlis) return;
      o.push({ id:"s:"+(r.sinavKod||"x")+":"+i+":"+String(d.q).slice(0,24), ders:r.ders||"aritmetik",
               tur:"soru", on:String(d.q), arka:String(d.c), etiket:r.sinavAd||"" });
    });
  });
  if(typeof SURELER!=="undefined"){
    SURELER.forEach(s=>{
      if((EZB.durum||{})[s.n]==="bitti")
        o.push({ id:"e:"+s.n, ders:"kuran", tur:"ezber",
                 on:s.ar+" — "+s.ad, arka:s.ayet+" ayet · ezberi tekrarla", etiket:"ezber" });
    });
  }
  /* aynı öğe iki kez girmesin */
  const gorulen={};
  return o.filter(x=> gorulen[x.id] ? false : (gorulen[x.id]=1));
}
function srsBugun(ders){
  return srsOgeler()
    .filter(x=> !ders || x.ders===ders)
    .filter(x=> srsZamaniGelmis(x.id));
}

/* --- görünümler --- */
function srsOzetKutusu(){
  if(!girisliMi() || SX.user.rol==="ogretmen") return "";
  const hepsi=srsBugun();
  if(!hepsi.length) return `<div class="card pad" style="margin-top:14px">
    <h3 style="margin-bottom:4px">Günlük tekrar</h3>
    <p class="muted" style="font-size:13.5px">Bugünlük tekrar edilecek bir şey yok. Yarın yeniden bak.</p></div>`;
  const dersler={};
  hepsi.forEach(x=>{ dersler[x.ders]=(dersler[x.ders]||0)+1; });
  return `<div class="card pad srs-ozet" style="margin-top:14px">
    <div style="flex:1">
      <h3 style="margin-bottom:4px">Günlük tekrar</h3>
      <p class="muted" style="font-size:13.5px">Unutmadan hatırlaman gereken <b>${hepsi.length}</b> şey var.</p>
      <div class="srs-etiketler">${Object.keys(dersler).map(d=>
        `<span class="ders-rozet" style="--dr:${dersRenk(d)}">${dersIco(d)} ${dersAd(d)} · ${dersler[d]}</span>`).join("")}</div>
    </div>
    <button class="btn" data-srs="basla"><i class="fa-solid fa-rotate"></i> Tekrara başla</button>
  </div>`;
}

function srsEkran(){
  const q=SRS.kuyruk[SRS.i];
  if(!q) return `<section class="page"><div class="card pad" style="max-width:560px;margin-inline:auto;text-align:center">
    <div class="srs-bitti">✓</div>
    <h2 style="margin:12px 0 6px">Tekrar bitti</h2>
    <p class="muted">Bugünün listesini tamamladın. Yarın yeni öğeler gelecek.</p>
    <button class="btn" data-srs="kapat" style="margin-top:16px">Profile dön</button></div></section>`;

  return `<section class="page">
    <div class="srs-ust">
      <span class="ders-rozet" style="--dr:${dersRenk(q.ders)}">${dersIco(q.ders)} ${dersAd(q.ders)}</span>
      <span class="srs-sayac">${SRS.i+1} / ${SRS.kuyruk.length}</span>
      <button class="btn ghost sm" data-srs="kapat">Çık</button>
    </div>
    <div class="srs-bar"><i style="width:${Math.round(SRS.i/SRS.kuyruk.length*100)}%"></i></div>

    <div class="card pad srs-kart">
      <div class="srs-tur">${q.tur==="kart"?"kelime":q.tur==="soru"?"yanlış yaptığın soru":"ezber"}${q.etiket?" · "+esc(q.etiket):""}</div>
      <div class="srs-on">${esc(q.on)}</div>
      ${SRS.acik? `<div class="srs-ayrac"></div><div class="srs-arka">${esc(q.arka)}</div>` : ""}
    </div>

    ${SRS.acik? `<div class="srs-puan">
        <button class="btn ghost" data-srs="puan" data-v="1">Zor<span>yarın tekrar</span></button>
        <button class="btn ghost" data-srs="puan" data-v="2">Normal<span>birkaç gün</span></button>
        <button class="btn" data-srs="puan" data-v="3">Kolay<span>daha seyrek</span></button>
      </div>`
      : `<button class="btn" data-srs="goster" style="margin-top:14px"><i class="fa-solid fa-eye"></i> Cevabı göster</button>`}
  </section>`;
}

/* --- olaylar --- */
document.addEventListener("click", async e=>{
  const b=e.target.closest("[data-srs]"); if(!b) return;
  const eylem=b.dataset.srs;
  if(eylem==="basla"){
    SRS.kuyruk=srsBugun(); SRS.i=0; SRS.acik=false;
    for(let i=SRS.kuyruk.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [SRS.kuyruk[i],SRS.kuyruk[j]]=[SRS.kuyruk[j],SRS.kuyruk[i]]; }
    SX.tekrar=true; ciz(); window.scrollTo(0,0); return;
  }
  if(eylem==="goster"){ SRS.acik=true; ciz(); return; }
  if(eylem==="puan"){
    const q=SRS.kuyruk[SRS.i]; if(!q) return;
    srsPlanla(q.id, +b.dataset.v);
    SRS.i++; SRS.acik=false; ciz();
    try{ await API.srsYaz(SX.user.uid, SRS.durum); }catch(err){}
    return;
  }
  if(eylem==="kapat"){ SX.tekrar=false; ciz(); window.scrollTo(0,0); return; }
});

async function srsYukle(uid){
  if(!uid) return;
  try{ SRS.durum=(await API.srsAl(uid))||{}; SRS.yuklendi=true; }catch(e){ SRS.durum={}; }
}
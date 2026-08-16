/* Canlı yarışma.
   Öğretmen bir sınavı canlı başlatır, öğrenciler odaya girer, sorular
   herkeste aynı anda açılır. Puan hızla azalır: erken doğru cevap daha çok puan.

   Gerçek zamanlı bağlantı yerine 2 saniyede bir yoklama yapılır; küçük
   sınıflar için yeterli ve ek altyapı gerektirmez. */

const CNL = {
  kod:null, oda:null, oyuncular:[], benim:null,
  rol:null,               /* "sunucu" | "oyuncu" */
  zaman:null, sonIndex:-1, cevapladi:false, kalan:0, secim:null
};
const CNL_SURE = 20;      /* soru başına saniye */

function cnlKodUret(){
  const A="ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let s="";
  for(let i=0;i<5;i++) s+=A[Math.floor(Math.random()*A.length)];
  return s;
}
function cnlPuan(kalanSaniye){ return 500 + Math.round(500*(kalanSaniye/CNL_SURE)); }

/* ---------------- öğretmen: odayı kur ---------------- */
async function cnlBaslat(sinavKod){
  const sinav=(SX.sinavlar||[]).find(x=>x.kod===sinavKod);
  if(!sinav){ toast("Sınav bulunamadı."); return; }
  const kod=cnlKodUret();
  const oda={ kod, sinavKod, ad:sinav.ad, ders:sinav.ders||"aritmetik",
    sahip:SX.user.uid, sahipAd:SX.user.ad, durum:"bekliyor",
    soruIndex:-1, soruAt:0, sure:CNL_SURE,
    qs:sinav.qs, eksiSag:!!sinav.eksiSag, at:Date.now() };
  try{ await API.canliYaz(oda); }catch(e){ toast("Oda açılamadı."); return; }
  CNL.kod=kod; CNL.oda=oda; CNL.rol="sunucu"; CNL.sonIndex=-1;
  SX.canli=true; ciz(); cnlYoklamaBaslat();
}
async function cnlSonraki(){
  if(!CNL.oda) return;
  const o=CNL.oda;
  if(o.soruIndex+1 >= o.qs.length){ o.durum="bitti"; }
  else { o.soruIndex++; o.durum="basladi"; o.soruAt=Date.now(); }
  await API.canliYaz(o); ciz();
}
async function cnlKapat(){
  if(CNL.rol==="sunucu" && CNL.oda){ CNL.oda.durum="bitti"; try{ await API.canliYaz(CNL.oda); }catch(e){} }
  clearInterval(CNL.zaman); CNL.zaman=null;
  CNL.kod=null; CNL.oda=null; CNL.rol=null; CNL.oyuncular=[]; CNL.benim=null;
  SX.canli=false; ciz();
}

/* ---------------- öğrenci: odaya gir ---------------- */
async function cnlKatil(kod, ad){
  kod=String(kod||"").trim().toUpperCase();
  const oda=await API.canliAl(kod);
  if(!oda){ return "yok"; }
  if(oda.durum==="bitti"){ return "bitti"; }
  CNL.kod=kod; CNL.oda=oda; CNL.rol="oyuncu"; CNL.sonIndex=-1;
  CNL.benim={ id:(SX.user&&SX.user.uid)||("g_"+Math.random().toString(36).slice(2,8)),
              ad:ad||(SX.user&&SX.user.ad)||"Misafir", puan:0, dogru:0, at:Date.now() };
  await API.canliOyuncuYaz(kod, CNL.benim);
  SX.canli=true; ciz(); cnlYoklamaBaslat();
  return "ok";
}
async function cnlCevapla(deger){
  if(CNL.cevapladi || !CNL.oda) return;
  CNL.cevapladi=true; CNL.secim=deger;
  const q=CNL.oda.qs[CNL.oda.soruIndex];
  const dogru=cevapDogruMu(q,deger);
  if(dogru){
    CNL.benim.puan += cnlPuan(CNL.kalan);
    CNL.benim.dogru++;
  }
  ciz();
  try{ await API.canliOyuncuYaz(CNL.kod, CNL.benim); }catch(e){}
}

/* ---------------- yoklama ---------------- */
function cnlYoklamaBaslat(){
  clearInterval(CNL.zaman);
  CNL.zaman=setInterval(async ()=>{
    if(!CNL.kod){ clearInterval(CNL.zaman); return; }
    try{
      if(CNL.rol==="oyuncu"){
        const o=await API.canliAl(CNL.kod);
        if(o){
          const yeniSoru = o.soruIndex!==CNL.sonIndex;
          CNL.oda=o;
          if(yeniSoru){ CNL.sonIndex=o.soruIndex; CNL.cevapladi=false; CNL.secim=null; }
        }
      }
      CNL.oyuncular=await API.canliOyuncular(CNL.kod);
      CNL.oyuncular.sort((a,b)=>(b.puan||0)-(a.puan||0));
      if(CNL.oda && CNL.oda.durum==="basladi"){
        const gecen=(Date.now()-(CNL.oda.soruAt||Date.now()))/1000;
        CNL.kalan=Math.max(0, Math.round((CNL.oda.sure||CNL_SURE)-gecen));
      }
      ciz();
    }catch(e){}
  }, 2000);
}

/* ---------------- görünümler ---------------- */
function cnlEkran(){
  if(!CNL.oda) return `<section class="page"><div class="card pad">Oda kapandı.</div></section>`;
  const o=CNL.oda;
  const q=(o.soruIndex>=0 && o.durum==="basladi") ? o.qs[o.soruIndex] : null;

  const tablo=`<div class="cnl-tablo">
    ${CNL.oyuncular.length? CNL.oyuncular.slice(0,10).map((p,i)=>`
      <div class="cnl-satir ${CNL.benim&&p.id===CNL.benim.id?"ben":""}">
        <span class="cnl-sira">${i+1}</span>
        <span class="cnl-ad">${esc(p.ad)}</span>
        <span class="cnl-puan">${(p.puan||0).toLocaleString("tr-TR")}</span></div>`).join("")
      : `<div class="sx-empty">Henüz kimse katılmadı.</div>`}
  </div>`;

  /* bekleme odası */
  if(o.durum==="bekliyor") return `<section class="page">
    <div class="card pad cnl-lobi">
      <div class="eyebrow">Canlı yarışma</div>
      <h2 style="margin:8px 0 4px">${esc(o.ad)}</h2>
      <p class="muted">${o.qs.length} soru · soru başına ${o.sure||CNL_SURE} saniye</p>
      <div class="cnl-kod">${o.kod}</div>
      <p class="muted" style="font-size:13.5px">Öğrenciler Sınav sekmesinden bu kodu girerek katılır.</p>
      <div class="cnl-sayi">${CNL.oyuncular.length} katılımcı</div>
      ${tablo}
      <div class="sx-row" style="margin-top:16px">
        ${CNL.rol==="sunucu"?`<button class="btn" data-cnl="sonraki">Yarışmayı başlat</button>`:`<span class="muted">Öğretmenin başlatması bekleniyor…</span>`}
        <button class="btn ghost" data-cnl="kapat">${CNL.rol==="sunucu"?"İptal":"Çık"}</button>
      </div>
    </div></section>`;

  /* bitti */
  if(o.durum==="bitti"){
    const kazanan=CNL.oyuncular[0];
    return `<section class="page"><div class="card pad" style="text-align:center">
      <div class="eyebrow">Yarışma bitti</div>
      <h2 style="margin:10px 0 16px">${esc(o.ad)}</h2>
      ${kazanan?`<div class="cnl-kupa">🏆</div>
        <div style="font-family:var(--disp);font-weight:800;font-size:24px">${esc(kazanan.ad)}</div>
        <div class="muted">${(kazanan.puan||0).toLocaleString("tr-TR")} puan</div>`:""}
      ${tablo}
      <button class="btn" data-cnl="kapat" style="margin-top:16px">Kapat</button>
    </div></section>`;
  }

  /* soru ekranı */
  const tip=(q&&q.tip)||"aritmetik";
  return `<section class="page">
    <div class="cnl-ust">
      <span class="cnl-mini">${o.soruIndex+1} / ${o.qs.length}</span>
      <span class="cnl-kalan ${CNL.kalan<=5?"az":""}">${CNL.kalan}</span>
      <span class="cnl-mini">${CNL.oyuncular.length} kişi</span>
    </div>
    <div class="cnl-bar"><i style="width:${Math.round(CNL.kalan/(o.sure||CNL_SURE)*100)}%"></i></div>

    <div class="card pad cnl-soru">
      ${tip==="aritmetik"
        ? `<div class="cnl-sayilar">${q.t.map(v=>`<span>${sayiYaz(v,o.eksiSag)}</span>`).join("")}</div>`
        : `<div class="sx-soru">${esc(q.s||"")}</div>`}
    </div>

    ${CNL.rol==="oyuncu"? (CNL.cevapladi
      ? `<div class="cnl-bekle">Cevabın alındı, diğerlerini bekliyoruz…</div>${tablo}`
      : cnlCevapAlani(q,tip))
      : `<div class="sx-row" style="margin-top:14px">
           <button class="btn" data-cnl="sonraki">${o.soruIndex+1>=o.qs.length?"Yarışmayı bitir":"Sonraki soru"}</button>
           <button class="btn ghost" data-cnl="kapat">Bitir</button></div>
         ${tablo}`}
  </section>`;
}
function cnlCevapAlani(q,tip){
  if(tip==="secmeli"||tip==="dv"){
    const sik = tip==="dv" ? ["Doğru","Yanlış"] : (q.sec||[]);
    return `<div id="sxSecenekler" style="margin-top:12px">${sik.map((x,i)=>
      `<button class="sx-secenek" data-cnl="sik" data-v="${i}">
        <span class="sik-harf">${String.fromCharCode(65+i)}</span>${esc(x)}</button>`).join("")}</div>`;
  }
  return `<div class="sx-answer" style="margin-top:12px">
    <input id="cnlCevap" type="text" inputmode="${tip==="aritmetik"?"numeric":"text"}" autocomplete="off" placeholder="?">
    <button class="btn" data-cnl="gonder">Gönder</button></div>`;
}

/* ---------------- olaylar ---------------- */
document.addEventListener("click", async e=>{
  const b=e.target.closest("[data-cnl]"); if(!b) return;
  const a=b.dataset.cnl;
  if(a==="sonraki") return cnlSonraki();
  if(a==="kapat")   return cnlKapat();
  if(a==="sik")     return cnlCevapla(CNL.oda.qs[CNL.oda.soruIndex].tip==="dv" ? (+b.dataset.v===0) : +b.dataset.v);
  if(a==="gonder"){
    const g=$("cnlCevap"); if(!g) return;
    const q=CNL.oda.qs[CNL.oda.soruIndex];
    const ham=(g.value||"").trim();
    if(!ham) return;
    return cnlCevapla((q.tip||"aritmetik")==="aritmetik" ? Number(ham.replace(/[−–]/g,"-")) : ham);
  }
  if(a==="odaAc"){   /* öğretmen panelinden */
    return cnlBaslat(b.dataset.v);
  }
  if(a==="katil"){
    const kod=($("cnlKod").value||"").trim().toUpperCase();
    const ad=($("cnlAd")?$("cnlAd").value:"").trim() || (SX.user?SX.user.ad:"");
    const n=$("cnlNot");
    if(kod.length<4){ if(n) n.innerHTML=`<span class="sx-warn">Kodu eksiksiz yaz.</span>`; return; }
    if(!ad){ if(n) n.innerHTML=`<span class="sx-warn">Adını yaz.</span>`; return; }
    if(n) n.textContent="Odaya bağlanılıyor…";
    const s=await cnlKatil(kod,ad);
    if(s==="yok" && n) n.innerHTML=`<span class="sx-warn">Bu kodla açık bir yarışma yok.</span>`;
    if(s==="bitti" && n) n.innerHTML=`<span class="sx-warn">Bu yarışma sona ermiş.</span>`;
    return;
  }
});

/* öğrenci giriş kutusu — sınav sekmesinde görünür */
function cnlKatilKutusu(){
  return `<div class="card pad" style="margin-top:14px">
    <span class="tag teal">Canlı</span>
    <h3 style="margin:12px 0 8px">Canlı yarışmaya katıl</h3>
    <p class="muted" style="font-size:14px">Öğretmenin ekranda gösterdiği beş haneli kodu yaz.</p>
    <div class="sx-row" style="margin-top:12px">
      <input class="sx-in" id="cnlKod" maxlength="5" placeholder="ABC12" style="max-width:150px;text-transform:uppercase">
      ${SX.user?"":`<input class="sx-in" id="cnlAd" placeholder="Adın" style="max-width:200px">`}
      <button class="btn" data-cnl="katil">Katıl</button></div>
    <div class="sx-note" id="cnlNot"></div>
  </div>`;
}

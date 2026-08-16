/* Ders araçları.
   Her dersin data.js'teki "arac" alanı buradaki bir aracı seçer:
     abakus  → sanal abaküs (abakus.js)
     kartlar → kelime kartları
     harfler → Arap alfabesi tahtası
     ezber   → ezber takibi
   Yeni araç eklemek için ARACLAR'a bir satır, bir de çizim fonksiyonu yaz. */

const ARACLAR = {
  abakus:  {ad:"Abaküs",         ciz:(id)=>bolumAbakus(id)},
  kartlar: {ad:"Kelime kartları", ciz:(id)=>bolumKartlar(id)},
  harfler: {ad:"Harf tahtası",    ciz:(id)=>bolumHarfler(id)},
  ezber:   {ad:"Ezber takibi",    ciz:(id)=>bolumEzber(id)}
};
function aracTanim(k){ return k ? ARACLAR[k] : null; }
function aracBolumu(id){
  const d=dersBul2(id), a=aracTanim(d&&d.arac);
  return a ? a.ciz(id) : `<div class="card pad muted" style="margin-top:18px">Bu derse araç tanımlanmamış.</div>`;
}


/* ===================== SESLENDİRME =====================
   Cihazda o dilin ses paketi yoksa tarayıcı sessizce hiçbir şey yapar.
   Burada sesi arıyoruz, bulamazsak kullanıcıya sebebini yazıyoruz. */
let SESLER=[];
function sesleriYukle(){
  try{ SESLER = (window.speechSynthesis && speechSynthesis.getVoices()) || []; }catch(e){ SESLER=[]; }
}
if(typeof window!=="undefined" && window.speechSynthesis){
  sesleriYukle();
  try{ speechSynthesis.onvoiceschanged = sesleriYukle; }catch(e){}
}
function sesBul(dil){
  if(!SESLER.length) sesleriYukle();
  const k=String(dil||"").slice(0,2).toLowerCase();
  return SESLER.find(v=>v.lang && v.lang.toLowerCase().startsWith(k)) || null;
}
function sesDurumu(dil){
  if(typeof window==="undefined" || !window.speechSynthesis) return "yok-tarayici";
  return sesBul(dil) ? "var" : "yok-dil";
}
function sesle(metin, dil, notId){
  const not = notId ? $(notId) : null;
  const yaz = (m,tur)=>{ if(not) not.innerHTML = `<span class="${tur||"sx-warn"}">${m}</span>`; };
  if(typeof window==="undefined" || !window.speechSynthesis){
    yaz("Bu tarayıcı sesli okumayı desteklemiyor."); return false;
  }
  const v=sesBul(dil);
  try{
    const u=new SpeechSynthesisUtterance(String(metin));
    u.lang = dil; if(v) u.voice=v;
    u.rate = .85; u.pitch = 1;
    u.onerror = ()=> yaz("Ses çalınamadı, tekrar dene.");
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
    try{ speechSynthesis.resume(); }catch(e){}
  }catch(e){ yaz("Ses çalınamadı."); return false; }
  if(!v){
    yaz(dil.startsWith("ar")
      ? "Cihazında Arapça ses paketi kurulu değil. Android: Ayarlar → Sistem → Diller → Metin okuma → Google konuşma sentezleyici → Arapça'yı indir. iPhone: Ayarlar → Erişilebilirlik → Konuşulan İçerik → Sesler → Arapça."
      : "Cihazında bu dilin ses paketi kurulu değil.");
    return false;
  }
  yaz("", "sx-good");
  return true;
}

/* ===================== KELİME KARTLARI ===================== */
const KRT = { i:0, acik:false, karisik:false, bilmiyorum:[] };

function kartListesi(id){
  let l=(DATA.kartlar||[]).filter(k=>k.ders===id);
  if(KRT.karisik && l.length>1){
    l=l.slice();
    for(let i=l.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [l[i],l[j]]=[l[j],l[i]]; }
  }
  return l;
}
function bolumKartlar(id){
  const l=kartListesi(id);
  if(!l.length) return `<div class="card pad muted" style="margin-top:18px">Bu derse kelime kartı eklenmemiş. Yönetim → Kelime kartları bölümünden ekleyebilirsin.</div>`;
  if(KRT.i>=l.length) KRT.i=0;
  const k=l[KRT.i];
  return `<div class="card pad" style="margin-top:18px">
    <h3 style="margin-bottom:4px">Kelime kartları</h3>
    <p class="muted" style="font-size:13.5px;margin-bottom:14px">Kartı çevirmek için üzerine dokun. Bilemediklerini işaretle, sonunda onları tekrar çalış.</p>

    <div class="krt-sayac">${KRT.i+1} / ${l.length}${KRT.bilmiyorum.length?` · ${KRT.bilmiyorum.length} zor kelime`:""}</div>

    <button class="krt-kart ${KRT.acik?"acik":""}" data-krt="cevir">
      <div class="krt-yuz krt-on">
        <span class="krt-etiket">${esc(ceviri(k.ipucu)||"")}</span>
        <b>${esc(ceviri(k.on))}</b>
        <span class="krt-ipucu">dokun ve çevir</span>
      </div>
      <div class="krt-yuz krt-arka">
        <b>${esc(ceviri(k.arka))}</b>
        <span class="krt-ipucu">${esc(ceviri(k.on))}</span>
      </div>
    </button>

    <div class="sx-row" style="justify-content:center;margin-top:14px">
      <button class="btn ghost sm" data-krt="geri">← Önceki</button>
      <button class="btn ghost sm" data-krt="seslendir">🔊 Oku</button>
      <button class="btn ghost sm" data-krt="zor">Bilemedim</button>
      <button class="btn sm" data-krt="ileri">Sonraki →</button>
    </div>
    <div class="sx-note" id="krtSesNot" style="text-align:center"></div>
    <div class="sx-row" style="justify-content:center;margin-top:8px">
      <button class="chip" data-krt="karisik" aria-pressed="${KRT.karisik}">Karışık sıra</button>
      ${KRT.bilmiyorum.length?`<button class="chip" data-krt="zorlari">Zor kelimeleri çalış</button>`:""}
    </div>
  </div>`;
}
function kartSeslendir(metin,dil,notId){ return sesle(metin, dil||"en-US", notId); }

/* ===================== ARAP HARF TAHTASI ===================== */
const HRF = { secili:null };
const HARFLER = [
  {h:"ا", ad:"elif", arAd:"أَلِف", b:"ـا", o:"ـا", s:"ا"},   {h:"ب", ad:"be", arAd:"بَاء", b:"بـ", o:"ـبـ", s:"ـب"},
  {h:"ت", ad:"te", arAd:"تَاء",    b:"تـ", o:"ـتـ", s:"ـت"}, {h:"ث", ad:"se", arAd:"ثَاء",   b:"ثـ", o:"ـثـ", s:"ـث"},
  {h:"ج", ad:"cim", arAd:"جِيم",   b:"جـ", o:"ـجـ", s:"ـج"}, {h:"ح", ad:"ha", arAd:"حَاء",   b:"حـ", o:"ـحـ", s:"ـح"},
  {h:"خ", ad:"hı", arAd:"خَاء",    b:"خـ", o:"ـخـ", s:"ـخ"}, {h:"د", ad:"dal", arAd:"دَال",  b:"ـد", o:"ـد", s:"د"},
  {h:"ذ", ad:"zel", arAd:"ذَال",   b:"ـذ", o:"ـذ", s:"ذ"},   {h:"ر", ad:"ra", arAd:"رَاء",   b:"ـر", o:"ـر", s:"ر"},
  {h:"ز", ad:"ze", arAd:"زَاي",    b:"ـز", o:"ـز", s:"ز"},   {h:"س", ad:"sin", arAd:"سِين",  b:"سـ", o:"ـسـ", s:"ـس"},
  {h:"ش", ad:"şın", arAd:"شِين",   b:"شـ", o:"ـشـ", s:"ـش"}, {h:"ص", ad:"sad", arAd:"صَاد",  b:"صـ", o:"ـصـ", s:"ـص"},
  {h:"ض", ad:"dad", arAd:"ضَاد",   b:"ضـ", o:"ـضـ", s:"ـض"}, {h:"ط", ad:"tı", arAd:"طَاء",   b:"طـ", o:"ـطـ", s:"ـط"},
  {h:"ظ", ad:"zı", arAd:"ظَاء",    b:"ظـ", o:"ـظـ", s:"ـظ"}, {h:"ع", ad:"ayn", arAd:"عَين",  b:"عـ", o:"ـعـ", s:"ـع"},
  {h:"غ", ad:"gayn", arAd:"غَين",  b:"غـ", o:"ـغـ", s:"ـغ"}, {h:"ف", ad:"fe", arAd:"فَاء",   b:"فـ", o:"ـفـ", s:"ـف"},
  {h:"ق", ad:"kaf", arAd:"قَاف",   b:"قـ", o:"ـقـ", s:"ـق"}, {h:"ك", ad:"kef", arAd:"كَاف",  b:"كـ", o:"ـكـ", s:"ـك"},
  {h:"ل", ad:"lam", arAd:"لَام",   b:"لـ", o:"ـلـ", s:"ـل"}, {h:"م", ad:"mim", arAd:"مِيم",  b:"مـ", o:"ـمـ", s:"ـم"},
  {h:"ن", ad:"nun", arAd:"نُون",   b:"نـ", o:"ـنـ", s:"ـن"}, {h:"ه", ad:"he", arAd:"هَاء",   b:"هـ", o:"ـهـ", s:"ـه"},
  {h:"و", ad:"vav", arAd:"وَاو",   b:"ـو", o:"ـو", s:"و"},   {h:"ي", ad:"ye", arAd:"يَاء",   b:"يـ", o:"ـيـ", s:"ـي"}
];
const HAREKE = [
  {i:"َ", ad:"üstün / fetha", ses:"a"},
  {i:"ِ", ad:"esre / kesra",  ses:"i"},
  {i:"ُ", ad:"ötre / damma",  ses:"u"},
  {i:"ْ", ad:"cezm / sükûn",  ses:"—"}
];
function bolumHarfler(id){
  const s=HRF.secili!=null ? HARFLER[HRF.secili] : null;
  return `<div class="card pad" style="margin-top:18px">
    <h3 style="margin-bottom:4px">Harf tahtası</h3>
    <p class="muted" style="font-size:13.5px;margin-bottom:14px">Harfe dokun: adını, sesini ve kelimenin başında, ortasında, sonunda nasıl yazıldığını gösterir.</p>
    <div class="hrf-izgara">
      ${HARFLER.map((x,i)=>`<button class="hrf ${HRF.secili===i?"secili":""}" data-hrf="${i}">
        <span class="hrf-harf">${x.h}</span><span class="hrf-ad">${esc(x.ad)}</span></button>`).join("")}
    </div>
    ${s?`<div class="hrf-detay">
      <div class="hrf-buyuk">${s.h}</div>
      <div style="flex:1">
        <b style="font-family:var(--disp);font-size:18px">${esc(s.ad)}</b>
        <div class="hrf-bicim">
          <div><span>başta</span><b>${s.b}</b></div>
          <div><span>ortada</span><b>${s.o}</b></div>
          <div><span>sonda</span><b>${s.s}</b></div>
        </div>
        <div class="sx-row" style="margin-top:12px">
          <button class="btn ghost sm" data-hrf-ses="${esc(s.arAd||s.h)}">🔊 Sesini dinle</button>
          <button class="btn ghost sm" data-hrf-ses="${esc((s.h)+"َ "+(s.h)+"ِ "+(s.h)+"ُ")}">🔊 Harekeli oku</button>
        </div>
        <div class="sx-note" id="hrfSesNot">${sesDurumu("ar")==="var"?"":"Cihazında Arapça ses paketi kurulu değilse ses çıkmaz — düğmeye basınca ne yapman gerektiği burada yazar."}</div>
      </div></div>`:""}
    <div class="sx-label" style="margin-top:20px">Harekeler</div>
    <div class="hrf-hareke">
      ${HAREKE.map(h=>`<div class="hrf-hrk"><b>ب${h.i}</b><span>${esc(h.ad)}</span></div>`).join("")}
    </div>
  </div>`;
}

/* ===================== EZBER TAKİBİ ===================== */
const EZB = { durum:{}, yuklendi:false };
const SURELER = [
  {n:78,ad:"En-Nebe",ar:"النبأ",ayet:40},{n:79,ad:"En-Naziat",ar:"النازعات",ayet:46},
  {n:80,ad:"Abese",ar:"عبس",ayet:42},   {n:81,ad:"Et-Tekvir",ar:"التكوير",ayet:29},
  {n:82,ad:"El-İnfitar",ar:"الانفطار",ayet:19},{n:83,ad:"El-Mutaffifin",ar:"المطففين",ayet:36},
  {n:84,ad:"El-İnşikak",ar:"الانشقاق",ayet:25},{n:85,ad:"El-Buruc",ar:"البروج",ayet:22},
  {n:86,ad:"Et-Tarık",ar:"الطارق",ayet:17},{n:87,ad:"El-A'la",ar:"الأعلى",ayet:19},
  {n:88,ad:"El-Gaşiye",ar:"الغاشية",ayet:26},{n:89,ad:"El-Fecr",ar:"الفجر",ayet:30},
  {n:90,ad:"El-Beled",ar:"البلد",ayet:20},{n:91,ad:"Eş-Şems",ar:"الشمس",ayet:15},
  {n:92,ad:"El-Leyl",ar:"الليل",ayet:21},{n:93,ad:"Ed-Duha",ar:"الضحى",ayet:11},
  {n:94,ad:"El-İnşirah",ar:"الشرح",ayet:8},{n:95,ad:"Et-Tin",ar:"التين",ayet:8},
  {n:96,ad:"El-Alak",ar:"العلق",ayet:19},{n:97,ad:"El-Kadr",ar:"القدر",ayet:5},
  {n:98,ad:"El-Beyyine",ar:"البينة",ayet:8},{n:99,ad:"Ez-Zilzal",ar:"الزلزلة",ayet:8},
  {n:100,ad:"El-Adiyat",ar:"العاديات",ayet:11},{n:101,ad:"El-Karia",ar:"القارعة",ayet:11},
  {n:102,ad:"Et-Tekasür",ar:"التكاثر",ayet:8},{n:103,ad:"El-Asr",ar:"العصر",ayet:3},
  {n:104,ad:"El-Hümeze",ar:"الهمزة",ayet:9},{n:105,ad:"El-Fil",ar:"الفيل",ayet:5},
  {n:106,ad:"Kureyş",ar:"قريش",ayet:4},   {n:107,ad:"El-Maun",ar:"الماعون",ayet:7},
  {n:108,ad:"El-Kevser",ar:"الكوثر",ayet:3},{n:109,ad:"El-Kafirun",ar:"الكافرون",ayet:6},
  {n:110,ad:"En-Nasr",ar:"النصر",ayet:3}, {n:111,ad:"El-Mesed",ar:"المسد",ayet:5},
  {n:112,ad:"El-İhlas",ar:"الإخلاص",ayet:4},{n:113,ad:"El-Felak",ar:"الفلق",ayet:5},
  {n:114,ad:"En-Nas",ar:"الناس",ayet:6}
];
const EZB_DURUM = {yok:"başlanmadı", calisiyor:"çalışıyor", bitti:"ezberledi"};

function bolumEzber(id){
  if(!girisliMi()) return `<div class="card pad" style="margin-top:18px">
    <h3 style="margin-bottom:6px">Ezber takibi</h3>
    <p class="muted">Ezber ilerlemeni kaydedebilmek için giriş yapman gerekiyor.</p>
    <button class="btn" data-sx="girisIste" style="margin-top:12px">Giriş yap</button></div>`;
  const d=EZB.durum||{};
  const bitti=SURELER.filter(s=>d[s.n]==="bitti");
  const calisan=SURELER.filter(s=>d[s.n]==="calisiyor");
  const ayet=bitti.reduce((t,s)=>t+s.ayet,0);
  const toplamAyet=SURELER.reduce((t,s)=>t+s.ayet,0);
  const yuzde=Math.round(ayet/toplamAyet*100);
  return `<div class="card pad" style="margin-top:18px">
    <h3 style="margin-bottom:4px">Ezber takibi</h3>
    <p class="muted" style="font-size:13.5px;margin-bottom:14px">Amme cüzü. Sureye dokundukça durumu değişir: başlanmadı → çalışıyor → ezberledi.</p>
    <div class="sx-stats" style="grid-template-columns:repeat(4,1fr)">
      <div class="sx-stat"><b>${bitti.length}</b><span>sure</span></div>
      <div class="sx-stat"><b>${calisan.length}</b><span>çalışılıyor</span></div>
      <div class="sx-stat"><b>${ayet}</b><span>ayet</span></div>
      <div class="sx-stat"><b>${yuzde}%</b><span>cüz</span></div>
    </div>
    <div class="sx-bar" style="height:8px;margin:4px 0 16px"><i style="width:${yuzde}%"></i></div>
    <div class="ezb-izgara">
      ${SURELER.map(s=>{
        const du=d[s.n]||"yok";
        return `<button class="ezb ${du}" data-ezb="${s.n}" title="${esc(EZB_DURUM[du])}">
          <span class="ezb-no">${s.n}</span>
          <span class="ezb-ar">${s.ar}</span>
          <span class="ezb-ad">${esc(s.ad)}</span>
          <span class="ezb-ayet">${s.ayet} ayet</span></button>`;
      }).join("")}
    </div>
    <div class="sx-note" id="ezbNot">Değişiklikler kendi hesabına kaydedilir; öğretmenin ve velin de görebilir.</div>
  </div>`;
}

/* --- araç olayları --- */
document.addEventListener("click", async e=>{
  /* kelime kartları */
  const k=e.target.closest("[data-krt]");
  if(k){
    const l=kartListesi(SITE.ders), kart=l[KRT.i];
    const eylem=k.dataset.krt;
    if(eylem==="cevir")  KRT.acik=!KRT.acik;
    if(eylem==="ileri"){ KRT.i=(KRT.i+1)%l.length; KRT.acik=false; }
    if(eylem==="geri"){  KRT.i=(KRT.i-1+l.length)%l.length; KRT.acik=false; }
    if(eylem==="karisik"){ KRT.karisik=!KRT.karisik; KRT.i=0; KRT.acik=false; }
    if(eylem==="seslendir" && kart){ sesle(ceviri(kart.on),"en-US","krtSesNot"); return; }
    if(eylem==="zor" && kart){
      const ad=ceviri(kart.on);
      if(!KRT.bilmiyorum.includes(ad)) KRT.bilmiyorum.push(ad);
      KRT.i=(KRT.i+1)%l.length; KRT.acik=false;
    }
    if(eylem==="zorlari"){ KRT.karisik=false; KRT.i=0; KRT.acik=false;
      toast(KRT.bilmiyorum.length+" zor kelime listenin başına alındı."); }
    ciz(); return;
  }

  /* harf tahtası */
  const h=e.target.closest("[data-hrf]");
  if(h){ HRF.secili=+h.dataset.hrf; ciz(); return; }
  const hs=e.target.closest("[data-hrf-ses]");
  if(hs){ sesle(hs.dataset.hrfSes,"ar-SA","hrfSesNot"); return; }

  /* ezber */
  const z=e.target.closest("[data-ezb]");
  if(z){
    const no=+z.dataset.ezb;
    const sira={yok:"calisiyor", calisiyor:"bitti", bitti:"yok"};
    EZB.durum[no]=sira[EZB.durum[no]||"yok"];
    ciz();
    try{ await API.ezberYaz(SX.user.uid, EZB.durum); }
    catch(err){ const n=$("ezbNot"); if(n) n.innerHTML=`<span class="sx-warn">Kaydedilemedi, bağlantını kontrol et.</span>`; }
    return;
  }
});
async function ezberYukle(uid){
  if(!uid) return;
  try{ EZB.durum=(await API.ezberAl(uid))||{}; EZB.yuklendi=true; }catch(e){ EZB.durum={}; }
}
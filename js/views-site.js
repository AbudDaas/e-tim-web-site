/* Site sekmelerinin görünümleri. */

/* ---------------- görünümler ---------------- */

/* --- giriş kontrolü --- */
function girisliMi(){ return !!(SX.user && SX.user.durum==="onayli"); }
function kilitliEkran(baslik, aciklama, liste){
  return `<section class="page">
    <div class="eyebrow">Üyelere özel</div>
    <h2 style="margin:10px 0 8px">${esc(baslik)}</h2>
    <p class="muted" style="max-width:52ch">${esc(aciklama)}</p>
    <div class="card pad kilit" style="max-width:560px;margin-top:22px">
      <div class="kilit-ikon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round">
          <rect x="4" y="10.5" width="16" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>
      </div>
      <h3 style="margin-bottom:8px">Bu bölüm üyelere açık</h3>
      <p class="muted" style="font-size:14.5px">Ücretsiz bir öğrenci hesabı aç, tüm ${esc(baslik.toLowerCase())} arşivine ve sınav geçmişine eriş.</p>
      <ul class="kilit-liste">${(liste||[]).map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
      <div class="sx-row" style="margin-top:18px">
        <button class="btn" data-sx="girisIste">Giriş yap</button>
        <button class="btn ghost" data-sx="kayitIste">Ücretsiz kayıt ol</button>
      </div>
    </div></section>`;
}

function vAna(){
  const a=DATA.ana;
  return `
  <section class="page">
    <div class="hero">
      <div class="card hero-main">
        <div class="eyebrow">${esc(ceviri(a.etiket))}</div>
        <h1>${ceviri(a.baslik)}</h1>
        <p class="lede">${esc(ceviri(a.metin))}</p>
        <div class="acts">
          <a class="btn" href="https://wa.me/${String(ceviri(DATA.hakkimizda.iletisim.telefon)).replace(/[^0-9]/g,"")}?text=${encodeURIComponent("Merhaba, deneme dersi için bilgi almak istiyorum.")}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> Deneme dersi al</a>
          <a class="btn ghost" href="#/sinav"><i class="fa-solid fa-file-pen"></i> Sınava gir</a>
        </div>
      </div>
      <div class="card abacus">
        ${[7,5,6,4,7,5].map((n,r)=>`<div class="wire">${Array.from({length:n},(_,i)=>
          `<i style="animation-delay:${(r*.18+i*.06).toFixed(2)}s"></i>`).join("")}</div>`).join("")}
        <div class="eyebrow" style="margin-top:10px">${esc(ceviri(a.duyuru))}</div>
      </div>
    </div>

    <h2 style="margin:38px 0 6px">Dersler</h2>
    <p class="muted" style="margin-bottom:18px">Her dersin kendi kayıtlı dersleri, kesitleri, yarışmaları ve sınavları var.</p>
    <div class="grid g2">
      ${(DATA.dersler||[]).map(x=>{
        const c=dersIcerik(x.id);
        return `<button class="ders-kart" data-ders="${esc(x.id)}" style="--dr:${x.renk||"#4338CA"}">
          <span class="ders-ico">${x.ico||"📘"}</span>
          <b>${esc(ceviri(x.ad))}</b>
          <span class="ders-ozet">${esc(ceviri(x.ozet)||"")}</span>
          <span class="ders-sayac">${c.kayit.length} kayıtlı ders · ${c.kesit.length} kesit · ${c.kurs.length} seviye</span>
        </button>`;
      }).join("")}
    </div>

    <div class="grid g4" style="margin-top:26px">
      ${a.istatistik.map(s=>`<div class="card stat"><b>${esc(ceviri(s.sayi))}</b><span>${esc(ceviri(s.ad))}</span></div>`).join("")}
    </div>
  </section>`;
}
function kartOzet(etiket,baslik,alt,link,cta){
  return `<div class="card pad">
    <div class="eyebrow">${esc(etiket)}</div>
    <h3 style="margin:10px 0 6px">${esc(baslik)}</h3>
    <p class="muted" style="font-size:14px">${esc(alt)}</p>
    <a class="btn ghost sm" href="${link}" style="margin-top:14px">${esc(cta)}</a></div>`;
}

function vKesitler(){
  if(!girisliMi()) return kilitliEkran("Ders kesitleri",
    "Derslerden alınan kısa video parçaları. Çocuğunun hangi tekniği öğrendiğini görmenin en kolay yolu.",
    ["Tüm seviyelerin ders kesitleri","Yeni kesitler eklendikçe erişim","Sınav geçmişi ve ödev takibi"]);
  const k=DATA.kesitler;
  const liste=k.liste
    .filter(x=> !SITE.kesitDers || x.ders===SITE.kesitDers)
    .filter(x=> filtre===0 || ceviri(x.kategori)===ceviri(k.kategoriler[filtre]));
  return `<section class="page">
    <div class="eyebrow">Arşiv</div>
    <h2 style="margin:10px 0 8px">Canlı ders kesitleri</h2>
    <p class="muted" style="max-width:52ch">Derslerden kısa parçalar. Çocuğunuzun hangi tekniği öğrendiğini görmek için en kolay yol.</p>
    <div class="chips" style="margin-bottom:0">
      <button class="chip" data-kders="" aria-pressed="${!SITE.kesitDers}">Tüm dersler</button>
      ${(DATA.dersler||[]).map(x=>`<button class="chip" data-kders="${esc(x.id)}" aria-pressed="${SITE.kesitDers===x.id}">${x.ico} ${esc(ceviri(x.ad))}</button>`).join("")}
    </div>
    <div class="chips">${k.kategoriler.map((c,i)=>
      `<button class="chip" data-filtre="${i}" aria-pressed="${i===filtre}">${esc(ceviri(c))}</button>`).join("")}</div>
    <div class="grid g3">${liste.map((v,i)=>`
      <button class="clip" data-video="${k.liste.indexOf(v)}">
        <div class="thumb">
          ${(()=>{ const kapak=ceviri(v.kapak);
             if(kapak) return `<img loading="lazy" src="${esc(kapak)}" alt="${esc(ceviri(v.baslik))}">`;
             if(v.yt)  return `<img loading="lazy" src="https://img.youtube.com/vi/${esc(v.yt)}/hqdefault.jpg" alt="">`;
             return ""; })()}
          <span class="play"></span><span class="dur">${esc(ceviri(v.sure))}</span>
        </div>
        <div class="body">
          <span class="tag">${esc(ceviri(v.kategori))}</span> ${dersRozeti(v.ders)}
          <h3 style="margin:10px 0 5px">${esc(ceviri(v.baslik))}</h3>
          <p class="muted" style="font-size:13.5px">${esc(ceviri(v.ozet))}</p>
          <p class="muted" style="font-size:12.5px;margin-top:8px;font-family:var(--mono)">${esc(ceviri(v.ders))}</p>
        </div>
      </button>`).join("")||`<div class="card pad muted">Bu başlıkta henüz kesit yok.</div>`}</div>
  </section>`;
}

function vPodcast(){
  if(!girisliMi()) return kilitliEkran("Podcast bölümleri",
    "Velilerle ve eğitmenlerle yaptığımız sohbetler. Arabada, mutfakta dinlenecek uzunlukta.",
    ["Bütün bölümler ve yeni yayınlar","İndirilebilir ses dosyaları","Sınav geçmişi ve ödev takibi"]);
  const p=DATA.podcast;
  return `<section class="page">
    <div class="eyebrow">Dinle</div>
    <h2 style="margin:10px 0 8px">Podcastler</h2>
    <p class="muted" style="max-width:52ch">${esc(ceviri(p.aciklama))}</p>
    <div class="card" style="margin-top:22px">
      ${p.bolumler.map((b,i)=>`
        <div class="ep">
          <span class="n">#${b.no}</span>
          <div class="grow">
            <h3>${esc(ceviri(b.baslik))}</h3>
            <div class="sub">${esc(ceviri(b.ozet))}</div>
            <div class="sub" style="font-family:var(--mono);font-size:12px;margin-top:5px">${esc(ceviri(b.tarih))} · ${esc(ceviri(b.sure))}</div>
          </div>
          <button class="pbtn" data-ep="${i}" aria-label="çal">▶</button>
        </div>`).join("")}
    </div>
  </section>`;
}

function vYarisma(){
  const y=DATA.yarismalar;
  if(!y.aktif) return `<section class="page"><div class="eyebrow">Takvim</div>
    <h2 style="margin:10px 0 12px">Yarışmalar</h2>
    <div class="card pad"><p class="muted">Şu an planlanmış bir yarışma yok. Yeni tarih açıklandığında burada duyuracağız.</p>
    <a class="btn ghost sm" href="#/hakkinda" style="margin-top:14px">Haber almak için yaz</a></div></section>`;
  return `<section class="page">
    <div class="eyebrow">Takvim</div>
    <h2 style="margin:10px 0 22px">Yarışmalar</h2>
    <div class="card contest">
      <span class="tag teal">Kayıtlar açık</span>
      <h3 style="font-size:26px;margin:12px 0 6px">${esc(ceviri(y.aktif.ad))}</h3>
      ${dersRozeti(y.aktif.ders)}
      <p class="muted">${esc(ceviri(y.aktif.yer))} · ${esc(ceviri(y.aktif.katilimci))}</p>
      <div class="count" id="sayac"></div>
      <p style="max-width:56ch">${esc(ceviri(y.aktif.metin))}</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:20px">
        <a class="btn" href="${esc(DATA.marka.sinavLinki)}${y.aktif.kod?"#k="+esc(y.aktif.kod):""}">${y.aktif.kod?"Yarışma sınavına gir":"Kayıt için yaz"}</a>
        <a class="btn ghost" href="#/hakkinda">Sorularım var</a>
      </div>
    </div>
    <h3 style="margin:36px 0 14px">Geçmiş yarışmalar</h3>
    <div class="card">
      ${y.gecmis.map(g=>`<div class="past">
        <span class="date">${esc(ceviri(g.tarih))}</span>
        <div class="grow" style="flex:1"><b style="font-family:var(--disp)">${esc(ceviri(g.ad))}</b>
        <div class="muted" style="font-size:13.5px">${esc(ceviri(g.not))}</div></div></div>`).join("")}
    </div>
  </section>`;
}

function vGurur(){
  const g=DATA.gurur, [a,b,c]=g.ilkUc;
  return `<section class="page">
    <div class="eyebrow">${esc(ceviri(g.donem))}</div>
    <h2 style="margin:10px 0 8px">Gurur tablomuz</h2>
    ${dersRozeti(g.ders)}
    <p class="muted" style="max-width:52ch">${esc(ceviri(g.metin))}</p>
    ${g.ilkUc.length?`<div class="podium">${pod(b,"two","2")}${pod(a,"one","1")}${pod(c,"three","3")}</div>`
      :`<div class="card pad" style="margin:22px 0"><p class="muted">Bu dönemin listesi henüz açıklanmadı. Ayın sonunda burada olacak.</p></div>`}
    <div class="card">
      ${g.liste.map((x,i)=>`<div class="trow">
        <span class="rk">${i+4}</span>
        <span class="nm">${esc(ceviri(x.ad))}</span>
        <span class="cl">${esc(ceviri(x.sinif))}</span>
        <span class="pt">${esc(ceviri(x.puan))}</span></div>`).join("")}
    </div>
    <p class="muted" style="font-size:13px;margin-top:14px">Listede adı geçmeyen çocuklar geride kalmış değil — bu tablo ayın en yüksek ortalamalarını gösteriyor, herkesin kendi ilerlemesi karnesinde.</p>
  </section>`;
}
function pod(x,cls,no){
  if(!x) return "";
  return `<div class="card pod ${cls}"><div class="medal">${no}</div>
    <b>${esc(ceviri(x.ad))}</b><div class="sc">${esc(ceviri(x.puan))}</div><div class="cls">${esc(ceviri(x.sinif))}</div></div>`;
}

function vHakkinda(){
  const h=DATA.hakkimizda, i=h.iletisim;
  return `<section class="page">
    <div class="eyebrow">Hakkımızda</div>
    <h2 style="margin:10px 0 10px">${esc(ceviri(h.baslik))}</h2>
    <p class="muted" style="max-width:58ch;font-size:16px">${esc(ceviri(h.metin))}</p>
    <div class="grid g3" style="margin-top:26px">
      ${h.degerler.map(d=>`<div class="card value">
        <div class="ico">${d.ico}</div><h3>${esc(ceviri(d.ad))}</h3>
        <p class="muted" style="font-size:14px;margin-top:7px">${esc(ceviri(d.not))}</p></div>`).join("")}
    </div>
    <h3 style="margin:36px 0 14px">Ekip</h3>
    <div class="grid g3">
      ${h.ekip.map(p=>`<div class="card person">
        <div class="av">${esc(String(ceviri(p.ad)).split(" ").map(w=>w[0]).join("").slice(0,2))}</div>
        <div><b style="font-family:var(--disp)">${esc(ceviri(p.ad))}</b>
        <div class="muted" style="font-size:13.5px">${esc(ceviri(p.rol))}</div></div></div>`).join("")}
    </div>
    <div class="grid g2" style="margin-top:26px">
      <div class="card pad">
        <div class="eyebrow">İletişim</div>
        <p style="margin-top:12px;font-size:16px">${esc(ceviri(i.adres))}</p>
        <p style="margin-top:6px"><a href="tel:${esc(i.telefon.replace(/\s/g,""))}">${esc(i.telefon)}</a></p>
        <p style="margin-top:4px"><a href="mailto:${esc(i.mail)}">${esc(i.mail)}</a></p>
        <a class="btn sm" style="margin-top:16px" href="https://wa.me/${esc(i.telefon.replace(/[^0-9]/g,""))}">WhatsApp'tan yaz</a>
      </div>
      <div class="card">
        ${h.sss.map(f=>`<details class="faq"><summary>${esc(ceviri(f.s))}</summary>
          <div class="ans">${esc(ceviri(f.c))}</div></details>`).join("")}
      </div>
    </div>
  </section>`;
}


/* ===================================================================
   DERS MERKEZLİ YAPI
   Menüde her ders bir sekme. Ders sayfası kendi alt sekmelerine sahip:
   hakkında · kayıtlı dersler · kesitler · podcast · yarışma · gurur · sınav
   =================================================================== */
function dersListe(){ return DATA.dersler||[]; }
function dersBul2(id){ return dersListe().find(x=>x.id===id)||null; }
function dersRenk(id){ const d=dersBul2(id); return (d&&d.renk)||"#4338CA"; }
function dersAd(id){ const d=dersBul2(id); return d?ceviri(d.ad):""; }
function dersIco(id){ const d=dersBul2(id); return d?d.ico:"📘"; }
function dersRozeti(id){
  if(!id) return "";
  return `<span class="ders-rozet" style="--dr:${dersRenk(id)}">${dersIco(id)} ${esc(dersAd(id))}</span>`;
}
function dersIcerik(id){
  return {
    kayit:  (DATA.kayitliDersler||[]).filter(k=>k.ders===id).sort((a,b)=>(a.sira||0)-(b.sira||0)),
    kesit:  ((DATA.kesitler&&DATA.kesitler.liste)||[]).filter(k=>k.ders===id),
    bolum:  ((DATA.podcast&&DATA.podcast.bolumler)||[]).filter(k=>!k.ders||k.ders===id),
    kurs:   (DATA.kurslar||[]).filter(k=>k.ders===id),
    yarisma:(DATA.yarismalar&&DATA.yarismalar.aktif&&DATA.yarismalar.aktif.ders===id)?DATA.yarismalar.aktif:null,
    gecmis: ((DATA.yarismalar&&DATA.yarismalar.gecmis)||[]).filter(k=>!k.ders||k.ders===id),
    gurur:  (DATA.gurur&&(DATA.gurur.ders===id))?DATA.gurur:null
  };
}
/* o derste bekleyen ödev var mı — menüde nokta için */
function dersOdevVar(id){
  return (SX.ogrOdev||[]).some(x=>x.durum!=="tamamlandi" && (x.ders===id));
}
function dersSekmeleri(id){
  const c=dersIcerik(id), d=dersBul2(id);
  const arac=aracTanim(d&&d.arac);
  return [
    {k:"ogren",   ad:"Öğren",       ico:"graduation-cap", sayi:c.kayit.length},
    {k:"alistir", ad:arac?arac.ad:"Alıştır", ico:"layer-group"},
    {k:"izle",    ad:"İzle ve dinle", ico:"play", sayi:c.kesit.length+c.bolum.length},
    {k:"yaris",   ad:"Yarış",       ico:"trophy", sayi:(c.yarisma?1:0)+c.gecmis.length}
  ];
}

function vDers(){
  const id=SITE.ders || (dersListe()[0]||{}).id;
  const d=dersBul2(id);
  if(!d) return `<section class="page"><div class="card pad">Ders bulunamadı.</div></section>`;
  const sekme=SITE.dersSekme||"ogren";
  const govde={
    ogren:   ()=>bolumHakkinda(id)+bolumMufredat(id)+bolumKayitli(id),
    alistir: ()=>aracBolumu(id)+bolumAlistirma(id),
    izle:    ()=>bolumKesit(id)+bolumPodcast(id),
    yaris:   ()=>bolumYarisma(id)+bolumGurur(id)
  }[sekme] || (()=>bolumHakkinda(id)+bolumMufredat(id)+bolumKayitli(id));

  return `<section class="page">
    <div class="ders-baslik" style="--dr:${d.renk||"#4338CA"}">
      <span class="ders-ico">${d.ico||"📘"}</span>
      <div style="flex:1"><h2 style="margin:0">${esc(ceviri(d.ad))}</h2>
        <p class="muted" style="margin-top:4px">${esc(ceviri(d.ozet)||"")}</p></div>
    </div>
    <div class="ders-sekme" style="--dr:${d.renk||"#4338CA"}">
      ${dersSekmeleri(id).map(s=>`<button data-dsekme="${s.k}" aria-pressed="${sekme===s.k}">
        ${s.ico?`<i class="${s.ico==="youtube"?"fa-brands":"fa-solid"} fa-${s.ico}"></i>`:""}${esc(s.ad)}${s.sayi?`<span class="sekme-sayi">${s.sayi}</span>`:""}${s.nokta?`<span class="sekme-nokta"></span>`:""}</button>`).join("")}
    </div>
    ${govde()}
  </section>`;
}

/* ---- ders hakkında ---- */
function bolumHakkinda(id){
  const c=dersIcerik(id), d=dersBul2(id), i=DATA.hakkimizda.iletisim;
  const tel=String(ceviri(i.telefon)||"").replace(/[^0-9]/g,"");
  return `
  <div class="grid g2" style="margin-top:18px">
    <div class="card pad">
      <div class="eyebrow">Ders hakkında</div>
      <h3 style="margin:10px 0 8px">${esc(ceviri(d.ad))} — ${t("program2")}</h3>
      <p class="muted" style="font-size:15px;line-height:1.6">${esc(ceviri(d.aciklama)||ceviri(d.ozet)||"")}</p>
      <div class="sx-row" style="margin-top:18px">
        <a class="btn" href="https://wa.me/${tel}?text=${encodeURIComponent(ceviri(d.ad)+" dersi için bilgi almak istiyorum.")}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> Deneme dersi al</a>
        <button class="btn ghost" data-dsekme="kayit">Kayıtlı dersleri gör</button>
      </div>
    </div>
    <div class="card pad">
      <div class="eyebrow">İçerik</div>
      <div class="sx-stats" style="grid-template-columns:repeat(2,1fr);margin-top:12px">
        <div class="sx-stat"><b>${c.kayit.length}</b><span>kayıtlı ders</span></div>
        <div class="sx-stat"><b>${c.kesit.length}</b><span>kesit</span></div>
        <div class="sx-stat"><b>${c.bolum.length}</b><span>podcast</span></div>
        <div class="sx-stat"><b>${c.kurs.length}</b><span>seviye</span></div>
      </div>
    </div>
  </div>
  ${c.kurs.length?`<h3 style="margin:26px 0 12px">Seviyeler</h3>
    <div class="card">${c.kurs.map(k=>`<div class="past"><div class="grow" style="flex:1">
      <b style="font-family:var(--disp)">${esc(ceviri(k.ad))}</b>
      <div class="muted" style="font-size:13.5px">${esc(ceviri(k.not)||"")}</div></div></div>`).join("")}</div>`:""}`;
}

/* ---- kayıtlı dersler ---- */
function bolumKayitli(id){
  const c=dersIcerik(id);
  if(!c.kayit.length) return `<div class="card pad muted" style="margin-top:18px">Bu derste henüz kayıtlı ders yok.</div>`;
  return `<div class="grid g3" style="margin-top:18px">${c.kayit.map((k,idx)=>`
    <button class="clip" data-kayit="${idx}" data-kders="${esc(id)}">
      <div class="thumb">${gorselEtiketi(k)}<span class="play"></span><span class="dur">${esc(ceviri(k.sure)||"")}</span></div>
      <div class="body"><span class="tag">Ders ${k.sira||idx+1}</span>
        <h3 style="margin:10px 0 5px">${esc(ceviri(k.ad))}</h3>
        <p class="muted" style="font-size:13.5px">${esc(ceviri(k.ozet)||"")}</p></div>
    </button>`).join("")}</div>`;
}
function gorselEtiketi(k){
  const kp=ceviri(k.kapak);
  if(kp) return `<img loading="lazy" src="${esc(kp)}" alt="">`;
  if(k.yt) return `<img loading="lazy" src="https://img.youtube.com/vi/${esc(k.yt)}/hqdefault.jpg" alt="">`;
  return "";
}

/* ---- kesitler ---- */
function bolumKesit(id){
  const c=dersIcerik(id);
  if(!girisliMi()) return kilitliEkran("Ders kesitleri",
    "Derslerden alınan kısa video parçaları.",
    ["Bu dersin tüm kesitleri","Yeni kesitler eklendikçe erişim","Sınav geçmişi ve ödev takibi"]);
  const kats=(DATA.kesitler.kategoriler||[]);
  const liste=c.kesit.filter(x=>filtre===0||ceviri(x.kategori)===ceviri(kats[filtre]));
  return `<div class="chips" style="margin:18px 0">${kats.map((k,i)=>
      `<button class="chip" data-filtre="${i}" aria-pressed="${i===filtre}">${esc(ceviri(k))}</button>`).join("")}</div>
    <div class="grid g3">${liste.length?liste.map(v=>`
      <button class="clip" data-video="${DATA.kesitler.liste.indexOf(v)}">
        <div class="thumb">${gorselEtiketi(v)}<span class="play"></span><span class="dur">${esc(ceviri(v.sure))}</span></div>
        <div class="body"><span class="tag">${esc(ceviri(v.kategori))}</span>
          <h3 style="margin:10px 0 5px">${esc(ceviri(v.baslik))}</h3>
          <p class="muted" style="font-size:13.5px">${esc(ceviri(v.ozet))}</p>
          <p class="muted" style="font-size:12.5px;margin-top:8px;font-family:var(--mono)">${esc(ceviri(v.ders_bilgi||v.ders_ad||""))}</p></div>
      </button>`).join(""):`<div class="card pad muted">Bu başlıkta kesit yok.</div>`}</div>`;
}

/* ---- podcast ---- */
function bolumPodcast(id){
  const c=dersIcerik(id);
  if(!girisliMi()) return kilitliEkran("Podcast bölümleri",
    "Velilerle ve eğitmenlerle yaptığımız sohbetler.",
    ["Bütün bölümler ve yeni yayınlar","İndirilebilir ses dosyaları","Sınav geçmişi ve ödev takibi"]);
  if(!c.bolum.length) return `<div class="card pad muted" style="margin-top:18px">Bu derste henüz bölüm yok.</div>`;
  return `<div class="card" style="margin-top:18px">${c.bolum.map(b=>`
    <div class="ep"><span class="n">#${b.no}</span>
      <div class="grow"><h3>${esc(ceviri(b.baslik))}</h3>
        <div class="sub">${esc(ceviri(b.ozet))}</div>
        <div class="sub" style="font-family:var(--mono);font-size:12px;margin-top:5px">${esc(ceviri(b.tarih))} · ${esc(ceviri(b.sure))}</div></div>
      <button class="pbtn" data-ep="${DATA.podcast.bolumler.indexOf(b)}" aria-label="çal">▶</button></div>`).join("")}</div>`;
}

/* ---- yarışmalar ---- */
function bolumYarisma(id){
  const c=dersIcerik(id);
  if(!c.yarisma && !c.gecmis.length) return `<div class="card pad muted" style="margin-top:18px">Bu derste planlanmış yarışma yok.</div>`;
  return `${c.yarisma?`<div class="card contest" style="margin-top:18px">
      <span class="tag teal">Kayıtlar açık</span>
      <h3 style="font-size:26px;margin:12px 0 6px">${esc(ceviri(c.yarisma.ad))}</h3>
      <p class="muted">${esc(ceviri(c.yarisma.yer))} · ${esc(ceviri(c.yarisma.katilimci))}</p>
      <div class="count" id="sayac"></div>
      <p style="max-width:56ch">${esc(ceviri(c.yarisma.metin))}</p>
      <div class="sx-row" style="margin-top:20px">
        ${c.yarisma.kod?`<button class="btn" data-dsekme="sinav">Yarışma sınavına gir</button>`
          :`<a class="btn" href="https://wa.me/${String(ceviri(DATA.hakkimizda.iletisim.telefon)).replace(/[^0-9]/g,"")}" target="_blank" rel="noopener">Kayıt için yaz</a>`}
      </div></div>`:""}
    ${c.gecmis.length?`<h3 style="margin:30px 0 12px">Geçmiş yarışmalar</h3>
      <div class="card">${c.gecmis.map(g=>`<div class="past">
        <span class="date">${esc(ceviri(g.tarih))}</span>
        <div class="grow" style="flex:1"><b style="font-family:var(--disp)">${esc(ceviri(g.ad))}</b>
          <div class="muted" style="font-size:13.5px">${esc(ceviri(g.not))}</div></div></div>`).join("")}</div>`:""}`;
}

/* ---- gurur tablosu ---- */
function bolumGurur(id){
  const g=dersIcerik(id).gurur;
  if(!g) return `<div class="card pad muted" style="margin-top:18px">Bu dersin listesi henüz açıklanmadı.</div>`;
  const [a,b,c]=g.ilkUc||[];
  return `<div class="eyebrow" style="margin-top:18px">${esc(ceviri(g.donem))}</div>
    <p class="muted" style="max-width:52ch;margin-top:6px">${esc(ceviri(g.metin))}</p>
    <div class="podium">${pod(b,"two","2")}${pod(a,"one","1")}${pod(c,"three","3")}</div>
    <div class="card">${(g.liste||[]).map((x,i)=>`<div class="trow">
      <span class="rk">${i+4}</span><span class="nm">${esc(ceviri(x.ad))}</span>
      <span class="cl">${esc(ceviri(x.sinif))}</span><span class="pt">${esc(ceviri(x.puan))}</span></div>`).join("")}</div>`;
}

/* ---- sınav ve ödev ---- */
function bolumSinav(id){
  const sonuc=(SX.ogrSonuc||[]).filter(r=>(r.ders||"aritmetik")===id);
  const odev=(SX.ogrOdev||[]).filter(x=>x.ders===id);
  const bekleyen=odev.filter(x=>x.durum!=="tamamlandi");
  const ort=sonuc.length?Math.round(sonuc.reduce((s,r)=>s+r.dogru/r.toplam*100,0)/sonuc.length):0;
  return `
  <div class="grid g2" style="margin-top:18px">
    <div class="card pad">
      <div class="eyebrow">Sınav</div>
      <h3 style="margin:10px 0 8px">Kodla sınava gir</h3>
      <p class="muted" style="font-size:14px">Öğretmeninin verdiği altı haneli kodu yaz.</p>
      <a class="btn" href="#/sinav" style="margin-top:14px"><i class="fa-solid fa-file-pen"></i> Sınav ekranına git</a>
    </div>
    <div class="card pad">
      <span class="tag teal">Kodsuz</span>
      <h3 style="margin:12px 0 8px">Serbest alıştırma</h3>
      <p class="muted" style="font-size:14px">Bu dersten kendine soru üret, sonuç kimseye gitmez.</p>
      <button class="btn ghost" data-alistir="${esc(id)}" style="margin-top:14px"><i class="fa-solid fa-calculator"></i> Alıştırmayı kur</button>
    </div>
  </div>
  ${girisliMi()?`
  <h3 style="margin:26px 0 12px">Ödevlerim</h3>
  ${odev.length? odev.sort((a,b)=>(b.at||0)-(a.at||0)).map(x=>`
    <div class="sx-item"><div class="g"><b>${esc(x.baslik)}</b>
      <div class="s">${x.sonTarih?"son tarih "+esc(x.sonTarih):""}${x.sinavKodu?" · kod "+esc(x.sinavKodu):""}</div></div>
      <span class="sx-badge ${x.durum==="tamamlandi"?"ok":"wait"}">${x.durum==="tamamlandi"?"tamamlandı":"bekliyor"}</span></div>`).join("")
    : `<div class="sx-empty">Bu derste ödev yok.</div>`}

  <h3 style="margin:26px 0 12px">Bu dersteki sonuçlarım</h3>
  ${sonuc.length? `<div class="sx-stats" style="grid-template-columns:repeat(3,1fr)">
      <div class="sx-stat"><b>${sonuc.length}</b><span>sınav</span></div>
      <div class="sx-stat"><b>${ort}%</b><span>ortalama</span></div>
      <div class="sx-stat"><b>${bekleyen.length}</b><span>bekleyen ödev</span></div></div>`+
    sonuc.sort((a,b)=>(b.at||0)-(a.at||0)).slice(0,8).map(r=>`
      <div class="sx-rank" style="cursor:default"><span class="nm">${esc(r.sinavAd||"Sınav")}
        <div class="sx-bar"><i style="width:${Math.round(r.dogru/r.toplam*100)}%"></i></div></span>
        <span class="sc">${r.dogru}/${r.toplam}</span></div>`).join("")
    : `<div class="sx-empty">Bu derste henüz sınav çözmedin.</div>`}`
  :`<div class="card pad" style="margin-top:20px"><p class="muted">Ödevlerini ve sonuçlarını görmek için giriş yap.</p>
     <button class="btn" data-sx="girisIste" style="margin-top:12px">Giriş yap</button></div>`}`;
}

/* ---- alıştırma: serbest çalışma ve o dersin günlük tekrarı ---- */
function bolumAlistirma(id){
  const bekleyen = (typeof srsBugun==="function" && girisliMi()) ? srsBugun(id) : [];
  return `
  <div class="grid g2" style="margin-top:14px">
    <div class="card pad">
      <span class="tag teal">Kodsuz</span>
      <h3 style="margin:12px 0 8px">Serbest alıştırma</h3>
      <p class="muted" style="font-size:14px">Bu dersten kendine soru üret, sonuç kimseye gitmez.</p>
      <button class="btn ghost" data-alistir="${esc(id)}" style="margin-top:14px">
        <i class="fa-solid fa-calculator"></i> Alıştırmayı kur</button>
    </div>
    <div class="card pad">
      <span class="tag">Tekrar</span>
      <h3 style="margin:12px 0 8px">Günlük tekrar</h3>
      ${bekleyen.length
        ? `<p class="muted" style="font-size:14px">Bu derste hatırlaman gereken <b>${bekleyen.length}</b> şey var.</p>
           <button class="btn" data-srs="basla" data-v="${esc(id)}" style="margin-top:14px">
             <i class="fa-solid fa-rotate"></i> Tekrara başla</button>`
        : girisliMi()
          ? `<p class="muted" style="font-size:14px">Bugünlük tekrar edilecek bir şey yok. Yarın yeniden bak.</p>`
          : `<p class="muted" style="font-size:14px">Tekrar listesini görmek için giriş yap.</p>
             <button class="btn ghost" data-sx="girisIste" style="margin-top:14px">
               <i class="fa-solid fa-arrow-right-to-bracket"></i> Giriş yap</button>`}
    </div>
  </div>`;
}
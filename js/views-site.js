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
          <a class="btn" href="${esc(DATA.marka.sinavLinki)}">Sınava gir</a>
          <a class="btn ghost" href="https://wa.me/${DATA.hakkimizda.iletisim.telefon.replace(/[^0-9]/g,"")}?text=${encodeURIComponent("Merhaba, deneme dersi için bilgi almak istiyorum.")}" target="_blank" rel="noopener">Deneme dersi al</a>
          <a class="btn ghost" href="#/kesitler">Ders kesitlerini izle</a>
        </div>
      </div>
      <div class="card abacus">
        ${[7,5,6,4,7,5].map((n,r)=>`<div class="wire">${Array.from({length:n},(_,i)=>
          `<i style="animation-delay:${(r*.18+i*.06).toFixed(2)}s"></i>`).join("")}</div>`).join("")}
        <div class="eyebrow" style="margin-top:10px">her ders bir tel, her tel bir alışkanlık</div>
      </div>
    </div>

    <div class="grid g4" style="margin-top:16px">
      ${a.istatistik.map(s=>`<div class="card stat"><b>${esc(ceviri(s.sayi))}</b><span>${esc(ceviri(s.ad))}</span></div>`).join("")}
    </div>

    <div class="card strip"><span class="dot"></span><span>${esc(ceviri(a.duyuru))}</span></div>

    <h2 style="margin:44px 0 6px">Bu hafta</h2>
    <p class="muted" style="margin-bottom:18px">Sitede yeni olan üç şey.</p>
    <div class="grid g3">
      ${DATA.kesitler.liste[0]?kartOzet("Son ders kesiti", DATA.kesitler.liste[0].baslik, DATA.kesitler.liste[0].ders, "#/kesitler","Kesitlere git"):""}
      ${DATA.podcast.bolumler[0]?kartOzet("Son podcast", DATA.podcast.bolumler[0].baslik, "Bölüm "+DATA.podcast.bolumler[0].no+" · "+DATA.podcast.bolumler[0].sure, "#/podcast","Bölümü aç"):""}
      ${DATA.yarismalar.aktif?kartOzet("Yaklaşan yarışma", DATA.yarismalar.aktif.ad, DATA.yarismalar.aktif.yer, "#/yarisma","Detaya bak"):kartOzet("Sınav","Kodla sınava gir","Öğretmeninin verdiği kodu yaz","#/sinav","Sınava git")}
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
  const liste=k.liste.filter(x=> filtre===0 || ceviri(x.kategori)===ceviri(k.kategoriler[filtre]));
  return `<section class="page">
    <div class="eyebrow">Arşiv</div>
    <h2 style="margin:10px 0 8px">Canlı ders kesitleri</h2>
    <p class="muted" style="max-width:52ch">Derslerden kısa parçalar. Çocuğunuzun hangi tekniği öğrendiğini görmek için en kolay yol.</p>
    <div class="chips">${k.kategoriler.map((c,i)=>
      `<button class="chip" data-filtre="${i}" aria-pressed="${i===filtre}">${esc(ceviri(c))}</button>`).join("")}</div>
    <div class="grid g3">${liste.map((v,i)=>`
      <button class="clip" data-video="${k.liste.indexOf(v)}">
        <div class="thumb">
          ${v.yt?`<img loading="lazy" src="https://img.youtube.com/vi/${esc(v.yt)}/hqdefault.jpg" alt="">`:""}
          <span class="play"></span><span class="dur">${esc(ceviri(v.sure))}</span>
        </div>
        <div class="body">
          <span class="tag">${esc(ceviri(v.kategori))}</span>
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
        <div class="av">${esc(p.ad.split(" ").map(w=>w[0]).join("").slice(0,2))}</div>
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
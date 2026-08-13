/* Yönetim paneli — sitedeki tüm içeriği düzenler.
   Değişiklikler Firestore'da (site/icerik) saklanır, dosyaya dokunulmaz. */

/* --- yol ile oku/yaz: "ana.baslik", "kesitler.liste.2.ozet" --- */
function pAl(o,yol){ return yol.split(".").reduce((a,k)=> (a==null?a:a[k]), o); }
function pYaz(o,yol,v){
  const p=yol.split("."), son=p.pop();
  const h=p.reduce((a,k)=>{ if(a[k]==null) a[k]={}; return a[k]; }, o);
  h[son]=v;
}

/* --- bölüm tanımları --- */
const YON_BOLUM = [
 { k:"genel", ad:"Genel",
   alanlar:[
     {y:"marka.ad", ad:"Kurum adı"},
     {y:"marka.alt", ad:"Logo alt yazısı"},
     {y:"hakkimizda.iletisim.telefon", ad:"Telefon (WhatsApp için)"},
     {y:"hakkimizda.iletisim.mail", ad:"E-posta"},
     {y:"hakkimizda.iletisim.adres", ad:"Adres"}
   ]},

 { k:"ana", ad:"Ana sayfa",
   alanlar:[
     {y:"ana.etiket", ad:"Üst etiket", ipucu:"Gaziantep · 7–14 yaş"},
     {y:"ana.baslik", ad:"Büyük başlık", tip:"uzun", ipucu:"<span class='grad'>…</span> ile kelime renklendirebilirsin"},
     {y:"ana.metin", ad:"Açıklama", tip:"uzun"},
     {y:"ana.duyuru", ad:"Duyuru şeridi", tip:"uzun"}
   ],
   listeler:[
     {y:"ana.istatistik", ad:"İstatistik kutuları",
      alanlar:[{k:"sayi",ad:"Sayı"},{k:"ad",ad:"Etiket"}], yeni:{sayi:"",ad:""}}
   ]},

 { k:"kesitler", ad:"Ders kesitleri",
   listeler:[
     {y:"kesitler.kategoriler", ad:"Kategoriler", duz:true, yeni:"Yeni kategori"},
     {y:"kesitler.liste", ad:"Video kesitleri",
      alanlar:[{k:"baslik",ad:"Başlık"},{k:"kategori",ad:"Kategori"},{k:"sure",ad:"Süre"},
               {k:"ders",ad:"Ders bilgisi"},{k:"yt",ad:"YouTube kimliği",ipucu:"watch?v=XXXX kısmı"},
               {k:"ozet",ad:"Özet",tip:"uzun"}],
      yeni:{baslik:"Yeni kesit",kategori:"Teknik",sure:"0:00",ders:"",yt:"",ozet:""}}
   ]},

 { k:"podcast", ad:"Podcastler",
   alanlar:[{y:"podcast.aciklama", ad:"Bölüm açıklaması", tip:"uzun"}],
   listeler:[
     {y:"podcast.bolumler", ad:"Bölümler",
      alanlar:[{k:"no",ad:"Bölüm no",tip:"sayi"},{k:"baslik",ad:"Başlık"},{k:"sure",ad:"Süre"},
               {k:"tarih",ad:"Tarih"},{k:"ozet",ad:"Özet",tip:"uzun"},
               {k:"mp3",ad:"Ses dosyası adresi",ipucu:"https://… .mp3"}],
      yeni:{no:1,baslik:"Yeni bölüm",sure:"",tarih:"",ozet:"",mp3:""}}
   ]},

 { k:"yarisma", ad:"Yarışmalar",
   alanlar:[
     {y:"yarismalar.aktif.ad", ad:"Yarışma adı"},
     {y:"yarismalar.aktif.tarih", ad:"Tarih ve saat", ipucu:"2026-08-30T10:00:00 biçiminde"},
     {y:"yarismalar.aktif.yer", ad:"Yer"},
     {y:"yarismalar.aktif.katilimci", ad:"Katılımcı bilgisi"},
     {y:"yarismalar.aktif.kod", ad:"Sınav kodu", ipucu:"boş bırakılırsa kayıt düğmesi görünür"},
     {y:"yarismalar.aktif.metin", ad:"Açıklama", tip:"uzun"}
   ],
   listeler:[
     {y:"yarismalar.gecmis", ad:"Geçmiş yarışmalar",
      alanlar:[{k:"tarih",ad:"Tarih"},{k:"ad",ad:"Ad"},{k:"not",ad:"Not"}],
      yeni:{tarih:"",ad:"",not:""}}
   ]},

 { k:"gurur", ad:"Gurur tablomuz",
   alanlar:[
     {y:"gurur.donem", ad:"Dönem", ipucu:"Temmuz 2026"},
     {y:"gurur.metin", ad:"Açıklama", tip:"uzun"}
   ],
   listeler:[
     {y:"gurur.ilkUc", ad:"Podyum (ilk üç, sırayla 1-2-3)",
      alanlar:[{k:"ad",ad:"Öğrenci"},{k:"sinif",ad:"Seviye"},{k:"puan",ad:"Puan"}],
      yeni:{ad:"",sinif:"",puan:""}, ustSinir:3},
     {y:"gurur.liste", ad:"Sıralama (4. sıradan itibaren)",
      alanlar:[{k:"ad",ad:"Öğrenci"},{k:"sinif",ad:"Seviye"},{k:"puan",ad:"Puan"}],
      yeni:{ad:"",sinif:"",puan:""}}
   ]},

 { k:"hakkinda", ad:"Hakkımızda",
   alanlar:[
     {y:"hakkimizda.baslik", ad:"Başlık", tip:"uzun"},
     {y:"hakkimizda.metin", ad:"Metin", tip:"uzun"}
   ],
   listeler:[
     {y:"hakkimizda.degerler", ad:"İlkeler",
      alanlar:[{k:"ico",ad:"Simge",ipucu:"emoji"},{k:"ad",ad:"Başlık"},{k:"not",ad:"Açıklama",tip:"uzun"}],
      yeni:{ico:"✦",ad:"",not:""}},
     {y:"hakkimizda.ekip", ad:"Ekip",
      alanlar:[{k:"ad",ad:"Ad soyad"},{k:"rol",ad:"Görev"}], yeni:{ad:"",rol:""}},
     {y:"hakkimizda.sss", ad:"Sık sorulan sorular",
      alanlar:[{k:"s",ad:"Soru"},{k:"c",ad:"Cevap",tip:"uzun"}], yeni:{s:"",c:""}}
   ]},

 { k:"kurslar", ad:"Kurslar",
   listeler:[
     {y:"kurslar", ad:"Kurs / seviye listesi (sertifikalarda kullanılır)",
      alanlar:[{k:"ad",ad:"Kurs adı"},{k:"not",ad:"Açıklama"}], yeni:{ad:"",not:""}}
   ]}
];

/* --- görünüm --- */
function vYonetim(){
  if(!SX.user || !SX.user.yonetici) return `<section class="page"><div class="card pad">
    <h2>Yönetim paneli</h2>
    <p class="muted" style="margin-top:8px">Bu sayfa yalnız yöneticiye açıktır.</p>
    <button class="btn" data-sx="girisIste" style="margin-top:14px">${t("girisYap")}</button></div></section>`;

  const b = YON_BOLUM.find(x=>x.k===(SX.yonTab||"genel")) || YON_BOLUM[0];
  return `<section class="page">
    <div class="card pad">
      <div class="sx-user"><b>Yönetim paneli</b>
        <span>site içeriğini buradan düzenlersin</span>
        <span class="sx-badge ok">${t("yonetici")}</span>
        <span style="margin-inline-start:auto"></span>
        ${SX.yonKirli?`<span class="sx-badge wait">kaydedilmedi</span>`:""}
        <button class="btn sm" data-sx="yonKaydet">Yayınla</button></div>

      <div class="sx-tabs" style="flex-wrap:wrap">
        ${YON_BOLUM.map(x=>`<button data-sx="yonTab" data-v="${x.k}" aria-pressed="${b.k===x.k}">${x.ad}</button>`).join("")}
      </div>

      ${(b.alanlar||[]).map(a=>yonAlan(a)).join("")}
      ${(b.listeler||[]).map(l=>yonListe(l)).join("")}

      <div class="sx-row" style="margin-top:22px;border-top:1px solid rgba(20,26,51,.1);padding-top:16px">
        <button class="btn" data-sx="yonKaydet">Değişiklikleri yayınla</button>
        <button class="btn ghost" data-sx="yonYedek">JSON yedeği indir</button>
        <button class="btn ghost" data-sx="yonSifirla">Dosyadaki varsayılana dön</button>
      </div>
      <div class="sx-note" id="yonNot">Yayınla dediğin an site herkeste güncellenir. Yedek almadan sıfırlama.</div>
    </div></section>`;
}

function yonAlan(a){
  const deger = ceviri(pAl(DATA,a.y)); const d0 = (deger===0?0:(deger||""));
  const giris = a.tip==="uzun"
    ? `<textarea class="sx-ta" style="min-height:84px" data-ybind="${a.y}">${esc(d0)}</textarea>`
    : `<input class="sx-in" data-ybind="${a.y}" value="${esc(d0)}">`;
  return `<div class="sx-field"><div class="sx-label">${esc(a.ad)}</div>${giris}
    ${a.ipucu?`<div class="sx-note">${a.ipucu}</div>`:""}</div>`;
}

function yonListe(l){
  const dizi = pAl(DATA,l.y) || [];
  const dolu = l.ustSinir ? dizi.length>=l.ustSinir : false;
  const satirlar = dizi.map((x,i)=>{
    if(l.duz){
      return `<div class="yon-satir"><input class="sx-in" data-ybind="${l.y}.${i}" value="${esc(x)}">
        <button class="btn ghost sm" data-sx="yonSil" data-y="${l.y}" data-i="${i}">${t("sil")}</button></div>`;
    }
    return `<div class="yon-kart">
      <div class="yon-kart-ust">
        <span class="yon-no">${i+1}</span>
        <span class="yon-ozet">${esc(ceviri(x[l.alanlar[0].k])||"—")}</span>
        <button class="btn ghost sm" data-sx="yonTasi" data-y="${l.y}" data-i="${i}" data-d="-1" title="yukarı">↑</button>
        <button class="btn ghost sm" data-sx="yonTasi" data-y="${l.y}" data-i="${i}" data-d="1" title="aşağı">↓</button>
        <button class="btn ghost sm" data-sx="yonSil" data-y="${l.y}" data-i="${i}">${t("sil")}</button>
      </div>
      ${l.alanlar.map(a=>{
        const dd = ceviri(x[a.k]); const d = (dd===0?0:(dd||""));
        const yol=`${l.y}.${i}.${a.k}`;
        const g = a.tip==="uzun"
          ? `<textarea class="sx-ta" style="min-height:64px" data-ybind="${yol}">${esc(d)}</textarea>`
          : `<input class="sx-in" data-ybind="${yol}" ${a.tip==="sayi"?'type="number"':""} value="${esc(d)}">`;
        return `<div class="sx-field" style="margin-bottom:10px"><div class="sx-label">${esc(a.ad)}</div>${g}
          ${a.ipucu?`<div class="sx-note">${a.ipucu}</div>`:""}</div>`;
      }).join("")}
    </div>`;
  }).join("");
  return `<div class="yon-blok">
    <div class="sx-label" style="margin-top:18px">${esc(l.ad)} · ${dizi.length}</div>
    ${satirlar || `<div class="sx-empty">Henüz kayıt yok.</div>`}
    ${dolu?"":`<button class="btn ghost sm" data-sx="yonEkle" data-y="${l.y}" style="margin-top:10px">+ Ekle</button>`}
  </div>`;
}

function yonListeBul(yol){
  for(const b of YON_BOLUM) for(const l of (b.listeler||[])) if(l.y===yol) return l;
  return null;
}

/* --- veri bağlama --- */
document.addEventListener("input",e=>{
  const i=e.target.closest("[data-ybind]"); if(!i) return;
  let v=i.value;
  if(i.type==="number") v=Number(v);
  pYaz(DATA,i.dataset.ybind,v);
  SX.yonKirli=true;
  const r=document.querySelector('[data-sx="yonKaydet"]');
  if(r) r.textContent="Yayınla ●";
});

/* --- işlemler --- */
async function yonKaydet(){
  const n=$("yonNot");
  if(n) n.textContent="Yayınlanıyor…";
  try{
    await API.icerikYaz(yonIcerik());
    SX.yonKirli=false;
    ciz(); toast("Site içeriği güncellendi.");
  }catch(e){
    if(n) n.innerHTML=`<span class="sx-warn">Kaydedilemedi. Yönetici hesabıyla girdiğinden ve kuralları güncellediğinden emin ol.</span>`;
  }
}
function yonIcerik(){
  const c={};
  ["marka","ana","kesitler","podcast","yarismalar","gurur","hakkimizda","kurslar"].forEach(k=>{ c[k]=DATA[k]; });
  return c;
}
function yonYedek(){
  const a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([JSON.stringify(yonIcerik(),null,2)],{type:"application/json"}));
  a.download="site-icerik-"+new Date().toISOString().slice(0,10)+".json";
  a.click();
}
async function yonSifirla(){
  if(!confirm("Site içeriği dosyadaki varsayılana dönsün mü? Yayındaki değişiklikler silinir.")) return;
  try{ await API.icerikSil(); }catch(e){}
  location.reload();
}

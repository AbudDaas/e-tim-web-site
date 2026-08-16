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

 { k:"branslar", ad:"Branşlar",
   listeler:[
     {y:"dersler", ad:"Dersler (menüdeki sekmeler)",
      alanlar:[{k:"id",ad:"Kısa kod",ipucu:"benzersiz, boşluksuz — ör. ingilizce"},
               {k:"ico",ad:"Simge",ipucu:"emoji"},
               {k:"renk",ad:"Renk",ipucu:"#4338CA"},
               {k:"tip",ad:"Sınav tipi",ipucu:"aritmetik · secmeli · yazili"},
               {k:"ad",ad:"Ders adı"},
               {k:"ozet",ad:"Kısa tanıtım",tip:"uzun"},
               {k:"aciklama",ad:"Uzun açıklama (ders hakkında)",tip:"uzun"}],
      yeni:{id:"yeni-ders",ico:"📘",renk:"#4338CA",tip:"secmeli",ad:"Yeni ders",ozet:"",aciklama:""}}
   ]},

 { k:"mufredat", ad:"Müfredat",
   listeler:[
     {y:"mufredat", ad:"Üniteler (konular satır satır yazılır)",
      alanlar:[{k:"ders",ad:"Branş kodu"},{k:"ad",ad:"Ünite adı"}],
      yeni:{ders:"aritmetik",ad:"Yeni ünite",konular:[]}}
   ]},

 { k:"kartlar", ad:"Kelime kartları",
   listeler:[
     {y:"kartlar", ad:"Kartlar (kelime kartı aracı)",
      alanlar:[{k:"ders",ad:"Branş kodu"},{k:"on",ad:"Ön yüz (kelime)"},
               {k:"arka",ad:"Arka yüz (anlam)"},{k:"ipucu",ad:"Etiket",ipucu:"konu — ör. school"}],
      yeni:{ders:"ingilizce",on:"",arka:"",ipucu:""}}
   ]},

 { k:"kayitli", ad:"Kayıtlı dersler",
   listeler:[
     {y:"kayitliDersler", ad:"Ders videoları",
      alanlar:[{k:"ders",ad:"Branş kodu",ipucu:"aritmetik · ingilizce · arapca · kuran"},
               {k:"sira",ad:"Sıra no",tip:"sayi"},
               {k:"ad",ad:"Ders adı"},
               {k:"sure",ad:"Süre"},
               {k:"yt",ad:"YouTube kimliği"},
               {k:"kapak",ad:"Kapak görseli"},
               {k:"ozet",ad:"Özet",tip:"uzun"}],
      yeni:{ders:"aritmetik",sira:1,ad:"Yeni ders",sure:"0:00",yt:"",kapak:"",ozet:""}}
   ]},

 { k:"kesitler", ad:"Ders kesitleri",
   listeler:[
     {y:"kesitler.kategoriler", ad:"Kategoriler", duz:true, yeni:"Yeni kategori"},
     {y:"kesitler.liste", ad:"Video kesitleri",
      alanlar:[{k:"ders",ad:"Branş kodu",ipucu:"aritmetik · ingilizce · arapca · kuran"},
               {k:"baslik",ad:"Başlık"},{k:"kategori",ad:"Kategori"},{k:"sure",ad:"Süre"},
               {k:"ders",ad:"Ders bilgisi"},{k:"yt",ad:"YouTube kimliği",ipucu:"watch?v=XXXX kısmı"},
               {k:"kapak",ad:"Kapak görseli",ipucu:"gorseller/kesit1.jpg  ya da  https://... .jpg — boş bırakırsan YouTube'un kapağı kullanılır"},
               {k:"ozet",ad:"Özet",tip:"uzun"}],
      yeni:{ders:"aritmetik",baslik:"Yeni kesit",kategori:"Teknik",sure:"0:00",yt:"",kapak:"",ozet:""}}
   ]},

 { k:"podcast", ad:"Podcastler",
   alanlar:[{y:"podcast.aciklama", ad:"Bölüm açıklaması", tip:"uzun"}],
   listeler:[
     {y:"podcast.bolumler", ad:"Bölümler",
      alanlar:[{k:"ders",ad:"Branş kodu"},{k:"no",ad:"Bölüm no",tip:"sayi"},{k:"baslik",ad:"Başlık"},{k:"sure",ad:"Süre"},
               {k:"tarih",ad:"Tarih"},{k:"ozet",ad:"Özet",tip:"uzun"},
               {k:"mp3",ad:"Ses dosyası adresi",ipucu:"https://… .mp3"}],
      yeni:{ders:"aritmetik",no:1,baslik:"Yeni bölüm",sure:"",tarih:"",ozet:"",mp3:""}}
   ]},

 { k:"yarisma", ad:"Yarışmalar",
   alanlar:[
     {y:"yarismalar.aktif.ders", ad:"Branş kodu", ipucu:"hangi dersin yarışması"},
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

 { k:"gurur", ad:"Gurur tablomuz", otomatik:true,
   alanlar:[
     {y:"gurur.ders", ad:"Branş kodu", ipucu:"hangi dersin tablosu"},
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
      alanlar:[{k:"ders",ad:"Branş kodu"},{k:"ad",ad:"Kurs adı"},{k:"not",ad:"Açıklama"}],
      yeni:{ders:"aritmetik",ad:"",not:""}}
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

      ${b.otomatik?`<div class="uyari" style="cursor:default;border-color:rgba(13,148,136,.4);background:rgba(13,148,136,.09)">
        <span class="uyari-nokta" style="background:var(--turkuaz);box-shadow:0 0 0 4px rgba(13,148,136,.18)"></span>
        <div style="flex:1"><b>Sınav sonuçlarından doldur</b>
          <div class="s">Kendi sınavlarının sonuçlarını tarar, ortalamaya göre sıralar, isimleri "Elif Y." biçiminde kısaltır.</div>
          <div class="sx-row" style="margin-top:10px">
            <select class="sx-in" id="gururGun" style="max-width:170px">
              <option value="30">son 30 gün</option><option value="60">son 60 gün</option>
              <option value="90">son 90 gün</option><option value="365">son 1 yıl</option></select>
            <button class="btn sm" data-sx="gururHesapla">Hesapla</button></div>
          <div class="sx-note" id="gururNot"></div>
        </div></div>`:""}
      ${(b.alanlar||[]).map(a=>yonAlan(a)).join("")}
      ${(b.listeler||[]).map(l=>yonListe(l)).join("")}

      <div class="sx-row" style="margin-top:22px;border-top:1px solid rgba(20,26,51,.1);padding-top:16px">
        <button class="btn" data-sx="yonKaydet">Değişiklikleri yayınla</button>
        <button class="btn ghost" data-sx="yonYedek">JSON yedeği indir</button>
        <button class="btn ghost" data-sx="yonSifirla">Dosyadaki varsayılana dön</button>
      </div>
      <div class="sx-note" id="yonNot">Şu an <b>${DILLER[aktifDil()].ad}</b> içeriğini düzenliyorsun. Başka bir dilin metnini düzenlemek için Profil → Ayarlar bölümünden dili değiştir. Yayınla dediğin an site herkeste güncellenir.</div>
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
      ${(function(){ const k=x.kapak?ceviri(x.kapak):""; const y=x.yt?`https://img.youtube.com/vi/${x.yt}/mqdefault.jpg`:"";
          const src=k||y; return src?`<img class="yon-onizleme" src="${esc(src)}" alt="">`:""; })()}
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

/* --- gurur tablosunu sınav sonuçlarından doldur --- */
function kisaAd(t){
  const p=String(t||"").trim().split(/\s+/);
  if(p.length<2) return p[0]||"";
  return p[0]+" "+p[p.length-1][0].toUpperCase()+".";
}
async function gururHesapla(){
  const n=$("gururNot");
  const gun=+($("gururGun")?$("gururGun").value:30) || 30;
  const sinir=Date.now()-gun*864e5;
  if(n) n.textContent="Sonuçlar taranıyor…";
  try{
    if(!SX.sinavlar || !SX.sinavlar.length) await sinavlariYukle();
    const toplam={};
    for(const s of SX.sinavlar){
      const sonuclar=await API.sonuclar(s.kod);
      for(const r of sonuclar){
        if(!r.at || r.at<sinir || !r.toplam) continue;
        const ad=kisaAd(r.ad);
        if(!ad) continue;
        const t=toplam[ad] || (toplam[ad]={ad, sinav:0, yuzde:0});
        t.sinav++; t.yuzde += r.dogru/r.toplam*100;
      }
    }
    const dizi=Object.values(toplam)
      .map(x=>({ad:x.ad, sinav:x.sinav, ort:Math.round(x.yuzde/x.sinav)}))
      .sort((a,b)=> b.ort-a.ort || b.sinav-a.sinav);
    if(!dizi.length){
      if(n) n.innerHTML=`<span class="sx-warn">Bu aralıkta sonuç yok. Gün sayısını artır ya da önce sınav yaptır.</span>`;
      return;
    }
    const kutu=x=>({
      ad:x.ad,
      sinif:{tr:x.sinav+" sınav", en:x.sinav+" exams", ar:x.sinav+" اختبار"},
      puan:x.ort+"%"
    });
    DATA.gurur.ilkUc = dizi.slice(0,3).map(kutu);
    DATA.gurur.liste = dizi.slice(3,13).map(kutu);
    const ay=new Date().toLocaleDateString("tr-TR",{month:"long",year:"numeric"});
    DATA.gurur.donem = {tr:ay, en:new Date().toLocaleDateString("en-GB",{month:"long",year:"numeric"}),
                        ar:new Date().toLocaleDateString("ar-EG",{month:"long",year:"numeric"})};
    SX.yonKirli=true; ciz();
    toast(dizi.length+" öğrenci sıralandı. Yayınla demeyi unutma.");
  }catch(e){
    if(n) n.innerHTML=`<span class="sx-warn">Hesaplanamadı: ${String(e.message||e)}</span>`;
  }
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
  ["marka","ana","dersler","kayitliDersler","kesitler","podcast","yarismalar","gurur","hakkimizda","kurslar","kartlar","mufredat"].forEach(k=>{ c[k]=DATA[k]; });
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
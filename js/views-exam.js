/* Sınav ve profil sekmelerinin görünümleri, form üreteci. */

/* --- taslak / form --- */
function yeniTaslak(){ return {ad:"",ders:"aritmetik",kaynak:"oto",seviye:1,adet:20,metin:"",limit:300,kip:"liste",hiz:900,havuz:0,tekDeneme:false,
  eksiSag:false,karistir:false,geriBildirim:true,gosterYanlis:true,ses:true,acik:true,kod:null} }
function taslakYaz(k,v){
  const d=SX.taslak; if(!d) return;
  if(["seviye","adet","limit","hiz","havuz"].includes(k)) d[k]=+v;
  else if(["eksiSag","karistir","geriBildirim","gosterYanlis","ses","tekDeneme"].includes(k)) d[k]=(v==="1");
  else d[k]=v;
}
function taslakSorular(){ const d=SX.taslak;
  if(d.kaynak==="elle") return soruAyikla(d.metin).qs;
  return Array.from({length:d.adet},()=>soruUret(SEVIYE[d.seviye])) }
function notYenile(){
  const n=$("sxNot"); if(!n) return;
  const arit=aritmetikMi(SX.taslak);
  const {qs,hata}= arit ? soruAyikla(SX.taslak.metin) : soruAyiklaGenel(SX.taslak.metin);
  let s=qs.length?`<span class="sx-good">${qs.length} soru hazır.</span>`:`<span class="sx-warn">Henüz soru yok.</span>`;
  if(hata.length) s+=` <span class="sx-warn">Anlaşılmayan satır: ${hata.join(", ")}</span>`;
  const yardim = arit
    ? `Her satır bir soru. Sayıları boşlukla ayır. Eksi için <b>-3</b> ya da <b>3-</b>. Cevabı kendin vermek istersen satır sonuna <b>= 41</b> ekle. <b>#</b> ile başlayan satır atlanır.`
    : `Her satır bir soru. Üç biçim var:<br>
       <b>Çoktan seçmeli:</b> Soru | şık | *doğru şık | şık &nbsp;(yıldız doğru cevabı işaretler)<br>
       <b>Kısa cevap:</b> Soru = cevap = kabul edilen ikinci yazım<br>
       <b>Doğru/yanlış:</b> Cümle = D &nbsp;ya da&nbsp; = Y<br>
       Büyük-küçük harf, noktalama ve Arapça harekeler göz ardı edilir. <b>#</b> ile başlayan satır atlanır.`;
  n.innerHTML=cevirHtml(yardim+"<br>"+s);
}
function sxChip(k,v,ad,acik,alt){
  return `<button class="chip" data-sx="chip" data-k="${k}" data-v="${v}" aria-pressed="${!!acik}">${ad}${alt?`<small style="display:block;font-family:var(--mono);font-size:10px;opacity:.7;margin-top:2px">${alt}</small>`:""}</button>`;
}
function dersBul(id){
  const l=DATA.dersler||[];
  return l.find(x=>x.id===id) || l[0] || {id:"aritmetik",ico:"🧮",tip:"aritmetik",ad:"Aritmetik"};
}
function aritmetikMi(d){ return dersBul(d&&d.ders).tip==="aritmetik"; }

function sxForm(){
  const d=SX.taslak, on=[0,120,300,600], ozel=d.limit>0&&!on.includes(d.limit);
  const arit=aritmetikMi(d);
  return `
  <div class="sx-field"><div class="sx-label">Ders</div><div class="chips" style="margin:0">
    ${(DATA.dersler||[]).map(x=>sxChip("ders",x.id,x.ico+" "+esc(ceviri(x.ad)),d.ders===x.id)).join("")}</div></div>
  ${arit?"":`
  <div class="sx-field"><div class="sx-label">Soruları yaz</div>
    <textarea class="sx-ta" data-sxbind="metin" spellcheck="false" placeholder="Pencil ne demek? | kitap | *kalem | masa&#10;Apple = elma = alma&#10;Kur'an 114 sure içerir = D">${esc(d.metin)}</textarea>
    <div class="sx-note" id="sxNot"></div>
    <div class="chips" style="margin:10px 0 0">${sxChip("karistir",d.karistir?0:1,"Sırayı karıştır",d.karistir)}</div>
    ${(typeof yzVar==="function"&&yzVar())?`
    <div class="yz-kutu">
      <div class="sx-label">Yapay zekâ ile soru üret</div>
      <textarea class="sx-ta" id="yzKonu" style="min-height:70px"
        placeholder="Konu ya da metin — ör. 'Present continuous tense, günlük hayattan örneklerle'"></textarea>
      <div class="sx-row" style="margin-top:8px">
        <select class="sx-in" id="yzAdet" style="max-width:130px">
          <option>5</option><option selected>10</option><option>15</option><option>20</option></select>
        <button class="btn" data-sx="yzUret"><i class="fa-solid fa-bolt"></i> Soruları üret</button></div>
      <div class="sx-note" id="yzNot">Üretilen sorular kutuya eklenir; yayınlamadan önce mutlaka gözden geçir.</div>
    </div>`:""}</div>`}
  ${!arit?"":`
  <div class="sx-field"><div class="sx-label">Sorular</div><div class="chips" style="margin:0">
    ${sxChip("kaynak","oto","Otomatik üret",d.kaynak==="oto")}${sxChip("kaynak","elle","Kendim yazacağım",d.kaynak==="elle")}</div></div>`}
  ${!arit?"":d.kaynak==="oto"?`
  <div class="sx-field"><div class="sx-label">Seviye</div><div class="chips" style="margin:0">
    ${SEVIYE_AD.map((a,i)=>sxChip("seviye",i,a,d.seviye===i,SEVIYE_NOT[i])).join("")}</div></div>
  <div class="sx-field"><div class="sx-label">Soru sayısı</div><div class="chips" style="margin:0">
    ${[10,20,50,100].map(c=>sxChip("adet",c,c,d.adet===c)).join("")}</div></div>`:`
  <div class="sx-field"><div class="sx-label">Soruları yaz</div>
    <textarea class="sx-ta" data-sxbind="metin" spellcheck="false" placeholder="48 51 5 -3&#10;12 -7 8 8 -7&#10;17 7 57">${esc(d.metin)}</textarea>
    <div class="sx-note" id="sxNot"></div>
    <div class="chips" style="margin:10px 0 0">${sxChip("karistir",d.karistir?0:1,"Sırayı karıştır",d.karistir)}</div>
    ${(typeof yzVar==="function"&&yzVar())?`
    <div class="yz-kutu">
      <div class="sx-label">Yapay zekâ ile soru üret</div>
      <textarea class="sx-ta" id="yzKonu" style="min-height:70px"
        placeholder="Konu ya da metin — ör. 'Present continuous tense, günlük hayattan örneklerle'"></textarea>
      <div class="sx-row" style="margin-top:8px">
        <select class="sx-in" id="yzAdet" style="max-width:130px">
          <option>5</option><option selected>10</option><option>15</option><option>20</option></select>
        <button class="btn" data-sx="yzUret"><i class="fa-solid fa-bolt"></i> Soruları üret</button></div>
      <div class="sx-note" id="yzNot">Üretilen sorular kutuya eklenir; yayınlamadan önce mutlaka gözden geçir.</div>
    </div>`:""}</div>`}
  <div class="sx-field"><div class="sx-label">Süre</div><div class="chips" style="margin:0">
    ${on.map(s=>sxChip("limit",s,s===0?"Süresiz":(s/60)+" dk",d.limit===s)).join("")}
    <input class="sx-mins" data-sxbind="limitDk" type="number" min="1" max="180" placeholder="özel" value="${ozel?d.limit/60:""}"></div></div>
  ${!arit?"":`
  <div class="sx-field"><div class="sx-label">Gösterim</div><div class="chips" style="margin:0">
    ${sxChip("kip","liste","Alt alta",d.kip!=="flash"&&d.kip!=="sesli","hepsi bir arada")}
    ${sxChip("kip","flash","Flash anzan",d.kip==="flash","tek tek yanıp söner")}
    ${sxChip("kip","sesli","Sesli",d.kip==="sesli","sayılar okunur")}</div></div>
  ${(d.kip==="flash"||d.kip==="sesli")?`
  <div class="sx-field"><div class="sx-label">Sayı hızı</div><div class="chips" style="margin:0">
    ${[1600,1200,900,700,500,350].map(h=>sxChip("hiz",h,(h/1000).toFixed(2).replace(/0$/,"")+" sn",d.hiz===h)).join("")}</div>
    <div class="sx-note">Bir sayının ekranda kalma (ya da okunma) süresi. Başlangıç seviyesinde 1,2 saniye, yarışmada 0,5 saniye civarı kullanılır.</div></div>`:""}
  <div class="sx-field"><div class="sx-label">Eksi işareti</div><div class="chips" style="margin:0">
    ${sxChip("eksiSag","0","Solda −5",!d.eksiSag)}${sxChip("eksiSag","1","Sağda 5−",d.eksiSag)}</div></div>`}
  <div class="sx-field"><div class="sx-label">Sınav güvenliği</div><div class="chips" style="margin:0">
    ${sxChip("tekDeneme",d.tekDeneme?0:1,"Tek deneme hakkı",d.tekDeneme,"giriş yapan öğrenci bir kez çözer")}</div>
    <div class="sx-label" style="margin-top:12px">Soru havuzu</div><div class="chips" style="margin:0">
      ${[0,10,15,20,25].map(h=>sxChip("havuz",h,h===0?"Kapalı":h+" soru sor",(d.havuz||0)===h)).join("")}</div>
    <div class="sx-note">Havuz açıkken sorulardan rastgele bu kadarı seçilir; her öğrenciye farklı soru gelir.</div></div>
  <div class="sx-field"><div class="sx-label">Seçenekler</div><div class="chips" style="margin:0">
    ${sxChip("geriBildirim",d.geriBildirim?0:1,"Her soruda doğru/yanlış göster",d.geriBildirim)}
    ${sxChip("gosterYanlis",d.gosterYanlis?0:1,"Bitince yanlışları öğrenciye göster",d.gosterYanlis)}
    ${sxChip("ses",d.ses?0:1,"Ses",d.ses)}</div></div>`;
}

/* --- SINAV SEKMESİ --- */
function vSinav(){
  if(SX.ekran==="coz") return sxCozEkran();
  if(SX.ekran==="sonuc") return sxSonucEkran();
  if(SX.ekran==="isim") return sxIsimEkran();
  if(SX.ekran==="ayar") return `<section class="page">
    <div class="eyebrow">Serbest alıştırma</div>
    <h2 style="margin:10px 0 18px">Kendine soru üret</h2>
    <div class="card pad" style="max-width:640px">${sxForm()}
      <div class="sx-row"><button class="btn" data-sx="alistirmaBasla"><i class="fa-solid fa-play"></i> Başla</button>
        <button class="btn ghost" data-sx="sinavGiris">Vazgeç</button></div></div></section>`;
  return `<section class="page">
    <div class="eyebrow">Sınav</div>
    <h2 style="margin:10px 0 8px">Sınava gir</h2>
    <p class="muted" style="max-width:52ch">Öğretmeninin verdiği altı haneli kodu yaz. Hesap açmana gerek yok.</p>
    <div class="grid g2" style="margin-top:24px">
      <div class="card pad">
        <div class="sx-field"><div class="sx-label">Sınav kodu</div>
          <input class="sx-in code" id="sxKod" maxlength="6" autocomplete="off" placeholder="ABC123"></div>
        <button class="btn" data-sx="kodGir" style="width:100%;justify-content:center"><i class="fa-solid fa-arrow-right-to-bracket"></i> Devam et</button>
        <div class="sx-note" id="sxKodNot"></div>
      </div>
      ${typeof cnlKatilKutusu==="function"?"":""}
      <div class="card pad">
        <span class="tag teal">Kodsuz</span>
        <h3 style="margin:12px 0 8px">Serbest alıştırma</h3>
        <p class="muted" style="font-size:14px">Seviye seç, süre koy, kendi kendine çalış. Sonuç kimseye gitmez.</p>
        <button class="btn ghost sm" data-sx="alistirmaAyar" style="margin-top:16px"><i class="fa-solid fa-calculator"></i> Alıştırmayı kur</button>
      </div>
    </div>
    ${typeof cnlKatilKutusu==="function"?cnlKatilKutusu():""}
    </section>`;
}
function sxIsimEkran(){
  const e=SX.exam, lim=e.limit?Math.round(e.limit/60)+" dakika":"süresiz";
  return `<section class="page"><div class="card pad" style="max-width:560px">
    <div class="eyebrow">${esc(e.sahipAd||"Sınav")}</div>
    <h2 style="margin:10px 0 6px">${esc(e.ad)}</h2>
    <p class="muted">${e.qs.length} soru · ${lim}</p>
    <div class="sx-field" style="margin-top:22px"><div class="sx-label">Adın soyadın</div>
      <input class="sx-in" id="sxIsim" autocomplete="name" placeholder="Ad Soyad" value="${esc(SX.ogrenci)}"></div>
    <div class="sx-row"><button class="btn" data-sx="basla"><i class="fa-solid fa-play"></i> Sınavı başlat</button>
      <button class="btn ghost" data-sx="sinavGiris">Geri</button></div></div></section>`;
}
function sxCozEkran(){
  return `<section class="page" style="padding-top:22px">
    <div class="sx-rail" id="sxRail"></div>
    <div class="card pad" style="max-width:560px;margin-inline:auto">
      <div class="sx-meta"><span id="sxIlerleme"></span><span id="sxClock">00:00</span></div>
      <div class="sx-stack" id="sxStack"></div>
      <div id="sxSecenekler"></div>
      ${(SX.exam && (SX.exam.kip==="flash"||SX.exam.kip==="sesli") && SX.alistirma)
        ? `<div style="text-align:center;margin-top:-6px"><button class="btn ghost sm" data-sx="tekrarOynat">Tekrar göster</button></div>` : ""}
      <div class="sx-answer" id="sxCevapKutu">
        <input id="sxCevap" type="text" inputmode="numeric" autocomplete="off" placeholder="?" aria-label="cevap">
        <button class="btn" data-sx="kontrol"><i class="fa-solid fa-check"></i> Kontrol</button></div>
      <div class="sx-verdict" id="sxHukum"></div>
      ${(SX.exam && SX.exam.kip==="sesli" && typeof sesDurumu==="function" && sesDurumu(aktifDil()==="ar"?"ar":"tr")!=="var")
        ? `<div class="sx-note" style="text-align:center">Cihazında bu dilin ses paketi yok; sayılar yazıyla gösterilecek.</div>`:""}
      ${(SX.alistirma && (SX.exam&&(SX.exam.ders||"aritmetik")==="aritmetik"))?`
        <div style="text-align:center;margin-top:10px">
          <button class="btn ghost sm" data-sx="abakusAc">${ABK.goster?"Abaküsü gizle":"Abaküsü göster"}</button></div>
        ${ABK.goster?`<div style="margin-top:12px">${abakusKutusu()}</div>`:""}`:""}
      <div class="sx-pad" id="sxPad">${[1,2,3,4,5,6,7,8,9].map(n=>`<button data-k="${n}">${n}</button>`).join("")}
        <button data-k="-">−</button><button data-k="0">0</button><button class="w" data-k="sil">⌫</button></div>
    </div>
    <div style="max-width:560px;margin:12px auto 0">
      <button class="btn ghost sm" data-sx="bitir">Sınavı bitir</button></div></section>`;
}
function sxSonucEkran(){
  const e=SX.exam, goster=SX.alistirma||e.gosterYanlis!==false;
  let yanlis="";
  if(goster){
    const m=SX.qs.map((q,i)=>({q,i})).filter(({q,i})=>SX.answers[i]!==q.c);
    yanlis=`<div style="border-top:1px solid rgba(20,26,51,.1);margin-top:20px;padding-top:16px">`+
      (m.length?`<div class="sx-label">Yanlış ve boş kalanlar · ${m.length}</div>`+m.map(({q,i})=>{
        const ben=SX.answers[i]===null?`<span class="mine skip">boş</span>`:`<span class="mine">${SX.answers[i]}</span>`;
        return `<div class="sx-miss"><span class="i">${i+1}</span><span class="q">${q.t.map(v=>sayiYaz(v,e.eksiSag)).join("  ")}</span>${ben}<span class="real">${q.c}</span></div>`}).join("")
      :`<div class="sx-label">Sonuç</div><p class="muted" style="margin-top:8px">Hepsi doğru. Tam puan.</p>`)+`</div>`;
  }
  return `<section class="page"><div class="card pad" style="max-width:560px;margin-inline:auto">
    ${SX.sureBitti?`<div style="text-align:center;font-family:var(--mono);font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#C0392B;margin-bottom:10px">Süre doldu</div>`:""}
    <div class="muted" style="text-align:center;font-size:13px">${esc([SX.ogrenci,SX.alistirma?"":SX.exam.ad].filter(Boolean).join(" · "))}</div>
    <div class="sx-score">${SX._dogru}<small>/${SX.qs.length}</small></div>
    <div class="sx-stats">
      <div class="sx-stat"><b>${SX._cevap?Math.round(SX._dogru/SX._cevap*100):0}%</b><span>isabet</span></div>
      <div class="sx-stat"><b>${sure(SX._sure)}</b><span>süre</span></div>
      <div class="sx-stat"><b>${SX._cevap?(SX._sure/SX._cevap/1000).toFixed(1)+"s":"—"}</b><span>soru başına</span></div></div>
    ${SX.alistirma?"":`<p class="muted" style="text-align:center;font-size:13px">${SX._kaydedildi?"Sonucun öğretmene iletildi.":"Sonuç kaydedilemedi, öğretmenine haber ver."}</p>`}
    <div class="sx-row" style="margin-top:16px">
      ${SX.alistirma?`<button class="btn" data-sx="tekrar"><i class="fa-solid fa-rotate-right"></i> Yeniden çöz</button>`:""}
      ${goster?`<button class="btn ghost" data-sx="yanlislar"><i class="fa-solid fa-list-check"></i> Yanlışları çöz</button>`:""}
      <button class="btn ghost" data-sx="sinavGiris">Bitir</button></div>
    ${yanlis}</div></section>`;
}

/* --- PROFİL SEKMESİ --- */
function vProfil(){
  if(!SX.user) return sxGirisEkran();
  if(SX.user.durum!=="onayli") return sxBekleEkran();
  if(SX.canli && typeof cnlEkran==="function") return cnlEkran();
  if(SX.tekrar && typeof srsEkran==="function") return srsEkran();
  if(SX.karne) return vKarne();
  if(SX.user.rol==="veli") return sxVeliProfil();
  if(SX.user.rol==="ogrenci") return sxOgrenciProfil();
  if(SX.pekran==="editor") return sxEditor();
  if(SX.pekran==="yayin") return sxYayin();
  if(SX.pekran==="sonuclar") return sxSonuclar();
  if(SX.pekran==="ogrenci") return sxOgrenciDetay();
  return sxPanel();
}
function sxGirisEkran(){
  const kayit=SX.pekran==="kayit", rol=SX.kayitRol||"ogrenci";
  return `<section class="page">
    <div class="eyebrow">Hesap</div>
    <h2 style="margin:10px 0 8px">${kayit?"Kayıt ol":"Giriş yap"}</h2>
    <p class="muted" style="max-width:54ch">Öğrenciler sınav geçmişini, ödevlerini ve sertifikalarını görmek için; öğretmenler sınav hazırlamak ve öğrenci takibi için hesap açar.</p>
    <div class="card pad" style="max-width:500px;margin-top:22px">
      ${!bulut()?`<div class="uyari" style="cursor:default;border-color:rgba(192,57,43,.4);background:rgba(192,57,43,.08)">
        <span class="uyari-nokta" style="background:#C0392B;box-shadow:0 0 0 4px rgba(192,57,43,.18)"></span>
        <div><b>Deneme modu</b><div class="s">Hesaplar yalnız bu cihazda saklanıyor. Başka telefondan aynı hesaba girilemez.
        Bunun için js/config.js dosyasındaki FIREBASE ayarları doldurulmalı.</div></div></div>`:""}
      <div class="sx-tabs">
        <button data-sx="ptab2" data-v="giris" aria-pressed="${!kayit}">Giriş yap</button>
        <button data-sx="ptab2" data-v="kayit" aria-pressed="${kayit}">Kayıt ol</button></div>
      ${kayit?`
      <div class="sx-field"><div class="sx-label">Kim için</div><div class="chips" style="margin:0">
        <button class="chip" data-sx="rolSec" data-v="ogrenci" aria-pressed="${rol==="ogrenci"}">Öğrenciyim</button>
        <button class="chip" data-sx="rolSec" data-v="veli" aria-pressed="${rol==="veli"}">Veliyim</button>
        <button class="chip" data-sx="rolSec" data-v="ogretmen" aria-pressed="${rol==="ogretmen"}">Öğretmenim</button></div>
        <div class="sx-note" style="margin-top:8px">${rol==="ogretmen"
          ? "Öğretmen hesapları yönetici onayından sonra kullanılabilir."
          : rol==="veli" ? "Veli hesapları hemen açılır. Çocuğunun profilindeki veli kodunu gireceksin."
          : "Öğrenci hesapları hemen açılır."}</div></div>
      <div class="sx-field"><div class="sx-label">Ad soyad</div>
        <input class="sx-in" id="sxAd" autocomplete="name" placeholder="Ad Soyad"></div>
      ${rol==="veli"?`<div class="sx-field"><div class="sx-label">Veli kodu</div>
        <input class="sx-in" id="sxSinifKodu" maxlength="6" autocomplete="off" placeholder="ABC123" style="text-transform:uppercase">
        <div class="sx-note">Çocuğun kendi profilinde görünen altı haneli kod.</div></div>`:""}
      ${rol==="ogrenci"?`<div class="sx-field"><div class="sx-label">Öğretmen kodu</div>
        <input class="sx-in" id="sxSinifKodu" maxlength="6" autocomplete="off" placeholder="ABC123" style="text-transform:uppercase">
        <div class="sx-note">Öğretmeninin verdiği altı haneli kod. Bilmiyorsan boş bırak, sonra eklenebilir.</div></div>`:""}
      `:""}
      <div class="sx-field"><div class="sx-label">E-posta</div>
        <input class="sx-in" id="sxMail" type="email" inputmode="email" autocomplete="email" placeholder="ornek@mail.com"></div>
      <div class="sx-field"><div class="sx-label">Şifre</div>
        <input class="sx-in" id="sxSifre" type="password" autocomplete="${kayit?"new-password":"current-password"}" placeholder="en az 6 karakter"></div>
      <button class="btn" style="width:100%;justify-content:center" data-sx="${kayit?"kayitOl":"girisYap"}">${kayit?"Hesap oluştur":"Giriş yap"}</button>
      ${kayit?"":`<div style="margin-top:12px;text-align:center"><button class="linkish" data-sx="sifreUnuttum"><i class="fa-solid fa-key"></i> Şifremi unuttum</button></div>`}
      <div class="sx-note" id="sxAuthNot"></div>
    </div>
    ${dilSecici()}
    </section>`;
}
function sxBekleEkran(){
  const kapali=SX.user.durum==="kapali";
  return `<section class="page"><div class="card pad" style="max-width:520px">
    <h2 style="margin-bottom:10px">${kapali?"Hesabın kapalı":"Hesabın onay bekliyor"}</h2>
    <p class="muted">${kapali?"Bu hesabın erişimi yönetici tarafından durduruldu.":"Yönetici onayladıktan sonra panele girebilirsin. Onaylandığında tekrar giriş yap."}</p>
    <div class="sx-user" style="margin-top:18px"><b>${esc(SX.user.ad)}</b><span>${esc(SX.user.mail)}</span>
      <span class="sx-badge ${kapali?"no":"wait"}">${kapali?"kapalı":"bekliyor"}</span></div>
    <div class="sx-row">
      <button class="btn" data-sx="durumKontrol"><i class="fa-solid fa-rotate"></i> Durumu kontrol et</button>
      ${(ADMIN_EMAIL && String(SX.user.mail||"").trim().toLowerCase()===String(ADMIN_EMAIL).trim().toLowerCase())
        ? `<button class="btn" data-sx="yoneticiAc"><i class="fa-solid fa-key"></i> Yönetici olarak aç</button>` : ""}
      <button class="btn ghost" data-sx="cikis"><i class="fa-solid fa-arrow-right-from-bracket"></i> Çıkış yap</button></div>
    <div class="sx-note" id="sxDurumNot">Yönetici onayladıysa bu düğme seni panele alır.</div>
    </div></section>`;
}
function sxPanel(){
  const u=SX.user, yon=u.yonetici;
  const bekleyen=SX.hesaplar.filter(h=>h.durum==="bekliyor"&&h.rol!=="ogrenci").length;
  const govde = SX.ptab==="ogrenciler" ? sxOgrenciListe()
              : SX.ptab==="sinif" ? (duyuruKutusu(true)+programKutusu(true))
              : SX.ptab==="ayarlar" ? sxOgretmenAyar()
              : (yon&&SX.ptab==="hesaplar") ? sxHesapListe()
              : sxSinavListe();
  return `<section class="page">
    <div class="card pad">
      <div class="sx-user"><b>${esc(u.ad)}</b><span>${esc(u.mail)}</span>
        ${yon?`<span class="sx-badge ok">yönetici</span>`:`<span class="sx-badge ok">öğretmen</span>`}
        ${u.sinifKodu?`<span class="sx-badge">${t("sinifKodu2")} ${esc(u.sinifKodu)}</span>`:""}
        <span style="margin-inline-start:auto"></span>
        <button class="btn ghost sm" data-sx="cikis"><i class="fa-solid fa-arrow-right-from-bracket"></i> Çıkış yap</button></div>
      ${(yon&&bekleyen)?`<div class="uyari" data-sx="ptab" data-v="hesaplar" role="button" tabindex="0">
        <span class="uyari-nokta"></span>
        <div><b>${bekleyen} hesap onayını bekliyor</b>
        <div class="s">Onaylamadığın öğretmenler panele giremez. Görmek için dokun.</div></div>
        <span class="uyari-ok">→</span></div>`:""}
      <div class="sx-tabs">
        <button data-sx="ptab" data-v="sinavlar" aria-pressed="${SX.ptab==="sinavlar"}"><i class="fa-solid fa-file-pen"></i>Sınavlarım</button>
        <button data-sx="ptab" data-v="ogrenciler" aria-pressed="${SX.ptab==="ogrenciler"}"><i class="fa-solid fa-user"></i>Öğrencilerim${(SX.ogrenciler||[]).length?` (${SX.ogrenciler.length})`:""}</button>
        <button data-sx="ptab" data-v="sinif" aria-pressed="${SX.ptab==="sinif"}"><i class="fa-solid fa-bullhorn"></i>Sınıf</button>
        ${yon?`<button data-sx="ptab" data-v="hesaplar" aria-pressed="${SX.ptab==="hesaplar"}"><i class="fa-solid fa-users"></i>Hesaplar${bekleyen?` (${bekleyen})`:""}</button>`:""}
        <button data-sx="ptab" data-v="ayarlar" aria-pressed="${SX.ptab==="ayarlar"}"><i class="fa-solid fa-gear"></i>Ayarlar</button>
      </div>
      ${govde}
    </div>
    ${bildirimKutusu()}

    </section>`;
}
function sxOgretmenAyar(){
  const u=SX.user;
  return `<div class="card pad" style="margin-top:14px">
      <h3 style="margin-bottom:12px">Hesap</h3>
      <div class="sx-item" style="border:0;padding-top:0">
        <div class="g"><b>Sınıf kodun</b><div class="s">Öğrencilerine bu kodu ver</div></div>
        <span class="sx-pill">${esc(u.sinifKodu||"—")}</span></div>
      <div class="sx-item"><div class="g"><b>${esc(u.mail)}</b>
        <div class="s">${u.yonetici?"yönetici":"öğretmen"}</div></div></div>
    </div>
    ${dilSecici()}`;
}
function sxSinavListe(){
  const l=SX.sinavlar;
  return `<h3 style="margin:6px 0 14px">Sınavlarım</h3>
    <button class="btn" data-sx="yeniSinav" style="margin-bottom:18px"><i class="fa-solid fa-plus"></i> Yeni sınav oluştur</button>
    ${l.length?l.map(x=>`
      <div class="sx-item"><div class="g"><b>${esc(x.ad)}</b>
        <div class="s">${x.qs.length} ${t("soru")} · ${x.limit?Math.round(x.limit/60)+" "+t("dakika"):t("suresiz")} · ${x.acik===false?t("kapaliDurum"):t("acikDurum")}</div></div>
        <span class="sx-badge">${dersBul(x.ders).ico} ${esc(ceviri(dersBul(x.ders).ad))}</span>
        <span class="sx-pill">${x.kod}</span></div>
      <div class="sx-row" style="margin:-6px 0 14px">
        <button class="btn sm" data-cnl="odaAc" data-v="${x.kod}"><i class="fa-solid fa-bolt"></i> Canlı başlat</button>
        <button class="btn ghost sm" data-sx="sonucAc" data-v="${x.kod}"><i class="fa-solid fa-chart-simple"></i> Sonuçlar</button>
        <button class="btn ghost sm" data-sx="duzenle" data-v="${x.kod}"><i class="fa-solid fa-pen"></i> Düzenle</button>
        <button class="btn ghost sm" data-sx="acKapa" data-v="${x.kod}"><i class="fa-solid fa-eye"></i> Aç / kapat</button>
        <button class="btn ghost sm" data-sx="sinavSil" data-v="${x.kod}"><i class="fa-solid fa-trash"></i> Sil</button></div>`).join("")
      :`<div class="sx-empty">Henüz sınav yok. Yeni sınav oluştur ile başla; kodu öğrencilere ver, sonuçlar buraya düşsün.</div>`}`;
}
function sxHesapListe(){
  const rozet=u=>u.durum==="onayli"?`<span class="sx-badge ok">onaylı</span>`
    :u.durum==="kapali"?`<span class="sx-badge no">kapalı</span>`:`<span class="sx-badge wait">bekliyor</span>`;
  const dugme=u=>{
    if(u.yonetici) return "";
    const b=[];
    if(u.durum==="bekliyor"){ b.push(`<button class="btn sm" data-sx="durum" data-v="${u.uid}" data-s="onayli">Onayla</button>`);
      b.push(`<button class="btn ghost sm" data-sx="hesapSil" data-v="${u.uid}">Reddet</button>`); }
    else if(u.durum==="onayli") b.push(`<button class="btn ghost sm" data-sx="durum" data-v="${u.uid}" data-s="kapali">Askıya al</button>`);
    else b.push(`<button class="btn ghost sm" data-sx="durum" data-v="${u.uid}" data-s="onayli">Yeniden aç</button>`);
    b.push(u.rol==="ogrenci"
      ? `<button class="btn ghost sm" data-sx="rolDegis" data-v="${u.uid}" data-s="ogretmen">Öğretmen yap</button>`
      : `<button class="btn ghost sm" data-sx="rolDegis" data-v="${u.uid}" data-s="ogrenci">Öğrenci yap</button>`);
    if(u.durum!=="bekliyor") b.push(`<button class="btn ghost sm" data-sx="hesapSil" data-v="${u.uid}">Sil</button>`);
    return `<div class="sx-row" style="margin:-6px 0 14px">${b.join("")}</div>`;
  };
  const satir=u=>`<div class="sx-item"><div class="g"><b>${esc(u.ad||u.mail)}</b>
    <div class="s">${esc(u.mail)} · ${u.rol==="ogrenci"?"öğrenci":u.yonetici?"yönetici":"öğretmen"} · ${new Date(u.at||Date.now()).toLocaleDateString("tr-TR")}</div></div>${rozet(u)}</div>${dugme(u)}`;
  const bek=SX.hesaplar.filter(u=>u.durum==="bekliyor"&&u.rol!=="ogrenci");
  const dig=SX.hesaplar.filter(u=>u.durum!=="bekliyor"||u.rol==="ogrenci").sort((a,b)=>(b.yonetici?1:0)-(a.yonetici?1:0));
  return `<h3 style="margin:6px 0 14px">Hesaplar</h3>
    <div class="sx-label">Onay bekleyen · ${bek.length}</div>
    ${bek.length?bek.map(satir).join(""):`<div class="sx-empty">Bekleyen hesap yok.</div>`}
    <div class="sx-label" style="margin-top:20px">Kayıtlı hesaplar</div>
    ${dig.length?dig.map(satir).join(""):`<div class="sx-empty">Kayıtlı hesap yok.</div>`}
    <button class="btn ghost sm" data-sx="hesapYenile" style="margin-top:14px"><i class="fa-solid fa-rotate-right"></i> Yenile</button>`;
}
function sxEditor(){
  const d=SX.taslak;
  return `<section class="page"><div class="card pad">
    <h2 style="margin-bottom:16px">${d.kod?"Sınavı düzenle":"Yeni sınav"}</h2>
    <div class="sx-field"><div class="sx-label">Sınav adı</div>
      <input class="sx-in" data-sxbind="ad" placeholder="3. Sınıf — 1. Deneme" value="${esc(d.ad)}"></div>
    ${sxForm()}
    <div class="sx-row"><button class="btn" data-sx="sinavKaydet">${d.kod?"Değişiklikleri kaydet":"Sınavı yayınla"}</button>
      <button class="btn ghost" data-sx="panel"><i class="fa-solid fa-arrow-left"></i> Geri</button></div></div></section>`;
}
function sxYayin(){
  const d=SX.taslak, adres=location.href.split("#")[0]+"#/sinav";
  const mesaj=`${d.ad}\nSınav kodu: ${d.kod}\n${adres}`;
  return `<section class="page"><div class="card pad" style="max-width:520px;text-align:center">
    <div class="sx-label">Sınav yayında</div>
    <div class="sx-score" style="font-size:clamp(34px,9vw,50px);letter-spacing:.14em">${d.kod}</div>
    <p class="muted" style="margin:14px 0 12px">Öğrencilere şunu gönder:</p>
    <textarea class="sx-ta" id="sxPay" readonly style="min-height:88px;text-align:start">${esc(mesaj)}</textarea>
    <div class="sx-row" style="justify-content:center;margin-top:12px">
      <button class="btn ghost sm" data-sx="kopyala"><i class="fa-solid fa-copy"></i> Kopyala</button>
      <button class="btn ghost sm" data-sx="whatsapp"><i class="fa-brands fa-whatsapp"></i> WhatsApp</button></div>
    <button class="btn" data-sx="panel" style="margin-top:16px"><i class="fa-solid fa-arrow-left"></i> Panele dön</button></div></section>`;
}
function sxSonuclar(){
  return `<section class="page"><div class="card pad">
    <h2 id="sxSonucBaslik" style="margin-bottom:14px">Sonuçlar</h2>
    <div id="sxSonucGovde"><div class="sx-empty">Yükleniyor…</div></div>
    <div class="sx-row" style="margin-top:16px">
      <button class="btn ghost sm" data-sx="sonucYenile"><i class="fa-solid fa-rotate-right"></i> Yenile</button>
      <button class="btn ghost sm" data-sx="csv"><i class="fa-solid fa-file-csv"></i> CSV indir</button>
      <button class="btn ghost sm" data-sx="panel"><i class="fa-solid fa-arrow-left"></i> Geri</button></div></div></section>`;
}
function sonucBoya(){
  const g=$("sxSonucGovde"); if(!g) return;
  const s=SX.sonuclar;
  if(!s.length){ g.innerHTML=`<div class="sx-empty">Henüz kimse çözmedi. Kodu paylaştıktan sonra sonuçlar buraya düşer.</div>`; return; }
  const ort=Math.round(s.reduce((a,r)=>a+r.dogru/r.toplam*100,0)/s.length);
  g.innerHTML=`<div class="sx-stats">
      <div class="sx-stat"><b>${s.length}</b><span>öğrenci</span></div>
      <div class="sx-stat"><b>${ort}%</b><span>ortalama</span></div>
      <div class="sx-stat"><b>${s[0].dogru}/${s[0].toplam}</b><span>en iyi</span></div></div>`
   + s.map((r,i)=>{
      const y=Math.round(r.dogru/r.toplam*100), acik=SX.acikSonuc===r._k;
      let det="";
      if(acik){
        const d=Array.isArray(r.dokum)?r.dokum:[];
        det=`<div style="padding:4px 0 12px"><div class="sx-label">Cevap dökümü</div>`+
          d.map((x,qi)=>{
            const ben=x.a===null||x.a===undefined?`<span class="mine skip">boş</span>`
              :(x.a===x.c?`<span class="real">${x.a}</span>`:`<span class="mine">${x.a}</span>`);
            return `<div class="sx-miss"><span class="i">${qi+1}</span><span class="q">${esc(x.q)}</span>${ben}<span class="real">${x.c}</span></div>`}).join("")+
          `<button class="btn ghost sm" data-sx="sonucSil" data-v="${r._k}" style="margin-top:10px">Bu sonucu sil</button></div>`;
      }
      return `<div class="sx-rank" data-sx="sonucAcKapa" data-v="${r._k}">
        <span class="n">${i+1}</span>
        <span class="nm">${esc(r.ad)}<div class="sx-bar"><i style="width:${y}%"></i></div></span>
        <span class="sc">${r.dogru}/${r.toplam}</span>
        <span class="tm">${sure(r.sure)}</span></div>${det}`;
   }).join("");
}

function vGizlilik(){
  const i=DATA.hakkimizda.iletisim;
  return `<section class="page"><div class="card pad legal" style="max-width:720px">
    <div class="eyebrow">Yasal</div>
    <h2 style="margin:10px 0 6px">Gizlilik ve KVKK aydınlatma metni</h2>
    <p class="muted" style="font-size:13px">Son güncelleme: ${new Date().toLocaleDateString("tr-TR")}</p>
    <h3>Hangi bilgileri topluyoruz</h3>
    <p>Sınav sırasında öğrencinin yazdığı ad, verdiği cevaplar, doğru sayısı ve harcadığı süre kaydedilir. Öğretmen hesapları için ad soyad ve e-posta adresi saklanır. Çerez kullanmıyoruz; tarayıcıda yalnız oturumun açık kalmasını sağlayan bir kayıt tutulur.</p>
    <h3>Neden topluyoruz</h3>
    <p>Öğrencinin gelişimini öğretmenine göstermek ve sınav sonuçlarını değerlendirmek için. Bu veriler reklam amacıyla kullanılmaz, üçüncü kişilere satılmaz.</p>
    <h3>Nerede saklanıyor</h3>
    <p>Veriler Google Firebase altyapısında tutulur. Sonuçlara yalnız sınavı oluşturan öğretmen ve kurum yöneticisi erişebilir.</p>
    <h3>18 yaş altı</h3>
    <p>Öğrencilerimiz çocuk olduğu için kayıt sırasında yalnız ad bilgisi istenir; telefon, adres, fotoğraf gibi veriler toplanmaz. Velinin açık rızası kayıt formunda alınır.</p>
    <h3>Haklarınız</h3>
    <p>KVKK 11. madde kapsamında verilerinizin silinmesini, düzeltilmesini veya bir kopyasını isteyebilirsiniz. Talebinizi <a href="mailto:${esc(ceviri(i.mail))}">${esc(ceviri(i.mail))}</a> adresine yazmanız yeterli; en geç 30 gün içinde dönüş yapılır.</p>
    <h3>İletişim</h3>
    <p>${esc(ceviri(DATA.marka.ad))} · ${esc(ceviri(i.adres))} · ${esc(ceviri(i.telefon))}</p>
    <a class="btn ghost sm" href="#/" style="margin-top:14px">Ana sayfaya dön</a>
  </div>
    <p class="muted" style="font-size:12px;margin-top:24px;border-top:1px solid rgba(20,26,51,.1);padding-top:12px">
      Uygulama simgesi <a href="https://fontawesome.com" target="_blank" rel="noopener">Font Awesome Free</a>
      simgesinden türetilmiştir · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>
    </p>
  </section>`;
}
const GIZLI_SAYFA={yol:"/gizlilik",ad:"Gizlilik",gor:vGizlilik};


/* ======================= AYARLAR: DİL ======================= */
function dilSecici(){
  return `<div class="card pad" style="margin-top:14px">
    <h3 style="margin-bottom:4px">${t("ayarlar")}</h3>
    <p class="muted" style="font-size:13.5px;margin-bottom:14px">${t("dilAcik")}</p>
    <div class="sx-label">${t("dil")}</div>
    <div class="chips" style="margin:0">
      ${Object.keys(DILLER).map(k=>`<button class="chip" data-sx="dilSec" data-v="${k}"
        aria-pressed="${aktifDil()===k}" lang="${k}">${DILLER[k].ad}<small>${DILLER[k].kisa}</small></button>`).join("")}
    </div></div>`;
}

/* ======================= ÖĞRENCİ PROFİLİ ======================= */
function tarihKisa(t){ return new Date(t).toLocaleDateString("tr-TR",{day:"numeric",month:"short",year:"numeric"}); }
function tarihSaat(t){ return new Date(t).toLocaleString("tr-TR",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}); }
function yuzde(r){ return Math.round(r.dogru/r.toplam*100); }

function sxOgrenciProfil(){
  const u=SX.user, s=SX.ogrSonuc||[], o=SX.ogrOdev||[], c=SX.ogrSertifika||[];
  const ort = s.length? Math.round(s.reduce((a,r)=>a+yuzde(r),0)/s.length) : 0;
  const bekleyen=o.filter(x=>x.durum!=="tamamlandi");
  const enIyi = s.length? Math.max(...s.map(yuzde)) : 0;
  const tab=SX.otab||"ozet";

  const sekmeler=[
    {k:"ozet",  ad:"Özet",       ico:"house"},
    {k:"odev",  ad:"Ödevlerim",  ico:"clipboard-check", nokta:bekleyen.length>0},
    {k:"sonuc", ad:"Sonuçlarım", ico:"chart-simple"},
    {k:"belge", ad:"Belgelerim", ico:"award"},
    {k:"ayar",  ad:"Ayarlar",    ico:"gear"}
  ];

  const govde = {
    /* --- ÖZET: durum, seri, tekrar, duyuru, program --- */
    ozet: ()=>`
      <div class="sx-stats" style="grid-template-columns:repeat(4,1fr)">
        <div class="sx-stat"><b>${s.length}</b><span>sınav</span></div>
        <div class="sx-stat"><b>${ort}%</b><span>ortalama</span></div>
        <div class="sx-stat"><b>${enIyi}%</b><span>en iyi</span></div>
        <div class="sx-stat"><b>${c.length}</b><span>sertifika</span></div>
      </div>
      ${devamOzeti(SX.ogrYoklama)}
      ${bildirimKutusu()}
      ${typeof srsOzetKutusu==="function"?srsOzetKutusu():""}
      ${oyunKutusu(s,o,c)}
      ${duyuruKutusu(false)}
      ${programKutusu(false)}`,

    /* --- ÖDEVLER --- */
    odev: ()=>`
      <div class="card pad" style="margin-top:14px">
        <h3 style="margin-bottom:4px">Ödevlerim</h3>
        <p class="muted" style="font-size:13.5px;margin-bottom:12px">${bekleyen.length?`${bekleyen.length} ödev bekliyor.`:"Bekleyen ödevin yok."}</p>
        ${o.length? o.slice().sort((a,b)=>(b.at||0)-(a.at||0)).map(x=>{
          const gecti = x.durum!=="tamamlandi" && x.sonTarih && new Date(x.sonTarih).getTime()<Date.now();
          return `<div class="sx-item"><div class="g">
            <b>${esc(x.baslik)}</b>
            <div class="s">${x.ders?dersAd(x.ders)+" · ":""}${x.aciklama?esc(x.aciklama)+" · ":""}${x.sonTarih?"son tarih "+tarihKisa(x.sonTarih):""}${x.sinavKodu?" · kod "+esc(x.sinavKodu):""}</div></div>
            ${x.durum==="tamamlandi"?`<span class="sx-badge ok">tamamlandı</span>`
              :gecti?`<span class="sx-badge no">gecikti</span>`:`<span class="sx-badge wait">bekliyor</span>`}</div>
            ${x.durum==="tamamlandi"?"":`<div class="sx-row" style="margin:-6px 0 14px">
              ${x.sinavKodu?`<button class="btn sm" data-sx="odevSinava" data-v="${esc(x.sinavKodu)}"><i class="fa-solid fa-file-pen"></i> Sınava git</button>`:""}
              <button class="btn ghost sm" data-sx="odevTamam" data-v="${x.id}"><i class="fa-solid fa-check"></i> Yaptım olarak işaretle</button></div>`}`;
        }).join("") : `<div class="sx-empty">Henüz ödev verilmedi.</div>`}
      </div>`,

    /* --- SONUÇLAR: geçmiş, analiz, karne --- */
    sonuc: ()=>`
      <div class="card pad" style="margin-top:14px">
        <div class="sx-user"><b>Sınav geçmişim</b><span style="margin-inline-start:auto"></span>
          <button class="btn sm" data-sx="karneAc"><i class="fa-solid fa-id-card"></i> Karnem</button></div>
        ${s.length? s.slice().sort((a,b)=>(b.at||0)-(a.at||0)).map(r=>`
          <div class="sx-rank" style="cursor:default">
            <span class="nm">${esc(r.sinavAd||"Sınav")}
              <div class="s" style="font-family:var(--mono);font-size:11.5px;color:var(--gece-2);margin-top:3px">${tarihSaat(r.at)}${r.ders?" · "+dersAd(r.ders):""}</div>
              <div class="sx-bar"><i style="width:${yuzde(r)}%"></i></div></span>
            <span class="sc">${r.dogru}/${r.toplam}</span>
            <span class="tm">${yuzde(r)}%</span></div>`).join("")
          : `<div class="sx-empty">Henüz sınav çözmedin. Sınav sekmesinden kodla girebilir ya da bir dersin Alıştır bölümünden çalışabilirsin.</div>`}
      </div>
      ${analizKutusu(s,true)}`,

    /* --- BELGELER: sertifikalar ve kurs ilerlemesi --- */
    belge: ()=>`
      <div class="card pad" style="margin-top:14px">
        <h3 style="margin-bottom:4px">Sertifikalarım</h3>
        <p class="muted" style="font-size:13.5px;margin-bottom:14px">Öğretmenin bir kursu tamamladığını onayladığında burada belirir.</p>
        ${c.length? `<div class="grid g2">`+c.map(x=>sertifikaKarti(x,u)).join("")+`</div>`
          : `<div class="sx-empty">Henüz sertifikan yok.</div>`}
      </div>
      <div class="card pad" style="margin-top:14px">
        <h3 style="margin-bottom:12px">Kurs ilerlemem</h3>
        ${(DATA.kurslar||[]).map(k=>{
          const kad=ceviri(k.ad);
          const bitti=c.some(x=>ceviri(x.kurs)===kad);
          return `<div class="sx-item"><div class="g"><b>${esc(kad)}</b>
            <div class="s">${esc(ceviri(k.not)||"")}</div>
            <div class="sx-bar" style="margin-top:6px"><i style="width:${bitti?100:0}%"></i></div></div>
            <span class="sx-badge ${bitti?"ok":""}">${bitti?"tamamlandı":"devam ediyor"}</span></div>`;
        }).join("")}
      </div>`,

    /* --- AYARLAR: veli kodu, öğretmen bağı, dil --- */
    ayar: ()=>`
      <div class="card pad" style="margin-top:14px">
        <h3 style="margin-bottom:12px">Hesap</h3>
        <div class="sx-item" style="border:0;padding-top:0">
          <div class="g"><b>Veli kodun</b><div class="s">Annen ya da baban bu kodla kayıt olup gelişimini görebilir</div></div>
          <span class="sx-pill">${esc(u.veliKodu||"—")}</span></div>
        ${!u.ogretmen?`<div class="sx-field" style="margin-top:10px">
          <div class="sx-label">Öğretmenine bağlan</div>
          <div class="sx-row" style="margin:0">
            <input class="sx-in" id="sxBagKod" maxlength="6" placeholder="ABC123" style="max-width:180px;text-transform:uppercase">
            <button class="btn sm" data-sx="ogretmeneBaglan"><i class="fa-solid fa-link"></i> Bağlan</button></div>
          <div class="sx-note" id="sxBagNot">Öğretmenin kodunu girersen ödevlerin ve gelişimin ona görünür.</div></div>`
        :`<div class="sx-item"><div class="g"><b>Öğretmenin</b><div class="s">${esc(u.ogretmenAd||"")}</div></div></div>`}
      </div>
      ${dilSecici()}`
  }[tab] || (()=>"");

  return `<section class="page">
    <div class="card pad">
      <div class="sx-user"><b>${esc(u.ad)}</b><span>${esc(u.mail)}</span>
        <span class="sx-badge ok">öğrenci</span>
        ${u.ogretmenAd?`<span class="sx-badge">öğretmen: ${esc(u.ogretmenAd)}</span>`:`<span class="sx-badge wait">öğretmen bağlı değil</span>`}
        <span style="margin-inline-start:auto"></span>
        <button class="btn ghost sm" data-sx="cikis"><i class="fa-solid fa-arrow-right-from-bracket"></i> Çıkış yap</button></div>
      <div class="sx-tabs" style="flex-wrap:wrap">
        ${sekmeler.map(x=>`<button data-otab="${x.k}" aria-pressed="${tab===x.k}">
          <i class="fa-solid fa-${x.ico}"></i>${esc(x.ad)}${x.nokta?`<span class="sekme-nokta"></span>`:""}</button>`).join("")}
      </div>
    </div>
    ${govde()}
  </section>`;
}

function sertifikaKarti(x,u){
  return `<div class="sertifika" id="sert-${x.id}">
    <div class="ser-ust">${esc(ceviri(DATA.marka.ad))}</div>
    <div class="ser-baslik">${t("belgeBaslik")}</div>
    <div class="ser-ad">${esc(u.ad)}</div>
    <div class="ser-metin">${esc(ceviri(x.kurs))} ${t("belgeMetin")}</div>
    ${x.not?`<div class="ser-not">${esc(x.not)}</div>`:""}
    <div class="ser-alt"><span>${tarihKisa(x.at)}</span><span>${esc(x.verenAd||"")}</span></div>
    ${(()=>{ const adres=location.href.split("#")[0]+"#/dogrula?b="+encodeURIComponent((u.uid||"")+":"+x.id);
       return `<div class="ser-qr">
         <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&margin=0&data=${encodeURIComponent(adres)}" alt="doğrulama karekodu" loading="lazy">
         <span>Karekodu okutarak belgenin gerçekliğini doğrulayabilirsiniz.</span></div>`; })()}
    <button class="btn ghost sm ser-yazdir" data-sx="sertYazdir" data-v="${x.id}"><i class="fa-solid fa-print"></i> Yazdır / PDF</button>
  </div>`;
}

/* ======================= ÖĞRETMEN: ÖĞRENCİLERİM ======================= */
function sxOgrenciListe(){
  const l=SX.ogrenciler||[], u=SX.user;
  return `<h3 style="margin:6px 0 6px">Öğrencilerim</h3>
    <p class="muted" style="font-size:13.5px;margin-bottom:14px">${t("sinifKoduAcik")}</p>
    <div class="sx-item" style="border:0;padding-top:0">
      <div class="g"><b>Sınıf kodun</b><div class="s">Öğrencilerine bu kodu ver</div></div>
      <span class="sx-pill">${esc(u.sinifKodu||"—")}</span></div>
    ${sxYoklamaKutusu()}
    <div class="toplu-odev">
      <div class="sx-label">Tüm sınıfa ödev ver</div>
      <div class="sx-field" style="margin-bottom:8px"><input class="sx-in" id="topBaslik" placeholder="Ödev başlığı — ör. 20 soruluk hız denemesi"></div>
      <div class="sx-row" style="margin:0">
        <input class="sx-in" id="topKod" maxlength="6" placeholder="sınav kodu" style="max-width:150px;text-transform:uppercase">
        <input class="sx-in" id="topTarih" type="date" style="max-width:190px">
        <button class="btn" data-sx="topluOdev"><i class="fa-solid fa-users"></i> ${(SX.ogrenciler||[]).length} öğrenciye gönder</button></div>
      <div class="sx-note" id="topNot">Aynı ödev bağlı bütün öğrencilere tek seferde gider.</div>
    </div>
    ${l.length? l.map(o=>{
      const say=(SX.ogrOzet&&SX.ogrOzet[o.uid])||{sinav:0,ort:0,odev:0};
      return `<div class="sx-item"><div class="g"><b>${esc(o.ad)}</b>
        <div class="s">${esc(o.mail)} · son giriş ${o.sonGiris?tarihSaat(o.sonGiris):"—"}</div></div>
        <span class="sx-badge ok">${say.sinav} ${t("sinavAdet")}</span></div>
      <div class="sx-row" style="margin:-6px 0 14px">
        <button class="btn ghost sm" data-sx="ogrenciAc" data-v="${o.uid}"><i class="fa-solid fa-user"></i> Detay ve ödev</button></div>`;
    }).join("") : `<div class="sx-empty">Henüz öğrenci bağlı değil. Sınıf kodunu paylaş, öğrencilerin kayıt olurken girsin.</div>`}
    <button class="btn ghost sm" data-sx="ogrenciYenile" style="margin-top:8px"><i class="fa-solid fa-rotate-right"></i> Yenile</button>`;
}
function sxOgrenciDetay(){
  const o=SX.acikOgrenci; if(!o) return sxPanel();
  const s=SX.ogrSonuc||[], od=SX.ogrOdev||[], c=SX.ogrSertifika||[];
  const ort=s.length?Math.round(s.reduce((a,r)=>a+yuzde(r),0)/s.length):0;
  const hareket=[
    ...s.map(r=>({t:r.at,tip:"sınav",metin:`${r.sinavAd||"Sınav"} — ${r.dogru}/${r.toplam} (%${yuzde(r)})`})),
    ...od.map(x=>({t:x.at,tip:"ödev",metin:`Ödev verildi: ${x.baslik}`})),
    ...od.filter(x=>x.tamamlandiAt).map(x=>({t:x.tamamlandiAt,tip:"ödev",metin:`Ödev tamamlandı: ${x.baslik}`})),
    ...c.map(x=>({t:x.at,tip:"belge",metin:`Sertifika: ${x.kurs}`})),
    o.sonGiris?{t:o.sonGiris,tip:"giriş",metin:"Siteye giriş yaptı"}:null
  ].filter(Boolean).sort((a,b)=>b.t-a.t).slice(0,20);
  return `<section class="page"><div class="card pad">
    <div class="sx-user"><b>${esc(o.ad)}</b><span>${esc(o.mail)}</span>
      <span style="margin-inline-start:auto"></span>
      <button class="btn sm" data-sx="karneAc"><i class="fa-solid fa-id-card"></i> Karne</button>
      <button class="btn ghost sm" data-sx="panel"><i class="fa-solid fa-arrow-left"></i> Geri</button></div>
    <div class="sx-stats" style="grid-template-columns:repeat(4,1fr)">
      <div class="sx-stat"><b>${s.length}</b><span>sınav</span></div>
      <div class="sx-stat"><b>${ort}%</b><span>ortalama</span></div>
      <div class="sx-stat"><b>${od.filter(x=>x.durum!=="tamamlandi").length}</b><span>bekleyen ödev</span></div>
      <div class="sx-stat"><b>${c.length}</b><span>sertifika</span></div></div>

    <h3 style="margin:20px 0 10px">Ödev ver</h3>
    <div class="sx-row" style="margin:0 0 10px">
      <select class="sx-in" id="odDers" style="max-width:220px">
        ${(DATA.dersler||[]).map(x=>`<option value="${esc(x.id)}">${x.ico} ${esc(ceviri(x.ad))}</option>`).join("")}</select>
      <input class="sx-in" id="odBaslik" placeholder="Ödev başlığı — ör. 20 soruluk hız denemesi"></div>
    <div class="sx-field"><input class="sx-in" id="odAciklama" placeholder="Kısa açıklama (isteğe bağlı)"></div>
    <div class="sx-row" style="margin-bottom:14px">
      <input class="sx-in" id="odKod" maxlength="6" placeholder="sınav kodu" style="max-width:150px;text-transform:uppercase">
      <input class="sx-in" id="odTarih" type="date" style="max-width:190px">
      <button class="btn" data-sx="odevVer"><i class="fa-solid fa-paper-plane"></i> Ödevi gönder</button></div>

    <h3 style="margin:22px 0 10px">Verilen ödevler</h3>
    ${od.length? od.sort((a,b)=>(b.at||0)-(a.at||0)).map(x=>`
      <div class="sx-item"><div class="g"><b>${esc(x.baslik)}</b>
        <div class="s">${tarihKisa(x.at)}${x.sonTarih?" · son tarih "+tarihKisa(x.sonTarih):""}${x.tamamlandiAt?" · tamamlandı "+tarihSaat(x.tamamlandiAt):""}</div></div>
        <span class="sx-badge ${x.durum==="tamamlandi"?"ok":"wait"}">${x.durum==="tamamlandi"?"tamamlandı":"bekliyor"}</span>
        <button class="btn ghost sm" data-sx="odevKaldir" data-v="${x.id}">Sil</button></div>`).join("")
      : `<div class="sx-empty">Henüz ödev verilmedi.</div>`}

    <h3 style="margin:22px 0 10px">Sertifika ver</h3>
    <div class="sx-row" style="margin-bottom:14px">
      <select class="sx-in" id="sertKurs" style="max-width:240px">
        ${(DATA.kurslar||[]).map(k=>`<option>${esc(ceviri(k.ad))}</option>`).join("")}</select>
      <input class="sx-in" id="sertNot" placeholder="not (isteğe bağlı)" style="max-width:220px">
      <button class="btn" data-sx="sertVer"><i class="fa-solid fa-award"></i> Sertifikayı ver</button></div>
    ${c.length? c.map(x=>`<div class="sx-item"><div class="g"><b>${esc(x.kurs)}</b>
      <div class="s">${tarihKisa(x.at)}${x.not?" · "+esc(x.not):""}</div></div>
      <button class="btn ghost sm" data-sx="sertKaldir" data-v="${x.id}">Sil</button></div>`).join("")
      : `<div class="sx-empty">Henüz sertifika verilmedi.</div>`}

    ${analizKutusu(s,false)}

    <h3 style="margin:22px 0 10px">Hareketler</h3>
    ${hareket.length? `<div class="zaman">`+hareket.map(h=>`
      <div class="zaman-sat"><span class="zaman-nokta ${h.tip==="sınav"?"s":h.tip==="belge"?"b":""}"></span>
        <div><b>${esc(h.metin)}</b><div class="s">${tarihSaat(h.t)}</div></div></div>`).join("")+`</div>`
      : `<div class="sx-empty">Hareket kaydı yok.</div>`}
  </div></section>`;
}

/* ======================= KARNE ======================= */
function grafikCiz(sonuclar){
  const s=(sonuclar||[]).slice().sort((a,b)=>(a.at||0)-(b.at||0));
  if(s.length<2) return `<div class="sx-empty">Grafik için en az iki sınav gerekir.</div>`;
  const G=560, Y=170, sol=34, alt=24;
  const nokta=s.map((r,i)=>{
    const x=sol+(G-sol-10)*(s.length===1?0.5:i/(s.length-1));
    const yz=Math.round(r.dogru/r.toplam*100);
    const y=10+(Y-alt-10)*(1-yz/100);
    return {x,y,yz,r};
  });
  const cizgi=nokta.map((p,i)=>(i?"L":"M")+p.x.toFixed(1)+","+p.y.toFixed(1)).join(" ");
  const alan=cizgi+` L${nokta[nokta.length-1].x.toFixed(1)},${Y-alt} L${nokta[0].x.toFixed(1)},${Y-alt} Z`;
  const yatay=[0,25,50,75,100].map(v=>{
    const y=10+(Y-alt-10)*(1-v/100);
    return `<line x1="${sol}" y1="${y}" x2="${G-10}" y2="${y}" stroke="rgba(20,26,51,.10)" stroke-width="1"/>
            <text x="4" y="${y+4}" font-size="9" fill="#6C645C" font-family="monospace">${v}</text>`;
  }).join("");
  return `<svg viewBox="0 0 ${G} ${Y}" class="karne-grafik" role="img" aria-label="sınav grafiği">
    ${yatay}
    <path d="${alan}" fill="rgba(67,56,202,.10)"/>
    <path d="${cizgi}" fill="none" stroke="#4338CA" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    ${nokta.map(p=>`<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4" fill="#fff" stroke="#4338CA" stroke-width="2.5"/>
      <text x="${p.x.toFixed(1)}" y="${(p.y-10).toFixed(1)}" font-size="10" text-anchor="middle" fill="#241E1B" font-family="monospace">${p.yz}</text>`).join("")}
  </svg>`;
}

function vKarne(){
  const o = SX.acikOgrenci || SX.user;
  const s = (SX.ogrSonuc||[]).slice().sort((a,b)=>(b.at||0)-(a.at||0));
  const od = SX.ogrOdev||[], c = SX.ogrSertifika||[];
  const ort = s.length? Math.round(s.reduce((a,r)=>a+r.dogru/r.toplam*100,0)/s.length) : 0;
  const ilk = s.length? Math.round(s[s.length-1].dogru/s[s.length-1].toplam*100) : 0;
  const son = s.length? Math.round(s[0].dogru/s[0].toplam*100) : 0;
  const fark = son-ilk;
  const bitenOdev = od.filter(x=>x.durum==="tamamlandi").length;
  const hizlar = s.filter(r=>r.sure&&r.toplam).map(r=>r.sure/r.toplam/1000);
  const ortHiz = hizlar.length? (hizlar.reduce((a,b)=>a+b,0)/hizlar.length).toFixed(1)+"s" : "—";

  return `<section class="page"><div class="card pad karne" id="karneKagit">
    <div class="karne-ust">
      <div><div class="eyebrow">${esc(ceviri(DATA.marka.ad))}</div>
        <h2 style="margin:6px 0 2px">Öğrenci karnesi</h2>
        <div class="muted" style="font-size:13.5px">${new Date().toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"})}</div></div>
      <div class="karne-ad"><b>${esc(o.ad||"")}</b><div class="muted" style="font-size:12.5px">${esc(o.mail||"")}</div></div>
    </div>

    <div class="sx-stats" style="grid-template-columns:repeat(5,1fr)">
      <div class="sx-stat"><b>${s.length}</b><span>sınav</span></div>
      <div class="sx-stat"><b>${ort}%</b><span>ortalama</span></div>
      <div class="sx-stat"><b>${son}%</b><span>son sınav</span></div>
      <div class="sx-stat"><b>${fark>0?"+"+fark:fark}</b><span>gelişim</span></div>
      <div class="sx-stat"><b>${ortHiz}</b><span>soru başına</span></div>
    </div>

    <h3 style="margin:18px 0 10px">Gelişim eğrisi</h3>
    ${grafikCiz(s)}

    <h3 style="margin:20px 0 10px">Sınavlar</h3>
    ${s.length? `<table class="karne-tablo"><thead><tr><th>Tarih</th><th>Sınav</th><th>Sonuç</th><th>%</th></tr></thead><tbody>`+
      s.map(r=>`<tr><td>${tarihKisa(r.at)}</td><td>${esc(r.sinavAd||"—")}</td>
        <td>${r.dogru}/${r.toplam}</td><td>${Math.round(r.dogru/r.toplam*100)}</td></tr>`).join("")+
      `</tbody></table>` : `<div class="sx-empty">Henüz sınav çözülmemiş.</div>`}

    ${(SX.ogrYoklama&&SX.ogrYoklama.length)?`<h3 style="margin:20px 0 6px">Devam</h3>${devamOzeti(SX.ogrYoklama)}`:""}

    <div class="grid g2" style="margin-top:20px">
      <div><h3 style="margin-bottom:8px">Ödevler</h3>
        <p class="muted" style="font-size:14px">${od.length} ödevin ${bitenOdev} tanesi tamamlandı.</p>
        ${od.slice(0,5).map(x=>`<div class="sx-item" style="padding:8px 0"><div class="g"><b style="font-size:14px">${esc(x.baslik)}</b>
          <div class="s">${x.durum==="tamamlandi"?"tamamlandı "+tarihKisa(x.tamamlandiAt||x.at):"bekliyor"}</div></div></div>`).join("")}
      </div>
      <div><h3 style="margin-bottom:8px">Sertifikalar</h3>
        ${c.length? c.map(x=>`<div class="sx-item" style="padding:8px 0"><div class="g"><b style="font-size:14px">${esc(ceviri(x.kurs))}</b>
          <div class="s">${tarihKisa(x.at)}</div></div></div>`).join("") : `<div class="sx-empty">Henüz sertifika yok.</div>`}
      </div>
    </div>

    <div class="karne-imza">
      <div><div class="muted" style="font-size:12px">Eğitmen</div><div class="imza-cizgi"></div></div>
      <div><div class="muted" style="font-size:12px">Veli</div><div class="imza-cizgi"></div></div>
    </div>
  </div>
  <div class="sx-row" style="margin-top:12px">
    <button class="btn" data-sx="karneYazdir"><i class="fa-solid fa-print"></i> Yazdır / PDF</button>
    <button class="btn ghost" data-sx="karneKapat">Geri</button>
  </div></section>`;
}

/* ======================= YOKLAMA ======================= */
const YOK_DURUM = {geldi:"Geldi", gelmedi:"Gelmedi", izinli:"İzinli"};
function bugun(){ const d=new Date(); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }

function devamOzeti(kayitlar){
  const k=(kayitlar||[]).slice().sort((a,b)=>(a.tarih<b.tarih?1:-1));
  if(!k.length) return `<div class="sx-empty">Henüz yoklama kaydı yok.</div>`;
  const geldi=k.filter(x=>x.durum==="geldi").length;
  const izin=k.filter(x=>x.durum==="izinli").length;
  const oran=Math.round(geldi/k.length*100);
  return `<div class="sx-label" style="margin-top:14px">Devam durumu</div>
    <div class="sx-stats" style="grid-template-columns:repeat(3,1fr)">
      <div class="sx-stat"><b>${oran}%</b><span>devam</span></div>
      <div class="sx-stat"><b>${k.length-geldi-izin}</b><span>devamsızlık</span></div>
      <div class="sx-stat"><b>${izin}</b><span>izinli</span></div></div>
    <div class="devam-serit">${k.slice(0,14).reverse().map(x=>
      `<span class="devam-kutu ${esc(x.durum)}" title="${esc(x.tarih)}"></span>`).join("")}</div>`;
}

function sxYoklamaKutusu(){
  const l=SX.ogrenciler||[];
  if(!l.length) return "";
  const secim=SX.yoklamaSecim||{};
  return `<div class="toplu-odev" style="border-color:rgba(13,148,136,.35);background:rgba(13,148,136,.06)">
    <div class="sx-label">Yoklama</div>
    <div class="sx-row" style="margin:0 0 12px">
      <input class="sx-in" id="yokTarih" type="date" value="${esc(SX.yoklamaTarih||bugun())}" style="max-width:190px">
      <button class="btn ghost sm" data-sx="yoklamaYukle">Günü getir</button>
      <button class="btn ghost sm" data-sx="yoklamaHepsi" data-v="geldi">Hepsi geldi</button>
    </div>
    ${l.map(o=>`<div class="yok-satir">
      <span class="yok-ad">${esc(o.ad)}</span>
      ${Object.keys(YOK_DURUM).map(d=>`<button class="chip yok-${d}" data-sx="yoklamaSec" data-v="${o.uid}" data-d="${d}"
        aria-pressed="${secim[o.uid]===d}">${YOK_DURUM[d]}</button>`).join("")}
    </div>`).join("")}
    <button class="btn" data-sx="yoklamaKaydet" style="margin-top:12px"><i class="fa-solid fa-user-check"></i> Yoklamayı kaydet</button>
    <div class="sx-note" id="yokNot">Kaydedilen yoklama öğrencinin ve velisinin profilinde görünür.</div>
  </div>`;
}

/* ======================= VELİ PROFİLİ ======================= */
function sxVeliProfil(){
  const u=SX.user;
  const s=SX.ogrSonuc||[], o=SX.ogrOdev||[], c=SX.ogrSertifika||[], y=SX.ogrYoklama||[];
  if(!u.cocuk) return `<section class="page"><div class="card pad" style="max-width:520px">
    <div class="sx-user"><b>${esc(u.ad)}</b><span>${esc(u.mail)}</span><span class="sx-badge ok">veli</span>
      <span style="margin-inline-start:auto"></span>
      <button class="btn ghost sm" data-sx="cikis"><i class="fa-solid fa-arrow-right-from-bracket"></i> Çıkış yap</button></div>
    <h3 style="margin-bottom:6px">Çocuğunu bağla</h3>
    <p class="muted" style="font-size:14px">Çocuğun kendi profilinde görünen altı haneli veli kodunu gir.</p>
    <div class="sx-row" style="margin-top:12px">
      <input class="sx-in" id="sxCocukKod" maxlength="6" placeholder="ABC123" style="max-width:180px;text-transform:uppercase">
      <button class="btn" data-sx="cocugaBaglan"><i class="fa-solid fa-link"></i> Bağlan</button></div>
    <div class="sx-note" id="sxCocukNot"></div></div></section>`;

  const ort=s.length?Math.round(s.reduce((a,r)=>a+r.dogru/r.toplam*100,0)/s.length):0;
  const bekleyen=o.filter(x=>x.durum!=="tamamlandi");
  return `<section class="page">
    <div class="card pad">
      <div class="sx-user"><b>${esc(u.ad)}</b><span>${esc(u.mail)}</span>
        <span class="sx-badge ok">veli</span>
        <span class="sx-badge">çocuk: ${esc(u.cocukAd||"")}</span>
        <span style="margin-inline-start:auto"></span>
        <button class="btn sm" data-sx="karneAc"><i class="fa-solid fa-id-card"></i> Karne</button>
        <button class="btn ghost sm" data-sx="cikis"><i class="fa-solid fa-arrow-right-from-bracket"></i> Çıkış yap</button></div>
      <div class="sx-stats" style="grid-template-columns:repeat(4,1fr)">
        <div class="sx-stat"><b>${s.length}</b><span>sınav</span></div>
        <div class="sx-stat"><b>${ort}%</b><span>ortalama</span></div>
        <div class="sx-stat"><b>${bekleyen.length}</b><span>bekleyen ödev</span></div>
        <div class="sx-stat"><b>${c.length}</b><span>sertifika</span></div></div>
      ${devamOzeti(y)}
    </div>

    <div class="card pad" style="margin-top:14px">
      <h3 style="margin-bottom:12px">Ödevler</h3>
      ${o.length? o.sort((a,b)=>(b.at||0)-(a.at||0)).slice(0,8).map(x=>`
        <div class="sx-item"><div class="g"><b>${esc(x.baslik)}</b>
          <div class="s">${x.sonTarih?"son tarih "+tarihKisa(x.sonTarih):tarihKisa(x.at)}</div></div>
          <span class="sx-badge ${x.durum==="tamamlandi"?"ok":"wait"}">${x.durum==="tamamlandi"?"tamamlandı":"bekliyor"}</span></div>`).join("")
        : `<div class="sx-empty">Henüz ödev verilmedi.</div>`}
    </div>

    ${duyuruKutusu(false)}
    ${programKutusu(false)}
    ${analizKutusu(s,false)}

    <div class="card pad" style="margin-top:14px">
      <h3 style="margin-bottom:12px">Sınav geçmişi</h3>
      ${s.length? s.slice().sort((a,b)=>(b.at||0)-(a.at||0)).map(r=>`
        <div class="sx-rank" style="cursor:default">
          <span class="nm">${esc(r.sinavAd||"Sınav")}
            <div class="s" style="font-family:var(--mono);font-size:11.5px;color:var(--gece-2);margin-top:3px">${tarihSaat(r.at)}</div>
            <div class="sx-bar"><i style="width:${yuzde(r)}%"></i></div></span>
          <span class="sc">${r.dogru}/${r.toplam}</span>
          <span class="tm">${yuzde(r)}%</span></div>`).join("")
        : `<div class="sx-empty">Henüz sınav çözülmemiş.</div>`}
    </div>
    ${dilSecici()}
  </section>`;
}

/* ======================= OYUNLAŞTIRMA ======================= */
function gunAnahtar(t){ const d=new Date(t); return d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate(); }
function seriHesapla(sonuclar){
  const gunler=new Set((sonuclar||[]).map(r=>gunAnahtar(r.at)));
  if(!gunler.size) return {seri:0, bugunVar:false};
  let seri=0; const d=new Date();
  const bugunVar=gunler.has(gunAnahtar(d.getTime()));
  if(!bugunVar) d.setDate(d.getDate()-1);       // dün de sayılır, seri bugün henüz kırılmadı
  while(gunler.has(gunAnahtar(d.getTime()))){ seri++; d.setDate(d.getDate()-1); }
  return {seri, bugunVar};
}
function rozetler(s,od,c){
  const n=s.length;
  const ort=n?Math.round(s.reduce((a,r)=>a+r.dogru/r.toplam*100,0)/n):0;
  const tamPuan=s.some(r=>r.dogru===r.toplam);
  const {seri}=seriHesapla(s);
  const bitenOdev=(od||[]).filter(x=>x.durum==="tamamlandi").length;
  const hizli=s.some(r=>r.sure&&r.toplam&&(r.sure/r.toplam/1000)<3);
  return [
    {ad:"İlk adım",     not:"İlk sınavını çözdün",        ico:"🌱", acik:n>=1},
    {ad:"Onluk",        not:"10 sınav tamamladın",         ico:"🔟", acik:n>=10},
    {ad:"Ellilik",      not:"50 sınav tamamladın",         ico:"🏵️", acik:n>=50},
    {ad:"Kusursuz",     not:"Bir sınavı tam puanla bitirdin", ico:"🎯", acik:tamPuan},
    {ad:"İstikrar",     not:"Ortalaman %80'in üstünde",    ico:"📈", acik:ort>=80},
    {ad:"Haftalık seri",not:"7 gün üst üste çalıştın",     ico:"🔥", acik:seri>=7},
    {ad:"Aylık seri",   not:"30 gün üst üste çalıştın",    ico:"🏆", acik:seri>=30},
    {ad:"Hızlı el",     not:"Soru başına 3 saniyenin altı", ico:"⚡", acik:hizli},
    {ad:"Ödevsever",    not:"10 ödev tamamladın",          ico:"📚", acik:bitenOdev>=10},
    {ad:"Belgeli",      not:"İlk sertifikanı aldın",       ico:"🎓", acik:(c||[]).length>=1}
  ];
}
function oyunKutusu(s,od,c){
  const {seri,bugunVar}=seriHesapla(s);
  const r=rozetler(s,od,c), acik=r.filter(x=>x.acik).length;
  return `<div class="card pad" style="margin-top:14px">
    <h3 style="margin-bottom:4px">Seri ve rozetler</h3>
    <p class="muted" style="font-size:13.5px;margin-bottom:14px">Her gün en az bir sınav ya da alıştırma çözersen serin büyür.</p>
    <div class="seri-kutu ${seri?"yanik":""}">
      <div class="seri-alev">🔥</div>
      <div><b>${seri} gün</b><div class="s">${bugunVar?"Bugünü tamamladın":"Bugün henüz çalışmadın"}</div></div>
      <div class="seri-rozet">${acik}/${r.length} rozet</div>
    </div>
    <div class="rozet-izgara">
      ${r.map(x=>`<div class="rozet ${x.acik?"acik":""}" title="${esc(x.not)}">
        <span class="rozet-ico">${x.ico}</span>
        <b>${esc(x.ad)}</b><span class="s">${esc(x.not)}</span></div>`).join("")}
    </div></div>`;
}

/* ======================= EKSİK ANALİZİ ======================= */
function eksikAnaliz(hepsi){
  const sonuclar=(hepsi||[]).filter(r=>!r.ders||r.ders==="aritmetik");
  const k={
    "Çıkarma içeren":       {yanlis:0,toplam:0, ayar:{seviye:1}},
    "İki basamaklı":        {yanlis:0,toplam:0, ayar:{seviye:2}},
    "Uzun dizi (5+ sayı)":  {yanlis:0,toplam:0, ayar:{seviye:3}},
    "Kısa dizi (3-4 sayı)": {yanlis:0,toplam:0, ayar:{seviye:1}}
  };
  (sonuclar||[]).forEach(r=>{
    (Array.isArray(r.dokum)?r.dokum:[]).forEach(d=>{
      const sayilar=String(d.q||"").split(/\s+/).filter(Boolean);
      const neg=/[-−]/.test(String(d.q||""));
      const iki=sayilar.some(x=>x.replace(/[^0-9]/g,"").length>=2);
      const uzun=sayilar.length>=5;
      const yanlis=(d.a===null||d.a===undefined||d.a!==d.c)?1:0;
      if(neg){ k["Çıkarma içeren"].toplam++; k["Çıkarma içeren"].yanlis+=yanlis; }
      if(iki){ k["İki basamaklı"].toplam++;  k["İki basamaklı"].yanlis+=yanlis; }
      if(uzun){ k["Uzun dizi (5+ sayı)"].toplam++; k["Uzun dizi (5+ sayı)"].yanlis+=yanlis; }
      else { k["Kısa dizi (3-4 sayı)"].toplam++; k["Kısa dizi (3-4 sayı)"].yanlis+=yanlis; }
    });
  });
  return Object.entries(k)
    .filter(([,v])=>v.toplam>=3)
    .map(([ad,v])=>({ad, toplam:v.toplam, yanlis:v.yanlis, oran:Math.round(v.yanlis/v.toplam*100), ayar:v.ayar}))
    .sort((a,b)=>b.oran-a.oran);
}
function analizKutusu(sonuclar, kendisiMi){
  const a=eksikAnaliz(sonuclar);
  if(!a.length) return `<div class="card pad" style="margin-top:14px">
    <h3 style="margin-bottom:6px">Zorlanılan konular</h3>
    <div class="sx-empty">Analiz için birkaç sınav daha gerekiyor. En az üç soruluk veri biriktiğinde burada çıkar.</div></div>`;
  const enZor=a[0];
  return `<div class="card pad" style="margin-top:14px">
    <h3 style="margin-bottom:4px">Zorlanılan konular</h3>
    <p class="muted" style="font-size:13.5px;margin-bottom:12px">Yanlış cevaplar soru tipine göre ayrıştırıldı.</p>
    ${a.map(x=>`<div class="sx-item"><div class="g"><b>${esc(x.ad)}</b>
      <div class="s">${x.yanlis} yanlış / ${x.toplam} soru</div>
      <div class="sx-bar" style="margin-top:6px"><i style="width:${x.oran}%;background:${x.oran>30?"#C0392B":x.oran>15?"var(--kehribar)":"var(--turkuaz)"}"></i></div></div>
      <span class="sx-badge ${x.oran>30?"no":x.oran>15?"wait":"ok"}">%${x.oran}</span></div>`).join("")}
    ${kendisiMi?`<button class="btn" data-sx="zayifCalis" data-v="${esc(enZor.ayar.seviye)}" style="margin-top:14px">
      "${esc(enZor.ad)}" için alıştırma üret</button>`:""}
  </div>`;
}

/* ======================= BİLDİRİMLER ======================= */
function bildirimKutusu(){
  const b=(SX.bildirim||[]).slice().sort((a,b)=>(b.at||0)-(a.at||0));
  if(!b.length) return "";
  const okunmamis=b.filter(x=>!x.okundu).length;
  return `<div class="card pad" style="margin-top:14px">
    <h3 style="margin-bottom:10px">Bildirimler${okunmamis?` <span class="sx-badge wait">${okunmamis} yeni</span>`:""}</h3>
    ${b.slice(0,8).map(x=>`<div class="sx-item ${x.okundu?"":"yeni-bildirim"}">
      <span class="bildirim-ico">${x.tip==="odev"?"📚":x.tip==="sertifika"?"🎓":x.tip==="yoklama"?"📅":"🔔"}</span>
      <div class="g"><b>${esc(x.metin)}</b><div class="s">${tarihSaat(x.at)}</div></div></div>`).join("")}
    ${okunmamis?`<button class="btn ghost sm" data-sx="bildirimOku" style="margin-top:10px"><i class="fa-solid fa-check"></i> Okundu işaretle</button>`:""}
  </div>`;
}

/* ======================= DUYURU VE PROGRAM ======================= */
const GUNLER = ["Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar"];

function duyuruKutusu(duzenlenebilir){
  const d=(SX.duyurular||[]).slice().sort((a,b)=>(b.at||0)-(a.at||0));
  return `<div class="card pad" style="margin-top:14px">
    <h3 style="margin-bottom:4px">Duyurular</h3>
    <p class="muted" style="font-size:13.5px;margin-bottom:12px">
      ${duzenlenebilir?"Yazdığın duyuru bütün öğrencilerinin ve velilerinin ekranında görünür."
        :"Öğretmeninden gelen duyurular."}</p>
    ${duzenlenebilir?`<div class="sx-field" style="margin-bottom:8px">
      <input class="sx-in" id="duyBaslik" placeholder="Duyuru başlığı — ör. Cuma dersi 17:00'ye alındı"></div>
      <div class="sx-row" style="margin:0 0 14px">
        <input class="sx-in" id="duyMetin" placeholder="Açıklama (isteğe bağlı)">
        <button class="btn" data-sx="duyuruEkle"><i class="fa-solid fa-bullhorn"></i> Yayınla</button></div>`:""}
    ${d.length? d.slice(0,10).map(x=>`<div class="sx-item">
      <span class="bildirim-ico">📣</span>
      <div class="g"><b>${esc(x.baslik)}</b>
        <div class="s">${x.metin?esc(x.metin)+" · ":""}${tarihSaat(x.at)}</div></div>
      ${duzenlenebilir?`<button class="btn ghost sm" data-sx="duyuruSil" data-v="${esc(x.id)}">Sil</button>`:""}</div>`).join("")
      : `<div class="sx-empty">Henüz duyuru yok.</div>`}
  </div>`;
}

function programKutusu(duzenlenebilir){
  const p=(SX.program&&SX.program.satirlar)||[];
  const sirali=p.slice().sort((a,b)=>(a.gun-b.gun)||String(a.saat).localeCompare(String(b.saat)));
  return `<div class="card pad" style="margin-top:14px">
    <h3 style="margin-bottom:4px">Ders programı</h3>
    <p class="muted" style="font-size:13.5px;margin-bottom:12px">
      ${duzenlenebilir?"Haftalık ders saatlerin. Öğrenciler ve veliler bu tabloyu görür."
        :"Haftalık ders saatlerin."}</p>
    ${duzenlenebilir?`<div class="sx-row" style="margin:0 0 14px">
      <select class="sx-in" id="prgGun" style="max-width:150px">
        ${GUNLER.map((g,i)=>`<option value="${i}">${g}</option>`).join("")}</select>
      <input class="sx-in" id="prgSaat" type="time" style="max-width:130px" value="17:00">
      <input class="sx-in" id="prgGrup" placeholder="grup — ör. Seviye 2" style="max-width:190px">
      <button class="btn" data-sx="programEkle"><i class="fa-solid fa-calendar-days"></i> Ekle</button></div>`:""}
    ${sirali.length? `<div class="prg-tablo">${sirali.map((x,i)=>`
      <div class="prg-satir">
        <span class="prg-gun">${esc(GUNLER[x.gun]||"")}</span>
        <span class="prg-saat">${esc(x.saat||"")}</span>
        <span class="prg-grup">${esc(x.grup||"")}</span>
        ${duzenlenebilir?`<button class="btn ghost sm" data-sx="programSil" data-v="${i}">Sil</button>`:""}
      </div>`).join("")}</div>`
      : `<div class="sx-empty">Program girilmemiş.</div>`}
  </div>`;
}

/* ======================= SERTİFİKA DOĞRULAMA ======================= */
function vDogrula(){
  const s=SX.dogrulama;
  if(s==="araniyor") return `<section class="page"><div class="card pad" style="max-width:520px;margin-inline:auto;text-align:center">
    <p class="muted">Belge doğrulanıyor…</p></div></section>`;
  if(!s || s==="yok") return `<section class="page"><div class="card pad" style="max-width:520px;margin-inline:auto;text-align:center">
    <div class="dgr-ikon no">✕</div>
    <h2 style="margin:12px 0 6px">Belge bulunamadı</h2>
    <p class="muted">Karekod hatalı olabilir ya da belge kaldırılmış olabilir.</p>
    <a class="btn ghost" href="#/" style="margin-top:16px">Ana sayfaya dön</a></div></section>`;
  return `<section class="page"><div class="card pad" style="max-width:560px;margin-inline:auto;text-align:center">
    <div class="dgr-ikon ok">✓</div>
    <h2 style="margin:12px 0 4px">Belge geçerli</h2>
    <p class="muted" style="margin-bottom:18px">${esc(ceviri(DATA.marka.ad))} kayıtlarında bu belge doğrulanmıştır.</p>
    <div class="dgr-satir"><span>Öğrenci</span><b>${esc(s.ogrenciAd||"—")}</b></div>
    <div class="dgr-satir"><span>Program</span><b>${esc(ceviri(s.kurs)||"—")}</b></div>
    <div class="dgr-satir"><span>Veren</span><b>${esc(s.verenAd||"—")}</b></div>
    <div class="dgr-satir"><span>Tarih</span><b>${s.at?tarihKisa(s.at):"—"}</b></div>
    <a class="btn" href="#/" style="margin-top:18px">Ana sayfaya dön</a></div></section>`;
}
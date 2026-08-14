/* Sınav ve profil sekmelerinin görünümleri, form üreteci. */

/* --- taslak / form --- */
function yeniTaslak(){ return {ad:"",kaynak:"oto",seviye:1,adet:20,metin:"",limit:300,
  eksiSag:false,karistir:false,geriBildirim:true,gosterYanlis:true,ses:true,acik:true,kod:null} }
function taslakYaz(k,v){
  const d=SX.taslak; if(!d) return;
  if(["seviye","adet","limit"].includes(k)) d[k]=+v;
  else if(["eksiSag","karistir","geriBildirim","gosterYanlis","ses"].includes(k)) d[k]=(v==="1");
  else d[k]=v;
}
function taslakSorular(){ const d=SX.taslak;
  if(d.kaynak==="elle") return soruAyikla(d.metin).qs;
  return Array.from({length:d.adet},()=>soruUret(SEVIYE[d.seviye])) }
function notYenile(){
  const n=$("sxNot"); if(!n) return;
  const {qs,hata}=soruAyikla(SX.taslak.metin);
  let s=qs.length?`<span class="sx-good">${qs.length} soru hazır.</span>`:`<span class="sx-warn">Henüz soru yok.</span>`;
  if(hata.length) s+=` <span class="sx-warn">Anlaşılmayan satır: ${hata.join(", ")}</span>`;
  n.innerHTML=cevirHtml(`Her satır bir soru. Sayıları boşlukla ayır. Eksi için <b>-3</b> ya da <b>3-</b>. Cevabı kendin vermek istersen satır sonuna <b>= 41</b> ekle. <b>#</b> ile başlayan satır atlanır.<br>${s}`);
}
function sxChip(k,v,ad,acik,alt){
  return `<button class="chip" data-sx="chip" data-k="${k}" data-v="${v}" aria-pressed="${!!acik}">${ad}${alt?`<small style="display:block;font-family:var(--mono);font-size:10px;opacity:.7;margin-top:2px">${alt}</small>`:""}</button>`;
}
function sxForm(){
  const d=SX.taslak, on=[0,120,300,600], ozel=d.limit>0&&!on.includes(d.limit);
  return `
  <div class="sx-field"><div class="sx-label">Sorular</div><div class="chips" style="margin:0">
    ${sxChip("kaynak","oto","Otomatik üret",d.kaynak==="oto")}${sxChip("kaynak","elle","Kendim yazacağım",d.kaynak==="elle")}</div></div>
  ${d.kaynak==="oto"?`
  <div class="sx-field"><div class="sx-label">Seviye</div><div class="chips" style="margin:0">
    ${SEVIYE_AD.map((a,i)=>sxChip("seviye",i,a,d.seviye===i,SEVIYE_NOT[i])).join("")}</div></div>
  <div class="sx-field"><div class="sx-label">Soru sayısı</div><div class="chips" style="margin:0">
    ${[10,20,50,100].map(c=>sxChip("adet",c,c,d.adet===c)).join("")}</div></div>`:`
  <div class="sx-field"><div class="sx-label">Soruları yaz</div>
    <textarea class="sx-ta" data-sxbind="metin" spellcheck="false" placeholder="48 51 5 -3&#10;12 -7 8 8 -7&#10;17 7 57">${esc(d.metin)}</textarea>
    <div class="sx-note" id="sxNot"></div>
    <div class="chips" style="margin:10px 0 0">${sxChip("karistir",d.karistir?0:1,"Sırayı karıştır",d.karistir)}</div></div>`}
  <div class="sx-field"><div class="sx-label">Süre</div><div class="chips" style="margin:0">
    ${on.map(s=>sxChip("limit",s,s===0?"Süresiz":(s/60)+" dk",d.limit===s)).join("")}
    <input class="sx-mins" data-sxbind="limitDk" type="number" min="1" max="180" placeholder="özel" value="${ozel?d.limit/60:""}"></div></div>
  <div class="sx-field"><div class="sx-label">Eksi işareti</div><div class="chips" style="margin:0">
    ${sxChip("eksiSag","0","Solda −5",!d.eksiSag)}${sxChip("eksiSag","1","Sağda 5−",d.eksiSag)}</div></div>
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
      <div class="sx-row"><button class="btn" data-sx="alistirmaBasla">Başla</button>
        <button class="btn ghost" data-sx="sinavGiris">Vazgeç</button></div></div></section>`;
  return `<section class="page">
    <div class="eyebrow">Sınav</div>
    <h2 style="margin:10px 0 8px">Sınava gir</h2>
    <p class="muted" style="max-width:52ch">Öğretmeninin verdiği altı haneli kodu yaz. Hesap açmana gerek yok.</p>
    <div class="grid g2" style="margin-top:24px">
      <div class="card pad">
        <div class="sx-field"><div class="sx-label">Sınav kodu</div>
          <input class="sx-in code" id="sxKod" maxlength="6" autocomplete="off" placeholder="ABC123"></div>
        <button class="btn" data-sx="kodGir" style="width:100%;justify-content:center">Devam et</button>
        <div class="sx-note" id="sxKodNot"></div>
      </div>
      <div class="card pad">
        <span class="tag teal">Kodsuz</span>
        <h3 style="margin:12px 0 8px">Serbest alıştırma</h3>
        <p class="muted" style="font-size:14px">Seviye seç, süre koy, kendi kendine çalış. Sonuç kimseye gitmez.</p>
        <button class="btn ghost sm" data-sx="alistirmaAyar" style="margin-top:16px">Alıştırmayı kur</button>
      </div>
    </div></section>`;
}
function sxIsimEkran(){
  const e=SX.exam, lim=e.limit?Math.round(e.limit/60)+" dakika":"süresiz";
  return `<section class="page"><div class="card pad" style="max-width:560px">
    <div class="eyebrow">${esc(e.sahipAd||"Sınav")}</div>
    <h2 style="margin:10px 0 6px">${esc(e.ad)}</h2>
    <p class="muted">${e.qs.length} soru · ${lim}</p>
    <div class="sx-field" style="margin-top:22px"><div class="sx-label">Adın soyadın</div>
      <input class="sx-in" id="sxIsim" autocomplete="name" placeholder="Ad Soyad" value="${esc(SX.ogrenci)}"></div>
    <div class="sx-row"><button class="btn" data-sx="basla">Sınavı başlat</button>
      <button class="btn ghost" data-sx="sinavGiris">Geri</button></div></div></section>`;
}
function sxCozEkran(){
  return `<section class="page" style="padding-top:22px">
    <div class="sx-rail" id="sxRail"></div>
    <div class="card pad" style="max-width:560px;margin-inline:auto">
      <div class="sx-meta"><span id="sxIlerleme"></span><span id="sxClock">00:00</span></div>
      <div class="sx-stack" id="sxStack"></div>
      <div class="sx-answer" id="sxCevapKutu">
        <input id="sxCevap" type="text" inputmode="numeric" autocomplete="off" placeholder="?" aria-label="cevap">
        <button class="btn" data-sx="kontrol">Kontrol</button></div>
      <div class="sx-verdict" id="sxHukum"></div>
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
      ${SX.alistirma?`<button class="btn" data-sx="tekrar">Yeniden çöz</button>`:""}
      ${goster?`<button class="btn ghost" data-sx="yanlislar">Yanlışları çöz</button>`:""}
      <button class="btn ghost" data-sx="sinavGiris">Bitir</button></div>
    ${yanlis}</div></section>`;
}

/* --- PROFİL SEKMESİ --- */
function vProfil(){
  if(!SX.user) return sxGirisEkran();
  if(SX.user.durum!=="onayli") return sxBekleEkran();
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
        <button class="chip" data-sx="rolSec" data-v="ogretmen" aria-pressed="${rol==="ogretmen"}">Öğretmenim</button></div>
        <div class="sx-note" style="margin-top:8px">${rol==="ogrenci"
          ? "Öğrenci hesapları hemen açılır."
          : "Öğretmen hesapları yönetici onayından sonra kullanılabilir."}</div></div>
      <div class="sx-field"><div class="sx-label">Ad soyad</div>
        <input class="sx-in" id="sxAd" autocomplete="name" placeholder="Ad Soyad"></div>
      ${rol==="ogrenci"?`<div class="sx-field"><div class="sx-label">Öğretmen kodu</div>
        <input class="sx-in" id="sxSinifKodu" maxlength="6" autocomplete="off" placeholder="ABC123" style="text-transform:uppercase">
        <div class="sx-note">Öğretmeninin verdiği altı haneli kod. Bilmiyorsan boş bırak, sonra eklenebilir.</div></div>`:""}
      `:""}
      <div class="sx-field"><div class="sx-label">E-posta</div>
        <input class="sx-in" id="sxMail" type="email" inputmode="email" autocomplete="email" placeholder="ornek@mail.com"></div>
      <div class="sx-field"><div class="sx-label">Şifre</div>
        <input class="sx-in" id="sxSifre" type="password" autocomplete="${kayit?"new-password":"current-password"}" placeholder="en az 6 karakter"></div>
      <button class="btn" style="width:100%;justify-content:center" data-sx="${kayit?"kayitOl":"girisYap"}">${kayit?"Hesap oluştur":"Giriş yap"}</button>
      ${kayit?"":`<div style="margin-top:12px;text-align:center"><button class="linkish" data-sx="sifreUnuttum">Şifremi unuttum</button></div>`}
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
      <button class="btn" data-sx="durumKontrol">Durumu kontrol et</button>
      ${(ADMIN_EMAIL && String(SX.user.mail||"").trim().toLowerCase()===String(ADMIN_EMAIL).trim().toLowerCase())
        ? `<button class="btn" data-sx="yoneticiAc">Yönetici olarak aç</button>` : ""}
      <button class="btn ghost" data-sx="cikis">Çıkış yap</button></div>
    <div class="sx-note" id="sxDurumNot">Yönetici onayladıysa bu düğme seni panele alır.</div>
    </div></section>`;
}
function sxPanel(){
  const u=SX.user, yon=u.yonetici;
  const bekleyen=SX.hesaplar.filter(h=>h.durum==="bekliyor"&&h.rol!=="ogrenci").length;
  const govde = SX.ptab==="ogrenciler" ? sxOgrenciListe()
              : (yon&&SX.ptab==="hesaplar") ? sxHesapListe()
              : sxSinavListe();
  return `<section class="page">
    <div class="card pad">
      <div class="sx-user"><b>${esc(u.ad)}</b><span>${esc(u.mail)}</span>
        ${yon?`<span class="sx-badge ok">yönetici</span>`:`<span class="sx-badge ok">öğretmen</span>`}
        ${u.sinifKodu?`<span class="sx-badge">sınıf kodu ${esc(u.sinifKodu)}</span>`:""}
        <span style="margin-inline-start:auto"></span>
        <button class="btn ghost sm" data-sx="cikis">Çıkış yap</button></div>
      ${(yon&&bekleyen)?`<div class="uyari" data-sx="ptab" data-v="hesaplar" role="button" tabindex="0">
        <span class="uyari-nokta"></span>
        <div><b>${bekleyen} hesap onayını bekliyor</b>
        <div class="s">Onaylamadığın öğretmenler panele giremez. Görmek için dokun.</div></div>
        <span class="uyari-ok">→</span></div>`:""}
      <div class="sx-tabs">
        <button data-sx="ptab" data-v="sinavlar" aria-pressed="${SX.ptab==="sinavlar"}">Sınavlarım</button>
        <button data-sx="ptab" data-v="ogrenciler" aria-pressed="${SX.ptab==="ogrenciler"}">Öğrencilerim${(SX.ogrenciler||[]).length?` (${SX.ogrenciler.length})`:""}</button>
        ${yon?`<button data-sx="ptab" data-v="hesaplar" aria-pressed="${SX.ptab==="hesaplar"}">Hesaplar${bekleyen?` (${bekleyen})`:""}</button>`:""}
      </div>
      ${govde}
    </div>
    ${SX.ptab==="sinavlar"?dilSecici():""}
    </section>`;
}
function sxSinavListe(){
  const l=SX.sinavlar;
  return `<h3 style="margin:6px 0 14px">Sınavlarım</h3>
    <button class="btn" data-sx="yeniSinav" style="margin-bottom:18px">Yeni sınav oluştur</button>
    ${l.length?l.map(x=>`
      <div class="sx-item"><div class="g"><b>${esc(x.ad)}</b>
        <div class="s">${x.qs.length} soru · ${x.limit?Math.round(x.limit/60)+" dk":"süresiz"} · ${x.acik===false?"kapalı":"açık"}</div></div>
        <span class="sx-pill">${x.kod}</span></div>
      <div class="sx-row" style="margin:-6px 0 14px">
        <button class="btn ghost sm" data-sx="sonucAc" data-v="${x.kod}">Sonuçlar</button>
        <button class="btn ghost sm" data-sx="duzenle" data-v="${x.kod}">Düzenle</button>
        <button class="btn ghost sm" data-sx="acKapa" data-v="${x.kod}">Aç / kapat</button>
        <button class="btn ghost sm" data-sx="sinavSil" data-v="${x.kod}">Sil</button></div>`).join("")
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
    <button class="btn ghost sm" data-sx="hesapYenile" style="margin-top:14px">Yenile</button>`;
}
function sxEditor(){
  const d=SX.taslak;
  return `<section class="page"><div class="card pad">
    <h2 style="margin-bottom:16px">${d.kod?"Sınavı düzenle":"Yeni sınav"}</h2>
    <div class="sx-field"><div class="sx-label">Sınav adı</div>
      <input class="sx-in" data-sxbind="ad" placeholder="3. Sınıf — 1. Deneme" value="${esc(d.ad)}"></div>
    ${sxForm()}
    <div class="sx-row"><button class="btn" data-sx="sinavKaydet">${d.kod?"Değişiklikleri kaydet":"Sınavı yayınla"}</button>
      <button class="btn ghost" data-sx="panel">Geri</button></div></div></section>`;
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
      <button class="btn ghost sm" data-sx="kopyala">Kopyala</button>
      <button class="btn ghost sm" data-sx="whatsapp">WhatsApp</button></div>
    <button class="btn" data-sx="panel" style="margin-top:16px">Panele dön</button></div></section>`;
}
function sxSonuclar(){
  return `<section class="page"><div class="card pad">
    <h2 id="sxSonucBaslik" style="margin-bottom:14px">Sonuçlar</h2>
    <div id="sxSonucGovde"><div class="sx-empty">Yükleniyor…</div></div>
    <div class="sx-row" style="margin-top:16px">
      <button class="btn ghost sm" data-sx="sonucYenile">Yenile</button>
      <button class="btn ghost sm" data-sx="csv">CSV indir</button>
      <button class="btn ghost sm" data-sx="panel">Geri</button></div></div></section>`;
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
  </div></section>`;
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
  return `<section class="page">
    <div class="card pad">
      <div class="sx-user"><b>${esc(u.ad)}</b><span>${esc(u.mail)}</span>
        <span class="sx-badge ok">öğrenci</span>
        ${u.ogretmenAd?`<span class="sx-badge">öğretmen: ${esc(u.ogretmenAd)}</span>`:`<span class="sx-badge wait">öğretmen bağlı değil</span>`}
        <span style="margin-inline-start:auto"></span>
        <button class="btn ghost sm" data-sx="cikis">Çıkış yap</button></div>

      <div class="sx-stats" style="grid-template-columns:repeat(4,1fr)">
        <div class="sx-stat"><b>${s.length}</b><span>sınav</span></div>
        <div class="sx-stat"><b>${ort}%</b><span>ortalama</span></div>
        <div class="sx-stat"><b>${enIyi}%</b><span>en iyi</span></div>
        <div class="sx-stat"><b>${c.length}</b><span>sertifika</span></div>
      </div>
      ${!u.ogretmen?`<div class="sx-field" style="margin-top:6px">
        <div class="sx-label">Öğretmenine bağlan</div>
        <div class="sx-row" style="margin:0">
          <input class="sx-in" id="sxBagKod" maxlength="6" placeholder="ABC123" style="max-width:180px;text-transform:uppercase">
          <button class="btn sm" data-sx="ogretmeneBaglan">Bağlan</button></div>
        <div class="sx-note" id="sxBagNot">Öğretmenin kodunu girersen ödevlerin ve gelişimin ona görünür.</div></div>`:""}
    </div>

    <div class="card pad" style="margin-top:14px">
      <h3 style="margin-bottom:4px">Ödevlerim</h3>
      <p class="muted" style="font-size:13.5px;margin-bottom:12px">${bekleyen.length?`${bekleyen.length} ödev bekliyor.`:"Bekleyen ödevin yok."}</p>
      ${o.length? o.sort((a,b)=>(b.at||0)-(a.at||0)).map(x=>{
        const gecti = x.durum!=="tamamlandi" && x.sonTarih && new Date(x.sonTarih).getTime()<Date.now();
        return `<div class="sx-item"><div class="g">
          <b>${esc(x.baslik)}</b>
          <div class="s">${x.aciklama?esc(x.aciklama)+" · ":""}${x.sonTarih?"son tarih "+tarihKisa(x.sonTarih):"tarih yok"}${x.sinavKodu?" · kod "+esc(x.sinavKodu):""}</div>
        </div>
        ${x.durum==="tamamlandi"
          ? `<span class="sx-badge ok">tamamlandı</span>`
          : gecti ? `<span class="sx-badge no">gecikti</span>` : `<span class="sx-badge wait">bekliyor</span>`}
        </div>
        ${x.durum==="tamamlandi"?"":`<div class="sx-row" style="margin:-6px 0 14px">
          ${x.sinavKodu?`<button class="btn sm" data-sx="odevSinava" data-v="${esc(x.sinavKodu)}">Sınava git</button>`:""}
          <button class="btn ghost sm" data-sx="odevTamam" data-v="${x.id}">Yaptım olarak işaretle</button></div>`}`;
      }).join("") : `<div class="sx-empty">Henüz ödev verilmedi.</div>`}
    </div>

    <div class="card pad" style="margin-top:14px">
      <h3 style="margin-bottom:12px">Sınav geçmişim</h3>
      ${s.length? s.sort((a,b)=>(b.at||0)-(a.at||0)).map(r=>`
        <div class="sx-rank" style="cursor:default">
          <span class="nm">${esc(r.sinavAd||"Sınav")}
            <div class="s" style="font-family:var(--mono);font-size:11.5px;color:var(--gece-2);margin-top:3px">${tarihSaat(r.at)}${r.ogretmenAd?" · "+esc(r.ogretmenAd):""}</div>
            <div class="sx-bar"><i style="width:${yuzde(r)}%"></i></div></span>
          <span class="sc">${r.dogru}/${r.toplam}</span>
          <span class="tm">${yuzde(r)}%</span></div>`).join("")
       : `<div class="sx-empty">Henüz sınav çözmedin. Sınav sekmesinden kodla girebilir ya da serbest alıştırma yapabilirsin.</div>`}
    </div>

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
    </div>
    ${dilSecici()}
  </section>`;
}
function sertifikaKarti(x,u){
  return `<div class="sertifika" id="sert-${x.id}">
    <div class="ser-ust">${esc(DATA.marka.ad)}</div>
    <div class="ser-baslik">Katılım ve Başarı Belgesi</div>
    <div class="ser-ad">${esc(u.ad)}</div>
    <div class="ser-metin">${esc(x.kurs)} programını başarıyla tamamlamıştır.</div>
    ${x.not?`<div class="ser-not">${esc(x.not)}</div>`:""}
    <div class="ser-alt"><span>${tarihKisa(x.at)}</span><span>${esc(x.verenAd||"")}</span></div>
    <button class="btn ghost sm ser-yazdir" data-sx="sertYazdir" data-v="${x.id}">Yazdır / PDF</button>
  </div>`;
}

/* ======================= ÖĞRETMEN: ÖĞRENCİLERİM ======================= */
function sxOgrenciListe(){
  const l=SX.ogrenciler||[], u=SX.user;
  return `<h3 style="margin:6px 0 6px">Öğrencilerim</h3>
    <p class="muted" style="font-size:13.5px;margin-bottom:14px">Öğrencilerin kayıt olurken bu kodu girer, hesapları sana bağlanır.</p>
    <div class="sx-item" style="border:0;padding-top:0">
      <div class="g"><b>Sınıf kodun</b><div class="s">Öğrencilerine bu kodu ver</div></div>
      <span class="sx-pill">${esc(u.sinifKodu||"—")}</span></div>
    ${l.length? l.map(o=>{
      const say=(SX.ogrOzet&&SX.ogrOzet[o.uid])||{sinav:0,ort:0,odev:0};
      return `<div class="sx-item"><div class="g"><b>${esc(o.ad)}</b>
        <div class="s">${esc(o.mail)} · son giriş ${o.sonGiris?tarihSaat(o.sonGiris):"—"}</div></div>
        <span class="sx-badge ok">${say.sinav} sınav</span></div>
      <div class="sx-row" style="margin:-6px 0 14px">
        <button class="btn ghost sm" data-sx="ogrenciAc" data-v="${o.uid}">Detay ve ödev</button></div>`;
    }).join("") : `<div class="sx-empty">Henüz öğrenci bağlı değil. Sınıf kodunu paylaş, öğrencilerin kayıt olurken girsin.</div>`}
    <button class="btn ghost sm" data-sx="ogrenciYenile" style="margin-top:8px">Yenile</button>`;
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
      <button class="btn ghost sm" data-sx="panel">Geri</button></div>
    <div class="sx-stats" style="grid-template-columns:repeat(4,1fr)">
      <div class="sx-stat"><b>${s.length}</b><span>sınav</span></div>
      <div class="sx-stat"><b>${ort}%</b><span>ortalama</span></div>
      <div class="sx-stat"><b>${od.filter(x=>x.durum!=="tamamlandi").length}</b><span>bekleyen ödev</span></div>
      <div class="sx-stat"><b>${c.length}</b><span>sertifika</span></div></div>

    <h3 style="margin:20px 0 10px">Ödev ver</h3>
    <div class="sx-field"><input class="sx-in" id="odBaslik" placeholder="Ödev başlığı — ör. 20 soruluk hız denemesi"></div>
    <div class="sx-field"><input class="sx-in" id="odAciklama" placeholder="Kısa açıklama (isteğe bağlı)"></div>
    <div class="sx-row" style="margin-bottom:14px">
      <input class="sx-in" id="odKod" maxlength="6" placeholder="sınav kodu" style="max-width:150px;text-transform:uppercase">
      <input class="sx-in" id="odTarih" type="date" style="max-width:190px">
      <button class="btn" data-sx="odevVer">Ödevi gönder</button></div>

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
      <button class="btn" data-sx="sertVer">Sertifikayı ver</button></div>
    ${c.length? c.map(x=>`<div class="sx-item"><div class="g"><b>${esc(x.kurs)}</b>
      <div class="s">${tarihKisa(x.at)}${x.not?" · "+esc(x.not):""}</div></div>
      <button class="btn ghost sm" data-sx="sertKaldir" data-v="${x.id}">Sil</button></div>`).join("")
      : `<div class="sx-empty">Henüz sertifika verilmedi.</div>`}

    <h3 style="margin:22px 0 10px">Hareketler</h3>
    ${hareket.length? `<div class="zaman">`+hareket.map(h=>`
      <div class="zaman-sat"><span class="zaman-nokta ${h.tip==="sınav"?"s":h.tip==="belge"?"b":""}"></span>
        <div><b>${esc(h.metin)}</b><div class="s">${tarihSaat(h.t)}</div></div></div>`).join("")+`</div>`
      : `<div class="sx-empty">Hareket kaydı yok.</div>`}
  </div></section>`;
}
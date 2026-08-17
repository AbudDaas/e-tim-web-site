/* Sekme tanımları, yönlendirme, site etkileşimleri, açılış. */

/* ---------------- sekmeler ---------------- */
/* Menü: Ana sayfa · her ders bir sekme · Sınav · Profil · Hakkımızda (+Yönetim) */
function dersSayfalari(){
  return (DATA.dersler||[]).map(d=>({
    yol:"/ders/"+d.id,
    ad:()=>ceviri(d.ad),
    ico:d.ico,
    ders:d.id,
    gor:vDers
  }));
}
function sayfalar(){
  return [{yol:"/", ad:()=>t("anaSayfa"), gor:vAna}]
    .concat(dersSayfalari())
    .concat([
      {yol:"/sinav",   ad:()=>t("sinav"),      gor:vSinav},
      {yol:"/profil",  ad:()=>t("profil"),     gor:vProfil},
      {yol:"/hakkinda",ad:()=>t("hakkimizda"), gor:vHakkinda},
      {yol:"/yonetim", ad:()=>"Yönetim", gor:vYonetim, gizli:()=>!(SX.user&&SX.user.yonetici)}
    ]);
}

/* ---------------- yönlendirme ---------------- */
function yol(){
  const h=location.hash.replace(/^#/,"");
  if(h==="/gizlilik") return h;
  if(h.indexOf("/dogrula")===0) return "/dogrula";
  const s=sayfalar();
  if(s.some(x=>x.yol===h)) return h;
  return "/";
}
function ciz(){
  try{
    const y=yol(), LISTE=sayfalar();
    const s=(y==="/gizlilik")?GIZLI_SAYFA:(y==="/dogrula")?DOGRULA_SAYFA:LISTE.find(x=>x.yol===y);
    if(y==="/dogrula") belgeDogrula();
    SITE.ders = (s&&s.ders) ? s.ders : null;

    $("nav").innerHTML=cevirHtml(LISTE.filter(p=>!(p.gizli&&p.gizli())).map(p=>{
      const nokta = p.ders && typeof dersOdevVar==="function" && dersOdevVar(p.ders) ? '<span class="menu-nokta"></span>' : "";
      const ad = typeof p.ad==="function" ? p.ad() : p.ad;
      return `<a href="#${p.yol}" ${p.yol===y?'aria-current="page"':""}>${p.ico?p.ico+" ":""}${ad}${nokta}</a>`;
    }).join(""));
    const mb=$("menuBtn");
    $("nav").classList.remove("acik");
    if(mb) mb.setAttribute("aria-expanded","false");

    $("view").innerHTML=cevirHtml(s.gor());
    const sad=typeof s.ad==="function"?s.ad():s.ad;
    document.title=(y==="/"?"":sad+" · ")+ceviri(DATA.marka.ad);

    const ab=$("authBtn");
    if(ab){
      const u=SX.user;
      const etiket = u ? (u.ad||"").split(" ")[0] : t("girisYap");
      ab.innerHTML = (u ? '<i class="fa-solid fa-user"></i> ' : '<i class="fa-solid fa-arrow-right-to-bracket"></i> ') + cevirHtml(etiket);
      ab.setAttribute("aria-label", u ? "Profilim" : "Öğretmen girişi");
      ab.classList.toggle("ghost", !u);
    }
    if(SITE.ders && SITE.dersSekme==="yarisma") sayacBasla();
    if(y==="/sinav"&&SX.canli&&typeof cnlEkran==="function"){ $("view").innerHTML=cevirHtml(cnlEkran()); }
    if(y==="/sinav"&&!SX.canli&&SX.ekran==="coz") soruBoya();
    if(y==="/sinav"&&SX.ekran==="ayar") notYenile();
    if(y==="/profil"&&SX.pekran==="editor") notYenile();
    if(y==="/profil"&&SX.pekran==="sonuclar") sonuclariYukle();
    $("brandName").textContent=ceviri(DATA.marka.ad);
    $("brandSub").textContent=ceviri(DATA.marka.alt);
    altBilgiCiz();
    if(typeof ikonlariCiz==="function") ikonlariCiz();
    if(typeof menuOlc==="function") menuOlc();
  }catch(hata){
    console.error("çizim hatası:",hata);
    $("view").innerHTML='<section class="page"><div class="card pad">'+
      '<h2>Bu bölüm açılamadı</h2>'+
      '<p class="muted" style="margin:8px 0 14px">Sayfayı yenilemeyi dene.</p>'+
      '<button class="btn" onclick="location.reload()">Yenile</button></div></section>';
  }
}


window.addEventListener("hashchange",()=>{
  if(SX.ekran==="coz"&&yol()!=="/sinav"){ clearInterval(SX.tick); SX.ekran="giris"; }
  ciz(); window.scrollTo(0,0);
});

/* --- sertifika doğrulama --- */
let _dogrulaSon=null;
async function belgeDogrula(){
  const m=location.hash.match(/[?&]b=([^&]+)/);
  const anahtar=m?decodeURIComponent(m[1]):"";
  if(!anahtar || anahtar===_dogrulaSon) return;
  _dogrulaSon=anahtar;
  SX.dogrulama="araniyor";
  const [uid,id]=anahtar.split(":");
  try{
    const s=await API.sertifikaAl(uid,id);
    if(s){
      let ad="";
      try{ const o=await API.ogrenciAl(uid); ad=o?o.ad:""; }catch(e){}
      SX.dogrulama=Object.assign({ogrenciAd:ad}, s);
    } else SX.dogrulama="yok";
  }catch(e){ SX.dogrulama="yok"; }
  ciz();
}

/* --- site etkileşimleri --- */
document.addEventListener("click",e=>{
  const ds=e.target.closest("[data-dsekme]");
  if(ds){ SITE.dersSekme=ds.dataset.dsekme; filtre=0; ciz(); window.scrollTo(0,0); return; }
  const dk=e.target.closest("[data-ders]");
  if(dk && dk.dataset.ders){ SITE.dersSekme="hakkinda"; location.hash="#/ders/"+dk.dataset.ders; return; }
  const ky=e.target.closest("[data-kayit]");
  if(ky){ acKayitliDers(ky.dataset.kayit, ky.dataset.kders||SITE.ders); return; }
  const al=e.target.closest("[data-alistir]");
  if(al){ SX.taslak=yeniTaslak(); SX.taslak.ders=al.dataset.alistir; SX.ekran="ayar"; location.hash="#/sinav"; return; }
  const f=e.target.closest("[data-filtre]");
  if(f){ filtre=+f.dataset.filtre; ciz(); return; }
  const v=e.target.closest("[data-video]");
  if(v){ acVideo(+v.dataset.video); return; }
  const p=e.target.closest("[data-ep]");
  if(p){ calBolum(+p.dataset.ep); return; }
});
function acKayitliDers(i,ders){
  const liste=(DATA.kayitliDersler||[]).filter(k=>k.ders===ders).sort((a,b)=>(a.sira||0)-(b.sira||0));
  const k=liste[+i]; if(!k) return;
  /* kayıtlı dersler üyelere açık: giriş yoksa profile yönlendir */
  if(typeof girisliMi==="function" && !girisliMi()){
    SX.geriYol=location.hash||"#/dersler"; SX.pekran="giris";
    location.hash="#/profil"; toast("Kayıtlı dersler üyelere açık, önce giriş yap.");
    return;
  }
  videoKutusu(ceviri(k.ad), ceviri(k.ozet), k.yt);
}
function videoKutusu(baslik,alt,yt){
  $("lb").innerHTML=`<div class="lightbox" id="lbBox">
    <div class="box" role="dialog" aria-label="${esc(baslik)}">
      ${yt?`<iframe src="https://www.youtube.com/embed/${esc(yt)}?autoplay=1&rel=0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`
        :`<div style="aspect-ratio:16/9;display:grid;place-items:center;background:linear-gradient(140deg,#4338CA,#7C3AED 60%,#0D9488);color:#fff;text-align:center;padding:24px">
           <div><b style="font-family:var(--disp);font-size:19px">Video henüz bağlanmadı</b>
           <p style="opacity:.85;font-size:14px;margin-top:8px">Yönetim panelinden bu dersin YouTube kimliğini gir.</p></div></div>`}
      <div class="cap"><div><b style="font-family:var(--disp)">${esc(baslik)}</b>
        <div class="muted" style="font-size:13px">${esc(alt||"")}</div></div>
        <button class="close" id="lbClose" aria-label="kapat">×</button></div></div></div>`;
  document.body.style.overflow="hidden";
  const kapat=()=>{ $("lb").innerHTML=""; document.body.style.overflow="" };
  $("lbClose").onclick=kapat;
  $("lbBox").onclick=ev=>{ if(ev.target.id==="lbBox") kapat() };
  document.addEventListener("keydown",function k2(ev){ if(ev.key==="Escape"){kapat();document.removeEventListener("keydown",k2)} });
}
function acVideo(i){
  const v=DATA.kesitler.liste[i];
  $("lb").innerHTML=`<div class="lightbox" id="lbBox">
    <div class="box" role="dialog" aria-label="${esc(v.baslik)}">
      ${v.yt?`<iframe src="https://www.youtube.com/embed/${esc(v.yt)}?autoplay=1&rel=0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`
        :`<div style="aspect-ratio:16/9;display:grid;place-items:center;background:linear-gradient(140deg,#4338CA,#7C3AED 60%,#0D9488);color:#fff;text-align:center;padding:24px">
           <div><b style="font-family:var(--disp);font-size:19px">Video henüz bağlanmadı</b>
           <p style="opacity:.85;font-size:14px;margin-top:8px">İçerik bloğunda bu kesitin <code>yt</code> alanına YouTube video kimliğini yaz.</p></div></div>`}
      <div class="cap"><div><b style="font-family:var(--disp)">${esc(v.baslik)}</b>
        <div class="muted" style="font-size:13px">${esc(v.ders)}</div></div>
        <button class="close" id="lbClose" aria-label="kapat">×</button></div></div></div>`;
  document.body.style.overflow="hidden";
  const kapat=()=>{ $("lb").innerHTML=""; document.body.style.overflow="" };
  $("lbClose").onclick=kapat;
  $("lbBox").onclick=ev=>{ if(ev.target.id==="lbBox") kapat() };
  document.addEventListener("keydown",function k(ev){ if(ev.key==="Escape"){kapat();document.removeEventListener("keydown",k)} });
}
function calBolum(i){
  const b=DATA.podcast.bolumler[i], a=$("audio");
  $("pTag").textContent=cevirHtml("Bölüm "+b.no+" · "+b.sure);
  if(b.mp3){ $("pTitle").textContent=b.baslik; a.src=b.mp3; a.style.display=""; a.play().catch(()=>{}); }
  else { $("pTitle").textContent=b.baslik+" — ses dosyası eklenmedi"; a.removeAttribute("src"); a.style.display="none"; }
  $("player").classList.add("on");
}
$("pClose").onclick=()=>{ $("audio").pause(); $("player").classList.remove("on"); };
let sayacT=null;
function sayacBasla(){
  clearInterval(sayacT);
  const hedef=new Date(DATA.yarismalar.aktif.tarih).getTime();
  const yaz=()=>{
    const k=$("sayac"); if(!k){ clearInterval(sayacT); return; }
    const f=hedef-Date.now();
    if(f<=0){ k.innerHTML=`<div style="padding:10px 16px"><b style="font-size:17px">Yarışma günü geldi</b></div>`; clearInterval(sayacT); return; }
    const g=Math.floor(f/864e5), s=Math.floor(f/36e5)%24, d=Math.floor(f/6e4)%60, sn=Math.floor(f/1e3)%60;
    k.innerHTML=[[g,"gün"],[s,"saat"],[d,"dakika"],[sn,"saniye"]]
      .map(([n,a])=>`<div><b>${String(n).padStart(2,"0")}</b><span>${a}</span></div>`).join("");
  };
  yaz(); sayacT=setInterval(yaz,1000);
}


/* --- menü ölçümü, açılıp kapanması ve kaydırma gölgesi --- */
function menuOlc(){
  const bar=document.querySelector(".bar"), nav=$("nav"), logo=document.querySelector(".logo"), gir=$("authBtn");
  if(!bar||!nav) return;
  document.body.classList.remove("menu-dar");
  const gerekli = nav.scrollWidth + (logo?logo.offsetWidth:0) + (gir?gir.offsetWidth:0) + 56;
  if(gerekli > bar.clientWidth || window.innerWidth<=1180){
    document.body.classList.add("menu-dar");
    nav.classList.remove("acik");
    const mb=$("menuBtn"); if(mb) mb.setAttribute("aria-expanded","false");
  }
}
(function(){
  const btn=$("menuBtn"), nav=$("nav"), ust=document.querySelector(".top");
  if(btn){
    btn.addEventListener("click",e=>{
      e.stopPropagation();
      const acik=nav.classList.toggle("acik");
      btn.setAttribute("aria-expanded",acik);
    });
    nav.addEventListener("click",e=>{ if(e.target.closest("a")){ nav.classList.remove("acik"); btn.setAttribute("aria-expanded","false"); } });
    document.addEventListener("click",e=>{
      if(!nav.contains(e.target)&&!btn.contains(e.target)){ nav.classList.remove("acik"); btn.setAttribute("aria-expanded","false"); }
    });
    document.addEventListener("keydown",e=>{ if(e.key==="Escape"){ nav.classList.remove("acik"); btn.setAttribute("aria-expanded","false"); } });
  }
  if(ust){ const kay=()=>ust.classList.toggle("kayar",window.scrollY>6); kay(); window.addEventListener("scroll",kay,{passive:true}); }
  let zaman=null;
  window.addEventListener("resize",()=>{ clearTimeout(zaman); zaman=setTimeout(menuOlc,120); });
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(menuOlc);
  menuOlc();
})();

/* ---------------- açılış ---------------- */
$("brandName").textContent=ceviri(DATA.marka.ad);
$("brandSub").textContent=ceviri(DATA.marka.alt);
function altBilgiCiz(){
  $("foot").innerHTML=`<b style="font-family:var(--disp);color:var(--gece)">${esc(ceviri(DATA.marka.ad))}</b>
  <span>${esc(ceviri(DATA.hakkimizda.iletisim.adres))}</span>
  <a href="mailto:${esc(DATA.hakkimizda.iletisim.mail)}">${esc(DATA.hakkimizda.iletisim.mail)}</a>
  <a href="#/gizlilik">Gizlilik ve KVKK</a>
  <a href="#/sinav">Sınava gir</a>
  <span style="margin-inline-start:auto">© ${new Date().getFullYear()} ${esc(ceviri(DATA.marka.ad))}</span>`;
}
altBilgiCiz();
KV.init();
(async function ac(){
  /* Yönetim panelinden yayınlanan içerik dosyadakinin yerine geçer.
     Adrese ?icerik=dosya eklenirse kayıtlı içerik yok sayılır. */
  const dosyaModu = /[?&]icerik=dosya/.test(location.search);
  if(!dosyaModu){
    try{
      const kayitli=await API.icerikAl();
      if(kayitli && typeof kayitli==="object"){
        Object.keys(kayitli).forEach(k=>{ if(kayitli[k]!=null) DATA[k]=kayitli[k]; });
      }
    }catch(e){}
  }
  try{
    const u=await API.oturumTazele();
    if(u){ SX.user=u;
      if(u.durum==="onayli"){
        if(u.rol==="ogrenci"){ await ogrenciVerileriYukle(u.uid); await sinifIcerikYukle(u.ogretmen); }
        else if(u.rol==="veli"){ await veliVerileriYukle(); }
        else { SX.pekran="panel"; if(u.yonetici) await hesaplariYukle(); await sinavlariYukle(); await ogrencileriYukle(); await sinifIcerikYukle(u.uid); }
      }
    }
  }catch(e){}
  const m=location.hash.match(/^#k=([A-Z0-9]{4,8})$/i);
  if(m){ await API.anonim();
    try{ const x=await API.sinavAl(m[1].toUpperCase());
      if(x&&x.acik!==false){ SX.exam=x; SX.alistirma=false; SX.ekran="isim"; location.hash="#/sinav"; return; }
    }catch(e){}
  }
  ciz();
})();
/* Çözüm motoru, olaylar, sınav ve hesap işlemleri. */


/* ---------- flash anzan ve sesli aritmetik ---------- */
let flashZaman=null, flashJeton=0;
function oynatmaDurdur(){
  flashJeton++; clearTimeout(flashZaman);
  try{ if(window.speechSynthesis) speechSynthesis.cancel(); }catch(e){}
}
function seslendir(v){
  try{
    if(!window.speechSynthesis) return false;
    const dil=(typeof aktifDil==="function")?aktifDil():"tr";
    const on = v<0 ? (dil==="ar"?"ناقص ":dil==="en"?"minus ":"eksi ") : "";
    const u=new SpeechSynthesisUtterance(on+Math.abs(v));
    u.lang = dil==="ar" ? "ar-SA" : dil==="en" ? "en-US" : "tr-TR";
    u.rate=1.05;
    speechSynthesis.cancel(); speechSynthesis.speak(u);
    return true;
  }catch(e){ return false; }
}
function terimleriOynat(){
  const q=SX.qs[SX.i], kip=SX.exam.kip||"liste", hiz=Math.max(250, +SX.exam.hiz || 900);
  const kutu=$("sxStack"), cevap=$("sxCevap");
  const jeton=++flashJeton; clearTimeout(flashZaman);
  let i=0;
  cevap.disabled=true;
  kutu.innerHTML='<div class="sx-flash bekle" id="sxFlash">•••</div>';
  const bitir2=()=>{
    const f=$("sxFlash"); if(f){ f.textContent="?"; f.className="sx-flash bitti"; }
    cevap.disabled=false;
    if(window.innerWidth>760) cevap.focus();
  };
  const goster=()=>{
    if(jeton!==flashJeton) return;
    const f=$("sxFlash"); if(!f) return;
    if(i>=q.t.length){ bitir2(); return; }
    const v=q.t[i++];
    if(kip==="sesli"){
      f.textContent="🔊"; f.className="sx-flash ses";
      if(!seslendir(v)){ f.textContent=sayiYaz(v,SX.exam.eksiSag); f.className="sx-flash"; }
    } else {
      f.textContent=sayiYaz(v,SX.exam.eksiSag);
      f.className="sx-flash"+(v<0?" neg":"");
      void f.offsetWidth; f.classList.add("gir");
    }
    flashZaman=setTimeout(()=>{
      if(jeton!==flashJeton) return;
      const f2=$("sxFlash");
      if(f2 && kip==="flash"){ f2.textContent=""; f2.className="sx-flash"; }
      flashZaman=setTimeout(goster, Math.max(110, Math.round(hiz*0.25)));
    }, hiz);
  };
  flashZaman=setTimeout(goster, 700);
}

/* --- çözüm motoru --- */
function sinavListesi(){
  const l=SX.exam.qs.slice();
  if(SX.exam.karistir) for(let i=l.length-1;i>0;i--){const j=rnd(0,i);[l[i],l[j]]=[l[j],l[i]]}
  return l;
}
function cozBasla(liste){
  oynatmaDurdur();
  SX.qs=liste; SX.answers=new Array(liste.length).fill(null); SX.times=new Array(liste.length).fill(0);
  SX.i=0; SX.sureBitti=false; SX._kaydedildi=false;
  SX.t0=Date.now(); SX.bitis=SX.exam.limit>0?SX.t0+SX.exam.limit*1000:0;
  clearInterval(SX.tick); SX.tick=setInterval(saatTik,200);
  SX.ekran="coz"; ciz(); saatTik();
}
function saatTik(){
  const c=$("sxClock"); if(!c){clearInterval(SX.tick);return}
  if(SX.bitis){
    const kalan=SX.bitis-Date.now();
    c.textContent=sure(kalan); c.classList.toggle("low",kalan<=30000);
    if(kalan<=0){ SX.sureBitti=true; bitir(); }
  } else c.textContent=sure(Date.now()-SX.t0);
}
function railBoya(){
  const r=$("sxRail"); if(!r) return;
  const sira=Math.ceil(SX.qs.length/10); let h="";
  for(let s=0;s<sira;s++){
    h+='<div class="sx-rod">';
    for(let b=0;b<Math.min(10,SX.qs.length-s*10);b++){
      const k=s*10+b; let c="sx-bead";
      if(SX.answers[k]!==null) c+= SX.answers[k]===SX.qs[k].c?" ok":" no";
      if(k===SX.i) c+=" now";
      h+=`<div class="${c}"></div>`;
    }
    h+="</div>";
  }
  r.innerHTML=cevirHtml(h);
}
function soruBoya(){
  SX.kilit=false;
  const q=SX.qs[SX.i], sag=SX.exam.eksiSag;
  $("sxIlerleme").textContent=cevirHtml((SX.i+1)+" / "+SX.qs.length);
  $("sxHukum").textContent=""; $("sxHukum").className="sx-verdict";
  const g=$("sxCevap"); g.value=""; g.disabled=false;
  $("sxStack").innerHTML='<div class="rod"></div>'+
    q.t.map((v,i)=>`<div class="sx-term${v<0?" neg":""}" style="animation-delay:${i*45}ms">${sayiYaz(v,sag)}</div>`).join("")+
    '<div class="sx-sum"></div>';
  railBoya(); SX.qt0=Date.now();
  if(window.innerWidth>760) g.focus();
}
function cevapla(){
  if(SX.kilit||SX.ekran!=="coz") return;
  const kutu=$("sxCevapKutu"), ham=($("sxCevap").value||"").trim().replace(/[−–]/g,"-");
  if(ham===""||isNaN(Number(ham))){ kutu.classList.remove("shake"); void kutu.offsetWidth; kutu.classList.add("shake"); return; }
  SX.kilit=true;
  const v=Number(ham), q=SX.qs[SX.i], dogru=v===q.c;
  SX.answers[SX.i]=v; SX.times[SX.i]=Date.now()-SX.qt0;
  $("sxCevap").disabled=true;
  if(SX.exam.geriBildirim!==false){
    $("sxHukum").textContent=cevirHtml(dogru?"Doğru":`Yanlış — doğrusu ${q.c}`);
    $("sxHukum").className="sx-verdict "+(dogru?"ok":"no");
    bip(dogru?880:165, dogru? 0.09 : 0.16, dogru?"triangle":"square");
    if(!dogru){ kutu.classList.remove("shake"); void kutu.offsetWidth; kutu.classList.add("shake"); }
  } else { $("sxHukum").textContent="Cevap alındı"; bip(660,.07,"triangle"); }
  railBoya();
  const bekle=SX.exam.geriBildirim===false?260:(dogru?520:1150);
  setTimeout(()=>{ if(SX.sureBitti) return;
    if(SX.i>=SX.qs.length-1) bitir(); else { SX.i++; soruBoya(); } },bekle);
}
async function bitir(){
  clearInterval(SX.tick); oynatmaDurdur();
  if(SX.ekran==="sonuc") return;
  SX._sure=(SX.bitis&&SX.sureBitti)?SX.exam.limit*1000:Date.now()-SX.t0;
  SX._cevap=SX.answers.filter(a=>a!==null).length;
  SX._dogru=SX.answers.filter((a,i)=>a!==null&&a===SX.qs[i].c).length;
  SX._yanlis=SX.qs.filter((q,i)=>SX.answers[i]!==q.c);
  SX._kaydedildi=false;
  if(SX.alistirma && SX.user && SX.user.rol==="ogrenci"){
    try{
      await API.ogrenciSonucYaz(SX.user.uid,{ sinavKod:"", sinavAd:"Serbest alıştırma",
        dogru:SX._dogru, toplam:SX.qs.length, sure:SX._sure, at:Date.now(), ogretmenAd:"",
        dokum:SX.qs.map((q,i)=>({q:q.t.map(x=>sayiYaz(x,SX.exam.eksiSag)).join(" "),a:SX.answers[i],c:q.c})) });
      await ogrenciVerileriYukle(SX.user.uid);
    }catch(err){}
  }
  if(!SX.alistirma&&SX.exam.kod){
    try{
      await API.sonucYaz(SX.exam.kod,{ ad:SX.ogrenci, dogru:SX._dogru, toplam:SX.qs.length,
        cevaplanan:SX._cevap, sure:SX._sure, at:Date.now(), sureBitti:SX.sureBitti, sahip:SX.exam.sahip||"",
        ogrenciUid:(SX.user&&SX.user.rol==="ogrenci")?SX.user.uid:"",
        dokum:SX.qs.map((q,i)=>({q:q.t.map(v=>sayiYaz(v,SX.exam.eksiSag)).join(" "),a:SX.answers[i],c:q.c})) });
      const oturumluOgrenci = SX.user && SX.user.rol==="ogrenci";
      if(oturumluOgrenci){
        await API.ogrenciSonucYaz(SX.user.uid,{ sinavKod:SX.exam.kod, sinavAd:SX.exam.ad,
          dogru:SX._dogru, toplam:SX.qs.length, sure:SX._sure, at:Date.now(),
          ogretmenAd:SX.exam.sahipAd||"" });
        const odev=(SX.ogrOdev||[]).find(x=>x.sinavKodu===SX.exam.kod&&x.durum!=="tamamlandi");
        if(odev){ odev.durum="tamamlandi"; odev.tamamlandiAt=Date.now();
          try{ await API.odevYaz(SX.user.uid,odev) }catch(err){} }
        await ogrenciVerileriYukle(SX.user.uid);
      }
      SX._kaydedildi=true;
    }catch(e){ SX._kaydedildi=false; }
  }
  SX.ekran="sonuc"; ciz();
}

/* --- olaylar --- */
document.addEventListener("click",async e=>{
  const b=e.target.closest("[data-sx]"); if(!b) return;
  const a=b.dataset.sx, v=b.dataset.v;
  if(a==="chip"){ taslakYaz(b.dataset.k,b.dataset.v); ciz(); return; }
  const islem={
    sinavGiris:()=>{ clearInterval(SX.tick); SX.ekran="giris"; ciz(); },
    alistirmaAyar:()=>{ SX.taslak=yeniTaslak(); SX.ekran="ayar"; ciz(); },
    alistirmaBasla:()=>{
      const qs=taslakSorular(); if(!qs.length){ toast("En az bir soru gerekli."); return; }
      const d=SX.taslak;
      SX.exam={ad:"Serbest alıştırma",qs,limit:d.limit,eksiSag:d.eksiSag,karistir:d.karistir,
        kip:d.kip||"liste", hiz:d.hiz||900, havuz:+d.havuz||0, tekDeneme:!!d.tekDeneme,
        geriBildirim:d.geriBildirim,gosterYanlis:true,ses:d.ses};
      SX.alistirma=true; SX.ogrenci=""; cozBasla(sinavListesi());
    },
    rolSec:()=>{ SX.kayitRol=v; ciz(); },
    duyuruEkle:async()=>{
      const baslik=($("duyBaslik").value||"").trim();
      if(!baslik){ toast("Duyuru başlığı gerekli."); return; }
      const d={baslik, metin:($("duyMetin").value||"").trim(), sahip:SX.user.uid,
               sahipAd:SX.user.ad, at:Date.now()};
      await API.duyuruYaz(d);
      for(const o of (SX.ogrenciler||[])) await API.bildirimYaz(o.uid,{tip:"duyuru",metin:"Duyuru: "+baslik});
      SX.duyurular=await API.duyurular(SX.user.uid); ciz(); toast("Duyuru yayınlandı.");
    },
    duyuruSil:async()=>{
      if(!confirm("Duyuru silinsin mi?")) return;
      await API.duyuruSil(v); SX.duyurular=await API.duyurular(SX.user.uid); ciz();
    },
    programEkle:async()=>{
      const satir={gun:+$("prgGun").value, saat:$("prgSaat").value||"", grup:($("prgGrup").value||"").trim()};
      if(!satir.saat){ toast("Saat gerekli."); return; }
      const p=(SX.program&&SX.program.satirlar)||[];
      p.push(satir);
      await API.programYaz(SX.user.uid,p);
      SX.program={sahip:SX.user.uid,satirlar:p}; ciz(); toast("Programa eklendi.");
    },
    programSil:async()=>{
      const p=((SX.program&&SX.program.satirlar)||[]).slice();
      const sirali=p.slice().sort((a,b)=>(a.gun-b.gun)||String(a.saat).localeCompare(String(b.saat)));
      const hedef=sirali[+v]; if(!hedef) return;
      const i=p.indexOf(hedef); if(i>=0) p.splice(i,1);
      await API.programYaz(SX.user.uid,p);
      SX.program={sahip:SX.user.uid,satirlar:p}; ciz();
    },
    bildirimOku:async()=>{
      const hedef=(SX.user.rol==="veli"&&SX.user.cocuk)?SX.user.cocuk:SX.user.uid;
      for(const x of (SX.bildirim||[])) if(!x.okundu) await API.bildirimOku(hedef,x);
      SX.bildirim=await API.bildirimler(hedef); ciz();
    },
    zayifCalis:()=>{
      SX.taslak=yeniTaslak();
      SX.taslak.seviye=+v || 1; SX.taslak.adet=20; SX.taslak.limit=300;
      SX.ekran="ayar"; location.hash="#/sinav";
      toast("Zorlandığın tipe göre alıştırma hazırlandı, Başla'ya bas.");
    },
    cocugaBaglan:async()=>{
      const n=$("sxCocukNot"), kod=($("sxCocukKod").value||"").trim().toUpperCase();
      if(kod.length<4){ n.innerHTML=`<span class="sx-warn">Kodu eksiksiz yaz.</span>`; return; }
      const bag=await API.veliBagAl(kod);
      if(!bag){ n.innerHTML=`<span class="sx-warn">Bu kodla öğrenci bulunamadı. Çocuğun profilindeki kodu kontrol et.</span>`; return; }
      SX.user.cocuk=bag.ogrenci; SX.user.cocukAd=bag.ogrenciAd;
      await API.hesapYaz(SX.user);
      await veliVerileriYukle(); ciz(); toast("Çocuğuna bağlandın.");
    },
    yoklamaSec:()=>{ SX.yoklamaSecim=SX.yoklamaSecim||{}; SX.yoklamaSecim[v]=b.dataset.d; ciz(); },
    yoklamaHepsi:()=>{ SX.yoklamaSecim={}; (SX.ogrenciler||[]).forEach(o=>SX.yoklamaSecim[o.uid]=v); ciz(); },
    yoklamaYukle:async()=>{ SX.yoklamaTarih=$("yokTarih").value||bugun(); await yoklamaGunuYukle(); ciz(); },
    yoklamaKaydet:async()=>{
      const tarih=$("yokTarih").value||bugun();
      const secim=SX.yoklamaSecim||{}, n=$("yokNot");
      const uidler=Object.keys(secim);
      if(!uidler.length){ toast("Önce öğrencileri işaretle."); return; }
      if(n) n.textContent="Kaydediliyor…";
      let ok=0;
      for(const uid of uidler){
        try{
          await API.yoklamaYaz(uid,tarih,{durum:secim[uid],at:Date.now(),ogretmen:SX.user.uid});
          if(secim[uid]==="gelmedi") await API.bildirimYaz(uid,{tip:"yoklama",metin:tarih+" dersine gelinmedi"});
          ok++;
        }catch(err){}
      }
      SX.yoklamaTarih=tarih;
      if(n) n.innerHTML=`<span class="sx-good">${tarih} için ${ok} öğrenci kaydedildi.</span>`;
      toast("Yoklama kaydedildi.");
    },
    tekrarOynat:()=>{ if(SX.alistirma) terimleriOynat(); },
    karneAc:async()=>{
      if(SX.user.rol==="ogrenci" && !SX.acikOgrenci) await ogrenciVerileriYukle(SX.user.uid);
      SX.karne=true; SX.pekran="karne"; ciz();
    },
    karneKapat:()=>{ SX.karne=false; SX.pekran=SX.acikOgrenci?"ogrenci":"panel"; ciz(); },
    karneYazdir:()=>{
      document.body.classList.add("karne-modu");
      setTimeout(()=>{ window.print(); document.body.classList.remove("karne-modu"); },80);
    },
    gururHesapla:gururHesapla,
    topluOdev:async()=>{
      const liste=SX.ogrenciler||[];
      const n=$("topNot");
      const baslik=($("topBaslik").value||"").trim();
      if(!baslik){ toast("Ödev başlığı gerekli."); return; }
      if(!liste.length){ toast("Bağlı öğrenci yok."); return; }
      if(!confirm(liste.length+" öğrenciye bu ödev gönderilsin mi?")) return;
      const kod=($("topKod").value||"").trim().toUpperCase(), sonTarih=$("topTarih").value||"";
      if(n) n.textContent="Gönderiliyor…";
      let ok=0, hata=0;
      for(const o of liste){
        try{
          await API.odevYaz(o.uid,{ baslik, aciklama:"", sinavKodu:kod, sonTarih,
            durum:"verildi", at:Date.now(), veren:SX.user.uid, verenAd:SX.user.ad });
          await API.bildirimYaz(o.uid,{tip:"odev",metin:"Yeni ödev: "+baslik});
          ok++;
        }catch(err){ hata++; }
      }
      $("topBaslik").value=""; $("topKod").value="";
      if(n) n.innerHTML = hata
        ? `<span class="sx-warn">${ok} öğrenciye gitti, ${hata} tanesinde hata oldu.</span>`
        : `<span class="sx-good">${ok} öğrenciye gönderildi.</span>`;
      toast(ok+" öğrenciye ödev gönderildi.");
    },
    yoneticiAc:async()=>{
      const n=$("sxDurumNot"); if(n) n.textContent="Yönetici yetkisi veriliyor…";
      try{
        const u=await API.yoneticiZorla(SX.user);
        await girisSonrasi(u); toast("Yönetici hesabı açıldı.");
      }catch(err){
        if(n) n.innerHTML=`<span class="sx-warn">Olmadı: ${String(err.message||err)}</span>`;
      }
    },
    dilSec:()=>{ dilAyarla(v); ciz(); toast(t("dilDegisti")); },
    yonTab:()=>{ SX.yonTab=v; ciz(); },
    yonKaydet:yonKaydet, yonYedek:yonYedek, yonSifirla:yonSifirla,
    yonEkle:()=>{
      const yol=b.dataset.y, l=yonListeBul(yol); if(!l) return;
      const dizi=pAl(DATA,yol)||[];
      dizi.push(l.duz? l.yeni : JSON.parse(JSON.stringify(l.yeni)));
      pYaz(DATA,yol,dizi); SX.yonKirli=true; ciz();
    },
    yonSil:()=>{
      const yol=b.dataset.y, i=+b.dataset.i;
      const dizi=pAl(DATA,yol)||[];
      if(!confirm("Bu kayıt silinsin mi?")) return;
      dizi.splice(i,1); pYaz(DATA,yol,dizi); SX.yonKirli=true; ciz();
    },
    yonTasi:()=>{
      const yol=b.dataset.y, i=+b.dataset.i, d=+b.dataset.d;
      const dizi=pAl(DATA,yol)||[]; const j=i+d;
      if(j<0||j>=dizi.length) return;
      [dizi[i],dizi[j]]=[dizi[j],dizi[i]];
      pYaz(DATA,yol,dizi); SX.yonKirli=true; ciz();
    },
    durumKontrol:async()=>{
      const n=$("sxDurumNot"); if(n) n.textContent="Kontrol ediliyor…";
      try{
        const u=await API.oturumTazele();
        if(u){ SX.user=u;
          if(u.durum==="onayli"){ await girisSonrasi(u); toast("Hesabın açıldı."); return; }
        }
        if(n) n.innerHTML=`<span class="sx-warn">Hesabın hâlâ onay bekliyor.</span>`;
      }catch(err){ if(n) n.innerHTML=`<span class="sx-warn">Bağlantı kurulamadı.</span>`; }
    },
    rolDegis:async()=>{
      const u=SX.hesaplar.find(x=>x.uid===v); if(!u) return;
      const yeni=b.dataset.s;
      if(!confirm((u.ad||u.mail)+" hesabı "+(yeni==="ogretmen"?"öğretmen":"öğrenci")+" yapılsın mı?")) return;
      await API.rolDegis(u,yeni);
      await hesaplariYukle(); await ogrencileriYukle(); ciz();
      toast("Rol güncellendi.");
    },
    girisIste:()=>{ SX.geriYol=location.hash||"#/"; SX.pekran="giris"; location.hash="#/profil"; },
    kayitIste:()=>{ SX.geriYol=location.hash||"#/"; SX.pekran="kayit"; SX.kayitRol="ogrenci"; location.hash="#/profil"; },
    ogrenciYenile:async()=>{ await ogrencileriYukle(); ciz(); toast("Liste güncellendi."); },
    ogrenciAc:async()=>{
      const o=(SX.ogrenciler||[]).find(x=>x.uid===v); if(!o) return;
      SX.acikOgrenci=o; SX.pekran="ogrenci"; ciz();
      const [s,od,c,y]=await Promise.all([API.ogrenciSonuclari(v),API.odevler(v),API.sertifikalar(v),API.yoklamalar(v)]);
      SX.ogrSonuc=s; SX.ogrOdev=od; SX.ogrSertifika=c; SX.ogrYoklama=y; ciz();
    },
    odevVer:async()=>{
      const o=SX.acikOgrenci; if(!o) return;
      const baslik=($("odBaslik").value||"").trim();
      if(!baslik){ toast("Ödev başlığı gerekli."); return; }
      const odev={ baslik, aciklama:($("odAciklama").value||"").trim(),
        sinavKodu:($("odKod").value||"").trim().toUpperCase(),
        sonTarih:$("odTarih").value||"", durum:"verildi", at:Date.now(),
        veren:SX.user.uid, verenAd:SX.user.ad };
      try{ await API.odevYaz(o.uid,odev);
        await API.bildirimYaz(o.uid,{tip:"odev",metin:"Yeni ödev: "+odev.baslik});
      }catch(err){ toast("Kaydedilemedi."); return; }
      SX.ogrOdev=await API.odevler(o.uid); ciz(); toast("Ödev gönderildi.");
    },
    odevKaldir:async()=>{
      const o=SX.acikOgrenci; if(!o||!confirm("Ödev silinsin mi?")) return;
      await API.odevSil(o.uid,v); SX.ogrOdev=await API.odevler(o.uid); ciz();
    },
    sertVer:async()=>{
      const o=SX.acikOgrenci; if(!o) return;
      const s={ kurs:$("sertKurs").value, not:($("sertNot").value||"").trim(),
        at:Date.now(), veren:SX.user.uid, verenAd:SX.user.ad };
      try{ await API.sertifikaYaz(o.uid,s);
        await API.bildirimYaz(o.uid,{tip:"sertifika",metin:"Sertifika verildi: "+ceviri(s.kurs)});
      }catch(err){ toast("Kaydedilemedi."); return; }
      SX.ogrSertifika=await API.sertifikalar(o.uid); ciz(); toast("Sertifika verildi.");
    },
    sertKaldir:async()=>{
      const o=SX.acikOgrenci; if(!o||!confirm("Sertifika silinsin mi?")) return;
      await API.sertifikaSil(o.uid,v); SX.ogrSertifika=await API.sertifikalar(o.uid); ciz();
    },
    odevTamam:async()=>{
      const x=(SX.ogrOdev||[]).find(o=>o.id===v); if(!x) return;
      x.durum="tamamlandi"; x.tamamlandiAt=Date.now();
      await API.odevYaz(SX.user.uid,x); await ogrenciVerileriYukle(SX.user.uid); ciz(); toast("Ödev tamamlandı olarak işaretlendi.");
    },
    odevSinava:()=>{ SX.ekran="giris"; location.hash="#/sinav";
      setTimeout(()=>{ const k=$("sxKod"); if(k){ k.value=v; kodGir(); } },120); },
    ogretmeneBaglan:async()=>{
      const kod=($("sxBagKod").value||"").trim().toUpperCase();
      const n=$("sxBagNot");
      if(kod.length<4){ n.innerHTML=`<span class="sx-warn">Kodu eksiksiz yaz.</span>`; return; }
      const sinif=await API.sinifAl(kod);
      if(!sinif){ n.innerHTML=`<span class="sx-warn">Bu kodla öğretmen bulunamadı. Öğretmeninin bir kez giriş yapmış olması gerekir; kodu ondan tekrar teyit et.</span>`; return; }
      SX.user.ogretmen=sinif.ogretmen; SX.user.ogretmenAd=sinif.ogretmenAd;
      await API.hesapYaz(SX.user); ciz(); toast("Öğretmenine bağlandın.");
    },
    sertYazdir:()=>{
      const el=document.getElementById("sert-"+v); if(!el) return;
      document.body.classList.add("yazdir-modu");
      document.querySelectorAll(".sertifika").forEach(x=>x.classList.toggle("yazdirilacak",x===el));
      setTimeout(()=>{ window.print(); document.body.classList.remove("yazdir-modu"); },60);
    },
    kodGir:kodGir, basla:isimOnayla, kontrol:cevapla, bitir:()=>bitir(),
    tekrar:()=>{ SX.sureBitti=false; cozBasla(sinavListesi()); },
    yanlislar:()=>{ if(SX._yanlis&&SX._yanlis.length){ SX.sureBitti=false; cozBasla(SX._yanlis.slice()); } },
    ptab2:()=>{ SX.pekran=v; ciz(); },
    ptab:async()=>{ SX.ptab=v; ciz(); if(v==="ogrenciler"){ await yoklamaGunuYukle(); ciz(); } },
    girisYap:girisYap, kayitOl:kayitOl,
    cikis:()=>{ Oturum.sil(); SX.user=null; SX.sinavlar=[]; SX.hesaplar=[]; FB.token=null; SX.pekran="giris"; ciz(); toast("Çıkış yapıldı."); },
    sifreUnuttum:async()=>{
      const mail=($("sxMail").value||"").trim();
      if(!mailMi(mail)){ $("sxAuthNot").innerHTML=`<span class="sx-warn">Önce e-posta adresini yaz, sıfırlama bağlantısını oraya gönderelim.</span>`; return; }
      try{ await API.sifreSifirla(mail); $("sxAuthNot").innerHTML=`<span class="sx-good">Sıfırlama bağlantısı ${esc(mail)} adresine gönderildi.</span>`; }
      catch(e){ $("sxAuthNot").innerHTML=`<span class="sx-warn">${/YEREL/.test(e.message)?"Şifre sıfırlama yalnız bulut modunda çalışır.":"Gönderilemedi, adresi kontrol et."}</span>`; }
    },
    hesapYenile:async()=>{ await hesaplariYukle(); ciz(); },
    durum:async()=>{ const u=SX.hesaplar.find(x=>x.uid===v); if(!u)return;
      u.durum=b.dataset.s; await API.hesapYaz(u); ciz();
      toast(b.dataset.s==="onayli"?"Hesap onaylandı.":"Hesap askıya alındı."); },
    hesapSil:async()=>{ if(!confirm("Hesap silinsin mi?"))return;
      const u=SX.hesaplar.find(x=>x.uid===v); if(!u)return;
      await API.hesapSil(u); SX.hesaplar=SX.hesaplar.filter(x=>x.uid!==v); ciz(); },
    yeniSinav:()=>{ SX.taslak=yeniTaslak(); SX.pekran="editor"; ciz(); },
    duzenle:()=>{ const x=SX.sinavlar.find(s=>s.kod===v); if(!x)return;
      SX.taslak={ad:x.ad,kaynak:"elle",seviye:1,adet:x.qs.length,metin:sorulariYaz(x.qs),limit:x.limit,
        eksiSag:x.eksiSag,karistir:x.karistir,geriBildirim:x.geriBildirim!==false,
        gosterYanlis:x.gosterYanlis!==false,ses:x.ses!==false,acik:x.acik!==false,kod:x.kod,
        kip:x.kip||"liste", hiz:x.hiz||900, havuz:+x.havuz||0, tekDeneme:!!x.tekDeneme};
      SX.pekran="editor"; ciz(); },
    sinavKaydet:sinavKaydet,
    acKapa:async()=>{ const x=SX.sinavlar.find(s=>s.kod===v); if(!x)return;
      x.acik=x.acik===false; await API.sinavYaz(x); ciz();
      toast(x.acik?"Sınav açıldı.":"Sınav kapatıldı."); },
    sinavSil:async()=>{ if(!confirm("Sınav ve sonuçları silinsin mi?"))return;
      await API.sinavSil(v); SX.sinavlar=SX.sinavlar.filter(s=>s.kod!==v); ciz(); },
    sonucAc:()=>{ SX.resCode=v; SX.acikSonuc=null; SX.pekran="sonuclar"; ciz(); },
    sonucYenile:sonuclariYukle,
    sonucAcKapa:()=>{ SX.acikSonuc=(SX.acikSonuc===v?null:v); sonucBoya(); },
    sonucSil:async()=>{ if(!confirm("Sonuç silinsin mi?"))return;
      await API.sonucSil(v); SX.acikSonuc=null; await sonuclariYukle(); },
    csv:csvIndir, panel:()=>{ SX.acikOgrenci=null; SX.pekran="panel"; ciz(); },
    kopyala:()=>kopyala($("sxPay").value,b),
    whatsapp:()=>window.open("https://wa.me/?text="+encodeURIComponent($("sxPay").value),"_blank")
  }[a];
  if(islem) islem();
});
document.addEventListener("click",e=>{
  const b=e.target.closest("#sxPad button"); if(!b||SX.kilit) return;
  const g=$("sxCevap"), k=b.dataset.k;
  if(k==="sil") g.value=g.value.slice(0,-1);
  else if(k==="-") g.value=g.value.startsWith("-")?g.value.slice(1):"-"+g.value;
  else g.value+=k;
});
document.addEventListener("input",e=>{
  const i=e.target.closest("[data-sxbind]"); if(!i||!SX.taslak) return;
  const k=i.dataset.sxbind;
  if(k==="limitDk"){ const m=parseFloat(i.value); if(m>0) SX.taslak.limit=Math.round(m*60); }
  else { SX.taslak[k]=i.value; if(k==="metin") notYenile(); }
});
document.addEventListener("keydown",e=>{
  if(e.key!=="Enter") return;
  const id=e.target.id;
  if(id==="sxKod") kodGir();
  else if(id==="sxIsim") isimOnayla();
  else if(id==="sxCevap") cevapla();
  else if(id==="sxMail"||id==="sxSifre"||id==="sxAd") (SX.pekran==="kayit"?kayitOl:girisYap)();
});

/* --- işlemler --- */
async function kodGir(){
  const kod=($("sxKod").value||"").trim().toUpperCase();
  const b=document.querySelector('[data-sx="kodGir"]');
  if(kod.length<4){ $("sxKodNot").innerHTML=`<span class="sx-warn">Kod altı haneli olmalı.</span>`; return; }
  mesgul(b,true); $("sxKodNot").textContent="Sınav aranıyor…";
  await API.anonim();
  let x=null; try{ x=await API.sinavAl(kod) }catch(e){}
  mesgul(b,false);
  if(!x){ $("sxKodNot").innerHTML=`<span class="sx-warn">Bu kodla sınav bulunamadı. Kodu öğretmeninle bir daha kontrol et.</span>`; return; }
  if(x.acik===false){ $("sxKodNot").innerHTML=`<span class="sx-warn">Bu sınav şu an kapalı.</span>`; return; }
  if(x.tekDeneme && SX.user && SX.user.rol==="ogrenci"){
    const cozulmus=(SX.ogrSonuc||[]).some(r=>r.sinavKod===x.kod);
    if(cozulmus){ $("sxKodNot").innerHTML=`<span class="sx-warn">Bu sınavı zaten çözdün. Tek deneme hakkı var.</span>`; return; }
  }
  SX.exam=x; SX.alistirma=false;
  if(SX.user&&SX.user.rol==="ogrenci"){ SX.ogrenci=SX.user.ad; }
  SX.ekran="isim"; ciz();
}
function isimOnayla(){
  const ad=($("sxIsim").value||"").trim();
  if(!ad){ $("sxIsim").focus(); toast("Önce adını yaz."); return; }
  SX.ogrenci=ad; cozBasla(sinavListesi());
}
async function girisYap(){
  const n=$("sxAuthNot"), b=document.querySelector('[data-sx="girisYap"]');
  const mail=($("sxMail").value||"").trim(), sifre=$("sxSifre").value||"";
  if(!mailMi(mail)){ n.innerHTML=`<span class="sx-warn">Geçerli bir e-posta yaz.</span>`; return; }
  mesgul(b,true); n.textContent="Giriş yapılıyor…";
  try{ const u=await API.giris(mail,sifre); await girisSonrasi(u); }
  catch(err){
    mesgul(b,false);
    const m=String(err.message||"");
    let mesaj;
    if(/HATALI/.test(m)) mesaj="E-posta veya şifre hatalı.";
    else if(/COK_DENEME/.test(m)) mesaj="Çok fazla deneme yapıldı, biraz bekleyip tekrar dene.";
    else if(/KURAL/.test(m)) mesaj="Giriş yapıldı ama hesap bilgisi okunamadı — Firestore kurallarını güncelle. ("+m+")";
    else if(!bulut()) mesaj="Bu cihazda böyle bir hesap yok. Site deneme modunda: hesaplar kaydolduğu tarayıcıda kalır.";
    else mesaj="Bağlantı kurulamadı. ("+m+")";
    n.innerHTML=`<span class="sx-warn">${mesaj}</span>`;
  }
}
async function kayitOl(){
  const n=$("sxAuthNot"), ad=($("sxAd")?$("sxAd").value:"").trim();
  const mail=($("sxMail").value||"").trim(), sifre=$("sxSifre").value||"";
  const rol=SX.kayitRol||"ogrenci";
  const sinifKodu=($("sxSinifKodu")?$("sxSinifKodu").value:"").trim().toUpperCase();
  if(!ad){ n.innerHTML=`<span class="sx-warn">Adını yaz.</span>`; return; }
  if(!mailMi(mail)){ n.innerHTML=`<span class="sx-warn">Geçerli bir e-posta yaz.</span>`; return; }
  if(sifre.length<6){ n.innerHTML=`<span class="sx-warn">Şifre en az 6 karakter olmalı.</span>`; return; }
  const b=document.querySelector('[data-sx="kayitOl"]'); mesgul(b,true); n.textContent="Hesap oluşturuluyor…";
  try{
    const u=await API.kayit(mail,sifre,ad,rol,sinifKodu);
    if(u.durum==="onayli") await girisSonrasi(u);
    else { SX.user=u; toast("Kaydın alındı. Yönetici onayı bekleniyor."); ciz(); }
  }catch(err){
    mesgul(b,false);
    const m=/MAIL_VAR/.test(err.message) ? "Bu e-posta zaten kayıtlı. Giriş yap sekmesini dene."
      : /VELI_KOD_YOK/.test(err.message) ? "Bu veli kodu bulunamadı. Çocuğun profilindeki kodu kontrol et."
      : /SINIF_YOK/.test(err.message) ? "Bu öğretmen kodu bulunamadı. Boş bırakıp sonra da ekleyebilirsin."
      : "Bağlantı kurulamadı, internetini kontrol et.";
    n.innerHTML=cevirHtml(`<span class="sx-warn">${m}</span>`);
  }
}
async function girisSonrasi(u){
  SX.user=u; Oturum.yaz(u);
  const geri=SX.geriYol; SX.geriYol=null;
  try{ await API.girisIzi(u) }catch(err){}
  if(u.durum==="onayli"){
    if(u.rol==="ogrenci"){ await ogrenciVerileriYukle(u.uid); await sinifIcerikYukle(u.ogretmen); }
    else if(u.rol==="veli"){ await veliVerileriYukle(); }
    else {
      SX.pekran="panel"; SX.ptab="sinavlar";
      if(u.yonetici) await hesaplariYukle();
      await sinavlariYukle(); await ogrencileriYukle(); await sinifIcerikYukle(u.uid);
    }
  }
  if(geri && geri!=="#/profil"){ location.hash=geri; toast("Hoş geldin, "+(u.ad||"").split(" ")[0]+"."); return; }
  ciz();
}
async function ogrenciVerileriYukle(uid){
  const [s,o,c,y]=await Promise.all([API.ogrenciSonuclari(uid),API.odevler(uid),API.sertifikalar(uid),API.yoklamalar(uid)]);
  SX.ogrSonuc=s; SX.ogrOdev=o; SX.ogrSertifika=c; SX.ogrYoklama=y;
  if(SX.user && SX.user.uid===uid) SX.bildirim=await API.bildirimler(uid);
}
async function veliVerileriYukle(){
  if(!SX.user || !SX.user.cocuk) return;
  await ogrenciVerileriYukle(SX.user.cocuk);
  SX.bildirim=await API.bildirimler(SX.user.cocuk);
  try{ const c=await API.ogrenciAl(SX.user.cocuk); if(c&&c.ogretmen) await sinifIcerikYukle(c.ogretmen); }catch(e){}
}
async function yoklamaGunuYukle(){
  const tarih=SX.yoklamaTarih||bugun();
  SX.yoklamaSecim={};
  for(const o of (SX.ogrenciler||[])){
    try{
      const hepsi=await API.yoklamalar(o.uid);
      const g=hepsi.find(x=>x.tarih===tarih);
      if(g) SX.yoklamaSecim[o.uid]=g.durum;
    }catch(e){}
  }
}
async function sinifIcerikYukle(ogretmenUid){
  if(!ogretmenUid) return;
  SX.duyurular=await API.duyurular(ogretmenUid);
  SX.program=await API.programAl(ogretmenUid);
}
async function ogrencileriYukle(){
  if(!SX.user||SX.user.rol==="ogrenci") return;
  try{
    SX.ogrenciler=(await API.ogrenciler(SX.user.uid)).sort((a,b)=>(b.sonGiris||0)-(a.sonGiris||0));
    SX.ogrOzet={};
    for(const o of SX.ogrenciler){
      const s=await API.ogrenciSonuclari(o.uid);
      SX.ogrOzet[o.uid]={sinav:s.length, ort:s.length?Math.round(s.reduce((a,r)=>a+r.dogru/r.toplam*100,0)/s.length):0};
    }
  }catch(err){ SX.ogrenciler=[]; }
}
async function hesaplariYukle(){ SX.hesaplar=(await API.hesaplar()).sort((a,b)=>(b.at||0)-(a.at||0)); }
async function sinavlariYukle(){ if(!SX.user) return;
  SX.sinavlar=(await API.sinavlar(SX.user.uid)).sort((a,b)=>(b.at||0)-(a.at||0)); }
async function sinavKaydet(){
  const d=SX.taslak;
  if(!d.ad.trim()){ toast("Sınav adı gerekli."); return; }
  const qs=taslakSorular();
  if(!qs.length){ toast("En az bir soru gerekli."); return; }
  if(!d.kod) d.kod=yeniKod();
  const x={kod:d.kod,ad:d.ad.trim(),qs,limit:d.limit,eksiSag:d.eksiSag,karistir:d.karistir,
    kip:d.kip||"liste", hiz:d.hiz||900, havuz:+d.havuz||0, tekDeneme:!!d.tekDeneme,
    geriBildirim:d.geriBildirim,gosterYanlis:d.gosterYanlis,ses:d.ses,acik:d.acik!==false,
    sahip:SX.user.uid,sahipAd:SX.user.ad,at:Date.now()};
  try{ await API.sinavYaz(x) }catch(e){ toast("Kaydedilemedi, bağlantını kontrol et."); return; }
  await sinavlariYukle(); SX.pekran="yayin"; ciz();
}
async function sonuclariYukle(){
  const kod=SX.resCode, x=SX.sinavlar.find(s=>s.kod===kod);
  if($("sxSonucBaslik")) $("sxSonucBaslik").textContent=(x?x.ad:"Sonuçlar")+" · "+kod;
  SX.sonuclar=(await API.sonuclar(kod)).sort((a,b)=> b.dogru-a.dogru || a.sure-b.sure);
  sonucBoya();
}
function csvIndir(){
  const s=[["ad","dogru","toplam","isabet%","sure","tarih"]].concat(
    SX.sonuclar.map(r=>[r.ad,r.dogru,r.toplam,Math.round(r.dogru/r.toplam*100),sure(r.sure),new Date(r.at).toLocaleString("tr-TR")]));
  const csv="\ufeff"+s.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(";")).join("\n");
  const a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
  a.download=(SX.resCode||"sonuclar")+".csv"; a.click();
}
function kopyala(m,btn){
  const t=document.createElement("textarea"); t.value=m; document.body.appendChild(t);
  t.select(); try{document.execCommand("copy")}catch(e){}
  if(navigator.clipboard) navigator.clipboard.writeText(m).catch(()=>{});
  t.remove(); const o=btn.textContent; btn.textContent="Kopyalandı"; setTimeout(()=>btn.textContent=o,1400);
}
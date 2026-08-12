/* Çözüm motoru, olaylar, sınav ve hesap işlemleri. */

/* --- çözüm motoru --- */
function sinavListesi(){
  const l=SX.exam.qs.slice();
  if(SX.exam.karistir) for(let i=l.length-1;i>0;i--){const j=rnd(0,i);[l[i],l[j]]=[l[j],l[i]]}
  return l;
}
function cozBasla(liste){
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
  r.innerHTML=h;
}
function soruBoya(){
  SX.kilit=false;
  const q=SX.qs[SX.i], sag=SX.exam.eksiSag;
  $("sxIlerleme").textContent=(SX.i+1)+" / "+SX.qs.length;
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
    $("sxHukum").textContent=dogru?"Doğru":`Yanlış — doğrusu ${q.c}`;
    $("sxHukum").className="sx-verdict "+(dogru?"ok":"no");
    bip(dogru?880:165,dogru?.09:.16,dogru?"triangle":"square");
    if(!dogru){ kutu.classList.remove("shake"); void kutu.offsetWidth; kutu.classList.add("shake"); }
  } else { $("sxHukum").textContent="Cevap alındı"; bip(660,.07,"triangle"); }
  railBoya();
  const bekle=SX.exam.geriBildirim===false?260:(dogru?520:1150);
  setTimeout(()=>{ if(SX.sureBitti) return;
    if(SX.i>=SX.qs.length-1) bitir(); else { SX.i++; soruBoya(); } },bekle);
}
async function bitir(){
  clearInterval(SX.tick);
  if(SX.ekran==="sonuc") return;
  SX._sure=(SX.bitis&&SX.sureBitti)?SX.exam.limit*1000:Date.now()-SX.t0;
  SX._cevap=SX.answers.filter(a=>a!==null).length;
  SX._dogru=SX.answers.filter((a,i)=>a!==null&&a===SX.qs[i].c).length;
  SX._yanlis=SX.qs.filter((q,i)=>SX.answers[i]!==q.c);
  SX._kaydedildi=false;
  if(!SX.alistirma&&SX.exam.kod){
    try{
      await API.sonucYaz(SX.exam.kod,{ ad:SX.ogrenci, dogru:SX._dogru, toplam:SX.qs.length,
        cevaplanan:SX._cevap, sure:SX._sure, at:Date.now(), sureBitti:SX.sureBitti, sahip:SX.exam.sahip||"",
        dokum:SX.qs.map((q,i)=>({q:q.t.map(v=>sayiYaz(v,SX.exam.eksiSag)).join(" "),a:SX.answers[i],c:q.c})) });
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
        geriBildirim:d.geriBildirim,gosterYanlis:true,ses:d.ses};
      SX.alistirma=true; SX.ogrenci=""; cozBasla(sinavListesi());
    },
    kodGir:kodGir, basla:isimOnayla, kontrol:cevapla, bitir:()=>bitir(),
    tekrar:()=>{ SX.sureBitti=false; cozBasla(sinavListesi()); },
    yanlislar:()=>{ if(SX._yanlis&&SX._yanlis.length){ SX.sureBitti=false; cozBasla(SX._yanlis.slice()); } },
    ptab2:()=>{ SX.pekran=v; ciz(); },
    ptab:()=>{ SX.ptab=v; ciz(); },
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
        gosterYanlis:x.gosterYanlis!==false,ses:x.ses!==false,acik:x.acik!==false,kod:x.kod};
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
    csv:csvIndir, panel:()=>{ SX.pekran="panel"; ciz(); },
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
  SX.exam=x; SX.alistirma=false; SX.ekran="isim"; ciz();
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
  catch(e){ mesgul(b,false); n.innerHTML=`<span class="sx-warn">${/HATALI/.test(e.message)?"E-posta veya şifre hatalı.":"Bağlantı kurulamadı, internetini kontrol et."}</span>`; }
}
async function kayitOl(){
  const n=$("sxAuthNot"), ad=($("sxAd")?$("sxAd").value:"").trim();
  const mail=($("sxMail").value||"").trim(), sifre=$("sxSifre").value||"";
  if(!ad){ n.innerHTML=`<span class="sx-warn">Adını yaz.</span>`; return; }
  if(!mailMi(mail)){ n.innerHTML=`<span class="sx-warn">Geçerli bir e-posta yaz.</span>`; return; }
  if(sifre.length<6){ n.innerHTML=`<span class="sx-warn">Şifre en az 6 karakter olmalı.</span>`; return; }
  const b=document.querySelector('[data-sx="kayitOl"]'); mesgul(b,true); n.textContent="Hesap oluşturuluyor…";
  try{
    const u=await API.kayit(mail,sifre,ad);
    if(u.durum==="onayli") await girisSonrasi(u);
    else { SX.user=u; toast("Kaydın alındı. Yönetici onayı bekleniyor."); ciz(); }
  }catch(e){ mesgul(b,false); n.innerHTML=`<span class="sx-warn">${/MAIL_VAR/.test(e.message)?"Bu e-posta zaten kayıtlı. Giriş yap sekmesini dene.":"Bağlantı kurulamadı, internetini kontrol et."}</span>`; }
}
async function girisSonrasi(u){
  SX.user=u; SX.pekran="panel"; SX.ptab="sinavlar"; Oturum.yaz(u);
  if(u.durum==="onayli"){ if(u.yonetici) await hesaplariYukle(); await sinavlariYukle(); }
  ciz();
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

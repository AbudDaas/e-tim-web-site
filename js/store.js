/* Veri katmanı: yerel depo, Firebase Auth ve Firestore REST çağrıları. */

/* --- depo --- */
const KV={ mod:"local",
  init(){ this.mod=(typeof window.storage!=="undefined"&&window.storage)?"shared":"local"; },
  async get(k){try{ if(this.mod==="shared"){const r=await window.storage.get(k,true);return r?JSON.parse(r.value):null}
    const v=Yerel.get(k);return v?JSON.parse(v):null }catch(e){return null}},
  async set(k,v){ if(this.mod==="shared") await window.storage.set(k,JSON.stringify(v),true); else Yerel.set(k,JSON.stringify(v)); },
  async del(k){try{ if(this.mod==="shared") await window.storage.delete(k,true); else Yerel.del(k) }catch(e){}},
  async list(p){try{ if(this.mod==="shared"){const r=await window.storage.list(p,true);return r?r.keys:[]}
    return Object.keys(localStorage).filter(k=>k.startsWith(p)) }catch(e){return []}}
};
const FB={ token:null, uid:null, yenile:null, jetonAt:0,

 /* Firebase kimlik jetonu bir saat geçerlidir. Süresi dolmadan
    yenileme jetonuyla sessizce tazelenir; kullanıcı dışarı atılmaz. */
 async jetonTazele(){
   if(!this.yenile) return false;
   try{
     const r=await fetch("https://securetoken.googleapis.com/v1/token?key="+FIREBASE.apiKey,{
       method:"POST", headers:{"Content-Type":"application/x-www-form-urlencoded"},
       body:"grant_type=refresh_token&refresh_token="+encodeURIComponent(this.yenile)
     });
     const j=await r.json();
     if(!r.ok || !j.id_token) return false;
     this.token=j.id_token;
     this.yenile=j.refresh_token||this.yenile;
     this.uid=j.user_id||this.uid;
     this.jetonAt=Date.now();
     if(typeof Oturum!=="undefined") Oturum.tazele();
     return true;
   }catch(e){ return false; }
 },
 jetonEskiMi(){ return this.jetonAt && (Date.now()-this.jetonAt > 50*60*1000); },

  idUrl(m){return `https://identitytoolkit.googleapis.com/v1/accounts:${m}?key=${FIREBASE.apiKey}`},
  docUrl(p){return `https://firestore.googleapis.com/v1/projects/${FIREBASE.projectId}/databases/(default)/documents/${p}`},
  hdr(){const h={"Content-Type":"application/json"};if(this.token)h.Authorization="Bearer "+this.token;return h},
  async id(m,body){const r=await fetch(this.idUrl(m),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
    const j=await r.json(); if(!r.ok) throw new Error((j.error&&j.error.message)||"AUTH"); return j},
  enc(o){const f={};for(const k in o){const v=o[k];
    f[k]= v===null||v===undefined?{nullValue:null}
      :typeof v==="number"?{doubleValue:v}
      :typeof v==="boolean"?{booleanValue:v}
      :typeof v==="object"?{stringValue:JSON.stringify(v)}:{stringValue:String(v)};}
    return {fields:f}},
  dec(d){const o={};for(const k in (d.fields||{})){const v=d.fields[k];
    if("doubleValue" in v)o[k]=Number(v.doubleValue);
    else if("integerValue" in v)o[k]=Number(v.integerValue);
    else if("booleanValue" in v)o[k]=v.booleanValue;
    else if("nullValue" in v)o[k]=null;
    else {const s=v.stringValue;try{o[k]=(s[0]==="["||s[0]==="{")?JSON.parse(s):s}catch(e){o[k]=s}}}
    o._id=d.name.split("/").pop();return o},
  /* Her istekten önce jeton eskiyse tazelenir; 401/403 gelirse
     bir kez daha tazeleyip tek sefer yeniden denenir. */
  async istek(url, ayar){
    if(this.jetonEskiMi()) await this.jetonTazele();
    let r=await fetch(url, Object.assign({}, ayar, {headers:this.hdr()}));
    if(r.status===401 || r.status===403){
      if(await this.jetonTazele()) r=await fetch(url, Object.assign({}, ayar, {headers:this.hdr()}));
    }
    return r;
  },
  async get(p){
    const r=await this.istek(this.docUrl(p));
    if(r.status===404) return null;
    if(!r.ok) throw new Error("GET "+r.status);
    return this.dec(await r.json());
  },
  async set(p,o){
    const r=await this.istek(this.docUrl(p),{method:"PATCH",body:JSON.stringify(this.enc(o))});
    if(!r.ok) throw new Error("SET "+r.status);
    return true;
  },
  async del(p){ await this.istek(this.docUrl(p),{method:"DELETE"}); },
  async list(c){
    const r=await this.istek(this.docUrl(c)+"?pageSize=300");
    if(!r.ok) return [];
    const j=await r.json();
    return (j.documents||[]).map(d=>this.dec(d));
  }
};
const bulut=()=>!!(FIREBASE.projectId&&FIREBASE.apiKey);
function mesgul(btn,on){ if(!btn)return; btn.dataset.busy=on?"1":"0"; if(!on) btn.removeAttribute("data-busy"); }
const Oturum={
  yaz(u){ Yerel.set("zx:oturum",JSON.stringify({
    uid:u.uid, mail:u.mail, token:FB.token, yenile:FB.yenile, at:Date.now()
  })); },
  oku(){ try{ return JSON.parse(Yerel.get("zx:oturum")||"null") }catch(e){ return null } },
  sil(){ Yerel.del("zx:oturum"); },
  /* jeton tazelendiğinde kaydı güncelle */
  tazele(){ const o=this.oku(); if(!o) return;
    o.token=FB.token; o.yenile=FB.yenile; o.at=Date.now();
    Yerel.set("zx:oturum",JSON.stringify(o)); }
};
/* ADMIN_EMAIL adresiyle giren hesap her durumda yönetici olur —
   yanlış rolle kayıt olunsa ya da onay beklemede kalsa bile. */
async function yoneticiKontrol(u){
  if(!u || !ADMIN_EMAIL) return u;
  if(String(u.mail||"").trim().toLowerCase() !== String(ADMIN_EMAIL).trim().toLowerCase()) return u;
  if(u.yonetici && u.durum==="onayli" && u.rol!=="ogrenci") return u;
  u.yonetici=true; u.durum="onayli"; u.rol="ogretmen";
  if(!u.sinifKodu) u.sinifKodu=yeniKod();
  try{
    await API.hesapYaz(u);
    if(u.sinifKodu) await API.sinifYaz(u.sinifKodu,u.uid,u.ad);
  }catch(e){}
  return u;
}

/* Öğretmenin sınıf kodu ile classes kaydını her girişte eşitler.
   Kayıt elle silinse ya da hiç oluşmasa bile kod çalışmaya devam eder. */
async function sinifGarantile(u){
  if(u && u.rol==="ogrenci"){ try{ await API.veliKoduGarantile(u) }catch(e){} return u; }
  if(!u || u.rol==="veli") return u;
  if(!u.sinifKodu){ u.sinifKodu=yeniKod(); try{ await API.hesapYaz(u) }catch(e){} }
  try{
    const mevcut=await API.sinifAl(u.sinifKodu);
    if(!mevcut || mevcut.ogretmen!==u.uid) await API.sinifYaz(u.sinifKodu,u.uid,u.ad);
  }catch(e){}
  return u;
}

const API={
 async kayit(mail,sifre,ad,rol,ogretmenKodu){
   mail=mail.trim().toLowerCase(); rol=rol||"ogretmen";
   ogretmenKodu=(ogretmenKodu||"").trim().toUpperCase();
   let yonetici=!!(ADMIN_EMAIL && mail===ADMIN_EMAIL.trim().toLowerCase());
   if(!ADMIN_EMAIL && rol==="ogretmen"){ try{ yonetici=(await this.hesaplar()).length===0 }catch(e){} }

   const k={ mail, ad:ad.trim(), rol,
     durum:(rol==="ogrenci"||rol==="veli"||yonetici)?"onayli":"bekliyor",
     yonetici, at:Date.now(), sonGiris:Date.now() };
   if(rol==="ogretmen") k.sinifKodu=yeniKod();

   if(bulut()){
     /* Önce hesabı aç: kod sorgusu kimlik gerektirir, jeton olmadan reddedilir. */
     let j;
     try{ j=await FB.id("signUp",{email:mail,password:sifre,returnSecureToken:true}); }
     catch(e){
       const m=String(e.message||"");
       if(/EMAIL_EXISTS/.test(m)) throw new Error("MAIL_VAR");
       if(/OPERATION_NOT_ALLOWED/.test(m)) throw new Error("KAPALI");
       if(/WEAK_PASSWORD/.test(m)) throw new Error("ZAYIF");
       if(/INVALID_EMAIL/.test(m)) throw new Error("GECERSIZ_MAIL");
       if(/TOO_MANY|QUOTA/.test(m)) throw new Error("COK_DENEME");
       if(/blocked|referer|API key|PERMISSION/i.test(m)) throw new Error("ANAHTAR:"+m.slice(0,80));
       throw new Error("AG:"+m.slice(0,80));
     }
     FB.token=j.idToken; FB.yenile=j.refreshToken; FB.jetonAt=Date.now(); FB.uid=j.localId; k.uid=j.localId;

     /* Kod çözümlemesi hesap açıldıktan sonra; başarısız olursa kayıt iptal edilmez. */
     k.kodUyarisi = await this.koduBagla(k, rol, ogretmenKodu);

     try{ await FB.set("users/"+j.localId,k); }
     catch(e){ throw new Error("KURAL_YAZ"); }
     if(k.sinifKodu){ try{ await FB.set("classes/"+k.sinifKodu,{kod:k.sinifKodu,ogretmen:k.uid,ogretmenAd:k.ad}); }catch(e){} }
     return k;
   }

   /* yerel mod */
   if(await KV.get("sx:mail:"+mail)) throw new Error("MAIL_VAR");
   k.uid="u_"+(await sha(mail)).slice(0,12);
   k.ph=await sha(mail+"::"+sifre);
   k.kodUyarisi = await this.koduBagla(k, rol, ogretmenKodu);
   await KV.set("sx:user:"+k.uid,k); await KV.set("sx:mail:"+mail,k.uid);
   if(k.sinifKodu) await KV.set("sx:sinif:"+k.sinifKodu,{kod:k.sinifKodu,ogretmen:k.uid,ogretmenAd:k.ad});
   return k;
 },

 /* Öğrenci → öğretmen, veli → çocuk bağını kurar.
    Kod yanlışsa ya da okunamazsa hesap yine açılır; uyarı döner. */
 async koduBagla(k, rol, kod){
   if(!kod) return null;
   if(rol==="ogrenci"){
     let sinif=null;
     try{ sinif=await this.sinifAl(kod); }catch(e){ return "OKUNAMADI"; }
     if(!sinif) return "SINIF_YOK";
     k.ogretmen=sinif.ogretmen; k.ogretmenAd=sinif.ogretmenAd;
     return null;
   }
   if(rol==="veli"){
     let bag=null;
     try{ bag=await this.veliBagAl(kod); }catch(e){ return "OKUNAMADI"; }
     if(!bag) return "VELI_KOD_YOK";
     k.cocuk=bag.ogrenci; k.cocukAd=bag.ogrenciAd;
     return null;
   }
   return null;
 },

 async giris(mail,sifre){
   mail=mail.trim().toLowerCase();
   if(bulut()){
     let j;
     try{ j=await FB.id("signInWithPassword",{email:mail,password:sifre,returnSecureToken:true}) }
     catch(e){
       const m=String(e.message||"");
       if(/EMAIL_NOT_FOUND|INVALID_PASSWORD|INVALID_LOGIN_CREDENTIALS/.test(m)) throw new Error("HATALI");
       if(/TOO_MANY_ATTEMPTS/.test(m)) throw new Error("COK_DENEME");
       throw new Error("AG:"+m.slice(0,60));
     }
     FB.token=j.idToken; FB.yenile=j.refreshToken; FB.jetonAt=Date.now(); FB.uid=j.localId;
     let u=null;
     try{ u=await FB.get("users/"+j.localId); }
     catch(e){ throw new Error("KURAL:"+String(e.message||"").slice(0,40)); }
     if(!u){ u={uid:j.localId,mail,ad:mail.split("@")[0],rol:"ogretmen",durum:"bekliyor",yonetici:false,at:Date.now()}; await FB.set("users/"+j.localId,u); }
     return await sinifGarantile(await yoneticiKontrol(u));
   }
   const id=await KV.get("sx:mail:"+mail); if(!id) throw new Error("HATALI");
   const u=await KV.get("sx:user:"+id);
   if(!u||u.ph!==await sha(mail+"::"+sifre)) throw new Error("HATALI");
   return await sinifGarantile(await yoneticiKontrol(u));
 },
 async sifreSifirla(mail){
   if(!bulut()) throw new Error("YEREL");
   await FB.id("sendOobCode",{requestType:"PASSWORD_RESET",email:mail.trim().toLowerCase()});
 },
 async oturumTazele(){
   const o=Oturum.oku(); if(!o) return null;
   if(bulut()){
     FB.token=o.token; FB.yenile=o.yenile||null; FB.uid=o.uid; FB.jetonAt=o.at||0;
     /* jeton eskiyse at ma — yenile */
     if(!o.token || FB.jetonEskiMi()){
       const ok=await FB.jetonTazele();
       if(!ok){ Oturum.sil(); return null; }
     }
     /* not: jeton tazelendiyse FB.token güncel kalmalı, eskisini geri yazma */
     try{
       const u=await FB.get("users/"+o.uid);
       if(!u){ Oturum.sil(); return null; }
       const son=await sinifGarantile(await yoneticiKontrol(u));
       Oturum.yaz(son);          /* tazelenen jetonu kaydet */
       return son;
     }catch(e){
       console.warn("oturum tazelenemedi:", e && e.message);
       /* ağ hatasında oturumu silme; kullanıcı çevrimdışı olabilir */
       if(String(e&&e.message||"").indexOf("401")<0 && String(e&&e.message||"").indexOf("403")<0) return null;
       Oturum.sil(); return null;
     }
   }
   return await sinifGarantile(await yoneticiKontrol(await KV.get("sx:user:"+o.uid)));
 },
 async anonim(){ if(bulut()&&!FB.token){try{const j=await FB.id("signUp",{returnSecureToken:true});FB.token=j.idToken; FB.yenile=j.refreshToken||FB.yenile; FB.jetonAt=Date.now();FB.uid=j.localId}catch(e){}} },
 async hesaplar(){ if(bulut()) return await FB.list("users");
   const ks=await KV.list("sx:user:");const o=[];for(const k of ks){const u=await KV.get(k);if(u)o.push(u)}return o },
 async hesapYaz(u){ bulut()? await FB.set("users/"+u.uid,u) : await KV.set("sx:user:"+u.uid,u) },
 async hesapSil(u){ if(bulut()) await FB.del("users/"+u.uid);
   else { await KV.del("sx:user:"+u.uid); await KV.del("sx:mail:"+u.mail) } },
 async sinavYaz(e){ bulut()? await FB.set("exams/"+e.kod,e) : await KV.set("sx:exam:"+e.kod,e) },
 async sinavAl(kod){ return bulut()? await FB.get("exams/"+kod) : await KV.get("sx:exam:"+kod) },
 async sinavlar(uid){ if(bulut()) return (await FB.list("exams")).filter(e=>e.sahip===uid);
   const ks=await KV.list("sx:exam:");const o=[];for(const k of ks){const e=await KV.get(k);if(e&&e.sahip===uid)o.push(e)}return o },
 async sinavSil(kod){ if(bulut()){ for(const r of await FB.list("exams/"+kod+"/results")) await FB.del("exams/"+kod+"/results/"+r._id); await FB.del("exams/"+kod); }
   else { for(const k of await KV.list("sx:res:"+kod+":")) await KV.del(k); await KV.del("sx:exam:"+kod) } },
 async sonucYaz(kod,r){ const id=yeniId();
   bulut()? await FB.set("exams/"+kod+"/results/"+id,r) : await KV.set("sx:res:"+kod+":"+id,r) },
 async sonuclar(kod){ if(bulut()) return (await FB.list("exams/"+kod+"/results")).map(r=>Object.assign(r,{_k:"exams/"+kod+"/results/"+r._id}));
   const ks=await KV.list("sx:res:"+kod+":");const o=[];for(const k of ks){const r=await KV.get(k);if(r)o.push(Object.assign({_k:k},r))}return o },
 async sonucSil(k){ bulut()? await FB.del(k) : await KV.del(k) }
 ,
 /* --- sınıf kodu --- */
 /* --- site içeriği (yönetim paneli) --- */
 async icerikAl(){ try{ return bulut()? await FB.get("site/icerik") : await KV.get("sx:icerik") }catch(e){ return null } },
 async icerikYaz(o){ if(bulut()) await FB.set("site/icerik",o); else await KV.set("sx:icerik",o); },
 async icerikSil(){ try{ bulut()? await FB.del("site/icerik") : await KV.del("sx:icerik") }catch(e){} },

 async sinifYaz(k,uid,ad){ const d={kod:k,ogretmen:uid,ogretmenAd:ad};
   bulut()? await FB.set("classes/"+k,d) : await KV.set("sx:sinif:"+k,d) },
 async sinifAl(k){ try{ return bulut()? await FB.get("classes/"+k) : await KV.get("sx:sinif:"+k) }catch(e){ return null } },

 /* --- öğrenciler --- */
 async ogrenciler(ogretmenUid){
   const hepsi=await this.hesaplar();
   return hepsi.filter(u=>u.rol==="ogrenci"&&u.ogretmen===ogretmenUid);
 },
 async rolDegis(u,rol){
   u.rol=rol;
   if(rol==="ogretmen"){ u.durum="onayli"; if(!u.sinifKodu){ u.sinifKodu=yeniKod(); await this.sinifYaz(u.sinifKodu,u.uid,u.ad); } }
   await this.hesapYaz(u); return u;
 },
 /* Yönetici yükseltmesini elle tetikler ve hatayı gizlemez. */
 async yoneticiZorla(u){
   if(!ADMIN_EMAIL) throw new Error("ADMIN_EMAIL boş — js/config.js dosyasına yaz.");
   const a=String(ADMIN_EMAIL).trim().toLowerCase(), m=String(u.mail||"").trim().toLowerCase();
   if(a!==m) throw new Error("Giriş yapılan adres ("+m+") ADMIN_EMAIL ("+a+") ile aynı değil.");
   u.yonetici=true; u.durum="onayli"; u.rol="ogretmen";
   if(!u.sinifKodu) u.sinifKodu=yeniKod();
   await this.hesapYaz(u);
   try{ await this.sinifYaz(u.sinifKodu,u.uid,u.ad); }catch(e){}
   return u;
 },
 /* --- veli bağlantı kodu --- */
 async veliBagYaz(kod,ogrenciUid,ogrenciAd){
   const d={kod,ogrenci:ogrenciUid,ogrenciAd};
   bulut()? await FB.set("parents/"+kod,d) : await KV.set("sx:veli:"+kod,d);
   return d;
 },
 async veliBagAl(kod){ try{ return bulut()? await FB.get("parents/"+kod) : await KV.get("sx:veli:"+kod) }catch(e){ return null } },
 async veliKoduGarantile(u){
   if(!u || u.rol!=="ogrenci") return u;
   if(!u.veliKodu){ u.veliKodu=yeniKod(); try{ await this.hesapYaz(u) }catch(e){} }
   try{
     const v=await this.veliBagAl(u.veliKodu);
     if(!v || v.ogrenci!==u.uid) await this.veliBagYaz(u.veliKodu,u.uid,u.ad);
   }catch(e){}
   return u;
 },

 /* --- sınıf duyuruları --- */
 async duyuruYaz(d){
   d.id=d.id||yeniId();
   bulut()? await FB.set("announcements/"+d.id,d) : await KV.set("sx:duyuru:"+d.id,d);
   return d;
 },
 async duyurular(ogretmenUid){
   try{
     if(bulut()) return (await FB.list("announcements")).filter(x=>!ogretmenUid||x.sahip===ogretmenUid);
     const ks=await KV.list("sx:duyuru:"); const o=[];
     for(const k of ks){ const x=await KV.get(k); if(x&&(!ogretmenUid||x.sahip===ogretmenUid)) o.push(x) }
     return o;
   }catch(e){ return []; }
 },
 async duyuruSil(id){ try{ bulut()? await FB.del("announcements/"+id) : await KV.del("sx:duyuru:"+id) }catch(e){} },

 /* --- ders programı --- */
 async programYaz(uid,satirlar){
   const d={sahip:uid,satirlar,at:Date.now()};
   bulut()? await FB.set("schedule/"+uid,d) : await KV.set("sx:program:"+uid,d);
 },
 async programAl(uid){
   try{ return bulut()? await FB.get("schedule/"+uid) : await KV.get("sx:program:"+uid) }catch(e){ return null }
 },

 /* --- müfredat ilerlemesi --- */
 async mufredatYaz(uid,durum){
   const d={durum,at:Date.now()};
   bulut()? await FB.set("students/"+uid+"/curriculum/durum",d) : await KV.set("sx:mufredat:"+uid,d);
 },
 async mufredatAl(uid){
   try{ const d= bulut()? await FB.get("students/"+uid+"/curriculum/durum") : await KV.get("sx:mufredat:"+uid);
     return d ? (d.durum||{}) : {}; }catch(e){ return {}; }
 },

 /* --- canlı yarışma --- */
 async canliYaz(oda){
   bulut()? await FB.set("live/"+oda.kod,oda) : await KV.set("sx:canli:"+oda.kod,oda);
 },
 async canliAl(kod){
   try{ return bulut()? await FB.get("live/"+kod) : await KV.get("sx:canli:"+kod); }catch(e){ return null; }
 },
 async canliOyuncuYaz(kod,o){
   bulut()? await FB.set("live/"+kod+"/players/"+o.id,o) : await KV.set("sx:canliO:"+kod+":"+o.id,o);
 },
 async canliOyuncular(kod){
   try{
     if(bulut()) return await FB.list("live/"+kod+"/players");
     const ks=await KV.list("sx:canliO:"+kod+":"); const o=[];
     for(const k of ks){ const x=await KV.get(k); if(x) o.push(x); } return o;
   }catch(e){ return []; }
 },

 /* --- aralıklı tekrar --- */
 async srsYaz(uid,durum){
   const d={durum,at:Date.now()};
   bulut()? await FB.set("students/"+uid+"/srs/durum",d) : await KV.set("sx:srs:"+uid,d);
 },
 async srsAl(uid){
   try{ const d= bulut()? await FB.get("students/"+uid+"/srs/durum") : await KV.get("sx:srs:"+uid);
     return d ? (d.durum||{}) : {}; }catch(e){ return {}; }
 },
 /* --- sertifika doğrulama --- */
 async sertifikaAl(uid,id){
   try{ return bulut()? await FB.get("students/"+uid+"/certs/"+id) : await KV.get("sx:sert:"+uid+":"+id); }
   catch(e){ return null; }
 },

 /* --- ezber takibi --- */
 async ezberYaz(uid,durum){
   const d={durum,at:Date.now()};
   bulut()? await FB.set("students/"+uid+"/hifz/durum",d) : await KV.set("sx:ezber:"+uid,d);
 },
 async ezberAl(uid){
   try{
     const d= bulut()? await FB.get("students/"+uid+"/hifz/durum") : await KV.get("sx:ezber:"+uid);
     return d ? (d.durum||{}) : {};
   }catch(e){ return {}; }
 },

 /* --- bildirimler --- */
 async bildirimYaz(uid,b){
   const id=yeniId(); const d=Object.assign({id,at:Date.now(),okundu:false},b);
   try{ bulut()? await FB.set("students/"+uid+"/notif/"+id,d) : await KV.set("sx:bildirim:"+uid+":"+id,d); }catch(e){}
 },
 async bildirimler(uid){
   try{
     if(bulut()) return await FB.list("students/"+uid+"/notif");
     const ks=await KV.list("sx:bildirim:"+uid+":"); const o=[];
     for(const k of ks){ const x=await KV.get(k); if(x) o.push(x) } return o;
   }catch(e){ return []; }
 },
 async bildirimOku(uid,b){
   b.okundu=true;
   try{ bulut()? await FB.set("students/"+uid+"/notif/"+b.id,b) : await KV.set("sx:bildirim:"+uid+":"+b.id,b); }catch(e){}
 },

 /* --- yoklama --- */
 async yoklamaYaz(uid,tarih,kayit){
   const d=Object.assign({tarih},kayit);
   bulut()? await FB.set("students/"+uid+"/attendance/"+tarih,d) : await KV.set("sx:yok:"+uid+":"+tarih,d);
 },
 async yoklamalar(uid){
   if(bulut()) return await FB.list("students/"+uid+"/attendance");
   const ks=await KV.list("sx:yok:"+uid+":"); const o=[];
   for(const k of ks){ const x=await KV.get(k); if(x) o.push(x) } return o;
 },

 async ogrenciAl(uid){ return bulut()? await FB.get("users/"+uid) : await KV.get("sx:user:"+uid) },
 async girisIzi(u){ u.sonGiris=Date.now(); try{ await this.hesapYaz(u) }catch(e){} },

 /* --- ödevler --- */
 async odevYaz(uid,o){ o.id=o.id||yeniId();
   bulut()? await FB.set("students/"+uid+"/tasks/"+o.id,o) : await KV.set("sx:odev:"+uid+":"+o.id,o); return o },
 async odevler(uid){
   if(bulut()) return await FB.list("students/"+uid+"/tasks");
   const ks=await KV.list("sx:odev:"+uid+":"); const o=[];
   for(const k of ks){ const x=await KV.get(k); if(x) o.push(x) } return o;
 },
 async odevSil(uid,id){ bulut()? await FB.del("students/"+uid+"/tasks/"+id) : await KV.del("sx:odev:"+uid+":"+id) },

 /* --- sertifikalar --- */
 async sertifikaYaz(uid,s){ s.id=s.id||yeniId();
   bulut()? await FB.set("students/"+uid+"/certs/"+s.id,s) : await KV.set("sx:sert:"+uid+":"+s.id,s); return s },
 async sertifikalar(uid){
   if(bulut()) return await FB.list("students/"+uid+"/certs");
   const ks=await KV.list("sx:sert:"+uid+":"); const o=[];
   for(const k of ks){ const x=await KV.get(k); if(x) o.push(x) } return o;
 },
 async sertifikaSil(uid,id){ bulut()? await FB.del("students/"+uid+"/certs/"+id) : await KV.del("sx:sert:"+uid+":"+id) },

 /* --- öğrencinin sınav geçmişi --- */
 async ogrenciSonucYaz(uid,r){ const id=yeniId(); r.id=id;
   bulut()? await FB.set("students/"+uid+"/results/"+id,r) : await KV.set("sx:ogrsonuc:"+uid+":"+id,r) },
 async ogrenciSonuclari(uid){
   if(bulut()) return await FB.list("students/"+uid+"/results");
   const ks=await KV.list("sx:ogrsonuc:"+uid+":"); const o=[];
   for(const k of ks){ const x=await KV.get(k); if(x) o.push(x) } return o;
 }
};
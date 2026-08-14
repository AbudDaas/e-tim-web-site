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
const FB={ token:null, uid:null,
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
  async get(p){const r=await fetch(this.docUrl(p),{headers:this.hdr()});if(r.status===404)return null;
    if(!r.ok)throw new Error("GET");return this.dec(await r.json())},
  async set(p,o){const r=await fetch(this.docUrl(p),{method:"PATCH",headers:this.hdr(),body:JSON.stringify(this.enc(o))});
    if(!r.ok)throw new Error("SET");return true},
  async del(p){await fetch(this.docUrl(p),{method:"DELETE",headers:this.hdr()})},
  async list(c){const r=await fetch(this.docUrl(c)+"?pageSize=300",{headers:this.hdr()});
    if(!r.ok)return [];const j=await r.json();return (j.documents||[]).map(d=>this.dec(d))}
};
const bulut=()=>!!(FIREBASE.projectId&&FIREBASE.apiKey);
function mesgul(btn,on){ if(!btn)return; btn.dataset.busy=on?"1":"0"; if(!on) btn.removeAttribute("data-busy"); }
const Oturum={
  yaz(u){ Yerel.set("zx:oturum",JSON.stringify({uid:u.uid,mail:u.mail,token:FB.token,at:Date.now()})); },
  oku(){ try{ return JSON.parse(Yerel.get("zx:oturum")||"null") }catch(e){ return null } },
  sil(){ Yerel.del("zx:oturum"); }
};
/* ADMIN_EMAIL adresiyle giren hesap her durumda yönetici olur —
   yanlış rolle kayıt olunsa ya da onay beklemede kalsa bile. */
async function yoneticiKontrol(u){
  if(!u || !ADMIN_EMAIL) return u;
  if((u.mail||"").toLowerCase() !== ADMIN_EMAIL.trim().toLowerCase()) return u;
  if(u.yonetici && u.durum==="onayli" && u.rol!=="ogrenci") return u;
  u.yonetici=true; u.durum="onayli"; u.rol="ogretmen";
  if(!u.sinifKodu) u.sinifKodu=yeniKod();
  try{
    await API.hesapYaz(u);
    if(u.sinifKodu) await API.sinifYaz(u.sinifKodu,u.uid,u.ad);
  }catch(e){}
  return u;
}

const API={
 async kayit(mail,sifre,ad,rol,ogretmenKodu){
   mail=mail.trim().toLowerCase(); rol=rol||"ogretmen";
   let yonetici=!!(ADMIN_EMAIL&&mail===ADMIN_EMAIL.trim().toLowerCase());
   if(!ADMIN_EMAIL&&rol==="ogretmen"){ try{ yonetici=(await this.hesaplar()).length===0 }catch(e){} }
   // öğrenci hesapları doğrudan açılır, öğretmen hesapları yönetici onayı bekler
   const k={ mail, ad:ad.trim(), rol,
     durum:(rol==="ogrenci"||yonetici)?"onayli":"bekliyor",
     yonetici, at:Date.now(), sonGiris:Date.now() };
   if(rol==="ogretmen") k.sinifKodu=yeniKod();
   if(rol==="ogrenci"&&ogretmenKodu){
     const sinif=await this.sinifAl(ogretmenKodu.trim().toUpperCase());
     if(!sinif) throw new Error("SINIF_YOK");
     k.ogretmen=sinif.ogretmen; k.ogretmenAd=sinif.ogretmenAd;
   }
   if(bulut()){
     let j; try{ j=await FB.id("signUp",{email:mail,password:sifre,returnSecureToken:true}) }
     catch(e){ throw new Error(/EMAIL_EXISTS/.test(e.message)?"MAIL_VAR":"AG") }
     FB.token=j.idToken; FB.uid=j.localId; k.uid=j.localId;
     await FB.set("users/"+j.localId,k);
     if(k.sinifKodu) await FB.set("classes/"+k.sinifKodu,{kod:k.sinifKodu,ogretmen:k.uid,ogretmenAd:k.ad});
     return k;
   }
   if(await KV.get("sx:mail:"+mail)) throw new Error("MAIL_VAR");
   k.uid="u_"+(await sha(mail)).slice(0,12);
   k.ph=await sha(mail+"::"+sifre);
   await KV.set("sx:user:"+k.uid,k); await KV.set("sx:mail:"+mail,k.uid);
   if(k.sinifKodu) await KV.set("sx:sinif:"+k.sinifKodu,{kod:k.sinifKodu,ogretmen:k.uid,ogretmenAd:k.ad});
   return k;
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
     FB.token=j.idToken; FB.uid=j.localId;
     let u=null;
     try{ u=await FB.get("users/"+j.localId); }
     catch(e){ throw new Error("KURAL:"+String(e.message||"").slice(0,40)); }
     if(!u){ u={uid:j.localId,mail,ad:mail.split("@")[0],rol:"ogretmen",durum:"bekliyor",yonetici:false,at:Date.now()}; await FB.set("users/"+j.localId,u); }
     return await yoneticiKontrol(u);
   }
   const id=await KV.get("sx:mail:"+mail); if(!id) throw new Error("HATALI");
   const u=await KV.get("sx:user:"+id);
   if(!u||u.ph!==await sha(mail+"::"+sifre)) throw new Error("HATALI");
   return await yoneticiKontrol(u);
 },
 async sifreSifirla(mail){
   if(!bulut()) throw new Error("YEREL");
   await FB.id("sendOobCode",{requestType:"PASSWORD_RESET",email:mail.trim().toLowerCase()});
 },
 async oturumTazele(){
   const o=Oturum.oku(); if(!o) return null;
   if(bulut()){
     if(!o.token||Date.now()-o.at>50*60*1000){ Oturum.sil(); return null; }
     FB.token=o.token; FB.uid=o.uid;
     try{ const u=await FB.get("users/"+o.uid); if(!u){Oturum.sil();return null} return await yoneticiKontrol(u) }
     catch(e){ Oturum.sil(); return null }
   }
   return await yoneticiKontrol(await KV.get("sx:user:"+o.uid));
 },
 async anonim(){ if(bulut()&&!FB.token){try{const j=await FB.id("signUp",{returnSecureToken:true});FB.token=j.idToken;FB.uid=j.localId}catch(e){}} },
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
 async sinifAl(k){ return bulut()? await FB.get("classes/"+k) : await KV.get("sx:sinif:"+k) },

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
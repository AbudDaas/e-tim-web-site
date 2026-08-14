/* Ortak yardımcılar: kısayollar, biçimlendirme, kod üretimi, bildirim. */

const $=i=>document.getElementById(i);
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let filtre=0;                                  /* seçili kesit kategorisi (sıra no) */
const SITE={ ders:null, kesitDers:null };      /* site tarafı seçimleri */

const SEVIYE=[{min:3,max:3,lo:1,hi:9,neg:0},{min:3,max:4,lo:1,hi:9,neg:.35},
 {min:4,max:5,lo:1,hi:59,neg:.4},{min:5,max:6,lo:1,hi:79,neg:.45},{min:6,max:8,lo:2,hi:99,neg:.45}];
const SEVIYE_AD=["Başlangıç","Kolay","Orta","İleri","Uzman"];
const SEVIYE_NOT=["3 sayı · toplama","3–4 sayı · çıkarma","4–5 sayı · karışık","5–6 sayı · hızlı","6–8 sayı · iki basamak"];

const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const sure=ms=>{const s=Math.max(0,Math.floor(ms/1000));return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")};
const sayiYaz=(v,sag)=>(v<0&&sag)?Math.abs(v)+"−":(v<0?"−"+Math.abs(v):""+v);
const yeniId=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const mailMi=e=>/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
function toast(m){const t=$("toast");t.textContent=m;t.classList.add("on");clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove("on"),2400);}
function yeniKod(){const A="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";let s="";for(let i=0;i<6;i++)s+=A[rnd(0,A.length-1)];return s;}
async function sha(s){try{const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s));
  return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,"0")).join("")}catch(e){
  let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return "x"+h.toString(16)}}
const Yerel={get(k){try{return localStorage.getItem(k)}catch(e){return null}},
  set(k,v){try{localStorage.setItem(k,v)}catch(e){}},del(k){try{localStorage.removeItem(k)}catch(e){}}};
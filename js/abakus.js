/* Sanal abaküs (soroban).
   Her çubukta bir üst boncuk (5) ve dört alt boncuk (1) vardır.
   Boncuğa dokunulduğunda çubuğun değeri değişir, toplam anında okunur. */

const ABK = {
  cubuk: 7,                 /* çubuk sayısı = basamak */
  durum: [],                /* her çubuk: {ust:0|1, alt:0..4} */
  kip: "serbest",           /* serbest | hedef */
  hedef: null,
  sonuc: null,
  goster: false             /* sınav ekranında açık mı */
};

function abkKur(n){
  ABK.cubuk = n || ABK.cubuk;
  ABK.durum = Array.from({length:ABK.cubuk}, ()=>({ust:0, alt:0}));
  ABK.sonuc = null;
}
function abkDeger(){
  return ABK.durum.reduce((t,c)=> t*10 + (c.ust*5 + c.alt), 0);
}
function abkYaz(sayi){
  const s=String(Math.max(0,Math.floor(sayi))).padStart(ABK.cubuk,"0").slice(-ABK.cubuk);
  ABK.durum=s.split("").map(x=>{ const v=+x; return {ust: v>=5?1:0, alt: v>=5? v-5 : v}; });
}
function abkDokun(i, tur, sira){
  const c=ABK.durum[i]; if(!c) return;
  if(tur==="ust") c.ust = c.ust ? 0 : 1;
  else c.alt = (c.alt === sira+1) ? sira : sira+1;   /* aynı boncuğa basınca geri çeker */
  ABK.sonuc=null;
}

/* --- çizim --- */
function abakusSvg(){
  const n=ABK.cubuk;
  const gen=52, yuk=250, bosluk=6;
  const G=n*gen, cerceve=10;
  const boncuk=(x,y,acik,tur,i,s)=>`
    <g class="abk-boncuk ${acik?"acik":""}" data-abk="${tur}" data-i="${i}" data-s="${s}">
      <ellipse cx="${x}" cy="${y}" rx="19" ry="11.5"/>
    </g>`;
  let cubuklar="";
  for(let i=0;i<n;i++){
    const x=i*gen+gen/2;
    const c=ABK.durum[i]||{ust:0,alt:0};
    cubuklar+=`<line class="abk-tel" x1="${x}" y1="20" x2="${x}" y2="${yuk-20}"/>`;
    /* üst boncuk: aşağı inince aktif */
    cubuklar+=boncuk(x, c.ust? 74 : 46, !!c.ust, "ust", i, 0);
    /* alt boncuklar: yukarı çıkanlar aktif */
    for(let s=0;s<4;s++){
      const aktif = c.alt > s;
      const y = aktif ? (118 + s*24) : (150 + s*24);
      cubuklar+=boncuk(x, y, aktif, "alt", i, s);
    }
    cubuklar+=`<text class="abk-basamak" x="${x}" y="${yuk-4}">${abkBasamakAd(n-i-1)}</text>`;
  }
  return `<svg viewBox="0 0 ${G} ${yuk}" class="abk-svg" role="img" aria-label="abaküs">
    <rect class="abk-cerceve" x="1" y="1" width="${G-2}" height="${yuk-24}" rx="12"/>
    ${cubuklar}
    <line class="abk-ayirac" x1="${cerceve}" y1="98" x2="${G-cerceve}" y2="98"/>
  </svg>`;
}
function abkBasamakAd(us){
  return us===0?"1":us===1?"10":us===2?"100":us===3?"B":us===4?"10B":us===5?"100B":"M";
}

function abakusKutusu(){
  const deger=abkDeger();
  const hedefli=ABK.kip==="hedef";
  return `<div class="abk-kutu">
    <div class="abk-ust">
      <div class="abk-deger" title="okunan değer">${deger.toLocaleString("tr-TR")}</div>
      <div class="abk-kip">
        <button class="chip" data-abkkip="serbest" aria-pressed="${!hedefli}">Serbest</button>
        <button class="chip" data-abkkip="hedef" aria-pressed="${hedefli}">Sayıyı kur</button>
      </div>
    </div>
    ${hedefli?`<div class="abk-hedef ${ABK.sonuc||""}">
      <span>Kurulacak sayı</span><b>${ABK.hedef!=null?ABK.hedef.toLocaleString("tr-TR"):"—"}</b>
      ${ABK.sonuc==="dogru"?`<span class="abk-mesaj ok">Doğru kurdun</span>`
        :ABK.sonuc==="yanlis"?`<span class="abk-mesaj no">Henüz olmadı</span>`:""}
    </div>`:""}
    ${abakusSvg()}
    <div class="abk-alt">
      <button class="btn ghost sm" data-abk-eylem="sifirla">Sıfırla</button>
      ${hedefli?`<button class="btn sm" data-abk-eylem="kontrol">Kontrol et</button>
                 <button class="btn ghost sm" data-abk-eylem="yeni">Yeni sayı</button>`:""}
      <span class="abk-cubuk-sec">
        ${[5,7,9,13].map(n=>`<button class="chip" data-abk-cubuk="${n}" aria-pressed="${ABK.cubuk===n}">${n}</button>`).join("")}
      </span>
    </div>
    <div class="sx-note">Üst boncuk 5, alttakiler 1 değerindedir. Boncuğa dokunarak çubuğun değerini değiştir; toplam yukarıda okunur.</div>
  </div>`;
}

/* --- ders sayfasındaki bölüm --- */
function bolumAbakus(id){
  if(!ABK.durum.length) abkKur(ABK.cubuk);
  return `<div class="card pad" style="margin-top:18px">
    <h3 style="margin-bottom:4px">Sanal abaküs</h3>
    <p class="muted" style="font-size:13.5px;margin-bottom:14px">
      Evde fiziksel abaküs yoksa buradan çalışılır. Öğretmen tahtada gösterirken de kullanılabilir.</p>
    ${abakusKutusu()}
  </div>`;
}

/* --- olaylar --- */
document.addEventListener("click", e=>{
  const b=e.target.closest("[data-abk]");
  if(b){ abkDokun(+b.dataset.i, b.dataset.abk, +b.dataset.s); abkYenile(); return; }

  const k=e.target.closest("[data-abkkip]");
  if(k){ ABK.kip=k.dataset.abkkip; ABK.sonuc=null;
    if(ABK.kip==="hedef" && ABK.hedef==null) abkYeniHedef();
    abkYenile(); return; }

  const c=e.target.closest("[data-abk-cubuk]");
  if(c){ abkKur(+c.dataset.abkCubuk); if(ABK.kip==="hedef") abkYeniHedef(); abkYenile(); return; }

  const y=e.target.closest("[data-abk-eylem]");
  if(y){
    const eylem=y.dataset.abkEylem;
    if(eylem==="sifirla"){ abkKur(ABK.cubuk); }
    if(eylem==="yeni"){ abkKur(ABK.cubuk); abkYeniHedef(); }
    if(eylem==="kontrol"){
      const d=abkDeger()===ABK.hedef;
      ABK.sonuc=d?"dogru":"yanlis";
      if(typeof bip==="function") bip(d?880:165, d?0.09:0.16, d?"triangle":"square");
      if(d) setTimeout(()=>{ abkKur(ABK.cubuk); abkYeniHedef(); abkYenile(); }, 1100);
    }
    abkYenile(); return;
  }
});
function abkYeniHedef(){
  const en=Math.min(ABK.cubuk,4);
  const ust=Math.pow(10,en)-1;
  ABK.hedef=Math.floor(Math.random()*ust)+1;
  ABK.sonuc=null;
}
/* yalnız abaküsü yeniden çizer, sayfayı baştan kurmaz */
function abkYenile(){
  document.querySelectorAll(".abk-kutu").forEach(k=>{
    k.outerHTML = (typeof cevirHtml==="function") ? cevirHtml(abakusKutusu()) : abakusKutusu();
  });
}
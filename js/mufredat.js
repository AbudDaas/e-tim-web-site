/* Müfredat ağacı.
   Her dersin üniteleri ve konuları; öğrenci tamamladıkça sonraki konu açılır.
   İçerik data.js'teki DATA.mufredat dizisinden gelir, ilerleme öğrencide saklanır. */

const MFR = { durum:{}, yuklendi:false };

function mufredatAgaci(ders){
  return (DATA.mufredat||[]).filter(x=>x.ders===ders);
}
function mfrKonuId(ders,ui,ki){ return ders+":"+ui+":"+ki; }
function mfrBitti(id){ return !!MFR.durum[id]; }

function bolumMufredat(id){
  const ag=mufredatAgaci(id);
  if(!ag.length) return `<div class="card pad muted" style="margin-top:18px">
    Bu derse müfredat girilmemiş. Yönetim → Müfredat bölümünden ünite ve konu ekleyebilirsin.</div>`;

  let toplam=0, biten=0, oncekiBitti=true;
  ag.forEach((u,ui)=>(u.konular||[]).forEach((k,ki)=>{
    toplam++; if(mfrBitti(mfrKonuId(id,ui,ki))) biten++;
  }));
  const yuzde=toplam?Math.round(biten/toplam*100):0;

  return `<div class="card pad" style="margin-top:18px">
    <h3 style="margin-bottom:4px">Müfredat</h3>
    <p class="muted" style="font-size:13.5px;margin-bottom:12px">Konuyu tamamladıkça bir sonraki açılır. İşaretleme öğrencinin kendi ilerlemesidir.</p>
    <div class="sx-stats" style="grid-template-columns:repeat(3,1fr)">
      <div class="sx-stat"><b>${ag.length}</b><span>ünite</span></div>
      <div class="sx-stat"><b>${biten}/${toplam}</b><span>konu</span></div>
      <div class="sx-stat"><b>${yuzde}%</b><span>tamamlandı</span></div>
    </div>
    <div class="sx-bar" style="height:8px;margin:2px 0 18px"><i style="width:${yuzde}%"></i></div>

    ${ag.map((u,ui)=>{
      const konular=(u.konular||[]).map((k,ki)=>{
        const kid=mfrKonuId(id,ui,ki);
        const bitti=mfrBitti(kid);
        const acik=bitti||oncekiBitti;
        const satir=`<button class="mfr-konu ${bitti?"bitti":acik?"acik":"kilit"}"
            ${acik&&girisliMi()?`data-mfr="${kid}"`:""} ${acik?"":"disabled"}>
            <span class="mfr-nokta"></span>
            <span class="mfr-ad">${esc(ceviri(k.ad||k))}</span>
            ${k.not?`<span class="mfr-not">${esc(ceviri(k.not))}</span>`:""}
            <span class="mfr-durum">${bitti?"tamam":acik?"sırada":"kilitli"}</span>
          </button>`;
        oncekiBitti=bitti;
        return satir;
      }).join("");
      return `<div class="mfr-unite">
        <div class="mfr-unite-ad"><span>${ui+1}</span>${esc(ceviri(u.ad))}</div>
        ${konular}</div>`;
    }).join("")}
    ${girisliMi()?"":`<div class="sx-note">İlerlemeni kaydetmek için giriş yap.</div>`}
    <div class="sx-note" id="mfrNot"></div>
  </div>`;
}

document.addEventListener("click", async e=>{
  const b=e.target.closest("[data-mfr]"); if(!b) return;
  const id=b.dataset.mfr;
  MFR.durum[id]=!MFR.durum[id];
  ciz();
  try{ await API.mufredatYaz(SX.user.uid, MFR.durum); }
  catch(err){ const n=$("mfrNot"); if(n) n.innerHTML=`<span class="sx-warn">Kaydedilemedi.</span>`; }
});

async function mufredatYukle(uid){
  if(!uid) return;
  try{ MFR.durum=(await API.mufredatAl(uid))||{}; MFR.yuklendi=true; }catch(e){ MFR.durum={}; }
}

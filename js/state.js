/* Uygulama durumu — sınav ve profil sekmelerinin canlı hâli. */

const SX={ ekran:"giris", pekran:"giris", ptab:"sinavlar",
  user:null, exam:null, ogrenci:"", taslak:null, sinavlar:[], hesaplar:[], sonuclar:[],
  resCode:null, acikSonuc:null, alistirma:false,
  kayitRol:"ogrenci", geriYol:null, yonTab:"genel", yonKirli:false, karne:false, ogrenciler:[], ogrOzet:{}, acikOgrenci:null,
  ogrSonuc:[], ogrOdev:[], ogrSertifika:[], ogrYoklama:[], bildirim:[], yoklamaSecim:{}, yoklamaTarih:null,
  qs:[],i:0,answers:[],times:[],t0:0,qt0:0,tick:null,kilit:false,sureBitti:false,bitis:0 };
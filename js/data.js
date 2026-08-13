/* İçerik — site metinleri, kesitler, podcast, yarışma, gurur tablosu. Sadece bu dosya düzenlenir. */

/* Çok dilli içerik: herhangi bir metni {tr:"…", en:"…", ar:"…"} biçiminde
   yazarsan seçilen dile göre gösterilir. Düz metin bırakırsan her dilde aynı kalır.
   ÖRNEK:  baslik:{tr:"Merhaba", en:"Hello", ar:"مرحبا"}                          */

const DATA = {
  marka:{ ad:"Zihin Akademi", alt:"zihinsel aritmetik", sinavLinki:"#/sinav" },

  kurslar:[
    {ad:"Seviye 1 — Abaküs tanışma", not:"Boncuk okuma, tek basamaklı toplama"},
    {ad:"Seviye 2 — İki basamak", not:"Beş ve on tamamlayanlar, çıkarma"},
    {ad:"Seviye 3 — Zihin abaküsü", not:"Fiziksel abaküsten hayalî abaküse geçiş"},
    {ad:"Seviye 4 — Hız ve dayanıklılık", not:"Uzun diziler, yarışma temposu"}
  ],

  ana:{
    etiket:"Gaziantep · 7–14 yaş",
    baslik:"Çocuklar sayıları <span class='grad'>görerek</span> düşünmeyi öğreniyor",
    metin:"Abaküsle başlayan, kâğıt kalem olmadan devam eden bir zihin eğitimi. Haftada iki canlı ders, her ay bir yarışma, sürekli takip.",
    istatistik:[
      {sayi:"180+", ad:"öğrenci"}, {sayi:"12", ad:"grup"},
      {sayi:"4 yıl", ad:"program"}, {sayi:"%92", ad:"devam oranı"}
    ],
    duyuru:"Eylül dönemi kayıtları açıldı. Deneme dersi için mesaj bırakın."
  },

  kesitler:{
    kategoriler:["Tümü","Toplama","Çıkarma","Teknik","Motivasyon"],
    liste:[
      {baslik:"Beş boncuğu tek harekette okumak", kategori:"Teknik", sure:"6:12", ders:"Seviye 2 · Ders 14", yt:"", ozet:"Elin abaküs üzerinde nasıl gezindiğini yavaşlatarak gösterdik."},
      {baslik:"İki basamaklı toplamada ritim", kategori:"Toplama", sure:"4:48", ders:"Seviye 3 · Ders 6", yt:"", ozet:"Sayıları tek tek değil, ikişerli gruplar hâlinde okumak."},
      {baslik:"Eksiye düşmeden çıkarma", kategori:"Çıkarma", sure:"7:30", ders:"Seviye 3 · Ders 9", yt:"", ozet:"Ara toplam sıfırın altına inmeden nasıl ilerlenir."},
      {baslik:"Zihinden 10 sayı: canlı deneme", kategori:"Teknik", sure:"9:05", ders:"Seviye 4 · Ders 2", yt:"", ozet:"Tahtadaki 10 sayıyı kimse kâğıt kullanmadan çözdü."},
      {baslik:"Yavaş öğrenen çocuğa nasıl davranmalı", kategori:"Motivasyon", sure:"5:20", ders:"Veli sohbeti", yt:"", ozet:"Hızlanmayan çocuğun aslında ne yaptığını anlatıyoruz."},
      {baslik:"Parmak alışkanlığını bırakma haftası", kategori:"Motivasyon", sure:"3:58", ders:"Seviye 1 · Ders 11", yt:"", ozet:"Hayalî abaküse geçerken yaşanan en sık takılma."}
    ]
  },

  podcast:{
    aciklama:"Velilerle ve öğretmenlerle konuşuyoruz. Arabada, mutfakta dinlenecek uzunlukta.",
    bolumler:[
      {no:12, baslik:"Sınav kaygısı mı, hazırlıksızlık mı?", sure:"22 dk", tarih:"5 Ağustos 2026", ozet:"Yarışma öncesi ağlayan çocuk aslında ne söylüyor.", mp3:""},
      {no:11, baslik:"Ekran süresi ve dikkat", sure:"18 dk", tarih:"22 Temmuz 2026", ozet:"Dikkat süresi kısaldı mı, yoksa beklentimiz mi büyüdü.", mp3:""},
      {no:10, baslik:"Abaküs zekâyı artırır mı?", sure:"25 dk", tarih:"8 Temmuz 2026", ozet:"Araştırmaların söylediği ve söylemediği şeyler.", mp3:""},
      {no:9, baslik:"Evde 10 dakikalık çalışma", sure:"15 dk", tarih:"24 Haziran 2026", ozet:"Uzun çalışma değil, aynı saatte çalışma işe yarıyor.", mp3:""}
    ]
  },

  yarismalar:{
    aktif:{
      ad:"Ağustos Hız Turnuvası",
      tarih:"2026-08-30T10:00:00",
      yer:"Şahinbey Kültür Merkezi · Gaziantep",
      metin:"Üç kategori: Seviye 1–2, Seviye 3–4, Açık grup. Her tur 5 dakika, 20 soru. İlk üçe madalya, tüm katılımcılara katılım belgesi.",
      kod:"", katilimci:"64 kayıt"
    },
    gecmis:[
      {tarih:"Haziran 2026", ad:"Yaz Kupası", not:"78 katılımcı · birinci: Elif Y."},
      {tarih:"Nisan 2026", ad:"Şehirler Arası Düello", not:"Gaziantep–Şanlıurfa · 40 kişilik takım"},
      {tarih:"Şubat 2026", ad:"Sömestr Maratonu", not:"3 gün · 12 tur"}
    ]
  },

  gurur:{
    donem:"Temmuz 2026",
    metin:"Ay boyunca yapılan denemelerin ortalamasına göre. Liste her ayın başında yenilenir.",
    ilkUc:[
      {ad:"Elif Yıldız", sinif:"Seviye 4", puan:"98 / 100"},
      {ad:"Yusuf Karaca", sinif:"Seviye 3", puan:"96 / 100"},
      {ad:"Meryem Aslan", sinif:"Seviye 4", puan:"95 / 100"}
    ],
    liste:[
      {ad:"Ahmet Şahin", sinif:"Seviye 2", puan:"94"},
      {ad:"Zeynep Demir", sinif:"Seviye 3", puan:"93"},
      {ad:"Ömer Faruk Ay", sinif:"Seviye 1", puan:"92"},
      {ad:"Rana Öztürk", sinif:"Seviye 2", puan:"91"},
      {ad:"Selim Boz", sinif:"Seviye 4", puan:"90"},
      {ad:"Hüda Ceylan", sinif:"Seviye 1", puan:"89"},
      {ad:"Mustafa Er", sinif:"Seviye 3", puan:"88"}
    ]
  },

  hakkimizda:{
    baslik:"Sekiz yıldır aynı sınıfta, aynı işi yapıyoruz",
    metin:"2018'de tek bir grupla başladık. Bugün on iki grubumuz var ama ders yapma biçimimiz değişmedi: küçük sınıf, çok tekrar, her çocuğun kendi hızı.",
    degerler:[
      {ico:"✋", ad:"Önce el, sonra zihin", not:"Her seviye fiziksel abaküsle başlar. Hayalî abaküse geçiş acele edilmez."},
      {ico:"⏱", ad:"Hız değil, doğruluk", not:"Hatasız çözmeyen çocuğu hızlandırmıyoruz. Hız zaten arkadan geliyor."},
      {ico:"👪", ad:"Veliye rapor", not:"Her ay ne yapıldığını, nerede takıldığını yazılı gönderiyoruz."}
    ],
    ekip:[
      {ad:"Ayşe Demirtaş", rol:"Kurucu · Seviye 3–4 eğitmeni"},
      {ad:"Kadir Yavuz", rol:"Seviye 1–2 eğitmeni"},
      {ad:"Nur Aksoy", rol:"Veli iletişimi ve yarışma koordinasyonu"}
    ],
    iletisim:{ telefon:"+90 500 000 00 00", mail:"merhaba@zihinakademi.com", adres:"Şahinbey, Gaziantep" },
    sss:[
      {s:"Kaç yaşında başlanır?", c:"7 yaş ideal. 6 yaşındaki çocuklarda önce sayı tanıma testine bakıyoruz."},
      {s:"Ders süresi ne kadar?", c:"Haftada iki gün, 60'ar dakika. Ev çalışması günde 10 dakikayı geçmiyor."},
      {s:"Kaçırılan ders telafi ediliyor mu?", c:"Evet, aynı hafta içinde başka bir grubun dersine katılabilirsiniz."},
      {s:"Yarışmaya katılmak zorunlu mu?", c:"Hayır. Katılmak isteyen çocuğu hazırlıyoruz, istemeyeni zorlamıyoruz."}
    ]
  }
};

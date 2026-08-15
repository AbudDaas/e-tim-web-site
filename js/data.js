/* المحتوى / İçerik / Content
   كل نص مكتوب بثلاث لغات: {ar, tr, en}
   Her metin üç dilde yazılır. Dil değiştiğinde içerik de değişir.
   Tek dilli bırakmak istersen düz metin yaz: baslik:"…"                */

const DATA = {
  marka:{
    ad:{ar:"أكاديمية الذهن", tr:"Zihin Akademi", en:"Mind Academy"},
    alt:{ar:"الحساب الذهني", tr:"zihinsel aritmetik", en:"mental arithmetic"},
    sinavLinki:"#/sinav"
  },

  /* Branşlar. Yeni ders eklemek için buraya bir satır ekle ya da
     Yönetim panelinden düzenle. tip: sınavlarda varsayılan soru biçimi. */
  dersler:[
    {id:"aritmetik", ico:"🧮", tip:"aritmetik", renk:"#4338CA", arac:"abakus",
     ad:{ar:"الحساب الذهني", tr:"Zihinsel aritmetik", en:"Mental arithmetic"},
     ozet:{ar:"المعداد والحساب الذهني من ٧ إلى ١٤ سنة.", tr:"7–14 yaş için abaküs ve zihinden işlem.", en:"Abacus and mental calculation, ages 7–14."}},
    {id:"ingilizce", ico:"🔤", tip:"secmeli", renk:"#0D9488", arac:"kartlar",
     ad:{ar:"الإنجليزية", tr:"İngilizce", en:"English"},
     ozet:{ar:"مفردات ومحادثة للمبتدئين.", tr:"Kelime ve konuşma, başlangıç seviyesi.", en:"Vocabulary and speaking for beginners."}},
    {id:"arapca", ico:"📖", tip:"secmeli", renk:"#7C3AED", arac:"harfler",
     ad:{ar:"العربية", tr:"Arapça", en:"Arabic"},
     ozet:{ar:"القراءة والقواعد والتعبير.", tr:"Okuma, dil bilgisi ve ifade.", en:"Reading, grammar and expression."}},
    {id:"kuran", ico:"🕌", tip:"yazili", renk:"#B08442", arac:"ezber",
     ad:{ar:"القرآن الكريم", tr:"Kur'an", en:"Qur'an"},
     ozet:{ar:"التلاوة والتجويد والحفظ.", tr:"Tilavet, tecvid ve ezber.", en:"Recitation, tajweed and memorisation."}}
  ],

  /* Kayıtlı ders videoları. Her satır bir ders; ders alanı branşı belirler. */
  kayitliDersler:[
    {ders:"aritmetik", sira:1, sure:"18:40", yt:"", kapak:"",
     ad:{ar:"الدرس ١ — التعرّف على المعداد", tr:"Ders 1 — Abaküsle tanışma", en:"Lesson 1 — Meeting the abacus"},
     ozet:{ar:"أسماء الخرز وطريقة الإمساك والجلسة الصحيحة.", tr:"Boncukların adları, tutuş ve doğru oturuş.", en:"Bead names, grip and correct posture."}},
    {ders:"aritmetik", sira:2, sure:"21:05", yt:"", kapak:"",
     ad:{ar:"الدرس ٢ — الجمع بخانة واحدة", tr:"Ders 2 — Tek basamaklı toplama", en:"Lesson 2 — Single-digit addition"},
     ozet:{ar:"تمارين الجمع البسيط بإيقاع ثابت.", tr:"Sabit ritimle basit toplama alıştırmaları.", en:"Simple addition drills at a steady rhythm."}},
    {ders:"ingilizce", sira:1, sure:"14:20", yt:"", kapak:"",
     ad:{ar:"الوحدة ١ — التحية والتعريف بالنفس", tr:"Ünite 1 — Selamlaşma ve tanışma", en:"Unit 1 — Greetings and introductions"},
     ozet:{ar:"عبارات يومية قصيرة مع النطق.", tr:"Kısa günlük kalıplar ve telaffuz.", en:"Short daily phrases with pronunciation."}},
    {ders:"kuran", sira:1, sure:"25:10", yt:"", kapak:"",
     ad:{ar:"مخارج الحروف — الجزء الأول", tr:"Harflerin mahreçleri — 1. bölüm", en:"Articulation points — part 1"},
     ozet:{ar:"مواضع الحروف في الفم والحلق.", tr:"Harflerin ağız ve boğazdaki çıkış yerleri.", en:"Where each letter is formed in the mouth and throat."}}
  ],

  /* Kelime kartları — İngilizce (ve istersen başka dil) dersinin aracı. */
  kartlar:[
    {ders:"ingilizce", on:"pencil", arka:{ar:"قلم رصاص", tr:"kalem", en:"pencil"}, ipucu:"school"},
    {ders:"ingilizce", on:"book", arka:{ar:"كتاب", tr:"kitap", en:"book"}, ipucu:"school"},
    {ders:"ingilizce", on:"teacher", arka:{ar:"معلّم", tr:"öğretmen", en:"teacher"}, ipucu:"school"},
    {ders:"ingilizce", on:"water", arka:{ar:"ماء", tr:"su", en:"water"}, ipucu:"daily"},
    {ders:"ingilizce", on:"bread", arka:{ar:"خبز", tr:"ekmek", en:"bread"}, ipucu:"daily"},
    {ders:"ingilizce", on:"house", arka:{ar:"بيت", tr:"ev", en:"house"}, ipucu:"daily"},
    {ders:"ingilizce", on:"friend", arka:{ar:"صديق", tr:"arkadaş", en:"friend"}, ipucu:"people"},
    {ders:"ingilizce", on:"morning", arka:{ar:"صباح", tr:"sabah", en:"morning"}, ipucu:"time"}
  ],

  kurslar:[
    {ders:"aritmetik", ad:{ar:"المستوى ١ — التعرّف على المعداد", tr:"Seviye 1 — Abaküsle tanışma", en:"Level 1 — Meeting the abacus"},
     not:{ar:"قراءة الخرز، الجمع بخانة واحدة", tr:"Boncuk okuma, tek basamaklı toplama", en:"Reading beads, single-digit addition"}},
    {ad:{ar:"المستوى ٢ — خانتان", tr:"Seviye 2 — İki basamak", en:"Level 2 — Two digits"},
     not:{ar:"مكمّلات الخمسة والعشرة، الطرح", tr:"Beş ve on tamamlayanlar, çıkarma", en:"Complements of five and ten, subtraction"}},
    {ad:{ar:"المستوى ٣ — المعداد الذهني", tr:"Seviye 3 — Zihin abaküsü", en:"Level 3 — Mental abacus"},
     not:{ar:"الانتقال من المعداد الحسّي إلى الذهني", tr:"Fiziksel abaküsten hayalî abaküse geçiş", en:"From the physical abacus to the imagined one"}},
    {ad:{ar:"المستوى ٤ — السرعة والتحمّل", tr:"Seviye 4 — Hız ve dayanıklılık", en:"Level 4 — Speed and stamina"},
     not:{ar:"سلاسل طويلة وإيقاع المسابقات", tr:"Uzun diziler, yarışma temposu", en:"Long strings, competition pace"}}
  ],

  ana:{
    etiket:{ar:"غازي عنتاب · من ٧ إلى ١٤ سنة", tr:"Gaziantep · 7–14 yaş", en:"Gaziantep · ages 7–14"},
    baslik:{ar:"الأطفال يتعلّمون <span class='grad'>رؤية</span> الأرقام قبل حسابها",
            tr:"Çocuklar sayıları <span class='grad'>görerek</span> düşünmeyi öğreniyor",
            en:"Children learn to <span class='grad'>see</span> numbers, not just count them"},
    metin:{ar:"تدريب ذهني يبدأ بالمعداد ويستمر بلا ورقة ولا قلم. حصّتان مباشرتان أسبوعيًا، مسابقة كل شهر، ومتابعة مستمرة.",
           tr:"Abaküsle başlayan, kâğıt kalem olmadan devam eden bir zihin eğitimi. Haftada iki canlı ders, her ay bir yarışma, sürekli takip.",
           en:"Mental training that starts with the abacus and continues without pen or paper. Two live lessons a week, a competition every month, constant follow-up."},
    istatistik:[
      {sayi:{ar:"+١٨٠", tr:"180+", en:"180+"}, ad:{ar:"طالب", tr:"öğrenci", en:"students"}},
      {sayi:{ar:"١٢", tr:"12", en:"12"}, ad:{ar:"مجموعة", tr:"grup", en:"groups"}},
      {sayi:{ar:"٤ سنوات", tr:"4 yıl", en:"4 years"}, ad:{ar:"مدة البرنامج", tr:"program", en:"programme"}},
      {sayi:{ar:"٩٢٪", tr:"%92", en:"92%"}, ad:{ar:"نسبة الحضور", tr:"devam oranı", en:"attendance"}}
    ],
    duyuru:{ar:"فُتح التسجيل لدورة أيلول. راسلنا لحجز حصة تجريبية.",
            tr:"Eylül dönemi kayıtları açıldı. Deneme dersi için mesaj bırakın.",
            en:"September enrolment is open. Message us for a trial lesson."}
  },

  kesitler:{
    kategoriler:[
      {ar:"الكل", tr:"Tümü", en:"All"},
      {ar:"الجمع", tr:"Toplama", en:"Addition"},
      {ar:"الطرح", tr:"Çıkarma", en:"Subtraction"},
      {ar:"تقنيات", tr:"Teknik", en:"Technique"},
      {ar:"تحفيز", tr:"Motivasyon", en:"Motivation"}
    ],
    liste:[
      {baslik:{ar:"قراءة خمس خرزات بحركة واحدة", tr:"Beş boncuğu tek harekette okumak", en:"Reading five beads in one motion"},
       ders:"aritmetik", kategori:{ar:"تقنيات", tr:"Teknik", en:"Technique"}, sure:"6:12",
       ders:{ar:"المستوى ٢ · الحصة ١٤", tr:"Seviye 2 · Ders 14", en:"Level 2 · Lesson 14"}, yt:"",
       ozet:{ar:"عرضنا بالتصوير البطيء كيف تتحرك اليد على المعداد.", tr:"Elin abaküs üzerinde nasıl gezindiğini yavaşlatarak gösterdik.", en:"Slowed down to show how the hand travels across the abacus."}},

      {baslik:{ar:"الإيقاع في جمع خانتين", tr:"İki basamaklı toplamada ritim", en:"Rhythm in two-digit addition"},
       ders:"aritmetik", kategori:{ar:"الجمع", tr:"Toplama", en:"Addition"}, sure:"4:48",
       ders:{ar:"المستوى ٣ · الحصة ٦", tr:"Seviye 3 · Ders 6", en:"Level 3 · Lesson 6"}, yt:"",
       ozet:{ar:"قراءة الأرقام في مجموعات ثنائية بدل قراءتها فرادى.", tr:"Sayıları tek tek değil, ikişerli gruplar hâlinde okumak.", en:"Reading numbers in pairs instead of one by one."}},

      {baslik:{ar:"الطرح دون النزول تحت الصفر", tr:"Eksiye düşmeden çıkarma", en:"Subtracting without going below zero"},
       ders:"aritmetik", kategori:{ar:"الطرح", tr:"Çıkarma", en:"Subtraction"}, sure:"7:30",
       ders:{ar:"المستوى ٣ · الحصة ٩", tr:"Seviye 3 · Ders 9", en:"Level 3 · Lesson 9"}, yt:"",
       ozet:{ar:"كيف نتقدّم دون أن يهبط المجموع الجزئي تحت الصفر.", tr:"Ara toplam sıfırın altına inmeden nasıl ilerlenir.", en:"How to move on without the running total dropping below zero."}},

      {baslik:{ar:"عشرة أرقام ذهنيًا: تجربة مباشرة", tr:"Zihinden 10 sayı: canlı deneme", en:"Ten numbers in the head: a live drill"},
       ders:"aritmetik", kategori:{ar:"تقنيات", tr:"Teknik", en:"Technique"}, sure:"9:05",
       ders:{ar:"المستوى ٤ · الحصة ٢", tr:"Seviye 4 · Ders 2", en:"Level 4 · Lesson 2"}, yt:"",
       ozet:{ar:"حلّ الجميع أرقام السبورة العشرة دون استخدام الورقة.", tr:"Tahtadaki 10 sayıyı kimse kâğıt kullanmadan çözdü.", en:"Everyone solved the ten numbers on the board without paper."}},

      {baslik:{ar:"كيف نتعامل مع الطفل البطيء في التعلّم", tr:"Yavaş öğrenen çocuğa nasıl davranmalı", en:"How to treat a child who learns slowly"},
       ders:"aritmetik", kategori:{ar:"تحفيز", tr:"Motivasyon", en:"Motivation"}, sure:"5:20",
       ders:{ar:"لقاء أولياء الأمور", tr:"Veli sohbeti", en:"Parents' talk"}, yt:"",
       ozet:{ar:"ماذا يفعل الطفل الذي لا تزيد سرعته فعلًا.", tr:"Hızlanmayan çocuğun aslında ne yaptığını anlatıyoruz.", en:"What the child who isn't speeding up is actually doing."}},

      {baslik:{ar:"أسبوع التخلّي عن العدّ بالأصابع", tr:"Parmak alışkanlığını bırakma haftası", en:"The week of dropping finger counting"},
       ders:"aritmetik", kategori:{ar:"تحفيز", tr:"Motivasyon", en:"Motivation"}, sure:"3:58",
       ders:{ar:"المستوى ١ · الحصة ١١", tr:"Seviye 1 · Ders 11", en:"Level 1 · Lesson 11"}, yt:"",
       ozet:{ar:"أكثر العقبات شيوعًا عند الانتقال إلى المعداد الذهني.", tr:"Hayalî abaküse geçerken yaşanan en sık takılma.", en:"The most common snag when moving to the mental abacus."}}
    ]
  },

  podcast:{
    aciklama:{ar:"أحاديث مع أولياء الأمور والمعلمين. بطول يناسب الطريق أو المطبخ.",
              tr:"Velilerle ve öğretmenlerle konuşuyoruz. Arabada, mutfakta dinlenecek uzunlukta.",
              en:"Conversations with parents and teachers, sized for the car or the kitchen."},
    bolumler:[
      {no:12, baslik:{ar:"قلق الاختبار أم نقص التحضير؟", tr:"Sınav kaygısı mı, hazırlıksızlık mı?", en:"Exam anxiety or lack of preparation?"},
       sure:{ar:"٢٢ دقيقة", tr:"22 dk", en:"22 min"}, tarih:{ar:"٥ آب ٢٠٢٦", tr:"5 Ağustos 2026", en:"5 August 2026"},
       ozet:{ar:"ماذا يقول الطفل الذي يبكي قبل المسابقة.", tr:"Yarışma öncesi ağlayan çocuk aslında ne söylüyor.", en:"What the child crying before a competition is really saying."}, mp3:""},

      {no:11, baslik:{ar:"وقت الشاشة والانتباه", tr:"Ekran süresi ve dikkat", en:"Screen time and attention"},
       sure:{ar:"١٨ دقيقة", tr:"18 dk", en:"18 min"}, tarih:{ar:"٢٢ تموز ٢٠٢٦", tr:"22 Temmuz 2026", en:"22 July 2026"},
       ozet:{ar:"هل قصُر انتباه الأطفال أم كبرت توقعاتنا.", tr:"Dikkat süresi kısaldı mı, yoksa beklentimiz mi büyüdü.", en:"Did attention spans shrink, or did our expectations grow?"}, mp3:""},

      {no:10, baslik:{ar:"هل يرفع المعداد الذكاء؟", tr:"Abaküs zekâyı artırır mı?", en:"Does the abacus raise intelligence?"},
       sure:{ar:"٢٥ دقيقة", tr:"25 dk", en:"25 min"}, tarih:{ar:"٨ تموز ٢٠٢٦", tr:"8 Temmuz 2026", en:"8 July 2026"},
       ozet:{ar:"ما تقوله الأبحاث وما لا تقوله.", tr:"Araştırmaların söylediği ve söylemediği şeyler.", en:"What the research says, and what it doesn't."}, mp3:""},

      {no:9, baslik:{ar:"عشر دقائق تدريب في البيت", tr:"Evde 10 dakikalık çalışma", en:"Ten minutes of practice at home"},
       sure:{ar:"١٥ دقيقة", tr:"15 dk", en:"15 min"}, tarih:{ar:"٢٤ حزيران ٢٠٢٦", tr:"24 Haziran 2026", en:"24 June 2026"},
       ozet:{ar:"الانتظام في الموعد أنفع من إطالة الوقت.", tr:"Uzun çalışma değil, aynı saatte çalışma işe yarıyor.", en:"Not longer practice — practice at the same hour."}, mp3:""}
    ]
  },

  yarismalar:{
    aktif:{
      ders:"aritmetik",
      ad:{ar:"بطولة آب للسرعة", tr:"Ağustos Hız Turnuvası", en:"August Speed Tournament"},
      tarih:"2026-08-30T10:00:00",
      yer:{ar:"مركز شاهين بيك الثقافي · غازي عنتاب", tr:"Şahinbey Kültür Merkezi · Gaziantep", en:"Şahinbey Cultural Centre · Gaziantep"},
      metin:{ar:"ثلاث فئات: المستوى ١–٢، المستوى ٣–٤، والفئة المفتوحة. كل جولة خمس دقائق وعشرون مسألة. ميداليات للمراكز الثلاثة وشهادة مشاركة للجميع.",
             tr:"Üç kategori: Seviye 1–2, Seviye 3–4, Açık grup. Her tur 5 dakika, 20 soru. İlk üçe madalya, tüm katılımcılara katılım belgesi.",
             en:"Three categories: Levels 1–2, Levels 3–4, open group. Each round is five minutes and twenty questions. Medals for the top three, a certificate for everyone."},
      kod:"", katilimci:{ar:"٦٤ مشاركًا", tr:"64 kayıt", en:"64 registered"}
    },
    gecmis:[
      {tarih:{ar:"حزيران ٢٠٢٦", tr:"Haziran 2026", en:"June 2026"},
       ad:{ar:"كأس الصيف", tr:"Yaz Kupası", en:"Summer Cup"},
       not:{ar:"٧٨ مشاركًا · الأولى: إيلاف ي.", tr:"78 katılımcı · birinci: Elif Y.", en:"78 participants · winner: Elif Y."}},
      {tarih:{ar:"نيسان ٢٠٢٦", tr:"Nisan 2026", en:"April 2026"},
       ad:{ar:"مواجهة بين المدن", tr:"Şehirler Arası Düello", en:"Inter-city Duel"},
       not:{ar:"غازي عنتاب – أورفا · فريق من ٤٠ طالبًا", tr:"Gaziantep–Şanlıurfa · 40 kişilik takım", en:"Gaziantep–Şanlıurfa · a team of 40"}},
      {tarih:{ar:"شباط ٢٠٢٦", tr:"Şubat 2026", en:"February 2026"},
       ad:{ar:"ماراثون العطلة", tr:"Sömestr Maratonu", en:"Winter-break Marathon"},
       not:{ar:"٣ أيام · ١٢ جولة", tr:"3 gün · 12 tur", en:"3 days · 12 rounds"}}
    ]
  },

  gurur:{
    ders:"aritmetik",
    donem:{ar:"تموز ٢٠٢٦", tr:"Temmuz 2026", en:"July 2026"},
    metin:{ar:"بحسب متوسط الاختبارات خلال الشهر. تُحدَّث القائمة مطلع كل شهر.",
           tr:"Ay boyunca yapılan denemelerin ortalamasına göre. Liste her ayın başında yenilenir.",
           en:"Based on the month's average exam scores. The list is refreshed at the start of each month."},
    ilkUc:[
      {ad:{ar:"إيلاف ي.", tr:"Elif Y.", en:"Elif Y."}, sinif:{ar:"المستوى ٤", tr:"Seviye 4", en:"Level 4"}, puan:{ar:"٩٨ / ١٠٠", tr:"98 / 100", en:"98 / 100"}},
      {ad:{ar:"يوسف ق.", tr:"Yusuf K.", en:"Yusuf K."}, sinif:{ar:"المستوى ٣", tr:"Seviye 3", en:"Level 3"}, puan:{ar:"٩٦ / ١٠٠", tr:"96 / 100", en:"96 / 100"}},
      {ad:{ar:"مريم أ.", tr:"Meryem A.", en:"Meryem A."}, sinif:{ar:"المستوى ٤", tr:"Seviye 4", en:"Level 4"}, puan:{ar:"٩٥ / ١٠٠", tr:"95 / 100", en:"95 / 100"}}
    ],
    liste:[
      {ad:{ar:"أحمد ش.", tr:"Ahmet Ş.", en:"Ahmet Ş."}, sinif:{ar:"المستوى ٢", tr:"Seviye 2", en:"Level 2"}, puan:{ar:"٩٤", tr:"94", en:"94"}},
      {ad:{ar:"زينب د.", tr:"Zeynep D.", en:"Zeynep D."}, sinif:{ar:"المستوى ٣", tr:"Seviye 3", en:"Level 3"}, puan:{ar:"٩٣", tr:"93", en:"93"}},
      {ad:{ar:"عمر ف.", tr:"Ömer F.", en:"Ömer F."}, sinif:{ar:"المستوى ١", tr:"Seviye 1", en:"Level 1"}, puan:{ar:"٩٢", tr:"92", en:"92"}},
      {ad:{ar:"رنا ع.", tr:"Rana Ö.", en:"Rana Ö."}, sinif:{ar:"المستوى ٢", tr:"Seviye 2", en:"Level 2"}, puan:{ar:"٩١", tr:"91", en:"91"}},
      {ad:{ar:"سليم ب.", tr:"Selim B.", en:"Selim B."}, sinif:{ar:"المستوى ٤", tr:"Seviye 4", en:"Level 4"}, puan:{ar:"٩٠", tr:"90", en:"90"}},
      {ad:{ar:"هدى ج.", tr:"Hüda C.", en:"Hüda C."}, sinif:{ar:"المستوى ١", tr:"Seviye 1", en:"Level 1"}, puan:{ar:"٨٩", tr:"89", en:"89"}},
      {ad:{ar:"مصطفى إ.", tr:"Mustafa E.", en:"Mustafa E."}, sinif:{ar:"المستوى ٣", tr:"Seviye 3", en:"Level 3"}, puan:{ar:"٨٨", tr:"88", en:"88"}}
    ]
  },

  hakkimizda:{
    baslik:{ar:"ثماني سنوات في الصف نفسه، والعمل نفسه",
            tr:"Sekiz yıldır aynı sınıfta, aynı işi yapıyoruz",
            en:"Eight years in the same classroom, doing the same work"},
    metin:{ar:"بدأنا عام ٢٠١٨ بمجموعة واحدة. اليوم لدينا اثنتا عشرة مجموعة، لكن طريقتنا في التدريس لم تتغيّر: صفوف صغيرة، تكرار كثير، وسرعة خاصة لكل طفل.",
           tr:"2018'de tek bir grupla başladık. Bugün on iki grubumuz var ama ders yapma biçimimiz değişmedi: küçük sınıf, çok tekrar, her çocuğun kendi hızı.",
           en:"We started in 2018 with a single group. Today we have twelve, but the way we teach hasn't changed: small classes, plenty of repetition, each child at their own pace."},
    degerler:[
      {ico:"✋", ad:{ar:"اليد أولًا ثم الذهن", tr:"Önce el, sonra zihin", en:"Hand first, then mind"},
       not:{ar:"كل مستوى يبدأ بالمعداد الحسّي، ولا نستعجل الانتقال إلى الذهني.",
            tr:"Her seviye fiziksel abaküsle başlar. Hayalî abaküse geçiş acele edilmez.",
            en:"Every level begins with a physical abacus. We never rush the move to the imagined one."}},
      {ico:"⏱", ad:{ar:"الدقة قبل السرعة", tr:"Hız değil, doğruluk", en:"Accuracy before speed"},
       not:{ar:"لا نسرّع طفلًا لم يتقن الحل الصحيح. السرعة تأتي لاحقًا وحدها.",
            tr:"Hatasız çözmeyen çocuğu hızlandırmıyoruz. Hız zaten arkadan geliyor.",
            en:"We don't speed up a child who isn't accurate yet. Speed follows on its own."}},
      {ico:"👪", ad:{ar:"تقرير لولي الأمر", tr:"Veliye rapor", en:"A report for parents"},
       not:{ar:"نرسل شهريًا ما أُنجز وأين تعثّر الطفل، مكتوبًا.",
            tr:"Her ay ne yapıldığını, nerede takıldığını yazılı gönderiyoruz.",
            en:"Every month we send, in writing, what was covered and where the child struggled."}}
    ],
    ekip:[
      {ad:{ar:"عائشة د.", tr:"Ayşe Demirtaş", en:"Ayşe Demirtaş"},
       rol:{ar:"المؤسِّسة · معلّمة المستويين ٣ و٤", tr:"Kurucu · Seviye 3–4 eğitmeni", en:"Founder · Levels 3–4 teacher"}},
      {ad:{ar:"قادر ي.", tr:"Kadir Yavuz", en:"Kadir Yavuz"},
       rol:{ar:"معلّم المستويين ١ و٢", tr:"Seviye 1–2 eğitmeni", en:"Levels 1–2 teacher"}},
      {ad:{ar:"نور أ.", tr:"Nur Aksoy", en:"Nur Aksoy"},
       rol:{ar:"التواصل مع الأهالي وتنسيق المسابقات", tr:"Veli iletişimi ve yarışma koordinasyonu", en:"Parent liaison and competition coordination"}}
    ],
    iletisim:{
      telefon:"+90 500 000 00 00",
      mail:"merhaba@zihinakademi.com",
      adres:{ar:"شاهين بيك، غازي عنتاب", tr:"Şahinbey, Gaziantep", en:"Şahinbey, Gaziantep"}
    },
    sss:[
      {s:{ar:"ما هو سن البداية؟", tr:"Kaç yaşında başlanır?", en:"What age should a child start?"},
       c:{ar:"السابعة هي السن المثالية. أما ابن السادسة فنجري له اختبار تعرّف على الأرقام أولًا.",
          tr:"7 yaş ideal. 6 yaşındaki çocuklarda önce sayı tanıma testine bakıyoruz.",
          en:"Seven is ideal. For six-year-olds we first run a number-recognition check."}},
      {s:{ar:"كم تستغرق الحصة؟", tr:"Ders süresi ne kadar?", en:"How long is a lesson?"},
       c:{ar:"يومان أسبوعيًا، ستون دقيقة لكل حصة. والتدريب المنزلي لا يتجاوز عشر دقائق يوميًا.",
          tr:"Haftada iki gün, 60'ar dakika. Ev çalışması günde 10 dakikayı geçmiyor.",
          en:"Twice a week, sixty minutes each. Home practice never exceeds ten minutes a day."}},
      {s:{ar:"هل تُعوَّض الحصة الفائتة؟", tr:"Kaçırılan ders telafi ediliyor mu?", en:"Are missed lessons made up?"},
       c:{ar:"نعم، يمكنك حضور حصة مجموعة أخرى ضمن الأسبوع نفسه.",
          tr:"Evet, aynı hafta içinde başka bir grubun dersine katılabilirsiniz.",
          en:"Yes, you can join another group's lesson within the same week."}},
      {s:{ar:"هل المشاركة في المسابقة إلزامية؟", tr:"Yarışmaya katılmak zorunlu mu?", en:"Is entering competitions compulsory?"},
       c:{ar:"لا. نُعدّ من يرغب، ولا نُجبر من لا يرغب.",
          tr:"Hayır. Katılmak isteyen çocuğu hazırlıyoruz, istemeyeni zorlamıyoruz.",
          en:"No. We prepare the children who want to enter and never push those who don't."}}
    ]
  }
};
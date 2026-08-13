/* Çok dil desteği — Türkçe, İngilizce, Arapça.
   Yeni metin eklerken üç sözlüğe de yaz; eksik anahtar Türkçeye düşer. */

const DILLER = {
  tr:{ ad:"Türkçe", kisa:"TR", yon:"ltr" },
  en:{ ad:"English", kisa:"EN", yon:"ltr" },
  ar:{ ad:"العربية", kisa:"AR", yon:"rtl" }
};

const METIN = {
/* --- sekmeler --- */
anaSayfa:      {tr:"Ana sayfa", en:"Home", ar:"الرئيسية"},
dersKesitleri: {tr:"Ders kesitleri", en:"Lesson clips", ar:"مقاطع الدروس"},
podcastler:    {tr:"Podcastler", en:"Podcasts", ar:"البودكاست"},
yarismalar:    {tr:"Yarışmalar", en:"Competitions", ar:"المسابقات"},
gururTablosu:  {tr:"Gurur tablomuz", en:"Honour board", ar:"لوحة الشرف"},
sinav:         {tr:"Sınav", en:"Exam", ar:"الاختبار"},
profil:        {tr:"Profil", en:"Profile", ar:"الملف الشخصي"},
hakkimizda:    {tr:"Hakkımızda", en:"About us", ar:"من نحن"},
gizlilik:      {tr:"Gizlilik", en:"Privacy", ar:"الخصوصية"},

/* --- ortak --- */
girisYap:      {tr:"Giriş yap", en:"Sign in", ar:"تسجيل الدخول"},
kayitOl:       {tr:"Kayıt ol", en:"Sign up", ar:"إنشاء حساب"},
cikisYap:      {tr:"Çıkış yap", en:"Sign out", ar:"تسجيل الخروج"},
geri:          {tr:"Geri", en:"Back", ar:"رجوع"},
basla:         {tr:"Başla", en:"Start", ar:"ابدأ"},
kaydet:        {tr:"Kaydet", en:"Save", ar:"حفظ"},
sil:           {tr:"Sil", en:"Delete", ar:"حذف"},
duzenle:       {tr:"Düzenle", en:"Edit", ar:"تعديل"},
yenile:        {tr:"Yenile", en:"Refresh", ar:"تحديث"},
kopyala:       {tr:"Kopyala", en:"Copy", ar:"نسخ"},
kopyalandi:    {tr:"Kopyalandı", en:"Copied", ar:"تم النسخ"},
devamEt:       {tr:"Devam et", en:"Continue", ar:"متابعة"},
vazgec:        {tr:"Vazgeç", en:"Cancel", ar:"إلغاء"},
bitir:         {tr:"Bitir", en:"Finish", ar:"إنهاء"},
kapat:         {tr:"Kapat", en:"Close", ar:"إغلاق"},
tamam:         {tr:"Tamam", en:"Done", ar:"تم"},
soru:          {tr:"soru", en:"questions", ar:"سؤال"},
dakika:        {tr:"dk", en:"min", ar:"د"},
suresiz:       {tr:"Süresiz", en:"No limit", ar:"بلا وقت"},
ogrenci:       {tr:"öğrenci", en:"student", ar:"طالب"},
ogretmen:      {tr:"öğretmen", en:"teacher", ar:"معلّم"},
yonetici:      {tr:"yönetici", en:"admin", ar:"مشرف"},

/* --- ayarlar / dil --- */
ayarlar:       {tr:"Ayarlar", en:"Settings", ar:"الإعدادات"},
dil:           {tr:"Dil", en:"Language", ar:"اللغة"},
dilAcik:       {tr:"Arayüz dili. Seçimin bu tarayıcıda hatırlanır.",
                en:"Interface language. Your choice is remembered in this browser.",
                ar:"لغة الواجهة. يُحفظ اختيارك في هذا المتصفح."},
dilDegisti:    {tr:"Dil değiştirildi.", en:"Language changed.", ar:"تم تغيير اللغة."},

/* --- giriş / kayıt --- */
hesap:         {tr:"Hesap", en:"Account", ar:"الحساب"},
girisAcik:     {tr:"Öğrenciler sınav geçmişini, ödevlerini ve sertifikalarını görmek için; öğretmenler sınav hazırlamak ve öğrenci takibi için hesap açar.",
                en:"Students sign up to follow their exam history, homework and certificates; teachers to create exams and track students.",
                ar:"يسجّل الطلاب لمتابعة نتائجهم وواجباتهم وشهاداتهم، ويسجّل المعلمون لإعداد الاختبارات ومتابعة الطلاب."},
kimIcin:       {tr:"Kim için", en:"Who is this for", ar:"لمن هذا الحساب"},
ogrenciyim:    {tr:"Öğrenciyim", en:"I'm a student", ar:"أنا طالب"},
ogretmenim:    {tr:"Öğretmenim", en:"I'm a teacher", ar:"أنا معلّم"},
ogrenciHemen:  {tr:"Öğrenci hesapları hemen açılır.",
                en:"Student accounts are activated immediately.",
                ar:"تُفعّل حسابات الطلاب فورًا."},
ogretmenOnay:  {tr:"Öğretmen hesapları yönetici onayından sonra kullanılabilir.",
                en:"Teacher accounts become active after admin approval.",
                ar:"تُفعّل حسابات المعلمين بعد موافقة المشرف."},
adSoyad:       {tr:"Ad soyad", en:"Full name", ar:"الاسم الكامل"},
eposta:        {tr:"E-posta", en:"Email", ar:"البريد الإلكتروني"},
sifre:         {tr:"Şifre", en:"Password", ar:"كلمة المرور"},
sifreIpucu:    {tr:"en az 6 karakter", en:"at least 6 characters", ar:"٦ أحرف على الأقل"},
ogretmenKodu:  {tr:"Öğretmen kodu", en:"Teacher code", ar:"رمز المعلّم"},
ogretmenKoduNot:{tr:"Öğretmeninin verdiği altı haneli kod. Bilmiyorsan boş bırak, sonra eklenebilir.",
                en:"The six-character code from your teacher. Leave it empty if you don't have it yet.",
                ar:"الرمز المكوّن من ستة أحرف من معلّمك. اتركه فارغًا إن لم يكن لديك."},
hesapOlustur:  {tr:"Hesap oluştur", en:"Create account", ar:"إنشاء الحساب"},
sifremiUnuttum:{tr:"Şifremi unuttum", en:"Forgot password", ar:"نسيت كلمة المرور"},
adiniYaz:      {tr:"Adını yaz.", en:"Enter your name.", ar:"اكتب اسمك."},
gecerliMail:   {tr:"Geçerli bir e-posta yaz.", en:"Enter a valid email address.", ar:"اكتب بريدًا إلكترونيًا صحيحًا."},
sifreKisa:     {tr:"Şifre en az 6 karakter olmalı.", en:"Password must be at least 6 characters.", ar:"يجب أن تكون كلمة المرور ٦ أحرف على الأقل."},
mailKayitli:   {tr:"Bu e-posta zaten kayıtlı. Giriş yap sekmesini dene.",
                en:"This email is already registered. Try the sign in tab.",
                ar:"هذا البريد مسجّل مسبقًا. جرّب تسجيل الدخول."},
kodBulunamadi: {tr:"Bu öğretmen kodu bulunamadı. Boş bırakıp sonra da ekleyebilirsin.",
                en:"Teacher code not found. You can leave it empty and add it later.",
                ar:"رمز المعلّم غير موجود. يمكنك تركه فارغًا وإضافته لاحقًا."},
girisHatali:   {tr:"E-posta veya şifre hatalı.", en:"Wrong email or password.", ar:"البريد أو كلمة المرور غير صحيحة."},
agHatasi:      {tr:"Bağlantı kurulamadı, internetini kontrol et.",
                en:"Connection failed, check your internet.",
                ar:"تعذّر الاتصال، تحقّق من الإنترنت."},
hesapOlusturuluyor:{tr:"Hesap oluşturuluyor…", en:"Creating account…", ar:"جارٍ إنشاء الحساب…"},
hosGeldin:     {tr:"Hoş geldin", en:"Welcome", ar:"أهلًا"},

/* --- onay bekleme --- */
onayBekliyor:  {tr:"Hesabın onay bekliyor", en:"Your account is awaiting approval", ar:"حسابك بانتظار الموافقة"},
onayBekliyorNot:{tr:"Yönetici onayladıktan sonra panele girebilirsin. Onaylandığında tekrar giriş yap.",
                en:"You can access the panel once an admin approves your account.",
                ar:"يمكنك الدخول إلى اللوحة بعد موافقة المشرف."},
hesapKapali:   {tr:"Hesabın kapalı", en:"Your account is suspended", ar:"حسابك موقوف"},
hesapKapaliNot:{tr:"Bu hesabın erişimi yönetici tarafından durduruldu.",
                en:"Access to this account has been suspended by an admin.",
                ar:"أوقف المشرف الوصول إلى هذا الحساب."},
durumKontrol:  {tr:"Durumu kontrol et", en:"Check status", ar:"تحقّق من الحالة"},
durumKontrolNot:{tr:"Yönetici onayladıysa bu düğme seni panele alır.",
                en:"If an admin approved you, this button takes you to the panel.",
                ar:"إذا وافق المشرف، ينقلك هذا الزر إلى اللوحة."},
halaBekliyor:  {tr:"Hesabın hâlâ onay bekliyor.", en:"Your account is still awaiting approval.", ar:"لا يزال حسابك بانتظار الموافقة."},
hesabinAcildi: {tr:"Hesabın açıldı.", en:"Your account is now active.", ar:"تم تفعيل حسابك."},
bekliyor:      {tr:"bekliyor", en:"pending", ar:"معلّق"},
onayli:        {tr:"onaylı", en:"approved", ar:"مفعّل"},
kapali:        {tr:"kapalı", en:"suspended", ar:"موقوف"},

/* --- kilitli bölüm --- */
uyelereOzel:   {tr:"Üyelere özel", en:"Members only", ar:"للأعضاء فقط"},
kilitBaslik:   {tr:"Bu bölüm üyelere açık", en:"This section is for members", ar:"هذا القسم للأعضاء"},
kilitMetin:    {tr:"Ücretsiz bir öğrenci hesabı aç, tüm arşive ve sınav geçmişine eriş.",
                en:"Create a free student account to reach the whole archive and your exam history.",
                ar:"أنشئ حساب طالب مجانيًا للوصول إلى الأرشيف كاملًا وسجل اختباراتك."},
ucretsizKayit: {tr:"Ücretsiz kayıt ol", en:"Sign up free", ar:"سجّل مجانًا"},

/* --- sınav --- */
sinavaGir:     {tr:"Sınava gir", en:"Take an exam", ar:"دخول الاختبار"},
sinavKodu:     {tr:"Sınav kodu", en:"Exam code", ar:"رمز الاختبار"},
kodAcik:       {tr:"Öğretmeninin verdiği altı haneli kodu yaz. Hesap açmana gerek yok.",
                en:"Enter the six-character code from your teacher. No account needed.",
                ar:"أدخل الرمز المكوّن من ستة أحرف من معلّمك. لا حاجة لحساب."},
kodsuz:        {tr:"Kodsuz", en:"No code", ar:"بدون رمز"},
serbestAlistirma:{tr:"Serbest alıştırma", en:"Free practice", ar:"تدريب حر"},
serbestAcik:   {tr:"Seviye seç, süre koy, kendi kendine çalış. Sonuç kimseye gitmez.",
                en:"Pick a level, set a timer, practise on your own. Nothing is reported.",
                ar:"اختر المستوى وحدّد الوقت وتمرّن بنفسك. لا تُرسل النتيجة لأحد."},
alistirmayiKur:{tr:"Alıştırmayı kur", en:"Set up practice", ar:"إعداد التدريب"},
kendineSoru:   {tr:"Kendine soru üret", en:"Generate your own questions", ar:"ولّد مسائلك"},
sinavBulunamadi:{tr:"Bu kodla sınav bulunamadı. Kodu öğretmeninle bir daha kontrol et.",
                en:"No exam found with this code. Check it with your teacher.",
                ar:"لا يوجد اختبار بهذا الرمز. تحقّق منه مع معلّمك."},
sinavKapali:   {tr:"Bu sınav şu an kapalı.", en:"This exam is currently closed.", ar:"هذا الاختبار مغلق حاليًا."},
sinaviBaslat:  {tr:"Sınavı başlat", en:"Start exam", ar:"ابدأ الاختبار"},
sinaviBitir:   {tr:"Sınavı bitir", en:"End exam", ar:"إنهاء الاختبار"},
adiniOnce:     {tr:"Önce adını yaz.", en:"Enter your name first.", ar:"اكتب اسمك أولًا."},
kontrol:       {tr:"Kontrol", en:"Check", ar:"تحقّق"},
dogru:         {tr:"Doğru", en:"Correct", ar:"صحيح"},
yanlisDogrusu: {tr:"Yanlış — doğrusu", en:"Wrong — correct answer is", ar:"خطأ — الصواب"},
cevapAlindi:   {tr:"Cevap alındı", en:"Answer recorded", ar:"تم استلام الإجابة"},
sureDoldu:     {tr:"Süre doldu", en:"Time is up", ar:"انتهى الوقت"},
bos:           {tr:"boş", en:"blank", ar:"فارغ"},
isabet:        {tr:"isabet", en:"accuracy", ar:"الدقة"},
sureEtiket:    {tr:"süre", en:"time", ar:"الوقت"},
soruBasina:    {tr:"soru başına", en:"per question", ar:"لكل سؤال"},
yanlisVeBos:   {tr:"Yanlış ve boş kalanlar", en:"Wrong and blank", ar:"الأخطاء والمتروكة"},
hepsiDogru:    {tr:"Hepsi doğru. Tam puan.", en:"All correct. Full marks.", ar:"كل الإجابات صحيحة. علامة كاملة."},
sonucIletildi: {tr:"Sonucun öğretmene iletildi.", en:"Your result was sent to your teacher.", ar:"أُرسلت نتيجتك إلى معلّمك."},
sonucIletilemedi:{tr:"Sonuç kaydedilemedi, öğretmenine haber ver.",
                en:"The result could not be saved, tell your teacher.",
                ar:"تعذّر حفظ النتيجة، أخبر معلّمك."},
yenidenCoz:    {tr:"Yeniden çöz", en:"Try again", ar:"إعادة الحل"},
yanlislariCoz: {tr:"Yanlışları çöz", en:"Redo the wrong ones", ar:"حلّ الأخطاء"},

/* --- sınav kurulumu --- */
sorular:       {tr:"Sorular", en:"Questions", ar:"المسائل"},
otomatikUret:  {tr:"Otomatik üret", en:"Generate automatically", ar:"توليد تلقائي"},
kendimYazacagim:{tr:"Kendim yazacağım", en:"I'll write them", ar:"سأكتبها بنفسي"},
seviye:        {tr:"Seviye", en:"Level", ar:"المستوى"},
soruSayisi:    {tr:"Soru sayısı", en:"Number of questions", ar:"عدد المسائل"},
sorulariYaz:   {tr:"Soruları yaz", en:"Write the questions", ar:"اكتب المسائل"},
siraKaristir:  {tr:"Sırayı karıştır", en:"Shuffle order", ar:"ترتيب عشوائي"},
sureBaslik:    {tr:"Süre", en:"Time limit", ar:"الوقت"},
ozel:          {tr:"özel", en:"custom", ar:"مخصص"},
eksiIsareti:   {tr:"Eksi işareti", en:"Minus sign", ar:"علامة الطرح"},
eksiSolda:     {tr:"Solda −5", en:"Left −5", ar:"يسار −5"},
eksiSagda:     {tr:"Sağda 5−", en:"Right 5−", ar:"يمين 5−"},
secenekler:    {tr:"Seçenekler", en:"Options", ar:"خيارات"},
herSoruda:     {tr:"Her soruda doğru/yanlış göster", en:"Show right/wrong after each question", ar:"إظهار الصح/الخطأ بعد كل مسألة"},
biticeGoster:  {tr:"Bitince yanlışları öğrenciye göster", en:"Show mistakes to the student at the end", ar:"إظهار الأخطاء للطالب في النهاية"},
ses:           {tr:"Ses", en:"Sound", ar:"الصوت"},
soruYardim:    {tr:"Her satır bir soru. Sayıları boşlukla ayır. Eksi için -3 ya da 3-. Cevabı kendin vermek istersen satır sonuna = 41 ekle. # ile başlayan satır atlanır.",
                en:"One question per line. Separate numbers with spaces. Use -3 or 3- for minus. Add = 41 at the end to set the answer yourself. Lines starting with # are skipped.",
                ar:"كل سطر مسألة. افصل الأرقام بمسافة. للطرح اكتب -3 أو -3. أضف = 41 في آخر السطر لتحديد الإجابة. تُتجاهل الأسطر التي تبدأ بـ #."},
soruHazir:     {tr:"soru hazır.", en:"questions ready.", ar:"مسألة جاهزة."},
henuzSoruYok:  {tr:"Henüz soru yok.", en:"No questions yet.", ar:"لا توجد مسائل بعد."},
anlasilmayan:  {tr:"Anlaşılmayan satır:", en:"Unreadable line:", ar:"سطر غير مفهوم:"},
enAzBirSoru:   {tr:"En az bir soru gerekli.", en:"At least one question is required.", ar:"مطلوب مسألة واحدة على الأقل."},
sinavAdiGerekli:{tr:"Sınav adı gerekli.", en:"Exam name is required.", ar:"اسم الاختبار مطلوب."},

/* --- öğretmen paneli --- */
sinavlarim:    {tr:"Sınavlarım", en:"My exams", ar:"اختباراتي"},
ogrencilerim:  {tr:"Öğrencilerim", en:"My students", ar:"طلابي"},
hesaplar:      {tr:"Hesaplar", en:"Accounts", ar:"الحسابات"},
yeniSinav:     {tr:"Yeni sınav", en:"New exam", ar:"اختبار جديد"},
yeniSinavOlustur:{tr:"Yeni sınav oluştur", en:"Create a new exam", ar:"إنشاء اختبار جديد"},
sinavAdi:      {tr:"Sınav adı", en:"Exam name", ar:"اسم الاختبار"},
sinavYayinla:  {tr:"Sınavı yayınla", en:"Publish exam", ar:"نشر الاختبار"},
degisiklikKaydet:{tr:"Değişiklikleri kaydet", en:"Save changes", ar:"حفظ التعديلات"},
sonuclar:      {tr:"Sonuçlar", en:"Results", ar:"النتائج"},
acKapat:       {tr:"Aç / kapat", en:"Open / close", ar:"فتح / إغلاق"},
sinavYok:      {tr:"Henüz sınav yok. Yeni sınav oluştur ile başla; kodu öğrencilere ver, sonuçlar buraya düşsün.",
                en:"No exams yet. Create one, share the code with students and results will appear here.",
                ar:"لا توجد اختبارات بعد. أنشئ اختبارًا وشارك الرمز مع الطلاب لتظهر النتائج هنا."},
sinavYayinda:  {tr:"Sınav yayında", en:"Exam is live", ar:"الاختبار منشور"},
ogrencilereGonder:{tr:"Öğrencilere şunu gönder:", en:"Send this to your students:", ar:"أرسل هذا إلى طلابك:"},
paneleDon:     {tr:"Panele dön", en:"Back to panel", ar:"العودة إلى اللوحة"},
kimseCozmedi:  {tr:"Henüz kimse çözmedi. Kodu paylaştıktan sonra sonuçlar buraya düşer.",
                en:"Nobody has taken it yet. Results appear here once you share the code.",
                ar:"لم يحلّه أحد بعد. تظهر النتائج هنا بعد مشاركة الرمز."},
ortalama:      {tr:"ortalama", en:"average", ar:"المعدل"},
enIyi:         {tr:"en iyi", en:"best", ar:"الأفضل"},
cevapDokumu:   {tr:"Cevap dökümü", en:"Answer breakdown", ar:"تفصيل الإجابات"},
sonucuSil:     {tr:"Bu sonucu sil", en:"Delete this result", ar:"حذف هذه النتيجة"},
csvIndir:      {tr:"CSV indir", en:"Download CSV", ar:"تنزيل CSV"},
sinavSilOnay:  {tr:"Sınav ve sonuçları silinsin mi?", en:"Delete this exam and its results?", ar:"هل تحذف الاختبار ونتائجه؟"},
sonucSilOnay:  {tr:"Sonuç silinsin mi?", en:"Delete this result?", ar:"هل تحذف النتيجة؟"},
sinavAcildi:   {tr:"Sınav açıldı.", en:"Exam opened.", ar:"تم فتح الاختبار."},
sinavKapatildi:{tr:"Sınav kapatıldı.", en:"Exam closed.", ar:"تم إغلاق الاختبار."},
kaydedilemedi: {tr:"Kaydedilemedi.", en:"Could not save.", ar:"تعذّر الحفظ."},

/* --- hesap yönetimi --- */
onayBekleyen:  {tr:"Onay bekleyen", en:"Awaiting approval", ar:"بانتظار الموافقة"},
kayitliHesaplar:{tr:"Kayıtlı hesaplar", en:"Registered accounts", ar:"الحسابات المسجّلة"},
onayla:        {tr:"Onayla", en:"Approve", ar:"موافقة"},
reddet:        {tr:"Reddet", en:"Reject", ar:"رفض"},
askiyaAl:      {tr:"Askıya al", en:"Suspend", ar:"إيقاف"},
yenidenAc:     {tr:"Yeniden aç", en:"Reactivate", ar:"إعادة تفعيل"},
ogretmenYap:   {tr:"Öğretmen yap", en:"Make teacher", ar:"جعله معلّمًا"},
ogrenciYap:    {tr:"Öğrenci yap", en:"Make student", ar:"جعله طالبًا"},
bekleyenYok:   {tr:"Bekleyen hesap yok.", en:"No pending accounts.", ar:"لا توجد حسابات معلّقة."},
hesapYok:      {tr:"Kayıtlı hesap yok.", en:"No registered accounts.", ar:"لا توجد حسابات."},
hesapSilOnay:  {tr:"Hesap silinsin mi?", en:"Delete this account?", ar:"هل تحذف الحساب؟"},
rolGuncellendi:{tr:"Rol güncellendi.", en:"Role updated.", ar:"تم تحديث الدور."},
hesapOnaylandi:{tr:"Hesap onaylandı.", en:"Account approved.", ar:"تمت الموافقة على الحساب."},
hesapAskiya:   {tr:"Hesap askıya alındı.", en:"Account suspended.", ar:"تم إيقاف الحساب."},
onayUyari:     {tr:"hesap onayını bekliyor", en:"accounts are awaiting approval", ar:"حساب بانتظار الموافقة"},
onayUyariNot:  {tr:"Onaylamadığın öğretmenler panele giremez. Görmek için dokun.",
                en:"Teachers you haven't approved cannot use the panel. Tap to review.",
                ar:"المعلمون غير المعتمدين لا يمكنهم استخدام اللوحة. اضغط للمراجعة."},

/* --- öğrenci profili --- */
sinifKodun:    {tr:"Sınıf kodun", en:"Your class code", ar:"رمز صفّك"},
sinifKoduNot:  {tr:"Öğrencilerine bu kodu ver", en:"Share this code with your students", ar:"شارك هذا الرمز مع طلابك"},
ogretmeneBaglan:{tr:"Öğretmenine bağlan", en:"Connect to your teacher", ar:"الارتباط بمعلّمك"},
baglan:        {tr:"Bağlan", en:"Connect", ar:"ارتباط"},
baglanNot:     {tr:"Öğretmenin kodunu girersen ödevlerin ve gelişimin ona görünür.",
                en:"Enter your teacher's code so your homework and progress become visible to them.",
                ar:"أدخل رمز معلّمك لتظهر له واجباتك وتقدّمك."},
ogretmenBagliDegil:{tr:"öğretmen bağlı değil", en:"no teacher linked", ar:"لا يوجد معلّم مرتبط"},
kodBulunamadi2:{tr:"Bu kodla öğretmen bulunamadı.", en:"No teacher found with this code.", ar:"لا يوجد معلّم بهذا الرمز."},
kodEksik:      {tr:"Kodu eksiksiz yaz.", en:"Enter the full code.", ar:"اكتب الرمز كاملًا."},
baglandin:     {tr:"Öğretmenine bağlandın.", en:"You are now linked to your teacher.", ar:"تم ربطك بمعلّمك."},
odevlerim:     {tr:"Ödevlerim", en:"My homework", ar:"واجباتي"},
odevBekliyor:  {tr:"ödev bekliyor.", en:"homework pending.", ar:"واجب معلّق."},
odevYokBekleyen:{tr:"Bekleyen ödevin yok.", en:"You have no pending homework.", ar:"لا توجد واجبات معلّقة."},
odevVerilmedi: {tr:"Henüz ödev verilmedi.", en:"No homework assigned yet.", ar:"لم تُسند واجبات بعد."},
tamamlandi:    {tr:"tamamlandı", en:"completed", ar:"مكتمل"},
gecikti:       {tr:"gecikti", en:"overdue", ar:"متأخر"},
sinavaGitOdev: {tr:"Sınava git", en:"Go to exam", ar:"اذهب إلى الاختبار"},
yaptimIsaretle:{tr:"Yaptım olarak işaretle", en:"Mark as done", ar:"وضع علامة كمنجز"},
odevTamamIsaret:{tr:"Ödev tamamlandı olarak işaretlendi.", en:"Homework marked as done.", ar:"تم وضع علامة على الواجب كمنجز."},
sinavGecmisim: {tr:"Sınav geçmişim", en:"My exam history", ar:"سجل اختباراتي"},
sinavCozmedin: {tr:"Henüz sınav çözmedin. Sınav sekmesinden kodla girebilir ya da serbest alıştırma yapabilirsin.",
                en:"You haven't taken an exam yet. Use a code in the Exam tab or try free practice.",
                ar:"لم تحلّ اختبارًا بعد. استخدم رمزًا في قسم الاختبار أو جرّب التدريب الحر."},
sertifikalarim:{tr:"Sertifikalarım", en:"My certificates", ar:"شهاداتي"},
sertifikaNot:  {tr:"Öğretmenin bir kursu tamamladığını onayladığında burada belirir.",
                en:"A certificate appears here when your teacher confirms you completed a course.",
                ar:"تظهر الشهادة هنا عندما يؤكد معلّمك إتمامك للدورة."},
sertifikaYok:  {tr:"Henüz sertifikan yok.", en:"You have no certificates yet.", ar:"لا توجد شهادات بعد."},
kursIlerlemem: {tr:"Kurs ilerlemem", en:"My course progress", ar:"تقدّمي في الدورات"},
devamEdiyor:   {tr:"devam ediyor", en:"in progress", ar:"قيد التقدّم"},
sertifika:     {tr:"sertifika", en:"certificates", ar:"شهادة"},
belgeBaslik:   {tr:"Katılım ve Başarı Belgesi", en:"Certificate of Achievement", ar:"شهادة إنجاز ومشاركة"},
belgeMetin:    {tr:"programını başarıyla tamamlamıştır.", en:"has successfully completed this programme.", ar:"أتمّ هذا البرنامج بنجاح."},
yazdirPdf:     {tr:"Yazdır / PDF", en:"Print / PDF", ar:"طباعة / PDF"},

/* --- öğrenci takibi --- */
ogrenciYokBagli:{tr:"Henüz öğrenci bağlı değil. Sınıf kodunu paylaş, öğrencilerin kayıt olurken girsin.",
                en:"No students linked yet. Share your class code so students can enter it when signing up.",
                ar:"لا يوجد طلاب مرتبطون. شارك رمز صفّك ليدخله الطلاب عند التسجيل."},
detayVeOdev:   {tr:"Detay ve ödev", en:"Details and homework", ar:"التفاصيل والواجبات"},
sonGiris:      {tr:"son giriş", en:"last seen", ar:"آخر دخول"},
odevVer:       {tr:"Ödev ver", en:"Assign homework", ar:"إسناد واجب"},
odevBaslik:    {tr:"Ödev başlığı", en:"Homework title", ar:"عنوان الواجب"},
odevAciklama:  {tr:"Kısa açıklama (isteğe bağlı)", en:"Short description (optional)", ar:"وصف قصير (اختياري)"},
odevGonder:    {tr:"Ödevi gönder", en:"Send homework", ar:"إرسال الواجب"},
odevGonderildi:{tr:"Ödev gönderildi.", en:"Homework sent.", ar:"تم إرسال الواجب."},
odevBaslikGerekli:{tr:"Ödev başlığı gerekli.", en:"Homework title is required.", ar:"عنوان الواجب مطلوب."},
verilenOdevler:{tr:"Verilen ödevler", en:"Assigned homework", ar:"الواجبات المسندة"},
odevSilOnay:   {tr:"Ödev silinsin mi?", en:"Delete this homework?", ar:"هل تحذف الواجب؟"},
sertifikaVer:  {tr:"Sertifika ver", en:"Grant a certificate", ar:"منح شهادة"},
sertifikaVerildi:{tr:"Sertifika verildi.", en:"Certificate granted.", ar:"تم منح الشهادة."},
sertifikaSilOnay:{tr:"Sertifika silinsin mi?", en:"Delete this certificate?", ar:"هل تحذف الشهادة؟"},
sertifikaYokVerilen:{tr:"Henüz sertifika verilmedi.", en:"No certificates granted yet.", ar:"لم تُمنح شهادات بعد."},
notIsteğe:     {tr:"not (isteğe bağlı)", en:"note (optional)", ar:"ملاحظة (اختياري)"},
hareketler:    {tr:"Hareketler", en:"Activity", ar:"النشاط"},
hareketYok:    {tr:"Hareket kaydı yok.", en:"No activity recorded.", ar:"لا يوجد نشاط مسجّل."},
bekleyenOdev:  {tr:"bekleyen ödev", en:"pending homework", ar:"واجب معلّق"},
odevVerildi:   {tr:"Ödev verildi:", en:"Homework assigned:", ar:"واجب مُسند:"},
odevTamamlandi:{tr:"Ödev tamamlandı:", en:"Homework completed:", ar:"واجب مكتمل:"},
sitegeGiris:   {tr:"Siteye giriş yaptı", en:"Signed in to the site", ar:"سجّل الدخول إلى الموقع"},
listeGuncel:   {tr:"Liste güncellendi.", en:"List refreshed.", ar:"تم تحديث القائمة."},
rolDegisOnay:  {tr:"hesabı rolü değiştirilsin mi?", en:"change this account's role?", ar:"هل تغيّر دور هذا الحساب؟"}
};

/* --- dil durumu --- */
let AKTIF_DIL = (function(){
  /* Sitenin varsayılan dili Arapça. Kullanıcı Profil → Ayarlar'dan
     başka bir dil seçerse tercihi bu tarayıcıda saklanır. */
  try{ const k=localStorage.getItem("sx:dil"); if(k&&DILLER[k]) return k; }catch(e){}
  return "ar";
})();

function t(anahtar){
  const m=METIN[anahtar];
  if(!m) return anahtar;
  return m[AKTIF_DIL] || m.tr || anahtar;
}
/* içerik alanları: düz metin ya da {tr,en,ar} nesnesi olabilir */
function ceviri(deger){
  if(deger && typeof deger==="object" && !Array.isArray(deger))
    return deger[AKTIF_DIL] || deger.tr || Object.values(deger)[0] || "";
  return deger;
}
function aktifDil(){ return AKTIF_DIL; }
function dilAyarla(kod){
  if(!DILLER[kod]) return;
  AKTIF_DIL=kod;
  try{ localStorage.setItem("sx:dil",kod); }catch(e){}
  _harita=null;
  document.documentElement.lang=kod;
  document.documentElement.dir=DILLER[kod].yon;
}
document.documentElement.lang=AKTIF_DIL;
document.documentElement.dir=DILLER[AKTIF_DIL].yon;

/* --- yayın sonrası çeviri katmanı ---
   Görünümler Türkçe yazılmıştır; başka dil seçiliyse üretilen HTML
   sözlükteki karşılıklarla değiştirilir. Böylece yeni metin eklerken
   sadece METIN sözlüğüne satır eklemek yeterli olur. */
let _harita=null;
function _kacir(x){ return x.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"); }
function _haritaKur(){
  _harita=[];
  for(const k in METIN){
    const m=METIN[k];
    if(!m || !m.tr) continue;
    const hedef=m[AKTIF_DIL];
    if(!hedef || hedef===m.tr) continue;
    _harita.push([m.tr,hedef]);
  }
  _harita.sort((a,b)=>b[0].length-a[0].length);
  /* Kelime sınırı için lookbehind kullanmıyoruz: eski Safari ve bazı
     Android tarayıcıları desteklemiyor, hata verince sayfa boş kalıyordu.
     Bunun yerine önceki karakteri yakalayıp geri yazıyoruz. */
  _harita=_harita.map(function(c){
    const tr=c[0], hedef=c[1];
    let re=null;
    try{ re=new RegExp("(^|[^\\p{L}\\p{N}])"+_kacir(tr)+"(?![\\p{L}\\p{N}])","gu"); }
    catch(e){
      try{ re=new RegExp("(^|[^A-Za-zÇĞİÖŞÜçğıöşü0-9])"+_kacir(tr)+"(?![A-Za-zÇĞİÖŞÜçğıöşü0-9])","g"); }
      catch(e2){ re=null; }
    }
    return [re,hedef];
  }).filter(function(c){ return c[0]; });
}
function cevirHtml(x){
  if(AKTIF_DIL==="tr" || x==null) return x;
  try{
    if(!_harita) _haritaKur();
    let s=String(x);
    for(let i=0;i<_harita.length;i++){
      const re=_harita[i][0], hedef=_harita[i][1];
      s=s.replace(re,function(tam,onceki){ return (onceki||"")+hedef; });
    }
    return s;
  }catch(e){
    /* çeviri başarısız olursa metin Türkçe kalsın, sayfa yine de açılsın */
    console.warn("çeviri atlandı:",e);
    return x;
  }
}
# Zihin Akademi — çok dersli eğitim platformu

Zihinsel aritmetik, İngilizce, Arapça ve Kur'an derslerinin tek çatı altında
yürütüldüğü bir eğitim sitesi. Öğrenci, veli, öğretmen ve yönetici rolleri;
sınav, ödev, yoklama, sertifika ve canlı yarışma içerir.

**Build adımı yok.** Native JavaScript, Firebase (Auth + Firestore REST),
hash tabanlı yönlendirme, üç dil (AR/TR/EN) ve çevrimdışı çalışma.

---

## Kurulum

1. **Firebase Console** → yeni proje
2. **Authentication → Sign-in method**: Email/Password *ve* Anonymous aç
3. **Firestore Database** oluştur (konum: eur3)
4. **Firestore → Rules**: `firestore-rules.txt` içeriğini yapıştır,
   `ADMIN_EMAIL` yazan yeri kendi adresinle değiştir → Publish
5. `js/config.js` içindeki üç alanı doldur:

```js
const FIREBASE   = { projectId:"...", apiKey:"..." };
const ADMIN_EMAIL = "senin@mailin";
const GEMINI      = { anahtar:"", model:"gemini-2.0-flash" };  // isteğe bağlı
```

6. Dosyaları klasör yapısını bozmadan GitHub Pages'e yükle
7. **Authentication → Settings → Authorized domains** → yayın adresini ekle
8. `index.html`, `robots.txt`, `sitemap.xml` içindeki `SITE-ADRESIN` yazan yerleri değiştir

Ayrıntılı adımlar: `YAYIN-KONTROL-LISTESI.md`

### Yerelde çalıştırma

Dosyaya çift tıklama çalışmaz (modüller ve servis çalışanı engellenir):

```bash
python3 -m http.server 8080    # → http://localhost:8080
```

---

## Dosya yapısı

```
index.html            iskelet ve script sırası
404.html              özel hata sayfası (SPA yönlendirmesi yapar)
manifest.json         ana ekrana ekleme (PWA)
sw.js                 çevrimdışı önbellek
robots.txt            arama motoru yönergeleri
sitemap.xml           site haritası
css/style.css         tasarım sistemi ve tüm stiller
js/
  config.js           Firebase / Gemini ayarları
  ikonlar.js          gömülü Font Awesome simgeleri
  i18n.js             üç dilli sözlük + çeviri katmanı
  data.js             site içeriği (dersler, kesitler, podcast, müfredat…)
  util.js             kısayollar ve biçimlendirme
  state.js            uygulama durumu
  store.js            Firebase Auth + Firestore REST + yerel depo
  engine.js           soru üretimi ve metinden soru ayrıştırma
  abakus.js           sanal abaküs
  araclar.js          kelime kartları, harf tahtası, ezber takibi
  tekrar.js           aralıklı tekrar (SRS)
  mufredat.js         müfredat ağacı
  canli.js            canlı yarışma
  views-site.js       site sekmeleri ve ders sayfaları
  views-exam.js       sınav, profil, panel ekranları
  admin.js            yönetim paneli (içerik düzenleme)
  exam.js             çözüm motoru, olaylar, işlemler
  app.js              yönlendirme, menü, açılış
```

Dosyalar sırayla yüklenir; `app.js` en sonda çünkü açılış her şeye bağlıdır.

---

## Roller

| Kim | Nasıl girer | Ne yapar |
|-----|-------------|----------|
| Misafir öğrenci | sınav kodu | sınavı çözer, sonuç öğretmene gider |
| Kayıtlı öğrenci | e-posta + şifre | ödev, sonuç, sertifika, tekrar, araçlar |
| Veli | e-posta + şifre + veli kodu | çocuğunun gelişimini izler |
| Öğretmen | e-posta + şifre, **yönetici onayı** | sınav, ödev, yoklama, sertifika, canlı yarışma |
| Yönetici | `ADMIN_EMAIL` adresiyle | hesap onayı + site içeriği yönetimi |

**Sınıf kodu:** öğretmen hesabı açılırken üretilir; öğrenci kayıtta girince bağlanır.
**Veli kodu:** öğrencinin profilinde görünür; veli kayıtta girer.

---

## Veri şeması (Firestore)

```
users/{uid}                      hesap: ad, mail, rol, durum, ogretmen, sinifKodu
classes/{kod}                    sınıf kodu → öğretmen
parents/{kod}                    veli kodu → öğrenci
exams/{kod}                      sınav ve soruları
exams/{kod}/results/{id}         sınavın tüm sonuçları
live/{kod}                       canlı yarışma odası
live/{kod}/players/{id}          katılımcılar ve puanlar
students/{uid}/results|tasks|certs|attendance|notif|srs|curriculum|hifz
announcements/{id}               sınıf duyuruları
schedule/{uid}                   ders programı
site/icerik                      yönetim panelinden yayınlanan içerik
```

---

## Bakım notları

- Dosya güncellediğinde `index.html` içindeki bütün `?v=` değerlerini
  ve `sw.js` içindeki `SURUM` sabitini değiştir; yoksa kullanıcılarda eski
  kopya kalır.
- Yeni arayüz metni eklerken `js/i18n.js` içindeki `METIN` sözlüğüne de ekle,
  yoksa diğer dillerde Türkçe kalır.
- Yeni ders eklemek: `js/data.js` → `dersler` listesine bir satır. Menü, sekmeler
  ve sınav formu kendiliğinden uyum sağlar.
- Uygulama simgesi Font Awesome Free'den türetilmiştir (CC BY 4.0) — atıf
  gizlilik sayfasında ve `IKON-LISANS.txt` dosyasındadır, kaldırma.

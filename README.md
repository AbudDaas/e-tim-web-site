# Zihin Akademi — eğitim sitesi ve sınav sistemi

Tek sayfa uygulama. Build adımı yok, `npm install` yok, doğrudan statik sunucuya konur.
Native JavaScript, Firebase (Auth + Firestore REST), hash tabanlı yönlendirme.

## Dosya yapısı

```
index.html            iskelet ve <script> sırası
css/style.css         tasarım sistemi, site ve sınav stilleri
js/
  config.js           Firebase projectId / apiKey / ADMIN_EMAIL
  data.js             tüm site içeriği (metinler, kesitler, podcast, yarışma, gurur)
  util.js             kısayollar, biçimlendirme, kod üretimi, bildirim
  state.js            uygulama durumu (SX)
  store.js            yerel depo + Firebase Auth/Firestore çağrıları
  engine.js           soru üretimi ve metinden soru ayrıştırma
  views-site.js       ana sayfa, kesitler, podcast, yarışma, gurur, hakkımızda
  views-exam.js       sınav ve profil ekranları
  exam.js             çözüm motoru, olaylar, sınav ve hesap işlemleri
  app.js              sekmeler, yönlendirme, mobil menü, açılış
firestore-rules.txt   Firebase güvenlik kuralları
```

Dosyalar sıra ile yükleniyor; `app.js` en sonda çünkü sekme tanımları görünüm
fonksiyonlarına, açılış da her şeye ihtiyaç duyuyor.

## Yerelde çalıştırma

Dosyaları çift tıklayarak açma — tarayıcı bazı istekleri engeller. Bir sunucu başlat:

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

VS Code kullanıyorsan Live Server eklentisi de olur.

## Kurulum

1. `js/config.js` içindeki `FIREBASE` ve `ADMIN_EMAIL` alanlarını doldur
2. Firebase Console → Authentication → Email/Password ve Anonymous aç
3. Firestore Database oluştur, `firestore-rules.txt` içeriğini Rules'a yapıştır
4. Dosyaların tamamını (klasör yapısını bozmadan) GitHub Pages ya da Cloudflare Pages'e yükle
5. Firebase → Authentication → Settings → Authorized domains → yayın adresini ekle

Ayrıntılı adımlar `YAYIN-KONTROL-LISTESI.md` dosyasında.

## Roller

| Kim | Nasıl girer | Ne yapar |
|-----|-------------|----------|
| Öğrenci | hesap yok, sınav kodu | sınavı çözer, sonucu öğretmene gider |
| Öğretmen | e-posta + şifre, yönetici onayı gerekir | sınav oluşturur, sonuçları görür |
| Yönetici | `ADMIN_EMAIL` adresiyle kayıt | hesapları onaylar, askıya alır, siler |

## Sonraki adım: React'e taşımak

Bu yapı büyüdüğünde (öğrenci profilleri, ödev takibi, ödeme) Vite + React'e geçmek
mantıklı olur. Geçişte `data.js`, `store.js` ve `engine.js` neredeyse olduğu gibi
taşınır; yalnız `views-*.js` dosyaları bileşenlere dönüşür.

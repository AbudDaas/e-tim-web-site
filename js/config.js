/* Firebase ayarları.
   Bu iki değeri doldurmadan site "deneme modu"nda çalışır:
   hesaplar yalnız kaydolunan tarayıcıda kalır, başka cihazdan girilemez.

   Değerleri nereden alacaksın:
   Firebase Console → projeni aç → sol üstteki dişli (Project settings)
   → General sekmesi → aşağıda "Your apps" → Web app (</> simgesi)
   → firebaseConfig bloğunda apiKey ve projectId yazıyor.

   Örnek görünüm:
     apiKey: "AIzaSyBjemD2ll...",
     projectId: "huda-math-egtin-sitesi",
*/

const FIREBASE = {
  projectId: "huda-math-egtin-sitesi",   // ör. "huda-math-egtin-sitesi"
  apiKey:    "AIzaSyBjemD2llIDz22g8ZXIOAVpxWwziRjLEzU"    // ör. "AIzaSyBjemD2ll..."
};

/* Yönetici hesabı. Bu adresle kayıt olan (ya da giren) hesap
   otomatik olarak onaylı yönetici olur.
   Firestore kurallarındaki ADMIN_EMAIL ile birebir aynı olmalı. */
const ADMIN_EMAIL = "abdulrazakdaas01@gmail.com";
/* Dosyaları her güncellediğinde index.html içindeki ?v= değerini değiştir,
   böylece kimse eski kopyayla kalmaz. */
const SURUM="20260813a";
 
/* İsteğe bağlı: yapay zekâ ile soru üretimi.
   Google AI Studio'dan alınan anahtarı yaz; boşsa bu özellik gizli kalır.
   Anahtar tarayıcıya iner, bu yüzden Google Cloud'dan mutlaka
   "Websites" kısıtı ekle ve yalnız Generative Language API'ye izin ver. */
const GEMINI = { anahtar:"", model:"gemini-2.0-flash" };
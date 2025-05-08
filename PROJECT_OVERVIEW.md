# 📘 Vardiya Defteri - Proje Özeti ve Teknik Dokümantasyon

## 🎯 Projenin Amacı

Bu yazılım, endüstriyel ortamlarda vardiya esnasında alınan kritik notların düzenli, güvenli ve denetlenebilir biçimde dijital ortamda saklanmasını hedefleyen bir "Vardiya Defteri" uygulamasıdır.  
Her kullanıcı kendi sicili ile sisteme giriş yapar, yalnızca yetkili olduğu kapsamda işlem gerçekleştirebilir. Veri bütünlüğü, güvenlik ve denetlenebilirlik en üst düzeyde gözetilmiştir.

---

## 🧑‍💼 Kullanıcı Giriş ve Güvenlik Yapısı

- Sisteme giriş, kullanıcının **sicil numarası** ve **şifresi** ile gerçekleştirilir.
- Şifre yanlış girildiğinde sistem, **parametrik olarak belirlenen** (varsayılan: 3) başarısız deneme sonrası kullanıcıyı **bloke eder**.
- Blokaj süresi, **en son bloke olma tarihi** ile birlikte izlenir.
- Giriş işlemi JWT (JSON Web Token) tabanlı güvenlik yapısıyla desteklenmektedir.

---

## 🧾 Kullanıcı Profili Bilgileri

Her kullanıcı için sistemde aşağıdaki bilgiler tutulur:

- Sicil
- Ad Soyad
- Ünvan
- Ünite (rol tabanlı işlem kapsamı)
- Rol (NORMAL_KULLANICI, ISLETME_SORUMLUSU, SISTEM_YONETICISI)
- Hesap açılış tarihi
- Hesap silme tarihi (soft delete)
- Silinme nedeni
- Bloke durumu
- Son bloke zamanı

---

## 🛠️ Kullanıcı Rolleri ve Yetkileri

| Rol | Yetkiler |
|-----|----------|
| **NORMAL_KULLANICI** | Sadece kendi ünitesine ait vardiya kayıtlarını görüntüleyebilir ve oluşturabilir |
| **ISLETME_SORUMLUSU** | Tüm ünitelere ait kayıtları oluşturabilir ve görüntüleyebilir |
| **SISTEM_YONETICISI** | Kullanıcı ekleme, düzenleme, blokeyi kaldırma, silme işareti atma, tüm kayıtları görüntüleme, raporlama işlemleri |

- **Sistem yöneticisi silme işlemi yerine**, kullanıcıya **silinme tarihi ve nedeni atayarak** "pasifleştirme" uygular.
- Silinmiş kullanıcılar sisteme tekrar giriş yapamaz ve işlem gerçekleştiremez.

---

## 📓 Vardiya Notu Yapısı

Bir vardiya kaydı şu alanları içerir:

- Vardiya tipi (örneğin: SAAT_08_16, SAAT_00_08)
- Ünite
- Tarih (ISO format)
- Saat (otomatik atanır)
- Not içeriği
- Ekleyen kişinin ad-soyadı ve ünvanı
- Oluşturulma tarihi
- Güncellenme tarihi (varsa ✏️ etiketiyle işaretlenir)

---

## 📊 Raporlama ve Filtreleme

### 🔎 Kullanıcı Raporları

- Ad Soyad
- Sicil
- Ünvan
- Rol
- Ünite
- Bloke durumu
- Hesap açılış ve silinme tarihi
- Silinme nedeni  
→ Bu kriterlere göre filtreleme yapılabilir, Excel ve PDF olarak dışa aktarılabilir.

### 🔎 Vardiya Raporları

- Ünite
- Vardiya tipi
- Tarih aralığı
- Ekleyen kişi
- Not içeriğinde kelime bazlı arama  
→ Gelişmiş çoklu filtreleme ve sıralama desteği ile birlikte PDF/Excel raporu alınabilir.

---

## 🧰 Kullanılan Teknolojiler

- **Backend:** Java 17, Spring Boot, Spring Security, JWT, PostgreSQL
- **Frontend:** Angular 17+, Angular Material, Standalone Component yapısı
- **Veritabanı:** PostgreSQL (nullable/soft delete destekli yapı)
- **Export:** `xlsx`, `html2pdf`, `FileSaver`, `MatTableDataSource` gibi modern Angular araçları

---

## ⚙️ Teknik Özellikler

- DTO, Entity, Service, Mapper, Controller katmanlı mimari
- JWT ile oturum yönetimi, Token interceptor sistemi
- RoleGuard ve AuthGuard ile route bazlı yetkilendirme
- Giriş deneme sayısı sistemi (`maxFailedAttempts` ayarlanabilir)
- Güncellenen notlar için (✏️ Düzenlendi) etiketi ve tooltip
- Güncelleme sırasında saat bilgisi otomatik atanır
- Formlardaki alanlar role göre kilitlenir (readonly)
- Silme işlemleri soft-delete (silme tarihi ve nedeni atanır)
- Kullanıcıların ünitelere göre yetki kapsamı dinamik olarak uygulanır

---

## 🔐 Ek Özellikler

- **Şifre sıfırlama** desteği (manuel kullanıcı müdahalesi ile)
- **Bloke kaldırma** yetkisi sadece `SISTEM_YONETICISI` tarafından kullanılır
- Angular'da responsive ve kullanıcı dostu arayüz
- `MatPaginator`, `MatSort` ile güçlü tablo desteği
- Ünite, tarih, sicil ve rol bazlı çoklu filtreleme

---

## 🔄 İleride Planlanan Geliştirmeler

- Refresh Token sistemi
- Kullanıcı işlem geçmişi loglama
- Mobil görünüm optimizasyonu
- CI/CD ile otomatik deploy
- Email bildirim sistemi (şifre sıfırlama vs.)
- Grafik tabanlı rapor ekranı

---

## 👨‍💻 Geliştirici Notları

Bu proje sıfırdan geliştirilmiş olup, Spring Boot ve Angular teknolojilerine hâkim olmak isteyen geliştiriciler için iyi bir örnek niteliğindedir.  
Kod yapısı sade, okunabilir ve ölçeklenebilir şekilde inşa edilmiştir. Proje, hem frontend hem backend tarafında modülerlik esas alınarak organize edilmiştir.

---


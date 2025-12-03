# Modern Çok Dilli Website

## 📋 Proje Açıklaması

Bu proje, modern ve responsive bir web sitesi şablonudur. Türkçe ve İngilizce dil desteği ile birlikte 4 ana bölüm ve her bölümde grid tabanlı içerik yapısı bulunmaktadır.

## ✨ Özellikler

- ✅ **Çok Dilli Destek**: Türkçe ve İngilizce dil seçenekleri
- ✅ **Responsive Tasarım**: Mobil, tablet ve masaüstü uyumlu
- ✅ **Modern UI/UX**: Temiz ve profesyonel arayüz
- ✅ **4 Ana Bölüm**: Tab yapısı ile organize edilmiş içerik
- ✅ **Grid Sistemi**: Her bölümde 4'lü grid yapısı
- ✅ **Smooth Scroll**: Yumuşak sayfa geçişleri
- ✅ **Animasyonlar**: Scroll bazlı animasyonlar
- ✅ **Sticky Header**: Sabit navigasyon menüsü
- ✅ **Mobil Menü**: Hamburger menü ile mobil uyumluluk

## 📁 Dosya Yapısı

```
bulls/
│
├── index.html          # Ana HTML dosyası
├── styles.css          # CSS stil dosyası
├── script.js           # JavaScript fonksiyonları
└── README.md           # Proje dokümantasyonu
```

## 🚀 Kullanım

1. Projeyi bilgisayarınıza indirin
2. `index.html` dosyasını tarayıcıda açın
3. Dil değiştirmek için sağ üst köşedeki TR/EN butonlarını kullanın

## 🎨 Özelleştirme

### Renkleri Değiştirme

`styles.css` dosyasındaki `:root` değişkenlerini düzenleyin:

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #1e40af;
    --accent-color: #3b82f6;
    /* Diğer renkler... */
}
```

### İçerikleri Güncelleme

`script.js` dosyasındaki `translations` objesini düzenleyin:

```javascript
const translations = {
    tr: {
        hero: {
            title: "Yeni Başlık",
            subtitle: "Yeni Alt Başlık"
        }
        // Diğer içerikler...
    }
}
```

### Bölüm Sayısını Değiştirme

1. `index.html` dosyasında yeni section ekleyin veya çıkarın
2. `script.js` dosyasında ilgili çeviri anahtarlarını ekleyin
3. Navigasyon menüsüne link ekleyin

## 📱 Responsive Breakpoint'ler

- **Desktop**: 1200px ve üzeri
- **Tablet**: 768px - 1199px
- **Mobile**: 768px ve altı
- **Small Mobile**: 480px ve altı

## 🎯 Gelecek Geliştirmeler

- [ ] Daha fazla dil desteği eklenebilir
- [ ] Backend entegrasyonu yapılabilir
- [ ] İletişim formu eklenebilir
- [ ] Blog/haber bölümü eklenebilir
- [ ] Karanlık mod desteği eklenebilir
- [ ] Daha fazla animasyon efekti eklenebilir

## 💡 Öneriler

- İsimleri özelleştirmeden önce yapıyı test edin
- Responsive tasarımı kontrol edin
- Tarayıcı uyumluluğunu test edin
- SEO optimizasyonu için meta tagları ekleyin

## 📝 Notlar

- Kodlar düzenli ve yorumludur
- Her bölüm modüler yapıdadır
- Grid yapısı kolayca özelleştirilebilir
- Dil dosyaları JSON formatında organize edilmiştir

## 🔧 Teknik Detaylar

- **HTML5** semantik yapı
- **CSS3** modern özellikler (Grid, Flexbox, Animations)
- **Vanilla JavaScript** (framework gerektirmez)
- **SVG** ikonlar (ölçeklenebilir)
- **LocalStorage** dil tercihi kaydı

## 📞 Destek

Herhangi bir sorunuz olursa, projeyi geliştirmeye devam edebilirsiniz. Tüm bölümler ve içerikler özelleştirilebilir durumdadır.

---

**Not**: İsimler ve içerikler daha sonra güncellenecektir. Şu an için placeholder metinler kullanılmaktadır.

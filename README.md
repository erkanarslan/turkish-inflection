[Click here](./readme-en.md) for English documentation.

# Türkçe Sözcük Çekimleme Kütüphanesi
Bu Javascript kütüphanesi Türkçe sözcüklerin ve çekim eklerinin doğru bir şekilde çekimlenmesini sağlar.

Metin şablonlarının içine dinamik olarak yerleştirilen sözcüklere gelen çekim eklerinin formatı dinamik olarak eklenen sözcüğe bağlı olduğu için her zaman gramer kurallarına uygun metinler oluşturulması mümkün değildir. Örneğin:

````
Şablon:			"ŞEHİR_ADI'daki Restoranlar"
 - İstanbul:		"İstanbul'daki Restoranlar"
 - Edirne:			"Edirne'daki Restoranlar"

Şablon:			"MEYVE_ADIyı Sepete Ekle"
 - Elma:			"Elmayı Sepete Ekle"
 - Muz:				"Muzyı Sepete Ekle"
````

Bu kütüphane kullanılarak çekim ekleri gramere uygun olarak eklenebilir. Örneğin:

````js
// İsmin i haline göre çekimleme

// Tek sözcük çekimleme
inflect("Elma", "i")			// Elmayı

// Metin çekimleme
inflect("Muz--i Sepete Ekle")		// Muzu Sepete Ekle

// İnterpolasyon ve çekimleme
let template = "{{meyve}}--i Sepete Ekle";
inflect(template, {meyve : "Çilek"})	// Çileği Sepete Ekle
````

# Kullanım
Çekimleme `inflect()` fonksiyonu ile yapılır. Sözcükler ismin `-i`, `-e`, `-de` ve `-den` halleri, iyelik eki `-in`, çoğulluk eki `-ler`, soru eki `mi` ve bağlaç `de` için çekimlenebilir.

## Kurulum ve İçe Aktarma
Paketi npm veya bir başka paket yöneticisi ile yükleyin:

    npm i @erkanarslan/turkish-inflection

`inflect()` fonksiyonunu kodun içine aktarın:

````js
import { inflect } from '@erkanarslan/turkish-inflection';
inflect("Okul", "e");

// veya

const inflection = require('@erkanarslan/turkish-inflection');
inflection.inflect("Okul", "e");
````

## 1. Tek Sözcük Çekimleme
`inflect(word, suffix)` fonksiyonuna ilk parametre olarak bir sözcük ve ikinci parametre olarak bir ek verildiğinde çekimlenen sözcük döndürülür. Örnekler:

````js
let result;
result = inflect("Muz", "i");		// Muzu
result = inflect("uçak", "de");		// uçakta
result = inflect("kitap", "ler");	// kitaplar

````

## 2. Metin Çekimleme
`inflect(text)` fonksiyonuna sadece bir metin parametresi vererek tek sözcük yerine bir veya daha fazla çekimlenecek sözcük içeren uzun metinleri çekimleyebilirsiniz. Bu durumda çekim ekinin ekleneceği yerler `--EK` formatıyla işaretlenmelidir. `EK` olarak **Kullanım** başlığı altında listelenen eklerden istediklerinizi kullanabilirsiniz.

Uygulamanızda metin şablonlarının içine sözcükler bir başka kütüphane veya fonksiyon tarafından ekleniyorsa (örneğin bir çeviri/i18n kütüphanesi gibi) bu yöntemi ilgili kütüphaneden sonra çekimlemeleri yapmak için kullanabilirsiniz.

Örnekler:


````js
let result;
// Muzu
result = inflect("Muz--i");

// Antalya'dan İstanbul'a Biletler
result = inflect("Antalya'--den İstanbul'--e Biletler");

// Edirne'den Antalya'ya Biletler
result = inflect("Edirne'--den Antalya'--e Biletler");

// Kitaplarda %60'a varan indirimler!
result = inflect("Kitap--ler--de %60'--e varan indirimler!");

// Antalya'ya mı gitmek istiyorsun?
result = inflect("Antalya'--e --mi gitmek istiyorsun?");

````

## 3. İnterpolasyon ve Çekimleme
Metin şablonlarının içinde `{{DEĞER_ADI}}` ile işaretlenen kısımların doldurulmasını (interpolasyon) ve ardından çekimlenmesini sağlayabilirsiniz. Bunun için `inflect(text, object)` fonksiyonunu ilk parametreyi bir metin, ikinci parametreyi değerleri içeren bir obje vererek çağırabilirsiniz. Örnekler:


````js
let result;
// Erkan'a mesaj gönder
result = inflect("{{user}}'--e mesaj gönder", {user : 'Erkan'});

// Antalya'dan İstanbul'a Biletler
result = inflect("{{city1}}'--den {{city2}}'--e Biletler", {
	city1 : 'Antalya',
	city2 : 'İstanbul'
});

// Kitaplarda %56'ya varan indirimler!
result = inflect("{{product}}--ler--de %{{discount}}'--e varan indirimler!", {
	product : "Kitap",
	discount : "56"
});

````

# Desteklenen Özellikler
## Zincirleme
Ekler arka arkaya konularak zincirleme olarak çekimlenebilir. Örneğin:

````js
// Yeni ayakkabıları da görmek ister misiniz?
inflect("Yeni {{product}}--ler--i --de görmek ister misiniz?", {product : "ayakkabı"});
````

## Sayı Çekimleme
Sayılara gelen ekler sayıların okunuşuna göre çekimlenir. Örneğin:

````js
// Sabah 9'dan akşam 6.50'ye kadar açığız.
inflect("Sabah {{start}}'--den akşam {{end}}'--e kadar açığız.", {start : "9", end : "6.50"});

// 1960'tan önce doğanlar
inflect("{{year}}'--den önce doğanlar", {year : 1960});
````

## Büyük Harf Desteği
Çekim eki işareti büyük harflerle yazılırsa çıktı da büyük harfle olur. Örneğin:

````js
// FENERBAHÇE'NİN MAÇLARI
inflect("{{team}}'--İN MAÇLARI", {team : "FENERBAHÇE"});
````

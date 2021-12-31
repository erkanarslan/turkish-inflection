[Click here](./README.md) for Turkish documentation.

# Turkish Word Inflection Library
This Javascript library ensures correct inflection of Turkish words and inflections.

It is not always possible to create texts that comply with grammatical rules, since the format of inflectional suffixes for words dynamically placed in text templates depends on the dynamically added word. Example:

````
Template:			"ŞEHİR_ADI'daki Restoranlar"
 - İstanbul:		"İstanbul'daki Restoranlar"
 - Edirne:			"Edirne'daki Restoranlar"

Template:			"MEYVE_ADIyı Sepete Ekle"
 - Elma:			"Elmayı Sepete Ekle"
 - Muz:				"Muzyı Sepete Ekle"
````

By using this library, inflectional suffixes can be added in accordance with the grammar. Example:

````js
// Single word inflection
inflect("Elma", "i")			// Elmayı

// Text inflection
inflect("Muz--i Sepete Ekle")		// Muzu Sepete Ekle

// Interpolation and inflection
let template = "{{meyve}}--i Sepete Ekle";
inflect(template, {meyve : "Çilek"})	// Çileği Sepete Ekle
````

# Usage
Inflection is done with the `inflect()` function. Words can be inflected for `-i`, `-e`, `-de`, `-den` noun suffixes, possessive suffix `-in`, plural suffix `-ler`, question suffix `mi` and conjunction `de`.

## Installation and Import
Install the package with npm or another package manager:

    npm i @erkanarslan/turkish-inflection

Import the `inflect()` function into the code:

````js
import { inflect } from '@erkanarslan/turkish-inflection';
inflect("Okul", "e");

// or

const inflection = require('@erkanarslan/turkish-inflection');
inflection.inflect("Okul", "e");
````

## 1. Single Word Inflection
When the `inflect(word, suffix)` function is given a word as the first parameter and a suffix as the second parameter, the inflected word is returned. Examples:

````js
let result;
result = inflect("Muz", "i");		// Muzu
result = inflect("uçak", "de");		// uçakta
result = inflect("kitap", "ler");	// kitaplar

````

## 2. Text Inflection
By simply giving a text parameter to the `inflect(text)` function, you can inject long texts containing one or more inflectional words instead of a single word. In this case, the places where the inflectional suffix will be added should be marked with the `--SUFFIX` format. You can use any of the suffixes listed under **Usage** as 'suffix'.

If words are inserted into text templates in your application by another library or function (such as a translation/i18n library), you can use this method to inflect the text after that library.

Examples:


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

## 3. Interpolation and Inflextion
You can have the parts marked with `{{VALUE_NAME}}` inside the text templates to be filled (interpolated) and then inflected. For this, you can call the `inflect(text, object)` function by giving the first parameter a text and the second parameter an object containing values. Examples:

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

# Supported Features
## Chaining
Words can be inflected by putting suffixes one after the other. Example:

````js
// Yeni ayakkabıları da görmek ister misiniz?
inflect("Yeni {{product}}--ler--i --de görmek ister misiniz?", {product : "ayakkabı"});
````

## Number Inflection
Suffixes after numbers are inflected by the pronunciation of the number. Examples:

````js
// Sabah 9'dan akşam 6.50'ye kadar açığız.
inflect("Sabah {{start}}'--den akşam {{end}}'--e kadar açığız.", {start : "9", end : "6.50"});

// 1960'tan önce doğanlar
inflect("{{year}}'--den önce doğanlar", {year : 1960});
````

## Uppercase Letter Support
If the suffix is written in uppercase letters, the output will also be in uppercase letters. Example:

````js
// FENERBAHÇE'NİN MAÇLARI
inflect("{{team}}'--İN MAÇLARI", {team : "FENERBAHÇE"});
````

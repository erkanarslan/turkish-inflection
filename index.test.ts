import { inflect, addLenitionExceptions } from "./index";

test('i-type vowel harmony', () => {
	let list = [
		["domates", "domatesi"],
		["incir", "inciri"],
		["ananas", "ananası"],
		["tarçın", "tarçını"],
		["maydanoz", "maydanozu"],
		["armut", "armutu"],
		["söz", "sözü"],
		["üzüm", "üzümü"]
	];

	for(let [source, target] of list) {
		let result = inflect(source, "i");
		expect(result).toBe(target);
	}
})

test('i-type vowel harmony for numbers', () => {
	let list = [
		["21", "21'i"],
		["13", "13'ü"],
		["2014", "2014'ü"],
		["5", "5'i"],
		["99", "99'u"],
		["10", "10'u"],
		["30", "30'u"],
		["40", "40'ı"],
		["60", "60'ı"],
		["70", "70'i"],
		["80", "80'i"],
		["90", "90'ı"],
		["100", "100'ü"],
		["1000", "1000'i"]
	];

	for(let [source, target] of list) {
		let result = inflect(source + "'", "i");
		expect(result).toBe(target);
	}
})

test('e-type vowel harmony', () => {
	let list = [
		["domates", "domatese"],
		["incir", "incire"],
		["ananas", "ananasa"],
		["tarçın", "tarçına"],
		["maydanoz", "maydanoza"],
		["armut", "armuta"],
		["söz", "söze"],
		["üzüm", "üzüme"]
	];

	for(let [source, target] of list) {
		let result = inflect(source, "e");
		expect(result).toBe(target);
	}
})

test('e-type vowel harmony for numbers', () => {
	let list = [
		["21", "21'e"],
		["13", "13'e"],
		["2014", "2014'e"],
		["5", "5'e"],
		["99", "99'a"],
		["10", "10'a"],
		["30", "30'a"],
		["40", "40'a"],
		["70", "70'e"],
		["80", "80'e"],
		["90", "90'a"],
		["100", "100'e"],
		["1000", "1000'e"]
	];

	for(let [source, target] of list) {
		let result = inflect(source + "'", "e");
		expect(result).toBe(target);
	}
})

test('should inflect words in a text if suffix markup is used', () => {
	let list = [
		["Merhaba dünya!", "Merhaba dünya!"],
		["Ay--e ve güneş--e merhaba!", "Aya ve güneşe merhaba!"],
		["Erkan'--e --de merhaba!", "Erkan'a da merhaba!"],
		["Erkan'--den orman--ler--deki ağaç--ler--e --de merhaba!", "Erkan'dan ormanlardaki ağaçlara da merhaba!"],
	];

	for(let [source, target] of list) {
		let result = inflect(source);
		expect(result).toBe(target);
	}
})

test('suffix markup with numbers', () => {
	let list = [
		["%10'--den %50'--e varan indirimler!", "%10'dan %50'ye varan indirimler!"],
		["63'--i 7'--e bölünce 9 elde edilir", "63'ü 7'ye bölünce 9 elde edilir"]
	];

	for(let [source, target] of list) {
		let result = inflect(source);
		expect(result).toBe(target);
	}
})

test('consonant lenition', () => {
	let list = [
		["yurt--i", "yurdu"],
		["kanat--i", "kanadı"],
		["bilek--i", "bileği"],
		["ağaç--e", "ağaca"],
		["biyoloji kitap--i", "biyoloji kitabı"],
		["renk--i", "rengi"],
		["devlet--in", "devletin"],
		["hukuk--e", "hukuka"],
		["ok--i", "oku"],
		["Ali at--e bak", "Ali ata bak"],
		["Ahmet'--in", "Ahmet'in"],
		["Zonguldak'--e", "Zonguldak'a"]
	];

	for(let [source, target] of list) {
		let result = inflect(source);
		expect(result).toBe(target);
	}
})

test('adding exceptions for lenition', () => {
	expect(inflect('uçak', 'e')).toBe('uçağa');
	expect(inflect('tek', 'i')).toBe('teki');

	addLenitionExceptions('uçak', 'tek');

	expect(inflect('uçak', 'e')).toBe('uçaka');
	expect(inflect('tek', 'i')).toBe('teği');
})

test('fortitive assimilation', () => {
	let list = [
		['market--de', 'markette'],
		['kasap--den', 'kasaptan'],
		["Zonguldak'--de", "Zonguldak'ta"],
		["Ahmet --de geldi", "Ahmet de geldi"],
		["1960'--den", "1960'tan"]
	];

	for(let [source, target] of list) {
		let result = inflect(source);
		expect(result).toBe(target);
	}
})

test('fortitive assimilation for numbers', () => {
	let list = [
		["0'--den", "0'dan"],
		["13'--den", "13'ten"],
		["24'--de", "24'te"],
		["24 --de", "24 de"],
		["5'--de 1", "5'te 1"],
		["140'--de", "140'ta"],
		["32,560'--den", "32,560'tan"]
	];

	for(let [source, target] of list) {
		let result = inflect(source);
		expect(result).toBe(target);
	}
})

test('adding buffer letters', () => {
	let list = [
		['kapı--e', 'kapıya'],
		['araba--i', 'arabayı'],
		["Antalya'--e", "Antalya'ya"],
		["Niğde'--in", "Niğde'nin"],
		["İzmir'--in", "İzmir'in"]
	];

	for(let [source, target] of list) {
		let result = inflect(source);
		expect(result).toBe(target);
	}
})

test('adding buffer letters for numbers', () => {
	let list = [
		["12'--e", "12'ye"],
		["26'--i", "26'yı"],
		["250'--e", "250'ye"]
	];

	for(let [source, target] of list) {
		let result = inflect(source);
		expect(result).toBe(target);
	}
})

test('suffix case match', () => {
	let list = [
		['DOMATES--İ', 'DOMATESİ'],
		['AY--A', 'AYA'],
		["AĞAÇ--İN", "AĞACIN"],
		["MUSTAFA --Mİ?", "MUSTAFA MI?"],
		["MARTI--E", "MARTIYA"],
		["DURAK--E", "DURAĞA"],
		["7'--DEN 70'--E", "7'DEN 70'E"]
	];

	for(let [source, target] of list) {
		let result = inflect(source);
		expect(result).toBe(target);
	}
})


test('inflect and interpolate', () => {
	let template = "{{person}}'--ın {{year}}'--de {{start}}--den {{destination}}--a yolculuğu {{people}}--ler--in --de {{person}}'--a ve uzaya ilgisini artırdı.";
	let dictionary : {[key : string] : string} = {
		person : "Neil Armstrong",
		year : "1969",
		start : "dünya",
		destination : "ay",
		people : "Amerikalı"
	};
	let text = inflect(template, dictionary);

	expect(text).toBe("Neil Armstrong'un 1969'da dünyadan aya yolculuğu Amerikalıların da Neil Armstrong'a ve uzaya ilgisini artırdı.");
})

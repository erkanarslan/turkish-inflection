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

test('real life template example', () => {
	let template = "{{user}}'--dan {{location}}--ler--deki {{object}}--ler--e --de --mi merhaba acaba?";
	let dictionary : {[key : string] : string} = {
		user : "Mustafa",
		location : "galaksi",
		object : "yıldız"
	};
	for(let key in dictionary) {
		let value = dictionary[key];
		template = template.replace(new RegExp("{{" + key + "}}"), value);
	}
	let text = inflect(template);

	expect(text).toBe("Mustafa'dan galaksilerdeki yıldızlara da mı merhaba acaba?");
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

// sertleşme

// araya harf girmesi: banka + a = bankaya

// Case uyumu: BANKA + a = BANKAYA

// ayrı yazılan da de

// ünlü düşmesi
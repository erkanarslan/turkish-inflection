import { lenitionExceptions } from "./data";
export { addLenitionExceptions } from "./data";

const suffixes = ['e', 'in', 'i', 'den', 'de', 'ler', 'mi'] as const;
const vowels = ['a', 'e', 'ı', 'i', 'o', 'ö', 'u', 'ü'] as const;
const nonContinuantFortisConsonants = ['p', 'ç', 't', 'k'];
const fortisConsonants = ['p', 'ç', 't', 'k', 'f', 'h', 's', 'ş'];

const transformMap = {
	i : {a : 'ı', e : 'i', ı : 'ı', i : 'i', o : 'u', ö : 'ü', u : 'u', ü : 'ü'},
	e : {a : 'a', e : 'e', ı : 'a', i : 'e', o : 'a', ö : 'e', u : 'a', ü : 'e'},
};
const lenitionMap : Dict = {
	p : 'b', ç : 'c', t : 'd', k : 'ğ', k2 : 'g',
	P : "B", Ç : 'C', T : 'D', K : 'Ğ', K2 : 'G'
};

const alternatives = suffixes.map(s => s.replace('e', 'a').replace('i', 'ı'))
	.concat(['İN', 'İ', 'Mİ']) as unknown as typeof suffixes;

const markupPattern = new RegExp("--(" + suffixes.concat(alternatives).join("|") + ")", 'i');
const vowelPattern = new RegExp(vowels.join("|"), 'gi');
const wordPattern = /(?:[a-z]|[A-Z]|ç|Ç|ğ|Ğ|ı|İ|ö|Ö|ş|Ş|ü|Ü)+/;
const numberPattern = /\d+/;

export function inflect(text : string, interpolation : Dict) : string;
export function inflect(text : string, suffix : string) : string;
export function inflect(text : string) : string;
export function inflect(text : string, option? : string | Dict) : string {
	if(typeof option == 'string') {
		return inflectWord(text, option);
	}
	else {
		return inflectText(text, option);
	}
}

export function inflectText(text : string, interpolation? : Dict) : string {
	let match : RegExpMatchArray|null;

	if(interpolation) {
		for(let key in interpolation) {
			let value = interpolation[key];
			const marker = "{{" + key + "}}";
			while(text.includes(marker)) {
				text = text.replace(marker, value);
			}
		}
	}

	while(true) {
		match = text.match(markupPattern);
		if(!match) break;
		if(!match.index) continue;

		let index = match.index, suffix = match[1];
		let [firstPart, word] = splitLastWord(text.slice(0, index));

		text = firstPart + inflectWord(word, suffix) + text.slice(index + suffix.length + 2);
	}

	return text;
}

export function inflectWord(word : string, suffix : string) : string {
	const upperCase = isUpperCase(suffix);
	const normalizedSuffix = normalizeSuffix(suffix);
	const normalizedWord = normalizeWord(word);

	// Transform suffix
	const suffixType = getSuffixType(normalizedSuffix);
	const lastVowel = getLastVowel(normalizedWord);
	const suffixVowel = transformMap[suffixType][lastVowel];
	suffix = normalizedSuffix.replace(suffixType, suffixVowel);

	// Fortitive assimilation (Ex: market + de -> markette)
	suffix = applyFortitiveAssimilation(normalizedWord, suffix);
	suffix = addBufferLetter(normalizedWord, suffix, normalizedSuffix);

	// Transform word
	// Consonant lenition (Ex: bıçak + ı -> bıçağı)
	word = applyLenition(word, normalizedSuffix);

	if(upperCase) {
		suffix = toUpperCase(suffix);
	}

	return word + suffix;
}

/**
 * Checks and transforms suffix for fortitive assimilation.
 *
 * Ex: market + de -> markette
 *
 * @param word
 * @param suffix
 * @returns Transformed suffix
 */
function applyFortitiveAssimilation(word : string, suffix : string) : string {
	const lastLetter = word[word.length-1];
	const suffixIsASeparateWord = lastLetter == ' ';
	if(suffix.startsWith('d') && !suffixIsASeparateWord && wordEndsWith(fortisConsonants, word)) {
		// Convert first letter from 'd' to 't'
		return suffix.replace('d', 't');
	}

	return suffix;
}

/**
 * Checks and transforms word for consonant lenition.
 *
 * Ex: bıçak + ı -> bıçağı
 *
 * @param word
 * @param suffix
 * @returns Transformed word
 */
function applyLenition(word : string, suffix : string) : string {
	const lastLetter = word[word.length-1];

	if(startsWithVowel(suffix) && isNonContinuantFortisConsonant(lastLetter)) {
		let vowelCount = (word.match(vowelPattern) || []).length;
		let last = word[word.length-1], previous = word[word.length - 2];

		/* When to apply lenition?
		* - If word has 2+ syllables, lenition is applied.
		* - If word has only 1 syllable, lenition is NOT applied.
		* - There are exceptions to both rules.
		*/
		let shouldApplyLenition = vowelCount == 1 && lenitionExceptions.includes(word) || vowelCount > 1 && !lenitionExceptions.includes(word);

		if(shouldApplyLenition) {
			// If last letter is 'k' and previous letter is a consonant, 'k' becomes 'g' instead of 'ğ'.
			if(isConsonant(previous)) {
				if(last == 'k') last = 'k2';
				if(last == 'K') last = 'K2';
			}
			let newLetter = lenitionMap[last];
			return word.slice(0, word.length - 1) + newLetter;
		}
	}

	return word;
}

/**
 * Checks and adds buffer letter to suffix if needed.
 *
 * Ex: araba + a -> arabaya
 * Ex: araba + ın -> arabanın
 *
 * @param word
 * @param suffix
 * @returns Transformed suffix
 */
function addBufferLetter(word : string, suffix : string, normalizedSuffix : string) : string {
	const _vowels = vowels as unknown as string[]
	if(startsWithVowel(normalizedSuffix) && wordEndsWith(_vowels, word)) {
		if(normalizedSuffix == 'i' || normalizedSuffix == 'e') {
			return 'y' + suffix;
		}
		else {
			return 'n' + suffix;
		}
	}

	return suffix;
}

function getLastVowel(word : string) : Vowel {
	for(let i = word.length - 1; i >= 0; i--) {
		if(vowels.includes(word[i] as Vowel)) {
			return word[i] as Vowel;
		}
	}

	/* If word has no vowel, we can read the letters by putting an "e" to their end.
	 * Ex: "PTT" reads "petete"
	 */
	return "e";
}

function normalizeWord(word : string) : string {
	// If word is numeric, convert the number to text and use it to get vowel
	if(isWordNumeric(word)) {
		let num = getNumberFromWord(word);
		let lastPart = word.slice(word.lastIndexOf(num) + num.length);
		word = getLastWordOfNumber(num) + lastPart;
	}
	else {
		word = word.replace('İ', 'i').replace('I', 'ı').toLowerCase();
	}

	return word;
}

function isWordNumeric(word : string) : boolean {
	let isNumeric = false;
	for(let i = word.length - 1; i >= 0; i--) {
		let letter = word[i];
		if(wordPattern.test(letter)) {
			break;
		}
		else if(numberPattern.test(letter)) {
			isNumeric = true;
			break;
		}
	}
	return isNumeric;
}

function getNumberFromWord(word : string) : string {
	word = word.split("").reverse().join("");
	let match = word.match(numberPattern) as RegExpMatchArray;
	return match[0].split("").reverse().join("");
}

function getLastWordOfNumber(num : string) : string {
	// TODO Add million, billion, etc.
	if(num.length > 3 && num.endsWith("000")) return "bin";
	if(num.length > 2 && num.endsWith("00")) return "yüz";
	if(num.endsWith("90")) return "doksan";
	if(num.endsWith("80")) return "seksen";
	if(num.endsWith("70")) return "yetmiş";
	if(num.endsWith("60")) return "altmış";
	if(num.endsWith("50")) return "elli";
	if(num.endsWith("40")) return "kırk";
	if(num.endsWith("30")) return "otuz";
	if(num.endsWith("20")) return "yirmi";
	if(num.endsWith("10")) return "on";
	if(num.endsWith("9")) return "dokuz";
	if(num.endsWith("8")) return "sekiz";
	if(num.endsWith("7")) return "yedi";
	if(num.endsWith("6")) return "altı";
	if(num.endsWith("5")) return "beş";
	if(num.endsWith("4")) return "dört";
	if(num.endsWith("3")) return "üç";
	if(num.endsWith("2")) return "iki";
	if(num.endsWith("1")) return "bir";
	return "sıfır";
}

function normalizeSuffix(suffix : string) : Suffix {
	return suffix.replace('İ', 'i')
		.toLowerCase()
		.replace("a", "e")
		.replace("ı", "i") as Suffix;
}

function getSuffixType(suffix : string) : 'e' | 'i' {
	return suffix.includes('i') ? 'i' : 'e';
}

function startsWithVowel(text : string) : boolean {
	return vowels.includes(text[0] as any);
}

function isNonContinuantFortisConsonant(letter : string) : boolean {
	return nonContinuantFortisConsonants.includes(letter.toLowerCase());
}

function isConsonant(letter : string) : boolean {
	return !isVowel(letter);
}

function isVowel(letter : string) : boolean {
	return vowels.includes(letter.toLowerCase() as any);
}

function isUpperCase(suffix : string) : boolean {
	return /A|E|I|İ/.test(suffix);
}

function splitLastWord(text : string) : [string, string] {
	let i : number;
	for(i = text.length - 2; i >= 0; i--) {
		if(!wordPattern.test(text[i]) && !numberPattern.test(text[i])) {
			break;
		}
	}

	if(i < 0) {
		i = 0;
	}

	return [text.slice(0, i), text.slice(i)];
}

function wordEndsWith(letters : string[], word : string) : boolean {
	// Get last word character
	let lastWordChar = '';

	for(let i = word.length - 1; i >= 0; i--) {
		if(wordPattern.test(word[i])) {
			lastWordChar = word[i];
			break;
		}
	}

	return letters.includes(lastWordChar.toLowerCase());
}

function toUpperCase(word : string) : string {
	return word.replace('i', 'İ').toUpperCase();
}

type Vowel = typeof vowels[number];
type Suffix = typeof suffixes[number];
type Dict = {[key : string] : string};
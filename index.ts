import { lenitionExceptions } from "./data";
export { addLenitionExceptions } from "./data";

const suffixes = ['e', 'in', 'i', 'den', 'de', 'ler', 'mi'] as const;
const vowels = ['a', 'e', 'ı', 'i', 'o', 'ö', 'u', 'ü'] as const;
const nonContinuantFortisConsonants = ['p', 'ç', 't', 'k'];

const transformMap = {
	i : {a : 'ı', e : 'i', ı : 'ı', i : 'i', o : 'u', ö : 'ü', u : 'u', ü : 'ü'},
	e : {a : 'a', e : 'e', ı : 'a', i : 'e', o : 'a', ö : 'e', u : 'a', ü : 'e'},
};
const lenitionMap : Dict = {p : 'b', ç : 'c', t : 'd', k : 'ğ'};

const alternatives = suffixes.map(s => s.replace('e', 'a').replace('i', 'ı')) as unknown as typeof suffixes;
const markupPattern = new RegExp("--(" + suffixes.concat(alternatives).join("|") + ")");
const vowelPattern = new RegExp(vowels.join("|"), 'g');

export function inflect(text : string, suffix? : string) : string {
	if(suffix) {
		return inflectWord(text, suffix);
	}
	else {
		return inflectText(text);
	}
}

export function inflectText(text : string) : string {
	let match : RegExpMatchArray|null;

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
	// Transform suffix
	suffix = normalizeSuffix(suffix);
	const suffixType = getSuffixType(suffix);
	const lastVowel = getLastVowel(word);
	const suffixVowel = transformMap[suffixType][lastVowel];
	const transformedSuffix = suffix.replace(suffixType, suffixVowel);

	// Transform word
	// Consonant lenition (Ex: bıçak -> bıçağı)
	const lastLetter = word[word.length-1];
	if(startsWithVowel(suffix) && isNonContinuantFortisConsonant(lastLetter)) {
		word = applyLenition(word);
	}

	return word + transformedSuffix;
}

function applyLenition(word : string) : string {
	let vowelCount = (word.match(vowelPattern) || []).length;
	const last = word[word.length-1], previous = word[word.length - 2];

	/* When to apply lenition?
	 * - If word has 2+ syllables, lenition is applied.
	 * - If word has only 1 syllable, lenition is NOT applied.
	 * - There are exceptions to both rules.
	 */
	let shouldApplyLenition = vowelCount == 1 && lenitionExceptions.includes(word) || vowelCount > 1 && !lenitionExceptions.includes(word);

	if(shouldApplyLenition) {
		// If last letter is 'k' and previous letter is a consonant, 'k' becomes 'g' instead of 'ğ'.
		let newLetter = last == 'k' && isConsonant(previous) ? 'g' : lenitionMap[last];
		return word.slice(0, word.length - 1) + newLetter;
	}
	else {
		return word;
	}
}

function getLastVowel(word : string) : Vowel {
	word = word.replace('İ', 'i').toLowerCase();
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

function normalizeSuffix(suffix : string) : Suffix {
	return suffix.replace("a", "e").replace("ı", "i") as Suffix;
}

function getSuffixType(suffix : string) : 'e' | 'i' {
	return suffix.includes('i') ? 'i' : 'e';
}

function startsWithVowel(text : string) : boolean {
	return ['e', 'i'].includes(text[0]);
}

function isNonContinuantFortisConsonant(letter : string) : boolean {
	return nonContinuantFortisConsonants.includes(letter);
}

function isConsonant(letter : string) : boolean {
	return !isVowel(letter);
}

function isVowel(letter : string) : boolean {
	return vowels.includes(letter as any);
}

function splitLastWord(text : string) : [string, string] {
	let i : number;
	for(i = text.length - 2; i >= 0; i--) {
		/* We need to find the position of last non-word letter in the text.
		 * RegExp can be used to find word boundaries. However, Turkish-only
		 * characters aren't recognized as word letters by regex. This is a
		 * simple method that will work for 99%+ of the given texts.
		 */
		if(text.charCodeAt(i) < 65) {
			break;
		}
	}

	if(i < 0) {
		i = 0;
	}

	return [text.slice(0, i), text.slice(i)];
}

type Vowel = typeof vowels[number];
type Suffix = typeof suffixes[number];
type Dict = {[key : string] : string};
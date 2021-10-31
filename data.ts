// All examples must be in lower case for all lists
export const lenitionExceptions = [
	"anıt",
	"armut",
	"bulut",
	"kanıt",
	"ölçüt",
	"ahlak",
	"cumhuriyet",
	"devlet",
	"millet",
	"evrak",
	"hukuk",
	"ittifak",
	"paket",
	"sepet",
	"şefkat",
	"tank",
	"taşıt",
	"anlat",
	"yanıt",
	"but",
	"dip",
	"gök",
	"kap",
	"kurt",
	"uç",
	"yurt",
	"renk"
];

export function addLenitionExceptions(...words : string []) : void {
	lenitionExceptions.push(...words);
}

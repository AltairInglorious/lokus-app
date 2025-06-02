import type { BasicDictionary } from "@amadeustech/lokus";

export function clearLokusDictionaries(
	dictionaries: Record<string, Partial<BasicDictionary>>,
) {
	const ret: Record<string, Partial<BasicDictionary>> = {};
	for (const lang in dictionaries) {
		ret[lang] = clearPartialLokusDictionary(dictionaries[lang]);
	}
	return ret;
}

export function clearPartialLokusDictionary(
	dictionary: Partial<BasicDictionary>,
): Partial<BasicDictionary> {
	const ret: Partial<BasicDictionary> = {};
	for (const key in dictionary) {
		const val = dictionary[key];
		if (!val || !val.length) continue;
		ret[key] = val;
	}
	return ret;
}

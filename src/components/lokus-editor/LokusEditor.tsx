import type { LokusDictionaryType } from "@/lokus/config";
import type { LokusDictionaryFile } from "@amadeustech/lokus";
import { useState } from "react";
import LokusEditorBase from "./LokusEditorBase";
import LokusEditorTranslation from "./LokusEditorTranslation";
import LokusFileInfo from "./LokusFileInfo";

type Props = {
	fileName: string;
	lokusDictionary: LokusDictionaryFile;
	dictionary: LokusDictionaryType;
};

export default function LokusEditor({
	fileName,
	lokusDictionary,
	dictionary,
}: Props) {
	const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
	const [newTranslation, setNewTranslation] = useState(
		lokusDictionary.dictionaries,
	);

	function selectLanguage(lang: string | null) {
		if (lang === selectedLanguage) {
			setSelectedLanguage(null);
		} else {
			setSelectedLanguage(lang);
		}
	}

	return (
		<section className="space-y-2">
			<LokusFileInfo
				dictionary={dictionary}
				lokusDictionary={lokusDictionary}
				selectedLanguage={selectedLanguage}
				selectLanguage={selectLanguage}
			/>
			{selectedLanguage &&
				(selectedLanguage === lokusDictionary.baseLanguage ? (
					<LokusEditorBase
						lokusDictionary={lokusDictionary}
						fileName={fileName}
						selectLanguage={selectLanguage}
						dictionary={dictionary}
					/>
				) : (
					<LokusEditorTranslation
						lokusDictionary={lokusDictionary}
						selectedLanguage={selectedLanguage}
						newTranslation={newTranslation}
						setNewTranslation={setNewTranslation}
						fileName={fileName}
						selectLanguage={selectLanguage}
						dictionary={dictionary}
					/>
				))}
		</section>
	);
}

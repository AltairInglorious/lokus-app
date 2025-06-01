import type { LokusDictionaryType } from "@/lokus/config";
import type { LokusDictionaryFile } from "@amadeustech/lokus";
import { useState } from "react";
import NumberCircle from "../NumberCircle";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import LokusEditorBase from "./LokusEditorBase";
import LokusEditorTranslation from "./LokusEditorTranslation";

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
			<div className="border rounded p-2">
				{dictionary["editor.base-language"]}: {lokusDictionary.baseLanguage}{" "}
				<br />
				{dictionary["editor.last-change"]}:{" "}
				{new Date(lokusDictionary.timestamp).toLocaleString()} <br />
			</div>
			{!selectedLanguage && (
				<div className="flex items-center gap-2">
					<NumberCircle>2</NumberCircle>
					<Label>{dictionary["editor.select-language"]}</Label>
					<ul className="flex flex-wrap gap-2">
						<li>
							<Button
								variant={
									selectedLanguage === lokusDictionary.baseLanguage
										? "default"
										: "secondary"
								}
								type="button"
								onClick={() => {
									selectLanguage(lokusDictionary.baseLanguage);
								}}
							>
								{dictionary["editor.base-language"]} (
								{lokusDictionary.baseLanguage})
							</Button>
						</li>
						{Object.keys(lokusDictionary.dictionaries).map((lang) => (
							<li key={lang}>
								<Button
									variant={selectedLanguage === lang ? "default" : "secondary"}
									type="button"
									onClick={() => {
										selectLanguage(lang);
									}}
								>
									{lang}
								</Button>
							</li>
						))}
					</ul>
				</div>
			)}
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

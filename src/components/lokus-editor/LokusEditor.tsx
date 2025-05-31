import type { LokusDictionaryFile } from "lokus";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { ArrowDownToLine } from "lucide-react";
import NumberCircle from "../NumberCircle";
import { Label } from "../ui/label";
import LokusEditorTranslation from "./LokusEditorTranslation";

type Props = {
	fileName: string;
	lokusDictionary: LokusDictionaryFile;
};

export default function LokusEditor({ fileName, lokusDictionary }: Props) {
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
				Base language: {lokusDictionary.baseLanguage} <br />
				Timestamp: {new Date(lokusDictionary.timestamp).toLocaleString()} <br />
			</div>
			<div className="flex items-center gap-2">
				<NumberCircle>2</NumberCircle>
				<Label>Select language to translate</Label>
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
							Base ({lokusDictionary.baseLanguage})
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
			{selectedLanguage &&
				(selectedLanguage === lokusDictionary.baseLanguage ? null : (
					<LokusEditorTranslation
						lokusDictionary={lokusDictionary}
						selectedLanguage={selectedLanguage}
						newTranslation={newTranslation}
						setNewTranslation={setNewTranslation}
						fileName={fileName}
					/>
				))}
		</section>
	);
}

import type { LokusDictionaryType } from "@/lokus/config";
import type { LokusDictionaryFile } from "@amadeustech/lokus";
import NumberCircle from "../NumberCircle";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

type Props = {
	lokusDictionary: LokusDictionaryFile;
	dictionary: LokusDictionaryType;
	selectedLanguage?: string | null;
	selectLanguage(lang: string | null): void;
};

export default function LokusFileInfo({
	lokusDictionary,
	dictionary,
	selectedLanguage,
	selectLanguage,
}: Props) {
	return (
		<>
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
		</>
	);
}

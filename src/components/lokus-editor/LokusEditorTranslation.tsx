import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";
import { Input } from "../ui/input";
import { ArrowDownToLine, SaveIcon } from "lucide-react";
import type { BasicDictionary, LokusDictionaryFile } from "lokus";
import { useMemo, type Dispatch, type SetStateAction } from "react";
import { Label } from "../ui/label";
import NumberCircle from "../NumberCircle";
import { Button } from "../ui/button";

type Props = {
	selectedLanguage: string;
	lokusDictionary: LokusDictionaryFile;
	newTranslation: Record<string, Partial<BasicDictionary>>;
	setNewTranslation: Dispatch<
		SetStateAction<Record<string, Partial<BasicDictionary>>>
	>;
	fileName: string;
};

export default function LokusEditorTranslation({
	selectedLanguage,
	lokusDictionary,
	newTranslation,
	setNewTranslation,
	fileName,
}: Props) {
	const wasChanged = useMemo(() => {
		for (const lang in lokusDictionary.dictionaries) {
			const originalDict = lokusDictionary.dictionaries[lang];
			const newDict = newTranslation[lang];
			const dictionaryKeys = Object.keys(lokusDictionary.base);

			for (const id of dictionaryKeys) {
				const a = originalDict[id] || "";
				const b = newDict?.[id] || "";
				if (a !== b) {
					return true;
				}
			}
		}
		return false;
	}, [newTranslation, lokusDictionary.dictionaries, lokusDictionary.base]);

	function downloadNewDictionary() {
		const newDict: LokusDictionaryFile = {
			type: "dictionary",
			baseLanguage: lokusDictionary.baseLanguage,
			base: lokusDictionary.base,
			dictionaries: newTranslation,
			timestamp: Date.now(),
		};

		const data = JSON.stringify(newDict, null, 2);
		const blob = new Blob([data], { type: "application/json" });
		const url = URL.createObjectURL(blob);

		const a = document.createElement("a");
		a.href = url;
		a.download = fileName;
		a.click();

		URL.revokeObjectURL(url);
	}

	return (
		<>
			<div className="flex items-center gap-2">
				<NumberCircle>3</NumberCircle>
				<Label>Write translations to third column</Label>
			</div>
			<div className="flex items-center gap-2">
				<NumberCircle>4</NumberCircle>
				<Button disabled={!wasChanged} onClick={downloadNewDictionary}>
					<ArrowDownToLine /> Download new dictionary
				</Button>
			</div>
			<Table className="table-fixed border">
				<TableHeader>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>Base</TableHead>
						{selectedLanguage && (
							<TableHead>Variant on {selectedLanguage}</TableHead>
						)}
					</TableRow>
				</TableHeader>
				<TableBody>
					{Object.entries(lokusDictionary.base)
						.sort((a, b) => a[0].localeCompare(b[0]))
						.map(([id, base]) => (
							<TableRow key={id}>
								<TableCell>{id}</TableCell>
								<TableCell>{base}</TableCell>
								{selectedLanguage && (
									<TableCell>
										<div className="flex items-center gap-2">
											<Input
												placeholder={base}
												value={newTranslation[selectedLanguage]?.[id] || ""}
												onChange={(e) => {
													setNewTranslation((prev) => ({
														...prev,
														[selectedLanguage]: {
															...prev[selectedLanguage],
															[id]: e.target.value,
														},
													}));
												}}
											/>
											{(lokusDictionary.dictionaries?.[selectedLanguage]?.[
												id
											] || "") !==
												(newTranslation[selectedLanguage]?.[id] || "") && (
												<SaveIcon />
											)}
										</div>
									</TableCell>
								)}
							</TableRow>
						))}
				</TableBody>
			</Table>
		</>
	);
}

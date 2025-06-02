import { clearLokusDictionaries } from "@/lib/lokus";
import type { LokusDictionaryType } from "@/lokus/config";
import type { BasicDictionary, LokusDictionaryFile } from "@amadeustech/lokus";
import {
	ArrowDownToLineIcon,
	CircleAlertIcon,
	PlusIcon,
	TrashIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import NumberCircle from "../NumberCircle";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";
import { Textarea } from "../ui/textarea";
import LokusFileInfo from "./LokusFileInfo";

type Props = {
	lokusDictionary: LokusDictionaryFile;
	fileName: string;
	selectLanguage(lang: string | null): void;
	dictionary: LokusDictionaryType;
	addLanguage(lang: string): void;
	newTranslation: Record<string, Partial<BasicDictionary>>;
};

export default function LokusEditorBase({
	lokusDictionary,
	fileName,
	selectLanguage,
	dictionary,
	addLanguage,
	newTranslation,
}: Props) {
	const [newDictionary, setNewDictionary] = useState(lokusDictionary.base);

	const [newRecordID, setNewRecordID] = useState("");
	const [newRecordValue, setNewRecordValue] = useState("");

	const newRecordIDNotUnique = useMemo(
		() => newRecordID in newDictionary,
		[newRecordID, newDictionary],
	);

	const wasChanged = useMemo(() => {
		const baseKeys = Object.keys(lokusDictionary.base).sort();
		const newDictKeys = Object.keys(newDictionary).sort();

		if (baseKeys.length !== newDictKeys.length) {
			return true;
		}

		for (let i = 0; i < baseKeys.length; i++) {
			if (baseKeys[i] !== newDictKeys[i]) {
				return true;
			}
		}
		return false;
	}, [newDictionary, lokusDictionary.base]);

	function downloadNewDictionary() {
		const newDict: LokusDictionaryFile = {
			type: "dictionary",
			baseLanguage: lokusDictionary.baseLanguage,
			base: newDictionary,
			dictionaries: clearLokusDictionaries(lokusDictionary.dictionaries),
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
			<LokusFileInfo
				dictionary={dictionary}
				lokusDictionary={lokusDictionary}
				selectedLanguage={lokusDictionary.baseLanguage}
				selectLanguage={selectLanguage}
				lockLanguage={wasChanged}
				addLanguage={addLanguage}
				languages={Object.keys(newTranslation)}
			/>
			<div className="flex items-center gap-2">
				<NumberCircle>3</NumberCircle>
				<Label>{dictionary["editor.modify-dictionary"]}</Label>
			</div>
			<div className="flex items-center gap-2">
				<NumberCircle>4</NumberCircle>
				<Button disabled={!wasChanged} onClick={downloadNewDictionary}>
					<ArrowDownToLineIcon /> {dictionary["editor.download-dictionary"]}
				</Button>
			</div>
			<div>
				<Table className="table-fixed border">
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							<TableHead>Base</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
				</Table>
				<div className="overflow-y-auto max-h-[500px]">
					<Table className="table-fixed border-x">
						<TableBody>
							{Object.entries(newDictionary)
								.sort((a, b) => a[0].localeCompare(b[0]))
								.map(([id, base]) => (
									<TableRow key={id}>
										<TableCell>{id}</TableCell>
										<TableCell className="whitespace-normal">{base}</TableCell>
										<TableCell>
											<Button
												variant="destructive"
												size="icon"
												onClick={() => {
													setNewDictionary((prev) => {
														const newDict = { ...prev };
														delete newDict[id];
														return newDict;
													});
												}}
											>
												<TrashIcon />
											</Button>
										</TableCell>
									</TableRow>
								))}
						</TableBody>
					</Table>
				</div>
				<Table className="table-fixed border">
					<TableBody>
						<TableRow>
							<TableCell>
								<Input
									type="text"
									placeholder="New record ID"
									value={newRecordID}
									onChange={(e) => {
										const newId = e.target.value.trim();
										setNewRecordID(newId);
									}}
								/>
							</TableCell>
							<TableCell>
								<Textarea
									placeholder="New record translation"
									value={newRecordValue}
									onChange={(e) => {
										setNewRecordValue(e.target.value);
									}}
								/>
							</TableCell>
							<TableCell>
								<Button
									disabled={
										!newRecordID ||
										!newRecordValue ||
										newRecordIDNotUnique ||
										newRecordID === "" ||
										newRecordValue === ""
									}
									size="icon"
									onClick={() => {
										if (newRecordID && newRecordValue) {
											setNewDictionary((prev) => ({
												...prev,
												[newRecordID]: newRecordValue,
											}));
											setNewRecordID("");
											setNewRecordValue("");
										}
									}}
								>
									<PlusIcon />
								</Button>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>

			{newRecordIDNotUnique && (
				<Alert variant="destructive">
					<CircleAlertIcon className="mr-2" />
					<AlertTitle>{dictionary["editor.duplicate-id.title"]}</AlertTitle>
					<AlertDescription>
						{dictionary["editor.duplicate-id.description"]}
					</AlertDescription>
				</Alert>
			)}
		</>
	);
}

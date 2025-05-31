import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";
import { Input } from "../ui/input";
import {
	ArrowDownToLineIcon,
	CircleAlertIcon,
	PlusIcon,
	TrashIcon,
} from "lucide-react";
import type { LokusDictionaryFile } from "@amadeustech/lokus";
import { useMemo, useState } from "react";
import { Label } from "../ui/label";
import NumberCircle from "../NumberCircle";
import { Button } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import type { LokusDictionaryType } from "@/lokus/config";

type Props = {
	lokusDictionary: LokusDictionaryFile;
	fileName: string;
	selectLanguage(lang: string | null): void;
	dictionary: LokusDictionaryType;
};

export default function LokusEditorBase({
	lokusDictionary,
	fileName,
	selectLanguage,
	dictionary,
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
			dictionaries: lokusDictionary.dictionaries,
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
				<NumberCircle>2</NumberCircle>
				<Label>{dictionary["editor.select-language"]}</Label>
				<ul className="flex flex-wrap gap-2">
					<li>
						<Button
							variant="default"
							type="button"
							onClick={() => {
								selectLanguage(lokusDictionary.baseLanguage);
							}}
						>
							{dictionary["editor.base-language"]} (
							{lokusDictionary.baseLanguage})
						</Button>
					</li>
					{!wasChanged &&
						Object.keys(lokusDictionary.dictionaries).map((lang) => (
							<li key={lang}>
								<Button
									variant="secondary"
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
			<div className="flex items-center gap-2">
				<NumberCircle>3</NumberCircle>
				<Label>{dictionary["editor.write-3"]}</Label>
			</div>
			<div className="flex items-center gap-2">
				<NumberCircle>4</NumberCircle>
				<Button disabled={!wasChanged} onClick={downloadNewDictionary}>
					<ArrowDownToLineIcon /> {dictionary["editor.download-dictionary"]}
				</Button>
			</div>
			<Table className="table-fixed border">
				<TableHeader>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>Base</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{Object.entries(newDictionary)
						.sort((a, b) => a[0].localeCompare(b[0]))
						.map(([id, base]) => (
							<TableRow key={id}>
								<TableCell>{id}</TableCell>
								<TableCell>{base}</TableCell>
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
							<Input
								type="text"
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
			{newRecordIDNotUnique && (
				<Alert variant="destructive">
					<CircleAlertIcon className="mr-2" />
					<AlertTitle>Duplicate ID</AlertTitle>
					<AlertDescription>
						The ID you entered already exists in the dictionary. Please use a
						unique ID.
					</AlertDescription>
				</Alert>
			)}
		</>
	);
}

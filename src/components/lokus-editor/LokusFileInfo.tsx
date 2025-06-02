import type { LokusDictionaryType } from "@/lokus/config";
import type { LokusDictionaryFile } from "@amadeustech/lokus";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import NumberCircle from "../NumberCircle";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import {} from "../ui/card";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type Props = {
	lokusDictionary: LokusDictionaryFile;
	dictionary: LokusDictionaryType;
	selectedLanguage?: string | null;
	selectLanguage(lang: string | null): void;
	addLanguage(lang: string): void;
	lockLanguage?: boolean;
	languages?: string[];
};

export default function LokusFileInfo({
	lokusDictionary,
	dictionary,
	selectedLanguage,
	selectLanguage,
	addLanguage,
	lockLanguage = false,
	languages = Object.keys(lokusDictionary.dictionaries),
}: Props) {
	const [newLanguage, setNewLanguage] = useState("");
	const [openDialog, setOpenDialog] = useState(false);
	const [error, setError] = useState<string | null>(null);

	function handleAddLanguage() {
		if (
			newLanguage &&
			!Object.keys(lokusDictionary.dictionaries).includes(newLanguage)
		) {
			addLanguage(newLanguage);
			setNewLanguage("");
			setOpenDialog(false);
			setError(null);
		} else {
			setError("Language already exists or is invalid.");
		}
	}

	return (
		<>
			<div className="border rounded p-2">
				{dictionary["editor.base-language"]}: {lokusDictionary.baseLanguage}{" "}
				<br />
				{dictionary["editor.last-change"]}:{" "}
				{new Date(lokusDictionary.timestamp).toLocaleString()} <br />
			</div>
			<div className="flex items-center gap-2">
				<NumberCircle>2</NumberCircle>
				<Label>{dictionary["editor.select-language"]}</Label>
				<ul className="flex flex-wrap gap-2">
					{!(
						lockLanguage && selectedLanguage !== lokusDictionary.baseLanguage
					) && (
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
					)}
					{!(
						lockLanguage && selectedLanguage === lokusDictionary.baseLanguage
					) &&
						languages.map((lang) => (
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
					{!(
						lockLanguage && selectedLanguage === lokusDictionary.baseLanguage
					) && (
						<li>
							<Dialog open={openDialog} onOpenChange={setOpenDialog}>
								<DialogTrigger asChild>
									<Button size="icon" variant="secondary">
										<PlusIcon />
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Add new language</DialogTitle>
									</DialogHeader>
									<Input
										placeholder="Language code"
										value={newLanguage}
										onChange={(e) => {
											setNewLanguage(e.target.value);
										}}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												handleAddLanguage();
												e.preventDefault();
											}
										}}
									/>
									{error && (
										<Alert variant="destructive">
											<AlertTitle>Error adding language</AlertTitle>
											<AlertDescription>{error}</AlertDescription>
										</Alert>
									)}
									<DialogFooter>
										<Button
											className="w-full"
											type="button"
											onClick={() => {
												handleAddLanguage();
											}}
										>
											Add Language
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</li>
					)}
				</ul>
			</div>
		</>
	);
}

import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import {
	LokusDictionarySchema,
	type LokusDictionaryFile,
} from "@amadeustech/lokus";
import LokusEditor from "./lokus-editor/LokusEditor";
import NumberCircle from "./NumberCircle";
import type { LokusDictionaryType } from "@/lokus/config";

type Props = {
	dictionary: LokusDictionaryType;
};

export default function FileView({ dictionary }: Props) {
	const [fileName, setFileName] = useState<string | null>(null);
	const [data, setData] = useState<LokusDictionaryFile | null>(null);
	const [error, setError] = useState<string | null>(null);

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<NumberCircle>1</NumberCircle>
				<Label className="grow">
					Load a lokus file
					<Input
						type="file"
						accept=".lokus"
						onChange={(e) => {
							setError(null);
							setData(null);
							const file = e.target.files?.[0];
							if (!file) return;
							setFileName(file.name);
							const reader = new FileReader();
							reader.onload = (event) => {
								try {
									const content = event.target?.result as string;
									const parsedData = JSON.parse(content);
									const data = LokusDictionarySchema.parse(parsedData);
									setData(data);
								} catch (e) {
									console.error("Error parsing file:", e);
									setData(null);
									setError(dictionary["editor.invalid-file-message"]);
								}
							};
							reader.readAsText(file);
						}}
					/>
				</Label>
			</div>
			{error && (
				<Alert variant="destructive">
					<AlertTitle>{dictionary["editor.invalid-file"]}</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}
			{fileName && data && (
				<LokusEditor
					fileName={fileName}
					lokusDictionary={data}
					dictionary={dictionary}
				/>
			)}
		</div>
	);
}

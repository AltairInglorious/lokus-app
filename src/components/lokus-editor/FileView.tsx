import { useState } from "react";
import {
	LokusDictionarySchema,
	type LokusDictionaryFile,
} from "@amadeustech/lokus";
import LokusEditor from "./LokusEditor";
import type { LokusDictionaryType } from "@/lokus/config";
import NumberCircle from "@/components/NumberCircle";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

type Props = {
	dictionary: LokusDictionaryType;
};

export default function FileView({ dictionary }: Props) {
	const [fileName, setFileName] = useState<string | null>(null);
	const [data, setData] = useState<LokusDictionaryFile | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<NumberCircle>1</NumberCircle>
				{loading ? (
					<div className="w-6 h-6 rounded-full border-t border-black animate-spin" />
				) : data ? (
					<span>
						✅ {dictionary["editor.loaded"]} {fileName}
					</span>
				) : (
					<Label className="grow">
						{dictionary["editor.load-lokus-file"]}
						<Input
							type="file"
							accept=".lokus"
							onChange={(e) => {
								setLoading(true);
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
									} finally {
										setLoading(false);
									}
								};
								reader.readAsText(file);
							}}
						/>
					</Label>
				)}
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

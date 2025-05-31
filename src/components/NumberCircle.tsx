import type { PropsWithChildren } from "react";

export default function NumberCircle({ children }: PropsWithChildren) {
	return (
		<div className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white">
			{children}
		</div>
	);
}

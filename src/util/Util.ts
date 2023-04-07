import crypto from "crypto";
import _ from "lodash";

export const GenerateRandomToken = (): string => {
	return crypto.randomBytes(16).toString("hex");
};

export function hasOnly<T extends Object>(
	obj: T | Record<string, any>,
	props: string[]
) {
	var objProps = Object.keys(obj);
	return (
		objProps.length == props.length &&
		props.every((p) => objProps.includes(p))
	);
}

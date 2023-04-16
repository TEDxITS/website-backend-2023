import crypto from "crypto";
import _ from "lodash";

export const GenerateRandomToken = (): string => {
	return crypto.randomBytes(16).toString("hex");
};

export const isAfter = (dateA: Date, dateB: Date): boolean => {
	return dateA.getTime() > dateB.getTime();
}

export const isBefore = (dateA: Date, dateB: Date): boolean => {
	return dateA.getTime() < dateB.getTime();
}

export const getTomorrowDeadline = () => {
	const now = new Date()

	now.setDate(now.getDate() + 1);
	now.setHours(now.getHours() + 1);
	now.setMinutes(0)
	now.setSeconds(0)
	now.setMilliseconds(0)

	return now
}

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

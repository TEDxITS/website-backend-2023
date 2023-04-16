export type UpdateBody = {
	name?: string;
	password?: string;
};

export type UserInfoResponse = {
	id?: string;
	name: string;
	email: string;
	isVerified?: boolean;
	refreshToken?: string | null;
	password?: string;
}
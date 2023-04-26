export interface UpdateBody {
	name?: string
	password?: string
}

export interface UserInfoResponse {
	id?: string
	name: string
	email: string
	isVerified?: boolean
	refreshToken?: string | null
	password?: string
}

export interface IResponse {
    success: boolean,
    data?: any,
    error_code?: string
}

export interface IProfileResponse extends IResponse {
    data?: IProfile;
}

export interface IProfile {
    id: number,
    email: string,
    first_name: string,
    last_name: string,
    role: string
}
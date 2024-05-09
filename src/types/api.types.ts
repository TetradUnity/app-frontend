export interface IResponse {
    success: boolean,
    data?: any,
    error_code?: string
}

export interface IProfileResponse extends IResponse {
    data?: IUser;
}

export interface IUser {
    id: number,
    email: string,
    first_name: string,
    last_name: string,
    role: "chief_teacher" | "teacher" | "student"
}
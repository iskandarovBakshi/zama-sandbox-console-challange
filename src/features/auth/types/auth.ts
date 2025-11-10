export interface LoginParams {
    username: string;
    password: string;
}

export interface MockUser {
    id: string;
    name: string;
    picture: string;
}

export interface LoginLogoutResponse {
    message?: string;
    success: boolean;
}

export interface SessionResponse {
    loggedIn: boolean;
    success: boolean;
}

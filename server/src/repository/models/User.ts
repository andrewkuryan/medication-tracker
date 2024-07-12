export interface UserCredentialsData {
    salt: string;
    verifierHex: string;
}

export interface UserCredentials {
    id: number;
    data: UserCredentialsData;
}

export interface UserData {
    email: string;
}

export interface User {
    id: number;
    data: UserData;
    credentials: UserCredentials;
}

export interface SessionData {
    kHex: string;
    clientName: string;
    verified: boolean;
}

export interface Session {
    id: number;
    data: SessionData;
}

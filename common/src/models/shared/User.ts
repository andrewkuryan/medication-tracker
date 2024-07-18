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
    gender: string | null;
    birthDate: Date | null;
}

export interface User {
    id: number;
    data: UserData;
    credentials: UserCredentials;
}

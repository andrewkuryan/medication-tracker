export interface SessionData {
    clientIdentity: string;
    serverIdentity: string;
    clientName: string;
}

export interface Session {
    id: number;
    data: SessionData;
}

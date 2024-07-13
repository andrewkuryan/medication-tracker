import { Session as ServerSession, SessionData as ServerSessionData } from '../server/Session';

export type Session = Omit<ServerSessionData, 'clientName'> & Pick<ServerSession, 'id'>;

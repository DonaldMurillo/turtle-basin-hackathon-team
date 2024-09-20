import 'express-session';

declare module 'express-session' {
	interface SessionData {
		userId?: string;
		impersonatingUserId?: string;
	}
}
declare global {
	namespace Express {
		interface Request {
			user?: User;
		}
	}
}

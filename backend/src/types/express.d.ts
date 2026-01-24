import { AuthenticatedUser } from '../auth/authenticated-user.type';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

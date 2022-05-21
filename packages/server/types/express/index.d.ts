import type { Session } from "../../src/domains/session/repository/model/session";
import type { User } from "../../src/domains/user/repository/model/user";

declare global {
  namespace Express {
    export interface Request {
      session?: Session;
      user?: User;
    }
  }
}

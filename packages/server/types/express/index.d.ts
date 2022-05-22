import type { SessionEntity } from "../../src/domains/session";
import type { UserEntity } from "../../src/domains/user";

declare global {
  namespace Express {
    export interface Request {
      session?: SessionEntity;
      user?: UserEntity;
    }
  }
}

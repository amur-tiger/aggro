import type { Session } from "../../src/service/session/model/session";

declare global {
  namespace Express {
    export interface Request {
      session?: Session;
    }
  }
}

import { Pool } from "pg";
import { Logger } from "../logger";

export interface Migration {
  id: number;
  name: string;
  up: (client: Pool, logger: Logger) => Promise<void>;
}

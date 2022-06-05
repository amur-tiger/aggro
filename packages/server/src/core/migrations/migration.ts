import { Pool } from "pg";
import { Container } from "../container";
import { Logger } from "../logger";

export interface Migration {
  id: number;
  name: string;
  up: (client: Pool, container: Container, logger: Logger) => Promise<void>;
}

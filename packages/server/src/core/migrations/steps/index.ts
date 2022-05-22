import { Migration } from "../migration";
import { init } from "./0000_init";
import { addSources } from "./0001_add-sources";

export const migrations: Migration[] = [init, addSources];

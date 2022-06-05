import { Migration } from "../migration";
import { init } from "./0000_init";
import { addSources } from "./0001_add-sources";
import { uriToUrl } from "./0002_uri-to-url";
import { addFavicon } from "./0003_add-favicon";

export const migrations: Migration[] = [init, addSources, uriToUrl, addFavicon];

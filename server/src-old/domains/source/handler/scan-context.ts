import { Query } from "../selector/select";

export interface ScanContext {
  url: string;
  document: Query;
  addUrl: (url: string) => void;
}

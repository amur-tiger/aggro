import { registerEnumType } from "type-graphql";

export enum SourceSort {
  TITLE = "TITLE",
  DATE_ADDED = "DATE_ADDED",
  LAST_UPDATED = "LAST_UPDATED",
}

registerEnumType(SourceSort, { name: "SourceSort" });

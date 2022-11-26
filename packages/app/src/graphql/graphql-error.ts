import type { GraphQLErrorEntry } from "./graphql-error-entry";

export class GraphqlError extends Error {
  constructor(public readonly errors: readonly GraphQLErrorEntry[]) {
    if (errors.length === 0) {
      throw new TypeError("Expected at least one error.");
    }
    super(errors[0].message);

    if (process.env.NODE_ENV !== "production") {
      for (const err of errors) {
        console.error(
          'GraphQL Error: "%s" at %s\n%o',
          err.message,
          err.path
            ?.map((p) => (typeof p === "number" ? p : `"${p}"`))
            .join(" > "),
          err.extensions
        );
      }
    }
  }
}

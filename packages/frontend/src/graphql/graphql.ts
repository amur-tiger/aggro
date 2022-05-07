import { DocumentNode } from "graphql";
import { GraphqlError } from "./graphql-error";

/**
 * Execute a GraphQL-Query.
 *
 * Note: The "query"-Parameter will be transformed into a string during build.
 *
 * @param query
 * @param variables
 */
export async function query<T, V extends object = {}>(
  query: DocumentNode,
  variables?: V
): Promise<T> {
  const response = await fetch("/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error("Network Error.");
  }

  const result = await response.json();

  if (Array.isArray(result.errors) && result.errors.length > 0) {
    throw new GraphqlError(result.errors);
  }

  return result.data;
}

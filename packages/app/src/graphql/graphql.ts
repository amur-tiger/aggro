import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { GraphqlError } from "./graphql-error";

/**
 * Create a GraphQL-Query fetcher.
 *
 * Note: The "query"-Parameter will be transformed into a string during build.
 *
 * @param document
 * @param variables
 */
export function createQuery<T = any, V = Record<string, any>>(
  document: TypedDocumentNode<T, V>,
  variables?: V
): (variables?: V | boolean) => Promise<T> {
  return async (variables2) => {
    const response = await fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: document,
        variables: {
          ...variables,
          ...(typeof variables2 === "boolean" ? {} : variables2),
        },
      }),
    });

    if (!response.ok) {
      throw new Error("HTTP Error");
    }

    const result = await response.json();

    if (Array.isArray(result.errors) && result.errors.length > 0) {
      throw new GraphqlError(result.errors);
    }

    return result.data;
  };
}

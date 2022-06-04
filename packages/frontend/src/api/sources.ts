import { writable } from "svelte/store";
import { gql } from "graphql-tag";
import { query } from "../graphql";
import {
  AddSourceMutation,
  AddSourceMutationVariables,
  DeleteSourceMutation,
  DeleteSourceMutationVariables,
  Source,
  SourceListQuery,
  SourceListQueryVariables,
} from "../generated/graphql";
import { WritablePaginatedList } from "./paginated-list";
import { byProp } from "../utils/by-prop";

export function getSources(): WritablePaginatedList<
  Source,
  AddSourceMutationVariables
> {
  const isLoading = writable(false);
  const totalCount = writable(NaN);
  const items = writable<Source[]>([]);

  function withLoading<T extends (...args: any[]) => Promise<any>>(fn: T): T {
    return ((...args) => {
      isLoading.set(true);
      try {
        return fn(...args);
      } finally {
        isLoading.set(false);
      }
    }) as T;
  }

  return {
    isLoading,
    totalCount,
    items,

    refresh: withLoading(async () => {
      const page = await fetchSourcesQuery();
      totalCount.set(page.sources.totalCount);
      items.set(page.sources.edges.map((edge) => edge.node));
    }),

    nextPage: withLoading(async () => {}),

    previousPage: withLoading(async () => {}),

    addItem: withLoading(async (item) => {
      const data = await addSourceQuery(item);
      items.update((old) => [...old, data.addSource].sort(byProp("title")));
      totalCount.update((old) => old + 1);
    }),

    deleteItem: withLoading(async (item) => {
      const data = await deleteSourceQuery({
        id: item.id,
      });
      items.update((old) =>
        old.filter((item) => item.id !== data.deleteSource.id)
      );
      totalCount.update((old) => old - 1);
    }),
  };
}

const fetchSourcesQuery = query<SourceListQuery, SourceListQueryVariables>(gql`
  query SourceList {
    sources {
      totalCount
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          type
          title
          uri
          added
          lastUpdate
        }
      }
    }
  }
`);

const addSourceQuery = query<AddSourceMutation, AddSourceMutationVariables>(gql`
  mutation AddSource($title: String!, $type: String!, $uri: String!) {
    addSource(input: { title: $title, type: $type, uri: $uri }) {
      id
      type
      title
      uri
      added
      lastUpdate
    }
  }
`);

const deleteSourceQuery = query<
  DeleteSourceMutation,
  DeleteSourceMutationVariables
>(gql`
  mutation DeleteSource($id: ID!) {
    deleteSource(id: $id) {
      id
    }
  }
`);

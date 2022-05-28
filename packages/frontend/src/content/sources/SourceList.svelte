<script lang="ts">
  import { gql } from "graphql-tag";
  import Spinner from "../../components/Spinner.svelte";
  import Card from "../../components/Card.svelte";
  import { query } from "../../graphql";
  import {
    SourceListQuery,
    SourceListQueryVariables,
  } from "../../generated/graphql";

  const sources = query<SourceListQuery, SourceListQueryVariables>(gql`
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
</script>

{#await sources}
  <Spinner />
{:then data}
  <ul class="list">
    {#each data.sources.edges as source}
      <li>
        <Card>
          <span class="typography-headline-medium">{source.node.title}</span>
          <span>(via {source.node.type})</span>
          <span>at {source.node.uri}</span>
          <span>added {source.node.added}</span>
        </Card>
      </li>
    {/each}
  </ul>
{:catch err}
  <div>
    Error: {err.message}
  </div>
{/await}

<style lang="sass">
  .list
    margin: 0
    padding: 0
</style>
<script lang="ts">
  import { gql } from "graphql-tag";
  import { query } from "./graphql";
  import Spinner from "./Spinner.svelte";
  import { FeedListQuery, FeedListQueryVariables } from "./generated/graphql";

  const feeds = query<FeedListQuery, FeedListQueryVariables>(gql`
    query FeedList {
      feeds {
        id
        title
        entries {
          totalCount
          pageInfo {
            startCursor
            endCursor
            hasNextPage
            hasPreviousPage
          }
          edges {
            cursor
            node {
              id
              title
              link
            }
          }
        }
      }
    }
  `);
</script>

{#await feeds}
  <Spinner />
{:then data}
  <ul class="list">
    {#each data.feeds as feed}
      <li>
        <span>{feed.title}</span>
        <ol>
          {#each feed.entries.edges as edge}
            <li><a href={edge.node.link}>{edge.node.title}</a></li>
          {/each}
        </ol>
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

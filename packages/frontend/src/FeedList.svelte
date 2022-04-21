<script lang="ts">
  import { gql } from "@apollo/client/core";
  import { query } from "svelte-apollo";
  import Spinner from "./Spinner.svelte";

  const feeds = query(gql`
    query {
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

{#if $feeds.loading}
  <Spinner />
{:else if $feeds.error}
  <div>
    Error: {$feeds.error.message}
  </div>
{:else}
  <ul class="list">
    {#each $feeds.data.feeds as feed}
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
{/if}

<style lang="sass">
  .list
    margin: 0
    padding: 0
</style>

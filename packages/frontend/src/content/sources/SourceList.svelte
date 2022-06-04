<script lang="ts">
  import { gql } from "graphql-tag";
  import Spinner from "../../components/Spinner.svelte";
  import Button from "../../components/Button.svelte";
  import Textfield from "../../components/Textfield.svelte";
  import Card from "../../components/Card.svelte";
  import SearchIcon from "../../icons/search.svg";
  import AddIcon from "../../icons/add.svg";
  import DeleteIcon from "../../icons/delete.svg";
  import { lazyQuery, query } from "../../graphql";
  import {
    AddSourceMutation,
    AddSourceMutationVariables,
    DeleteSourceMutation,
    DeleteSourceMutationVariables,
    DiscoverSourcesQuery,
    DiscoverSourcesQueryVariables,
    SourceListQuery,
    SourceListQueryVariables,
  } from "../../generated/graphql";
  import SourceCard from "./SourceCard.svelte";

  let url;

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

  const addSource = lazyQuery<
    AddSourceMutation,
    AddSourceMutationVariables
  >(gql`
    mutation AddSource($title: String!, $type: String!, $uri: String!) {
      addSource(input: { title: $title, type: $type, uri: $uri }) {
        id
      }
    }
  `);

  const deleteSource = lazyQuery<
    DeleteSourceMutation,
    DeleteSourceMutationVariables
  >(gql`
    mutation DeleteSource($id: ID!) {
      deleteSource(id: $id) {
        id
      }
    }
  `);

  const discover = lazyQuery<
    DiscoverSourcesQuery,
    DiscoverSourcesQueryVariables
  >(gql`
    query DiscoverSources($url: String!) {
      discover(url: $url) {
        items {
          type
          title
          url
        }
      }
    }
  `);

  let discoveryLoading = false;
  let list = [];
  const handleDiscoverClick = () => {
    discoveryLoading = true;
    discover({ url })
      .then((res) => {
        list = res.discover.items;
      })
      .finally(() => (discoveryLoading = false));
  };
</script>

<Card>
  <div class="typography-headline-medium">neu</div>

  <Textfield bind:value={url} label="link" />

  <Button variant="icon-filled" on:click={handleDiscoverClick}>
    <SearchIcon slot="icon" size="32" />
  </Button>

  {#if discoveryLoading}
    <Spinner />
  {:else}
    {#each list as item}
      <SourceCard title={item.title} type={item.type} url={item.url}>
        <Button
          variant="icon-filled"
          on:click={() => {
            addSource({ title: item.title, type: item.type, uri: item.url });
          }}
        >
          <AddIcon slot="icon" size="32" />
        </Button>
      </SourceCard>
    {/each}
  {/if}
</Card>

{#await sources}
  <Spinner />
{:then data}
  <ul class="list">
    {#each data.sources.edges as source}
      <li>
        <SourceCard
          title={source.node.title}
          type={source.node.type}
          url={source.node.uri}
          added={source.node.added}
        >
          <Button
            variant="icon-filled"
            on:click={() => {
              deleteSource({ id: source.node.id });
            }}
          >
            <DeleteIcon slot="icon" size="32" />
          </Button>
        </SourceCard>
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

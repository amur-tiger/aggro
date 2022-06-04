<script lang="ts">
  import { gql } from "graphql-tag";
  import Spinner from "../../components/Spinner.svelte";
  import Button from "../../components/Button.svelte";
  import Textfield from "../../components/Textfield.svelte";
  import Card from "../../components/Card.svelte";
  import SourceCard from "./SourceCard.svelte";
  import SearchIcon from "../../icons/search.svg";
  import AddIcon from "../../icons/add.svg";
  import DeleteIcon from "../../icons/delete.svg";
  import { query } from "../../graphql";
  import { getSources } from "../../api/sources";
  import {
    DiscoverSourcesQuery,
    DiscoverSourcesQueryVariables,
  } from "../../generated/graphql";

  let url;

  const discover = query<
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

  const { addItem, deleteItem, isLoading, items, refresh } = getSources();
  refresh();

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
            addItem({ title: item.title, type: item.type, uri: item.url });
          }}
        >
          <AddIcon slot="icon" size="32" />
        </Button>
      </SourceCard>
    {/each}
  {/if}
</Card>

{#if $isLoading}
  <Spinner />
{:else}
  <ul class="list">
    {#each $items as source}
      <li>
        <SourceCard
          title={source.title}
          type={source.type}
          url={source.uri}
          added={source.added}
        >
          <Button
            variant="icon-filled"
            on:click={() => {
              deleteItem({ id: source.id });
            }}
          >
            <DeleteIcon slot="icon" size="32" />
          </Button>
        </SourceCard>
      </li>
    {/each}
  </ul>
{/if}

<style lang="sass">
  .list
    margin: 0
    padding: 0
</style>

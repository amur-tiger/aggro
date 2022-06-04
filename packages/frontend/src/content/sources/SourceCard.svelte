<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Card from "../../components/Card.svelte";
  import TextField from "../../components/TextField.svelte";
  import Button from "../../components/Button.svelte";
  import { t } from "../../lang";

  export let title: string;
  export let type: string;
  export let url: string;
  export let added: Date | null = null;
  export let isEditing: boolean = false;

  const dispatch = createEventDispatcher();

  let nextTitle = title;
</script>

<Card imagePosition="left">
  <img
    slot="image"
    src={"//" + new URL(url).host + "/favicon.ico"}
    alt="icon"
  />

  <h2 slot="header" class="typography-headline-small">
    {#if isEditing}
      <TextField label={$t("source-card.title")} bind:value={nextTitle} />
      <Button on:click={() => dispatch("change", { value: nextTitle })}>
        {$t("source-card.save")}
      </Button>
    {:else}
      {title}
    {/if}
  </h2>

  <span>(via {type})</span>
  <span>at {url}</span>
  {#if added}
    <span>added {added}</span>
  {/if}

  <div slot="actions">
    <slot />
  </div>
</Card>

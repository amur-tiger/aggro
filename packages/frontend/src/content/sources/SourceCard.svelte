<script lang="ts">
  import Card from "../../components/Card.svelte";

  export let title: string;
  export let type: string;
  export let url: string;
  export let added: Date | null = null;
</script>

<Card imagePosition="left">
  <img
    slot="image"
    src={"//" + new URL(url).host + "/favicon.ico"}
    alt="icon"
  />

  <h2 slot="header" class="typography-headline-small">{title}</h2>

  <span>(via {type})</span>
  <span>at {url}</span>
  {#if added}
    <span>added {added}</span>
  {/if}

  <div slot="actions">
    <slot />
  </div>
</Card>

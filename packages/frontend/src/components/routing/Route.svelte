<script lang="ts">
  import { getContext } from "svelte";
  import { location } from "../../location";
  import { key } from "./context";

  export let path: string | null = null;
  export let title: string | null = null;
  export let fallback = false;

  let previousPath = path;
  const context = getContext<Set<string>>(key);

  $: {
    context.delete(previousPath);
    if (path) {
      context.add(path);
    }
    previousPath = path;
  }

  $: match =
    (path && path === $location) ||
    (fallback && Array.from(context.values()).every((p) => p !== $location));

  $: if (match) {
    window.document.title = title ? `${title} - Aggro` : "Aggro";
  }
</script>

{#if match}
  <slot />
{/if}

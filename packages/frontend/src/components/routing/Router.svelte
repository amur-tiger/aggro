<script lang="ts">
  import { setContext } from "svelte";
  import { key } from "./context";

  setContext(key, new Set());
</script>

<slot />

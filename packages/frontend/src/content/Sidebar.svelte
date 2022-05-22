<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Button from "../components/Button.svelte";
  import { t } from "../lang";

  const dispatch = createEventDispatcher();

  const andClose = (cb: () => void) => (e: Event) => {
    cb();
    dispatch("close", e);
  };
</script>

<ol class="sidebar">
  <li>
    <Button variant="list" on:click={andClose(() => history.pushState("", "", "/settings"))}>
      {$t("sidebar.options")}
    </Button>
  </li>
</ol>

<style lang="sass">
  .sidebar
    margin: 0
    padding: 0
    list-style: none
</style>

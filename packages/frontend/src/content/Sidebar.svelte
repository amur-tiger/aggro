<script lang="ts">
  import Button from "../components/Button.svelte";
  import { t } from "../lang";
</script>

<ol class="sidebar">
  <li>
    <Button variant="list">
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

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Button from "../components/Button.svelte";
  import SettingsIcon from "../icons/settings.svg";
  import { t } from "../lang";

  const dispatch = createEventDispatcher();

  const andClose = (cb: () => void) => (e: Event) => {
    cb();
    dispatch("close", e);
  };
</script>

<ol class="sidebar">
  <li>
    <Button
      variant="list"
      on:click={andClose(() => history.pushState("", "", "/settings"))}
    >
      <SettingsIcon size="24" />
      <div class="label">
        {$t("sidebar.options")}
      </div>
    </Button>
  </li>
</ol>

<style lang="sass">
  .sidebar
    margin: 0
    padding: 0
    list-style: none

  .label
    padding-left: 8px
</style>

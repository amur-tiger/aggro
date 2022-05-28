<script>
  import { createEventDispatcher } from "svelte";
  import Button from "./Button.svelte";
  import Surface from "./Surface.svelte";
  import AggroIcon from "../icons/aggro.svg";
  import MenuIcon from "../icons/menu.svg";
  import { t } from "../lang";

  const dispatch = createEventDispatcher();
</script>

<Surface disableShadows>
  <header class="app-bar">
    <Button variant="icon" on:click={(e) => dispatch("menuclick", e)}>
      <MenuIcon size="24" slot="icon" />
    </Button>

    <h1 class="title">
      <AggroIcon size="40" />&nbsp;
      <span>{$t("appbar.title")}</span>
    </h1>
  </header>
</Surface>

<style lang="sass">
  .app-bar
    height: 64px
    display: flex
    align-items: center
    padding: 0 16px
    background-color: var(--color-surface)
    user-select: none
    color: var(--color-on-surface)
    fill: var(--color-on-surface)

  .title
    flex-grow: 1
    display: flex
    align-items: center
    justify-content: center
    font-weight: 500
</style>

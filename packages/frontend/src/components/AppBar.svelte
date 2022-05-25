<script>
  import { createEventDispatcher } from "svelte";
  import Button from "./Button.svelte";
  import AggroIcon from "../icons/aggro.svg";
  import MenuIcon from "../icons/menu.svg";
  import { t } from "../lang";

  const dispatch = createEventDispatcher();
</script>

<header class="app-bar">
  <Button
    on:click={(e) => dispatch("menuclick", e)}
    variant="icon"
    color="primary"
    background="primary"
  >
    <MenuIcon size="32" slot="icon" />
  </Button>

  <h1 class="title">
    <AggroIcon size="40" />&nbsp;
    <span>{$t("appbar.title")}</span>
  </h1>
</header>

<style lang="sass">
  .app-bar
    height: 64px
    display: flex
    align-items: center
    padding: 0 16px
    background-color: var(--primary-color)
    user-select: none

  .title
    flex-grow: 1
    color: var(--primary-contrast-text)
    fill: var(--primary-contrast-text)
    display: flex
    align-items: center
    justify-content: center
    font-weight: 500
</style>

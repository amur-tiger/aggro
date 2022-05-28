<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Scrim from "./Scrim.svelte";

  export let open = false;
  export let anchor: "left" | "right" = "left";

  const dispatch = createEventDispatcher();
  const handleClose = () => dispatch("close");
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      handleClose();
    }
  };
</script>

<div
  class="drawer"
  role="presentation"
  class:left={anchor === "left"}
  class:right={anchor === "right"}
  class:open
  class:left__open={open && anchor === "left"}
  class:right__open={open && anchor === "right"}
>
  <slot />
</div>

<Scrim {open} on:close={handleClose} />
<svelte:window on:keydown={handleKeydown} />

<style lang="sass">
  @use "../config/animation"
  @use "../config/mixins"

  .drawer
    position: fixed
    top: 0
    bottom: 0
    background-color: var(--color-surface)
    width: 360px
    max-width: 100vw
    transition: transform animation.$fast ease-in
    z-index: 35
    @include mixins.elevation-shadow-1

  .open
    transition: transform animation.$fast ease-out

  .left
    left: 0
    transform: translateX(-100%)
    @include mixins.shape-large-end

  .left__open
    transform: translateX(0)

  .right
    right: 0
    border-top-left-radius: 16px
    border-bottom-left-radius: 16px
    transform: translateX(100%)

  .right__open
    transform: translateX(0)
</style>

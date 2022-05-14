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
  @use "../config/shadows"
  @use "../config/animation"

  .drawer
    position: absolute
    top: 0
    bottom: 0
    background-color: white
    box-shadow: shadows.$elevation-0
    width: 350px
    transition: transform animation.$fast ease-in
    will-change: transform, box-shadow
    z-index: 35

  .open
    transition: transform animation.$fast ease-out
    box-shadow: shadows.$elevation-16

  .left
    left: 0
    transform: translateX(-100%)

  .left__open
    transform: translateX(0)

  .right
    right: 0
    transform: translateX(100%)

  .right__open
    transform: translateX(0)
</style>

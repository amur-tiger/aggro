<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Backdrop from "./Backdrop.svelte";

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

<Backdrop {open} on:close={handleClose} />
<svelte:window on:keydown={handleKeydown} />

<style lang="sass">
  .drawer
    position: absolute
    top: 0
    bottom: 0
    background-color: white
    width: 350px
    transition: transform 167ms ease-in
    will-change: transform
    z-index: 35

  .open
    transition: transform 167ms ease-out

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

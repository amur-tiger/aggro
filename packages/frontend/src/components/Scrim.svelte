<script lang="ts">
  import { createEventDispatcher, onDestroy } from "svelte";

  export let open = false;
  let token: number | null = null;

  const dispatch = createEventDispatcher();
  const clickHandler = () => dispatch("close");
  const backdrop = document.createElement("div");
  backdrop.className = "backdrop";
  backdrop.addEventListener("click", clickHandler);

  $: if (open) {
    document.body.appendChild(backdrop);
    setTimeout(() => {
      backdrop.classList.add("backdrop__visible");
    }, 0);
    if (token) {
      clearTimeout(token);
      token = null;
    }
  } else {
    backdrop.classList.remove("backdrop__visible");
    token = setTimeout(() => {
      backdrop.remove();
      token = null;
    }, 250);
  }

  onDestroy(() => {
    backdrop.remove();
  });
</script>

<style lang="sass">
  :global(.backdrop)
    position: absolute
    top: 0
    right: 0
    bottom: 0
    left: 0
    opacity: 0
    background-color: black
    transition: opacity 250ms ease-in-out
    will-change: opacity
    z-index: 25

  :global(.backdrop__visible)
    opacity: .5
</style>

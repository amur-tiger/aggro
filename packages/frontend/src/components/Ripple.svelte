<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  export let color: "primary" | "secondary" | undefined;

  let ref: HTMLSpanElement | undefined;
  let token: number | undefined;

  const handleClick = (event: MouseEvent) => {
    if (!ref || !ref.parentElement) {
      return;
    }

    if (token) {
      ref?.classList.remove("active");
      clearTimeout(token);
      token = undefined;
    }

    const diameter = Math.max(
      ref.parentElement.clientWidth,
      ref.parentElement.clientHeight
    );
    ref.style.width = `${diameter}px`;
    ref.style.height = `${diameter}px`;
    ref.style.left = `${
      event.clientX - (ref.parentElement.offsetLeft + diameter / 2)
    }px`;
    ref.style.top = `${
      event.clientY - (ref.parentElement.offsetTop + diameter / 2)
    }px`;

    setTimeout(() => {
      ref?.classList.add("active");
    }, 0);
    token = setTimeout(() => {
      ref?.classList.remove("active");
    }, 500);
  };

  onMount(() => {
    const parent = ref?.parentElement;
    if (parent) {
      parent.addEventListener("mousedown", handleClick);
    }
  });

  onDestroy(() => {
    const parent = ref?.parentElement;
    if (parent) {
      parent.removeEventListener("mousedown", handleClick);
    }
  });
</script>

<span
  class="ripple"
  class:primary={color === "primary"}
  class:secondary={color === "secondary"}
  bind:this={ref}
/>

<style lang="sass">
  @use "../config/animation"

  .ripple
    position: absolute
    border-radius: 50%

  :global(.active)
    transform: scale(0)
    animation: ripple animation.$slower linear
    background-color: rgba(255, 255, 255, 0.7)

    &.primary
      background-color: var(--primary-color-light)

    &.secondary
      background-color: var(--secondary-color-light)

  @keyframes ripple
    to
      transform: scale(4)
      opacity: 0
</style>

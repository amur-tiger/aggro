<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Ripple from "./Ripple.svelte";

  export let variant: "contained" | "outlined" | "text" | "list" = "contained";
  export let disabled = false;

  const dispatch = createEventDispatcher();
  const handleClick = (e) => dispatch("click", e);
</script>

<button
  class="button"
  class:contained={variant === "contained"}
  class:outlined={variant === "outlined"}
  class:text={variant === "text"}
  class:list={variant === "list"}
  {disabled}
  on:click={handleClick}
>
  <Ripple color={variant === "outlined" ? "secondary" : undefined} />
  <slot />
</button>

<style lang="sass">
  @use "../config/animation"

  .button
    position: relative
    overflow: hidden
    display: inline-flex
    align-items: center
    justify-content: center
    outline: none
    border: none
    text-transform: uppercase
    font-weight: 500
    box-sizing: border-box
    min-width: 64px
    height: 36px
    border-radius: 4px
    padding: 0 16px
    user-select: none
    cursor: pointer

  .contained
    color: var(--secondary-contrast-text)
    background-color: var(--secondary-color)
    transition: background-color animation.$fast ease-in-out

    &:disabled
      background-color: var(--disabled-color)

    &:hover:not(:disabled)
      background-color: var(--secondary-color-hover)

    &:focus:not(:disabled)
      background-color: var(--secondary-color-hover)

  .outlined
    color: var(--secondary-color)
    border-width: 1px
    border-style: solid
    border-color: var(--secondary-color)
    background-color: transparent

    &:disabled
      color: var(--disabled-color)
      border-color: var(--disabled-color)

    &:hover:not(:disabled)
      background-color: rgba(255, 255, 255, 0.7)

    &:focus:not(:disabled)
      background-color: rgba(255, 255, 255, 0.7)

  .text
    background-color: transparent
    transition: background-color animation.$fast ease-in-out

    &:disabled
      color: var(--disabled-color)

    &:hover:not(:disabled)
      background-color: var(--background-color)

    &:focus:not(:disabled)
      background-color: var(--background-color)

  .list
    background-color: transparent
    transition: background-color animation.$fast ease-in-out
    width: 100%
    height: 48px
    border-radius: 0
    justify-content: left
    padding: 8px 16px
    text-transform: none
    font-weight: 400

    &:disabled
      color: var(--disabled-color)

    &:hover:not(:disabled)
      background-color: var(--background-color)

    &:focus:not(:disabled)
      background-color: var(--background-color)
</style>

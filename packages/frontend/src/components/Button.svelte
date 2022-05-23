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
  <span class="icon">
    <slot name="icon" />
  </span>
  <span class="label">
    <slot />
  </span>
</button>

<style lang="sass">
  @use "../config/animation"

  $height: 40px

  .button
    position: relative
    overflow: hidden
    display: inline-flex
    align-items: center
    justify-content: center
    outline: none
    border: none
    font-size: 1rem
    font-weight: 500
    box-sizing: border-box
    min-width: 64px
    height: $height
    border-radius: calc(#{$height} / 2)
    padding: 0 24px 0 16px
    user-select: none
    cursor: pointer
    transition: background-color animation.$fast ease-in-out

  .icon
    display: flex
    fill: currentColor

  .label
    margin-left: 8px

  .contained
    color: var(--secondary-contrast-text)
    background-color: var(--secondary-color)

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
      background-color: rgba(0, 0, 0, 0.05)

    &:focus:not(:disabled)
      background-color: rgba(0, 0, 0, 0.05)

  .text
    background-color: transparent

    &:disabled
      color: var(--disabled-color)

    &:hover:not(:disabled)
      background-color: var(--secondary-color-light)

    &:focus:not(:disabled)
      background-color: var(--secondary-color-light)

  .list
    background-color: transparent
    width: 100%
    height: 56px
    border-radius: 28px
    justify-content: left
    text-transform: none
    font-weight: 400

    &:disabled
      color: var(--disabled-color)

    &:hover:not(:disabled)
      background-color: var(--background-color)

    &:focus:not(:disabled)
      background-color: var(--background-color)
</style>

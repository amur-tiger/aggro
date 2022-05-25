<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Ripple from "./Ripple.svelte";

  export let variant: "contained" | "outlined" | "text" | "icon" | "list" =
    "contained";
  export let color: "primary" | "secondary" = "secondary";
  export let background: "primary" | "secondary" | undefined = undefined;
  export let disabled = false;

  const dispatch = createEventDispatcher();
  const handleClick = (e) => dispatch("click", e);
</script>

<button
  class="button"
  class:contained={variant === "contained"}
  class:outlined={variant === "outlined"}
  class:text={variant === "text"}
  class:icon={variant === "icon"}
  class:list={variant === "list"}
  class:primary={color === "primary"}
  class:secondary={color === "secondary"}
  class:primary-background={background === "primary"}
  class:secondary-background={background === "secondary"}
  {disabled}
  on:click={handleClick}
>
  <Ripple color={variant === "outlined" ? "secondary" : undefined} />
  <span class="icon-container">
    <slot name="icon" />
  </span>
  {#if variant !== "icon"}
    <span class="label">
      <slot />
    </span>
  {/if}
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

    &:disabled
      color: var(--disabled-color)

    &.primary:hover:not(:disabled)
      background-color: var(--primary-color-hover)

    &.secondary:hover:not(:disabled)
      background-color: var(--secondary-color-hover)

    &.primary:focus:not(:disabled)
      background-color: var(--primary-color-hover)

    &.secondary:focus:not(:disabled)
      background-color: var(--secondary-color-hover)

  .icon-container
    display: flex
    fill: currentColor

  .label
    margin-left: 8px

  .contained
    color: var(--secondary-contrast-text)

    &.primary
      background-color: var(--primary-color)

    &.secondary
      background-color: var(--secondary-color)

    &.primary:hover:not(:disabled)
      background-color: var(--primary-color-light)

    &.secondary:hover:not(:disabled)
      background-color: var(--secondary-color-light)

    &.primary:focus:not(:disabled)
      background-color: var(--primary-color-light)

    &.secondary:focus:not(:disabled)
      background-color: var(--secondary-color-light)

  .outlined
    border-width: 1px
    border-style: solid
    background-color: transparent

    &.primary
      color: var(--primary-color)
      border-color: var(--primary-color)

    &.secondary
      color: var(--secondary-color)
      border-color: var(--secondary-color)

    &:disabled
      color: var(--disabled-color)
      border-color: var(--disabled-color)

    &:hover:not(:disabled)
      background-color: rgba(0, 0, 0, 0.05)

    &:focus:not(:disabled)
      background-color: rgba(0, 0, 0, 0.05)

  .text, .icon
    background-color: transparent

    &.primary-background
      color: var(--primary-contrast-text)

    &.secondary-background
      color: var(--secondary-contrast-text)

  .icon
    padding: 0
    min-width: unset
    width: 48px
    height: 48px
    border-radius: 24px

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

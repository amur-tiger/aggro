<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Ripple from "./Ripple.svelte";

  export let variant:
    | "elevated"
    | "filled"
    | "tonal"
    | "outlined"
    | "text"
    | "icon"
    | "icon-filled"
    | "drawer" = "filled";
  export let disabled = false;
  export let fullWidth = false;

  const dispatch = createEventDispatcher();
  const handleClick = (e) => dispatch("click", e);
</script>

<button
  class="button-base typography-body-large"
  class:elevated={variant === "elevated"}
  class:filled={variant === "filled"}
  class:tonal={variant === "tonal"}
  class:outlined={variant === "outlined"}
  class:text={variant === "text"}
  class:icon={variant === "icon"}
  class:icon-filled={variant === "icon-filled"}
  class:drawer={variant === "drawer"}
  {disabled}
  class:full-width={fullWidth}
  on:click={handleClick}
>
  <Ripple color={variant === "outlined" ? "secondary" : undefined} />
  <span class="icon-container">
    <slot name="icon" />
  </span>
  {#if !variant.startsWith("icon")}
    <span class="label">
      <slot />
    </span>
  {/if}
</button>

<style lang="sass">
  @use "../config/animation"
  @use "../config/mixins"

  :global(.button-base)
    position: relative
    overflow: hidden
    display: inline-flex
    align-items: center
    justify-content: center
    outline: none
    border: none
    box-sizing: border-box
    min-width: 64px
    height: 40px
    border-radius: 20px
    padding: 0 24px 0 16px
    user-select: none
    cursor: pointer

  button
    .label
      margin-left: 8px

    .icon-container
      display: flex

    &:disabled
      opacity: 0.38
      color: var(--color-on-surface)
      fill: var(--color-on-surface)

    &:not(:disabled):hover
      @include mixins.tint-hover

    &:not(:disabled):focus-visible
      @include mixins.tint-focus

    &:not(:disabled):active
      @include mixins.tint-pressed

  .full-width
    width: 100%

  .elevated
    background-color: var(--color-surface)
    color: var(--color-primary)
    fill: var(--color-primary)
    transition: box-shadow animation.$faster ease-in-out
    @include mixins.elevation-shadow-1
    @include mixins.tint(var(--color-on-surface))

    &:not(:disabled):hover
      @include mixins.elevation-shadow-2

  .filled
    background-color: var(--color-primary)
    color: var(--color-on-primary)
    fill: var(--color-on-primary)
    transition: box-shadow animation.$faster ease-in-out
    @include mixins.tint(var(--color-on-primary))

    &:not(:disabled):hover
      @include mixins.elevation-shadow-1

  .tonal
    background-color: var(--color-secondary-container)
    color: var(--color-on-secondary-container)
    fill: var(--color-on-secondary-container)
    transition: box-shadow animation.$faster ease-in-out
    @include mixins.tint(var(--color-on-secondary-container))

    &:after
      background-color: var(--color-on-secondary-container)

    &:disabled
      background-color: var(--color-surface)

    &:not(:disabled):hover
      @include mixins.elevation-shadow-1

  .outlined
    border: 1px solid var(--color-outline)
    background-color: transparent
    color: var(--color-primary)
    fill: var(--color-primary)
    @include mixins.tint(var(--color-primary))

    &:after
      background-color: var(--color-primary)

    &:disabled
      border-color: var(--color-on-surface)

  .text
    background-color: transparent
    color: var(--color-primary)
    fill: var(--color-primary)
    @include mixins.tint(var(--color-primary))

    &:after
      background-color: var(--color-primary)

  .icon
    min-width: unset
    width: 40px
    height: 40px
    border-radius: 20px
    padding: 0
    @include mixins.tint(var(--color-primary))

    background-color: transparent
    color: var(--color-on-surface)
    fill: var(--color-on-surface)

  .icon-filled
    min-width: unset
    width: 40px
    height: 40px
    border-radius: 20px
    padding: 0
    @include mixins.tint(var(--color-on-primary))

    background-color: var(--color-primary)
    color: var(--color-on-primary)
    fill: var(--color-on-primary)

  .drawer
    height: 56px
    border-radius: 28px
    justify-content: start
    background-color: var(--color-surface)
    color: var(--color-on-surface)
    fill: var(--color-on-surface)
    @include mixins.tint(var(--color-on-surface))
</style>

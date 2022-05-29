<script lang="ts">
  import Surface from "./Surface.svelte";

  export let elevation: number | null = null;
  export let imagePosition: "top" | "left" = "top";
</script>

<section class="wrapper">
  <Surface shape="medium" {elevation}>
    {#if $$slots.image}
      <div class="image" class:left={imagePosition === "left"}>
        <slot name="image" />
      </div>
    {/if}

    <div
      class="text"
      class:left={imagePosition === "left"}
      class:has-image={!!$$slots.image}
    >
      {#if $$slots.header}
        <div class="header">
          <slot name="header" />
        </div>
      {/if}

      <div class="content">
        <slot />
      </div>

      {#if $$slots.actions}
        <div class="actions">
          <slot name="actions" />
        </div>
      {/if}
    </div>
  </Surface>
</section>

<style lang="sass">
  @use "../config/mixins"

  .wrapper
    margin: 8px

  .image
    overflow: hidden
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 200px
    @include mixins.shape-medium

    &.left
      width: 200px
      height: 100%

    :global(img)
      width: 100%
      height: 100%
      object-fit: cover
      object-position: 50% 50%

  .text
    display: flex
    flex-direction: column

    &.has-image
      padding-top: 200px

      &.left
        padding-top: 0
        padding-left: 200px

  .header
    padding: 16px 16px 0

  .content
    padding: 16px
    flex-grow: 1

  .actions
    padding: 0 16px 16px
</style>

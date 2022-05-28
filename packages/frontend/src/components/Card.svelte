<script lang="ts">
  import Surface from "./Surface.svelte";

  export let elevation: number | null = null;
</script>

<div class="wrapper">
  <Surface shape="medium" {elevation}>
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
  </Surface>
</div>

<style lang="sass">
  .wrapper
    margin: 8px

  .header
    padding: 16px 16px 0

  .content
    padding: 16px

  .actions
    padding: 0 16px 16px
</style>

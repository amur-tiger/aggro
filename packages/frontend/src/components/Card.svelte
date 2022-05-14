<script lang="ts">
  import Container from "./Container.svelte";

  export let elevation: number = 4;
</script>

<Container {elevation}>
  <div class="card">
    <slot />
  </div>
</Container>

<style lang="sass">
  .card
    background-color: var(--paper-color)
    padding: 16px
</style>

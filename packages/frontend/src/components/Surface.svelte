<script lang="ts" context="module">
  import { getContext, setContext } from "svelte";

  const elevationKey = Symbol("surface");

  export function getCurrentElevation(): number {
    return getContext(elevationKey) ?? 0;
  }

  export function setCurrentElevation(elevation: number): void {
    setContext(elevationKey, elevation);
  }
</script>

<script lang="ts">
  import { shape as shapeFn, ShapeKey } from "../actions/shape";
  import { elevationShadow } from "../actions/elevation-shadow";
  import { elevationTint } from "../actions/elevation-tint";

  export let elevation: number | null = null;
  export let disableShadows: boolean = false;
  export let shape: ShapeKey = "none";

  if (elevation == null) {
    elevation = getCurrentElevation() + 1;
  }
  setCurrentElevation(elevation);
</script>

<div
  class="surface tint-primary"
  use:shapeFn={shape}
  use:elevationShadow={disableShadows ? 0 : elevation}
  use:elevationTint={elevation}
>
  <div class="content">
    <slot />
  </div>
</div>

<style lang="sass">
  @use "../config/mixins"

  .surface
    background-color: var(--color-surface)
    fill: var(--color-on-surface)
    color: var(--color-on-surface)
    overflow: hidden

  .content
    position: relative
    z-index: 1
</style>

<script lang="ts" context="module">
  let counter = 0;
</script>

<script lang="ts">
  import { onResize } from "../actions/on-resize";

  export let type = "text";
  export let name = undefined;
  export let value: number | string = "";
  export let disabled = false;
  export let required = false;
  export let minLength: number | undefined;
  export let maxLength: number | undefined;
  export let autocomplete = undefined;
  export let label = "";
  export let supportText = "";
  export let error = false;

  let focused;
  $: raised = !!value || focused;
  const id = `t${counter++}`;
  let width = 128;
  let labelWidth = 32;

  $: borderPath = `M10${focused ? "" : ".5"} 4${
    focused ? "" : ".5"
  } h-2 q-4 0 -4 4 v48 q0 4 4 4 h${width - 8} q4 0 4 -4 v-48 q0 -4 -4 -4 ${
    raised ? `h-${width - labelWidth - 14}` : "z"
  }`;

  const handleFocus = () => {
    focused = true;
  };

  const handleBlur = () => {
    focused = false;
  };

  const handleInput = (e: InputEvent) => {
    const val = (e.target as HTMLInputElement).value;
    value = type.match(/^(number|range)$/) ? +val : val;
  };
</script>

<div class="form-control">
  <div
    class="container shape-extra-small"
    class:focused
    class:disabled
    use:onResize={(rect) => (width = rect.width)}
  >
    <input
      class="input color-on-surface typography-body-large"
      class:focused
      {id}
      {type}
      {name}
      {value}
      {disabled}
      on:focus={handleFocus}
      on:blur={handleBlur}
      on:input={handleInput}
      {required}
      minlength={minLength}
      maxlength={maxLength}
      {autocomplete}
      placeholder=" "
    />
    <svg class="outline">
      <path d={borderPath} />
    </svg>
    <label
      class="label color-on-surface-variant"
      class:typography-body-large={!raised}
      class:typography-body-small={raised}
      class:focused
      class:raised
      use:onResize={(rect) => (labelWidth = rect.width)}
      for={id}
    >
      {label}
    </label>
  </div>
  {#if supportText}
    <div
      class="support-text color-on-surface typography-body-small"
      class:disabled
      class:error
    >
      {supportText}
    </div>
  {/if}
</div>

<style lang="sass">
  @use "../config/animation"

  .form-control
    margin-top: 16px
    position: relative

  .outline
    pointer-events: none
    position: absolute
    top: -4px
    left: -4px
    width: calc(100% + 8px)
    height: 64px
    fill: none

  .container
    height: 56px
    stroke: var(--color-outline)
    stroke-width: 1px
    transition: stroke animation.$faster ease-in-out

    &.disabled
      .outline
        opacity: 0.12

      .input, .label
        opacity: 0.38

    &.focused
      stroke: var(--color-primary)
      stroke-width: 2px

    &:not(.focused):not(.disabled):hover
      stroke: var(--color-on-surface)

      .label
        color: var(--color-on-surface)

  .input
    box-sizing: border-box
    padding: 16px
    width: 100%
    height: 56px
    outline: none
    background: none
    border: none
    filter: none

  .label
    pointer-events: none
    position: absolute
    top: 0
    left: 0
    transform-origin: top left
    transform: translate(16px, 16px)
    transition: transform animation.$faster ease-in-out, color animation.$faster ease-in-out

    &.focused
      color: var(--color-primary)

    &.raised
      transform: translate(8px, -8px)

  .support-text
    margin: 4px 16px 0

    &.disabled
      opacity: 0.38

    &.error
      color: var(--color-error)
</style>

<script lang="ts" context="module">
  let counter = 0;
</script>

<script lang="ts">
  export let type = "text";
  export let name = undefined;
  export let value: number | string = "";
  export let required = false;
  export let autocomplete = undefined;
  export let label = "";

  const id = `t${counter++}`;
  const handleInput = (e: InputEvent) => {
    const val = (e.target as HTMLInputElement).value;
    value = type.match(/^(number|range)$/) ? +val : val;
  };
</script>

<div class="form-control">
  <input {id} {type} {name} {value} on:input={handleInput} {required} {autocomplete} />
  <div class="outline" />
  <label for={id}>{label}</label>
</div>

<style lang="sass">
  .form-control
    margin-top: 16px
    position: relative
    background-color: var(--paper-color)

    input
      font: inherit
      box-sizing: border-box
      padding: 16px
      width: 100%
      outline: none
      background: none
      border: none
      filter: none

    label
      position: absolute
      top: 0
      left: 0
      transform: translate(7px, -9px) scale(0.75)
      transform-origin: top left
      background-color: var(--paper-color)
      padding: 0 10px

    .outline
      pointer-events: none
      border: 1px solid var(--divider-color)
      border-radius: 4px
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 0

    input:hover ~ .outline
      border-color: black

    input:focus ~ label
      color: var(--secondary-color)

    input:focus ~ .outline
      border-color: var(--secondary-color)
      border-width: 2px
</style>

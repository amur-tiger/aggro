<script lang="ts" context="module">
  let counter = 0;
</script>

<script lang="ts">
  export let type = "text";
  export let name = undefined;
  export let value: number | string = "";
  export let required = false;
  export let minLength: number | undefined;
  export let maxLength: number | undefined;
  export let autocomplete = undefined;
  export let label = "";
  export let helperText = "";

  const id = `t${counter++}`;
  const handleInput = (e: InputEvent) => {
    const val = (e.target as HTMLInputElement).value;
    value = type.match(/^(number|range)$/) ? +val : val;
  };
</script>

<div>
  <div class="form-control">
    <input
      {id}
      {type}
      {name}
      {value}
      on:input={handleInput}
      {required}
      minlength={minLength}
      maxlength={maxLength}
      {autocomplete}
      placeholder=" "
    />
    <div class="outline" />
    <label for={id}>{label}</label>
    {#if helperText}
      <div class="helper-text">{helperText}</div>
    {/if}
  </div>
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
      height: 56px
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
      padding: 0 4px

    .outline
      pointer-events: none
      border: 1px solid var(--divider-color)
      border-radius: 4px
      position: absolute
      top: 0
      left: 0
      right: 0
      height: 56px

    .helper-text
      color: var(--error-color)
      display: none
      font-size: .84rem
      margin: 2px 8px 0

    input:hover ~ .outline
      border-color: black

    input:focus ~ label
      color: var(--secondary-color)

    input:focus ~ .outline
      border-color: var(--secondary-color)
      border-width: 2px

    input:not(:focus):not(:placeholder-shown):invalid ~ label
      color: var(--error-color)

    input:not(:focus):not(:placeholder-shown):invalid ~ .outline
      border-color: var(--error-color)
      border-width: 2px

    input:not(:focus):not(:placeholder-shown):invalid ~ .helper-text
      display: block
</style>

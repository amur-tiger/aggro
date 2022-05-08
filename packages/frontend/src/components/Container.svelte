<script lang="ts">
  export let elevation: number = 0;
</script>

<div
  class:elevation-0={elevation === 0}
  class:elevation-1={elevation === 1}
  class:elevation-2={elevation === 2}
  class:elevation-3={elevation === 3}
  class:elevation-4={elevation === 4}
  class:elevation-5={elevation === 5}
  class:elevation-6={elevation === 6}
  class:elevation-7={elevation === 7}
  class:elevation-8={elevation === 8}
  class:elevation-9={elevation === 9}
  class:elevation-10={elevation === 10}
  class:elevation-11={elevation === 11}
  class:elevation-12={elevation === 12}
  class:elevation-13={elevation === 13}
  class:elevation-14={elevation === 14}
  class:elevation-15={elevation === 15}
  class:elevation-16={elevation === 16}
  class:elevation-17={elevation === 17}
  class:elevation-18={elevation === 18}
  class:elevation-19={elevation === 19}
  class:elevation-20={elevation === 20}
  class:elevation-21={elevation === 21}
  class:elevation-22={elevation === 22}
  class:elevation-23={elevation === 23}
  class:elevation-24={elevation === 24}
>
  <slot />
</div>

<style lang="sass">
  @use "../config/shadows"
</style>

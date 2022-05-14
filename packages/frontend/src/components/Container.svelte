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

  .elevation-0
    box-shadow: shadows.$elevation-0

  .elevation-1
    box-shadow: shadows.$elevation-1

  .elevation-2
    box-shadow: shadows.$elevation-2

  .elevation-3
    box-shadow: shadows.$elevation-3

  .elevation-4
    box-shadow: shadows.$elevation-4

  .elevation-5
    box-shadow: shadows.$elevation-5

  .elevation-6
    box-shadow: shadows.$elevation-6

  .elevation-7
    box-shadow: shadows.$elevation-7

  .elevation-8
    box-shadow: shadows.$elevation-8

  .elevation-9
    box-shadow: shadows.$elevation-9

  .elevation-10
    box-shadow: shadows.$elevation-10

  .elevation-11
    box-shadow: shadows.$elevation-11

  .elevation-12
    box-shadow: shadows.$elevation-12

  .elevation-13
    box-shadow: shadows.$elevation-13

  .elevation-14
    box-shadow: shadows.$elevation-14

  .elevation-15
    box-shadow: shadows.$elevation-15

  .elevation-16
    box-shadow: shadows.$elevation-16

  .elevation-17
    box-shadow: shadows.$elevation-17

  .elevation-18
    box-shadow: shadows.$elevation-18

  .elevation-19
    box-shadow: shadows.$elevation-19

  .elevation-20
    box-shadow: shadows.$elevation-20

  .elevation-21
    box-shadow: shadows.$elevation-21

  .elevation-22
    box-shadow: shadows.$elevation-22

  .elevation-23
    box-shadow: shadows.$elevation-23

  .elevation-24
    box-shadow: shadows.$elevation-24
</style>

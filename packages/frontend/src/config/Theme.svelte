<style global lang="sass">
  @use "./mixins"

  @mixin colorPalette($name, $color)
    --color-#{$name}: #{change-color($color, $lightness: 40%)}
    --color-on-#{$name}: #{change-color($color, $lightness: 100%)}
    --color-#{$name}-container: #{change-color($color, $lightness: 90%)}
    --color-on-#{$name}-container: #{change-color($color, $lightness: 10%)}

    @media (prefers-color-scheme: dark)
      --color-#{$name}: #{change-color($color, $lightness: 80%)}
      --color-on-#{$name}: #{change-color($color, $lightness: 20%)}
      --color-#{$name}-container: #{change-color($color, $lightness: 30%)}
      --color-on-#{$name}-container: #{change-color($color, $lightness: 90%)}

  $fontFamily: "Open Sans", sans-serif
  $primaryColor: #d32f2f
  $secondaryColor: #1976d2
  $neutralColor: #f2f2f2
  $neutralVariantColor: #f2f2f2
  $errorColor: #ff5d48

  #{":root"}
    font-family: #{$fontFamily}
    font-size: 14px
    font-weight: 400
    line-height: 20px

    @include colorPalette("primary", $primaryColor)
    @include colorPalette("secondary", $secondaryColor)
    @include colorPalette("error", $errorColor)

    --color-background: #{change-color($neutralColor, $lightness: 99%)}
    --color-on-background: #{change-color($neutralColor, $lightness: 10%)}
    --color-surface: #{change-color($neutralColor, $lightness: 99%)}
    --color-on-surface: #{change-color($neutralColor, $lightness: 10%)}

    --color-surface-variant: #{change-color($neutralVariantColor, $lightness: 90%)}
    --color-on-surface-variant: #{change-color($neutralVariantColor, $lightness: 30%)}
    --color-outline: #{change-color($neutralVariantColor, $lightness: 50%)}

    @media (prefers-color-scheme: dark)
      --color-background: #{change-color($neutralColor, $lightness: 10%)}
      --color-on-background: #{change-color($neutralColor, $lightness: 90%)}
      --color-surface: #{change-color($neutralColor, $lightness: 10%)}
      --color-on-surface: #{change-color($neutralColor, $lightness: 90%)}

      --color-surface-variant: #{change-color($neutralVariantColor, $lightness: 30%)}
      --color-on-surface-variant: #{change-color($neutralVariantColor, $lightness: 80%)}
      --color-outline: #{change-color($neutralVariantColor, $lightness: 60%)}

  .typography-display-large
    font-family: #{$fontFamily}
    font-size: 57px
    font-weight: 400
    line-height: 64px

  .typography-display-medium
    font-family: #{$fontFamily}
    font-size: 45px
    font-weight: 400
    line-height: 52px

  .typography-display-small
    font-family: #{$fontFamily}
    font-size: 36px
    font-weight: 400
    line-height: 44px

  .typography-headline-large
    font-family: #{$fontFamily}
    font-size: 32px
    font-weight: 400
    line-height: 40px

  .typography-headline-medium
    font-family: #{$fontFamily}
    font-size: 28px
    font-weight: 400
    line-height: 36px

  .typography-headline-small
    font-family: #{$fontFamily}
    font-size: 24px
    font-weight: 400
    line-height: 32px

  .typography-title-large
    font-family: #{$fontFamily}
    font-size: 22px
    font-weight: 500
    line-height: 28px

  .typography-title-medium
    font-family: #{$fontFamily}
    font-size: 16px
    font-weight: 500
    line-height: 24px

  .typography-title-small
    font-family: #{$fontFamily}
    font-size: 14px
    font-weight: 500
    line-height: 20px

  .typography-label-large
    font-family: #{$fontFamily}
    font-size: 14px
    font-weight: 400
    line-height: 20px

  .typography-label-medium
    font-family: #{$fontFamily}
    font-size: 12px
    font-weight: 400
    line-height: 16px

  .typography-label-small
    font-family: #{$fontFamily}
    font-size: 11px
    font-weight: 400
    line-height: 16px

  .typography-body-large
    font-family: #{$fontFamily}
    font-size: 16px
    font-weight: 400
    line-height: 24px

  .typography-body-medium
    font-family: #{$fontFamily}
    font-size: 14px
    font-weight: 400
    line-height: 20px

  .typography-body-small
    font-family: #{$fontFamily}
    font-size: 12px
    font-weight: 400
    line-height: 16px

  .color-surface
    background-color: var(--color-surface)

  .color-on-surface
    fill: var(--color-on-surface)
    color: var(--color-on-surface)

  .color-surface-variant
    background-color: var(--color-surface-variant)

  .color-on-surface-variant
    fill: var(--color-on-surface-variant)
    color: var(--color-on-surface-variant)

  .tint-primary
    @include mixins.tint(var(--color-primary))

  .elevation-tint-0
    @include mixins.elevation-tint-0

  .elevation-tint-1
    @include mixins.elevation-tint-1

  .elevation-tint-2
    @include mixins.elevation-tint-2

  .elevation-tint-3
    @include mixins.elevation-tint-3

  .elevation-tint-4
    @include mixins.elevation-tint-4

  .elevation-tint-5
    @include mixins.elevation-tint-5

  .elevation-shadow-0
    @include mixins.elevation-shadow-0

  .elevation-shadow-1
    @include mixins.elevation-shadow-1

  .elevation-shadow-2
    @include mixins.elevation-shadow-2

  .elevation-shadow-3
    @include mixins.elevation-shadow-3

  .elevation-shadow-4
    @include mixins.elevation-shadow-4

  .elevation-shadow-5
    @include mixins.elevation-shadow-5

  .shape-none
    @include mixins.shape-none

  .shape-extra-small
    @include mixins.shape-extra-small

  .shape-extra-small-top
    @include mixins.shape-extra-small-top

  .shape-small
    @include mixins.shape-small

  .shape-medium
    @include mixins.shape-medium

  .shape-large
    @include mixins.shape-large

  .shape-large-end
    @include mixins.shape-large-end

  .shape-large-top
    @include mixins.shape-large-top

  .shape-extra-large
    @include mixins.shape-extra-large

  .shape-extra-large-top
    @include mixins.shape-extra-large-top

  .shape-full
    @include mixins.shape-full
</style>

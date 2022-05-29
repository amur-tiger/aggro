<div class="spinner-container">
  <svg class="spinner">
    <circle cx="20" cy="20" r="18" />
  </svg>
</div>

<style lang="scss">
  $spinnerSize: 40;

  .spinner-container {
    display: flex;
    justify-content: center;
    padding: 32px;
  }

  .spinner {
    width: $spinnerSize + px;
    height: $spinnerSize + px;

    circle {
      fill: transparent;
      stroke: var(--color-primary);
      stroke-width: 4;
      stroke-linecap: round;
      stroke-dasharray: (3.14 * $spinnerSize);
      transform-origin: (0.5px * $spinnerSize) (0.5px * $spinnerSize) 0;
      animation: spinner 2s linear infinite;
    }
  }

  @keyframes spinner {
    0% {
      transform: rotate(0deg);
      stroke-dashoffset: (0.66 * $spinnerSize);
    }
    50% {
      transform: rotate(720deg);
      stroke-dashoffset: (3.14 * $spinnerSize);
    }
    100% {
      transform: rotate(1080deg);
      stroke-dashoffset: (0.66 * $spinnerSize);
    }
  }
</style>

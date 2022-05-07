<script lang="ts">
  import Drawer from "./components/Drawer.svelte";
  import Reset from "./config/Reset.svelte";
  import Theme from "./config/Theme.svelte";
  import Login from "./Login.svelte";

  let open = false;

  const handleClose = () => {
    open = false;
  };
</script>

<Reset />
<Theme />

<div class="container">
  <Drawer {open} on:close={handleClose} />

  <main>
    main content
    <button on:click={() => (open = !open)}>open</button>

    <Login />
  </main>
</div>

<style lang="sass">
  :global(body)
    background-color: var(--background-color)

  .container
    display: flex
    align-items: stretch
    height: 100vh
</style>

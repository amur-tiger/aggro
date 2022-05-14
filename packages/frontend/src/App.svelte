<script lang="ts">
  import Drawer from "./components/Drawer.svelte";
  import Reset from "./config/Reset.svelte";
  import Theme from "./config/Theme.svelte";
  import Login from "./Login.svelte";
  import Spinner from "./Spinner.svelte";
  import { checkLogin, isLoggedIn, logout } from "./auth";

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
    {#await checkLogin()}
      <Spinner />
    {:then _}
      {#if $isLoggedIn}
        main content
        <button on:click={() => (open = !open)}>open</button>
        <button on:click={logout}>Logout</button>
      {:else}
        <Login />
      {/if}
    {/await}
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

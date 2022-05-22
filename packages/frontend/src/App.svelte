<script lang="ts">
  import Drawer from "./components/Drawer.svelte";
  import Reset from "./config/Reset.svelte";
  import Theme from "./config/Theme.svelte";
  import Login from "./Login.svelte";
  import Spinner from "./Spinner.svelte";
  import FeedList from "./SourceList.svelte";
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
      <div class="centered">
        <Spinner />
      </div>
    {:then _}
      {#if $isLoggedIn}
        main content
        <button on:click={() => (open = !open)}>open</button>
        <button on:click={logout}>Logout</button>

        <FeedList />
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

  .centered
    width: 100vw
    height: 100vh
    display: flex
    align-items: center
    justify-content: center
</style>

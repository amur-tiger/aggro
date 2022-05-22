<script lang="ts">
  import Drawer from "./components/Drawer.svelte";
  import Reset from "./config/Reset.svelte";
  import Theme from "./config/Theme.svelte";
  import Login from "./Login.svelte";
  import Spinner from "./Spinner.svelte";
  import FeedList from "./SourceList.svelte";
  import Sidebar from "./content/Sidebar.svelte";
  import Route from "./components/routing/Route.svelte";
  import { checkLogin, isLoggedIn, logout } from "./auth";
  import { t } from "./lang";
  import Router from "./components/routing/Router.svelte";

  let open = false;
  const handleClose = () => {
    open = false;
  };

  $: if (!$isLoggedIn) {
    sessionStorage.setItem("intended-route", window.location.pathname);
    history.pushState("", "", "/login");
  } else {
    const intended = sessionStorage.getItem("intended-route");
    sessionStorage.removeItem("intended-route");
    history.pushState("", "", intended || "/");
  }
</script>

<Reset />
<Theme />

<div class="container">
  <main>
    {#await checkLogin()}
      <div class="centered">
        <Spinner />
      </div>
    {:then _}
      <Router>
        {#if $isLoggedIn}
          <Drawer {open} on:close={handleClose}>
            <Sidebar on:close={handleClose} />
          </Drawer>

          <button on:click={() => (open = !open)}>open</button>
          <button on:click={logout}>Logout</button>

          <Route path="/settings" title={$t("title.settings")}>
            <button on:click={() => history.pushState("", "", "/")}>
              Home
            </button>
            <FeedList />
          </Route>

          <Route path="/" fallback>main page</Route>
        {:else}
          <Route path="/login" title={$t("title.login")}>
            <Login />
          </Route>
        {/if}
      </Router>
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

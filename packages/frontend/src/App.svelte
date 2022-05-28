<script lang="ts">
  import Reset from "./config/Reset.svelte";
  import Theme from "./config/Theme.svelte";
  import AppBar from "./components/AppBar.svelte";
  import Drawer from "./components/Drawer.svelte";
  import Spinner from "./components/Spinner.svelte";
  import Button from "./components/Button.svelte";
  import Router from "./components/routing/Router.svelte";
  import Route from "./components/routing/Route.svelte";
  import Login from "./content/Login.svelte";
  import Sidebar from "./content/Sidebar.svelte";
  import SourcesPage from "./content/sources/SourcesPage.svelte";
  import { checkLogin, isLoggedIn, logout } from "./auth";
  import { t } from "./lang";

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

<main>
  {#await checkLogin()}
    <div class="centered">
      <Spinner />
    </div>
  {:then _}
    <Router>
      {#if $isLoggedIn}
        <AppBar on:menuclick={() => (open = !open)} />

        <Drawer {open} on:close={handleClose}>
          <Sidebar on:close={handleClose} />
        </Drawer>

        <Button variant="tonal" on:click={logout}>Logout</Button>

        <Route path="/settings" title={$t("title.settings")}>
          <Button
            variant="text"
            on:click={() => history.pushState("", "", "/")}
          >
            Home
          </Button>
          (settings)
        </Route>

        <Route path="/sources" title={$t("title.sources")}>
          <SourcesPage />
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

<style lang="sass">
  :global(body)
    background-color: var(--color-background)

  .centered
    width: 100vw
    height: 100vh
    display: flex
    align-items: center
    justify-content: center
</style>

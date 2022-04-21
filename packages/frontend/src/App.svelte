<script lang="ts">
  import { ApolloClient, InMemoryCache } from "@apollo/client/core";
  import { setClient } from "svelte-apollo";
  import Drawer, { AppContent, Content, Header, Scrim } from "@smui/drawer";
  import Reset from "./config/Reset.svelte";
  import Theme from "./config/Theme.svelte";
  import FeedList from "./FeedList.svelte";

  setClient(
    new ApolloClient({
      cache: new InMemoryCache(),
      uri: "/graphql",
    })
  );

  let open = false;
</script>

<Reset />
<Theme />

<div class="container">
  <Drawer variant="modal" bind:open>
    <Header>drawer content</Header>
    <Content>
      <!-- drawer needs at least one focusable element to work -->
      <a href="https://github.com/amur-tiger/aggro">dummy link</a>
      <FeedList />
    </Content>
  </Drawer>

  <Scrim />

  <AppContent>
    <main>
      main content
      <button on:click={() => (open = !open)}>open</button>
    </main>
  </AppContent>
</div>

<style lang="sass">
  @import "@smui/drawer/bare.css"

  :global(body)
    background-color: var(--mdc-theme-background)

  .container
    display: flex
    align-items: stretch
    height: 100vh
</style>

<script lang="ts">
  import { ApolloClient, InMemoryCache } from "@apollo/client/core";
  import { setClient } from "svelte-apollo";
  import Reset from "./config/Reset.svelte";
  import Theme from "./config/Theme.svelte";
  import FeedList from "./FeedList.svelte";

  setClient(
    new ApolloClient({
      cache: new InMemoryCache(),
      uri: "/graphql",
    })
  );
</script>

<Reset />
<Theme />

<div class="container">
  <FeedList />
  <main>
    main content
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

<script lang="ts">
  import Card from "./components/Card.svelte";
  import Textfield from "./components/Textfield.svelte";

  let email = "";
  let password = "";
</script>

<Card>
  <Textfield
    type="email"
    label="E-Mail"
    bind:value={email}
    required
    autocomplete="username"
  />
  <Textfield
    type="password"
    label="Password"
    bind:value={password}
    required
    autocomplete="current-password"
  />
</Card>

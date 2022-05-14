<script lang="ts">
  import Card from "./components/Card.svelte";
  import Textfield from "./components/Textfield.svelte";
  import Button from "./components/Button.svelte";
  import { login } from "./auth";

  let mail = "";
  let password = "";

  const handleSubmit = (e) => {
    e.preventDefault();
    login(mail, password);
  };
</script>

<div class="centered">
  <Card>
    <h1>Aggro</h1>

    <form on:submit={handleSubmit}>
      <div>
        <Textfield
          type="email"
          label="E-Mail"
          bind:value={mail}
          required
          autocomplete="username"
        />
      </div>

      <div>
        <Textfield
          type="password"
          label="Password"
          bind:value={password}
          required
          autocomplete="current-password"
        />
      </div>

      <div class="submit">
        <Button>Einloggen</Button>
      </div>
    </form>
  </Card>
</div>

<style lang="sass">
  .centered
    width: 100vw
    height: 100vh
    display: flex
    align-items: center
    justify-content: center

  .submit
    text-align: right
    margin-top: 16px
</style>

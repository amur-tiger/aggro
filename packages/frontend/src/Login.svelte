<script lang="ts">
  import Card from "./components/Card.svelte";
  import Textfield from "./components/Textfield.svelte";
  import Button from "./components/Button.svelte";
  import { login } from "./auth";

  let mail = "";
  let password = "";
  let loading = false;

  const handleSubmit = (e) => {
    e.preventDefault();
    loading = true;
    login(mail, password).finally(() => {
      loading = false;
    });
  };
</script>

<div class="centered">
  <Card>
    <h1>Aggro</h1>

    <form on:submit={handleSubmit} class="login-form">
      <div>
        <Textfield
          type="email"
          label="E-Mail"
          bind:value={mail}
          required
          autocomplete="username"
          helperText="Insert valid e-mail address"
        />
      </div>

      <div>
        <Textfield
          type="password"
          label="Password"
          bind:value={password}
          required
          minLength="8"
          autocomplete="current-password"
          helperText="Password must have at least 8 characters"
        />
      </div>

      <div class="submit">
        <Button disabled={loading}>Einloggen</Button>
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

  .login-form
    width: 300px

  .submit
    text-align: right
    margin-top: 16px
</style>

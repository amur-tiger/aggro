<script lang="ts">
  import Card from "./components/Card.svelte";
  import Textfield from "./components/Textfield.svelte";
  import Button from "./components/Button.svelte";
  import AggroIcon from "./icons/aggro.svg";
  import { login } from "./auth";
  import { t } from "./lang";

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
    <h1 class="title">
      <AggroIcon size="40" />&nbsp;
      <span>{$t("login.title")}</span>
    </h1>

    <form on:submit={handleSubmit} class="login-form">
      <div>
        <Textfield
          type="email"
          label={$t("login.mail")}
          bind:value={mail}
          required
          autocomplete="username"
          helperText={$t("login.mail.helper-text")}
        />
      </div>

      <div>
        <Textfield
          type="password"
          label={$t("login.password")}
          bind:value={password}
          required
          minLength="8"
          autocomplete="current-password"
          helperText={$t("login.password.helper-text")}
        />
      </div>

      <div class="submit">
        <Button disabled={loading}>{$t("login.submit")}</Button>
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

  .title
    display: flex
    align-items: center
    fill: var(--primary-color)

  .submit
    text-align: right
    margin-top: 16px
</style>

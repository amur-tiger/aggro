import { createSignal } from "solid-js";
import { t } from "../lang";
import { Card, FormControl } from "../components";
import AggroIcon from "../assets/icons/aggro.svg";
import { login } from "../auth";
import { navigate } from "../location";
import "./Login.sass";

export default function Login() {
  const [mail, setMail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [isLoading, setLoading] = createSignal(false);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    setLoading(true);
    login(mail(), password())
      .then(() => {
        const intended = sessionStorage.getItem("intended-route") || "/";
        sessionStorage.removeItem("intended-route");
        navigate(intended);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div class="centered-container">
      <form onSubmit={handleSubmit}>
        <Card>
          <div class="card-header login-header">
            <AggroIcon size="40" />
            <h2>{t("login.title")}</h2>
          </div>

          <div class="card-body">
            <FormControl
              type="email"
              value={mail()}
              label={t("login.mail")}
              required
              autocomplete="username"
              // supportText={t("login.mail.helper-text")}
              onInput={(e) => setMail(e.currentTarget.value)}
            />

            <FormControl
              type="password"
              value={password()}
              label={t("login.password")}
              required
              autocomplete="current-password"
              minlength="8"
              // supportText={t("login.password.helper-text")}
              onInput={(e) => setPassword(e.currentTarget.value)}
            />
          </div>

          <div class="card-actions login-actions">
            <button disabled={isLoading()} onClick={handleSubmit}>
              {t("login.submit")}
            </button>
          </div>
        </Card>
      </form>
    </div>
  );
}

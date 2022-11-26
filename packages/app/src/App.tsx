import { createSignal, Match, Switch } from "solid-js";
import { logout, userData } from "./auth";
import { navigate } from "./location";
import { t } from "./lang";
import { Drawer, Route, Router, Spinner } from "./components";
import Login from "./core/Login";
import SourceList from "./domains/sources/SourceList";
import Redirect from "./components/redirect/Redirect";
import {Suspense} from "solid-js/web";

export default function App() {
  const [isOpen, setOpen] = createSignal(false);

  return (
    <Router>
      <Switch>
        <Match when={userData.loading}>
          <Spinner />
        </Match>

        <Match when={userData()?.isLoggedIn}>
          <Route path="/">
            <div>
              <button onClick={() => logout()}>logout</button>
              <button onClick={() => setOpen(true)}>open</button>
              <button onClick={() => navigate("/sources")}>sources</button>
              <Drawer open={isOpen()} onClose={() => setOpen(false)}>drawer</Drawer>
            </div>
          </Route>

          <Route path="/sources" title={t("title.sources")}>
            <button onClick={() => navigate("/")}>root</button>

            <Suspense fallback={<Spinner />}>
              <SourceList />
            </Suspense>
          </Route>

          <Route path={/^\/.*/}>
            <Redirect to="/" />
          </Route>
        </Match>

        <Match when={!userData()?.isLoggedIn}>
          <Route path="/login" title={t("title.login")}>
            <Login />
          </Route>

          <Route path={/^\/.*/}>
            {() => {
              sessionStorage.setItem("intended-route", window.location.pathname);
              return <Redirect to="/login" />;
            }}
          </Route>
        </Match>
      </Switch>
    </Router>
  );
}

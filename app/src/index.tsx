import { render } from "solid-js/web";
import App from "./App";

import "./reset.scss";
import "./config.sass";
import "./common.sass";

render(() => <App />, document.getElementById("app")!);

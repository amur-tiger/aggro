import { JSXElement, Match } from "solid-js";
import { location } from "../../location";

export interface RouteProps {
  path: string | RegExp;
  title?: string;
  children?: JSXElement;
}

export default function Route(props: RouteProps) {
  return (
    <Match when={typeof props.path === "string" ? props.path === location() : props.path.test(location())}>
      {() => {
        window.document.title = props.title ? `${props.title} - Aggro` : "Aggro";
        return props.children;
      }}
    </Match>
  );
}

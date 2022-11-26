import { children, JSXElement, Switch } from "solid-js";

export interface RouterProps {
  fallback?: JSXElement;
  children?: JSXElement;
}

export default function Router(props: RouterProps) {
  return <Switch fallback={props.fallback}>{children(() => props.children)}</Switch>;
}

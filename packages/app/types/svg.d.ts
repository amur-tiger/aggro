declare module "*.svg" {
  import { JSXElement } from "solid-js";

  export default function (props: { size?: string; width?: string; height?: string }): JSXElement;
}

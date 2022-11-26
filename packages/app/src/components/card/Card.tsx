import { children, JSXElement } from "solid-js";
import "./Card.sass";

export interface CardProps {
  children?: JSXElement;
}

export default function Card(props: CardProps) {
  const c = children(() => props.children);

  return <section class="card">{c}</section>;
}

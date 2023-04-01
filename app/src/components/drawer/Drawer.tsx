import { createEffect, createSignal, JSXElement, Show } from "solid-js";
import Scrim from "../scrim/Scrim";
import "./Drawer.sass";
import { Portal } from "solid-js/web";
import { animation } from "../../config";

export interface DrawerProps {
  open?: boolean;
  onClose?: () => void;
  class?: string;
  children?: JSXElement;
}

export default function Drawer(props: DrawerProps) {
  const [isVisible, setVisible] = createSignal(props.open);
  const [isShown, setShown] = createSignal(props.open);

  createEffect(() => {
    if (props.open) {
      setVisible(true);
      setTimeout(() => {
        setShown(true);
      }, 0);
    } else {
      setShown(false);
      setTimeout(() => {
        setVisible(false);
      }, animation.fast);
    }
  });

  return (
    <>
      <Portal>
        <Show when={isVisible()}>
          <div class="drawer-container" classList={{ shown: isShown() }}>
            <div class={"drawer" + (props.class ? ` ${props.class}` : "")}>{props.children}</div>
          </div>
        </Show>
      </Portal>

      <Scrim open={props.open} onClose={props.onClose} />
    </>
  );
}

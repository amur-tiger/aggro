import { createEffect, createSignal, onCleanup, onMount, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { animation } from "../../config";
import "./Scrim.sass";

export interface ScrimProps {
  open?: boolean;
  onClose?: () => void;
}

export default function Scrim(props: ScrimProps) {
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
      }, animation.faster);
    }
  });

  const handleClick = () => {
    if (props.onClose && props.open) {
      props.onClose();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (props.onClose && props.open && e.key === "Escape") {
      props.onClose();
    }
  };

  onMount(() => {
    document.addEventListener("keydown", handleKeyDown);
  });

  onCleanup(() => {
    document.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <Portal>
      <Show when={isVisible()}>
        <div class="scrim" classList={{ show: isShown() }} onClick={handleClick}></div>
      </Show>
    </Portal>
  );
}

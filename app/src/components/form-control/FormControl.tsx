import { createUniqueId, JSX } from "solid-js";
import "./FormControl.sass";

export interface FormControlProps {
  label?: string;
  type?: string;
  value?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  autocomplete?: string;
  minlength?: number | string;
  onInput?: JSX.EventHandlerUnion<HTMLInputElement, InputEvent>;
}

export default function FormControl(props: FormControlProps) {
  const id = createUniqueId();

  return (
    <div class="form-control">
      <input
        id={id}
        type={props.type}
        value={props.value}
        name={props.name}
        disabled={props.disabled}
        required={props.required}
        autocomplete={props.autocomplete}
        minlength={props.minlength}
        onInput={props.onInput}
      />
      <div class="outline"></div>
      <label for={id}>{props.label}</label>
    </div>
  );
}

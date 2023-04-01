import { navigate } from "../../location";

export interface RedirectProps {
  to: string;
}

export default function Redirect(props: RedirectProps) {
  navigate(props.to);
  return null;
}

import { ParentProps } from "solid-js";

export default function Message(props: ParentProps) {
  return <p class="pt-2 text-center text-primary-foreground">{props.children}</p>;
}

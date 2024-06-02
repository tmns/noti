import { A } from "@solidjs/router";
import { ParentProps } from "solid-js";

interface Props extends ParentProps {
  href: string;
}

export default function IconLink(props: Props) {
  return (
    <A
      href={props.href}
      class="text-muted-foreground hover:text-primary-foreground transition-colors ml-auto"
    >
      {props.children}
    </A>
  );
}

import { cn } from "../libs/cn";
import { type ComponentProps, splitProps, JSX, ParentProps } from "solid-js";

function CardRoot(props: ComponentProps<"div">) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div class="bg-card rounded-lg">
      <div
        class={cn(
          "rounded-lg bg-card text-card-foreground shadow-sm hover:bg-card-hover border border-card-border",
          local.class,
        )}
        {...rest}
      />
    </div>
  );
}

function CardHeader(props: ComponentProps<"div">) {
  const [local, rest] = splitProps(props, ["class"]);

  return <div class={cn("flex flex-col space-y-1.5 p-4 relative", local.class)} {...rest} />;
}

function CardTitle(props: ComponentProps<"h1">) {
  const [local, rest] = splitProps(props, ["class"]);

  return <h1 class={cn("text-xs max-w-96 truncate group-hover:max-w-72", local.class)} {...rest} />;
}

function CardDescription(props: ComponentProps<"h3">) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <h3
      class={cn(
        "font-semibold text-sm leading-none tracking-tight max-w-96 truncate group-hover:max-w-72",
        local.class,
      )}
      {...rest}
    />
  );
}

function CardContent(props: ComponentProps<"div">) {
  const [local, rest] = splitProps(props, ["class"]);

  return <div class={cn("p-6 pt-0", local.class)} {...rest} />;
}

interface CardButtonProps extends ParentProps {
  onClick: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
}

function CardButton(props: CardButtonProps) {
  return (
    <button
      onClick={props.onClick}
      class="p-2 rounded bg-card-hover hover:bg-card-button-hover transition-colors"
    >
      {props.children}
    </button>
  );
}

export default {
  Root: CardRoot,
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Button: CardButton,
};

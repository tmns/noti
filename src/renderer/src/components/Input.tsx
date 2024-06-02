import { cn } from "@renderer/libs/cn";
import { splitProps } from "solid-js";

interface Props {
  id: string;
  name: string;
  type: string;
  label: string;
  error?: () => string;
}
export function Input(props: Props) {
  const [local, rest] = splitProps(props, ["label"]);

  return (
    <div class="flex flex-col gap-2">
      <label for={rest.name} class="text-sm font-medium text-primary-foreground">
        {local.label}
      </label>
      <input
        {...rest}
        class={cn(
          "rounded-md border border-card-border bg-card-hover p-2 text-sm text-primary-foreground focus:outline-none",
          !!props.error?.() ? "ring-1 ring-red-500" : "focus:ring-2 focus:ring-primary",
        )}
      />
      {!!props.error?.() && <p class="text-red-500 text-xs">{props.error()}</p>}
    </div>
  );
}

import { cn } from "@renderer/libs/cn";
import { JSX, ParentProps } from "solid-js";

interface Props extends ParentProps {
  title: string;
  onSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent>;
  class?: string;
  isSubmitting?: () => boolean;
}
export function Form(props: Props) {
  return (
    <div class={cn("flex items-center justify-center h-[600px]", props.class)}>
      <form
        class="bg-card rounded-lg p-6 w-96 border border-card-border shadow-sm"
        onSubmit={props.onSubmit}
      >
        <h2 class="text-lg font-semibold mb-4 text-primary-foreground">{props.title}</h2>
        <div class="space-y-4">{props.children}</div>
        <button
          type="submit"
          class="w-full rounded-md bg-secondary/90 p-2 text-sm font-medium text-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary mt-6 transition-colors"
        >
          Submit{props.isSubmitting?.() ? "ting..." : ""}
        </button>
      </form>
    </div>
  );
}

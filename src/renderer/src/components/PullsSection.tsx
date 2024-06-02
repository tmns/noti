import Card from "@renderer/components/Card";
import { PullRequestIcon } from "@renderer/components/icons/PullRequestIcon";
import { RightUpwardArrowIcon } from "@renderer/components/icons/RightUpwardArrowIcon";
import { Pulls } from "@renderer/githubTypes";
import { cn } from "@renderer/libs/cn";
import { splitProps, For, ParentProps } from "solid-js";

interface PullsHeaderProps extends ParentProps {
  class?: string;
}

function PullsHeader(props: PullsHeaderProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div class={cn("flex justify-between items-center", local.class)}>
      <h2 class="text-primary-foreground pl-2 pb-1">{rest.children}</h2>
    </div>
  );
}

interface PullsListProps {
  pulls: Pulls;
  class?: string;
}

function PullsList(props: PullsListProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div class={cn("flex flex-col gap-y-1 justify-center", local.class)}>
      <For fallback={<p>Loading...</p>} each={rest.pulls}>
        {(p) => {
          return (
            <Card.Root>
              <Card.Header class="group">
                <div class="flex items-center gap-x-1">
                  <div class="text-accent">
                    <PullRequestIcon />
                  </div>
                  <Card.Title class="text-sm font-bold">{p.title}</Card.Title>
                </div>
                <Card.Description class="text-xs font-normal">{p.body}</Card.Description>
                <div class="absolute top-1 right-2">
                  <div class="hidden group-hover:flex">
                    <Card.Button onClick={() => open(p.html_url)}>
                      <RightUpwardArrowIcon />
                    </Card.Button>
                  </div>
                </div>
              </Card.Header>
            </Card.Root>
          );
        }}
      </For>
    </div>
  );
}

export default {
  Header: PullsHeader,
  List: PullsList,
};

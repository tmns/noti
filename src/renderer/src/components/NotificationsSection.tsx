import Card from "@renderer/components/Card";
import { createTimeAgo } from "@solid-primitives/date";
import { JSX, For, splitProps, createResource, ParentProps } from "solid-js";
import en from "javascript-time-ago/locale/en";
import TimeAgo from "javascript-time-ago";
import { generateGitHubWebUrl, getReason } from "@renderer/utils/helpers";
import { PullRequestMergedIcon } from "@renderer/components/icons/PullRequestMergedIcon";
import { RightUpwardArrowIcon } from "@renderer/components/icons/RightUpwardArrowIcon";
import { Notification } from "@renderer/githubTypes";
import { cn } from "@renderer/libs/cn";
import { PullRequestIcon } from "@renderer/components/icons/PullRequestIcon";
import { PullRequestClosedIcon } from "@renderer/components/icons/PullRequestClosedIcon";

// Create formatter (English).
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

interface NotificationsSectionHeaderProps extends ParentProps {
  action: () => void;
  icon: JSX.Element;
  class?: string;
}

function NotificationsSectionHeader(props: NotificationsSectionHeaderProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div class={cn("flex justify-between items-center", local.class)}>
      <h2 class="text-primary-foreground pl-2 pb-1">{rest.children}</h2>
      <button
        class="hover:text-primary-foreground text-muted-foreground transition-colors p-2"
        onClick={rest.action}
      >
        {rest.icon}
      </button>
    </div>
  );
}

interface NotifcationsListProps {
  notifications: Notification[];
  action: (n: Notification) => void;
  icon: JSX.Element;
  class?: string;
}

function NotificationsSectionList(props: NotifcationsListProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div class={cn("flex flex-col gap-y-1 justify-center", local.class)}>
      <For
        fallback={<p>Loading...</p>}
        each={Array.from(rest.notifications).sort(
          (x, y) => new Date(y.updated_at).getTime() - new Date(x.updated_at).getTime(),
        )}
      >
        {(n) => {
          const [time] = createTimeAgo(n.updated_at, {
            relativeFormatter: (_, date) => timeAgo.format(date, "mini"),
          });
          const [url] = createResource(() => generateGitHubWebUrl(n));

          return (
            <Card.Root>
              <Card.Header class="group">
                <div class="flex items-center gap-x-1">
                  {n.subject.type === "PullRequest" && (
                    <>
                      {n.pull?.merged && <PullRequestMergedIcon />}
                      {!n.pull?.merged && n.pull?.state === "closed" && <PullRequestClosedIcon />}
                      {n.pull?.state !== "closed" && (
                        <div class="text-accent">
                          <PullRequestIcon />
                        </div>
                      )}
                    </>
                  )}
                  <Card.Title>
                    {getReason(n)} <span class="text-muted-foreground">in</span> {n.repository.name}
                  </Card.Title>
                </div>
                <Card.Description>{n.subject.title}</Card.Description>
                <div class="absolute top-1 right-2">
                  <div class="text-xs text-muted-foreground group-hover:hidden">{time()}</div>
                  <div class="hidden group-hover:flex gap-x-1">
                    <Card.Button onClick={() => open(url())}>
                      <RightUpwardArrowIcon />
                    </Card.Button>
                    <Card.Button onClick={() => rest.action(n)}>{rest.icon}</Card.Button>
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

function NotificationsSectionSkeleton() {
  return (
    <div class="flex flex-col gap-y-1 justify-center">
      <For each={Array.from({ length: 3 }).map((_, i) => i)}>
        {() => <Card.Root class="animate-pulse h-20" />}
      </For>
    </div>
  );
}

export default {
  Header: NotificationsSectionHeader,
  List: NotificationsSectionList,
  Skeleton: NotificationsSectionSkeleton,
};

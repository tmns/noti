import { CheckIcon } from "@renderer/components/icons/CheckIcon";
import { TrashIcon } from "@renderer/components/icons/TrashIcon";
import Message from "@renderer/components/Message";
import NotificationsSection from "@renderer/components/NotificationsSection";
import { Match, Show, Switch } from "solid-js";
import { useGlobalStore } from "@renderer/context/GlobalStoreProvider";

export default function Notifications() {
  const [
    { displayedUnread, displayedRead, searchQuery, isInitialLoading, isAuthError },
    { markAsRead, markAllAsRead, remove, removeAll },
  ] = useGlobalStore();

  return (
    <>
      <Show
        when={displayedUnread().length}
        fallback={
          <NotificationsListFallback
            isInitialLoading={isInitialLoading}
            isAuthError={isAuthError}
            searchQuery={searchQuery}
          />
        }
      >
        <NotificationsSection.Header action={markAllAsRead} icon={<CheckIcon />}>
          Unread ({displayedUnread().length})
        </NotificationsSection.Header>
        <NotificationsSection.List
          notifications={displayedUnread()}
          action={markAsRead}
          icon={<CheckIcon />}
        />
      </Show>
      <Show when={displayedRead().length}>
        <NotificationsSection.Header
          class="not-only-of-type:pt-4"
          action={removeAll}
          icon={<TrashIcon />}
        >
          Read ({displayedRead().length})
        </NotificationsSection.Header>
        <NotificationsSection.List
          class="opacity-50"
          notifications={displayedRead()}
          action={remove}
          icon={<TrashIcon />}
        />
      </Show>
    </>
  );
}

interface NotificationsListFallbackProps {
  isInitialLoading: () => boolean;
  isAuthError: () => boolean;
  searchQuery: () => string;
}

function NotificationsListFallback(props: NotificationsListFallbackProps) {
  return (
    <Switch fallback={<Message>You've cleared all your notifications!</Message>}>
      <Match when={props.isAuthError()}>
        <Message>
          Unable to fetch notifications.
          <br /> Ensure your PAT is correct and try again.
        </Message>
      </Match>
      <Match when={props.isInitialLoading()}>
        <NotificationsSection.Skeleton />;
      </Match>
      <Match when={props.searchQuery()}>
        <Message>
          No notifications found for <b>{props.searchQuery()}</b>
        </Message>
      </Match>
    </Switch>
  );
}

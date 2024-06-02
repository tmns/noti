import {
  GlobalStoreContext,
  GlobalStoreContextType,
  INITIAL_SEARCH_QUERY,
} from "@renderer/context/GlobalStoreContext";
import { Pulls, Notification } from "@renderer/githubTypes";
import { fetchAuthUser, fetchNotis, fetchPulls, octokit } from "@renderer/utils/client";
import { sendNotifications } from "@renderer/utils/notifications";
import {
  createResource,
  createEffect,
  onCleanup,
  createSignal,
  ParentProps,
  useContext,
  createMemo,
} from "solid-js";

export default function GlobalStoreProvider(props: ParentProps) {
  const [authUser, { refetch: refetchAuthUser }] = createResource(fetchAuthUser);
  const [fetchedNotis, { mutate, refetch: refetchNotis }] = createResource(authUser, fetchNotis);
  const [fetchedPulls, { refetch: refetchPulls }] = createResource(authUser, fetchPulls);
  const [readNotis, setReadNotis] = createSignal<Notification[]>([]);
  const notifiedIds = new Set<string>();
  const [isMutating, setIsMutating] = createSignal(false);
  const [searchQuery, setSearchQuery] = createSignal(INITIAL_SEARCH_QUERY());

  const normalizedSearchQuery = createMemo(() => searchQuery().toLowerCase().trim());

  const isInitialLoading = createMemo(() => fetchedNotis() === undefined);
  const isAuthError = createMemo(() => {
    const authUserResult = authUser();
    return !!authUserResult && "error" in authUserResult;
  });
  const isFetchingAuth = createMemo(() => authUser.loading);

  const displayedUnread = createMemo(() => {
    return (
      fetchedNotis()?.filter((n) =>
        n.subject.title.toLowerCase().startsWith(normalizedSearchQuery()),
      ) ?? []
    );
  });

  const displayedRead = createMemo(() => {
    return (
      readNotis()?.filter((n) =>
        n.subject.title.toLowerCase().startsWith(normalizedSearchQuery()),
      ) ?? []
    );
  });

  const displayedPulls = createMemo(() => {
    const filteredPulls: Pulls[] = [];

    fetchedPulls()?.forEach((p) => {
      const pulls = p.filter((d) => d.title.toLowerCase().startsWith(normalizedSearchQuery()));
      if (!pulls.length) return;

      filteredPulls.push(pulls);
    });

    return filteredPulls;
  });

  const isFetchingPulls = createMemo(() => fetchedPulls.loading);

  createEffect(() => {
    const notis: Notification[] = [];

    fetchedNotis()?.forEach((n) => {
      if (notifiedIds.has(n.id)) {
        return;
      }

      notifiedIds.add(n.id);
      notis.push(n);
    });

    sendNotifications(notis, fetchedNotis()?.length ?? 0);
  });

  createEffect(() => {
    const intervalId = setInterval(() => {
      if (isMutating()) {
        return;
      }

      refetchNotis();
    }, 1000 * 60);

    onCleanup(() => clearInterval(intervalId));
  });

  const globalStore: GlobalStoreContextType = [
    {
      displayedUnread,
      displayedRead,
      displayedPulls,
      searchQuery,
      normalizedSearchQuery,
      isFetchingPulls,
      isFetchingAuth,
      isInitialLoading,
      isAuthError,
    },
    {
      async markAsRead(n: Notification) {
        setIsMutating(true);

        mutate((curr) => {
          if (!curr) return;

          const updatedNotis = curr.filter((cN) => cN.id !== n.id);

          setReadNotis((cRN) => [...cRN, n]);

          notifiedIds.delete(n.id);

          return updatedNotis;
        });

        await octokit.rest.activity.markThreadAsRead({ thread_id: Number(n.id) });

        refetchNotis();

        setIsMutating(false);
      },
      async markAllAsRead() {
        setIsMutating(true);

        mutate((curr) => {
          if (!curr) return;

          setReadNotis((cRN) => [...cRN, ...curr]);

          return [];
        });

        await octokit.rest.activity.markNotificationsAsRead();

        refetchNotis();

        setIsMutating(false);
      },
      remove(n: Notification) {
        setReadNotis((curr) => curr.filter((rN) => rN.id !== n.id));
      },
      removeAll() {
        setReadNotis([]);
      },
      refetchPulls,
      refetchAuthUser,
      setSearchQuery,
    },
  ];

  return (
    <GlobalStoreContext.Provider value={globalStore}>{props.children}</GlobalStoreContext.Provider>
  );
}

export function useGlobalStore() {
  const context = useContext(GlobalStoreContext);

  if (!context) {
    throw new Error("useGlobalStore: cannot find a GlobalStoreContext");
  }

  return context;
}

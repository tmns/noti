import { Notification, Pulls } from "@renderer/githubTypes";
import { createContext } from "solid-js";

export type GlobalStoreContextType = [
  {
    displayedUnread: () => Notification[];
    displayedRead: () => Notification[];
    displayedPulls: () => Pulls[];
    searchQuery: () => string;
    normalizedSearchQuery: () => string;
    isFetchingPulls: () => boolean;
    isFetchingAuth: () => boolean;
    isInitialLoading: () => boolean;
    isAuthError: () => boolean;
  },
  {
    markAsRead: (notification: Notification) => void;
    markAllAsRead: () => void;
    remove: (notification: Notification) => void;
    removeAll: () => void;
    refetchPulls: () => void;
    refetchAuthUser: () => void;
    setSearchQuery: (query: string) => void;
  },
];

export const INITIAL_DISPLAYED_UNREAD: () => Notification[] = () => [];
export const INITIAL_DISPLAYED_READ: () => Notification[] = () => [];
export const INITIAL_DISPLAYED_PULLS: () => Pulls[] = () => [];
export const INITIAL_SEARCH_QUERY = () => "";
export const INITIAL_NORMALIZED_SEARCH_QUERY = () => "";
export const INITIAL_IS_FETCHING_PULLS = () => false;
export const INITIAL_IS_FETCHING_AUTH = () => false;
export const INITIAL_IS_INITIAL_LOADING = () => false;
export const INITIAL_IS_AUTH_ERROR = () => false;

const INITIAL_STORE_ACTIONS = {
  markAsRead: () => {},
  markAllAsRead: () => {},
  remove: () => {},
  removeAll: () => {},
  refetchPulls: () => {},
  refetchAuthUser: () => {},
  setSearchQuery: () => {},
};

export const GlobalStoreContext = createContext<GlobalStoreContextType>([
  {
    displayedUnread: INITIAL_DISPLAYED_UNREAD,
    displayedRead: INITIAL_DISPLAYED_READ,
    displayedPulls: INITIAL_DISPLAYED_PULLS,
    searchQuery: INITIAL_SEARCH_QUERY,
    normalizedSearchQuery: INITIAL_NORMALIZED_SEARCH_QUERY,
    isFetchingPulls: INITIAL_IS_FETCHING_PULLS,
    isFetchingAuth: INITIAL_IS_FETCHING_AUTH,
    isInitialLoading: INITIAL_IS_INITIAL_LOADING,
    isAuthError: INITIAL_IS_AUTH_ERROR,
  },
  INITIAL_STORE_ACTIONS,
]);

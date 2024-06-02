import { Pull, PullResponse, Notification } from "@renderer/githubTypes";

export interface NotificationAndPull {
  notification: Notification;
  pull?: Pull;
}

export type NotificationAndPullById = Map<string, NotificationAndPull>;

export type NotificationAndPromisePullById = Map<
  string,
  {
    notification: Notification;
    pull?: Promise<PullResponse> | Pull;
  }
>;

export interface NotificationAndPullByIdByReadStatus {
  read: NotificationAndPullById;
  unread: NotificationAndPullById;
}

export type ViewMode = "notis" | "pulls";

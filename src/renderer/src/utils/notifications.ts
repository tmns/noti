import { updateTrayTitle } from "@renderer/utils/comms";
import { isWindows } from "@renderer/utils/platform";
import { ipcRenderer } from "electron";
import type { Notification } from "@renderer/githubTypes";
import { openInBrowser } from "@renderer/utils/helpers";
import notificationSound from "../assets/sounds/bell.wav";

export function sendNotifications(notifications: Notification[], unreadCount: number) {
  updateTrayTitle(`${unreadCount ? unreadCount : ""}`);

  if (!notifications.length) return;

  raiseNativeNotification(notifications);
  raiseSoundNotification();
}

export function raiseNativeNotification(notifications: Notification[]) {
  let title: string;
  let body: string;

  if (notifications.length === 1) {
    const notification = notifications[0];
    title = `${isWindows() ? "" : "Noti - "}${notification.repository.full_name}`;
    body = notification.subject.title;
  } else {
    title = "Noti";
    body = `You have ${notifications.length} notifications.`;
  }

  const nativeNotification = new Notification(title, {
    body,
    silent: true,
  });

  nativeNotification.onclick = () => {
    if (notifications.length === 1) {
      ipcRenderer.send("hide-window");
      openInBrowser(notifications[0]);
    } else {
      ipcRenderer.send("reopen-window");
    }
  };

  return nativeNotification;
}

export function raiseSoundNotification() {
  const audio = new Audio(notificationSound);
  audio.volume = 0.2;
  audio.play();
}
